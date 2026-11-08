import React from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { SAMPLE_QUESTIONS } from "../data/knowledgeBase";

interface SamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  selectedSchemeId: string;
}

export const SamplePrompts: React.FC<SamplePromptsProps> = ({
  onSelectPrompt,
  selectedSchemeId,
}) => {
  const filteredCategories =
    selectedSchemeId === "all"
      ? SAMPLE_QUESTIONS
      : SAMPLE_QUESTIONS.filter(
          (c) => c.schemeId === selectedSchemeId || c.schemeId === "all"
        );

  return (
    <div className="space-y-4 my-2">
      <div className="text-center sm:text-left">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center sm:justify-start space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#008765]" />
          <span>Verified Frequently Asked Questions</span>
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Click any question below for verified scheme facts and citations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredCategories.map((group, gIdx) => (
          <div
            key={gIdx}
            className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-xs hover:border-[#00D09C]/50 transition-colors"
          >
            <span className="text-[11px] font-extrabold text-[#008765] block mb-2 uppercase tracking-wide">
              {group.category}
            </span>
            <div className="space-y-2">
              {group.questions.map((q, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => onSelectPrompt(q)}
                  className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-[#E8FAF5] border border-gray-100 hover:border-[#00D09C]/40 text-xs text-gray-700 hover:text-gray-900 transition-all flex items-center justify-between group shadow-xs"
                >
                  <span className="leading-snug pr-2 group-hover:text-[#005e46] font-medium">
                    {q}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#008765] shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
