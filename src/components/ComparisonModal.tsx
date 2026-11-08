import React from "react";
import { X, ExternalLink, Check, BarChart3 } from "lucide-react";
import { SCHEMES } from "../data/knowledgeBase";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutScheme: (schemeName: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  onAskAboutScheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#00D09C] flex items-center justify-center text-white font-black shadow-sm shadow-[#00D09C]/25">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">
                SBI Mutual Fund Schemes — Verified Fact Comparison
              </h3>
              <p className="text-xs text-gray-500">
                Official metrics grounded in SEBI filings, SID/KIM, and Groww data
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

        {/* Modal Body / Table */}
        <div className="overflow-x-auto p-6 flex-1 text-gray-700">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-3 font-bold text-gray-500 bg-gray-50 rounded-l-xl w-44">
                  Scheme Parameter
                </th>
                {SCHEMES.map((scheme) => (
                  <th key={scheme.id} className="py-3 px-4 font-bold text-gray-900 text-sm">
                    <div className="text-[#008765] font-extrabold text-sm">{scheme.shortName}</div>
                    <span className="text-[11px] font-normal text-gray-500 block mt-0.5">
                      {scheme.category}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-50/50">Fund Manager</td>
                {SCHEMES.map((s) => (
                  <td key={s.id} className="py-3 px-4">
                    <span className="font-medium text-gray-900">{s.fundManager.split("(")[0]}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-50/50">Inception Date</td>
                {SCHEMES.map((s) => (
                  <td key={s.id} className="py-3 px-4 font-medium text-gray-800">
                    {s.inceptionDate}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-50/50">Benchmark</td>
                {SCHEMES.map((s) => (
                  <td key={s.id} className="py-3 px-4 font-medium text-gray-800">
                    {s.benchmark}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-50/50">Lock-in Period</td>
                {SCHEMES.map((s) => (
                  <td key={s.id} className="py-3 px-4">
                    {s.id === "sbi-long-term-equity" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-bold">
                        3 Years (Mandatory)
                      </span>
                    ) : (
                      <span className="text-[#008765] font-semibold">NIL (Open-ended)</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-50/50">Exit Load</td>
                {SCHEMES.map((s) => (
                  <td key={s.id} className="py-3 px-4 font-medium text-gray-800">
                    {s.id === "sbi-long-term-equity"
                      ? "NIL (due to 3y lock-in)"
                      : s.id === "sbi-flexicap"
                      ? "0.10% if <= 30 days, NIL after"
                      : "1.00% if <= 1 year, NIL after"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-50/50">Section 80C Tax Exemption</td>
                {SCHEMES.map((s) => (
                  <td key={s.id} className="py-3 px-4">
                    {s.id === "sbi-long-term-equity" ? (
                      <span className="text-[#008765] font-bold inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Yes, up to ₹1.5L / year
                      </span>
                    ) : (
                      <span className="text-gray-400">No (Standard Equity)</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-50/50">Min SIP / Lumpsum</td>
                {SCHEMES.map((s) => (
                  <td key={s.id} className="py-3 px-4 font-medium">
                    <div className="text-gray-900 font-bold">SIP: {s.minSip.split(" ")[0]}</div>
                    <div className="text-gray-500 text-[11px]">Lumpsum: {s.minLumpsum.split(" ")[0]}</div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-50/50">Expense Ratio (Direct)</td>
                {SCHEMES.map((s) => (
                  <td key={s.id} className="py-3 px-4 font-black text-[#008765]">
                    {s.expenseRatioDirect}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-50/50">Riskometer</td>
                {SCHEMES.map((s) => (
                  <td key={s.id} className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-bold border border-rose-200">
                      {s.riskometer}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-50/50">Official Source</td>
                {SCHEMES.map((s) => (
                  <td key={s.id} className="py-3 px-4">
                    <a
                      href={s.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#008765] font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>Factsheet</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Source: SBI Mutual Fund & Groww.in</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00D09C] text-white font-bold rounded-xl hover:bg-[#00B386] transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
