import React, { useState } from "react";
import { Check, Copy, ExternalLink, ShieldCheck, User, Volume2, VolumeX, Clock } from "lucide-react";

export interface MessageItem {
  id: string;
  role: "user" | "model";
  content: string;
  sourceUrl?: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: MessageItem;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (!("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeechText = message.content
      .replace(/Source:\s*https?:\/\/[^\s]+/gi, "")
      .replace(/[*#_`]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  let displayText = message.content;
  let detectedSource = message.sourceUrl;

  const sourceRegex = /Source:\s*(https?:\/\/[^\s\)\>]+)/i;
  const match = message.content.match(sourceRegex);
  if (match) {
    detectedSource = match[1];
    displayText = message.content.replace(sourceRegex, "").trim();
  }

  // Calculate estimated reading time for chatbot responses (avg 200 words per minute)
  const calculateReadingTime = (text: string) => {
    const clean = text.replace(/[*#_`]/g, "").trim();
    if (!clean) return { label: "1 min read", wordCount: 0 };
    const words = clean.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return {
      label: `${minutes} min read`,
      wordCount: words,
    };
  };

  const readingInfo = calculateReadingTime(displayText);

  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Table row detection
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const cells = trimmed
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        const isHeaderDivider = cells.every((c) => /^:?-+:?$/.test(c));
        if (isHeaderDivider) return null;

        return (
          <div key={idx} className="flex border-b border-gray-100 py-1.5 text-xs text-gray-800">
            {cells.map((cell, cIdx) => (
              <div key={cIdx} className="flex-1 font-medium px-2 truncate">
                {formatBold(cell)}
              </div>
            ))}
          </div>
        );
      }

      // Bullet points
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
        const bulletText = trimmed.replace(/^[\*\-•]\s*/, "");
        return (
          <li key={idx} className="ml-4 list-disc text-gray-800 leading-relaxed my-1 marker:text-[#008765]">
            {formatBold(bulletText)}
          </li>
        );
      }

      // Numbered points
      if (/^\d+\.\s/.test(trimmed)) {
        const numText = trimmed.replace(/^\d+\.\s*/, "");
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 text-gray-800">
            <span className="font-bold text-[#008765]">{trimmed.match(/^\d+\./)?.[0]}</span>
            <span>{formatBold(numText)}</span>
          </div>
        );
      }

      // Empty lines
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1.5 leading-relaxed text-gray-800">
          {formatBold(line)}
        </p>
      );
    });
  };

  const formatBold = (str: string) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-gray-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const getDomainLabel = (url: string) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("sbimf.com")) return "SBI Mutual Fund Factsheet";
      if (parsed.hostname.includes("groww.in")) return "Groww Official Scheme Page";
      return parsed.hostname;
    } catch {
      return "Verified Official Document";
    }
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} my-4`}>
      <div className={`flex max-w-[92%] sm:max-w-[82%] gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shadow-xs">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#00D09C] text-white flex items-center justify-center font-black text-sm shadow-sm shadow-[#00D09C]/25 border border-[#00B386]">
              G
            </div>
          )}
        </div>

        {/* Content bubble */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-xs ${
            isUser
              ? "bg-gray-900 text-white rounded-tr-none"
              : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
          }`}
        >
          {/* Header row for bot */}
          {!isUser && (
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 text-xs">
              <div className="flex items-center space-x-2 font-bold text-gray-900 flex-wrap gap-y-1">
                <span>Groww Facts Assistant</span>
                <span className="inline-flex items-center text-[10px] text-[#008765] bg-[#E8FAF5] px-2 py-0.5 rounded-full border border-[#00D09C]/30 font-bold">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Verified Facts
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleToggleSpeak}
                  className={`p-1 rounded-lg transition-colors ${
                    isPlayingAudio
                      ? "text-[#008765] bg-emerald-50"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  title={isPlayingAudio ? "Stop reading" : `Listen to answer (${readingInfo.label})`}
                >
                  {isPlayingAudio ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors p-1 rounded-lg"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#008765]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Body Text */}
          <div className="text-sm">
            {isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed text-gray-100 font-normal">{message.content}</p>
            ) : (
              <div className="space-y-1">{renderFormattedContent(displayText)}</div>
            )}
          </div>

          {/* Verified Source Citation Card & Reading Time */}
          {!isUser && (
            <div className="mt-3 pt-2.5 border-t border-gray-100">
              {detectedSource ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-50 hover:bg-gray-100 transition-colors px-3 py-2 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-2 truncate mr-2">
                    <span className="w-2 h-2 rounded-full bg-[#00D09C] shrink-0" />
                    <span className="text-xs font-semibold text-gray-700 truncate">
                      Source: <span className="text-[#008765] font-bold">{getDomainLabel(detectedSource)}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2.5 self-end sm:self-auto shrink-0">
                    {/* Subtle reading time label near source citation */}
                    <span
                      className="inline-flex items-center text-[11px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs"
                      title={`Estimated reading time based on ${readingInfo.wordCount} words`}
                    >
                      <Clock className="w-3 h-3 mr-1 text-[#008765]" />
                      {readingInfo.label}
                    </span>
                    <a
                      href={detectedSource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-[#008765] hover:text-[#005e46] shrink-0 hover:underline"
                    >
                      <span className="mr-1">View Factsheet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-end">
                  <span
                    className="inline-flex items-center text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200"
                    title={`Estimated reading time based on ${readingInfo.wordCount} words`}
                  >
                    <Clock className="w-3 h-3 mr-1 text-[#008765]" />
                    {readingInfo.label}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-[10px] mt-1.5 flex items-center justify-between ${isUser ? "text-gray-400 justify-end" : "text-gray-400"}`}>
            {!isUser && (
              <span className="text-gray-400 font-medium">
                Verified SBI Mutual Fund Factsheet
              </span>
            )}
            <span>{message.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
