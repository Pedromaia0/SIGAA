// Carrega as preferências salvas
document.addEventListener("DOMContentLoaded", () => {

    const showTimeTable = document.getElementById("showTimeTable")
    const hideGrades = document.getElementById("hideGrades")
    const preventDownloads = document.getElementById("preventDownloads")

    chrome.storage.local.get([
        "showTimeTable",
        "hideGrades",
        "preventDownloads"
    ], (result) => {

        showTimeTable.checked = result.showTimeTable ?? true
        hideGrades.checked = result.hideGrades ?? false
        preventDownloads.checked = result.preventDownloads ?? true

    })


    // Salva as preferência
    document.querySelectorAll("input[type=checkbox]").forEach(input => {

        input.addEventListener("change", () => {

            const prefs = {
                showTimeTable: showTimeTable.checked,
                hideGrades: hideGrades.checked,
                preventDownloads: preventDownloads.checked
            }

            chrome.storage.local.set(prefs)

        })

    })

})