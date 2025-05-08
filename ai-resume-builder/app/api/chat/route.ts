import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { messages } = await request.json();

    try {
        const deepseekResponse = await fetch(
            "https://api.deepseek.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: messages,
                    stream: true,
                }),
            }
        );

        return new Response(deepseekResponse.body, {
            headers: {
                "Content-Type": "text/event-stream",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "请求失败，请检查API密钥和网络连接" },
            { status: 500 }
        );
    }
}
