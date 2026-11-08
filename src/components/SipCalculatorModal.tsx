import React, { useState } from "react";
import { X, Calculator, PieChart, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { SCHEMES, SchemeFactsheet } from "../data/knowledgeBase";

interface SipCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutScheme: (query: string) => void;
}

export const SipCalculatorModal: React.FC<SipCalculatorModalProps> = ({
  isOpen,
  onClose,
  onAskAboutScheme,
}) => {
  const [calcType, setCalcType] = useState<"sip" | "lumpsum">("sip");
  const [amount, setAmount] = useState<number>(5000);
  const [returnRate, setReturnRate] = useState<number>(15);
  const [years, setYears] = useState<number>(10);
  const [selectedScheme, setSelectedScheme] = useState<SchemeFactsheet>(SCHEMES[0]);

  if (!isOpen) return null;

  let totalInvested = 0;
  let futureValue = 0;
  let estimatedReturns = 0;

  if (calcType === "sip") {
    const monthlyRate = returnRate / 12 / 100;
    const totalMonths = years * 12;
    totalInvested = amount * totalMonths;
    if (monthlyRate > 0) {
      futureValue =
        amount *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);
    } else {
      futureValue = totalInvested;
    }
    estimatedReturns = Math.max(0, futureValue - totalInvested);
  } else {
    totalInvested = amount;
    futureValue = amount * Math.pow(1 + returnRate / 100, years);
    estimatedReturns = Math.max(0, futureValue - totalInvested);
  }

  const investedPercent = futureValue > 0 ? (totalInvested / futureValue) * 100 : 50;
  const returnsPercent = 100 - investedPercent;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const handleSchemePreset = (scheme: SchemeFactsheet) => {
    setSelectedScheme(scheme);
    if (scheme.id === "sbi-bluechip") setReturnRate(16);
    else if (scheme.id === "sbi-flexicap") setReturnRate(17);
    else if (scheme.id === "sbi-long-term-equity") setReturnRate(21);
    else if (scheme.id === "sbi-magnum-midcap") setReturnRate(22);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#00D09C] flex items-center justify-center text-white font-black shadow-md shadow-[#00D09C]/25">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                Groww Mutual Fund SIP & Wealth Calculator
                <span className="text-[10px] bg-[#E8FAF5] text-[#008765] border border-[#00D09C]/30 px-2 py-0.5 rounded-full font-bold">
                  SBI Schemes
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Interactive returns projector based on compounding growth
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 text-gray-800">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Type toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setCalcType("sip")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  calcType === "sip"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                SIP (Monthly Investment)
              </button>
              <button
                onClick={() => setCalcType("lumpsum")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  calcType === "lumpsum"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Lumpsum (One-Time)
              </button>
            </div>

            {/* Scheme Presets */}
            <div>
              <span className="text-xs font-bold text-gray-600 mb-2 block">
                Quick Historical Benchmark Presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SCHEMES.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => handleSchemePreset(scheme)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                      selectedScheme.id === scheme.id
                        ? "border-[#00D09C] bg-[#E8FAF5] text-gray-900 shadow-xs ring-1 ring-[#00D09C]"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <span className="font-bold text-gray-900 block truncate">
                      {scheme.shortName}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      {scheme.cagrBenchmark.fiveYear} 5Y
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700">
                  {calcType === "sip" ? "Monthly Investment Amount" : "Total Investment Amount"}
                </span>
                <span className="font-bold text-[#008765] bg-[#E8FAF5] px-2.5 py-1 rounded-lg border border-[#00D09C]/30">
                  {formatCurrency(amount)}
                </span>
              </div>
              <input
                type="range"
                min={calcType === "sip" ? 500 : 1000}
                max={calcType === "sip" ? 100000 : 1000000}
                step={calcType === "sip" ? 500 : 5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-[#00D09C] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>{calcType === "sip" ? "₹500" : "₹1,000"}</span>
                <span>{calcType === "sip" ? "₹1,00,000" : "₹10,00,000"}</span>
              </div>
            </div>

            {/* Return Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700">Expected Annual Return Rate (p.a.)</span>
                <span className="font-bold text-[#008765] bg-[#E8FAF5] px-2.5 py-1 rounded-lg border border-[#00D09C]/30">
                  {returnRate}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={0.5}
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full accent-[#00D09C] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>5%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Time Period Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700">Time Horizon</span>
                <span className="font-bold text-[#008765] bg-[#E8FAF5] px-2.5 py-1 rounded-lg border border-[#00D09C]/30">
                  {years} Years
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-[#00D09C] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-5 bg-gray-50 rounded-3xl p-5 border border-gray-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-4">
                Projection Breakdown
              </span>

              {/* Graphical Donut Progress */}
              <div className="relative w-40 h-40 mx-auto my-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-gray-700"
                    strokeDasharray={`${investedPercent}, 100`}
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#00D09C]"
                    strokeDasharray={`${returnsPercent}, 100`}
                    strokeDashoffset={`-${investedPercent}`}
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  <span className="text-[10px] text-gray-500 font-medium">Est. Corpus</span>
                  <span className="text-sm font-black text-gray-900 leading-tight">
                    {formatCurrency(futureValue)}
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-3 mt-4 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                    <span className="text-gray-600 font-medium">Invested Amount:</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(totalInvested)}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00D09C]" />
                    <span className="text-gray-600 font-medium">Est. Capital Gains:</span>
                  </div>
                  <span className="font-bold text-[#008765]">{formatCurrency(estimatedReturns)}</span>
                </div>

                <div className="flex justify-between items-center pt-1 text-sm font-black text-gray-900">
                  <span>Total Future Corpus:</span>
                  <span className="text-[#008765] text-base">{formatCurrency(futureValue)}</span>
                </div>
              </div>
            </div>

            {/* Scheme Action Callout */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onClose();
                  onAskAboutScheme(
                    `What are the verified facts, lock-in, and exit loads for ${selectedScheme.name}?`
                  );
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#00D09C] hover:bg-[#00B386] text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-xs"
              >
                <span>Ask facts about {selectedScheme.shortName}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                *Compounded calculations for illustration only. Past performance does not guarantee future results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
