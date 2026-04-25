"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

interface MessageTabProps {
  index: number;
  initialValue: string;
  attachment: File | null;
  isAutoMode: boolean;
  onValueChange: (val: string) => void;
  onFileClick: () => void;
  onFileRemove: () => void;
}

const MessageTab = ({
  index,
  initialValue,
  attachment,
  isAutoMode,
  onValueChange,
  onFileClick,
  onFileRemove,
}: MessageTabProps) => {
  const [localValue, setLocalValue] = useState(initialValue);

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    onValueChange(newVal);
  };

  return (
    <div className="space-y-3 pt-2">
      <Textarea
        value={localValue}
        onChange={handleChange}
        placeholder={`Contenido del mensaje ${index + 1}...`}
        className="h-24 resize-none"
        disabled={isAutoMode}
      />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full overflow-hidden text-ellipsis whitespace-nowrap"
          onClick={onFileClick}
          disabled={isAutoMode}
        >
          <FileUp size={14} className="mr-2 shrink-0" />
          {attachment ? attachment.name : "Adjuntar Archivo"}
        </Button>
        {attachment && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFileRemove}
            disabled={isAutoMode}
          >
            ✕
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageTab);
