/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calculator,
  BarChart2,
  ExternalLink,
  Mic,
  MicOff,
} from "lucide-react";
import { Header } from "./components/Header";
import { SchemeCards } from "./components/SchemeCards";
import { ChatMessage, MessageItem } from "./components/ChatMessage";
import { SamplePrompts } from "./components/SamplePrompts";
import { ComparisonModal } from "./components/ComparisonModal";
import { DisclaimerModal } from "./components/DisclaimerModal";
import { SipCalculatorModal } from "./components/SipCalculatorModal";
import { SchemeAnalyticsDrawer } from "./components/SchemeAnalyticsDrawer";
import { SCHEMES, SchemeFactsheet } from "./data/knowledgeBase";

const STORAGE_KEY = "groww_sbi_chat_history_v1";

export default function App() {
  const [messages, setMessages] = useState<MessageItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
    return [];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>("all");
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [analyticsScheme, setAnalyticsScheme] = useState<SchemeFactsheet | null>(null);
  const [mobileTab, setMobileTab] = useState<"chat" | "factsheets">("chat");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const isSpeechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const toggleVoiceInput = () => {
    if (!isSpeechSupported) {
      setErrorMessage("Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      setIsListening(false);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history", e);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInputMessage("");

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: MessageItem = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
      timestamp,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    const botMessageId = "bot-" + Date.now();
    let accumulatedContent = "";
    let finalSourceUrl = "https://www.sbimf.com";

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const fallbackRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await fallbackRes.json();
        if (!fallbackRes.ok) {
          throw new Error(data.error || "Failed to generate response");
        }

        const botMsg: MessageItem = {
          id: botMessageId,
          role: "model",
          content: data.reply || "I couldn't find verified information for this question.",
          sourceUrl: data.sourceUrl || "https://www.sbimf.com",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Unable to initialize response stream.");
      }

      const initialBotMsg: MessageItem = {
        id: botMessageId,
        role: "model",
        content: "",
        sourceUrl: finalSourceUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, initialBotMsg]);

      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const payload = JSON.parse(line.slice(6));
                if (payload.text) {
                  accumulatedContent += payload.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === botMessageId ? { ...m, content: accumulatedContent } : m
                    )
                  );
                }
                if (payload.sourceUrl) {
                  finalSourceUrl = payload.sourceUrl;
                }
                if (payload.error) {
                  throw new Error(payload.error);
                }
              } catch (parseErr) {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      }

      const sourceMatch = accumulatedContent.match(/Source:\s*(https?:\/\/[^\s\)\>]+)/i);
      if (sourceMatch) {
        finalSourceUrl = sourceMatch[1];
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? {
                ...m,
                content:
                  accumulatedContent ||
                  "I couldn't find verified information for this question.\nSource: https://www.sbimf.com",
                sourceUrl: finalSourceUrl,
              }
            : m
        )
      );
    } catch (err: unknown) {
      console.error("Chat error:", err);
      const errText =
        err instanceof Error ? err.message : "Unable to reach server. Please try again.";
      setErrorMessage(errText);
      if (!accumulatedContent) {
        setMessages((prev) => prev.filter((m) => m.id !== botMessageId));
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
      setErrorMessage(null);
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const transcript = messages
      .map(
        (m) =>
          `### [${m.timestamp}] ${m.role === "user" ? "Investor" : "Groww Facts Assistant"}\n${m.content}\n${
            m.sourceUrl ? `Verified Source: ${m.sourceUrl}\n` : ""
          }`
      )
      .join("\n---\n\n");

    const blob = new Blob(
      [
        `# Groww Mutual Fund Facts Assistant Transcript\n\nAMC: SBI Mutual Fund\nDate: ${new Date().toLocaleDateString()}\n\n---\n\n${transcript}`,
      ],
      { type: "text/markdown" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `groww-sbi-chat-transcript-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt);
    if (mobileTab === "factsheets") {
      setMobileTab("chat");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col text-gray-900 font-sans selection:bg-[#00D09C]/25">
      {/* Top Header */}
      <Header
        schemes={SCHEMES}
        selectedSchemeId={selectedSchemeId}
        onSelectScheme={(id) => setSelectedSchemeId(id)}
        onClearChat={handleClearChat}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onExportChat={handleExportChat}
        hasMessages={messages.length > 0}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-center space-x-2">
        <button
          onClick={() => setMobileTab("chat")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
            mobileTab === "chat"
              ? "bg-[#00D09C] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Chat Assistant {messages.length > 0 && `(${messages.length})`}
        </button>
        <button
          onClick={() => setMobileTab("factsheets")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
            mobileTab === "factsheets"
              ? "bg-[#00D09C] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Scheme Factsheets (4)
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Side: Scheme Factsheet Cards */}
        <aside
          className={`lg:w-80 xl:w-96 shrink-0 ${
            mobileTab === "factsheets" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="sticky top-28 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            <SchemeCards
              schemes={SCHEMES}
              selectedSchemeId={selectedSchemeId}
              onSelectScheme={(id) => setSelectedSchemeId(id)}
              onAskQuestion={(q) => {
                handleSendMessage(q);
                setMobileTab("chat");
              }}
              onOpenAnalytics={(scheme) => setAnalyticsScheme(scheme)}
            />
          </div>
        </aside>

        {/* Right Side: Chat Assistant Container */}
        <main
          className={`flex-1 flex flex-col bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden ${
            mobileTab === "chat" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Chat Window Inner Header */}
          <div className="px-5 py-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D09C] animate-pulse" />
              <span className="text-xs font-extrabold text-gray-900">
                SBI Mutual Fund Verified Q&A
              </span>
              <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">
                • Grounded in official factsheets & KIM
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="hidden sm:inline-flex items-center space-x-1 text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-xl transition-colors"
              >
                <Calculator className="w-3 h-3 text-[#008765]" />
                <span>SIP Calculator</span>
              </button>
              <div className="text-[11px] font-bold text-[#008765] bg-[#E8FAF5] px-2.5 py-0.5 rounded-full border border-[#00D09C]/30">
                100% Fact Checked
              </div>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 min-h-[380px] max-h-[calc(100vh-17rem)]">
            {messages.length === 0 ? (
              <div className="py-6 sm:py-8 max-w-2xl mx-auto space-y-6">
                {/* Hero Greeting */}
                <div className="text-center space-y-3.5">
                  <div className="w-16 h-16 rounded-3xl bg-[#00D09C] mx-auto flex items-center justify-center text-white font-black text-3xl shadow-md shadow-[#00D09C]/25">
                    G
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      Groww Mutual Fund Facts Assistant
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-1 font-normal leading-relaxed">
                      Instant verified factual answers for SBI Mutual Fund schemes. Grounded strictly in official Scheme Information Documents with mandatory source citations.
                    </p>
                  </div>

                  <div className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008765]" />
                    <span>Zero Hallucinations • Zero Predictions • 100% Verified Citations</span>
                  </div>
                </div>

                {/* Categorized FAQs */}
                <SamplePrompts
                  onSelectPrompt={handleSelectPrompt}
                  selectedSchemeId={selectedSchemeId}
                />
              </div>
            ) : (
              <div>
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}

                {/* Real-time Streaming / Loading Indicator */}
                {isLoading && (
                  <div className="flex items-center space-x-3 my-4">
                    <div className="w-8 h-8 rounded-full bg-[#00D09C] text-white flex items-center justify-center font-black text-sm shadow-xs">
                      G
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 border border-gray-200 text-xs text-gray-600 flex items-center space-x-2.5">
                      <span className="font-bold text-gray-800">Verifying scheme documentation</span>
                      <span className="flex space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D09C] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D09C] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D09C] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="my-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold">Notice:</span> {errorMessage}
                      <button
                        onClick={() => handleSendMessage()}
                        className="ml-2 font-bold text-rose-700 underline hover:text-rose-900"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Quick suggestions bar */}
          {messages.length > 0 && (
            <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center space-x-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-gray-400 shrink-0">Suggestions:</span>
              <button
                onClick={() => handleSelectPrompt("What is the exit load for SBI Bluechip Fund?")}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#00D09C] hover:text-[#008765] shrink-0 font-medium transition-colors shadow-2xs"
              >
                Bluechip Exit Load
              </button>
              <button
                onClick={() => handleSelectPrompt("What is the lock-in period for SBI Long Term Equity Fund?")}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#00D09C] hover:text-[#008765] shrink-0 font-medium transition-colors shadow-2xs"
              >
                ELSS Lock-in
              </button>
              <button
                onClick={() => handleSelectPrompt("Who is the fund manager of SBI Flexicap Fund?")}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#00D09C] hover:text-[#008765] shrink-0 font-medium transition-colors shadow-2xs"
              >
                Flexicap Manager
              </button>
              <button
                onClick={() => handleSelectPrompt("What is the benchmark of SBI Magnum Midcap Fund?")}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#00D09C] hover:text-[#008765] shrink-0 font-medium transition-colors shadow-2xs"
              >
                Midcap Benchmark
              </button>
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#E8FAF5] border border-[#00D09C]/30 text-[#008765] font-bold hover:bg-[#D1F7EC] shrink-0 transition-colors flex items-center gap-1"
              >
                <Calculator className="w-2.5 h-2.5" />
                <span>Calculate SIP</span>
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
            {/* Listening state banner */}
            {isListening && (
              <div className="flex items-center justify-between text-xs font-semibold text-[#008765] bg-[#E8FAF5] px-3.5 py-1.5 rounded-xl border border-[#00D09C]/40 mb-2.5 animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Listening... Speak your question now</span>
                </div>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className="text-[11px] text-gray-500 hover:text-gray-900 underline font-medium"
                >
                  Done / Stop
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2.5"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    isListening
                      ? "Listening... Speak your question now"
                      : "Ask about lock-in, exit loads, fund managers, expense ratios, 80C tax rules..."
                  }
                  className={`w-full bg-gray-50 border rounded-2xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:bg-white focus:border-[#00D09C] transition-all text-gray-900 placeholder:text-gray-400 ${
                    isListening
                      ? "border-[#00D09C] ring-2 ring-[#00D09C]/30 bg-emerald-50/20"
                      : "border-gray-200"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                    isListening
                      ? "bg-rose-50 text-rose-600 border border-rose-300 animate-pulse shadow-xs"
                      : "text-gray-400 hover:text-[#008765] hover:bg-gray-100"
                  }`}
                  title={
                    isListening
                      ? "Click to stop listening"
                      : isSpeechSupported
                      ? "Ask using microphone (Web Speech API)"
                      : "Voice input not supported in this browser"
                  }
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-rose-600" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="h-11 px-4 sm:px-5 rounded-2xl bg-[#00D09C] hover:bg-[#00B386] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center space-x-1.5 transition-all shadow-xs shrink-0"
              >
                <span className="hidden sm:inline text-xs">Ask</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 text-center">
              <p className="text-[10px] text-gray-400 leading-tight">
                SBI Mutual Fund Facts Assistant provides verified factual disclosures only. Not an investment advisory service.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onAskAboutScheme={(name) => {
          setIsComparisonOpen(false);
          handleSendMessage(`What are the key facts, benchmark, and parameters for ${name}?`);
        }}
      />

      {/* SIP & Wealth Calculator Modal */}
      <SipCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onAskAboutScheme={(query) => {
          setIsCalculatorOpen(false);
          handleSendMessage(query);
        }}
      />

      {/* Scheme Analytics Drawer */}
      <SchemeAnalyticsDrawer
        scheme={analyticsScheme}
        isOpen={analyticsScheme !== null}
        onClose={() => setAnalyticsScheme(null)}
        onAskAboutScheme={(query) => {
          setAnalyticsScheme(null);
          handleSendMessage(query);
        }}
      />

      {/* Compliance Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
