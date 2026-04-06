import { motion } from "framer-motion";
import { RefreshCw, Clock, Lightbulb, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadSchedulePDF } from "@/lib/exportPdf";

interface ScheduleOutputProps {
  schedule: string;
  prompt: string;
  onRegenerate: () => void;
  isLoading: boolean;
}

const ScheduleOutput = ({ schedule, prompt, onRegenerate, isLoading }: ScheduleOutputProps) => {
  // Split schedule into lines and render with formatting
  const lines = schedule.split("\n");

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-lg font-bold">Your Schedule</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadSchedulePDF(schedule, prompt)}
            className="gap-1.5 border-border text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
            className="gap-1.5 border-border text-muted-foreground hover:border-primary hover:text-primary"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        </div>
      </div>

      <div className="space-y-1 rounded-xl bg-muted/30 p-5 font-body text-sm leading-relaxed">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} className="h-2" />;

          // Day headers
          if (/^(day\s*\d|---)/i.test(trimmed))
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="mt-3 font-heading text-base font-bold text-primary"
              >
                {trimmed}
              </motion.p>
            );

          // Tips section
          if (/^(tips?|💡|🔥|✅|⭐)/i.test(trimmed))
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="mt-2 flex items-start gap-2 text-accent"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{trimmed.replace(/^(tips?:?\s*|💡\s*|🔥\s*|✅\s*|⭐\s*)/i, "")}</span>
              </motion.div>
            );

          // Time slots (lines with →, -, :)
          if (/\d{1,2}[:.]\d{2}/.test(trimmed))
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="text-foreground/90"
              >
                {trimmed}
              </motion.p>
            );

          return (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="text-foreground/80"
            >
              {trimmed}
            </motion.p>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ScheduleOutput;
