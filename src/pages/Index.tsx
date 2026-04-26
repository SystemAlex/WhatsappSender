import WhatsAppSender from "@/components/WhatsAppSender";
import { MadeBy } from "@/components/made-by";

const Index = () => {
  return (
    <div className="h-screen overflow-hidden bg-slate-50 grid grid-rows-[auto_1fr] grid-cols-1 p-4">
      <div className="w-full text-center mb-4">
        <h1 className="text-3xl font-bold text-[#0286D9] mb-2 flex items-center justify-center gap-3">
          <img
            src="/icons/icon-48.png"
            alt="WhatsappSender Logo"
            className="w-9 h-9"
          />
          WhatsappSender
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
