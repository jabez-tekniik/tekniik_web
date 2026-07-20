import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import NotFound from './NotFound.jsx'
import { LEGAL_PAGES } from '../data/legal.js'
import styles from './Legal.module.css'

/* Inline markup in the legal copy (src/data/legal.js): **bold**,
   [label](/internal-route); bare https:// URLs and email addresses
   auto-link. Kept deliberately tiny — legal.js stays a near-verbatim
   transcription of the locked spec instead of pre-chopped JSX. */
const INLINE =
  /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g

function InlineText({ text }) {
  const nodes = []
  let last = 0
  for (const match of text.matchAll(INLINE)) {
    const [raw, bold, label, to] = match
    if (match.index > last) nodes.push(text.slice(last, match.index))
    if (bold !== undefined) {
      nodes.push(<strong key={match.index}>{bold}</strong>)
    } else if (label !== undefined) {
      nodes.push(
        <Link key={match.index} className={styles.link} to={to}>
          {label}
        </Link>,
      )
    } else if (raw.startsWith('http')) {
      nodes.push(
        <a
          key={match.index}
          className={styles.link}
          href={raw}
          target="_blank"
          rel="noreferrer"
        >
          {raw}
        </a>,
      )
    } else {
      nodes.push(
        <a key={match.index} className={styles.link} href={`mailto:${raw}`}>
          {raw}
        </a>,
      )
    }
    last = match.index + raw.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function Block({ block }) {
  switch (block.type) {
    case 'p':
      return (
        <p className={styles.para}>
          <InlineText text={block.text} />
        </p>
      )
    case 'label':
      return <p className={styles.label}>{block.text}</p>
    case 'sub':
      return <h3 className={styles.sub}>{block.text}</h3>
    case 'list':
      return (
        <ul className={styles.list}>
          {block.items.map((item) => (
            <li key={item} className={styles.item}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell}>
                      <InlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    default:
      return null
  }
}

/* Shared template for the four legal routes (/privacy-policy,
   /terms-of-service, /cookie-policy, /gdpr) — content locked in
   content/tekniik-legal-pages-spec.md, transcribed in data/legal.js.
   Deliberately the quietest page register on the site: no hero visuals,
   one ~720px reading column, a single FadeIn on the h1. */
export default function LegalPage({ page }) {
  const doc = LEGAL_PAGES[page]
  if (!doc) return <NotFound />

  return (
    <section className={styles.page}>
      <div className="container">
        <Reveal className={styles.metaBar}>
          <span className={styles.eyebrow}>
            <span className={styles.node} aria-hidden="true" />
            Legal
          </span>
          <span className={styles.updated}>Last updated: {doc.lastUpdated}</span>
        </Reveal>

        <article className={doc.warm ? `${styles.doc} ${styles.warm}` : styles.doc}>
          <FadeIn as="h1" className={styles.title} text={doc.title} />
          {doc.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </section>
          ))}
        </article>
      </div>
    </section>
  )
}
