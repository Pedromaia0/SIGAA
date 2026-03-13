/**
 * Converte dd/mm/yyyy para Date object
 */
function parseBRDate(brDate) {
  const [day, month, year] = brDate.split("/").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formata Date object para YYYY-MM-DD
 */
function formatISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Converte uma ISO week string (YYYY-Www) em dia da semana.
 */
function getDateFromISOWeek(weekString) {
  const [yearPart, weekPart] = weekString.split("-W");
  const year = parseInt(yearPart, 10);
  const week = parseInt(weekPart, 10);

  // 4 de Janeiro é sempre week 1
  const jan4 = new Date(year, 0, 4);

  // Dia da semana (converte Sunday=0 to ISO Monday=0)
  const dayOfWeek = (jan4.getDay() + 6) % 7;

  // Pega o dia da segunda-feira da semana
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setDate(jan4.getDate() - dayOfWeek);

  // Adiciona todos os dias dessa semana
  const result = new Date(mondayWeek1);
  result.setDate(mondayWeek1.getDate() + (week - 1) * 7);

  return result;
}

/**
 * Converte uma date string (YYYY-MM-DD) para ISO week string (YYYY-Www).
 *
 * @param {string} dateString
 * @returns {string} ISO week string (YYYY-Www)
 */
function getISOWeekFromDate(dateString) {
  const date = new Date(dateString + "T00:00:00");

  const day = (date.getDay() + 6) % 7; // Monday=0
  date.setDate(date.getDate() + 3 - day);

  const isoYear = date.getFullYear();

  // 4 de Janeiro sempre na primeira semana
  const jan4 = new Date(isoYear, 0, 4);
  const jan4Day = (jan4.getDay() + 6) % 7;

  // Calcula o número da semana
  const diff = (date - jan4) / 86400000;
  const weekNumber = 1 + Math.floor((diff + jan4Day) / 7);

  return `${isoYear}-W${String(weekNumber).padStart(2, "0")}`;
}
