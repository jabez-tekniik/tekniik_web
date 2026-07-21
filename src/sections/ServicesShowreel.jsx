import { TERMINAL_FRAMES } from '../data/content.js'
import styles from './ServicesShowreel.module.css'

/* ServicesShowreel — the /services hero vignette.
   One device shell sits on the stage and MORPHS between the four things
   Tekniik ships, each a working mini product demo in its discipline hue
   (--svc-* theme tokens):
     01 browser auto-scrolling a finished marketing site
     02 web-app board where a task card moves itself across columns
     03 the shell narrows into a phone running a live chat → booking flow
     04 an automation console processing a queue of requests hands-free
   The parent drives `active` (auto reel + index strip), so the shell,
   demo, ghost numeral, bloom and floating result chip all switch as one.
   These demos are deliberately DIFFERENT compositions from the
   ServiceVignettes used by the discipline sections below.
   Colors from theme tokens only; motion is transform/opacity except the
   shell morph (width/height/radius on a childless div — a documented
   exception: it's the storytelling beat, fires once per ~6.6s).
   Reduced motion renders the active demo complete and static. */

const RESULT = Object.fromEntries(TERMINAL_FRAMES.map((f) => [f.type, f.result]))

const MODE = {
  websites: styles.modeWebsites,
  apps: styles.modeApps,
  mobile: styles.modeMobile,
  ai: styles.modeAi,
}

function Skel({ className }) {
  return <span className={`${styles.skel} ${className || ''}`} />
}

function Check() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 6.4 5 8.9l4.5-5.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* —— 01 · Websites — a finished marketing site scrolls past —— */
function WebsiteDemo({ on }) {
  return (
    <div className={`${styles.demo} ${styles.webDemo} ${on ? styles.demoOn : ''}`}>
      <div className={styles.chrome}>
        <span className={styles.cDot} />
        <span className={styles.cDot} />
        <span className={styles.cDot} />
        <span className={styles.urlPill}>tekniik.ai</span>
      </div>
      <div className={styles.webView}>
        <div className={styles.webTrack}>
          <div className={styles.wHero}>
            <div className={styles.wCopy}>
              <Skel className={styles.wH1a} />
              <span className={styles.wH1b} />
              <Skel className={styles.wSub} />
              <span className={styles.wCta} />
            </div>
            <span className={styles.wMedia} />
          </div>
          <div className={styles.wLogos}>
            <Skel className={styles.wLogo} />
            <Skel className={styles.wLogo} />
            <Skel className={styles.wLogo} />
            <Skel className={styles.wLogo} />
            <Skel className={styles.wLogo} />
          </div>
          <div className={styles.wFeat}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={styles.wCard}>
                <span className={styles.wIcon} />
                <Skel className={styles.wLineA} />
                <Skel className={styles.wLineB} />
              </span>
            ))}
          </div>
          <div className={styles.wBand}>
            <Skel className={styles.wBandLine} />
            <span className={styles.wCtaGhost} />
          </div>
          <div className={styles.wFoot}>
            <Skel className={styles.wFootA} />
            <Skel className={styles.wFootB} />
          </div>
        </div>
        <span className={styles.webThumb} />
      </div>
    </div>
  )
}

/* —— 02 · Web apps — a workflow board works by itself —— */
function BoardDemo({ on }) {
  return (
    <div className={`${styles.demo} ${styles.boardDemo} ${on ? styles.demoOn : ''}`}>
      <div className={styles.chrome}>
        <span className={styles.cDot} />
        <span className={styles.cDot} />
        <span className={styles.cDot} />
        <span className={`${styles.tab} ${styles.tabOn}`} />
        <span className={styles.tab} />
        <span className={styles.tab} />
      </div>
      <div className={styles.board}>
        {[0, 1, 2].map((c) => (
          <div key={c} className={styles.col}>
            <div className={styles.colHead}>
              <Skel className={styles.colTitle} />
              <span className={styles.colCount} />
            </div>
            {/* col 0 leaves a slot for the moving card */}
            {(c === 0 ? [0] : c === 1 ? [0, 1] : [0]).map((k) => (
              <span key={k} className={styles.card}>
                <Skel className={styles.cardLineA} />
                <Skel className={styles.cardLineB} />
                <span className={styles.cardFoot}>
                  <span className={styles.avatar} />
                  <span className={styles.cardPillDim} />
                </span>
              </span>
            ))}
          </div>
        ))}
        {/* the hot card — picks itself up and crosses the board */}
        <span className={`${styles.card} ${styles.hotCard}`}>
          <Skel className={styles.cardLineA} />
          <Skel className={styles.cardLineB} />
          <span className={styles.cardFoot}>
            <span className={styles.avatar} />
            <span className={styles.cardPill} />
          </span>
        </span>
      </div>
    </div>
  )
}

