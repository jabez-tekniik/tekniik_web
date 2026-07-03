import Button from '../components/Button.jsx'
import Eyebrow from '../components/Eyebrow.jsx'

export default function NotFound() {
  return (
    <section
      className="container"
      style={{
        paddingBlock: 'clamp(140px, 20vh, 220px)',
        textAlign: 'center',
      }}
    >
      <Eyebrow>404 · NOT FOUND</Eyebrow>
      <h1 style={{ marginTop: 24, marginBottom: 18 }}>This page took the day off.</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 460, margin: '0 auto 32px' }}>
        The link doesn’t exist or the project has moved. Head back home.
      </p>
      <Button to="/" arrow>Back home</Button>
    </section>
  )
}
