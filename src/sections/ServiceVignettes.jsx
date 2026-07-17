/* ServiceVignettes — coded, theme-token-driven animated scenes for the
   ServiceShowcase stage. One scene per capability (web / app / mobile / ai).
   Pure CSS motion: keyframe loops gate on the active class, entry
   choreography uses transitions, everything transform/opacity only.
   The whole stage is aria-hidden (decorative) — labels inside are ornament.
   Color comes exclusively from theme tokens so both ink modes work. */
import { TERMINAL_FRAMES } from '../data/content.js'
import styles from './ServiceVignettes.module.css'

const RESULT = Object.fromEntries(TERMINAL_FRAMES.map((f) => [f.type, f.result]))
const METRIC = {
  web: RESULT['website'],
  app: RESULT['web-app'],
  mobile: RESULT['mobile-app'],
  ai: RESULT['ai-automation'],
}

function Scene({ active, children, metric, chipClass }) {
  return (
    <div className={`${styles.scene} ${active ? styles.on : ''}`}>
      {children}
      <span className={`${styles.chipWrap} ${chipClass}`}>
        <span className={styles.chip}>{metric}</span>
      </span>
    </div>
  )
}

/* —— 01 · Websites — a marketing site assembles itself, a cursor
      drifts in and clicks the CTA —— */
export function WebScene({ active }) {
  return (
    <Scene active={active} metric={METRIC.web} chipClass={styles.webChip}>
      <div className={styles.back}>
        <span className={styles.ghostRing} />
      </div>
      <div className={styles.mid}>
        <div className={styles.browser}>
          <div className={styles.chrome}>
            <span className={styles.tDot} data-c="r" />
            <span className={styles.tDot} data-c="y" />
            <span className={styles.tDot} data-c="g" />
            <span className={styles.urlPill}>tekniik.ai</span>
            <span className={styles.loadBar} />
          </div>
          <div className={styles.bBody}>
            <div className={styles.bNav}>
              <span className={styles.bLogo} />
              <span className={styles.bLink} />
              <span className={styles.bLink} />
              <span className={styles.bLink} />
              <span className={styles.bNavBtn} />
            </div>
            <div className={styles.bHero}>
              <div className={styles.bCopy}>
                <span className={`${styles.skel} ${styles.h1a}`} />
                <span className={`${styles.skel} ${styles.h1b}`} />
                <span className={`${styles.skel} ${styles.hSub}`} />
                <span className={styles.bCta}>
                  <span className={styles.ripple} />
                </span>
              </div>
              <div className={styles.bMedia} />
            </div>
            <div className={styles.bCards}>
              <span className={styles.bCard} />
              <span className={styles.bCard} />
              <span className={styles.bCard} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.front}>
        <svg className={styles.cursor} viewBox="0 0 20 20" fill="none">
          <path
            d="M3.5 2.2 16.6 9.4l-6 1.7-2.6 5.7L3.5 2.2Z"
            fill="var(--text)"
            stroke="var(--bg-raise)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Scene>
  )
}

/* —— 02 · Web Apps — a live dashboard: bars breathe, the trend line
      draws itself, the sidebar signal wanders —— */
const BARS = [
  { h: '38%', m: 0.72 },
  { h: '58%', m: 0.85 },
  { h: '46%', m: 0.66 },
  { h: '74%', m: 0.88 },
  { h: '56%', m: 0.7 },
  { h: '88%', m: 0.78 },
  { h: '66%', m: 0.9 },
]

