export interface SchemeFactsheet {
  id: string;
  name: string;
  shortName: string;
  category: string;
  amc: string;
  fundManager: string;
  fundManagerExperience?: string;
  inceptionDate: string;
  benchmark: string;
  riskometer: string;
  investmentObjective: string;
  lockInPeriod: string;
  exitLoad: string;
  minLumpsum: string;
  minAdditional: string;
  minSip: string;
  expenseRatioDirect: string;
  expenseRatioRegular: string;
  aum: string;
  assetAllocation: {
    equity: string;
    debt: string;
    other?: string;
  };
  marketCapBreakup: {
    largeCap: number; // percentage
    midCap: number;
    smallCap: number;
  };
  topHoldings: {
    name: string;
    sector: string;
    percentage: number;
  }[];
  topSectors: {
    name: string;
    percentage: number;
  }[];
  cagrBenchmark: {
    oneYear: string;
    threeYear: string;
    fiveYear: string;
  };
  taxation: string;
  specialFeatures: string[];
  officialSourceUrl: string;
  growwSourceUrl: string;
  faqs: {
    question: string;
    answer: string;
    sourceUrl: string;
  }[];
}

export const SCHEMES: SchemeFactsheet[] = [
  {
    id: "sbi-bluechip",
    name: "SBI Bluechip Fund",
    shortName: "SBI Bluechip",
    category: "Equity: Large Cap",
    amc: "SBI Mutual Fund",
    fundManager: "Saurabh Pant (Managing since January 2024)",
    fundManagerExperience: "Over 16 years of experience in equity research and fund management.",
    inceptionDate: "February 14, 2006",
    benchmark: "S&P BSE 100 TRI",
    riskometer: "Very High Risk",
    investmentObjective:
      "To provide investors with opportunities for long-term growth in capital through an active management of investments in a diversified basket of large cap equity stocks (minimum 80% in large cap companies).",
    lockInPeriod: "NIL (Open-ended scheme with no statutory lock-in)",
    exitLoad:
      "For exit within 1 year from allotment: 1.00% on redemption in excess of 10% of investment. NIL after 1 year.",
    minLumpsum: "₹5,000 (and in multiples of ₹1 thereafter)",
    minAdditional: "₹1,000 (and in multiples of ₹1 thereafter)",
    minSip: "₹500 per month (minimum 12 installments) or ₹1,500 quarterly",
    expenseRatioDirect: "0.87%",
    expenseRatioRegular: "1.58%",
    aum: "₹48,250+ Crores",
    assetAllocation: {
      equity: "94.8% in equity & equity-related instruments",
      debt: "5.2% in cash, TREPS & money market instruments",
    },
    marketCapBreakup: {
      largeCap: 83.4,
      midCap: 11.2,
      smallCap: 5.4,
    },
    topHoldings: [
      { name: "HDFC Bank Ltd", sector: "Financial Services", percentage: 9.1 },
      { name: "ICICI Bank Ltd", sector: "Financial Services", percentage: 8.4 },
      { name: "Reliance Industries Ltd", sector: "Energy & Petrochem", percentage: 7.2 },
      { name: "Infosys Ltd", sector: "Information Technology", percentage: 6.5 },
      { name: "Larsen & Toubro Ltd", sector: "Capital Goods", percentage: 4.8 },
    ],
    topSectors: [
      { name: "Financial Services", percentage: 32.4 },
      { name: "Information Technology", percentage: 11.8 },
      { name: "Automobile & Auto Components", percentage: 9.6 },
      { name: "Energy & Utilities", percentage: 8.7 },
      { name: "Healthcare & Pharmaceuticals", percentage: 7.1 },
    ],
    cagrBenchmark: {
      oneYear: "~18.2%",
      threeYear: "~16.5%",
      fiveYear: "~17.8%",
    },
    taxation:
      "Equity taxation applies: STCG (held <= 1 year) is taxed at 20%. LTCG (held > 1 year) is taxed at 12.5% for capital gains exceeding ₹1.25 Lakh per financial year.",
    specialFeatures: [
      "Mandatory minimum 80% allocation to Top 100 market capitalization companies (Large Caps).",
      "Focuses on bluechip market leaders with established business models and robust balance sheets.",
      "Suitable for investors seeking long-term capital growth with lower volatility than mid/small caps.",
    ],
    officialSourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-bluechip-fund",
    growwSourceUrl: "https://groww.in/mutual-funds/sbi-blue-chip-fund-direct-growth",
    faqs: [
      {
        question: "What is the exit load for SBI Bluechip Fund?",
        answer:
          "For redemption or switch-out within 1 year from the date of allotment, an exit load of 1.00% is applicable for units redeemed in excess of 10% of the initial investment. If redeemed after 1 year, the exit load is NIL.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-bluechip-fund",
      },
      {
        question: "Who is the fund manager of SBI Bluechip Fund?",
        answer:
          "SBI Bluechip Fund is managed by Saurabh Pant (since January 2024), who has over 16 years of rich experience in equity research and capital market investments.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-bluechip-fund",
      },
      {
        question: "What is the benchmark of SBI Bluechip Fund?",
        answer:
          "The benchmark of SBI Bluechip Fund is the S&P BSE 100 TRI (Total Return Index).",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-bluechip-fund",
      },
      {
        question: "What is the minimum SIP and lumpsum investment for SBI Bluechip Fund?",
        answer:
          "The minimum initial lumpsum investment is ₹5,000 (multiples of ₹1 thereafter). The minimum monthly SIP amount is ₹500 (with a minimum of 12 installments) or ₹1,500 for quarterly SIP.",
        sourceUrl: "https://groww.in/mutual-funds/sbi-blue-chip-fund-direct-growth",
      },
      {
        question: "Does SBI Bluechip Fund have a lock-in period?",
        answer:
          "No, SBI Bluechip Fund is an open-ended growth scheme and does not have any lock-in period. Investors can redeem units on any business day, subject to applicable exit loads.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-bluechip-fund",
      },
      {
        question: "What is the expense ratio of SBI Bluechip Fund?",
        answer:
          "The Direct Plan expense ratio is approximately 0.87%, while the Regular Plan expense ratio is approximately 1.58% (subject to periodic SEBI TER updates).",
        sourceUrl: "https://groww.in/mutual-funds/sbi-blue-chip-fund-direct-growth",
      },
    ],
  },
  {
    id: "sbi-flexicap",
    name: "SBI Flexicap Fund",
    shortName: "SBI Flexicap",
    category: "Equity: Flexi Cap",
    amc: "SBI Mutual Fund",
    fundManager: "Rama Iyer Srinivasan (R. Srinivasan, managing since May 2022)",
    fundManagerExperience: "Over 30 years of capital markets and investment management experience.",
    inceptionDate: "September 29, 2005",
    benchmark: "S&P BSE 500 TRI",
    riskometer: "Very High Risk",
    investmentObjective:
      "To provide investors with opportunities for long-term capital appreciation by investing in a dynamically managed portfolio of equity and equity-related instruments across large cap, mid cap, and small cap companies.",
    lockInPeriod: "NIL (Open-ended scheme with no lock-in)",
    exitLoad:
      "If redeemed or switched out on or before 30 days from allotment: 0.10%. If redeemed after 30 days: NIL.",
    minLumpsum: "₹1,000 (and in multiples of ₹1 thereafter)",
    minAdditional: "₹1,000 (and in multiples of ₹1 thereafter)",
    minSip: "₹500 per month (minimum 12 installments)",
    expenseRatioDirect: "0.84%",
    expenseRatioRegular: "1.65%",
    aum: "₹23,400+ Crores",
    assetAllocation: {
      equity: "92.6% in equities across Large, Mid, and Small Cap segments",
      debt: "7.4% in debt, cash and money market securities",
    },
    marketCapBreakup: {
      largeCap: 64.2,
      midCap: 21.5,
      smallCap: 14.3,
    },
    topHoldings: [
      { name: "ICICI Bank Ltd", sector: "Financial Services", percentage: 8.8 },
      { name: "HDFC Bank Ltd", sector: "Financial Services", percentage: 7.9 },
      { name: "Infosys Ltd", sector: "Information Technology", percentage: 6.1 },
      { name: "Bharti Airtel Ltd", sector: "Telecommunication", percentage: 4.9 },
      { name: "State Bank of India", sector: "Financial Services", percentage: 4.2 },
    ],
    topSectors: [
      { name: "Financial Services", percentage: 29.5 },
      { name: "Information Technology", percentage: 12.3 },
      { name: "Consumer Discretionary", percentage: 9.8 },
      { name: "Healthcare", percentage: 8.4 },
      { name: "Industrials & Infrastructure", percentage: 7.9 },
    ],
    cagrBenchmark: {
      oneYear: "~19.4%",
      threeYear: "~17.1%",
      fiveYear: "~16.9%",
    },
    taxation:
      "Equity taxation applies: STCG (<= 1 year) taxed at 20%. LTCG (> 1 year) taxed at 12.5% for gains above ₹1.25 Lakh per financial year.",
    specialFeatures: [
      "Dynamic allocation across market caps (Large, Mid, Small Cap) based on valuation and market opportunities.",
      "Short exit load duration of only 30 days (0.10%).",
      "Managed by veteran CIO & fund manager R. Srinivasan.",
    ],
    officialSourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-flexicap-fund",
    growwSourceUrl: "https://groww.in/mutual-funds/sbi-flexi-cap-fund-direct-growth",
    faqs: [
      {
        question: "What is the exit load for SBI Flexicap Fund?",
        answer:
          "The exit load for SBI Flexicap Fund is 0.10% if units are redeemed or switched out within 30 days from allotment. After 30 days, the exit load is completely NIL.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-flexicap-fund",
      },
      {
        question: "Who is the fund manager of SBI Flexicap Fund?",
        answer:
          "SBI Flexicap Fund is managed by Rama Iyer Srinivasan (R. Srinivasan), who brings more than 30 years of equity analysis and fund management expertise.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-flexicap-fund",
      },
      {
        question: "What is the benchmark of SBI Flexicap Fund?",
        answer:
          "The benchmark of SBI Flexicap Fund is the S&P BSE 500 TRI (Total Return Index).",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-flexicap-fund",
      },
      {
        question: "What is the minimum investment for SBI Flexicap Fund?",
        answer:
          "The minimum initial lumpsum investment is ₹1,000, and the minimum monthly SIP is ₹500.",
        sourceUrl: "https://groww.in/mutual-funds/sbi-flexi-cap-fund-direct-growth",
      },
      {
        question: "How does SBI Flexicap Fund allocate across market caps?",
        answer:
          "Under SEBI Flexi Cap guidelines, the fund maintains a minimum 65% in equity and dynamically allocates across large cap, mid cap, and small cap stocks without rigid sub-limits.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-flexicap-fund",
      },
    ],
  },
  {
    id: "sbi-long-term-equity",
    name: "SBI Long Term Equity Fund (ELSS)",
    shortName: "SBI ELSS Tax Saver",
    category: "Equity: ELSS (Tax Saving)",
    amc: "SBI Mutual Fund",
    fundManager: "Dinesh Balachandran (Managing since September 2016)",
    fundManagerExperience: "Over 20 years of experience in financial markets and fund management.",
    inceptionDate: "March 31, 1993",
    benchmark: "S&P BSE 500 TRI",
    riskometer: "Very High Risk",
    investmentObjective:
      "To generate long-term capital appreciation along with tax benefits under Section 80C of the Income Tax Act, 1961 through a diversified portfolio of equity and equity-related securities.",
    lockInPeriod:
      "Mandatory 3-Year statutory lock-in period from the date of allotment of each unit/SIP installment.",
    exitLoad:
      "NIL (Redemption before 3 years is prohibited by statutory ELSS guidelines; after the 3-year lock-in, units can be redeemed with zero exit load).",
    minLumpsum: "₹500 (and in multiples of ₹500 thereafter)",
    minAdditional: "₹500 (and in multiples of ₹500 thereafter)",
    minSip: "₹500 per month (and in multiples of ₹500 thereafter)",
    expenseRatioDirect: "0.96%",
    expenseRatioRegular: "1.61%",
    aum: "₹25,850+ Crores",
    assetAllocation: {
      equity: "93.1% in equity and equity-related instruments",
      debt: "6.9% in debt and money market instruments",
    },
    marketCapBreakup: {
      largeCap: 68.5,
      midCap: 20.3,
      smallCap: 11.2,
    },
    topHoldings: [
      { name: "ICICI Bank Ltd", sector: "Financial Services", percentage: 7.8 },
      { name: "Mahindra & Mahindra Ltd", sector: "Automobile", percentage: 5.4 },
      { name: "Infosys Ltd", sector: "Information Technology", percentage: 5.1 },
      { name: "State Bank of India", sector: "Financial Services", percentage: 4.6 },
      { name: "Larsen & Toubro Ltd", sector: "Capital Goods", percentage: 4.3 },
    ],
    topSectors: [
      { name: "Financial Services", percentage: 28.1 },
      { name: "Automobile & Auto Components", percentage: 11.4 },
      { name: "Information Technology", percentage: 10.2 },
      { name: "Capital Goods & Construction", percentage: 8.9 },
      { name: "Healthcare", percentage: 7.2 },
    ],
    cagrBenchmark: {
      oneYear: "~21.8%",
      threeYear: "~24.2%",
      fiveYear: "~21.5%",
    },
    taxation:
      "Tax saving up to ₹1.5 Lakh under Section 80C of Income Tax Act (Old Regime). Capital gains upon redemption after 3 years are taxed as LTCG at 12.5% for gains exceeding ₹1.25 Lakh per financial year.",
    specialFeatures: [
      "Tax deduction of up to ₹1,50,000 under Section 80C of the Income Tax Act, 1961 (under Old Regime).",
      "Shortest statutory lock-in period (3 years) among all Section 80C tax-saving financial instruments (compared to PPF 15 yrs, NSC 5 yrs, Tax FD 5 yrs).",
      "One of the oldest ELSS funds in India, with an inception track record dating back to March 1993.",
    ],
    officialSourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-long-term-equity-fund",
    growwSourceUrl: "https://groww.in/mutual-funds/sbi-magnum-tax-gain-scheme-direct-growth",
    faqs: [
      {
        question: "What is the lock-in period for SBI Long Term Equity Fund?",
        answer:
          "SBI Long Term Equity Fund has a mandatory statutory lock-in period of 3 years from the date of allotment. For SIP investments, each installment has its own independent 3-year lock-in period.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-long-term-equity-fund",
      },
      {
        question: "What tax benefits does SBI Long Term Equity Fund offer?",
        answer:
          "Investments up to ₹1,50,000 per financial year in SBI Long Term Equity Fund qualify for tax deductions under Section 80C of the Income Tax Act, 1961 under the Old Tax Regime.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-long-term-equity-fund",
      },
      {
        question: "What is the exit load for SBI Long Term Equity Fund?",
        answer:
          "The exit load is NIL. Units cannot be redeemed before the mandatory 3-year lock-in period, and once the 3-year period expires, redemption attracts zero exit load.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-long-term-equity-fund",
      },
      {
        question: "Who manages SBI Long Term Equity Fund?",
        answer:
          "The fund is managed by Dinesh Balachandran, who has been managing it since September 2016 and brings more than 20 years of investment and research experience.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-long-term-equity-fund",
      },
      {
        question: "What is the minimum SIP for SBI Long Term Equity Fund?",
        answer:
          "The minimum SIP amount is ₹500 and in multiples of ₹500 thereafter.",
        sourceUrl: "https://groww.in/mutual-funds/sbi-magnum-tax-gain-scheme-direct-growth",
      },
    ],
  },
  {
    id: "sbi-magnum-midcap",
    name: "SBI Magnum Midcap Fund",
    shortName: "SBI Magnum Midcap",
    category: "Equity: Mid Cap",
    amc: "SBI Mutual Fund",
    fundManager: "Bhavin Vithlani (Managing since October 2022)",
    fundManagerExperience: "Over 20 years of experience in equity research and portfolio management.",
    inceptionDate: "March 29, 2005",
    benchmark: "NIFTY Midcap 150 TRI",
    riskometer: "Very High Risk",
    investmentObjective:
      "To provide investors with opportunities for long-term capital growth along with the liquidity of an open-ended scheme by investing predominantly in a well-diversified portfolio of equity shares of mid cap companies (minimum 65% in mid-cap companies).",
    lockInPeriod: "NIL (Open-ended scheme with no lock-in)",
    exitLoad:
      "For redemption or switch-out on or before 1 year from the date of allotment: 1.00%. If redeemed after 1 year: NIL.",
    minLumpsum: "₹5,000 (and in multiples of ₹1 thereafter)",
    minAdditional: "₹1,000 (and in multiples of ₹1 thereafter)",
    minSip: "₹500 per month (minimum 12 installments)",
    expenseRatioDirect: "0.83%",
    expenseRatioRegular: "1.72%",
    aum: "₹20,600+ Crores",
    assetAllocation: {
      equity: "94.2% in equity and equity-related instruments of mid-cap companies",
      debt: "5.8% in debt and money market instruments",
    },
    marketCapBreakup: {
      largeCap: 9.1,
      midCap: 69.8,
      smallCap: 21.1,
    },
    topHoldings: [
      { name: "CRISIL Ltd", sector: "Financial Services", percentage: 5.6 },
      { name: "Max Financial Services", sector: "Financial Services", percentage: 4.8 },
      { name: "Sundram Fasteners Ltd", sector: "Automobile", percentage: 4.3 },
      { name: "Torrent Power Ltd", sector: "Utilities", percentage: 4.1 },
      { name: "The Federal Bank Ltd", sector: "Financial Services", percentage: 3.9 },
    ],
    topSectors: [
      { name: "Financial Services", percentage: 22.8 },
      { name: "Automobile & Components", percentage: 14.5 },
      { name: "Capital Goods", percentage: 13.1 },
      { name: "Chemicals & Petrochemicals", percentage: 8.6 },
      { name: "Consumer Services", percentage: 7.9 },
    ],
    cagrBenchmark: {
      oneYear: "~23.5%",
      threeYear: "~22.8%",
      fiveYear: "~24.1%",
    },
    taxation:
      "Equity taxation applies: STCG (<= 1 year) taxed at 20%. LTCG (> 1 year) taxed at 12.5% for gains exceeding ₹1.25 Lakh per financial year.",
    specialFeatures: [
      "Invests predominantly in 101st to 250th companies by market capitalization (Mid Caps).",
      "Aims to capture high growth potential of emerging market leaders.",
      "High growth potential accompanied by higher market volatility than large-cap schemes.",
    ],
    officialSourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-magnum-midcap-fund",
    growwSourceUrl: "https://groww.in/mutual-funds/sbi-magnum-midcap-fund-direct-growth",
    faqs: [
      {
        question: "What is the exit load for SBI Magnum Midcap Fund?",
        answer:
          "For redemption or switch-out of units within 1 year from allotment, an exit load of 1.00% is charged. After 1 year, no exit load is applicable (NIL).",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-magnum-midcap-fund",
      },
      {
        question: "Who is the fund manager of SBI Magnum Midcap Fund?",
        answer:
          "SBI Magnum Midcap Fund is managed by Bhavin Vithlani (since October 2022), who has over two decades of capital markets and equity research experience.",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-magnum-midcap-fund",
      },
      {
        question: "What is the benchmark of SBI Magnum Midcap Fund?",
        answer:
          "The benchmark of SBI Magnum Midcap Fund is the NIFTY Midcap 150 TRI (Total Return Index).",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-magnum-midcap-fund",
      },
      {
        question: "What is the minimum SIP and lumpsum for SBI Magnum Midcap Fund?",
        answer:
          "The minimum initial lumpsum purchase is ₹5,000, and the minimum monthly SIP is ₹500 (minimum 12 installments).",
        sourceUrl: "https://groww.in/mutual-funds/sbi-magnum-midcap-fund-direct-growth",
      },
      {
        question: "What market capitalization does SBI Magnum Midcap Fund invest in?",
        answer:
          "As per SEBI regulations, SBI Magnum Midcap Fund invests at least 65% of its total assets in equity shares of mid-cap companies (companies ranked 101st to 250th in terms of full market capitalization).",
        sourceUrl: "https://www.sbimf.com/en-us/equity-schemes/sbi-magnum-midcap-fund",
      },
    ],
  },
];

