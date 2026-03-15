import { Request, Response } from "express";
import { PinataSDK } from "pinata";
import { File } from "node:buffer";
import { catchAsync } from "../utils/catchAsyncHandler.js";
import { AppError } from "../utils/appErrors.js";
import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { News } from "../model/news.model.js";
import { Job } from "../model/job.model.js";
import mongoose from "mongoose";

const MODULE_ADDRESS = process.env.MODULE_ADDRESS ?? "";
const MODULE_NAME = "news";
const pinataJwt = process.env.PINATA_JWT ?? "";
const gatewayUrl = process.env.PINATA_GATEWAY_URL ?? "";

const pinata = new PinataSDK({
    pinataJwt,
    pinataGateway: gatewayUrl,
});

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

// Step utility for job progress
async function updateJobStep(job: any, stepName: string, status: "pending" | "in-progress" | "done" | "failed", message = "") {
    const step = job.steps.find((s: any) => s.name === stepName);
    if (step) {
        step.status = status;
        step.message = message;
    } else {
        job.steps.push({ name: stepName, status, message });
    }

    if (job.steps.every((s: any) => s.status === "done")) {
        job.status = "completed";
    } else if (job.steps.some((s: any) => s.status === "failed")) {
        job.status = "failed";
    } else {
        job.status = "in-progress";
    }

    await job.save();
}

