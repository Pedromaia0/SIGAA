const eyeON = browserAPI.runtime.getURL("../../icons/eye-on.svg");
const eyeOFF = browserAPI.runtime.getURL("../../icons/eye-off.svg");

function setBlurGrades(enable) {
  const agenda = document.getElementById("perfil-docente");

  const grades = [...agenda.querySelectorAll('[align="right"]')]
    .slice(0, 9)
    .map((el) => el.firstChild);

  const filter_txt = enable ? "blur(5px)" : "";

  for (const grade of grades) {
    grade.style.filter = filter_txt;
  }

  const toggleBTN = document.getElementById("ocultar-notas");
  toggleBTN.src = enable ? eyeOFF : eyeON;
}

function toggleBlurGrades() {
  const agenda = document.getElementById("perfil-docente");

  const grade = agenda.querySelector('[align="right"]').firstChild;

  const is_blured = grade.style.filter !== "";

  setBlurGrades(!is_blured);
}

function addToggleBTN() {
  const els = document.querySelectorAll("#agenda-docente"); // Aberração do site (tem mais de um elemento com o mesmo ID)
  if (els == null) {
    return; // Caso o usuário não esteja na página principal
  }

  // Checa as preferências
  browserAPI.storage.local.get(["hideGrades"], (result) => {
    const active = result.hideGrades;

    const agenda = els[1];
    const indices = agenda.querySelectorAll("tr")[7];

    const toggleBTN = document.createElement("img");

    toggleBTN.src = active ? eyeOFF : eyeON;
    toggleBTN.onclick = toggleBlurGrades;
    toggleBTN.id = "ocultar-notas";

    toggleBTN.style.width = "18px";
    toggleBTN.style.height = "18px";
    toggleBTN.style.cursor = "pointer";
    toggleBTN.style.verticalAlign = "middle";

    indices.appendChild(toggleBTN);

    // Inicializa borrado ou não de acordo com as preferências
    if (active) {
      toggleBlurGrades();
    }
  });
}

// Listener para modificações das preferências
browserAPI.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;

  if (changes.hideGrades) {
    const enabled = changes.hideGrades.newValue;
    setBlurGrades(enabled);
  }
});

addToggleBTN();
