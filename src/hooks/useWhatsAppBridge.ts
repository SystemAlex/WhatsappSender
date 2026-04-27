import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Contact } from "./useWhatsAppState";
import { SUPPORTED_FILE_TYPES } from "@/lib/utils";

interface ChromeRuntime extends Window {
  chrome?: {
    runtime?: {
      id?: string;
      onMessage: {
        addListener: (
          callback: (message: any, sender: any, sendResponse: any) => void,
        ) => void;
        removeListener: (
          callback: (message: any, sender: any, sendResponse: any) => void,
        ) => void;
      };
      sendMessage: (
        message: any,
        responseCallback?: (response: any) => void,
      ) => void;
    };
    storage?: {
      local: {
        set: (items: { [key: string]: any }, callback?: () => void) => void;
      };
    };
  };
}

export const useWhatsAppBridge = (
  phoneList: Contact[],
  sentIndices: Set<number>,
  setSentIndices: React.Dispatch<React.SetStateAction<Set<number>>>,
  messages: string[],
  attachments: (File | null)[],
  activeMsgIndices: number[],
  scrollToItem: (idx: number) => void,
) => {
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [hasExtension, setHasExtension] = useState(false);
  const [isInsideExt, setIsInsideExt] = useState(false);
  const [nextMessageIndex, setNextMessageIndex] = useState<number>(-1);

  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const currentIndexRef = useRef<number>(-1);

  const phoneListRef = useRef(phoneList);
  const sentIndicesRef = useRef(sentIndices);
  const messagesRef = useRef(messages);
  const attachmentsRef = useRef(attachments);
  const activeMsgIndicesRef = useRef(activeMsgIndices);

  useEffect(() => {
    phoneListRef.current = phoneList;
    sentIndicesRef.current = sentIndices;
    messagesRef.current = messages;
    attachmentsRef.current = attachments;
    activeMsgIndicesRef.current = activeMsgIndices;
  }, [phoneList, sentIndices, messages, attachments, activeMsgIndices]);

  useEffect(() => {
    const check = () => {
      const isContentScriptInjected =
        document.documentElement.dataset.waExtensionInstalled === "true";
      const chromeWindow = window as unknown as ChromeRuntime;
      const isInside =
        typeof chromeWindow.chrome !== "undefined" &&
        !!chromeWindow.chrome?.runtime &&
        !!chromeWindow.chrome?.runtime?.id;

      setIsInsideExt(isInside);
      setHasExtension(isContentScriptInjected || isInside);
    };
    check();
    const interval = setInterval(check, 100);
    return () => clearInterval(interval);
  }, []);

  const stopAll = useCallback(() => {
    setIsAutoMode(false);
    setIsProcessing(false);
    setCountdown(0);
    setNextMessageIndex(-1);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const copyToClipboard = async (file: File): Promise<boolean> => {
    try {
      const isMimeTypeSupported = SUPPORTED_FILE_TYPES.includes(file.type);

      if (!isMimeTypeSupported) {
        console.warn(
          `Tipo de archivo no soportado en portapapeles: ${file.type}. Solo se soportan: ${SUPPORTED_FILE_TYPES.join(", ")}`,
        );
        return false;
      }

      const data = [new ClipboardItem({ [file.type]: file })];
      await navigator.clipboard.write(data);
      return true;
    } catch (err) {
      console.error("Error al copiar archivo:", err);
      return false;
    }
  };

  const sendToWhatsApp = useCallback(
    async (index: number) => {
      const currentPhones = phoneListRef.current;
      const currentActiveIndices = activeMsgIndicesRef.current;

      if (
        index < 0 ||
        index >= currentPhones.length ||
        currentActiveIndices.length === 0
      ) {
        stopAll();
        return;
      }

      currentIndexRef.current = index;
      const rotationIdx = index % currentActiveIndices.length;
      const realMsgIndex = currentActiveIndices[rotationIdx];
      let currentMsg = messagesRef.current[realMsgIndex];
      const currentFile = attachmentsRef.current[realMsgIndex];

      const contact = currentPhones[index];
      const firstName = contact.name.trim() || "amigo/a";
      currentMsg = currentMsg.replace(/{{nombre}}/gi, firstName);

      let copySuccess = false;
      if (currentFile) {
        copySuccess = await copyToClipboard(currentFile);
        if (!copySuccess) {
          const supportedFormats = ["JPG", "PNG", "GIF", "WEBP", "TXT", "HTML"];
          toast.error(
            `Tipo de archivo no soportado: ${currentFile.name}. Formatos permitidos: ${supportedFormats.join(", ")}`,
          );
        }
      }

      const phone = currentPhones[index].number.replace(/\D/g, "");
      const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(currentMsg)}`;

      setIsProcessing(true);

      const chromeWindow = window as unknown as ChromeRuntime;
      const chrome = chromeWindow.chrome;

      if (isInsideExt && chrome?.runtime?.sendMessage) {
        if (chrome.storage?.local) {
          chrome.storage.local.set(
            { currentHasAttachment: copySuccess },
            () => {
              chrome.runtime?.sendMessage({
                type: "OPEN_WHATSAPP",
                url: url,
                hasAttachment: copySuccess,
              });
            },
          );
        } else {
          chrome.runtime.sendMessage({
            type: "OPEN_WHATSAPP",
            url: url,
            hasAttachment: copySuccess,
          });
        }
      } else {
        window.postMessage(
          { type: "WA_SENDER_START_SINGLE", url, hasAttachment: copySuccess },
          "*",
        );
      }
    },
    [stopAll, isInsideExt],
  );

  useEffect(() => {
    const handleBridge = (event: MessageEvent) => {
      if (event.data?.type === "WA_SENDER_NEXT") {
        setIsProcessing(false);
        const lastIndex = currentIndexRef.current;
        if (lastIndex === -1) return;

        setSentIndices((prev) => new Set(prev).add(lastIndex));

        if (isAutoMode) {
          const nextIdx = phoneListRef.current.findIndex(
            (_, i) => !sentIndicesRef.current.has(i) && i !== lastIndex,
          );

          if (nextIdx === -1) {
            toast.success("Secuencia finalizada");
            stopAll();
            return;
          }

          scrollToItem(nextIdx);

          const rotationIdx = nextIdx % activeMsgIndicesRef.current.length;
          const realMsgIndex = activeMsgIndicesRef.current[rotationIdx];
          setNextMessageIndex(realMsgIndex);

          let timer = 30;
          setCountdown(timer);

          if (countdownIntervalRef.current)
            clearInterval(countdownIntervalRef.current);

          countdownIntervalRef.current = setInterval(() => {
            timer -= 1;
            setCountdown(timer);
            if (timer <= 0) {
              if (countdownIntervalRef.current)
                clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
              setCountdown(0);
              sendToWhatsApp(nextIdx);
            }
          }, 1000);
        }
      }
    };

    const chromeWindow = window as unknown as ChromeRuntime;
    const chromeListener = (request: any) => {
      if (request.type === "NEXT_STEP") {
        window.postMessage({ type: "WA_SENDER_NEXT" }, "*");
      }
    };

    if (isInsideExt && chromeWindow.chrome?.runtime?.onMessage) {
      chromeWindow.chrome.runtime.onMessage.addListener(chromeListener);
    }

    window.addEventListener("message", handleBridge);
    return () => {
      window.removeEventListener("message", handleBridge);
      if (isInsideExt && chromeWindow.chrome?.runtime?.onMessage) {
        chromeWindow.chrome.runtime.onMessage.removeListener(chromeListener);
      }
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, [
    isAutoMode,
    sendToWhatsApp,
    stopAll,
    setSentIndices,
    scrollToItem,
    isInsideExt,
    // Eliminado phoneList de aquí porque usamos phoneListRef.current
  ]);

  return {
    isAutoMode,
    setIsAutoMode,
    isProcessing,
    countdown,
    hasExtension,
    isInsideExt,
    stopAll,
    sendToWhatsApp,
    nextMessageIndex,
  };
};
