"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2 as CheckIcon,
  Send as SendIcon,
  Trash2,
  Search,
  UserPlus,
  Pencil,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Contact } from "@/hooks/useWhatsAppState";
import ContactFormDialog from "./ContactFormDialog";

interface ContactListProps {
  phoneList: Contact[];
  sentIndices: Set<number>;
  nextToProcess: number;
  itemRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
  onClearContacts: () => void;
  onDeleteContact: (index: number) => void;
  onAddContact: (contact: Contact) => void;
  onUpdateContact: (index: number, contact: Contact) => void;
  onImportClick: () => void;
  isAutoMode: boolean;
}

const ContactList = ({
  phoneList,
  sentIndices,
  nextToProcess,
  itemRefs,
  onClearContacts,
  onDeleteContact,
  onAddContact,
  onUpdateContact,
  onImportClick,
  isAutoMode,
}: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<{
    index: number;
    contact: Contact;
  } | null>(null);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return phoneList.map((c, i) => ({ ...c, originalIndex: i }));
    }
    const q = searchQuery.toLowerCase();
    return phoneList
      .map((c, i) => ({ ...c, originalIndex: i }))
      .filter((c) => c.name.toLowerCase().includes(q) || c.number.includes(q));
  }, [phoneList, searchQuery]);

  return (
    <Card className="flex flex-col w-full md:w-1/2 overflow-hidden border-slate-200">
      <CardHeader className="bg-slate-50 border-b py-3 flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-[10px] md:text-xs font-bold uppercase shrink-0 text-slate-600">
          Contactos ({sentIndices.size}/{phoneList.length})
        </CardTitle>

        <div className="relative flex-1 max-w-[200px]">
          <Search
            size={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <Input
            placeholder="Buscar..."
            className="h-8 pl-8 text-xs bg-white border-slate-200 focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isAutoMode && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={onImportClick}
                title="Importar archivo .txt"
              >
                <FileText size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => setIsAddOpen(true)}
                title="Agregar contacto manual"
              >
                <UserPlus size={14} />
              </Button>
            </>
          )}

          {phoneList.length > 0 && !isAutoMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                  title="Vaciar lista"
                >
                  <Trash2 size={14} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Vaciar lista de contactos?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Se eliminarán todos los números cargados actualmente y se
                    reiniciará el progreso de envío.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onClearContacts}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Vaciar Lista
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Badge
            variant="outline"
            className="hidden lg:inline-flex font-mono text-[10px] border-slate-300 text-slate-600"
          >
            {sentIndices.size === phoneList.length && phoneList.length > 0
              ? "COMPLETO"
              : "PENDIENTE"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full overflow-y-auto">
          {filteredContacts.map((contact) => {
            const i = contact.originalIndex;
            const isNext = i === nextToProcess;
            const isSent = sentIndices.has(i);

            return (
              <div
                key={i}
                ref={(el) => {
                  if (el) {
                    itemRefs.current.set(i, el);
                  } else {
                    itemRefs.current.delete(i);
                  }
                }}
                className={`group flex items-center justify-between p-3 border-b border-slate-100 text-sm transition-colors duration-300 ${
                  isSent
                    ? "bg-green-50 text-green-700 font-medium"
                    : isNext
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xs text-slate-400 text-center min-w-7 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex gap-1 overflow-hidden">
                    {contact.name && (
                      <span className="font-mono text-slate-700">
                        {contact.name} -
                      </span>
                    )}
                    <span className="font-mono font-bold text-slate-700">
                      {contact.number}
                    </span>
                  </div>
                  {isNext && (
                    <Badge className="text-[9px] bg-blue-500 animate-pulse shrink-0">
                      SIGUIENTE
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {!isAutoMode && !isSent && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all outline-none"
                        onClick={() => setEditingContact({ index: i, contact })}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all outline-none"
                        onClick={() => onDeleteContact(i)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </>
                  )}
                  {isSent ? (
                    <CheckIcon size={16} className="text-green-600" />
                  ) : (
                    <SendIcon size={14} className="text-slate-300" />
                  )}
                </div>
              </div>
            );
          })}
          {filteredContacts.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm italic">
              {phoneList.length === 0
                ? "No hay contactos cargados."
                : "No se encontraron coincidencias."}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <ContactFormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={onAddContact}
        title="Agregar Nuevo Contacto"
      />

      <ContactFormDialog
        open={!!editingContact}
        onOpenChange={(open) => !open && setEditingContact(null)}
        initialData={editingContact?.contact}
        onSubmit={(contact) => {
          if (editingContact) {
            onUpdateContact(editingContact.index, contact);
          }
        }}
        title="Editar Contacto"
      />
    </Card>
  );
};

export default React.memo(ContactList);
