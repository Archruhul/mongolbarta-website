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

function renderPosts(posts) {
  const feed = document.getElementById("feed");
  feed.innerHTML = posts.map(p => {
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

  fetch("posts.json")
    .then(res => res.json())
    .then(posts => {
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      renderPosts(posts);
    })
    .catch(() => {
      document.getElementById("feed").innerHTML =
        '<p style="text-align:center;color:#55524A">Could not load stories. Check posts.json.</p>';
    });
});
