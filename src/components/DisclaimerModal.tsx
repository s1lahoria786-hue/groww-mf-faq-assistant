import React from "react";
import { X, ShieldAlert, CheckCircle2 } from "lucide-react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-gray-900 text-sm">
              Regulatory Compliance & Factual Scope
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-gray-700 leading-relaxed">
          <div className="bg-[#E8FAF5] border border-[#00D09C]/30 rounded-2xl p-3.5 text-emerald-950">
            <span className="font-bold block mb-1 text-gray-900">Factual Assistant Scope:</span>
            This AI assistant is configured to retrieve and present verified facts strictly from Scheme Information Documents (SID), Key Information Memorandums (KIM), and official Groww factsheets for:
            <ul className="list-disc ml-4 mt-1 font-medium space-y-0.5 text-[#008765]">
              <li>SBI Bluechip Fund</li>
              <li>SBI Flexicap Fund</li>
              <li>SBI Long Term Equity Fund (ELSS)</li>
              <li>SBI Magnum Midcap Fund</li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-gray-900 text-xs">Strict Operational Guardrails:</h4>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#008765] shrink-0 mt-0.5" />
              <span>
                <strong className="text-gray-900">Zero Investment Advice:</strong> No buy/sell recommendations, portfolio matching, or forecasts.
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#008765] shrink-0 mt-0.5" />
              <span>
                <strong className="text-gray-900">Mandatory Source Citation:</strong> Every answer provides exactly one official reference URL.
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#008765] shrink-0 mt-0.5" />
              <span>
                <strong className="text-gray-900">Fallback Protection:</strong> If a fact is unavailable or outside scope, the system explicitly responds: <em>"I couldn't find verified information for this question."</em>
              </span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-500">
            <strong className="text-gray-700">SEBI Statutory Disclaimer:</strong> Mutual Fund investments are subject to market risks, read all scheme-related documents carefully.
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#00D09C] hover:bg-[#00B386] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
