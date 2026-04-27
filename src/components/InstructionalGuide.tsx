"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Info,
  UserCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const InstructionalGuide = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const shouldBeOpen = !isMobile || isOpen;

  return (
    <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
      <Collapsible open={shouldBeOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2 py-3">
          <CollapsibleTrigger asChild disabled={!isMobile}>
            <CardTitle
              className={`text-sm font-bold flex items-center justify-between gap-2 text-blue-800 ${isMobile ? "cursor-pointer" : ""}`}
            >
              <div className="flex items-center gap-2">
                <Info size={16} /> Guía de Uso Rápido
              </div>
              {isMobile && (
                <div className="text-blue-400">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              )}
            </CardTitle>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="text-xs space-y-3 text-blue-900/80">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex gap-2 text-sm">
                <div className="font-bold text-red-600 shrink-0">
                  <p>
                    <b>Muy importante antes de empezar</b>, Lee los{" "}
                    <a
                      href="https://www.whatsapp.com/legal/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 font-semibold underline inline-flex items-center gap-1"
                    >
                      Términos de Servicio de WhatsApp
                      <ExternalLink size={12} className="shrink-0" />
                    </a>
                    .
                  </p>
                  <p>
                    Usa esta herramienta responsablemente y con consentimiento
                    previo.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="font-bold text-blue-600 shrink-0">1.</div>
                <div className="space-y-1">
                  <p className="flex flex-wrap gap-1">
                    Sube tus contactos (archivo .txt) con el formato:{" "}
                    <b>Nombre;Número</b>{" "}
                    <b className="flex items-center gap-1 text-amber-600">
                      <AlertTriangle size={10} />
                      <span>SOLO números. Sin +, espacios o guiones.</span>
                    </b>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="font-bold text-blue-600 shrink-0">2.</div>
                <div className="space-y-1">
                  <p>
                    Escribe hasta 3 mensajes. El sistema los rotará
                    automáticamente.
                  </p>
                  <p className="text-blue-700/70 text-xs pl-6">
                    <p className="flex flex-wrap gap-1">
                      Usa{" "}
                      <code className="bg-blue-100 px-1 rounded text-blue-700 font-bold">
                        {"{{nombre}}"}
                      </code>{" "}
                      para personalizar tus mensajes.
                      <cite className="flex items-center gap-1">
                        <UserCircle
                          size={10}
                          className="shrink-0 mt-0.5 text-blue-500"
                        />
                        <p>
                          Los contactos sin nombre usarán "amigo/a" por defecto
                          al usar la variable.
                        </p>
                      </cite>
                    </p>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="font-bold text-blue-600 shrink-0">3.</div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1 flex-wrap">
                    <FileText size={12} className="shrink-0" /> Adjunta los
                    archivos 1 por mensaje, formatos soportados:
                    <span className="font-semibold text-blue-700">
                      PNG, JPG, GIF, WEBP, SVG, TXT, HTML, RTF
                    </span>
                  </p>
                  <p className="text-blue-700/70 text-xs pl-6">
                    Los archivos PDF y otros formatos no son soportados por
                    seguridad.
                  </p>
                  <p className="text-blue-700/70 text-xs pl-6">
                    Para que funcione correctamente el envío de adjuntos el
                    navegador debe permanecer en pantalla, y en la pestaña de la
                    extensión.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="font-bold text-blue-600 shrink-0">4.</div>
                <p>
                  Presiona <b>Iniciar</b>. Asegúrate de tener WhatsApp Web
                  vinculado con tu celular.
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default InstructionalGuide;