export function AppScene({ active }) {
  return (
    <Scene active={active} metric={METRIC.app} chipClass={styles.appChip}>
      <div className={styles.mid}>
        <div className={styles.appWin}>
          <div className={styles.side}>
            <span className={styles.sLogo} />
            <span className={styles.sInd} />
            <span className={styles.sItem} />
            <span className={styles.sItem} />
            <span className={styles.sItem} />
            <span className={styles.sItem} />
            <span className={styles.sItem} />
          </div>
          <div className={styles.appMain}>
            <div className={styles.kpis}>
              <span className={styles.kpi}>
                <span className={`${styles.skel} ${styles.kLabel}`} />
                <span className={styles.kValue}>48.2k</span>
              </span>
              <span className={styles.kpi}>
                <span className={`${styles.skel} ${styles.kLabel}`} />
                <span className={styles.kValue}>+18.4%</span>
              </span>
              <span className={styles.kpi}>
                <span className={`${styles.skel} ${styles.kLabel}`} />
                <span className={styles.kValue}>99.9%</span>
              </span>
            </div>
            <div className={styles.chart}>
              {BARS.map((b, i) => (
                <span
                  key={i}
                  className={styles.bar}
                  style={{ '--h': b.h, '--m': b.m, '--i': i }}
                />
              ))}
              <svg className={styles.spark} viewBox="0 0 220 80" preserveAspectRatio="none">
                <path
                  className={styles.sparkLine}
                  d="M2 64 L34 50 L66 56 L98 34 L130 42 L162 20 L194 28 L218 12"
                />
              </svg>
              {/* HTML dot: the stretched svg would render a circle as an ellipse */}
              <span className={styles.sparkDot} />
            </div>
          </div>
          <span className={styles.liveTag}>
            <span className={styles.liveDot} />
            LIVE
          </span>
        </div>
      </div>
    </Scene>
  )
}

/* —— 03 · Mobile Apps — a phone scrolls through screens in sync with
      its tab bar; a notification drops in with an overshoot —— */
function MScreen({ v }) {
  if (v === 2) {
    return (
      <div className={styles.mScreen}>
        <span className={`${styles.skel} ${styles.mHead}`} />
        <span className={styles.mRow} />
        <span className={styles.mRow} />
        <span className={styles.mRow} />
        <span className={styles.mRow} />
      </div>
    )
  }
  if (v === 3) {
    return (
      <div className={styles.mScreen}>
        <span className={`${styles.skel} ${styles.mHead}`} />
        <span className={styles.mTiles}>
          <span className={styles.mTile} />
          <span className={styles.mTile} />
        </span>
        <span className={styles.mRow} />
      </div>
    )
  }
  return (
    <div className={styles.mScreen}>
      <span className={`${styles.skel} ${styles.mHead}`} />
      <span className={styles.mHeroCard}>
        <span className={`${styles.skel} ${styles.mCardLine}`} />
        <span className={`${styles.skel} ${styles.mCardLineShort}`} />
      </span>
      <span className={styles.mRow} />
      <span className={styles.mRow} />
    </div>
  )
}

/* tablet-landscape variants of the same three app screens — both devices
   scroll in sync (same keyframes/duration), telling the responsiveness
   story: one app, every form factor */
function TScreen({ v }) {
  if (v === 2) {
    return (
      <div className={styles.tScreen}>
        <span className={`${styles.skel} ${styles.mHead}`} />
        <span className={styles.tCols}>
          <span className={styles.tStack}>
            <span className={styles.mRow} />
            <span className={styles.mRow} />
          </span>
          <span className={styles.tStack}>
            <span className={styles.mRow} />
            <span className={styles.mRow} />
          </span>
        </span>
      </div>
    )
  }
  if (v === 3) {
    return (
      <div className={styles.tScreen}>
        <span className={`${styles.skel} ${styles.mHead}`} />
        <span className={styles.tCols}>
          <span className={styles.mTile} />
          <span className={styles.mTile} />
          <span className={styles.mTile} />
        </span>
      </div>
    )
  }
  return (
    <div className={styles.tScreen}>
      <span className={`${styles.skel} ${styles.mHead}`} />
      <span className={styles.tCols}>
        <span className={`${styles.mHeroCard} ${styles.tHero}`}>
          <span className={`${styles.skel} ${styles.mCardLine}`} />
          <span className={`${styles.skel} ${styles.mCardLineShort}`} />
        </span>
        <span className={styles.tStack}>
          <span className={styles.mRow} />
          <span className={styles.mRow} />
        </span>
      </span>
    </div>
  )
}

