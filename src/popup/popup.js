document.addEventListener("DOMContentLoaded", () => {

  const showTimeTable = document.getElementById("showTimeTable");
  const hideGrades = document.getElementById("hideGrades");
  const preventDownloads = document.getElementById("preventDownloads");
  const darkMode = document.getElementById("darkMode");

  browserAPI.storage.local.get(
    ["showTimeTable", "hideGrades", "preventDownloads", "darkMode", "theme"],
    (result) => {
      showTimeTable.checked = result.showTimeTable ?? true;
      hideGrades.checked = result.hideGrades ?? true;
      preventDownloads.checked = result.preventDownloads ?? true;
      darkMode.checked = result.darkMode ?? false;

      // Mantém seleção do tema
      const themeSelector = document.getElementById("themeSelector");
      if (themeSelector) themeSelector.value = result.theme ?? "default";
    },
  );

  // Salva cada preferência
  document.querySelectorAll("input[type=checkbox]").forEach((input) => {
    input.addEventListener("change", (e) => {
      const key = e.target.id;
      const value = e.target.checked;

      browserAPI.storage.local.set({
        [key]: value,
      });
    });
  });

  // Salva o tema
  const themeSelector = document.getElementById("themeSelector");
  if (themeSelector) {
    themeSelector.addEventListener("change", () => {
      browserAPI.storage.local.set({ theme: themeSelector.value });
    });
  }

  // navbar
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      contents.forEach((c) => (c.style.display = "none"));
      document.getElementById(tab.dataset.tab).style.display = "block";
    });
  });
});
