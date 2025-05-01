import { NextResponse } from 'next/server';
import textToSpeech from '@google-cloud/text-to-speech';

// Initialize Google Cloud TTS client
const client = new textToSpeech.TextToSpeechClient();

// Request body: { text: string; speaker: 'AI Alpha' | 'AI Beta' }
export async function POST(req) {
  const { text, speaker } = await req.json();

  // Choose voice based on speaker
  const voiceConfig = {
    'AI Alpha': { name: 'en-US-Wavenet-D', ssmlGender: 'MALE' },
    'AI Beta':  { name: 'en-US-Wavenet-E', ssmlGender: 'FEMALE' },
  };

  const { name, ssmlGender } = voiceConfig[speaker] || voiceConfig['AI Beta'];

  // Build synthesis request
  const request = {
    input: { text },
    voice: { languageCode: 'en-US', name, ssmlGender },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    // Return binary MP3 response
    return new NextResponse(Buffer.from(audioContent, 'base64'), {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}