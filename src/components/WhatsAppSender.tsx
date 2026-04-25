"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Pause,
  RotateCcw,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Timer,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { saveAttachmentDB, getAttachmentsDB } from "@/utils/db";
import MessageTab from "./MessageTab";
import ContactList from "./ContactList";

interface ChromeRuntime {
  runtime?: {
    id?: string;
  };
}

const WhatsAppSender = () => {
  const [messages, setMessages] = useState<string[]>(() => {
    const saved = localStorage.getItem("wa_messages");
    return saved ? JSON.parse(saved) : ["", "", ""];
  });

  const [attachments, setAttachments] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [phoneList, setPhoneList] = useState<string[]>(() => {
    const saved = localStorage.getItem("wa_phones");
    return saved ? JSON.parse(saved) : [];
  });

  const [sentIndices, setSentIndices] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("wa_sent");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [hasExtension, setHasExtension] = useState(false);

  const phoneFileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const currentIndexRef = useRef<number>(-1);

  useEffect(() => {
    const loadFiles = async () => {
      const savedFiles = await getAttachmentsDB();
      setAttachments(savedFiles);
    };
    loadFiles();
  }, []);

  const activeMsgIndices = useMemo(
    () =>
      [0, 1, 2].filter(
        (i) => messages[i].trim().length > 0 || attachments[i] !== null,
      ),
    [messages, attachments],
  );

  useEffect(() => {
    const check = () => {
      const isContentScriptInjected =
        document.documentElement.dataset.waExtensionInstalled === "true";
      const chromeWindow = window as unknown as ChromeRuntime & {
        chrome?: { runtime?: { id?: string } };
      };
      const isInsideExtension =
        typeof chromeWindow.chrome !== "undefined" &&
        !!chromeWindow.chrome?.runtime &&
        !!chromeWindow.chrome?.runtime?.id;

      setHasExtension(isContentScriptInjected || isInsideExtension);
    };

    check();
    const interval = setInterval(check, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("wa_messages", JSON.stringify(messages));
    localStorage.setItem("wa_phones", JSON.stringify(phoneList));
    localStorage.setItem("wa_sent", JSON.stringify(Array.from(sentIndices)));
  }, [messages, phoneList, sentIndices]);

  const stopAll = useCallback(() => {
    setIsAutoMode(false);
    setIsProcessing(false);
    setCountdown(0);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const scrollToItem = (index: number) => {
    const element = itemRefs.current.get(index);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const copyToClipboard = async (file: File) => {
    try {
      const data = [new ClipboardItem({ [file.type]: file })];
      await navigator.clipboard.write(data);
    } catch (err) {
      console.error("Error al copiar archivo:", err);
    }
  };

  const sendToWhatsApp = useCallback(
    async (index: number) => {
      if (
        index < 0 ||
        index >= phoneList.length ||
        activeMsgIndices.length === 0
      ) {
        stopAll();
        return;
      }
      currentIndexRef.current = index;
      const rotationIdx = index % activeMsgIndices.length;
      const realMsgIndex = activeMsgIndices[rotationIdx];
      const currentMsg = messages[realMsgIndex];
      const currentFile = attachments[realMsgIndex];

      if (currentFile) await copyToClipboard(currentFile);

      const phone = phoneList[index].replace(/\D/g, "");
      const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(currentMsg)}`;

      setIsProcessing(true);
      window.postMessage({ type: "WA_SENDER_START_SINGLE", url }, "*");
    },
    [messages, attachments, phoneList, activeMsgIndices, stopAll],
  );

  useEffect(() => {
    const handleBridge = (event: MessageEvent) => {
      if (event.data?.type === "WA_SENDER_NEXT") {
        setIsProcessing(false);
        const lastIndex = currentIndexRef.current;
        setSentIndices((prev) => new Set(prev).add(lastIndex));

        if (isAutoMode) {
          const nextIdx = phoneList.findIndex(
            (_, i) => !sentIndices.has(i) && i !== lastIndex,
          );
          if (nextIdx === -1) {
            toast.success("Secuencia finalizada");
            stopAll();
            return;
          }

          scrollToItem(nextIdx);
          let timer = 30;
          setCountdown(timer);
          countdownIntervalRef.current = setInterval(() => {
            timer -= 1;
            setCountdown(timer);
            if (timer <= 0) {
              if (countdownIntervalRef.current)
                clearInterval(countdownIntervalRef.current);
              setCountdown(0);
              if (isAutoMode) sendToWhatsApp(nextIdx);
            }
          }, 1000);
        }
      }
    };
    window.addEventListener("message", handleBridge);
    return () => {
      window.removeEventListener("message", handleBridge);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, [isAutoMode, phoneList, sentIndices, sendToWhatsApp, stopAll]);

  const hasPhones = phoneList.length > 0;
  const pendingCount = phoneList.length - sentIndices.size;
  const canStart =
    hasExtension &&
    activeMsgIndices.length > 0 &&
    hasPhones &&
    pendingCount > 0;

  const handleStart = () => {
    if (!canStart) return;
    const idx = phoneList.findIndex((_, i) => !sentIndices.has(i));
    if (idx !== -1) {
      setIsAutoMode(true);
      scrollToItem(idx);
      sendToWhatsApp(idx);
    }
  };

  const handleMsgChange = (idx: number, val: string) => {
    setMessages((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleFileChange = async (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement> | { target: { files: File[] } },
  ) => {
    const file = e.target.files?.[0] || null;
    const newFiles = [...attachments];
    newFiles[idx] = file;
    setAttachments(newFiles);
    await saveAttachmentDB(idx, file);
    if (file) toast.success(`Archivo "${file.name}" guardado.`);
  };

  const handleReset = async () => {
    setSentIndices(new Set());
    stopAll();
    toast.info("Progreso reseteado.");
  };

  const loadPhones = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = (ev.target?.result as string)
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      setPhoneList(lines);
      setSentIndices(new Set());
      stopAll();
      toast.info(`${lines.length} números cargados`);
    };
    reader.readAsText(file);
  };

  const nextToProcess = isAutoMode
    ? phoneList.findIndex((_, i) => !sentIndices.has(i))
    : -1;

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full mx-auto px-4 overflow-hidden">
      <div className="md:fixed top-3 right-2 space-y-4">
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

        {activeMsgIndices.length === 0 && hasPhones && (
          <div className="bg-amber-50 border-l-4 rounded border-amber-500 p-3 text-xs text-amber-700 flex items-center gap-2 drop-shadow-md">
            <AlertCircle size={14} />
            Escribe al menos un mensaje o adjunta un archivo para iniciar.
          </div>
        )}
      </div>

      <div className="space-y-4 w-full md:w-1/2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              Configuración Rotativa
              <Badge variant="secondary">
                {activeMsgIndices.length} Activos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="msg0" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <TabsTrigger
                    key={i}
                    value={`msg${i}`}
                    className={
                      messages[i] || attachments[i]
                        ? "text-blue-600 font-bold"
                        : ""
                    }
                  >
                    Msg {i + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {[0, 1, 2].map((i) => (
                <TabsContent key={i} value={`msg${i}`}>
                  <MessageTab
                    index={i}
                    initialValue={messages[i]}
                    attachment={attachments[i]}
                    isAutoMode={isAutoMode}
                    onValueChange={(val) => handleMsgChange(i, val)}
                    onFileClick={() => attachmentInputRefs[i].current?.click()}
                    onFileRemove={() =>
                      handleFileChange(i, { target: { files: [] } })
                    }
                  />
                  <input
                    type="file"
                    className="hidden"
                    title="Mensaje"
                    aria-label="Mensaje"
                    ref={attachmentInputRefs[i]}
                    onChange={(e) => handleFileChange(i, e)}
                  />
                </TabsContent>
              ))}
            </Tabs>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <Button
                variant="outline"
                onClick={() => phoneFileInputRef.current?.click()}
                disabled={isAutoMode}
              >
                <FileText size={14} className="mr-2" /> Números
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isAutoMode}
              >
                <RotateCcw size={14} className="mr-2" /> Reset
              </Button>
              <Button
                variant={isAutoMode ? "destructive" : "default"}
                onClick={isAutoMode ? stopAll : handleStart}
                className={
                  !isAutoMode
                    ? canStart
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-slate-200"
                    : ""
                }
                disabled={isAutoMode ? false : !canStart}
              >
                {isAutoMode ? (
                  <Pause size={14} className="mr-2" />
                ) : (
                  <Play size={14} className="mr-2" />
                )}
                {isAutoMode ? "Parar" : "Iniciar"}
              </Button>
            </div>
            <input
              type="file"
              accept=".txt"
              className="hidden"
              title="Adjuntar archivo"
              aria-label="Adjuntar archivo"
              ref={phoneFileInputRef}
              onChange={loadPhones}
            />
          </CardContent>
        </Card>

        {isProcessing && (
          <div className="bg-green-600 text-white p-5 rounded-xl flex items-center gap-4 shadow-lg">
            <Loader2 className="animate-spin" />
            <div>
              <p className="font-semibold leading-none">WhatsApp Activo</p>
              <p className="text-xs opacity-80 mt-1">Procesando envío...</p>
            </div>
          </div>
        )}

        {countdown > 0 && isAutoMode && (
          <div className="bg-slate-900 text-white p-5 rounded-xl flex items-center gap-4 border-b-4 border-blue-500 shadow-lg">
            <Timer className="text-blue-400 animate-pulse" />
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">
                Próximo envío en
              </p>
              <p className="text-2xl font-mono text-blue-400">{countdown}s</p>
            </div>
          </div>
        )}
      </div>

      <ContactList
        phoneList={phoneList}
        sentIndices={sentIndices}
        nextToProcess={nextToProcess}
        itemRefs={itemRefs}
      />
    </div>
  );
};

export default WhatsAppSender;
