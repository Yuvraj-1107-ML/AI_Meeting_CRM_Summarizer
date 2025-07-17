import React, { useState, useEffect } from "react";
import { Upload, Send, Mail, CheckCircle, AlertCircle, Loader2, FileAudio, Moon, Sun, Download, Brain, Zap, Users, Clock } from "lucide-react";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [response, setResponse] = useState(null);
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [notification, setNotification] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from system preference
  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(systemPrefersDark);
  }, []);

  // Update theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
    if (file) {
      showNotification(`Audio file "${file.name}" selected`, 'info');
    }
  };

  const handleTextChange = (e) => setTextInput(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = async () => {
    if (!audioFile && !textInput.trim()) {
      showNotification("Please upload an audio file or enter text.", 'error');
      return;
    }

    setIsProcessing(true);
    try {
      let res;
      if (audioFile) {
        const formData = new FormData();
        formData.append("file", audioFile);
        res = await fetch("https://ai-meeting-crm-summarizer-1.onrender.com/process_audio_meeting/", {
          method: "POST",
          body: formData,
        });
      } else if (textInput.trim()) {
        const formData = new FormData();
        formData.append("transcript_text", textInput);
        res = await fetch("https://ai-meeting-crm-summarizer-1.onrender.com/process_text_meeting/", {
          method: "POST",
          body: formData,
        });
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setResponse(data);
      showNotification("Meeting processed successfully!", 'success');
    } catch (error) {
      console.error("Error processing meeting:", error);
      showNotification("Error processing meeting. Please try again.", 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      showNotification("Please enter receiver email.", 'error');
      return;
    }
    
    if (!response) {
      showNotification("No meeting data to send. Please process a meeting first.", 'error');
      return;
    }
    
    setIsEmailSending(true);
    try {
      const res = await fetch("https://ai-meeting-crm-summarizer-1.onrender.com/email_summary/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_email: email }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      showNotification(data.message || "Email sent successfully!", 'success');
    } catch (error) {
      console.error("Error sending email:", error);
      showNotification("Error sending email. Please try again.", 'error');
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleDownload = async (format) => {
    if (!response) {
      showNotification("No data to export. Please process a meeting first.", 'error');
      return;
    }

    try {
      const endpoint = format === 'json' ? '/export/json/' : '/export/csv/';
      const res = await fetch(`https://ai-meeting-crm-summarizer-1.onrender.com${endpoint}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meeting_summary.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotification(`${format.toUpperCase()} file downloaded successfully!`, 'success');
    } catch (error) {
      console.error(`Error downloading ${format}:`, error);
      showNotification(`Error downloading ${format} file. Please try again.`, 'error');
    }
  };

  const NotificationComponent = ({ notification }) => {
    if (!notification) return null;
    
    const iconMap = {
      success: CheckCircle,
      error: AlertCircle,
      info: FileAudio,
    };
    
    const colorMap = {
      success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
      error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
      info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    };
    
    const Icon = iconMap[notification.type];
    
    return (
      <div className={`fixed top-4 right-4 p-4 rounded-lg border flex items-center gap-2 shadow-lg z-50 ${colorMap[notification.type]} animate-in slide-in-from-right-full duration-300`}>
        <Icon size={18} />
        <span className="text-sm font-medium">{notification.message}</span>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode 
      ? 'bg-gray-900' 
      : 'bg-gray-50'}`}>
      
      <NotificationComponent notification={notification} />
      
      {/* Header */}
      <header className={`border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-600'}`}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Meeting Summarizer
              </h1>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Transform Your Meetings with AI
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Convert audio recordings or text transcripts into structured summaries, action items, and CRM insights Powered by AiLifeBOT 
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Lightning Fast
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Process hours of meeting content in seconds
              </p>
            </div>
            
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                CRM Ready
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Generate structured notes for your CRM system
              </p>
            </div>
            
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Save Time
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Eliminate manual note-taking and follow-ups
              </p>
            </div>
          </div>
        </div>

        {/* Main Input Section */}
        <div className={`rounded-xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="p-6 lg:p-8">
            <div className="space-y-8">
              {/* Text Input */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Meeting Transcript
                </label>
                <div className="relative">
                  <textarea
                    value={textInput}
                    onChange={handleTextChange}
                    rows="6"
                    placeholder="Paste your meeting transcript here..."
                    className={`w-full rounded-lg border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  />
                  <div className={`absolute bottom-3 right-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {textInput.length} characters
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center">
                <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <span className={`px-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  OR
                </span>
                <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              </div>

              {/* Audio Upload */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Audio File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${darkMode 
                      ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
                  >
                    <div className="text-center">
                      {audioFile ? (
                        <div className="flex items-center gap-3">
                          <FileAudio className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <div className="text-left">
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              {audioFile.name}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            Upload audio file
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            MP3, WAV, M4A supported • Max 20MB
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Process Meeting
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {response && (
          <div className={`mt-8 rounded-xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Meeting Summary
                </h3>
              </div>
              
              <div className="space-y-6">
                {/* Transcript */}
                {response.transcript && (
                  <div>
                    <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Transcript
                    </h4>
                    <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {response.transcript}
                      </p>
                    </div>
                  </div>
                )}

                {/* CRM Notes */}
                {response.crm_notes && (
                  <div>
                    <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      CRM Notes & Analysis
                    </h4>
                    <div className={`p-4 rounded-lg border-l-4 border-green-500 ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                      <div className="prose prose-sm max-w-none">
                        {response.crm_notes.split('\n').map((line, index) => {
                          if (line.startsWith('### ')) {
                            return (
                              <h5 key={index} className={`text-base font-semibold mt-4 mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                {line.replace('### ', '')}
                              </h5>
                            );
                          }
                          
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                              <p key={index} className={`font-medium mt-3 mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {line.replace(/\*\*/g, '')}
                              </p>
                            );
                          }
                          
                          if (line.startsWith('- ') || line.startsWith('* ')) {
                            return (
                              <div key={index} className="flex items-start gap-2 mb-1 ml-4">
                                <div className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${darkMode ? 'bg-gray-400' : 'bg-gray-600'}`} />
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {line.replace(/^[-*]\s/, '')}
                                </span>
                              </div>
                            );
                          }
                          
                          if (line.trim() && !line.startsWith('*') && !line.includes('|')) {
                            return (
                              <p key={index} className={`mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {line}
                              </p>
                            );
                          }
                          
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                  {/* Export */}
                  <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Export Summary
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleDownload('json')}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        JSON
                      </button>
                      <button
                        onClick={() => handleDownload('csv')}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        CSV
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Send via Email
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="recipient@example.com"
                        className={`flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100' 
                          : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                      <button
                        onClick={handleEmailSubmit}
                        disabled={isEmailSending}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-1"
                      >
                        {isEmailSending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
