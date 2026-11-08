import React from "react";
import { Sparkles, Trash2, BarChart3, ShieldCheck, Calculator, Download } from "lucide-react";
import { SchemeFactsheet } from "../data/knowledgeBase";

interface HeaderProps {
  schemes: SchemeFactsheet[];
  selectedSchemeId: string;
  onSelectScheme: (id: string) => void;
  onClearChat: () => void;
  onOpenComparison: () => void;
  onOpenCalculator: () => void;
  onOpenDisclaimer: () => void;
  onExportChat: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  schemes,
  selectedSchemeId,
  onSelectScheme,
  onClearChat,
  onOpenComparison,
  onOpenCalculator,
  onOpenDisclaimer,
  onExportChat,
  hasMessages,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#00D09C] flex items-center justify-center shadow-md shadow-[#00D09C]/25 text-white font-black text-xl tracking-tight">
              G
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold text-gray-900 tracking-tight">Groww</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E8FAF5] text-[#008765] border border-[#00D09C]/30">
                  SBI Mutual Fund
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                Verified Scheme Facts & AI Assistant
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <button
              onClick={onOpenCalculator}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-[#008765] bg-[#E8FAF5] hover:bg-[#D1F7EC] border border-[#00D09C]/30 transition-colors shadow-xs"
              title="Open SIP & Wealth Calculator"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SIP Calculator</span>
              <span className="sm:hidden">SIP</span>
            </button>

            <button
              onClick={onOpenComparison}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors"
              title="Compare all 4 SBI Schemes"
            >
              <BarChart3 className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden md:inline">Compare Schemes</span>
              <span className="md:hidden">Compare</span>
            </button>

            {hasMessages && (
              <>
                <button
                  onClick={onExportChat}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors"
                  title="Export Chat History as Markdown"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Export</span>
                </button>

                <button
                  onClick={onClearChat}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </>
            )}

            <button
              onClick={onOpenDisclaimer}
              className="p-1.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors"
              title="View Compliance & Disclaimers"
            >
              <ShieldCheck className="w-4 h-4 text-[#008765]" />
            </button>
          </div>
        </div>

        {/* Scheme Filter Bar */}
        <div className="py-2.5 flex items-center space-x-2 overflow-x-auto no-scrollbar border-t border-gray-100">
          <span className="text-xs font-bold text-gray-400 shrink-0 mr-1 hidden sm:inline">
            Focus:
          </span>
          <button
            onClick={() => onSelectScheme("all")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedSchemeId === "all"
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All 4 Schemes
          </button>
          {schemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => onSelectScheme(scheme.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedSchemeId === scheme.id
                  ? "bg-[#00D09C] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {scheme.shortName}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
