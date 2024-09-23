import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages } = body;

        if (!messages) {
            return new NextResponse("No message body", { status: 400 })
        }

        const chatResponse = await openai.chat.completions.create({
            messages,
            model: "gpt-4o-mini",
        });


        return NextResponse.json(chatResponse.choices[0].message)
    } catch (error) {
        console.log("[ERROR]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}