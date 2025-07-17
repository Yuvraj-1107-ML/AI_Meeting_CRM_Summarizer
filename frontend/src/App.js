import React, { useState, useEffect } from "react";
import { Upload, FileText, Send, Mail, CheckCircle, AlertCircle, Loader2, Mic, FileAudio, Moon, Sun, Sparkles, Download } from "lucide-react";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [response, setResponse] = useState(null);
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [notification, setNotification] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from memory or system preference
  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(systemPrefersDark);
  }, []);

  // Update theme and apply to document
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
        // Fixed: Use FormData for text input to match backend expectation
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
      success: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200",
      error: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200",
      info: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200",
    };
    
    const Icon = iconMap[notification.type];
    
    return (
      <div className={`fixed top-4 right-4 p-4 rounded-xl border-2 flex items-center gap-2 shadow-2xl z-50 backdrop-blur-md ${colorMap[notification.type]} animate-in slide-in-from-right-full duration-300`}>
        <Icon size={20} />
        <span className="font-medium">{notification.message}</span>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode 
      ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-purple-900' 
      : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'} p-4`}>
      
      <NotificationComponent notification={notification} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 hover:scale-110 ${darkMode 
              ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25' 
              : 'bg-slate-800 text-white shadow-lg shadow-slate-800/25'} backdrop-blur-md`}
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          
          <h1 className={`text-5xl font-bold mb-4 tracking-tight ${darkMode 
            ? 'bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}`}>
            AI Powered Meeting Transcript Summarizer 
          </h1>
          
          <p className={`text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            AI-Powered Meeting Transcript Summarizer and Action Item Extractor
          </p>
        </div>

        {/* Main Card */}
        <div className={`rounded-3xl shadow-2xl border overflow-hidden backdrop-blur-lg transition-all duration-500 ${darkMode 
          ? 'bg-gray-800/80 border-gray-700/50 shadow-black/50' 
          : 'bg-white/80 border-gray-200/50 shadow-gray-900/10'}`}>
          
          {/* Input Section */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Text Input */}
            <div className="space-y-4">
              <label className={`flex items-center gap-3 text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                Enter Meeting Transcript
              </label>
              
              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={handleTextChange}
                  rows="4"
                  placeholder="Paste your meeting transcript here..."
                  className={`w-full border-2 rounded-2xl p-6 focus:outline-none focus:ring-4 transition-all duration-300 resize-none text-lg ${darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-500' 
                    : 'bg-white/80 border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500'}`}
                ></textarea>
                <div className={`absolute bottom-4 right-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {textInput.length} characters
                </div>
              </div>
            </div>

            {/* Elegant Divider */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className={`flex-1 h-px ${darkMode ? 'bg-gradient-to-r from-transparent via-gray-600 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
              <div className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                OR
              </div>
              <div className={`flex-1 h-px ${darkMode ? 'bg-gradient-to-r from-transparent via-gray-600 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
            </div>

            {/* Audio Upload */}
            <div className="space-y-4">
              <label className={`flex items-center gap-3 text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'}`}>
                  <Upload className="w-5 h-5" />
                </div>
                Upload Audio File
              </label>
              
              <div className="relative group">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group-hover:scale-[1.01] ${darkMode 
                    ? 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/10 bg-gray-700/30' 
                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50 bg-gray-50/50'}`}
                >
                  <div className="text-center px-4">
                    {audioFile ? (
                      <div className={`flex flex-col sm:flex-row items-center gap-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'}`}>
                          <FileAudio className="w-8 h-8" />
                        </div>
                        <div className="text-center sm:text-left">
                          <span className="font-semibold text-lg block">{audioFile.name}</span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className={`flex flex-col items-center gap-3 ${darkMode ? 'text-gray-400 group-hover:text-purple-400' : 'text-gray-500 group-hover:text-purple-500'}`}>
                        <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700 group-hover:bg-purple-500/20' : 'bg-gray-200 group-hover:bg-purple-500/10'} transition-colors`}>
                          <Mic className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-lg block">Click to upload audio file</span>
                          <span className="text-sm">MP3, WAV, M4A supported • Max 20MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Process Button */}
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`w-full font-bold py-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg shadow-2xl ${darkMode 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/25'}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing Meeting...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Process Meeting
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {response && (
            <div className={`border-t transition-all duration-500 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="p-8 space-y-8">
                <div className={`flex items-center gap-3 text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  Meeting Summary Results
                </div>
                
                <div className={`rounded-2xl border shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {/* Transcript Section */}
                  {response.transcript && (
                    <div className={`p-6 sm:p-8 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Meeting Transcript</h3>
                      </div>
                      <div className={`rounded-xl p-4 sm:p-6 border-l-4 border-blue-500 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                        <p className={`leading-relaxed text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{response.transcript}</p>
                      </div>
                    </div>
                  )}

                  {/* CRM Notes Section */}
                  {response.crm_notes && (
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>CRM Notes & Analysis</h3>
                      </div>
                      <div className={`rounded-xl p-4 sm:p-6 border-l-4 border-green-500 ${darkMode ? 'bg-green-500/10' : 'bg-gradient-to-r from-green-50 to-emerald-50'}`}>
                        <div className="prose prose-sm sm:prose-lg max-w-none">
                          {response.crm_notes.split('\n').map((line, index) => {
                            // Handle headers
                            if (line.startsWith('### ')) {
                              return (
                                <h3 key={index} className={`text-lg sm:text-xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 pb-2 border-b ${darkMode ? 'text-gray-200 border-gray-600' : 'text-gray-800 border-gray-300'}`}>
                                  {line.replace('### ', '')}
                                </h3>
                              );
                            }
                            
                            // Handle bold text
                            if (line.startsWith('**') && line.endsWith('**')) {
                              return (
                                <p key={index} className={`font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                  {line.replace(/\*\*/g, '')}
                                </p>
                              );
                            }
                            
                            // Handle bullet points
                            if (line.startsWith('- ') || line.startsWith('* ')) {
                              return (
                                <div key={index} className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3 ml-3 sm:ml-6">
                                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-2 flex-shrink-0 ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                                  <span className={`text-sm sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{line.replace(/^[-*]\s/, '')}</span>
                                </div>
                              );
                            }
                            
                            // Handle regular paragraphs
                            if (line.trim() && !line.startsWith('*') && !line.includes('|')) {
                              return (
                                <p key={index} className={`mb-3 sm:mb-4 leading-relaxed text-sm sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                </div>

                {/* Download Section */}
                <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`flex items-center gap-3 text-lg sm:text-xl font-bold mb-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Download className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    </div>
                    Export Summary
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleDownload('json')}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-base sm:text-lg shadow-2xl shadow-blue-500/25"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download JSON
                    </button>
                    <button
                      onClick={() => handleDownload('csv')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-base sm:text-lg shadow-2xl shadow-green-500/25"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download CSV
                    </button>
                  </div>
                </div>

                {/* Email Section */}
                <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`flex items-center gap-3 text-lg sm:text-xl font-bold mb-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                    </div>
                    Send Summary via Email
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="recipient@example.com"
                      className={`flex-1 border-2 rounded-xl p-3 sm:p-4 focus:outline-none focus:ring-4 transition-all duration-300 text-base sm:text-lg ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-purple-500/30 focus:border-purple-500' 
                        : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-purple-500/30 focus:border-purple-500'}`}
                    />
                    <button
                      onClick={handleEmailSubmit}
                      disabled={isEmailSending}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 whitespace-nowrap text-base sm:text-lg shadow-2xl shadow-purple-500/25"
                    >
                      {isEmailSending ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                          Send Email
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
