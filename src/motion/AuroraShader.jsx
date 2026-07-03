import { useEffect, useRef, useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion.js'
import styles from './AuroraShader.module.css'

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
// three brand inks
const vec3 INDIGO = vec3(0.357, 0.357, 1.0);
const vec3 VIOLET = vec3(0.545, 0.361, 0.965);
const vec3 PINK   = vec3(0.925, 0.282, 0.600);

float blob(vec2 uv, vec2 c, float r) {
  return smoothstep(r, 0.0, distance(uv, c));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float t = uTime * 0.06;
  vec2 m = (uMouse - 0.5) * 0.15;
  vec2 a = vec2(0.25 + 0.05 * sin(t * 1.3), 0.32 + 0.04 * cos(t)) + m;
  vec2 b = vec2(0.78 + 0.05 * cos(t * 1.1), 0.30 + 0.05 * sin(t * 0.9)) - m;
  vec2 c = vec2(0.58 + 0.06 * sin(t * 0.7), 0.76 + 0.04 * cos(t * 1.4));
  vec3 col = vec3(0.0);
  col += INDIGO * blob(uv, a, 0.42);
  col += VIOLET * blob(uv, b, 0.40);
  col += PINK   * blob(uv, c, 0.46);
  float alpha = clamp(col.r + col.g + col.b, 0.0, 1.0) * 0.55;
  gl_FragColor = vec4(col, alpha);
}
`

export default function AuroraShader({ className = '' }) {
  const reduced = useReducedMotion()
  const hostRef = useRef(null)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) return undefined
    let renderer, program, mesh, gl, raf = 0, disposed = false
    const mouse = [0.5, 0.5]
    const host = hostRef.current
    let intersecting = true
    let docVisible = true
    let localCleanup = null

    const start = async () => {
      const { Renderer, Program, Mesh, Triangle } = await import('ogl')
      if (disposed || !host) return
      renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) })
      gl = renderer.gl
      canvasRef.current = gl.canvas
      gl.canvas.className = `${styles.canvas}`
      host.appendChild(gl.canvas)
      const geometry = new Triangle(gl)
      program = new Program(gl, {
        vertex: `attribute vec2 position; void main(){ gl_Position = vec4(position,0.0,1.0); }`,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: [1, 1] },
          uMouse: { value: mouse },
        },
      })
      mesh = new Mesh(gl, { geometry, program })

      const resize = () => {
        const r = host.getBoundingClientRect()
        renderer.setSize(r.width, r.height)
        program.uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight]
      }
      resize()
      window.addEventListener('resize', resize)

      const onMouse = (e) => {
        const r = host.getBoundingClientRect()
        mouse[0] = (e.clientX - r.left) / r.width
        mouse[1] = 1 - (e.clientY - r.top) / r.height
      }
      window.addEventListener('pointermove', onMouse)

      const io = new IntersectionObserver(([en]) => { intersecting = en.isIntersecting }, { threshold: 0 })
      io.observe(host)
      const onVis = () => { docVisible = document.visibilityState === 'visible' }
      document.addEventListener('visibilitychange', onVis)

      let last = 0
      const loop = (time) => {
        raf = requestAnimationFrame(loop)
        if (!intersecting || !docVisible) return
        if (time - last < 16) return
        last = time
        program.uniforms.uTime.value = time * 0.001
        renderer.render({ scene: mesh })
      }
      raf = requestAnimationFrame(loop)
      requestAnimationFrame(() => setReady(true))

      localCleanup = () => {
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', onMouse)
        document.removeEventListener('visibilitychange', onVis)
        io.disconnect()
      }
    }

    // Defer to idle after LCP.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : setTimeout(start, 1200)

    return () => {
      disposed = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
      cancelAnimationFrame(raf)
      if (localCleanup) localCleanup()
      gl?.getExtension('WEBGL_lose_context')?.loseContext()
      const c = canvasRef.current
      if (c && c.parentNode) c.parentNode.removeChild(c)
    }
  }, [reduced])

  useEffect(() => {
    if (ready && canvasRef.current) canvasRef.current.classList.add(styles.ready)
  }, [ready])

  return (
    <div className={`${styles.wrap} ${className}`} ref={hostRef} aria-hidden="true">
      <div className={styles.fallback} />
    </div>
  )
}
