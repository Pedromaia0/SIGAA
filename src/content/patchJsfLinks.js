/**
 * Esse arquivo é responsável por fazer o overloading de todos os links que contém o jsfcljs.
 * Isso permite que seja tratado como um link "normal" podendo abri-lo em uma nova guia
 * Por incrível que pareça se você tentar abrir um link do SIGAA como nova guia não funcionará, esse arquivo resolve isso.
 */

// Faz o parsing da função do jsf original
function parseJsfOnclick(onclickStr) {
  if (!onclickStr) return null;

  const formMatch = onclickStr.match(/getElementById\('([^']+)'\)/);
  const paramsMatch = onclickStr.match(/,\s*({[\s\S]*?})\s*,/);

  if (!formMatch || !paramsMatch) return null;

  const formId = formMatch[1];
  let paramsStr = paramsMatch[1];

  // Converte para JSON válido
  paramsStr = paramsStr
    .replace(/([{,]\s*)([a-zA-Z0-9_:]+)\s*:/g, '$1"$2":') // quote keys
    .replace(/'/g, '"'); // single → double quotes

  let params;
  try {
    params = JSON.parse(paramsStr);
  } catch {
    return null;
  }

  return { formId, params };
}

// Adiciona o eventListener para overloading
function patchJsfLink(element) {
  const onclick = element.getAttribute("onclick");
  const parsed = parseJsfOnclick(onclick);

  if (!parsed) return;

  const { formId, params } = parsed;
  const originalForm = document.getElementById(formId);

  if (!originalForm) return;

  const actionUrl = originalForm.action;

  // HREF fallback
  element.setAttribute("href", actionUrl);
  element.style.cursor = "pointer";

  element.removeAttribute("onclick");

  element.addEventListener(
    "click",
    function (event) {
      const isMiddleClick = event.button === 1;
      const isNewTabIntent = event.ctrlKey || event.metaKey || isMiddleClick;

      // Bloqueia completamente o JSF
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const form = document.createElement("form");
      form.method = "POST";
      form.action = actionUrl;

      if (isNewTabIntent) {
        form.target = "_blank";
      }

      const inputs = originalForm.querySelectorAll("input, select, textarea");

      inputs.forEach((el) => {
        if (!el.name) return;

        const clone = el.cloneNode(true);
        if (el.value !== undefined) {
          clone.value = el.value;
        }

        form.appendChild(clone);
      });

      for (const key in params) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    true,
  );
}

// Aplica para todos os links da página menos para baixáveis
function patchAllJsfLinks() {
  const elements = document.querySelectorAll("[onclick*='jsfcljs']");

  const filtered = Array.from(elements).filter((el) => {
    const onclick = el.getAttribute("onclick") || "";
    return !onclick.includes("formAva");
  });

  filtered.forEach((el) => patchJsfLink(el));
}

patchAllJsfLinks();
