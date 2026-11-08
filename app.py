"""
Groww Mutual Fund Facts Assistant
Production-ready Streamlit Application for SBI Mutual Fund Schemes
Replicating exact Groww light visual theme from: https://groww-chatbot-kngkx7vjuez9igcjj8fqvx.streamlit.app/
Deployable directly on Streamlit Community Cloud.
"""

import os
import streamlit as st
from google import genai
from google.genai import types

# Set Page Configuration
st.set_page_config(
    page_title="Groww Mutual Fund Facts Assistant",
    page_icon="🟢",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Groww-themed Light CSS Styling
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    html, body, [class*="css"], .stApp {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background-color: #f9fafb;
        color: #111827;
    }

    /* Ambient headers */
    .groww-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
        padding: 8px 0;
    }

    .groww-badge {
        background: #00D09C;
        color: #ffffff;
        font-weight: 900;
        font-size: 1.5rem;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0, 208, 156, 0.25);
    }

    .stButton>button {
        border-radius: 12px;
        font-weight: 700;
        background-color: #ffffff;
        color: #374151;
        border: 1px solid #e5e7eb;
        transition: all 0.2s;
    }

    .stButton>button:hover {
        border-color: #00D09C;
        color: #008765;
        background-color: #E8FAF5;
    }

    /* Metrics card */
    div[data-testid="stMetric"] {
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 16px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Helper to calculate estimated reading time
def calculate_reading_time(text: str) -> str:
    clean_text = text.replace("*", "").replace("#", "").replace("`", "").strip()
    words = len(clean_text.split())
    mins = max(1, (words + 199) // 200)
    return f"⏱️ {mins} min read"

# Verified Knowledge Base
KNOWLEDGE_BASE = """
AMC: SBI Mutual Fund (SBI Funds Management Limited).
Platform: Groww Mutual Fund Facts Assistant.

SCHEMES COVERED:
1. SBI Bluechip Fund
- Category: Equity - Large Cap (Min 80% in Top 100 stocks)
- Inception Date: February 14, 2006
- Fund Manager: Saurabh Pant (since January 2024)
- Benchmark: S&P BSE 100 TRI
- Riskometer: Very High Risk
- Investment Objective: Long-term growth of capital through active management in diversified basket of large cap equity stocks.
- Lock-in: NIL (Open-ended scheme)
- Exit Load: For exit within 1 year: 1.00% if redeemed in excess of 10% of investment. NIL after 1 year.
- Min Investment: Lumpsum ₹5,000; Monthly SIP ₹500 (min 12 installments)
- Expense Ratio: Direct ~0.87%, Regular ~1.58%
- AUM: ₹48,250+ Crores
- Market Cap Allocation: Large Cap 83.4%, Mid Cap 11.2%, Small Cap 5.4%
- Top Holdings: HDFC Bank (9.1%), ICICI Bank (8.4%), Reliance Industries (7.2%), Infosys (6.5%), Larsen & Toubro (4.8%)
- Source: https://www.sbimf.com/en-us/equity-schemes/sbi-bluechip-fund

2. SBI Flexicap Fund (formerly SBI Magnum MultiCap Fund)
- Category: Equity - Flexi Cap (Dynamically invests across Large, Mid, Small caps, min 65% in equity)
- Inception Date: September 29, 2005
- Fund Manager: Rama Iyer Srinivasan (R. Srinivasan)
- Benchmark: S&P BSE 500 TRI
- Riskometer: Very High Risk
- Investment Objective: Long-term capital appreciation across large, mid, and small cap companies.
- Lock-in: NIL (Open-ended scheme)
- Exit Load: 0.10% if redeemed or switched out on or before 30 days. NIL after 30 days.
- Min Investment: Lumpsum ₹1,000; Monthly SIP ₹500
- Expense Ratio: Direct ~0.84%, Regular ~1.65%
- AUM: ₹23,400+ Crores
- Market Cap Allocation: Large Cap 64.2%, Mid Cap 21.5%, Small Cap 14.3%
- Top Holdings: ICICI Bank (8.8%), HDFC Bank (7.9%), Infosys (6.1%), Bharti Airtel (4.9%), State Bank of India (4.2%)
- Source: https://www.sbimf.com/en-us/equity-schemes/sbi-flexicap-fund

3. SBI Long Term Equity Fund (ELSS)
- Category: Equity - ELSS (Tax Saving)
- Inception Date: March 31, 1993
- Fund Manager: Dinesh Balachandran
- Benchmark: S&P BSE 500 TRI
- Riskometer: Very High Risk
- Investment Objective: Generate long-term capital appreciation along with tax benefits under Section 80C.
- Tax Benefit: Up to ₹1,50,000 deduction under Section 80C of Income Tax Act, 1961 (Old Tax Regime).
- Lock-in: Mandatory 3-Year statutory lock-in period for every installment.
- Exit Load: NIL (Redemption before 3 years is prohibited; zero exit load after 3 years).
- Min Investment: Lumpsum ₹500; Monthly SIP ₹500
- Expense Ratio: Direct ~0.96%, Regular ~1.61%
- AUM: ₹25,850+ Crores
- Market Cap Allocation: Large Cap 68.5%, Mid Cap 20.3%, Small Cap 11.2%
- Top Holdings: ICICI Bank (7.8%), M&M (5.4%), Infosys (5.1%), SBI (4.6%), L&T (4.3%)
- Source: https://www.sbimf.com/en-us/equity-schemes/sbi-long-term-equity-fund

4. SBI Magnum Midcap Fund
- Category: Equity - Mid Cap (Min 65% in Mid-Cap stocks 101st-250th market cap)
- Inception Date: March 29, 2005
- Fund Manager: Bhavin Vithlani
- Benchmark: NIFTY Midcap 150 TRI
- Riskometer: Very High Risk
- Investment Objective: Long-term capital growth by investing predominantly in mid cap companies.
- Lock-in: NIL (Open-ended scheme)
- Exit Load: 1.00% if redeemed or switched out on or before 1 year. NIL after 1 year.
- Min Investment: Lumpsum ₹5,000; Monthly SIP ₹500
- Expense Ratio: Direct ~0.83%, Regular ~1.72%
- AUM: ₹20,600+ Crores
- Market Cap Allocation: Large Cap 9.1%, Mid Cap 69.8%, Small Cap 21.1%
- Top Holdings: CRISIL (5.6%), Max Financial (4.8%), Sundram Fasteners (4.3%), Torrent Power (4.1%), Federal Bank (3.9%)
- Source: https://www.sbimf.com/en-us/equity-schemes/sbi-magnum-midcap-fund

General Taxation:
- Equity Mutual Funds: Short Term Capital Gains (STCG <= 1 yr) taxed at 20%. Long Term Capital Gains (LTCG > 1 yr) taxed at 12.5% for gains above ₹1.25 Lakh per financial year.
"""

SYSTEM_INSTRUCTION = f"""
You are the Groww Mutual Fund Facts Assistant for SBI Mutual Fund schemes.
Answer questions strictly using verified facts from this official factsheet:

{KNOWLEDGE_BASE}

RULES:
1. Verified Facts Only: Only state verified information from the official scheme factsheet above.
2. Zero Advice / Predictions: Absolutely NO investment recommendations, portfolio suitability advice, or return predictions.
3. Single Source Link: Every single response MUST conclude with exactly one source link on its own line:
Source: <official_link>
(e.g., https://www.sbimf.com/en-us/equity-schemes/sbi-bluechip-fund or https://www.sbimf.com)
4. Fallback Rule: If the information requested is unavailable or outside these 4 SBI schemes, respond exactly:
"I couldn't find verified information for this question.
Source: https://www.sbimf.com"
"""

# Retrieve API Key from Streamlit secrets or environment
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    try:
        api_key = st.secrets["GEMINI_API_KEY"]
    except Exception:
        api_key = None

# Sidebar Controls
with st.sidebar:
    st.markdown("### 🟢 Groww Assistant")
    st.markdown("**AMC:** SBI Mutual Fund")
    st.caption("Verified Scheme Facts & Regulatory Information")

    st.markdown("---")
    st.markdown("#### 💡 Quick FAQ Inquiries")
    sample_queries = [
        "What is the exit load for SBI Bluechip Fund?",
        "What is the lock-in period for SBI Long Term Equity Fund?",
        "Who is the fund manager of SBI Flexicap Fund?",
        "What is the benchmark of SBI Magnum Midcap Fund?",
        "What tax benefits are available under Section 80C for SBI ELSS?",
        "Compare the exit loads and lock-in periods of all 4 SBI schemes.",
    ]

    for q in sample_queries:
        if st.button(q, key=f"btn_{q}"):
            st.session_state["pending_query"] = q

    st.markdown("---")
    if st.button("🗑️ Clear Chat History", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

    st.caption("⚖️ Statutory Disclaimer: Informational factsheet query assistant. Not an investment advisory service.")

# Header
st.markdown(
    """
    <div class="groww-header">
        <div class="groww-badge">G</div>
        <div>
            <h2 style="margin: 0; padding: 0; font-weight: 800; color: #111827;">Groww Mutual Fund Facts Assistant</h2>
            <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">Verified factual information for SBI Mutual Fund schemes</p>
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)

# App Navigation Tabs
tab_chat, tab_calc, tab_compare = st.tabs(["💬 AI Facts Assistant", "🧮 SIP & Wealth Calculator", "📊 Scheme Comparison"])

# Initialize Session State
if "messages" not in st.session_state:
    st.session_state.messages = []

# --- TAB 1: Chat Assistant ---
with tab_chat:
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
            if msg["role"] == "assistant":
                reading_badge = calculate_reading_time(msg["content"])
                st.caption(f"{reading_badge} • Verified Facts")

    if not api_key:
        st.warning("⚠️ GEMINI_API_KEY is not set. Please add GEMINI_API_KEY to your Streamlit secrets or environment variables.")
    else:
        user_query = st.chat_input("Ask about exit load, lock-in, fund manager, expense ratio, or 80C tax rules...")

        if "pending_query" in st.session_state and st.session_state["pending_query"]:
            user_query = st.session_state.pop("pending_query")

        if user_query:
            st.session_state.messages.append({"role": "user", "content": user_query})
            with st.chat_message("user"):
                st.markdown(user_query)

            with st.chat_message("assistant"):
                with st.spinner("Checking verified scheme records..."):
                    try:
                        client = genai.Client(
                            api_key=api_key,
                            http_options={"headers": {"User-Agent": "aistudio-build"}},
                        )

                        contents = []
                        for m in st.session_state.messages[-6:]:
                            contents.append(
                                types.Content(
                                    role=m["role"],
                                    parts=[types.Part.from_text(text=m["content"])],
                                )
                            )

                        response = client.models.generate_content(
                            model="gemini-3.8-flash",
                            contents=contents,
                            config=types.GenerateContentConfig(
                                system_instruction=SYSTEM_INSTRUCTION,
                            ),
                        )

                        reply = response.text or "I couldn't find verified information for this question.\nSource: https://www.sbimf.com"
                        st.markdown(reply)
                        reading_badge = calculate_reading_time(reply)
                        st.caption(f"{reading_badge} • Verified Facts")
                        st.session_state.messages.append({"role": "assistant", "content": reply})

                    except Exception as e:
                        err_msg = f"Error communicating with Gemini API: {str(e)}"
                        st.error(err_msg)

# --- TAB 2: SIP & Wealth Calculator ---
with tab_calc:
    st.subheader("Groww Interactive SIP & Lumpsum Calculator")
    st.caption("Calculate projected wealth accumulation based on compounding return rates.")

    col1, col2 = st.columns([1, 1])
    with col1:
        calc_mode = st.radio("Investment Mode", ["Monthly SIP", "One-Time Lumpsum"], horizontal=True)
        if calc_mode == "Monthly SIP":
            monthly_inv = st.slider("Monthly Investment Amount (₹)", min_value=500, max_value=100000, value=5000, step=500)
            exp_rate = st.slider("Expected Annual Return Rate (% p.a.)", min_value=5.0, max_value=30.0, value=15.0, step=0.5)
            inv_years = st.slider("Investment Horizon (Years)", min_value=1, max_value=30, value=10, step=1)

            total_months = inv_years * 12
            monthly_rate = exp_rate / 12 / 100
            total_invested = monthly_inv * total_months
            if monthly_rate > 0:
                corpus = monthly_inv * (((1 + monthly_rate) ** total_months - 1) / monthly_rate) * (1 + monthly_rate)
            else:
                corpus = total_invested
            returns = max(0, corpus - total_invested)
        else:
            lumpsum_inv = st.slider("Lumpsum Investment Amount (₹)", min_value=1000, max_value=1000000, value=50000, step=5000)
            exp_rate = st.slider("Expected Annual Return Rate (% p.a.)", min_value=5.0, max_value=30.0, value=15.0, step=0.5)
            inv_years = st.slider("Investment Horizon (Years)", min_value=1, max_value=30, value=10, step=1)

            total_invested = lumpsum_inv
            corpus = lumpsum_inv * ((1 + exp_rate / 100) ** inv_years)
            returns = max(0, corpus - total_invested)

    with col2:
        st.markdown("#### 📈 Projection Summary")
        st.metric("Total Invested Amount", f"₹{total_invested:,.0f}")
        st.metric("Estimated Wealth Gain", f"₹{returns:,.0f}")
        st.metric("Total Future Corpus", f"₹{corpus:,.0f}", delta=f"+{((corpus - total_invested)/total_invested * 100):.1f}%")
        st.caption("*Compounded returns are for illustrative purposes. Past performance is not indicative of future returns.")

# --- TAB 3: Scheme Comparison ---
with tab_compare:
    st.subheader("SBI Mutual Fund Schemes Comparison")
    import pandas as pd
    comparison_data = {
        "Metric": [
            "Category",
            "Inception Date",
            "Fund Manager",
            "Benchmark",
            "Lock-in Period",
            "Exit Load",
            "Section 80C Benefit",
            "Min SIP / Lumpsum",
            "Direct Expense Ratio",
            "AUM",
            "Official Factsheet"
        ],
        "SBI Bluechip Fund": [
            "Large Cap",
            "14-Feb-2006",
            "Saurabh Pant",
            "S&P BSE 100 TRI",
            "NIL",
            "1.00% if <= 1 yr",
            "No",
            "₹500 / ₹5,000",
            "~0.87%",
            "₹48,250+ Cr",
            "sbimf.com"
        ],
        "SBI Flexicap Fund": [
            "Flexi Cap",
            "29-Sep-2005",
            "R. Srinivasan",
            "S&P BSE 500 TRI",
            "NIL",
            "0.10% if <= 30 days",
            "No",
            "₹500 / ₹1,000",
            "~0.84%",
            "₹23,400+ Cr",
            "sbimf.com"
        ],
        "SBI Long Term Equity (ELSS)": [
            "ELSS Tax Saver",
            "31-Mar-1993",
            "Dinesh Balachandran",
            "S&P BSE 500 TRI",
            "3 Years (Mandatory)",
            "NIL (after 3y lock-in)",
            "Yes (up to ₹1.5L)",
            "₹500 / ₹500",
            "~0.96%",
            "₹25,850+ Cr",
            "sbimf.com"
        ],
        "SBI Magnum Midcap Fund": [
            "Mid Cap",
            "29-Mar-2005",
            "Bhavin Vithlani",
            "NIFTY Midcap 150 TRI",
            "NIL",
            "1.00% if <= 1 yr",
            "No",
            "₹500 / ₹5,000",
            "~0.83%",
            "₹20,600+ Cr",
            "sbimf.com"
        ]
    }
    df = pd.DataFrame(comparison_data)
    st.dataframe(df, use_container_width=True, hide_index=True)
