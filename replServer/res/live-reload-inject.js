const ws = new WebSocket("ws://" + document.location.host + "/");

ws.addEventListener("message", reload)
ws.addEventListener("error", reload)

async function reload() {
  console.log("Reloading...")
  let proms = []
  await navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log("Unregistering the following sw", registrations)
    for(let registration of registrations) {
      proms.push(registration.unregister())
    }
  })

  await Promise.all(proms)

  location.reload()
}