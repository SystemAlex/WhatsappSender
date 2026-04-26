"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contact } from "@/hooks/useWhatsAppState";
import { AlertCircle } from "lucide-react";

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (contact: Contact) => void;
  initialData?: Contact;
  title: string;
}

const ContactFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}: ContactFormDialogProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [number, setNumber] = useState(initialData?.number || "");

  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
      setNumber(initialData?.number || "");
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return;
    onSubmit({ name, number: number.trim() });
    onOpenChange(false);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    setNumber(onlyNums);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre (Opcional)</Label>
            <Input
              id="name"
              placeholder="Ej: Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number" className="flex items-center gap-1.5">
              Número de Teléfono
            </Label>
            <Input
              id="number"
              type="text"
              inputMode="numeric"
              placeholder="Ej: 5491112345678"
              value={number}
              onChange={handleNumberChange}
              required
            />
            <div className="flex items-start gap-1.5 p-2 bg-amber-50 rounded border border-amber-100">
              <AlertCircle
                size={14}
                className="text-amber-600 mt-0.5 shrink-0"
              />
              <p className="text-[10px] text-amber-700 leading-tight">
                <strong>IMPORTANTE:</strong> Solo dígitos. Incluye código de
                país <strong>SIN</strong> el signo "+", espacios ni guiones.
              </p>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Guardar Contacto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormDialog;
