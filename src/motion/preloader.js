/* One-shot "preloader finished" signal. Preloader.jsx fires it once the
   boot overlay has fully left the screen; anything that must hold for it
   (the home hero typewriter) subscribes via whenPreloaderDone. Under
   reduced motion the preloader never plays and signals immediately, so
   subscribers resolve at once. */
let done = false
const waiters = new Set()

export function signalPreloaderDone() {
  if (done) return
  done = true
  waiters.forEach((cb) => cb())
  waiters.clear()
}

export function whenPreloaderDone(cb) {
  if (done) {
    cb()
    return () => {}
  }
  waiters.add(cb)
  return () => waiters.delete(cb)
}
