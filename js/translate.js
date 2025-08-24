// Cache em memória com limite de tamanho para evitar crescimento infinito
class LimitedCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // remove o item mais antigo (primeiro inserido)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }
}

const translationCache = new LimitedCache(200);

async function translateText(text, targetLang = "pt") {
  if (!text) return "";

  const key = `${targetLang}:${text}`;
  if (translationCache.has(key)) return translationCache.get(key);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=en|${encodeURIComponent(targetLang)}`;

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const result = await response.json();
    const translated = result?.responseData?.translatedText?.trim() || text;

    translationCache.set(key, translated);
    return translated;
  } catch (err) {
    console.warn("translateText: fallback para texto original:", err);
    return text;
  } finally {
    clearTimeout(timeoutId);
  }
}