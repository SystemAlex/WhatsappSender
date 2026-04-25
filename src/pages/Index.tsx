import WhatsAppSender from "@/components/WhatsAppSender";
import { MadeBy } from "@/components/made-by";

const Index = () => {
  return (
    <div className="h-full overflow-hidden bg-slate-50 grid grid-rows-[auto_1fr] grid-cols-1 p-4">
      <div className="w-full text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Extensión de Envío Rápido
        </h1>
        <p className="text-slate-600">
          Usa esta herramienta para enviar mensajes directos a través de
          WhatsApp Web.
        </p>
      </div>

      <WhatsAppSender />

      <MadeBy />
    </div>
  );
};

export default Index;
