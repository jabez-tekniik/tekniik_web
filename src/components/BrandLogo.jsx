import styles from './BrandLogo.module.css'

/* The new brand mark (src/images/brand/logo-icon.svg) inlined so the two
   strokes recolor by theme: the navy chevron follows `--logo-ink` (white on
   the ink theme, brand navy on light routes); the teal chevron is constant
   brand teal. Wordmark is set in the display face beside it. */
export default function BrandLogo({ size = 26, wordmark = true }) {
  return (
    <span className={styles.brand}>
      <svg
        viewBox="236 288 612 504"
        width={size}
        height={size}
        aria-hidden="true"
        className={styles.mark}
      >
        <path
          className={styles.inkPath}
          d="M666.773,333.508l-175.323,363.24c-5.36,11.105-16.603,18.162-28.933,18.162H428.12L535.545,492.36
          c8.76-18.148-0.56-32.996-20.712-32.996H242.266l67.897-140.689c5.36-11.106,16.603-18.164,28.934-18.164h306.964
          C666.211,300.512,675.532,315.36,666.773,333.508z"
        />
        <path
          className={styles.tealPath}
          d="M453.798,380.768c-15.283,0-29.218,8.748-35.866,22.513L236.35,779.488h137.602
          c14.087,0,26.931-8.062,33.055-20.749l99.702-206.547c3.837-7.949,11.885-13.001,20.712-13.001h219.66
          c12.298,0,23.511-7.039,28.857-18.115l67.712-140.308H453.798z"
        />
      </svg>
      {wordmark && <span className={styles.word}>tekniik</span>}
    </span>
  )
}
