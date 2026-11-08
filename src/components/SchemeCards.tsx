import React from "react";
import { ExternalLink, Lock, Percent, TrendingUp, BarChart2 } from "lucide-react";
import { SchemeFactsheet } from "../data/knowledgeBase";

interface SchemeCardsProps {
  schemes: SchemeFactsheet[];
  selectedSchemeId: string;
  onSelectScheme: (id: string) => void;
  onAskQuestion: (question: string) => void;
  onOpenAnalytics: (scheme: SchemeFactsheet) => void;
}

export const SchemeCards: React.FC<SchemeCardsProps> = ({
  schemes,
  selectedSchemeId,
  onSelectScheme,
  onAskQuestion,
  onOpenAnalytics,
}) => {
  const displayedSchemes =
    selectedSchemeId === "all"
      ? schemes
      : schemes.filter((s) => s.id === selectedSchemeId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#008765]" />
          <span>SBI Mutual Fund Schemes ({displayedSchemes.length})</span>
        </h2>
        {selectedSchemeId !== "all" && (
          <button
            onClick={() => onSelectScheme("all")}
            className="text-xs text-[#008765] hover:underline font-bold"
          >
            Show All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {displayedSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
          >
            {/* Top accent bar with Groww emerald green */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#00D09C] group-hover:h-1.5 transition-all" />

            {/* Scheme Title & Category */}
            <div className="flex items-start justify-between gap-2 mb-2 pt-1">
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm leading-snug group-hover:text-[#008765] transition-colors">
                  {scheme.name}
                </h3>
                <span className="inline-block mt-0.5 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                  {scheme.category}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onOpenAnalytics(scheme)}
                  className="p-1 text-gray-400 hover:text-[#008765] hover:bg-gray-100 rounded-lg transition-colors"
                  title="View Portfolio Analytics & Holdings"
                >
                  <BarChart2 className="w-4 h-4 text-[#008765]" />
                </button>
                <a
                  href={scheme.growwSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View on Groww"
                  className="text-gray-400 hover:text-[#008765] p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Key Fact Badges Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs my-3 bg-gray-50/90 p-2.5 rounded-xl border border-gray-100">
              <div>
                <span className="text-[10px] text-gray-400 font-medium block">Lock-in Period</span>
                <span className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                  <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="truncate">
                    {scheme.id === "sbi-long-term-equity" ? "3 Years (ELSS)" : "NIL (Open)"}
                  </span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-medium block">Exit Load</span>
                <span className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                  <Percent className="w-3 h-3 text-blue-500 shrink-0" />
                  <span className="truncate">
                    {scheme.id === "sbi-long-term-equity"
                      ? "NIL (3y lock)"
                      : scheme.id === "sbi-flexicap"
                      ? "0.10% (30 days)"
                      : "1.00% (1 year)"}
                  </span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-medium block">Fund Manager</span>
                <span className="font-bold text-gray-800 truncate block mt-0.5" title={scheme.fundManager}>
                  {scheme.fundManager.split(" ")[0]} {scheme.fundManager.split(" ")[1]}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-medium block">Min SIP</span>
                <span className="font-bold text-[#008765] mt-0.5 block">{scheme.minSip.split(" ")[0]}</span>
              </div>
            </div>

            {/* Quick Fact questions */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-gray-500 mb-1.5 block">Quick Inquiries:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => onAskQuestion(`What is the exit load for ${scheme.shortName}?`)}
                  className="text-[11px] px-2 py-1 rounded-lg bg-[#E8FAF5] text-[#008765] hover:bg-[#D1F7EC] border border-[#00D09C]/30 font-semibold transition-colors"
                >
                  Exit load?
                </button>
                <button
                  onClick={() => onAskQuestion(`Who manages ${scheme.shortName} and what is the benchmark?`)}
                  className="text-[11px] px-2 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-medium transition-colors"
                >
                  Manager & Benchmark?
                </button>
                {scheme.id === "sbi-long-term-equity" && (
                  <button
                    onClick={() =>
                      onAskQuestion("What tax exemption does SBI Long Term Equity Fund offer under Section 80C?")
                    }
                    className="text-[11px] px-2 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-semibold transition-colors"
                  >
                    80C Tax Benefit?
                  </button>
                )}
              </div>
            </div>

            {/* Official Source link */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <button
                onClick={() => onOpenAnalytics(scheme)}
                className="text-[#008765] hover:underline font-bold flex items-center gap-1"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>View Analytics</span>
              </button>
              <a
                href={scheme.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#008765] font-semibold flex items-center gap-1 transition-colors"
              >
                <span>sbimf.com</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Box */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3.5 text-[11px] text-gray-600 shadow-xs">
        <div className="flex items-center space-x-2 font-bold text-gray-800 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#00D09C]" />
          <span>Factual Grounding Guardrail</span>
        </div>
        <p className="text-gray-500 leading-relaxed">
          Grounded strictly in official SBI Mutual Fund Scheme Information Documents (SID/KIM) and Groww database. No investment advice, return predictions, or fabricated details.
        </p>
      </div>
    </div>
  );
};
