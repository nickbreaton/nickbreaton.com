// remove existing service worker

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
}