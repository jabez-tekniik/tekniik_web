import { useScroll } from 'framer-motion'

export default function useScrollProgress(ref, offset = ['start end', 'end start']) {
  const { scrollYProgress } = useScroll({ target: ref, offset })
  return scrollYProgress
}
