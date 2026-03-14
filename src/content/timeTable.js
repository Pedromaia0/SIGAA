// Extensão de códigio aberto feita por https://github.com/Pedromaia0/
// Sinta-se à vontade para contribuir

function extractClassesRows() {
  let turmas_portal = document.getElementById("turmas-portal");

  if (turmas_portal == null) {
    return null; // Se não estiver na pagina principal
  }

  let all_subjects = [...turmas_portal.getElementsByTagName("table")].at(-1);

  let subjects = [...all_subjects.getElementsByTagName("tr")].slice(2, -1);

  subjects = subjects.filter((e) => e.childElementCount > 2);

  return subjects;
}

function getClassAcronym(subject_name) {
  if (!subject_name) return "";

  const roman_regex = /^(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i;

  const words = subject_name.trim().toUpperCase().split(/\s+/);

  let roman_suffix = "";
  let effective_words = words;

  // Checa se a última palavra é um numeral romano
  const last_word = words[words.length - 1];

  if (roman_regex.test(last_word)) {
    roman_suffix = "-" + last_word;
    effective_words = words.slice(0, -1);
  }

  const acronym = effective_words
    .filter((w) => !disallowd_words.includes(w.toLowerCase().trim())) // Remove preposições e conjunções da sigla
    .map((w) => w[0])
    .join("");

  return acronym + roman_suffix;
}

function extractClassInfo(tr) {
  let class_name = tr.getElementsByClassName("descricao")[0].textContent.trim();
  let location = tr.getElementsByClassName("info")[0].textContent.trim();
  let calendar = tr.getElementsByClassName("info")[1].textContent.trim();
  let class_acronym = getClassAcronym(class_name);

  return { class_name, location, calendar, class_acronym };
}

function expandSchedule(subjectData) {
  const { class_name, location, calendar, class_acronym } = subjectData;

  const result = {};

  const blocks = calendar.split(",").map((el) => el.trim());

  blocks.forEach((block) => {
    /**
     * Exemplo de block input:
     * 246M12 (02/03/2026 - 06/03/2026)
     */
    const match = block.match(
      /^(\d+)([MTN])(\d+)\s*\((\d{2}\/\d{2}\/\d{4})\s*-\s*(\d{2}\/\d{2}\/\d{4})\)$/,
    ); // Mágica

    if (!match) return;

    const weekdays = match[1].split("").map(Number);
    const shift = match[2];
    const slots = match[3].split("").map(Number);

    const start = parseBRDate(match[4]);
    let end = parseBRDate(match[5]);
    end.setDate(parseBRDate(match[5]).getDate() + 1); // Dia final + 1

    for (
      let current = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        12,
      );
      current <= end;
      current.setDate(current.getDate() + 1)
    ) {
      const jsDay = current.getDay();
      const weekdaySIGAA = jsDay + 1;

      if (!weekdays.includes(weekdaySIGAA)) continue;

      const dateKey = formatISODate(
        new Date(current.getFullYear(), current.getMonth(), current.getDate()),
      );

      if (!result[dateKey]) result[dateKey] = [];

      slots.forEach((slot) => {
        result[dateKey].push({
          class_name,
          class_acronym,
          location,
          shift,
          slot,
        });
      });
    }
  });

  return result;
}

/**
 * Exporta tabela de horários para PNG
 */
