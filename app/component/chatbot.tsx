"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IoIosChatbubbles, IoIosSend } from "react-icons/io";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/text-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat: userMessage }),
      });

      const data = await response.json();

      if (data.err) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.err}` },
        ]);
      } else if (data.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error occurred." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      {/* чат нээх товч – жишээ нь доод баруун буланд fixed байрлуулж болно */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-12 h-12 rounded-full fixed bottom-4 right-4 shadow-lg"
        >
          <IoIosChatbubbles className="w-6 h-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden">
        <div className="flex flex-col h-[420px]">
          {/* Header */}
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="text-sm font-medium">
              Chat assistant
            </DialogTitle>
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto text-sm bg-white">
            {/* анхны assistant мессеж */}
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-lg bg-black text-white text-xs">
                How can I help you today?
              </div>
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] ${
                    m.role === "user"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-black text-white"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-[11px] text-gray-400 mt-1">
                Assistant is typing...
              </p>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t px-3 py-2 flex items-center gap-2 bg-white"
          >
            <Input
              className="text-sm"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full"
              disabled={loading || !input.trim()}
            >
              <IoIosSend className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
