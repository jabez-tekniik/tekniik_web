import styles from './LogoStrip.module.css'

export default function LogoStrip({ items = [], eyebrow = 'Trusted by teams who pick craft over hype' }) {
  return (
    <section className={styles.strip} aria-label="Selected proof points">
      <div className="container">
        <p className={styles.eyebrow}>{eyebrow}</p>
        <ul className={styles.row}>
          {items.map((item, i) => (
            <li key={i} className={styles.chip}>
              <span className={styles.value}>{item.value}</span>
              <span className={styles.label}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
