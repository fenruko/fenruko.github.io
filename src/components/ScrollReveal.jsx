import { motion } from "framer-motion";

// Fade content in as it enters the viewport while scrolling down.
// `blur` adds a defocus->focus transition, used for the command screenshots.
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  blur = 0,
  scale = 1,
  duration = 0.7,
  amount = 0.2,
  ...props
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale, filter: blur ? `blur(${blur}px)` : undefined }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: blur ? "blur(0px)" : undefined }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
