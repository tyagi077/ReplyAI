
const aiReplyCache = new Map();
function closeAIReplyPanel() {

  const panel = document.querySelector("#ai-reply-panel");

  if (panel) {
    panel.remove();
  }

}function openReplyBox(tweet){

  const replyBtn = tweet.querySelector('[data-testid="reply"]');

  if(replyBtn){
    replyBtn.click();
  }

}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const panel = document.querySelector("#ai-reply-panel");
    if (panel) panel.remove();
  }
});
document.addEventListener("click", (e) => {

  const sendBtn =
    e.target.closest('[data-testid="tweetButtonInline"]') ||
    e.target.closest('[data-testid="tweetButton"]');

  if (sendBtn) {

    setTimeout(() => {
      const panel = document.querySelector("#ai-reply-panel");
      if (panel) panel.remove();
    }, 600);

  }

});
window.addEventListener("scroll", () => {
  closeAIReplyPanel();
});


function showReplyPanel(repliesText) {

  const oldPanel = document.querySelector("#ai-reply-panel");
  if (oldPanel) oldPanel.remove();

  const panel = document.createElement("div");
  panel.id = "ai-reply-panel";

  panel.style.position = "fixed";
  panel.style.right = "3px";
  panel.style.top = "120px";
  panel.style.width = "340px";
  panel.style.background = "#0f1419";
  panel.style.color = "white";
  panel.style.borderRadius = "12px";
  panel.style.padding = "16px";
  panel.style.zIndex = "999999";
  panel.style.boxShadow = "0 10px 40px rgba(0,0,0,0.5)";
  panel.style.fontFamily = "system-ui";

  const title = document.createElement("div");
  title.innerText = "🤖 AI Replies";
  title.style.fontSize = "16px";
  title.style.fontWeight = "600";
  title.style.marginBottom = "12px";

  panel.appendChild(title);

  const replies = repliesText.split("\n").filter(r => r.trim());

  replies.forEach(reply => {

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.justifyContent = "space-between";
    row.style.background = "#1a1f24";
    row.style.padding = "10px";
    row.style.borderRadius = "8px";
    row.style.marginBottom = "8px";

    const text = document.createElement("div");
    text.innerText = reply;
    text.style.fontSize = "13px";
    text.style.lineHeight = "1.4";
    text.style.maxWidth = "230px";

    const copyBtn = document.createElement("button");
    copyBtn.innerText = "Copy";

    copyBtn.style.background = "#1DA1F2";
    copyBtn.style.color = "white";
    copyBtn.style.border = "none";
    copyBtn.style.borderRadius = "6px";
    copyBtn.style.padding = "4px 8px";
    copyBtn.style.cursor = "pointer";
    copyBtn.style.fontSize = "12px";

    copyBtn.onclick = () => {
     navigator.clipboard.writeText(reply)
      copyBtn.innerText = "Copied";
      setTimeout(() => copyBtn.innerText = "Copy", 1000);
    };

    row.appendChild(text);
    row.appendChild(copyBtn);

    panel.appendChild(row);

  });

  const closeBtn = document.createElement("div");
  closeBtn.innerText = "✕";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "12px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "14px";

  closeBtn.onclick = () => panel.remove();

  panel.appendChild(closeBtn);

  document.body.appendChild(panel);

}
async function generateReplies(tweetText, images = []) {

  try {

    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tweetText,
        images
      })
    });

    if (!res.ok) {
      throw new Error("Backend request failed");
    }

    const data = await res.json();

    if (!data?.choices?.[0]?.message?.content) {
      throw new Error("Invalid AI response");
    }

    return data.choices[0].message.content;

  } catch (err) {

    console.error("AI error:", err);

    return "AI could not generate replies right now.";

  }

}
function addAIButton(tweet) {

  if (tweet.querySelector(".ai-reply-btn")) return;

  const actionBar = tweet.querySelector('div[role="group"]');
  if (!actionBar) return;

  const button = document.createElement("div");
  button.className = "ai-reply-btn";

  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.cursor = "pointer";
  button.style.padding = "6px 10px";
  button.style.borderRadius = "9999px";
  button.style.marginLeft = "8px";
  button.style.transition = "background 0.2s";

  button.innerHTML = `
    <span style="font-size:16px;margin-right:4px;">🤖</span>
    <span style="font-size:13px;">AI</span>
  `;

  button.onmouseenter = () => button.style.background = "rgba(29,155,240,0.1)";
  button.onmouseleave = () => button.style.background = "transparent";

  button.onclick = async (e) => {

    e.stopPropagation();

    openReplyBox(tweet);

    const tweetText = tweet.querySelector('[data-testid="tweetText"]')?.innerText;

    if (!tweetText) return;

    button.innerText = "Generating...";

    try {

     let replies;

if (aiReplyCache.has(tweetText)) {
  replies = aiReplyCache.get(tweetText);
} else {
  replies = await generateReplies(tweetText);
}

      showReplyPanel(replies);

    } catch (err) {

      console.error(err);
      alert("AI generation failed");

    }

    button.innerHTML = `
      <span style="font-size:16px;margin-right:4px;">🤖</span>
      <span style="font-size:13px;">AI</span>
    `;

  };

  actionBar.appendChild(button);
 let hoverTimer;

tweet.addEventListener("mouseenter", () => {

  hoverTimer = setTimeout(async () => {

    const tweetText = tweet.querySelector('[data-testid="tweetText"]')?.innerText;

    if (!tweetText) return;

    if (aiReplyCache.has(tweetText)) return;

    try {

      const replies = await generateReplies(tweetText);

      aiReplyCache.set(tweetText, replies);

      console.log("Prefetched AI replies");

    } catch (err) {
      console.error(err);
    }

  }, 700);

});

tweet.addEventListener("mouseleave", () => {
  clearTimeout(hoverTimer);
});

}

function scanTweets() {

  const tweets = document.querySelectorAll("article");

  tweets.forEach(tweet => {
    addAIButton(tweet);
  });

}

const observer = new MutationObserver(() => {
  scanTweets();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

scanTweets();