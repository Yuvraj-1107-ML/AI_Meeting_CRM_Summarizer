# AI Meeting Summary + CRM Note Generator

An AI-powered web application that processes meeting transcripts or audio recordings to generate **structured CRM summaries, pain points, objections, action items, and timelines** using Google Cloud Speech-to-Text and Gemini Pro.

---

## ✨ Features

✅ Upload meeting audio files or paste transcript text  
✅ Generates structured CRM-ready summaries using Gemini  
✅ Download results as JSON or CSV  
✅ Send summaries via email  
✅ Responsive, elegant frontend (React + Tailwind CSS)  
✅ FastAPI backend with Google Cloud integration

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- Google Cloud Platform account
- Gemini API key

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Yuvraj-1107-ML/AI_Meeting_CRM_Summarizer.git
cd AI_Meeting_CRM_Summarizer
```

#### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Backend Environment Variables**

Create a `.env` file in the `backend/` directory:

```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/google-credentials.json
GEMINI_API_KEY=your-gemini-api-key
```

#### 3. Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
```

**Frontend Environment Variables**

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

#### 4. Run the Application

**Start Backend Server:**

```bash
cd backend
python main.py
```

**Start Frontend Server:**

```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Configuration

### Google Cloud Setup

1. Create a Google Cloud Project
2. Enable Speech-to-Text API
3. Create a service account and download the JSON credentials file
4. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable

### Gemini API Setup

1. Get your Gemini API key from Google AI Studio
2. Add it to your backend `.env` file

---

## 🎯 Usage

1. **Upload Audio**: Upload meeting audio files (supported formats: WAV, MP3, FLAC)
2. **Or Paste Transcript**: Directly paste meeting transcript text
3. **Generate Summary**: Click "Generate Summary" to process with AI
4. **Download Results**: Export summaries as JSON or CSV
5. **Email Integration**: Send summaries directly via email

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: FastAPI, Python
- **AI Services**: Google Cloud Speech-to-Text, Gemini Pro
- **File Processing**: Audio transcription and text analysis

---

## 🌟 Credits

Built with ❤️ by **Yuvraj Dawande**

**Powered by:**
- React.js
- FastAPI
- Google Cloud Speech-to-Text
- Gemini Pro

---

##  Support

For questions or issues, please open an issue on GitHub or contact the maintainer.

**Repository**: [AI_Meeting_CRM_Summarizer](https://github.com/Yuvraj-1107-ML/AI_Meeting_CRM_Summarizer)