function renderScheduleTable() {
  const table = document.getElementById("schedule-table");

  if (!table) {
    console.error("schedule-table not found");
    return;
  }

  const rows = [...table.querySelectorAll("tr")];

  const cell_width = 160;
  const cell_height = 60;

  const cols = Math.max(...rows.map((r) => r.children.length));

  const canvas = document.createElement("canvas");
  canvas.width = cols * cell_width;
  canvas.height = rows.length * cell_height;

  const ctx = canvas.getContext("2d");

  // Cor de fundo
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  rows.forEach((row, i) => {
    const cells = [...row.children];

    cells.forEach((cell, j) => {
      const x = j * cell_width;
      const y = i * cell_height;

      // Borda
      ctx.strokeRect(x, y, cell_width, cell_height);

      const text = cell.innerText.trim();
      const lines = text.split("\n");

      // Dias da semana
      if (i === 0) {
        ctx.font = "bold 16px Arial";
      } else {
        ctx.font = "14px Arial";
      }

      const line_height = 16;
      const start_y =
        y + cell_height / 2 - ((lines.length - 1) * line_height) / 2;

      lines.forEach((line, k) => {
        ctx.fillStyle = "black";

        ctx.fillText(line, x + cell_width / 2, start_y + k * line_height);
      });
    });
  });

  const link = document.createElement("a");
  link.download = "Horário.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/**
 * Mescla vários horários em um único calendário
 */
function buildGlobalSchedule(subjectsData) {
  const globalSchedule = {};

  subjectsData.forEach((subject) => {
    const expanded = expandSchedule(subject);

    Object.entries(expanded).forEach(([date, classes]) => {
      if (!globalSchedule[date]) {
        globalSchedule[date] = [];
      }

      globalSchedule[date].push(...classes);
    });
  });

  // Ordena os horários
  Object.values(globalSchedule).forEach((dayClasses) => {
    dayClasses.sort((a, b) => {
      if (a.shift !== b.shift) {
        return a.shift.localeCompare(b.shift);
      }
      return a.slot - b.slot;
    });
  });

  return globalSchedule;
}

/**
 * Cria os horários da semana dinamicamente.
 * Primeira coluna contém os horário.
 * A primeira fileira contém os dias da semana, començando por segunda.
 *
 * @returns {HTMLTableElement} A tabela populada.
 */
function createTimeTable() {
  const wrapper = document.createElement("div");
  wrapper.id = "schedule-wrapper";
  const table = document.createElement("table");
  table.id = "schedule-table";
  table.border = "1";

  // Cria o seletor de semana
  const weekSelector = document.createElement("input");
  weekSelector.type = "week";
  weekSelector.id = "week-input";
  weekSelector.addEventListener("change", (event) => {
    let date = getDateFromISOWeek(event.target.value);
    populateScheduleTable(globalSchedule, date);
  });
  wrapper.appendChild(weekSelector);

  // Cria botão para salvar imagem
  const saveImageBtn = document.createElement("button");
  saveImageBtn.textContent = "Salvar";
  saveImageBtn.addEventListener("click", (event) => {
    renderScheduleTable();
  });
  wrapper.appendChild(saveImageBtn);

  // Cria o table head
  const thead = document.createElement("thead");
  const header_row = document.createElement("tr");

  const empty_corner = document.createElement("th");
  empty_corner.textContent = "Horário";
  header_row.appendChild(empty_corner);

  weekdays.forEach((day) => {
    const th = document.createElement("th");
    th.textContent = day;
    header_row.appendChild(th);
  });

  thead.appendChild(header_row);
  table.appendChild(thead);

  // Cria o table body
  const tbody = document.createElement("tbody");

  Object.values(class_schedules).forEach((time) => {
    const row = document.createElement("tr");

    const time_cell = document.createElement("td");
    time_cell.textContent = time;
    time_cell.style = "text-align: center;";
    row.appendChild(time_cell);

    weekdays.forEach(() => {
      const cell = document.createElement("td");
      cell.style = "text-align: center;";
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  wrapper.appendChild(table);
  document.getElementById("turmas-portal").appendChild(wrapper);
  return table;
}

/**
 * Popula a tabela dado a data da segunda-feira
 *
 * @param {Object} globalSchedule
 * @param {Date} startDay - Necessáriamente segunda-feira da semana
 */
function populateScheduleTable(globalSchedule, startDay) {
  const table = document.getElementById("schedule-table");
  const tbody = table.querySelector("tbody");
  if (!tbody) return;

  // Normaliza a semana
  const weekStart = new Date(startDay);
  weekStart.setHours(0, 0, 0, 0);

  // Limpa a table dos horários
  for (const row of tbody.rows) {
    for (let c = 1; c < row.cells.length; c++) {
      row.cells[c].innerHTML = "";
    }
  }

  // Optimização para fast-lookup
  const rowMap = {};
  for (const row of tbody.rows) {
    rowMap[row.cells[0].textContent] = row;
  }

  // Percorre toda a semana
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + dayOffset);

    const isoDate = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    const dayEntries = globalSchedule[isoDate];
    if (!dayEntries) continue;

    for (const entry of dayEntries) {
      const key = `${entry.shift}${entry.slot}`;
      const time = class_schedules[key];
      if (!time) continue;

      const row = rowMap[time];
      if (!row) continue;

      const cell = row.cells[dayOffset + 1];
      cell.setAttribute("title", entry.class_name);

      cell.innerHTML = `
                <strong>${entry.class_acronym}</strong><br>
                <small>${entry.location}</small>
            `;
    }
  }
}

function removeTimeTable() {
  const timeTable = document.getElementById("schedule-wrapper");
  timeTable.remove();
}

function init() {
  // Checa as preferências
  browserAPI.storage.local.get(["showTimeTable"], (result) => {
    if (result.showTimeTable) {
      const classesRows = extractClassesRows();

      if (classesRows == null) {
        return; // Caso não o usúario não esteja no portal principal
      }

      const allClasses = classesRows.map((tr) => extractClassInfo(tr));

      globalThis.globalSchedule = buildGlobalSchedule(allClasses);
      createTimeTable();
      first_week = Object.keys(globalSchedule)[0];
      const today = new Date();

      if (today > new Date(first_week)) {
        first_week = today.toISOString().split("T")[0]; // Pega a semana atual ou a primeira semana não vazia (Caso a atual esteja vazia)
      }

      weekInput = document.getElementById("week-input");
      weekInput.value = getISOWeekFromDate(first_week);
      weekInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}

// Listener para modificações das preferências
browserAPI.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;

  if (changes.showTimeTable) {
    const enabled = changes.showTimeTable.newValue;

    if (enabled) {
      init();
    } else {
      removeTimeTable();
    }
  }
});

init();
