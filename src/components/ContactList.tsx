"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2 as CheckIcon, Send as SendIcon } from "lucide-react";

interface ContactListProps {
  phoneList: string[];
  sentIndices: Set<number>;
  nextToProcess: number;
  itemRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
}

const ContactList = ({
  phoneList,
  sentIndices,
  nextToProcess,
  itemRefs,
}: ContactListProps) => {
  return (
    <Card className="flex flex-col w-full md:w-1/2 overflow-hidden">
      <CardHeader className="bg-slate-50 border-b py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase">
          Contactos ({sentIndices.size}/{phoneList.length})
        </CardTitle>
        <Badge variant="outline" className="font-mono text-[10px]">
          {sentIndices.size === phoneList.length ? "COMPLETO" : "PENDIENTE"}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full overflow-y-auto">
          {phoneList.map((num, i) => {
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
                className={`flex items-center justify-between p-3 border-b text-sm transition-colors duration-300 ${
                  isSent
                    ? "bg-green-50 text-green-700 font-medium"
                    : isNext
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                  <span className="font-mono">{num}</span>
                  {isNext && (
                    <Badge className="text-[9px] bg-blue-500 animate-pulse">
                      SIGUIENTE
                    </Badge>
                  )}
                </div>
                <div className="flex items-center">
                  {isSent ? (
                    <CheckIcon size={16} className="text-green-600" />
                  ) : (
                    <SendIcon size={14} className="text-slate-300" />
                  )}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default React.memo(ContactList);
