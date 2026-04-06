import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronDown, ChevronUp, Clock, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ScheduleHistoryProps {
  onLoad: (prompt: string, schedule: string) => void;
}

const ScheduleHistory = ({ onLoad }: ScheduleHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  if (!schedules?.length && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <span className="font-heading text-sm font-semibold">
            Recent Schedules
          </span>
          {schedules && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {schedules.length}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 px-5 pb-5">
              {isLoading ? (
                <p className="text-xs text-muted-foreground">Loading…</p>
              ) : (
                schedules?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onLoad(item.prompt, item.schedule)}
                    className="group w-full rounded-xl bg-muted/30 p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-xs text-foreground/80">
                        {item.prompt}
                      </p>
                      <div className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(item.created_at), "MMM d, h:mm a")}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScheduleHistory;