export const GENERAL_KNOWLEDGE_SUMMARY = `
AMC: SBI Mutual Fund (SBI Funds Management Limited, a joint venture between State Bank of India and Amundi Asset Management).
Regulator: SEBI (Securities and Exchange Board of India) and AMFI.
Platform: Groww (Nextbillion Technology Pvt Ltd).

Schemes covered:
1. SBI Bluechip Fund (Large Cap)
2. SBI Flexicap Fund (Flexi Cap)
3. SBI Long Term Equity Fund (ELSS - Tax Saving)
4. SBI Magnum Midcap Fund (Mid Cap)

Standard Regulatory Rules & Policies:
- Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
- Tax Treatment: As per Finance Act 2024:
  - Short Term Capital Gains (STCG) on Equity Mutual Funds (held for 12 months or less) are taxed at 20% + surcharge & cess.
  - Long Term Capital Gains (LTCG) on Equity Mutual Funds (held for more than 12 months) are taxed at 12.5% + cess on gains above ₹1,25,000 per financial year.
  - ELSS investments qualify for deduction up to ₹1,50,000 under Section 80C of the Income Tax Act, 1961 (Old Tax Regime) with a mandatory 3-year lock-in.
- SIP vs Lumpsum: Systematic Investment Plan (SIP) allows periodic scheduled investments, whereas Lumpsum is a one-time single investment.
`;

