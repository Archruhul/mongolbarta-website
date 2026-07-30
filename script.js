// মঙ্গল বার্তা — shared logic for homepage feed + detail page

const MONTHS_BN = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্ট", "অক্টো", "নভে", "ডিসে"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The 11 official content pillars, in their fixed display order, with
// each pillar's real brand accent color. Any category_key not found
// here (a future addition) falls back to the neutral palette below.
const PILLARS = [
  { key: "sobujbarta",      bn: "সবুজবার্তা",    en: "Earth Wins",      bg: "#E7EFE4", fg: "#1B4332" },
  { key: "sahoshbarta",     bn: "সাহসবার্তা",    en: "Acts of Courage", bg: "#F7E1D8", fg: "#B4502A" },
  { key: "abiskarbarta",    bn: "আবিষ্কারবার্তা", en: "Discovery",       bg: "#DCEAF2", fg: "#2C5F7C" },
  { key: "nayabarta",       bn: "ন্যায়বার্তা",    en: "Justice Wins",    bg: "#E7E1F2", fg: "#5B3A8C" },
  { key: "joybarta",        bn: "জয়বার্তা",      en: "Game Wins",       bg: "#FBEFD0", fg: "#96741A" },
  { key: "somriddhibarta",  bn: "সমৃদ্ধিবার্তা",  en: "Growth Wins",     bg: "#DCF0EC", fg: "#1F6F63" },
  { key: "surbarta",        bn: "সুরবার্তা",      en: "Culture Corner",  bg: "#FBE1E4", fg: "#B23A55" },
  { key: "sushtabarta",     bn: "সুস্থবার্তা",    en: "Health Wins",     bg: "#E1F5EC", fg: "#1F7A56" },
  { key: "shikkhabarta",    bn: "শিক্ষাবার্তা",   en: "Learning Wins",   bg: "#FAF0CE", fg: "#8A6D12" },
  { key: "hridoybarta",     bn: "হৃদয়বার্তা",     en: "Small Kindness",  bg: "#F7E3E7", fg: "#A64960" },
  { key: "jonobarta",       bn: "জনবার্তা",       en: "Civic Wins",      bg: "#E3E7F2", fg: "#3E4F7A" }
];

const FALLBACK_PALETTE = [
  { bg: "#E7EFE4", fg: "#1B4332" },
  { bg: "#DCEAF2", fg: "#2C5F7C" },
  { bg: "#F5E3CC", fg: "#B0651F" }
];

function colorForCategory(key) {
  const known = PILLARS.find(p => p.key === key);
  if (known) return { bg: known.bg, fg: known.fg };
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate();
  return {
    bn: `${day} ${MONTHS_BN[d.getMonth()]}`,
    en: `${MONTHS_EN[d.getMonth()]} ${day}`
  };
}

