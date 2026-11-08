import React from "react";
import { X, ExternalLink, ArrowRight, Layers } from "lucide-react";
import { SchemeFactsheet } from "../data/knowledgeBase";

interface SchemeAnalyticsDrawerProps {
  scheme: SchemeFactsheet | null;
  isOpen: boolean;
  onClose: () => void;
  onAskAboutScheme: (query: string) => void;
}

export const SchemeAnalyticsDrawer: React.FC<SchemeAnalyticsDrawerProps> = ({
  scheme,
  isOpen,
  onClose,
  onAskAboutScheme,
}) => {
  if (!isOpen || !scheme) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#00D09C] flex items-center justify-center text-white font-black shadow-sm shadow-[#00D09C]/25 text-lg">
              {scheme.shortName.charAt(4) || "S"}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-gray-900 text-base">{scheme.name}</h3>
                <span className="text-[11px] font-bold bg-[#E8FAF5] text-[#008765] border border-[#00D09C]/30 px-2 py-0.5 rounded-full">
                  {scheme.category}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Managed by {scheme.fundManager}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-gray-700">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Total AUM</span>
              <span className="text-sm font-black text-gray-900 mt-0.5 block">{scheme.aum}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Direct TER</span>
              <span className="text-sm font-black text-[#008765] mt-0.5 block">{scheme.expenseRatioDirect}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Lock-in</span>
              <span className="text-sm font-black text-gray-900 mt-0.5 block">
                {scheme.id === "sbi-long-term-equity" ? "3 Years (ELSS)" : "NIL (Open)"}
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Benchmark</span>
              <span className="text-xs font-bold text-gray-800 mt-1 block truncate" title={scheme.benchmark}>
                {scheme.benchmark}
              </span>
            </div>
          </div>

          {/* Market Cap Distribution */}
          <div className="bg-white rounded-3xl border border-gray-200 p-4 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-gray-900 text-sm flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-[#008765]" />
                <span>Market Cap Breakdown</span>
              </h4>
              <span className="text-[11px] text-gray-400">SEBI Classification</span>
            </div>

            {/* Visual Bar */}
            <div className="h-3 w-full bg-gray-100 rounded-full flex overflow-hidden">
              <div
                style={{ width: `${scheme.marketCapBreakup.largeCap}%` }}
                className="bg-blue-600 h-full"
                title={`Large Cap: ${scheme.marketCapBreakup.largeCap}%`}
              />
              <div
                style={{ width: `${scheme.marketCapBreakup.midCap}%` }}
                className="bg-[#00D09C] h-full"
                title={`Mid Cap: ${scheme.marketCapBreakup.midCap}%`}
              />
              <div
                style={{ width: `${scheme.marketCapBreakup.smallCap}%` }}
                className="bg-amber-400 h-full"
                title={`Small Cap: ${scheme.marketCapBreakup.smallCap}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                <span className="text-[10px] text-blue-700 font-bold block">Large Cap</span>
                <span className="text-xs font-black text-gray-900">
                  {scheme.marketCapBreakup.largeCap}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] text-[#008765] font-bold block">Mid Cap</span>
                <span className="text-xs font-black text-gray-900">
                  {scheme.marketCapBreakup.midCap}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] text-amber-700 font-bold block">Small Cap</span>
                <span className="text-xs font-black text-gray-900">
                  {scheme.marketCapBreakup.smallCap}%
                </span>
              </div>
            </div>
          </div>

          {/* Top 5 Holdings */}
          <div className="bg-white rounded-3xl border border-gray-200 p-4 space-y-3 shadow-xs">
            <h4 className="font-extrabold text-gray-900 text-sm">Top 5 Portfolio Holdings</h4>
            <div className="divide-y divide-gray-100">
              {scheme.topHoldings.map((h, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">{h.name}</span>
                    <span className="text-[10px] text-gray-500">{h.sector}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#008765] bg-[#E8FAF5] px-2.5 py-0.5 rounded-lg border border-[#00D09C]/30 text-xs">
                      {h.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sectors & Riskometer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-3xl p-4 border border-gray-200 space-y-2.5">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                Sector Diversification
              </h4>
              <div className="space-y-2 pt-1">
                {scheme.topSectors.map((sec, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-600 truncate">{sec.name}</span>
                    <span className="font-black text-gray-900 shrink-0 ml-2">{sec.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-4 border border-gray-200 space-y-2.5 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                  Riskometer & Exit Load
                </h4>
                <div className="mt-2.5 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs text-center">
                  Risk Level: {scheme.riskometer}
                </div>
                <p className="mt-2.5 text-[11px] text-gray-600 leading-relaxed">
                  <strong className="text-gray-800">Exit Load:</strong> {scheme.exitLoad}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <a
                  href={scheme.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#008765] hover:underline font-bold inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Official SID Document</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onAskAboutScheme(
                `Explain the investment objective and portfolio strategy of ${scheme.name}.`
              );
            }}
            className="px-4 py-2 bg-[#00D09C] hover:bg-[#00B386] text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Ask AI about {scheme.shortName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
