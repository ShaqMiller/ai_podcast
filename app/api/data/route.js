import { NextResponse } from 'next/server';
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Securely stored in .env
});


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic');


  if (!topic || topic.trim() === '') {
    // If the topic is missing or empty, return an error response
    return NextResponse.json({ error: 'Missing topic parameter' }, { status: 400 });
  }
  return NextResponse.json(exampleResponse, { status: 200 });

  // Example mock response
  const data = await generateTranscriptForTopic(topic)

  if(data.error){
    return NextResponse.json({ error: data.error }, { status: 500 });
  }

  return NextResponse.json(data);
}


async function  generateTranscriptForTopic(topic) {
  // This function would generate a transcript based on the topic
  // For demonstration, let's return a static example

  try{
    const prompt = `
    You are simulating a podcast-style conversation between two AI hosts.
    - AI Alpha is the expert.
    - AI Beta is the curious learner.

    Create a detailed, informative dialogue where AI Alpha teaches AI Beta about "${topic}" in a friendly, accessible tone.
    The conversation should be educational, engaging, and feel like a real back-and-forth discussion.

    Format:
    AI Alpha: ...
    AI Beta: ...
    (continue for 10-15 exchanges)
    `;

    const completion = await openai.chat.completions.create({
      model: "GPT-4o mini",
      messages: [
        { role: "system", content: "You are a helpful assistant simulating AI podcast hosts." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const transcriptText = completion.choices[0].message.content;

    return ({ transcript: transcriptText,error:null });
  }catch(error){
    console.error("OpenAI API error:", error.response?.data || error.message);
    return {error: "Failed to generate transcript",transcript:null};
  }
}


const exampleResponse = {
  "topic": "Quantum Mechanics",
  "transcript": [
    {
      "speaker": "AI Alpha",
      "message": "Welcome to our deep dive into quantum mechanics! Today, we're exploring the fascinating world of the very small. Ready to embark on this quantum journey?"
    },
    {
      "speaker": "AI Beta",
      "message": "Absolutely, Alpha! I've always been intrigued by quantum mechanics but found it a bit perplexing. Let's unravel its mysteries together."
    },
    {
      "speaker": "AI Alpha",
      "message": "Great! Let's start with the basics. Quantum mechanics is the branch of physics that deals with the behavior of particles at atomic and subatomic scales. Unlike classical physics, which describes the macroscopic world, quantum mechanics reveals a realm where particles can exist in multiple states simultaneously and exhibit probabilistic behaviors."
    },
    {
      "speaker": "AI Beta",
      "message": "Multiple states at once? That sounds counterintuitive. Can you elaborate?"
    },
    {
      "speaker": "AI Alpha",
      "message": "Certainly. This phenomenon is known as superposition. It means a quantum particle, like an electron, can exist in a combination of all its possible states until it's measured. A classic illustration is Schrödinger's cat thought experiment, where a cat in a box is simultaneously alive and dead until observed."
    },
    {
      "speaker": "AI Beta",
      "message": "Fascinating! So, observation collapses this superposition into a definite state?"
    },
    {
      "speaker": "AI Alpha",
      "message": "Exactly. Measurement forces the system to 'choose' a specific state. Another intriguing concept is entanglement, where particles become linked, and the state of one instantaneously influences the state of another, regardless of distance."
    },
    {
      "speaker": "AI Beta",
      "message": "That sounds like 'spooky action at a distance,' as Einstein put it. Has this been experimentally verified?"
    },
    {
      "speaker": "AI Alpha",
      "message": "Yes, numerous experiments have confirmed entanglement. It's a cornerstone of quantum mechanics and has practical applications in quantum computing and cryptography."
    },
    {
      "speaker": "AI Beta",
      "message": "Speaking of quantum computing, how does it differ from classical computing?"
    },
    {
      "speaker": "AI Alpha",
      "message": "Quantum computers use qubits, which, thanks to superposition, can represent both 0 and 1 simultaneously. This allows them to process a vast number of possibilities at once, making them powerful for specific tasks like factoring large numbers or simulating molecular structures."
    },
    {
      "speaker": "AI Beta",
      "message": "Incredible! Are there other fundamental principles I should know?"
    },
    {
      "speaker": "AI Alpha",
      "message": "Definitely. The uncertainty principle, formulated by Heisenberg, states that certain pairs of properties, like position and momentum, cannot both be known to arbitrary precision. The more precisely one is known, the less precise the other becomes."
    },
    {
      "speaker": "AI Beta",
      "message": "So, there's a fundamental limit to what we can know about a particle's properties?"
    },
    {
      "speaker": "AI Alpha",
      "message": "Precisely. This isn't due to measurement flaws but is an inherent feature of quantum systems. It challenges our classical intuitions and has profound implications for our understanding of reality."
    },
    {
      "speaker": "AI Beta",
      "message": "Quantum mechanics truly reshapes our perception of the universe. Thanks for guiding me through these concepts, Alpha!"
    },
    {
      "speaker": "AI Alpha",
      "message": "My pleasure, Beta. Quantum mechanics is a complex yet fascinating field, and we've just scratched the surface. There's always more to explore!"
    }
  ]
}