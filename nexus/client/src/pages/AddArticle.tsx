import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
interface FileItem {
  file: File;
  preview: string;
}

type JobStepStatus = 'pending' | 'in-progress' | 'done' | 'failed';
interface JobStep {
  name: string;
  status: JobStepStatus;
  message?: string;
}

const defaultSteps: JobStep[] = [
  { name: 'upload_ipfs', status: 'pending', message: 'Waiting to upload files to IPFS' },
  { name: 'llm_analysis', status: 'pending', message: 'Waiting for LLM analysis' },
  { name: 'aptos_transaction', status: 'pending', message: 'Waiting for Aptos transaction' },
  { name: 'save_database', status: 'pending', message: 'Waiting to save to database' },
];

function App() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<FileItem | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<'pending' | 'in-progress' | 'completed' | 'failed'>('pending');
  const [jobSteps, setJobSteps] = useState<JobStep[]>(defaultSteps);
  const [jobError, setJobError] = useState<string>('');
  const [scrollingInProgress, setScrollingInProgress] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail({
          file,
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    let polling: ReturnType<typeof setInterval> | null = null;

    async function fetchJob() {
      if (!jobId) return;

      try {
        const res = await axios.get(`http://localhost:8000/jobs/${jobId}`);
        const job = res.data.job;

        if (!job) {
          return;
        }

        setJobStatus(job.status);
        setJobSteps(
          (job.steps || defaultSteps).map((step: JobStep) => ({
            name: step.name,
            status: step.status,
            message:
              step.message ||
              (step.status === 'pending'
                ? `Waiting ${step.name.replace(/_/g, ' ')}`
                : step.status === 'in-progress'
                ? `Processing ${step.name.replace(/_/g, ' ')}`
                : step.status),
          }))
        );

        if (job.status === 'failed') {
          const failedStep = job.steps?.find((s: JobStep) => s.status === 'failed');
          if (failedStep) {
            toast.error(
              `Failed at ${failedStep.name.replace(/_/g, ' ')}: ${failedStep.message || 'Unknown error'}`
            );
          }
        }

        if (job.status === 'completed') {
          toast.success('News creation completed successfully.');
          setIsSubmitting(false);
          setJobId(null);
          setTimeout(() => navigate('/', { replace: true }), 1200);
          return;
        }

        if (job.status === 'failed') {
          setJobError(job.error || 'Job failed');
          setIsSubmitting(false);
          toast.error(job.error || 'Job failed');
          return;
        }
      } catch (error) {
        console.error('Job polling failed', error);
      }
    }

    if (jobId && jobStatus !== 'completed' && jobStatus !== 'failed') {
      fetchJob();
      polling = setInterval(fetchJob, 1500);
    }

    return () => {
      if (polling) {
        clearInterval(polling);
      }
    };
  }, [jobId, jobStatus, navigate]);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    const topElement = document.getElementById('addarticle-top');
    if (topElement) {
      topElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!thumbnail) {
      toast.error("Thumbnail is required");
      return;
    }

    setIsSubmitting(true);
    setJobId(null);
    setJobError('');
    setJobStatus('in-progress');
    setJobSteps([
      { name: 'upload_ipfs', status: 'in-progress', message: 'Uploading files to IPFS...' },
      { name: 'llm_analysis', status: 'pending' },
      { name: 'aptos_transaction', status: 'pending' },
      { name: 'save_database', status: 'pending' },
    ]);

    setScrollingInProgress(true);
    scrollToTop();

    // remove visual pulse after scroll finished for smooth control
    setTimeout(() => setScrollingInProgress(false), 700);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("thumbnail", thumbnail.file);

      files.forEach((item) => {
        formData.append("files", item.file);
      });

      const res = await axios.post("http://localhost:8000/news", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const returnedJob = res.data?.job;
      const returnedJobId = res.data?.jobId;
      if (!returnedJobId) {
        throw new Error('Failed to get job ID');
      }

      setJobId(returnedJobId);
      setJobStatus(returnedJob?.status || 'in-progress');
      toast.success(`News submission started. Job ID: ${returnedJobId}`);

      // keep the form values until job concludes
      setTitle('');
      setDescription('');
      setThumbnail(null);
      setFiles([]);

      if (returnedJob?.steps) {
        setJobSteps(returnedJob.steps);
      } else {
        setJobSteps([
          { name: 'upload_ipfs', status: 'done', message: 'Uploaded files to IPFS' },
          { name: 'llm_analysis', status: 'in-progress', message: 'Calling LLM for credibility scoring' },
          { name: 'aptos_transaction', status: 'pending', message: 'Waiting for Aptos transaction' },
          { name: 'save_database', status: 'pending', message: 'Waiting for save to database' },
        ]);
      }

    } catch (err: unknown) {
      console.error("Upload error:", err);

      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as any;
        if (errorData.job) {
          const shortMessage = (errorData.message ?? 'Job failed').toString().split('\n')[0].slice(0, 140);
          setJobId(errorData.jobId ?? errorData.job._id ?? null);
          setJobStatus(errorData.job.status ?? 'failed');
          setJobSteps(errorData.job.steps ?? defaultSteps);
          setJobError(errorData.job.error ?? (errorData.message ?? 'Job failed'));
          // no toast error for clean UX; step card shows status
          setIsSubmitting(false);
          return;
        }
      }

      const message =
        err && typeof err === 'object' && 'message' in err
          ? (err as Error).message
          : 'Something went wrong';

      toast.error(`Upload failed: ${message}`);
      setJobStatus('failed');
      setJobSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.status === 'in-progress'
            ? { ...step, status: 'failed', message: message }
            : step
        )
      );
      setIsSubmitting(false);
    }
  };


  return (
    <div id="addarticle-top" className="min-h-screen bg-navy/90 backdrop-blur-md py-3 shadow-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-gray-200 p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-8 text-gray-900">Submit News</h1>

          <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md text-black h-10 px-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block text-black p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail
            </label>
            {!thumbnail ?
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-50">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Upload thumbnail</span>
                  <input type="file" className="hidden" onChange={handleThumbnailChange} accept="image/*" />
                </label>
              </div>
              :
              <div className="mt-2 w-max relative">
                <img src={thumbnail.preview} alt="Thumbnail preview" className="h-32 w-60 object-cover rounded" />
                <button type="button" onClick={() => setThumbnail(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
            }
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-50">
                <Upload className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Upload files</span>
                <input type="file" className="hidden" onChange={handleFilesChange} multiple />
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    {
                      file.file.type.startsWith("image/") ? <>
                        <img src={file.preview} alt="" className='w-full h-full' />
                      </> :
                        <div className="p-4 border rounded bg-gray-50">
                          <Image className="w-full h-full text-red-600" />
                          <p className="text-sm text-red-600 truncate">{file.file.name}</p>
                        </div>
                    }
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-2 rounded-md ${isSubmitting ? 'bg-blue-200 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-500'}`}>
              {isSubmitting ? 'Submitting…' : 'Submit News'}
            </button>
          </div>
        </form>
      </div>

      <aside className={`hidden lg:block sticky top-24 h-fit transition-all duration-500 ${scrollingInProgress ? 'scale-105 opacity-100' : 'scale-100 opacity-90'}`}>
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">

    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
      Processing Pipeline
    </h2>

    <p className="text-xs text-gray-500 mb-4">
      {jobId ? `Job ID: ${jobId}` : "Progress of your news....."}
    </p>

    {/* Progress Bar */}
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
        style={{
          width: `${
            (jobSteps.filter(s => s.status === "done").length /
              jobSteps.length) *
            100
          }%`
        }}
      />
    </div>

    <ul className="space-y-5 relative">

      {jobSteps.map((step, index) => {
        const friendlyName = step.name.replace(/_/g, " ");
        const defaultMessage =
          step.status === "pending"
            ? `Waiting for ${friendlyName}`
            : step.status === "in-progress"
            ? `Processing ${friendlyName}`
            : step.status === "done"
            ? `${friendlyName} done`
            : `${friendlyName} ${step.status}`;

        return (
          <li key={step.name} className="flex gap-4 items-start">

            {/* Animated Dot */}
            <span
              className={`mt-1 h-4 w-4 rounded-full flex-shrink-0
              ${
                step.status === "done"
                  ? "bg-green-500"
                  : step.status === "in-progress"
                  ? "bg-blue-500 animate-pulse"
                  : step.status === "failed"
                  ? "bg-red-500"
                  : "bg-gray-300"
              }`}
            />

            <div className="flex flex-col">

              <p className="text-sm font-semibold capitalize">{friendlyName}</p>

              <p className={`text-xs ${step.status === "failed" ? "text-red-500" : "text-gray-500"}`}>
                {step.message || defaultMessage}
              </p>

            </div>
          </li>
        );
      })}
    </ul>

    {jobStatus === "failed" && (
      <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
        ⚠ {jobError || "Check console or API error message."}
      </div>
    )}

  </div>
</aside>
    </div>
  </div>
  );
}

export default App;