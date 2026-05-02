import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex gap-2 items-center justify-center bg-white/80 backdrop-blur-sm z-[100]">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <span className="text-lg font-black text-primary uppercase tracking-tighter">Loading Chestone Assets...</span>
    </div>
  );
};

export default Loading;
