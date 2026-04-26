import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Contact } from "./useWhatsAppState";

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

  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const currentIndexRef = useRef<number>(-1);

  // Mantenemos referencias actualizadas para evitar reinicios de efectos
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
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

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
      const currentMsg = messagesRef.current[realMsgIndex];
      const currentFile = attachmentsRef.current[realMsgIndex];

      if (currentFile) await copyToClipboard(currentFile);

      const phone = currentPhones[index].number.replace(/\D/g, "");
      const url = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(currentMsg)}`;

      setIsProcessing(true);

      const chromeWindow = window as unknown as ChromeRuntime;

      if (isInsideExt && chromeWindow.chrome?.runtime?.sendMessage) {
        if (chromeWindow.chrome.storage?.local) {
          chromeWindow.chrome.storage.local.set(
            { currentHasAttachment: !!currentFile },
            () => {
              chromeWindow.chrome.runtime?.sendMessage({
                type: "OPEN_WHATSAPP",
                url: url,
                hasAttachment: !!currentFile,
              });
            },
          );
        } else {
          chromeWindow.chrome.runtime.sendMessage({
            type: "OPEN_WHATSAPP",
            url: url,
            hasAttachment: !!currentFile,
          });
        }
      } else {
        window.postMessage(
          { type: "WA_SENDER_START_SINGLE", url, hasAttachment: !!currentFile },
          "*",
        );
      }
    },
    [stopAll, isInsideExt], // Dependencias mínimas y estables
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
  };
};
