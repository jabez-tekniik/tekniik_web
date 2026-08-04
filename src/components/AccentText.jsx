/* Highlights the significant word inside a heading.

   FinalCta's `headingParts` idiom only splits an accent off the END of a
   line; section headings often carry the meaning mid-sentence ("Why
   *Tekniik* exists."), so this splits on the first occurrence anywhere and
   wraps it in the caller's accent class. If the accent isn't found the
   heading renders plain, exactly like the tail split — keep the two copy
   strings in sync in content.js. */
export default function AccentText({ text, accent, className = '' }) {
  const at = accent ? text.indexOf(accent) : -1
  if (at < 0) return text

  return (
    <>
      {text.slice(0, at)}
      <span className={className}>{accent}</span>
      {text.slice(at + accent.length)}
    </>
  )
}
