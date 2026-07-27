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
        {/* laptop shell — navy bezel + camera, slim base deck with trackpad
            notch; the assembling site lives on its screen */}
        <div className={styles.laptop}>
          <div className={styles.lapScreen}>
            <span className={styles.lapCam} />
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
                  <span className={styles.bBrand}>
                    <span className={styles.bLogo} />
                    tekniik
                  </span>
                  <span className={styles.bNavLink}>Work</span>
                  <span className={styles.bNavLink}>Services</span>
                  <span className={styles.bNavLink}>About</span>
                  <span className={styles.bNavBtn}>Contact</span>
                </div>
                <div className={styles.bHero}>
                  <div className={styles.bCopy}>
                    <span className={styles.bH1}>Websites that</span>
                    <span className={`${styles.bH1} ${styles.bH1Accent}`}>win customers.</span>
                    <span className={styles.bSub}>Fast, accessible, built to convert.</span>
                    <span className={styles.bCta}>
                      Get started
                      <span className={styles.ripple} />
                    </span>
                  </div>
                  {/* product card — the e-commerce side of the story */}
                  <div className={styles.bMedia}>
                    <span className={styles.bShotImg}>
                      <span className={styles.bShotOrb} />
                    </span>
                    <span className={styles.bShotName}>Studio chair</span>
                    <span className={styles.bShotFoot}>
                      <span className={styles.bShotPrice}>£249</span>
                      <span className={styles.bShotTag}>In stock</span>
                    </span>
                  </div>
                  {/* floating proof card overlapping the media panel */}
                  <span className={styles.bStat}>
                    <span className={styles.bStatVal}>+64%</span>
                    <span className={styles.bStatLbl}>conversions</span>
                  </span>
                </div>
                <div className={styles.bCards}>
                  <span className={styles.bCard}>
                    <span className={styles.bCardDot} />
                    <span className={styles.bCardTxt}>
                      <span className={styles.bCardTitle}>Design</span>
                      <span className={styles.bCardSub}>UX and UI</span>
                    </span>
                  </span>
                  <span className={styles.bCard}>
                    <span className={styles.bCardDot} />
                    <span className={styles.bCardTxt}>
                      <span className={styles.bCardTitle}>Develop</span>
                      <span className={styles.bCardSub}>React, Node, APIs</span>
                    </span>
                  </span>
                  <span className={styles.bCard}>
                    <span className={styles.bCardDot} />
                    <span className={styles.bCardTxt}>
                      <span className={styles.bCardTitle}>Launch</span>
                      <span className={styles.bCardSub}>SEO and hosting</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.lapBase}>
            <span className={styles.lapPad} />
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

/* —— 02 · Web Apps — a live dashboard: KPIs, breathing bars, a
      self-drawing trend line, donut split, payments ledger —— */
const BARS = [
  { h: '38%', m: 0.72 },
  { h: '58%', m: 0.85 },
  { h: '46%', m: 0.66 },
  { h: '74%', m: 0.88 },
  { h: '56%', m: 0.7 },
  { h: '88%', m: 0.78 },
  { h: '66%', m: 0.9 },
]

const SIDE_NAV = ['Overview', 'Orders', 'Billing', 'Reports', 'Settings']

const LEDGER = [
  { s: 'ok', name: 'Looqz Ltd', amt: '£4,200', pill: 'Paid' },
  { s: 'mid', name: 'Novabank', amt: '£1,850', pill: 'Sent' },
  { s: 'due', name: 'Atlas Co', amt: '£920', pill: 'Due' },
]

