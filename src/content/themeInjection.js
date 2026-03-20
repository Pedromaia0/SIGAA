let themeLink;
let backgroundThemeLink;

let themes = {
  cats: "cats.jpg",
  ducks: "ducks.jpg",
  hearts: "hearts.jpg",
  hello_kitty: "hello_kitty.jpg",
  space: "space.jpg",
};

function applyWallpaper(theme) {
  removeInjectedBackgroundTheme(); // remove o tema anterior
  if (theme == "default") {
    backgroundThemeLink = null;
    return;
  }
  const t = `assets/themes/${themes[theme]}`;
  const url = browserAPI.runtime.getURL(t);

  backgroundThemeLink = document.createElement("style");
  backgroundThemeLink.id = "custom-wallpaper";

  backgroundThemeLink.textContent = `

    html {
      background:none !important;
    }
    body {
      background: none !important;
    }
      
    html::before {
      content: "";
      position: fixed;
      inset: 0;

      background-image: url("${url}") !important;
      background-repeat: repeat;
      background-size: 250px;
      background-position: top left;

      z-index: -1;
      filter: brightness(55%);
      pointer-events: none;
    }
    `;

  document.head.appendChild(backgroundThemeLink);
}

// Injeta um tema na página
function injectTheme() {
  const url = browserAPI.runtime.getURL("styles/theme.css");

  themeLink = document.createElement("link");
  themeLink.rel = "stylesheet";
  themeLink.href = url;

  document.head.appendChild(themeLink);
}

// Remove um tema aplicado
function removeInjectedTheme() {
  if (themeLink) {
    themeLink.parentNode.removeChild(themeLink);
  }
}
// Remove o papel de parede
function removeInjectedBackgroundTheme() {
  if (backgroundThemeLink) {
    backgroundThemeLink.parentNode.removeChild(backgroundThemeLink);
  }
}

// Listener para modificações das preferências
browserAPI.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;

  if (changes.darkMode) {
    const enabled = changes.darkMode.newValue;
    enabled ? injectTheme() : removeInjectedTheme();
  }
  if (changes.theme) {
    const selectedTheme = changes.theme.newValue;
    applyWallpaper(selectedTheme);
  }
});

// Checa as preferências
browserAPI.storage.local.get(["darkMode", "theme"], (result) => {
  if (result.darkMode) {
    injectTheme();
  }
  applyWallpaper(result.theme ?? "default");
});
