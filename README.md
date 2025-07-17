# AI Meeting Summary + CRM Note Generator

An AI-powered web application that processes meeting transcripts or audio recordings to generate **structured CRM summaries, pain points, objections, action items, and timelines** using Google Cloud Speech-to-Text and Gemini Pro.


<img width="1000" height="700" alt="Screenshot 2025-07-17 155343" src="https://github.com/user-attachments/assets/4cb7cf1c-644b-4521-a41d-daccaaac7510" />
<img width="1000" height="700" alt="Screenshot 2025-07-17 155401" src="https://github.com/user-attachments/assets/d74897a9-1968-443e-a06b-06d1bbb63a84" />


## 🚀 Live Demo

- **Frontend (Netlify)**: https://mesummarizer.netlify.app/
- **Backend API (Render)**: https://ai-meeting-crm-summarizer-1.onrender.com

## 📋 Overview

The AI Meeting Summarizer is a comprehensive tool that converts meeting audio recordings or text transcripts into structured summaries, action items, and CRM-ready notes. Built with modern web technologies and powered by advanced AI, it streamlines the post-meeting workflow for sales teams and business professionals.

## ✨ Features

### 🎯 Core Functionality
- **Audio Processing**: Upload MP3, WAV, or M4A files (up to 20MB)
- **Text Input**: Direct transcript paste for immediate processing
- **AI Summarization**: Generate structured meeting summaries
- **CRM Integration**: Extract key insights, action items, and follow-ups
- **Email Distribution**: Send summaries directly to team members
- **Export Options**: Download results in JSON or CSV format

### 🎨 User Experience
- **Modern UI**: Clean, professional interface following AI industry standards
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Real-time Feedback**: Progress indicators and notifications
- **Accessibility**: WCAG compliant with proper contrast and focus states

### 🔧 Technical Features
- **Fast Processing**: Efficient API calls with loading states
- **Error Handling**: Comprehensive error management and user feedback
- **File Validation**: Secure file upload with type and size restrictions
- **Cross-platform**: Works across all modern browsers

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Beautiful, customizable icons
- **Deployed on**: Netlify with automatic builds

### Backend
- **Python**: Core backend language
- **FastAPI**: High-performance API framework
- **AI/ML**: Advanced language models for summarization
- **Deployed on**: Render with automatic scaling

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ (for backend development)
- Modern web browser

### Frontend Setup
```bash
# Clone the repository
git clone [your-repo-url]
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload

# The API will be available at http://localhost:8000
```

## 📖 Usage Guide

### 1. Input Methods
**Text Transcript:**
- Paste your meeting transcript directly into the text area
- Support for any length of text content

**Audio Upload:**
- Click the upload area or drag and drop audio files
- Supported formats: MP3, WAV, M4A
- Maximum file size: 20MB

### 2. Processing
- Click "Process Meeting" to analyze your content
- AI will generate structured summaries and insights
- Processing time varies based on content length

### 3. Results
**Meeting Summary includes:**
- Clean transcript (if audio was uploaded)
- Key discussion points
- Action items and next steps
- Participant insights
- Meeting outcomes

### 4. Actions
**Export Options:**
- **JSON**: Structured data for integration
- **CSV**: Spreadsheet-friendly format

**Email Distribution:**
- Enter recipient email address
- Send formatted summary directly

## 🔗 API Endpoints

### Base URL: `https://ai-meeting-crm-summarizer-1.onrender.com`

#### Main Endpoints
- `POST /process_audio_meeting/` - Process audio files
- `POST /process_text_meeting/` - Process text transcripts
- `POST /email_summary/` - Send email summaries
- `GET /export/json/` - Export as JSON
- `GET /export/csv/` - Export as CSV

#### Example Usage
```javascript
// Process text transcript
const formData = new FormData();
formData.append("transcript_text", "Your meeting transcript here...");

const response = await fetch("https://ai-meeting-crm-summarizer-1.onrender.com/process_text_meeting/", {
  method: "POST",
  body: formData,
});

const result = await response.json();
```

## 🎯 Use Cases

### Sales Teams
- Convert sales calls into CRM entries
- Extract customer requirements and objections
- Generate follow-up action items
- Track deal progression insights

### Business Meetings
- Summarize strategy sessions
- Document decision points
- Create action item lists
- Share meeting outcomes

### Client Consultations
- Capture client requirements
- Document project scope
- Generate proposal insights
- Track client preferences

## 🔒 Security & Privacy

- **Data Processing**: All content is processed securely
- **No Storage**: Files are not permanently stored
- **Secure API**: HTTPS encryption for all communications
- **Privacy First**: No personal data retention

## 🌟 Performance

- **Fast Processing**: Optimized AI models for quick results
- **Responsive UI**: Smooth interactions across all devices
- **Reliable Backend**: 99.9% uptime on Render platform
- **Global CDN**: Fast loading via Netlify's global network


## 📞 Support

For support, questions, or feature requests:
- Create an issue in the GitHub repository
- Email: [yuvrajdawande373@gmail.com]


## 🎉 Acknowledgments

- Built with modern web technologies
- Powered by advanced AI language models
- Designed for business professionals
- Inspired by the need for efficient meeting workflows

---

**Made with ❤️ for productive meetings**

*Last updated: [Current Date]*
