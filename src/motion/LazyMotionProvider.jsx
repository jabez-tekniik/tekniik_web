import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'

// LazyMotion(strict) forbids the `motion` component — only `m` works, keeping
// the runtime small. MotionConfig reducedMotion="user" auto-disables transform
// animations when the OS requests reduced motion.
export default function LazyMotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
