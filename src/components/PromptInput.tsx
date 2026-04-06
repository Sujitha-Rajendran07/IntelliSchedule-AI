import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const EXAMPLE = "I have college from 9 AM to 5 PM, I want to study DSA 2 hours daily, aptitude 1 hour, and I have exams in 10 days.";

const PromptInput = ({ value, onChange, onSubmit, isLoading }: PromptInputProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="glass rounded-2xl p-6"
  >
    <label className="mb-2 block font-heading text-sm font-semibold text-foreground">
      Describe your schedule
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={EXAMPLE}
      rows={4}
      className="w-full resize-none rounded-xl border border-border bg-muted/50 p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !isLoading && value.trim()) onSubmit();
      }}
    />
    <div className="mt-3 flex items-center justify-between">
      <button
        type="button"
        onClick={() => onChange(EXAMPLE)}
        className="text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        Try example prompt
      </button>
      <Button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="gap-2 bg-primary font-heading font-semibold text-primary-foreground transition-all hover:glow-primary hover:bg-primary/90 disabled:opacity-40"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Generate Schedule
          </>
        )}
      </Button>
    </div>
  </motion.div>
);

export default PromptInput;
