import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* Three.js dot-wave field (adapted from 21st.dev "dotted-surface").
   Lazy chunk — only imported by DottedSurface.jsx once the host section
   nears the viewport. Sized to its container (not the window), colors
   resolved from the theme tokens of the element it renders inside, and
   the rAF loop only runs while the container is on screen. */

const SEPARATION = 150
const AMOUNTX = 44
const AMOUNTY = 60
const WAVE_HEIGHT = 46

export default function DottedSurfaceScene({ className }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const css = getComputedStyle(host)
    const fogColor = new THREE.Color(css.getPropertyValue('--band').trim() || '#202e5d')
    const dotColor = new THREE.Color(css.getPropertyValue('--on-band-dim').trim() || '#b6bfd6')

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(fogColor, 2000, 8500)

    const width = host.clientWidth || 1
    const height = host.clientHeight || 1
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
    camera.position.set(0, 380, 1500)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(fogColor, 0)
    host.appendChild(renderer.domElement)

    const positions = []
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
        )
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({
      color: dotColor,
      size: 7,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    })
    scene.add(new THREE.Points(geometry, material))

    let raf = 0
    let running = false
    let count = 0

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const arr = geometry.attributes.position.array
      let i = 1
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          arr[i] = Math.sin((ix + count) * 0.3) * WAVE_HEIGHT + Math.sin((iy + count) * 0.5) * WAVE_HEIGHT
          i += 3
        }
      }
      geometry.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
      count += 0.08
    }
    const start = () => {
      if (running) return
      running = true
      animate()
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(
      (entries) => (entries.some((e) => e.isIntersecting) ? start() : stop()),
      { rootMargin: '80px 0px' },
    )
    io.observe(host)

    const ro = new ResizeObserver(() => {
      const w = host.clientWidth || 1
      const h = host.clientHeight || 1
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    ro.observe(host)

    return () => {
      io.disconnect()
      ro.disconnect()
      stop()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={hostRef} className={className} />
}
