// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);

// Handle toggle click
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    console.log("Theme toggle clicked!");
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// Load Bluesky feed via Cloudflare Worker proxy
async function loadBluesky() {
  const feedEl = document.getElementById('bluesky-feed');
  const proxyUrl = 'https://bsky-feed-proxy.chashundley.workers.dev/?handle=chashundley.bsky.social&limit=10';

  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();

    feedEl.innerHTML = '';

    data.feed
      .filter(item => !item.post?.record?.reply) // Only top-level posts
      .forEach(item => {
        const post = item.post;
        const text = post?.record?.text || "[no content]";
        const linkedText = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

        let embedHTML = '';
        const embed = post?.embed;

        // Image support
        if (embed?.$type === 'app.bsky.embed.images' && embed.images?.length > 0) {
          embed.images.forEach(img => {
            embedHTML += `<img src="${img.thumb}" alt="${img.alt || ''}" style="max-width:100%; margin-top:0.5rem;" />`;
          });
        }

        // External link preview support
        if (embed?.$type === 'app.bsky.embed.external' && embed.external) {
          const ext = embed.external;
          embedHTML += `
            <div class="bsky-preview" style="border:1px solid #ccc; padding:0.75rem; margin-top:0.5rem; background:#f9f9f9; border-radius:8px;">
              <a href="${ext.uri}" target="_blank" style="font-weight:bold; color:var(--link); text-decoration:none;">${ext.title}</a>
              <p style="margin:0.25rem 0 0.5rem;">${ext.description || ''}</p>
              ${ext.thumb ? `<img src="${ext.thumb}" alt="${ext.title}" style="max-width:100%; border-radius:4px;" />` : ''}
            </div>
          `;
        }

        // Extract post rkey from URI for a valid link
        const postUri = post?.uri || "";
        const postRkey = postUri.split("/").pop();

        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
          <p>${linkedText}</p>
          ${embedHTML}
          <small><a href="https://bsky.app/profile/chashundley.bsky.social/post/${postRkey}" target="_blank">View on Bluesky →</a></small>
        `;
        feedEl.appendChild(div);
      });

  } catch (e) {
    feedEl.textContent = 'Could not load Bluesky feed.';
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', loadBluesky);
