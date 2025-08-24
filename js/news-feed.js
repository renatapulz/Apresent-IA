async function loadAINews() {
  try {
    const response = await fetch("https://hn.algolia.com/api/v1/search?query=AI&tags=story");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const newsContainer = document.getElementById("ai-news");
    let list = document.createElement("ul");

    const hits = (data?.hits ?? []).slice(0, 5);
    const items = await Promise.all(
      hits.map(async (item) => {
        const rawTitle = item.title ?? item.story_title ?? "Sem título";
        const translatedTitle = await translateText(rawTitle, "pt").catch(() => rawTitle);
        const candidateUrl = item.url ?? `https://news.ycombinator.com/item?id=${item.objectID}`;
        const url = safeHttpUrl(candidateUrl)
          ? candidateUrl
          : `https://news.ycombinator.com/item?id=${item.objectID}`;
        return { translatedTitle, url };
      })
    );

    for (const { translatedTitle, url } of items) {
      const li = document.createElement("li");
      const a = document.createElement("a");
// Add this helper above your loader function
function safeHttpUrl(u) {
  try {
    const parsed = new URL(u, window.location.origin);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

async function loadAINews() {
  // ... any earlier code ...

  const items = await fetch(/*…*/).then(res => res.json());
  items.map(item => {
    // replaced direct url assignment with a safe check
    const candidateUrl = item.url ?? `https://news.ycombinator.com/item?id=${item.objectID}`;
    const url = safeHttpUrl(candidateUrl)
      ? candidateUrl
      : `https://news.ycombinator.com/item?id=${item.objectID}`;

    const a = document.createElement('a');
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = translatedTitle; // prevent XSS

    // ... append `a` into the DOM ...
  });

  // ... any later code ...
}
      li.appendChild(a);
      list.appendChild(li);
    }

    newsContainer.replaceChildren(list);

    newsContainer.appendChild(list);

  } catch (error) {
    console.error("Erro ao carregar notícias de IA", error);
  }
}

document.addEventListener("DOMContentLoaded", loadAINews);