export const createNews = catchAsync(async (req: Request, res: Response) => {
    const files = req.files as { thumbnail?: Express.Multer.File[]; files?: Express.Multer.File[] };
    const newsData = req.body;

    const job = new Job({
        type: "createNews",
        status: "pending",
        steps: [
            { name: "upload_ipfs", status: "pending" },
            { name: "llm_analysis", status: "pending" },
            { name: "aptos_transaction", status: "pending" },
            { name: "save_database", status: "pending" },
        ],
    });

    await job.save();

    try {
        if (!pinataJwt || !gatewayUrl) {
            await updateJobStep(job, "upload_ipfs", "failed", "Pinata credentials not set");
            throw new AppError("Pinata credentials not set", 500);
        }

        await updateJobStep(job, "upload_ipfs", "in-progress", "Uploading files to IPFS");

        // IPFS Handling
        const mainFileCids: string[] = [];
        if (files.files && files.files.length > 0) {
            for (const file of files.files) {
                const result = await pinata.upload.public.file(
                    new File([file.buffer], file.originalname, { type: file.mimetype }) as any
                );
                mainFileCids.push(result.cid);
            }
        }

        let thumbnailCid: string | null = null;
        if (files.thumbnail && files.thumbnail.length > 0) {
            const thumbFile = files.thumbnail[0];
            const thumbResult = await pinata.upload.public.file(
                new File([thumbFile.buffer], thumbFile.originalname, { type: thumbFile.mimetype }) as any
            );
            thumbnailCid = thumbResult.cid;
        }

        newsData.files = mainFileCids.map((cid) => `${gatewayUrl}/ipfs/${cid}`);
        newsData.thumbnail = thumbnailCid ? `${gatewayUrl}/ipfs/${thumbnailCid}` : null;

        await updateJobStep(job, "upload_ipfs", "done", "Uploaded files to IPFS");

        // LLM handling
        await updateJobStep(job, "llm_analysis", "in-progress", "Calling LLM for credibility scoring");

        const formData = new FormData();
        formData.append("title", newsData.title);
        formData.append("description", newsData.description);

        // Add thumbnail
        if (files.thumbnail && files.thumbnail.length > 0) {
            const thumbFile = files.thumbnail[0];
            formData.append("thumbnail", new File([thumbFile.buffer], thumbFile.originalname, { type: thumbFile.mimetype }) as any);
        }

        // Add other files
        if (files.files && Array.isArray(files.files) && files.files.length > 0) {
            files.files.forEach((file, index) => {
                formData.append(`files[${index}]`, new File([file.buffer], file.originalname, { type: file.mimetype }) as any);
            });
        }

        const response = await fetch("http://localhost:8001/", {
            method: "POST",
            body: formData,
        });

        const llmResponse = await response.json();

        if (llmResponse.status === "false") {
            const rawError = llmResponse.error || "Failed to get insights";

            let statusCode = 'unknown';
            let displayError = 'Error occurred';

            if (typeof rawError === 'string') {
                displayError = rawError;
            } else if (typeof rawError === 'object' && rawError !== null) {
                if (rawError.error && typeof rawError.error === 'object') {
                    const errorObj = rawError.error;
                    statusCode = (errorObj.code ?? errorObj.status ?? 'unknown').toString();
                    displayError = `Status ${statusCode}`;
                } else if (rawError.message) {
                    displayError = rawError.message;
                }
            }

            if (!displayError || displayError.length === 0) {
                displayError = 'Error from LLM';
            }

            await updateJobStep(job, "llm_analysis", "failed", displayError);
            job.status = "failed";
            job.error = typeof rawError === 'string' ? rawError : JSON.stringify(rawError);
            await job.save();

            return res.status(400).json({
                success: false,
                message: displayError,
                jobId: job._id,
                failedStep: "llm_analysis",
                job,
            });
        }

        await updateJobStep(job, "llm_analysis", "done", "LLM analysis completed");

        // Aptos Handling
        let txnHash: string | null = null;
        await updateJobStep(job, "aptos_transaction", "in-progress", "Sending Aptos transaction");

        if (!process.env.APTOS_PRIVATE_KEY || !MODULE_ADDRESS) {
            await updateJobStep(job, "aptos_transaction", "failed", "Aptos credentials not set");
        } else {
            try {
                const privateKeyHex = process.env.APTOS_PRIVATE_KEY ?? "";
                const privateKeyBytes = Buffer.from(privateKeyHex.replace(/^0x/, ""), "hex");
                const privateKey = new Ed25519PrivateKey(privateKeyBytes);
                const account = Account.fromPrivateKey({ privateKey });

                const rawTx = await aptos.transaction.build.simple({
                    sender: account.accountAddress,
                    data: {
                        function: `${MODULE_ADDRESS}::${MODULE_NAME}::create_news`,
                        typeArguments: [],
                        functionArguments: [
                            newsData.title,
                            newsData.description,
                            newsData.files ?? [],
                            newsData.thumbnail ?? "",
                        ],
                    },
                });

                const pendingTransaction = await aptos.signAndSubmitTransaction({
                    signer: account,
                    transaction: rawTx,
                });

                txnHash = pendingTransaction.hash;

                const result = await aptos.waitForTransaction({ transactionHash: txnHash });

                if (!result.success) {
                    txnHash = null;
                    await updateJobStep(job, "aptos_transaction", "failed", `Aptos transaction failed: ${result.vm_status}`);
                    console.warn("Aptos transaction failed:", result.vm_status);
                } else {
                    await updateJobStep(job, "aptos_transaction", "done", "Aptos transaction confirmed");
                }
            } catch (error) {
                const message = (error as Error).message || "Aptos transaction error";
                await updateJobStep(job, "aptos_transaction", "failed", message);
                console.warn("Aptos transaction skipped:", message);
            }
        }

        // MongoDB handling
        await updateJobStep(job, "save_database", "in-progress", "Saving news record to MongoDB");

        const news = new News({ ...newsData, ...llmResponse, txnHash });
        await news.save();

        await updateJobStep(job, "save_database", "done", "News saved in database");

        job.status = "completed";
        await job.save();

        res.status(201).json({
            success: true,
            message: "News created successfully",
            news,
            txnhash: txnHash
                ? `https://explorer.aptoslabs.com/txn/${txnHash}/payload?network=testnet`
                : null,
            jobId: job._id,
            jobStatusUrl: `/jobs/${job._id}`,
            job,
        });
    } catch (error) {
        job.status = "failed";
        job.error = (error as Error).message;
        await job.save();

        if (!res.headersSent) {
            return res.status((error as any)?.statusCode || 500).json({
                success: false,
                message: (error as Error).message,
                jobId: job._id,
                failedStep: job.steps?.find((s: any) => s.status === 'failed')?.name || 'unknown',
                job,
            });
        }

        throw error;
    }
});


export const getAllNews = catchAsync(async (_req: Request, res: Response) => {
    
    // For future use case - Direct fetching from blockchain
    
    // const collection = await aptos.getAccountResource({
    //     accountAddress: MODULE_ADDRESS,
    //     resourceType: `${MODULE_ADDRESS}::${MODULE_NAME}::NewsCollection`,
    // });

    // Return newest news first (latest created at the top)
    const data = await News.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, newsItems: data });
});

export const getNews = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;

    const data = await News.findOne({_id:id});

    res.status(200).json({ success: true, news: data });
});

