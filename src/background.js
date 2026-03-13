// Inicializa as variáveis de preferência
chrome.runtime.onInstalled.addListener(() => {

    chrome.storage.local.get(null, (items) => {

        if (Object.keys(items).length === 0) {

            chrome.storage.local.set({
                showTimeTable: true,
                hideGrades: true,
                preventDownloads: true
            })

        }

    })

})