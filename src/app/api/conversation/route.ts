import { StreamingResponse } from "@/lib/StreamingResponse";
import { NextResponse } from "next/server";
import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, model } = body;

        if (!messages) {
            return new NextResponse("No message body", { status: 400 })
        }

        const chatResponse = await openai.chat.completions.create({
            messages,
            model: model || "gpt-4o-mini",
            stream: true,
        });

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of chatResponse) {
                        const content = chunk.choices[0]?.delta?.content || ""
                        controller.enqueue(encoder.encode(content));
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });
        const response = new StreamingResponse(stream, {
            status: 200
        })
        return response

    } catch (error) {
        console.log("[ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
