import { motion } from "framer-motion";

const LoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="glass rounded-2xl p-6"
  >
    <div className="mb-4 flex items-center gap-2">
      <div className="h-5 w-5 animate-pulse rounded bg-primary/30" />
      <div className="h-5 w-32 animate-pulse rounded bg-muted" />
    </div>
    <div className="space-y-3 rounded-xl bg-muted/30 p-5">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-4 animate-shimmer rounded bg-gradient-to-r from-muted via-muted-foreground/10 to-muted"
          style={{
            width: `${60 + Math.random() * 35}%`,
            backgroundSize: "200% 100%",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
    <p className="mt-4 text-center text-xs text-muted-foreground">
      AI is crafting your optimized schedule…
    </p>
  </motion.div>
);

export default LoadingSkeleton;
