'use client';

import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";

interface LoadingMessagesProps {
  justShowLastMessage?: boolean;
}

const messages = [
  "Analyzing your form requirements...",
  "Designing the perfect form structure...",
  "Crafting intuitive questions...",
  "Optimizing for user experience...",
  "Making it delightful to interact with...",
  "Almost there! Finalizing your form...",
  "Just adding the finishing touches...",
  "Done! Your form is ready to shine.",
]

export default function LoadingMessages({ justShowLastMessage }: LoadingMessagesProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const loadingMessages = justShowLastMessage ? messages.slice(-1) : messages;

  useEffect(() => {
    if (messageIndex >= loadingMessages.length) return;

    if (charIndex < loadingMessages[messageIndex].length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + loadingMessages[messageIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 45); // Adjust typing speed here
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCharIndex(0);
        setDisplayText('');
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1800); // Adjust delay before next message here
      return () => clearTimeout(timeout);
    }
  }, [charIndex, messageIndex]);
  
  return (
    <motion.div
      className="w-full md:container mx-4 md:mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-2xl p-4">
        <div className="flex items-center space-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-muted-foreground flex-1"
          >
            {displayText}
          </motion.span>

          <div className="flex items-center justify-center space-x-2 mt-6">
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}