import { useState, useEffect } from "react";
import {
  saveAttachmentDB,
  getAttachmentsDB,
  clearAttachmentsDB,
} from "@/utils/db";
import { toast } from "sonner";
import { SUPPORTED_FILE_TYPES } from "@/lib/utils";

export interface Contact {
  name: string;
  number: string;
}

export const useWhatsAppState = () => {
  const [messages, setMessages] = useState<string[]>(() => {
    const saved = localStorage.getItem("wa_messages");
    return saved ? JSON.parse(saved) : ["", "", ""];
  });

  const [attachments, setAttachments] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);

  const [phoneList, setPhoneList] = useState<Contact[]>(() => {
    const saved = localStorage.getItem("wa_phones");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((item: string | Contact) =>
        typeof item === "string" ? { name: "", number: item } : item,
      );
    } catch {
      return [];
    }
  });

  const [sentIndices, setSentIndices] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("wa_sent");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    const loadFiles = async () => {
      const savedFiles = await getAttachmentsDB();
      setAttachments(savedFiles);
    };
    loadFiles();
  }, []);

  useEffect(() => {
    localStorage.setItem("wa_messages", JSON.stringify(messages));
    localStorage.setItem("wa_phones", JSON.stringify(phoneList));
    localStorage.setItem("wa_sent", JSON.stringify(Array.from(sentIndices)));
  }, [messages, phoneList, sentIndices]);

  const updateMessage = (idx: number, val: string) => {
    setMessages((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const updateAttachment = async (idx: number, file: File | null) => {
    if (file && !SUPPORTED_FILE_TYPES.includes(file.type)) {
      toast.error(
        `Tipo de archivo no soportado. Formatos permitidos: PNG, JPG, GIF, WEBP, SVG, TXT, HTML, RTF`,
      );
      return;
    }
    const next = [...attachments];
    next[idx] = file;
    setAttachments(next);
    await saveAttachmentDB(idx, file);
  };

  const clearAllMessages = async () => {
    setMessages(["", "", ""]);
    setAttachments([null, null, null]);
    await clearAllMessagesDB();
  };

  const clearAllMessagesDB = async () => {
    await clearAttachmentsDB();
  };

  const addContact = (contact: Contact) => {
    setPhoneList((prev) => [...prev, contact]);
  };

  const updateContact = (index: number, contact: Contact) => {
    setPhoneList((prev) => {
      const next = [...prev];
      next[index] = contact;
      return next;
    });
  };

  return {
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
  };
};