/* —— 03 · Mobile — a chat → booking flow plays on a phone —— */
function ChatDemo({ on }) {
  return (
    <div className={`${styles.demo} ${styles.chatDemo} ${on ? styles.demoOn : ''}`}>
      <span className={styles.island} />
      <div className={styles.chat}>
        <span className={`${styles.bub} ${styles.bubL} ${styles.msgA}`}>
          <Skel className={styles.bubLineA} />
          <Skel className={styles.bubLineB} />
        </span>
        <span className={`${styles.typing} ${styles.typingA}`}>
          <span className={styles.tDot} />
          <span className={styles.tDot} />
          <span className={styles.tDot} />
        </span>
        <span className={`${styles.bub} ${styles.bubR} ${styles.msgB}`}>
          <span className={styles.bubLineOn} />
        </span>
        <span className={`${styles.bub} ${styles.bubL} ${styles.msgC}`}>
          <Skel className={styles.bubLineB} />
        </span>
        <span className={`${styles.confirm} ${styles.msgD}`}>
          <span className={styles.confirmBadge}>
            <Check />
          </span>
          <span className={styles.confirmLines}>
            <Skel className={styles.bubLineA} />
            <Skel className={styles.bubLineB} />
          </span>
        </span>
      </div>
      <div className={styles.inputBar}>
        <Skel className={styles.inputHint} />
        <span className={styles.sendDot} />
      </div>
    </div>
  )
}

/* —— 04 · AI & automation — a queue processes itself —— */
function OpsDemo({ on }) {
  return (
    <div className={`${styles.demo} ${styles.opsDemo} ${on ? styles.demoOn : ''}`}>
      <div className={styles.chrome}>
        <span className={styles.liveDot} />
        <span className={styles.opsLabel}>AUTOMATION &middot; LIVE</span>
      </div>
      <div className={styles.opsBody}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={styles.opsRow} style={{ '--i': i }}>
            <span className={styles.opsDoc} />
            <Skel className={styles.opsLine} />
            <span className={styles.opsBar}>
              <span className={styles.opsFill} />
            </span>
            <span className={styles.opsCheck}>
              <Check />
            </span>
          </span>
        ))}
        <span className={styles.opsToast}>
          <span className={styles.toastDot} />
          auto-reply sent
        </span>
      </div>
    </div>
  )
}

export default function ServicesShowreel({ active }) {
  return (
    <div className={`${styles.reel} ${MODE[active]}`}>
      {/* backdrop — crossfading hue blooms */}
      <div className={styles.back}>
        <span className={`${styles.bloom} ${styles.bloomWebsites}`} />
        <span className={`${styles.bloom} ${styles.bloomApps}`} />
        <span className={`${styles.bloom} ${styles.bloomMobile}`} />
        <span className={`${styles.bloom} ${styles.bloomAi}`} />
      </div>

      {/* the morphing device shell + the four demos */}
      <div className={styles.mid}>
        <span className={styles.plate} />
        <WebsiteDemo on={active === 'websites'} />
        <BoardDemo on={active === 'apps'} />
        <ChatDemo on={active === 'mobile'} />
        <OpsDemo on={active === 'ai'} />
      </div>

      {/* floating result chips — real outcomes from the proof ticker copy */}
      <div className={styles.front}>
        <span className={`${styles.fChip} ${styles.fWebsites}`}>{RESULT['website']}</span>
        <span className={`${styles.fChip} ${styles.fApps}`}>{RESULT['web-app']}</span>
        <span className={`${styles.fChip} ${styles.fMobile}`}>{RESULT['mobile-app']}</span>
        <span className={`${styles.fChip} ${styles.fAi}`}>{RESULT['ai-automation']}</span>
      </div>
    </div>
  )
}
