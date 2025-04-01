'use client';

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react"

interface ContentEditableInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  className?: string;
}

export default function ChatInput({ value, onChange, onEnter, placeholder, className }: ContentEditableInputProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    onChange(target.innerHTML);
  }, [onChange]);

  useEffect(() => {
    checkIfEmpty();
  }, [value]);

  const checkIfEmpty = () => {
    if (divRef.current) {
      const isEmpty = divRef.current.innerHTML.trim() === '' || divRef.current.innerText.trim() === '';
      setIsEmpty(isEmpty);
    }
  }

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Move the cursor after the inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior.
      // Mobile detection using userAgent.
      const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
      if (isMobile) return;
      // On desktop, trigger onEnter.
      if (!isMobile && onEnter) {
        onEnter();
      }
    }
  }, [onEnter]);

  const handleBlur = useCallback(() => {
    checkIfEmpty();
  }, []);
  
  return (
    <div className="relative">
      {isEmpty && (
        <div className="absolute inset-0 px-6 py-2 pointer-events-none">
          <span className="text-muted-foreground">{placeholder}</span>
        </div>
      )}
      <div 
        className={cn("absolute top-1/2 right-6 -translate-y-1/2 p-3 rounded-full bg-primary text-primary-foreground cursor-pointer", isEmpty && "opacity-20")}
        onClick={onEnter}
      >
        <Send />
      </div>
      <div
        ref={divRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] shadow-xs transition-[color,box-shadow] border rounded-xl px-6 py-2',
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-primary min-h-20 max-h-40 overflow-y-auto",
          className
        )}
        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
        suppressContentEditableWarning
      />
    </div>
  )
}