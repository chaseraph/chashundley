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
          let embedHTML = '';
  
          const embed = post?.embed;
          if (embed?.$type === 'app.bsky.embed.images' && embed.images?.length > 0) {
            embed.images.forEach(img => {
              embedHTML += `<img src="${img.thumb}" alt="${img.alt || ''}" style="max-width:100%; margin-top:0.5rem;" />`;
            });
          }
  
          const div = document.createElement('div');
          div.className = 'post';
          div.innerHTML = `
            <p>${text}</p>
            ${embedHTML}
            <small><a href="https://bsky.app/profile/chashundley.bsky.social/post/${item.post?.cid}" target="_blank">View on Bluesky →</a></small>
          `;
          feedEl.appendChild(div);
        });
  
    } catch (e) {
      feedEl.textContent = 'Could not load Bluesky feed.';
      console.error(e);
    }
  }  
  

document.addEventListener('DOMContentLoaded', loadBluesky);
