import { useState } from "react";
import { Send, Mic, Plus } from "lucide-react";
import { motion } from "framer-motion";

const CommandInput = () => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    // Placeholder for sending command
    setValue("");
  };

  return (
    <motion.div
      className="glass rounded-xl p-2 mt-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <Plus size={18} />
        </button>
        <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <Mic size={18} />
        </button>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask J anything..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button
          type="submit"
          className="p-2 text-primary hover:text-primary/80 transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
};

export default CommandInput;
