// Overloading da função jsfcljs para links baixáveis
function patchDownloadLinks() {
  const links = document.querySelectorAll("a[onclick*='jsfcljs']");

  const regex = /formAva/;

  const filteredLinks = Array.from(links).filter((link) =>
    regex.test(link.getAttribute("onclick")),
  );

  for (const link of filteredLinks) {
    const onclick = link.getAttribute("onclick");
    if (!onclick) continue;

    const params = {};

    const pairRegex = /'([^']+)':'([^']+)'/g;
    let match;

    while ((match = pairRegex.exec(onclick)) !== null) {
      params[match[1]] = match[2];
    }

    link.removeAttribute("onclick");

    link.addEventListener(
      "click",
      async (event) => {
        // BLOCK JSF completely
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const form = document.getElementById("formAva");
        if (!form) {
          console.error("formAva não encontrado");
          return;
        }

        const data = new URLSearchParams();

        data.append("formAva", "formAva");

        const viewState = form.querySelector(
          "input[name='javax.faces.ViewState']",
        );
        if (!viewState) {
          console.error("ViewState não encontrado");
          return;
        }

        data.append("javax.faces.ViewState", viewState.value);

        for (const key in params) {
          data.append(key, params[key]);
        }

        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          credentials: "include",
        });

        const blob = await response.blob();

        const url = URL.createObjectURL(blob);

        window.open(url, "_blank");
      },
      true,
    ); // CAPTURE PHASE (crítico)
  }
}

// Listener para modificações das preferências
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;

  if (changes.preventDownloads) {
    window.location.reload(); // Exige reload para funcionar
  }
});

// Checa as preferências
chrome.storage.local.get(["preventDownloads"], (result) => {
  if (result.preventDownloads) {
    patchDownloadLinks();
  }
});