function setLang(lang) {
  document.body.setAttribute("data-lang", lang);
  document.documentElement.lang = lang === "bn" ? "bn" : "en";
  document.querySelectorAll(".lang-toggle button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  localStorage.setItem("mb-lang", lang);
}

function initLangToggle() {
  const savedLang = localStorage.getItem("mb-lang") || "bn";
  setLang(savedLang);
  document.querySelectorAll(".lang-toggle button").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

/* ---------------- Homepage feed ---------------- */

let ALL_POSTS = [];
let ACTIVE_CATEGORY = "all";

function buildPillars(posts) {
  const nav = document.getElementById("pillars");
  if (!nav) return;

  // Start with the 11 official pillars, always shown regardless of
  // whether a post exists yet in that category.
  const list = PILLARS.map(p => ({ key: p.key, bn: p.bn, en: p.en }));

  // Add any category found in the data that isn't one of the 11
  // (future-proofing for a new pillar added later).
  posts.forEach(p => {
    if (!list.some(l => l.key === p.category_key)) {
      list.push({ key: p.category_key, bn: p.category_bn, en: p.category_en });
    }
  });

  list.forEach(labels => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pillar-chip";
    btn.dataset.category = labels.key;
    btn.innerHTML = `<span class="bn">${labels.bn}</span><span class="en">${labels.en}</span>`;
    btn.addEventListener("click", () => setCategory(labels.key));
    nav.appendChild(btn);
  });

  const allBtn = document.querySelector('.pillar-chip[data-category="all"]');
  if (allBtn) allBtn.addEventListener("click", () => setCategory("all"));
}

function renderFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const filtered = ACTIVE_CATEGORY === "all"
    ? ALL_POSTS
    : ALL_POSTS.filter(p => p.category_key === ACTIVE_CATEGORY);

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
    const c = colorForCategory(p.category_key);
    return `
      <a class="post" href="post.html?slug=${encodeURIComponent(p.slug)}">
        <div class="post-media">
          <img class="bn" src="${p.image_bn}" alt="" loading="lazy">
          <img class="en" src="${p.image_en}" alt="" loading="lazy">
        </div>
        <div class="post-body">
          <div class="post-date"><span class="bn">${dt.bn}</span><span class="en">${dt.en}</span></div>
          <span class="post-category" style="background:${c.bg};color:${c.fg}">
            <span class="bn">${p.category_bn}</span><span class="en">${p.category_en}</span>
          </span>
          <h2><span class="bn">${p.title_bn}</span><span class="en">${p.title_en}</span></h2>
          <p class="excerpt"><span class="bn">${p.excerpt_bn}</span><span class="en">${p.excerpt_en}</span></p>
          <span class="source">
            <span class="bn">সূত্র: ${p.source_label}</span><span class="en">Source: ${p.source_label}</span>
          </span>
        </div>
      </a>
    `;
  }).join("");
}

function setCategory(key) {
  ACTIVE_CATEGORY = key;
  document.querySelectorAll(".pillar-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === key);
  });
  renderFeed();
}

function initFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  fetch("posts.json")
    .then(res => res.json())
    .then(posts => {
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      ALL_POSTS = posts;
      buildPillars(posts);
      renderFeed();
    })
    .catch(() => {
      feed.innerHTML = '<p style="text-align:center;color:#55524A">Could not load stories. Check posts.json.</p>';
    });
}

/* ---------------- Detail page ---------------- */

function initDetail() {
  const root = document.getElementById("detail-root");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  fetch("posts.json")
    .then(res => res.json())
    .then(posts => {
      const p = posts.find(x => x.slug === slug);
      if (!p) {
        root.innerHTML = `
          <p style="text-align:center;color:#55524A">
            <span class="bn">খবরটি খুঁজে পাওয়া যায়নি।</span>
            <span class="en">Story not found.</span>
          </p>`;
        return;
      }

      const dt = formatDate(p.date);
      const c = colorForCategory(p.category_key);
      document.title = `${p.title_bn} | মঙ্গল বার্তা`;

      const bodyBn = p.body_bn.split("\n\n").map(para => `<p>${para}</p>`).join("");
      const bodyEn = p.body_en.split("\n\n").map(para => `<p>${para}</p>`).join("");

      root.innerHTML = `
        <div class="detail-media">
          <img class="bn" src="${p.image_bn}" alt="">
          <img class="en" src="${p.image_en}" alt="">
        </div>
        <div class="detail-date"><span class="bn">${dt.bn}</span><span class="en">${dt.en}</span></div>
        <div class="detail-category">
          <span style="background:${c.bg};color:${c.fg}">
            <span class="bn">${p.category_bn}</span><span class="en">${p.category_en}</span>
          </span>
        </div>
        <h1 class="detail-title">
          <span class="bn">${p.title_bn}</span><span class="en">${p.title_en}</span>
        </h1>
        <div class="detail-body">
          <div class="bn">${bodyBn}</div>
          <div class="en">${bodyEn}</div>
        </div>
        <div class="detail-source-wrap">
          <a class="detail-source" href="${p.source_url}" target="_blank" rel="noopener">
            <span class="bn">মূল সূত্র দেখুন</span><span class="en">View original source</span>
          </a>
        </div>
        <div class="detail-hashtags">${p.hashtags.join(" ")}</div>
      `;
    })
    .catch(() => {
      root.innerHTML = '<p style="text-align:center;color:#55524A">Could not load story.</p>';
    });
}

document.addEventListener("DOMContentLoaded", () => {
  initLangToggle();
  initFeed();
  initDetail();
});
