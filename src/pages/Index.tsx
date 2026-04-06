import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import PromptInput from "@/components/PromptInput";
import ScheduleOutput from "@/components/ScheduleOutput";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ScheduleHistory from "@/components/ScheduleHistory";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [schedule, setSchedule] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const generateSchedule = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setSchedule("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-schedule", {
        body: { prompt: prompt.trim() },
      });

      if (error) throw error;
      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Rate limit reached. Please wait a moment and try again.");
        } else if (data.error.includes("Payment")) {
          toast.error("AI credits exhausted. Please add funds in workspace settings.");
        } else {
          toast.error(data.error);
        }
        return;
      }

      setSchedule(data.schedule || "No schedule generated.");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (histPrompt: string, histSchedule: string) => {
    setPrompt(histPrompt);
    setSchedule(histSchedule);
  };

  return (
    <div className="relative min-h-screen bg-background bg-grid">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-12">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Smart Schedule in <span className="text-gradient">Seconds</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Tell us about your day and commitments — AI will craft an optimized schedule for you.
            </p>
          </motion.div>

          {/* Input & Output */}
          <div className="space-y-6">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={generateSchedule}
              isLoading={isLoading}
            />

            {isLoading && <LoadingSkeleton />}
            {schedule && !isLoading && (
              <ScheduleOutput
                schedule={schedule}
                prompt={prompt}
                onRegenerate={generateSchedule}
                isLoading={isLoading}
              />
            )}

            <ScheduleHistory onLoad={loadFromHistory} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
