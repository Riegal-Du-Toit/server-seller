import { motion } from "framer-motion";

interface AnimatedUnderlineTextProps {
  text: string;
  className?: string;
}

export default function AnimatedUnderlineText({ text, className }: AnimatedUnderlineTextProps) {
  return (
    <motion.span initial="initial" animate="visible" whileHover="hover" className={`relative inline-block ${className || ""}`}>
      {text}
      <svg aria-hidden="true" className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full overflow-visible" viewBox="0 0 300 20" preserveAspectRatio="none">
        <motion.path
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          variants={{
            initial: { pathLength: 0, opacity: 0, d: "M 0,10 Q 75,0 150,10 Q 225,20 300,10" },
            visible: { pathLength: 1, opacity: 1, d: "M 0,10 Q 75,0 150,10 Q 225,20 300,10", transition: { duration: 0.7, ease: "easeOut", repeat: Infinity, repeatType: "loop", repeatDelay: 2.3 } },
            hover: { d: "M 0,10 Q 75,20 150,10 Q 225,0 300,10", transition: { duration: 0.45, ease: "easeInOut" } },
          }}
        />
      </svg>
    </motion.span>
  );
}
