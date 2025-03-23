// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);

// Handle toggle click
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// Load Bluesky feed (replace YOUR_HANDLE with actual handle if needed)
async function loadBluesky() {
  const feedEl = document.getElementById('bluesky-feed');
  const url = 'https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed?actor=chashundley.bsky.social&limit=5';
  try {
    const res = await fetch(url);
    const data = await res.json();
    feedEl.innerHTML = '';
    data.feed.forEach(item => {
      const post = item.post || item.record;
      const div = document.createElement('div');
      div.className = 'post';
      div.innerHTML = `
        <p>${post.text}</p>
        <small><a href="https://bsky.app/profile/chashundley.bsky.social/post/${item.cid}" target="_blank">View on Bluesky →</a></small>
      `;
      feedEl.appendChild(div);
    });
  } catch (e) {
    feedEl.textContent = 'Could not load Bluesky feed.';
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', loadBluesky);