from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import uvicorn
import os
from google.cloud import speech
import google.generativeai as genai
from utils.export import export_to_json, export_to_csv
from utils.email import send_email



from dotenv import load_dotenv
load_dotenv()
import os


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")




#  Initialize FastAPI app
app = FastAPI()

#  Allow frontend CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini model globally
gemini_model = genai.GenerativeModel("gemini-2.5-pro")

def summarize_with_gemini(transcript: str):
    prompt = f"""
You are an AI assistant helps sales and operations teams summarize client meeting recordings or transcripts.
Extract useful insights such as:

- Summary
- Client Pain Points
- Objections
- Next Steps for CRM Logging
- Overall Insight 
- Insight Using Basic Visualization

Meeting Transcript:
{transcript}
"""
    gemini_response = gemini_model.generate_content(prompt)
    return gemini_response.text

@app.post("/process_audio_meeting/")
async def process_audio_meeting(file: UploadFile = File(...)):
    """
    Process meeting audio file and return transcript and summarized CRM notes.
    """
    try:
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())

        client = speech.SpeechClient()

        with open(file_location, "rb") as audio_file:
            content = audio_file.read()

        audio = speech.RecognitionAudio(content=content)

        # Determine encoding based on file type
        if file.content_type == "audio/wav":
            encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16
        elif file.content_type == "audio/mpeg":
            encoding = speech.RecognitionConfig.AudioEncoding.MP3
        else:
            os.remove(file_location)
            return JSONResponse(status_code=400, content={"error": "Unsupported file type"})

        config = speech.RecognitionConfig(
            encoding=encoding,
            sample_rate_hertz=16000,
            language_code="en-US",
        )

        #  Use long-running recognition for longer audios
        operation = client.long_running_recognize(config=config, audio=audio)
        response = operation.result(timeout=300)

        transcript = ""
        for result in response.results:
            transcript += result.alternatives[0].transcript

        os.remove(file_location)

        crm_notes = summarize_with_gemini(transcript)

        #  Save as JSON for export endpoint
        export_to_json("meeting_summary.json", {
            "transcript": transcript,
            "crm_notes": crm_notes
        })

        return {
            "transcript": transcript,
            "crm_notes": crm_notes
        }

    except Exception as e:
        print("Error:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/process_text_meeting/")
async def process_text_meeting(transcript_text: str = Form(...)):
    """
    Process meeting transcript text and return summarized CRM notes.
    """
    try:
        crm_notes = summarize_with_gemini(transcript_text)

        export_to_json("meeting_summary.json", {
            "transcript": transcript_text,
            "crm_notes": crm_notes
        })

        return {
            "transcript": transcript_text,
            "crm_notes": crm_notes
        }

    except Exception as e:
        print("Error:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})

#  Export JSON endpoint
@app.get("/export/json/")
def get_json_export():
    return FileResponse("meeting_summary.json", media_type='application/json', filename="meeting_summary.json")
from fastapi.responses import FileResponse, JSONResponse
import google.generativeai as genai

@app.get("/export/csv/")
def get_csv_export():
    try:
        # ✅ Load existing transcript from JSON
        import json
        with open("meeting_summary.json", "r") as f:
            data = json.load(f)
            transcript = data.get("transcript", "")

        # ✅ Call Gemini to extract CRM CSV format
        gemini_model = genai.GenerativeModel("gemini-2.5-pro")

        prompt = f"""
You are an AI assistant that converts meeting transcripts into CRM structured data in CSV format.

Read the following transcript.
Extract **action items**, **owners**, **due dates**, **next steps**, **client name** (if available), and any other useful CRM fields.
Output as **CSV with headers**, for example:

Client Name,Action Item,Owner,Due Date,Notes
ABC Corp,Follow up on pricing proposal,John Doe,2024-08-15,Discussed possible discounts
...

Meeting Transcript:
{transcript}
"""

        gemini_response = gemini_model.generate_content(prompt)

        #  Write the CSV text to file
        csv_file = "meeting_summary.csv"
        with open(csv_file, "w", encoding="utf-8") as f:
            f.write(gemini_response.text)

        # Return as FileResponse
        return FileResponse(csv_file, media_type='text/csv', filename=csv_file)

    except Exception as e:
        print("Error:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})


# Email summary endpoint
class EmailRequest(BaseModel):
    receiver_email: str

@app.post("/email_summary/")
async def email_summary(request: EmailRequest):
    receiver_email = request.receiver_email
    send_email(receiver_email, "meeting_summary.json")
    return {"message": "Summary emailed successfully"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