export const SAMPLE_QUESTIONS = [
  {
    category: "SBI Bluechip Fund",
    schemeId: "sbi-bluechip",
    questions: [
      "What is the exit load for SBI Bluechip Fund?",
      "Who is the fund manager of SBI Bluechip Fund?",
      "What is the benchmark and minimum SIP for SBI Bluechip Fund?",
      "What are the top holdings and sector allocations for SBI Bluechip?",
    ],
  },
  {
    category: "SBI Flexicap Fund",
    schemeId: "sbi-flexicap",
    questions: [
      "What is the exit load and holding period for SBI Flexicap Fund?",
      "Who manages SBI Flexicap Fund and what is their track record?",
      "How does SBI Flexicap Fund allocate across market caps?",
    ],
  },
  {
    category: "SBI Long Term Equity (ELSS)",
    schemeId: "sbi-long-term-equity",
    questions: [
      "What is the lock-in period for SBI Long Term Equity Fund?",
      "What tax benefits are available under Section 80C for SBI Long Term Equity Fund?",
      "What is the exit load for SBI Long Term Equity Fund?",
    ],
  },
  {
    category: "SBI Magnum Midcap Fund",
    schemeId: "sbi-magnum-midcap",
    questions: [
      "What is the benchmark of SBI Magnum Midcap Fund?",
      "What is the exit load for SBI Magnum Midcap Fund?",
      "What is the minimum lumpsum and SIP investment for SBI Magnum Midcap?",
    ],
  },
  {
    category: "Comparison & Analytics",
    schemeId: "all",
    questions: [
      "Compare the exit loads of all four SBI schemes in a table.",
      "Which of these funds offers Section 80C tax exemption?",
      "Compare the expense ratios and AUM across these four SBI funds.",
    ],
  },
];
