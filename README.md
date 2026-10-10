# Copy FxTwitter Link

A tiny Chrome extension (Manifest V3) that adds a button to every tweet on x.com / twitter.com. Click it to copy the tweet's link as an [fxtwitter](https://github.com/FixTweet/FxTwitter) URL, so it embeds properly when pasted into Discord, Slack, Telegram and the like.

```
https://x.com/user/status/123  ->  https://fxtwitter.com/user/status/123
```

The button is a small link icon placed right after the share icon, in the timeline and on single-tweet pages. It turns into a green check for a moment after copying.

## Install

Works in Chrome and other Chromium browsers (Brave, Edge, Helium, ...).

1. Clone or download this repo.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Reload any open x.com tabs.

## How it works

- `content.js` watches for tweets (`article[data-testid="tweet"]`) and injects a button beside the share button.
- The tweet's permalink is read from its timestamp link, so quoted tweets don't get picked up by mistake.
- It copies with `navigator.clipboard.writeText` from the click handler. No permissions, no background script, no network requests.

X changes its markup now and then. If the button stops appearing, the selectors in `content.js` are the first place to look.

## License

MIT
