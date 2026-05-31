(function () {
  const STORAGE_KEY = "preferred-language";
  const supportedLanguages = new Set(["zh", "en"]);

  function getInitialLanguage() {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (supportedLanguages.has(stored)) {
      return stored;
    }

    return "zh";
  }

  function applyLanguage(language) {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.body.dataset.language = language;

    document.querySelectorAll("[data-i18n-zh][data-i18n-en]").forEach((element) => {
      element.textContent = element.dataset[`i18n${language === "zh" ? "Zh" : "En"}`];
    });

    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", language === "en" ? "true" : "false");
      button.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换到中文");
    });
  }

  function setLanguage(language) {
    window.localStorage.setItem(STORAGE_KEY, language);
    applyLanguage(language);
  }

  document.addEventListener("DOMContentLoaded", () => {
    let currentLanguage = getInitialLanguage();
    applyLanguage(currentLanguage);

    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        currentLanguage = currentLanguage === "zh" ? "en" : "zh";
        setLanguage(currentLanguage);
      });
    });
  });
})();
