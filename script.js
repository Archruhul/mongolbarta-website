// মঙ্গল বার্তা — feed loader + language toggle

const MONTHS_BN = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্ট", "অক্টো", "নভে", "ডিসে"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate();
  return {
    bn: `${day} ${MONTHS_BN[d.getMonth()]}`,
    en: `${MONTHS_EN[d.getMonth()]} ${day}`
  };
}

let ALL_POSTS = [];
let ACTIVE_CATEGORY = "all";

function renderPosts(posts) {
  const feed = document.getElementById("feed");

  const filtered = ACTIVE_CATEGORY === "all"
    ? posts
    : posts.filter(p => p.category_en === ACTIVE_CATEGORY);

  if (filtered.length === 0) {
    feed.innerHTML = `
      <p class="feed-empty">
        <span class="bn">এই বিভাগে এখনো কোনো খবর নেই।</span>
        <span class="en">No stories in this category yet.</span>
      </p>`;
    return;
  }

  feed.innerHTML = filtered.map(p => {
    const dt = formatDate(p.date);
    return `
      <article class="post">
        <div class="post-date"><span class="bn">${dt.bn}</span><span class="en">${dt.en}</span></div>
        <span class="post-category"><span class="bn">${p.category_bn}</span><span class="en">${p.category_en}</span></span>
        <h2><span class="bn">${p.title_bn}</span><span class="en">${p.title_en}</span></h2>
        <p class="excerpt"><span class="bn">${p.excerpt_bn}</span><span class="en">${p.excerpt_en}</span></p>
        <a class="source" href="${p.source_url}" target="_blank" rel="noopener">
          <span class="bn">সূত্র: ${p.source_label}</span><span class="en">Source: ${p.source_label}</span>
        </a>
      </article>
    `;
  }).join("");
}

function setCategory(category) {
  ACTIVE_CATEGORY = category;
  document.querySelectorAll(".pillar-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === category);
  });
  renderPosts(ALL_POSTS);
}

function setLang(lang) {
  document.body.setAttribute("data-lang", lang);
  document.documentElement.lang = lang === "bn" ? "bn" : "en";
  document.querySelectorAll(".lang-toggle button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  localStorage.setItem("mb-lang", lang);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("mb-lang") || "bn";
  setLang(savedLang);

  document.querySelectorAll(".lang-toggle button").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  document.querySelectorAll(".pillar-chip").forEach(chip => {
    chip.addEventListener("click", () => setCategory(chip.dataset.category));
  });

  fetch("posts.json")
    .then(res => res.json())
    .then(posts => {
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      ALL_POSTS = posts;
      renderPosts(ALL_POSTS);
    })
    .catch(() => {
      document.getElementById("feed").innerHTML =
        '<p style="text-align:center;color:#55524A">Could not load stories. Check posts.json.</p>';
    });
});
