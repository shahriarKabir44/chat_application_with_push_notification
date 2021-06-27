if (navigator.serviceWorker) {
    navigator.serviceWorker.register('worker.js')
        .then(reg => {
            console.log(reg)
        })
        .catch(er => {
            console.log(`er`, er)
        })
}