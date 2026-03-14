var browserAPI = globalThis.browser ?? globalThis.chrome;

// Inicializa as variáveis de preferência
browserAPI.runtime.onInstalled.addListener(() => {

    browserAPI.storage.local.get(null, (items) => {

        if (Object.keys(items).length === 0) {

            browserAPI.storage.local.set({
                showTimeTable: true,
                hideGrades: true,
                preventDownloads: true
            })

        }

    })

})