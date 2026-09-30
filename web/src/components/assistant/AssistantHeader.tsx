import { useAssistantStore } from "../../store/assistant.store";
import { X, Bot, Maximize2, Minimize2 } from "lucide-react";

export function AssistantHeader() {
  const { toggleOpen, clearMessages, setAction, activeAction, isFullScreen, toggleFullScreen } = useAssistantStore();

  const handleReset = () => {
    clearMessages();
    setAction(null);
  };

  return (
    <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white text-slate-900 rounded-lg flex items-center justify-center">
          <Bot size={18} />
        </div>
        <div>
          <h2 className="font-semibold text-sm">Approvals</h2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {!activeAction ? (
          <button 
            onClick={() => {
              // Quick and simple trigger for greeting
              setAction("greeting");
            }} 
            className="text-[10px] text-amber-500 hover:text-amber-400 uppercase font-semibold tracking-wider transition-colors"
          >
            Replay Greeting
          </button>
        ) : (
          <button onClick={handleReset} className="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors">
            Reset
          </button>
        )}
        <button onClick={toggleFullScreen} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
          {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
        <button onClick={toggleOpen} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
