"use client";

import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUp, Trash2 } from "lucide-react";

interface MessageTabProps {
  index: number;
  initialValue: string;
  attachment: File | null;
  isAutoMode: boolean;
  isActive: boolean;
  onValueChange: (val: string) => void;
  onFileClick: () => void;
  onFileRemove: () => void;
}

const MessageTab = ({
  index,
  initialValue,
  attachment,
  isAutoMode,
  isActive,
  onValueChange,
  onFileClick,
  onFileRemove,
}: MessageTabProps) => {
  const [localValue, setLocalValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isActive && !isAutoMode && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
        const length = textareaRef.current?.value.length || 0;
        textareaRef.current?.setSelectionRange(length, length);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isActive, isAutoMode]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    onValueChange(newVal);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={localValue}
          onChange={handleChange}
          placeholder={`Escribe aquí el contenido del mensaje ${index + 1}...`}
          className="h-28 resize-none text-sm border-slate-200 focus-visible:ring-blue-500"
          disabled={isAutoMode}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs h-9 border-slate-200 hover:bg-slate-50"
          onClick={onFileClick}
          disabled={isAutoMode}
        >
          <FileUp size={14} className="mr-2 shrink-0" />
          {attachment ? attachment.name : "Adjuntar Archivo"}
        </Button>
        {attachment && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={onFileRemove}
            disabled={isAutoMode}
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageTab);
