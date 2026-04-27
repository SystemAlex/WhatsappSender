"use client";

import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, Play, Pause, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useWhatsAppState, Contact } from "@/hooks/useWhatsAppState";
import { useWhatsAppBridge } from "@/hooks/useWhatsAppBridge";
import { SUPPORTED_FILE_TYPES } from "@/lib/utils";
import MessageTab from "./MessageTab";
import ContactList from "./ContactList";
import ExtensionStatus from "./ExtensionStatus";
import ProcessingStatus from "./ProcessingStatus";
import InstructionalGuide from "./InstructionalGuide";
import { ScrollArea } from "@/components/ui/scroll-area";

const WhatsAppSender = () => {
  const {
    messages,
    attachments,
    phoneList,
    sentIndices,
    setPhoneList,
    setSentIndices,
    updateMessage,
    updateAttachment,
    clearAllMessages,
    addContact,
    updateContact,
  } = useWhatsAppState();

  const [activeTab, setActiveTab] = useState("msg0");
  const [pendingContacts, setPendingContacts] = useState<Contact[]>([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const phoneFileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const activeMsgIndices = useMemo(
    () =>
      [0, 1, 2].filter(
        (i) => messages[i].trim().length > 0 || attachments[i] !== null,
      ),
    [messages, attachments],
  );

  const scrollToItem = useCallback((index: number) => {
    const element = itemRefs.current.get(index);
    if (element)
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const {
    isAutoMode,
    setIsAutoMode,
    isProcessing,
    countdown,
    hasExtension,
    isInsideExt,
    stopAll,
    sendToWhatsApp,
    nextMessageIndex,
  } = useWhatsAppBridge(
    phoneList,
    sentIndices,
    setSentIndices,
    messages,
    attachments,
    activeMsgIndices,
    scrollToItem,
  );

  useEffect(() => {
    if (countdown > 0 && nextMessageIndex !== -1) {
      setActiveTab(`msg${nextMessageIndex}`);
    }
  }, [countdown, nextMessageIndex]);

  const canStart =
    hasExtension &&
    activeMsgIndices.length > 0 &&
    phoneList.length > 0 &&
    phoneList.length - sentIndices.size > 0;

  const handleStart = () => {
    if (!canStart) return;
    const idx = phoneList.findIndex((_, i) => !sentIndices.has(i));
    if (idx !== -1) {
      setIsAutoMode(true);
      scrollToItem(idx);
      sendToWhatsApp(idx);
    }
  };

  const handleClearSingle = (idx: number) => {
    updateMessage(idx, "");
    toast.info(`Texto del mensaje ${idx + 1} borrado.`);
  };

  const handleResetEverything = async () => {
    await clearAllMessages();
    setPhoneList([]);
    setSentIndices(new Set());
    stopAll();
    toast.success("Proyecto reiniciado: contactos y mensajes eliminados.");
  };

  const handleDeleteContact = (index: number) => {
    const newList = [...phoneList];
    newList.splice(index, 1);

    const newSent = new Set<number>();
    sentIndices.forEach((idx) => {
      if (idx < index) newSent.add(idx);
      if (idx > index) newSent.add(idx - 1);
    });

    setPhoneList(newList);
    setSentIndices(newSent);
    toast.info("Contacto eliminado");
  };

  const loadPhones = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const newContacts: Contact[] = lines.map((line) => {
        const parts = line.split(/[;,]|\t| {2,}/).map((p) => p.trim());
        if (parts.length >= 2) {
          const d0 = (parts[0].match(/\d/g) || []).length;
          const d1 = (parts[1].match(/\d/g) || []).length;

          const rawName = d1 >= d0 ? parts[0] : parts[1];
          const rawNum = d1 >= d0 ? parts[1] : parts[0];

          return {
            name: rawName,
            number: rawNum.replace(/\D/g, ""),
          };
        }
        return { name: "", number: parts[0].replace(/\D/g, "") };
      });

      if (phoneList.length > 0) {
        setPendingContacts(newContacts);
        setIsImportDialogOpen(true);
      } else {
        setPhoneList(newContacts);
        setSentIndices(new Set());
        stopAll();
        toast.info(`${newContacts.length} contactos cargados y normalizados`);
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleImportAction = (type: "replace" | "append") => {
    if (type === "replace") {
      setPhoneList(pendingContacts);
      setSentIndices(new Set());
      toast.info(
        `${pendingContacts.length} contactos nuevos (lista reemplazada y normalizada)`,
      );
    } else {
      setPhoneList((prev) => [...prev, ...pendingContacts]);
      toast.info(`${pendingContacts.length} contactos añadidos y normalizados`);
    }
    setPendingContacts([]);
    setIsImportDialogOpen(false);
    stopAll();
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full mx-auto overflow-hidden relative">
      <ExtensionStatus
        isInsideExt={isInsideExt}
        hasExtension={hasExtension}
        activeMsgsCount={activeMsgIndices.length}
        hasPhones={phoneList.length > 0}
      />

      <AlertDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Importar Contactos</AlertDialogTitle>
            <AlertDialogDescription>
              Ya tienes {phoneList.length} contactos cargados. ¿Qué deseas hacer
              con los nuevos contactos?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => handleImportAction("append")}
            >
              Anexar a la lista
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleImportAction("replace")}
            >
              Reemplazar lista actual
            </Button>
            <AlertDialogCancel onClick={() => setPendingContacts([])}>
              Cancelar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ScrollArea className="h-1/2 md:h-full overflow-y-auto md:w-1/2">
        <div className="space-y-4 w-full">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                  Mensajes
                  <Badge variant="secondary">
                    {activeMsgIndices.length} Activos
                  </Badge>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      disabled={isAutoMode}
                    >
                      <PlusCircle size={14} className="mr-1" /> Nuevo
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Iniciar nuevo proyecto?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará <b>todo</b>, los mensajes,
                        archivos adjuntos y la lista de contactos cargada
                        actualmente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResetEverything}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Reiniciar Todo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <TabsTrigger
                      key={i}
                      value={`msg${i}`}
                      className={`relative overflow-visible ${messages[i] || attachments[i] ? "text-blue-600 font-bold" : ""}`}
                    >
                      Msg {i + 1}
                      {activeTab === `msg${i}` &&
                        messages[i] &&
                        !isAutoMode && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearSingle(i);
                            }}
                          >
                            <Trash2 size={12} />
                          </Button>
                        )}
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
                      isActive={activeTab === `msg${i}`}
                      onValueChange={(val) => updateMessage(i, val)}
                      onFileClick={() =>
                        attachmentInputRefs[i].current?.click()
                      }
                      onFileRemove={() => updateAttachment(i, null)}
                    />
                    <input
                      type="file"
                      className="hidden"
                      title="Mensaje"
                      aria-label="Mensaje"
                      accept={SUPPORTED_FILE_TYPES.join(",")}
                      ref={attachmentInputRefs[i]}
                      onChange={(e) =>
                        updateAttachment(i, e.target.files?.[0] || null)
                      }
                    />
                  </TabsContent>
                ))}
              </Tabs>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSentIndices(new Set());
                    stopAll();
                    toast.info("Progreso reseteado.");
                  }}
                  disabled={isAutoMode}
                >
                  <RotateCcw size={14} className="mr-2" /> Resetear Progreso
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
                  disabled={isAutoMode ? isProcessing : !canStart}
                >
                  {isAutoMode ? (
                    <Pause size={14} className="mr-2" />
                  ) : (
                    <Play size={14} className="mr-2" />
                  )}
                  {isAutoMode
                    ? isProcessing
                      ? "Procesando..."
                      : "Parar"
                    : "Iniciar"}
                </Button>
              </div>
              <input
                type="file"
                accept=".txt"
                className="hidden"
                title="Cargar números"
                aria-label="Cargar números"
                ref={phoneFileInputRef}
                onChange={loadPhones}
              />
            </CardContent>
          </Card>

          <ProcessingStatus
            isProcessing={isProcessing}
            countdown={countdown}
            isAutoMode={isAutoMode}
          />

          <InstructionalGuide />
        </div>
      </ScrollArea>

      <ContactList
        phoneList={phoneList}
        sentIndices={sentIndices}
        nextToProcess={
          isAutoMode ? phoneList.findIndex((_, i) => !sentIndices.has(i)) : -1
        }
        itemRefs={itemRefs}
        onClearContacts={() => {
          setPhoneList([]);
          setSentIndices(new Set());
          stopAll();
          toast.info("Lista vaciada.");
        }}
        onDeleteContact={handleDeleteContact}
        onAddContact={addContact}
        onUpdateContact={updateContact}
        onImportClick={() => phoneFileInputRef.current?.click()}
        isAutoMode={isAutoMode}
      />
    </div>
  );
};

export default WhatsAppSender;
