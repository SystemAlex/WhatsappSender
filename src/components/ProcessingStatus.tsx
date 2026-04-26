import { Loader2, Timer } from "lucide-react";

interface ProcessingStatusProps {
  isProcessing: boolean;
  countdown: number;
  isAutoMode: boolean;
}

const ProcessingStatus = ({
  isProcessing,
  countdown,
  isAutoMode,
}: ProcessingStatusProps) => {
  return (
    <>
      {isProcessing && (
        <div className="bg-green-600 text-white p-5 rounded-xl flex items-center gap-4 shadow-lg animate-in fade-in zoom-in duration-300">
          <Loader2 className="animate-spin" />
          <div>
            <p className="font-semibold leading-none">WhatsApp Activo</p>
            <p className="text-xs opacity-80 mt-1">Procesando envío...</p>
          </div>
        </div>
      )}

      {countdown > 0 && isAutoMode && (
        <div className="bg-slate-900 text-white p-5 rounded-xl flex items-center gap-4 border-b-4 border-blue-500 shadow-lg animate-in fade-in zoom-in duration-300">
          <Timer className="text-blue-400 animate-pulse" />
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">
              Próximo envío en
            </p>
            <p className="text-2xl font-mono text-blue-400">{countdown}s</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProcessingStatus;
