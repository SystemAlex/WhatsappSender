import { ShieldCheck, AlertCircle } from "lucide-react";

interface ExtensionStatusProps {
  isInsideExt: boolean;
  hasExtension: boolean;
  activeMsgsCount: number;
  hasPhones: boolean;
}

const ExtensionStatus = ({
  isInsideExt,
  hasExtension,
  activeMsgsCount,
  hasPhones,
}: ExtensionStatusProps) => {
  return (
    <div className="md:fixed top-3 right-2 space-y-4 z-50">
      {!isInsideExt && (
        <div
          className={`p-4 border-l-4 rounded drop-shadow-md text-sm flex items-center gap-3 ${hasExtension ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"}`}
        >
          {hasExtension ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
          <p>
            {hasExtension
              ? "Bridge Conectado"
              : "Extensión no detectada (Cargá /dist)"}
          </p>
        </div>
      )}

      {activeMsgsCount === 0 && hasPhones && (
        <div className="bg-amber-50 border-l-4 rounded border-amber-500 p-3 text-xs text-amber-700 flex items-center gap-2 drop-shadow-md">
          <AlertCircle size={14} />
          Escribe al menos un mensaje o adjunta un archivo para iniciar.
        </div>
      )}
    </div>
  );
};

export default ExtensionStatus;
