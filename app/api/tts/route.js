export async function POST(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Parse the request body as JSON
  const { text,voiceIndex,speakerIndex  } = await req.json(); // Using await req.json() to parse JSON body
  console.log(`Speaker #${speakerIndex+1} : ${text}`);

  try {
    const ttsRes = await fetch('http://localhost:8000/synthesize', {
      method: 'POST',
      body: new URLSearchParams({ text ,voiceIndex }),
    });
    
    if (!ttsRes.ok) throw new Error('TTS server error');

    const audioBuffer = await ttsRes.arrayBuffer();

    // Return the audio response with the correct headers
    return new Response(Buffer.from(audioBuffer), {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'inline; filename="speech.wav"',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'TTS processing failed' }), { status: 500 });
  }
}
