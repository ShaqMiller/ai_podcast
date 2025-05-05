from fastapi import FastAPI, Form, BackgroundTasks
from fastapi.responses import FileResponse
from TTS.api import TTS
import uuid
import os

app = FastAPI()

# Load models into a list (order matters for indexing)
models = [
    TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False),  # index 0
    TTS(model_name="tts_models/en/jenny/jenny", progress_bar=False, gpu=False)
    # Add more models if needed
]

@app.post("/synthesize")
async def synthesize(
    text: str = Form(...),
    voiceIndex: int = Form(0),  # Default to the first model
    background_tasks: BackgroundTasks = None
):
    if voiceIndex < 0 or voiceIndex >= len(models):
        return {"error": "Invalid voice index"}

    output_path = f"output_{uuid.uuid4().hex}.wav"
    tts_model = models[voiceIndex]
    tts_model.tts_to_file(text=text, file_path=output_path)

    background_tasks.add_task(os.remove, output_path)

    return FileResponse(output_path, media_type="audio/wav", filename="speech.wav")