export function MobileScene({ active }) {
  return (
    <Scene active={active} metric={METRIC.mobile} chipClass={styles.mobileChip}>
      <div className={styles.mid}>
        {/* iPad in landscape — same app, tablet layout */}
        <div className={styles.tablet}>
          <div className={styles.tViewport}>
            <div className={styles.mTrack}>
              <TScreen v={1} />
              <TScreen v={2} />
              <TScreen v={3} />
              <TScreen v={1} />
            </div>
          </div>
        </div>
        {/* iPhone in front — slim 9:19.5, scrolls in sync with the tablet */}
        <div className={styles.phone}>
          <span className={styles.island} />
          <div className={styles.mViewport}>
            <div className={styles.mTrack}>
              <MScreen v={1} />
              <MScreen v={2} />
              <MScreen v={3} />
              <MScreen v={1} />
            </div>
          </div>
          <div className={styles.mTabs}>
            <span className={styles.mInd} />
            <span className={styles.mTab} />
            <span className={styles.mTab} />
            <span className={styles.mTab} />
          </div>
        </div>
      </div>
      <div className={styles.front}>
        <span className={styles.notif}>
          <span className={styles.nIcon} />
          <span className={styles.nLines}>
            <span className={`${styles.skel} ${styles.nLineA}`} />
            <span className={`${styles.skel} ${styles.nLineB}`} />
          </span>
        </span>
      </div>
    </Scene>
  )
}

/* —— 04 · AI & Automation — a pipeline: document in, thinking core,
      packets flowing to three outcomes —— */
const AI_PATHS = {
  in: 'M84 150 C 128 150, 152 150, 196 150',
  a: 'M240 150 C 280 150, 284 84, 324 84',
  b: 'M240 150 L 324 150',
  c: 'M240 150 C 280 150, 284 216, 324 216',
}

export function AiScene({ active }) {
  return (
    <Scene active={active} metric={METRIC.ai} chipClass={styles.aiChip}>
      <div className={styles.back}>
        <svg className={styles.aiWires} viewBox="0 0 400 300" preserveAspectRatio="none">
          {Object.values(AI_PATHS).map((d) => (
            <path key={d} className={styles.wire} d={d} />
          ))}
          {Object.values(AI_PATHS).map((d) => (
            <path key={d} className={styles.flow} d={d} />
          ))}
          <circle className={styles.packet} r="3">
            <animateMotion dur="2.6s" repeatCount="indefinite" path={AI_PATHS.in} />
          </circle>
          <circle className={styles.packet} r="3">
            <animateMotion dur="2.2s" begin="0.5s" repeatCount="indefinite" path={AI_PATHS.a} />
          </circle>
          <circle className={styles.packet} r="3">
            <animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite" path={AI_PATHS.b} />
          </circle>
          <circle className={styles.packet} r="3">
            <animateMotion dur="2.2s" begin="1.7s" repeatCount="indefinite" path={AI_PATHS.c} />
          </circle>
        </svg>
      </div>
      <div className={styles.mid}>
        <span className={styles.docNode}>
          <span className={`${styles.skel} ${styles.docLine}`} />
          <span className={`${styles.skel} ${styles.docLine}`} />
          <span className={`${styles.skel} ${styles.docLineShort}`} />
        </span>
        <span className={styles.core}>
          <span className={styles.coreRing} />
          <span className={styles.corePulse} />
          <span className={styles.corePulse} data-late="" />
          <span className={styles.coreOrb} />
        </span>
      </div>
      <div className={styles.front}>
        <span className={`${styles.outChip} ${styles.outA}`}>EXTRACT</span>
        <span className={`${styles.outChip} ${styles.outB}`}>DECIDE</span>
        <span className={`${styles.outChip} ${styles.outC}`}>AUTOMATE</span>
      </div>
    </Scene>
  )
}
