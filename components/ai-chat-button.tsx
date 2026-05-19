"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { useT } from "@/components/locale-provider";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AiChatButton() {
  const t = useT();
  const initialMessages = useMemo<ChatMessage[]>(
    () => [{ id: "welcome", role: "assistant", content: t.chat.welcome }],
    [t.chat.welcome],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasUserMessage = messages.some((message) => message.role === "user");

  // Refresh the welcome message when locale changes (only while the panel is
  // still on its initial state).
  useEffect(() => {
    if (!hasUserMessage) {
      setMessages(initialMessages);
    }
  }, [initialMessages, hasUserMessage]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, isSending]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedInput,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || t.chat.fallbackError);
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId(),
          role: "assistant",
          content: data.message || t.chat.fallbackEmpty,
        },
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : t.chat.fallbackError,
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[2147483647] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section
          aria-label={t.chat.title}
          className="flex h-[min(70vh,36rem)] w-[min(calc(100vw-2.5rem),24rem)] flex-col overflow-hidden rounded-lg border border-[#d8cfc4] bg-[#fffaf4] shadow-[0_22px_70px_rgba(30,24,28,0.24)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#e7ded4] bg-[#f5ede4] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#241c21]">
                {t.chat.title}
              </p>
              <p className="mt-0.5 text-xs text-[#675e63]">
                {t.chat.subtitle}
              </p>
            </div>
            <button
              type="button"
              aria-label={t.chat.closeLabel}
              onClick={() => setIsOpen(false)}
              className="grid size-8 place-items-center rounded-full text-[#5f5560] transition hover:bg-[#eadfd4] hover:text-[#241c21] focus:outline-none focus:ring-3 focus:ring-[#b691dd]/35"
            >
              <svg
                aria-hidden="true"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-[#3b2f43] text-white"
                      : "border border-[#eadfd4] bg-[#fbf8f4] text-[#352d33]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isSending ? (
              <div className="flex justify-start">
                <div className="rounded-lg border border-[#eadfd4] bg-[#fbf8f4] px-3 py-2 text-sm text-[#675e63]">
                  {t.chat.thinking}
                </div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          {error ? (
            <div className="border-t border-[#eadfd4] bg-[#fff6f1] px-4 py-2 text-xs leading-5 text-[#8a3f2e]">
              {error}
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-[#e7ded4] bg-[#fffaf4] p-3"
          >
            <label className="sr-only" htmlFor="assistant-message">
              {t.chat.messageLabel}
            </label>
            <input
              id="assistant-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.chat.inputPlaceholder}
              className="min-w-0 flex-1 rounded-full border border-[#d8cfc4] bg-white px-4 py-2 text-sm text-[#241c21] outline-none transition placeholder:text-[#8a8188] focus:border-[#b691dd] focus:ring-3 focus:ring-[#b691dd]/25"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              aria-label={t.chat.sendLabel}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-[#3b2f43] text-white transition hover:bg-[#4d3f57] focus:outline-none focus:ring-4 focus:ring-[#b691dd]/35 disabled:cursor-not-allowed disabled:bg-[#b9adb6]"
            >
              <svg
                aria-hidden="true"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="m5 12 14-7-4.5 14-2.5-5-7-2Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.9"
                />
              </svg>
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? t.chat.closeLabel : t.chat.openLabel}
        onClick={() => setIsOpen((current) => !current)}
        className="group grid size-14 place-items-center rounded-full border border-[#d7c7e8] bg-[#fbf8f4] text-[#3b2f43] shadow-[0_18px_42px_rgba(30,24,28,0.22)] transition hover:-translate-y-0.5 hover:border-[#b691dd] hover:bg-[#f2eaf9] focus:outline-none focus:ring-4 focus:ring-[#b691dd]/35"
      >
        <svg
          aria-hidden="true"
          className="size-7"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M5.5 10.75c0-3.45 2.8-6.25 6.25-6.25h.5c3.45 0 6.25 2.8 6.25 6.25v.5c0 3.45-2.8 6.25-6.25 6.25H9.6l-3.32 2.08a.5.5 0 0 1-.78-.42v-3.3a6.23 6.23 0 0 1-2.25-4.78v-.33Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M9 11h.01M12 11h.01M15 11h.01"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
        </svg>
      </button>
    </div>
  );
}
