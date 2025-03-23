async function loadBluesky() {
    const feedEl = document.getElementById('bluesky-feed');
    const proxyUrl = 'https://bsky-feed-proxy.chashundley.workers.dev/?handle=chashundley.bsky.social&limit=5';
  
    try {
      const res = await fetch(proxyUrl);
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
  