# 🌿 PhytoShield AI — Crop Health & Plant Disease Diagnostics

> **An intelligent, computer-vision powered platform that empowers farmers, gardeners, and agronomists to instantly diagnose plant diseases, identify pests, and receive eco-friendly treatment plans using Multi-Modal Vision AI.**

---

## 📖 Project Overview & Purpose

**PhytoShield AI** is a state-of-the-art agricultural intelligence platform designed to secure crop yields and promote sustainable farming practices. Crop diseases and pests account for up to 40% of global food production losses. PhytoShield AI bridges the gap between expert plant pathology and everyday growers by providing a **zero-friction physical-to-digital diagnosis pipeline**:

1. **Snap or Upload a Photo:** The grower takes a photo of a diseased or distressed leaf, stem, or fruit using the mobile-friendly web interface.
2. **Vision AI Analysis:** Powered by high-speed multi-modal vision models, the platform instantly identifies visual indicators of fungal, bacterial, viral, or nutrient-deficiency stresses.
3. **Comprehensive Diagnostics:** Provides details on the pathogen/pest, severity score, spread risk, and detailed treatment instructions.
4. **Dual Treatment Pathways:** Recommends both biological/organic remedies (to support organic farming) and chemical solutions (for high-severity infestations) along with preventive agricultural practices.
5. **Crop Health Dashboard:** Tracks historical diagnoses, maps disease outbreaks, and tracks recovery trajectories over time.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | High-contrast, responsive UI tailored with TypeScript, Lucide Icons, and Recharts for interactive crop health tracking. |
| **Styling** | Tailwind CSS & shadcn/ui | Beautiful, dark-mode-first glassmorphic visual system with micro-animations and smooth transitions. |
| **Database & Auth** | Supabase | Relational cloud PostgreSQL storing user crop gardens, diagnostic history, and custom treatment logs. |
| **Computer Vision** | Groq Llama 3.2 Vision | Lightning-fast visual parsing and diagnosis extraction in under 500ms. |
| **Agronomist AI Chat** | Groq Llama 3.3 70B | Dynamic Conversational AI helping users ask follow-up questions about soil health and fertilizer schedules. |

---

## 🗺️ How it Works (The Diagnosis Pipeline)

```mermaid
graph TD
    %% Styling
    classDef client fill:#22c55e,stroke:#15803d,stroke-width:2px,color:#fff;
    classDef backend fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff;
    classDef external fill:#0ea5e9,stroke:#0369a1,stroke-width:2px,color:#fff;
    
    %% Elements
    A["🌿 Grower / Farmer (Frontend UI)"] :::client
    B["📸 Image Capture / Leaf Upload"] :::client
    C["🚀 Vite Backend Router"] :::backend
    D["🧠 Groq Llama 3.2 Vision Agent"] :::external
    E["🗄️ Supabase Diagnostic Logs"] :::external
    F["📑 Multi-Modal Diagnosis Payload"] :::backend
    G["📊 Treatment Plan & Recovery Tracker"] :::client
    
    %% Pipeline
    A -->|1. Uploads leaf photo| B
    B -->|2. Direct vision request| C
    C -->|3. Image analysis| D
    D -->|4. Structured json response| F
    F -->|5. Store record & severity metrics| E
    F -->|6. Render treatment instructions| G
```

---

## 🔐 Security & Credential Protection

> [!IMPORTANT]
> **All API tokens, database passwords, and environment credentials are fully encrypted and never committed to version control.**

We enforce robust multi-layered repository security:
1. **Environment Sandboxing:** All private configurations (Groq API keys, Supabase client configurations) are managed purely in a local, uncommitted `.env` file.
2. **Git Ignore Safeguards:** The repository features a strict [.gitignore](.gitignore) configuration which explicitly blocks:
   * Local `.env` and `.env.local` files
   * Node modules (`node_modules/`)
   * Production builds (`dist/`)
   * Lock files and metadata folders

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
Ensure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
# Clone the repository
git clone https://github.com/parthsharma8368/phyto-shield-ai.git
cd phyto-shield-ai

# Install dependencies
npm install
```

### 2. Configure Your Environment Keys
Create a `.env` file in the root directory:
```env
# Supabase Database Config
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-public-anon-key

# AI Vision API
VITE_GROQ_API_KEY=gsk_your_groq_api_key
```

### 3. Launch Development Server
```bash
npm run dev
```
Your local server will spin up instantly. Open your browser and navigate to the address shown in your console (usually `http://localhost:5173/`).

---

## 📈 Future Roadmap

* [ ] **Satellite NDVI Integration:** Link with open-source remote-sensing imagery to monitor field-level chlorophyll and health drops before visible leaf necrosis.
* [ ] **Offline Edge Inference:** Compile vision models to run client-side on mobile devices for diagnostic capabilities in remote areas without internet coverage.
* [ ] **Geo-Location Disease Mapping:** Regional notifications to alert nearby farms when a highly infectious virus (e.g., Late Blight) is diagnosed in their area.
