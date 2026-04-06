import { motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";

const Navbar = () => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="glass sticky top-0 z-50 px-6 py-4"
  >
    <div className="mx-auto flex max-w-5xl items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <h1 className="font-heading text-xl font-bold tracking-tight">
          Intelli<span className="text-gradient">Schedule</span>
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <Sparkles className="h-3 w-3" />
        AI Powered
      </div>
    </div>
  </motion.nav>
);

export default Navbar;
