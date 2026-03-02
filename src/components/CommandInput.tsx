import { useState } from "react";
import { Send, Mic, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const CommandInput = () => {
  const [value, setValue] = useState("");

  const sendCommandMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch(`${API_BASE_URL}/api/commands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error("Failed to send command");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Command sent to J");
      setValue("");
    },
    onError: () => {
      toast.error("Failed to connect to J");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    sendCommandMutation.mutate(value);
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
          disabled={sendCommandMutation.isPending}
          className="p-2 text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
};

export default CommandInput;
