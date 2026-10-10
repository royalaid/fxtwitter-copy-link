const LINK_ICON =
  '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>';
const CHECK_ICON = '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';

function getFxUrl(article) {
  // The timestamp link is the canonical permalink of the tweet itself
  // (quoted tweets come later in the DOM, so the first match is the main one).
  const link = article.querySelector('a[href*="/status/"] time')?.closest("a");
  if (!link) return null;
  const match = new URL(link.href).pathname.match(/^\/([^/]+)\/status\/(\d+)/);
  return match ? `https://fxtwitter.com/${match[1]}/status/${match[2]}` : null;
}

function flash(btn) {
  btn.classList.add("fxt-copied");
  btn.innerHTML = CHECK_ICON;
  setTimeout(() => {
    btn.classList.remove("fxt-copied");
    btn.innerHTML = LINK_ICON;
  }, 1200);
}

function addButton(article) {
  if (article.querySelector(".fxt-copy-btn")) return;
  // Anchor on the reply button so we get the action bar, not some other role="group" (e.g. media controls).
  const bar = article.querySelector('[data-testid="reply"]')?.closest('[role="group"]');
  if (!bar) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "fxt-copy-btn";
  btn.title = "Copy fxtwitter link";
  btn.innerHTML = LINK_ICON;
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getFxUrl(article);
    if (!url) return;
    await navigator.clipboard.writeText(url);
    flash(btn);
  });

  // The share button lives in a flex row inside a grid cell of the bar. Putting ours in
  // that same row keeps it beside the share icon (feed and detail views) at any bar height.
  const share = bar.querySelector('[aria-label="Share post"]');
  if (share) {
    share.after(btn);
  } else {
    bar.appendChild(btn);
  }
}

function scan() {
  document.querySelectorAll('article[data-testid="tweet"]').forEach(addButton);
}

let scheduled = false;
new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;
  // setTimeout rather than requestAnimationFrame: rAF never fires in background tabs.
  setTimeout(() => {
    scheduled = false;
    scan();
  }, 50);
}).observe(document.body, { childList: true, subtree: true });

scan();
