import { NextResponse } from 'next/server';
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Securely stored in .env
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
    - alpha is the expert.
    - beta is the curious learner.

    Create a detailed, informative dialogue where alpha teaches beta about "${topic}" in a friendly, accessible tone.
    The conversation should be educational, engaging, and feel like a real back-and-forth discussion.

    Format:
    alpha: ...
    beta: ...
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
  "topic": "The ONE Thing - Book Summary",
  "transcript": [
    {
      "speaker": 0,
      "message": "Welcome back, listeners! Today we're diving into a powerful productivity book called 'The ONE Thing' by Gary Keller and Jay Papasan. Ready to discover how doing less can help you achieve more?"
    },
    {
      "speaker": 1,
      "message": "Absolutely, Alpha! I've heard so much about this book but never took the time to really understand the core message. Let's break it down!"
    },
    {
      "speaker": 0,
      "message": "'The ONE Thing' is all about focus. The central idea is that success comes from focusing on the one most important task—the one thing—that will make everything else easier or unnecessary."
    },
    {
      "speaker": 1,
      "message": "Interesting. So instead of juggling ten things at once, it's about identifying and committing to your most impactful task?"
    },
    {
      "speaker": 0,
      "message": "Exactly. The authors emphasize that multitasking is a myth and that real productivity comes from deep, intentional work on the task that matters most."
    },
    {
      "speaker": 1,
      "message": "Does the book give any practical ways to identify that one thing?"
    },
    {
      "speaker": 0,
      "message": "It does! One of the key tools is the focusing question: 'What’s the ONE thing I can do such that by doing it everything else will be easier or unnecessary?' This question helps cut through distractions and prioritize with clarity."
    },
    {
      "speaker": 1,
      "message": "That’s a powerful question. I can see how applying it daily could shift how someone approaches their goals and time."
    },
    {
      "speaker": 0,
      "message": "Absolutely. The book also touches on concepts like time blocking—dedicating specific hours each day to your ONE thing—and the importance of habit-building and saying no to distractions."
    },
    {
      "speaker": 1,
      "message": "So it's not just about knowing your priority, but protecting the time and energy to pursue it."
    },
    {
      "speaker": 0,
      "message": "You got it. 'The ONE Thing' isn’t just about work—it applies to health, relationships, finances—every area of life. It’s about aligning your actions with your ultimate purpose and goals."
    },
    {
      "speaker": 1,
      "message": "Sounds like a must-read for anyone trying to cut through the noise and really make progress. Thanks for the breakdown, Alpha!"
    },
    {
      "speaker": 0,
      "message": "My pleasure, Beta. Remember, success doesn’t require doing everything—it requires doing the right thing. Focus on your ONE thing!"
    }
  ]
}
