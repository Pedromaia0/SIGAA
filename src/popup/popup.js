// Carrega as preferências salvas
document.addEventListener("DOMContentLoaded", () => {

    const showTimeTable = document.getElementById("showTimeTable")
    const hideGrades = document.getElementById("hideGrades")
    const preventDownloads = document.getElementById("preventDownloads")

    browserAPI.storage.local.get([
        "showTimeTable",
        "hideGrades",
        "preventDownloads"
    ], (result) => {

        showTimeTable.checked = result.showTimeTable ?? true
        hideGrades.checked = result.hideGrades ?? true
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

            browserAPI.storage.local.set(prefs)

        })

    })

})