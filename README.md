# Groww Mutual Fund Facts Assistant 🟢

An AI-powered factual assistant designed with Groww's modern fintech interface for **SBI Mutual Fund** schemes. It is strictly grounded in official Scheme Information Documents (SID), Key Information Memorandums (KIM), and Groww factsheets.

---

## 🏛️ Supported Mutual Fund Schemes (SBI Mutual Fund)

1. **SBI Bluechip Fund** — Equity: Large Cap
2. **SBI Flexicap Fund** — Equity: Flexi Cap
3. **SBI Long Term Equity Fund (ELSS)** — Equity: Tax Saving (Section 80C)
4. **SBI Magnum Midcap Fund** — Equity: Mid Cap

---

## 🛡️ Core Factual & Regulatory Guardrails

- **Verified Facts Only**: Grounded strictly in official SEBI filings and SID/KIM factsheets.
- **Strict Compliance & Zero Advice**: No buy/sell recommendations, portfolio suitability judgments, or speculative return predictions.
- **Mandatory Single Source Citation**: Every generated response includes exactly one verified source link (to `sbimf.com` or `groww.in`).
- **Graceful Unverified Fallback**: If information is unavailable or outside scope, the bot responds:
  > *"I couldn't find verified information for this question."*

---

## 🚀 How to Run Locally

### 1. Web Application (React + Express + Gemini)

The primary full-stack web application runs in the dev server environment:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the web app.

### 2. Standalone Streamlit App (`app.py`)

To run the Streamlit Python version locally:

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Set Gemini API Key
export GEMINI_API_KEY="your-gemini-api-key"

# Run Streamlit
streamlit run app.py
```

---

## ☁️ Deploying to Streamlit Community Cloud

1. Push this repository to GitHub.
2. Sign in to [share.streamlit.io](https://share.streamlit.io/).
3. Click **"New App"** and select your GitHub repository.
4. Set:
   - **Main file path:** `app.py`
5. Go to **Advanced Settings > Secrets** and add:
   ```toml
   GEMINI_API_KEY = "your-gemini-api-key-here"
   ```
6. Click **Deploy!** Your Groww Mutual Fund Facts Assistant will be live on Streamlit Cloud.

---

## ⚖️ Statutory Disclaimer

*Mutual Fund investments are subject to market risks, read all scheme related documents carefully. This application is an informational factsheet query assistant and does not provide financial or investment advice.*