export function AppScene({ active }) {
  return (
    <Scene active={active} metric={METRIC.app} chipClass={styles.appChip}>
      <div className={styles.mid}>
        {/* desktop monitor shell — navy bezel + power LED, neck + foot stand;
            the live dashboard runs on its screen */}
        <div className={styles.monitor}>
          <div className={styles.monScreen}>
            <div className={styles.appWin}>
              <div className={styles.side}>
                <span className={styles.sLogo} />
                <span className={styles.sHl} />
                <span className={styles.sInd} />
                {SIDE_NAV.map((t) => (
                  <span key={t} className={styles.sItem}>
                    <span className={styles.sIco} />
                    {t}
                  </span>
                ))}
                {/* pointer working the nav — its clicks drive .sInd/.sHl */}
                <svg className={styles.appCursor} viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3.5 2.2 16.6 9.4l-6 1.7-2.6 5.7L3.5 2.2Z"
                    fill="var(--text)"
                    stroke="var(--bg-raise)"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className={styles.appMain}>
                <div className={styles.kpis}>
                  <span className={styles.kpi}>
                    <span className={styles.kLabel}>Revenue</span>
                    <span className={styles.kValue}>£48.2k</span>
                    <span className={styles.kTrend}>+8.1%</span>
                  </span>
                  <span className={styles.kpi}>
                    <span className={styles.kLabel}>Active users</span>
                    {/* live tick: the count rolls up while you watch */}
                    <span className={`${styles.kValue} ${styles.kTick}`}>
                      <span>12,940</span>
                      <span>12,957</span>
                    </span>
                    <span className={styles.kTrend}>+18.4%</span>
                  </span>
                  <span className={styles.kpi}>
                    <span className={styles.kLabel}>Uptime</span>
                    <span className={styles.kValue}>99.9%</span>
                    <span className={styles.kTrend} data-flat="">
                      SLA met
                    </span>
                  </span>
                </div>
                <div className={styles.chartRow}>
                  <div className={styles.chart}>
                    {BARS.map((b, i) => (
                      <span
                        key={i}
                        className={styles.bar}
                        style={{ '--h': b.h, '--m': b.m, '--i': i }}
                      />
                    ))}
                    <svg
                      className={styles.spark}
                      viewBox="0 0 220 80"
                      preserveAspectRatio="none"
                    >
                      <path
                        className={styles.sparkLine}
                        d="M2 64 L34 50 L66 56 L98 34 L130 42 L162 20 L194 28 L218 12"
                      />
                    </svg>
                    {/* HTML dot: the stretched svg would render a circle as an ellipse */}
                    <span className={styles.sparkDot} />
                    <span className={styles.scan} />
                  </div>
                  <div className={styles.donutBox}>
                    <span className={styles.donut}>
                      <span className={styles.donutVal}>64%</span>
                    </span>
                    <span className={styles.legend}>
                      <span className={styles.legRow}>
                        <span className={styles.legDot} />
                        Web
                        <span className={styles.legVal}>64%</span>
                      </span>
                      <span className={styles.legRow}>
                        <span className={styles.legDot} data-dim="" />
                        App
                        <span className={styles.legVal}>36%</span>
                      </span>
                    </span>
                  </div>
                </div>
                <div className={styles.tbl}>
                  {LEDGER.map((r) => (
                    <span key={r.name} className={styles.tbRow}>
                      <span className={styles.tbDot} data-s={r.s} />
                      <span className={styles.tbName}>{r.name}</span>
                      <span className={styles.tbAmt}>{r.amt}</span>
                      <span className={styles.tbPill} data-s={r.s}>
                        {r.pill}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <span className={styles.liveTag}>
                <span className={styles.liveDot} />
                LIVE
              </span>
            </div>
            <span className={styles.monLed} />
          </div>
          <span className={styles.monNeck} />
          <span className={styles.monFoot} />
        </div>
      </div>
    </Scene>
  )
}

/* —— 03 · Mobile Apps — a phone scrolls through screens in sync with
      its tab bar; a notification drops in with an overshoot —— */
const M_ROWS = [
  { a: 'S', n: 'Sarah M.', s: 'Order #1042', v: '£86' },
  { a: 'J', n: 'James K.', s: 'Order #1041', v: '£124' },
  { a: 'P', n: 'Priya N.', s: 'Order #1039', v: '£58' },
  { a: 'T', n: 'Tom W.', s: 'Order #1038', v: '£212' },
]

function MRow({ r }) {
  return (
    <span className={styles.mListRow}>
      <span className={styles.mAva}>{r.a}</span>
      <span className={styles.mRowTxt}>
        <span className={styles.mRowName}>{r.n}</span>
        <span className={styles.mRowSub}>{r.s}</span>
      </span>
      <span className={styles.mRowVal}>{r.v}</span>
    </span>
  )
}

/* stat tile — label / value / delta, left-aligned like a real dashboard
   card so bigger tablet tiles never read as empty boxes */
function MTile({ v, l, d, hot }) {
  return (
    <span className={styles.mTile} data-hot={hot ? '' : undefined}>
      <span className={styles.mTileLbl}>{l}</span>
      <span className={styles.mTileVal}>{v}</span>
      <span className={styles.mTileDelta}>{d}</span>
    </span>
  )
}

function HeroCard({ className = '' }) {
  return (
    <span className={`${styles.mHeroCard} ${className}`}>
      <span className={styles.mCardTxt}>
        <span className={styles.mCardLabel}>Total revenue</span>
        <span className={styles.mCardValue}>£2,480</span>
        <span className={styles.mCardTrend}>+12% this week</span>
      </span>
      <span className={styles.mCardBars}>
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    </span>
  )
}

function MScreen({ v }) {
  if (v === 2) {
    return (
      <div className={styles.mScreen}>
        <span className={styles.mHead}>Activity</span>
        {M_ROWS.map((r) => (
          <MRow key={r.n} r={r} />
        ))}
      </div>
    )
  }
  if (v === 3) {
    return (
      <div className={styles.mScreen}>
        <span className={styles.mHead}>Insights</span>
        <span className={styles.mTiles}>
          <MTile v="128" l="Orders" d="+18% this week" hot />
          <MTile v="4.9" l="Rating" d="1,204 reviews" />
        </span>
        <MRow r={M_ROWS[0]} />
        <MRow r={M_ROWS[1]} />
      </div>
    )
  }
  return (
    <div className={styles.mScreen}>
      <span className={styles.mHead}>Home</span>
      <HeroCard />
      <MRow r={M_ROWS[0]} />
      <MRow r={M_ROWS[1]} />
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
        <span className={styles.mHead}>Activity</span>
        <span className={styles.tCols}>
          <span className={styles.tStack}>
            <MRow r={M_ROWS[0]} />
            <MRow r={M_ROWS[1]} />
          </span>
          <span className={styles.tStack}>
            <MRow r={M_ROWS[2]} />
            <MRow r={M_ROWS[3]} />
          </span>
        </span>
      </div>
    )
  }
  if (v === 3) {
    return (
      <div className={styles.tScreen}>
        <span className={styles.mHead}>Insights</span>
        {/* three bands (tiles + two full-width rows) — two bands split a
            tall screen into towers, three keep every card compact */}
        <span className={`${styles.tCols} ${styles.tTiles}`}>
          <MTile v="128" l="Orders" d="+18% this week" hot />
          <MTile v="4.9" l="Rating" d="1,204 reviews" />
          <MTile v="96%" l="On time" d="+4% vs last month" />
        </span>
        <MRow r={M_ROWS[2]} />
        <MRow r={M_ROWS[3]} />
      </div>
    )
  }
  return (
    <div className={styles.tScreen}>
      <span className={styles.mHead}>Home</span>
      <span className={styles.tCols}>
        <HeroCard className={styles.tHero} />
        <span className={styles.tStack}>
          <MRow r={M_ROWS[0]} />
          <MRow r={M_ROWS[1]} />
        </span>
      </span>
    </div>
  )
}

export function MobileScene({ active }) {
  return (
    <Scene active={active} metric={METRIC.mobile} chipClass={styles.mobileChip}>
      <div className={styles.mid}>
        {/* iPad in landscape — navy shell, camera in the top bezel, edge
            buttons via the shell's pseudos; same app, tablet layout */}
        <div className={styles.tablet}>
          <span className={styles.tCam} />
          <div className={styles.tViewport}>
            <div className={styles.mTrack}>
              <TScreen v={1} />
              <TScreen v={2} />
              <TScreen v={3} />
              <TScreen v={1} />
            </div>
          </div>
        </div>
        {/* iPhone in front — slim 9:19.5, scrolls in sync with the tablet.
            Shell = navy bezel + side buttons; screen = island, status strip,
            app viewport, tab bar, home indicator */}
        <div className={styles.phone}>
          <span className={`${styles.pBtn} ${styles.pBtnVolA}`} />
          <span className={`${styles.pBtn} ${styles.pBtnVolB}`} />
          <span className={`${styles.pBtn} ${styles.pBtnPower}`} />
          <div className={styles.pScreen}>
            <span className={styles.island} />
            <div className={styles.pStatus}>
              <span className={styles.pTime}>9:41</span>
              <span className={styles.pSignal}>
                <span />
                <span />
                <span />
              </span>
            </div>
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
            <span className={styles.homeBar} />
          </div>
        </div>
      </div>
      <div className={styles.front}>
        <span className={styles.notif}>
          <span className={styles.nIcon} />
          <span className={styles.nLines}>
            <span className={styles.nTitle}>New order received</span>
            <span className={styles.nSub}>Sarah M. · just now</span>
          </span>
        </span>
      </div>
    </Scene>
  )
}

/* —— 04 · AI & Automation — a pipeline: document in, thinking core,
      packets flowing to three outcomes; a live processing log narrates —— */
const AI_PATHS = {
  in: 'M84 150 C 128 150, 152 150, 196 150',
  a: 'M240 150 C 280 150, 284 84, 324 84',
  b: 'M240 150 L 324 150',
  c: 'M240 150 C 280 150, 284 216, 324 216',
  /* microchip → core feed: the AI engine powering the pipeline */
  cpu: 'M218 234 L218 194',
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
          <circle className={styles.packet} r="3">
            <animateMotion dur="1.8s" begin="0.9s" repeatCount="indefinite" path={AI_PATHS.cpu} />
          </circle>
        </svg>
      </div>
      <div className={styles.mid}>
        <span className={styles.docNode}>
          <span className={`${styles.skel} ${styles.docLine}`} />
          <span className={`${styles.skel} ${styles.docLine}`} />
          <span className={`${styles.skel} ${styles.docLineShort}`} />
          <span className={styles.docName}>invoice.pdf</span>
        </span>
        <span className={styles.core}>
          <span className={styles.coreRing} />
          <span className={styles.corePulse} />
          <span className={styles.corePulse} data-late="" />
          <span className={styles.coreOrb} />
        </span>
        {/* microchip node below the core, wired in via AI_PATHS.cpu —
            the engine feeding the pipeline (AI-powered development) */}
        <span className={styles.aiCpu}>
          <span className={styles.cpuDie}>AI</span>
        </span>
      </div>
      <div className={styles.front}>
        {/* live processing log — narrates what the pipeline is doing */}
        <span className={styles.logCard}>
          <span className={styles.logLine}>→ parsing invoice.pdf</span>
          <span className={styles.logLine}>→ extracting 12 fields</span>
          <span className={`${styles.logLine} ${styles.logLineHot}`}>→ routed to accounts</span>
        </span>
        <span className={`${styles.outChip} ${styles.outA}`}>EXTRACT</span>
        <span className={`${styles.outChip} ${styles.outB}`}>DECIDE</span>
        <span className={`${styles.outChip} ${styles.outC}`}>AUTOMATE</span>
        <span className={`${styles.outVal} ${styles.outValA}`}>99.2% accurate</span>
        <span className={`${styles.outVal} ${styles.outValB}`}>0.8s each</span>
        <span className={`${styles.outVal} ${styles.outValC}`}>24/7</span>
      </div>
    </Scene>
  )
}
