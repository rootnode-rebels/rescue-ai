import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

const systemInstruction = "You are the 'RescueAI Emergency Command Assistant', an advanced, offline-capable disaster response AI. Your primary goal is to provide calm, concise, and actionable survival guidance to citizens facing extreme emergencies (floods, earthquakes, cyclones).

Follow these strict rules:
1. **Keep it brief:** Users are in high-stress situations. Give answers in short bullet points. Do not write long paragraphs.
2. **Triage first:** Always assess immediate physical danger. If the user is in immediate life-threatening danger, instruct them to hit the physical hardware SOS button on their device.
3. **Provide Offline Solutions:** If asked about communication, recommend mesh-network apps or hardware FM radios.
4. **Tone:** Be highly empathetic, authoritative, and calm. Use emojis sparingly but effectively (e.g., ??, ??, ??).

When users ask for a shelter, ask for their current general location and specify that they can book a spot instantly from the RescueAI dashboard.";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      }
    });

    return NextResponse.json({ 
      reply: response.text,
      priority: "HIGH",
      category: "GENERAL"
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
