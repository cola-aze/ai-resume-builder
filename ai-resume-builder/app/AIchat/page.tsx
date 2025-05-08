"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

type Message = { role: "user" | "assistant"; content: string };

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const flattenChildren = (children: any): string => {
        if (typeof children === "string") return children;
        if (Array.isArray(children))
            return children.map(flattenChildren).join("");
        if (children?.props?.children)
            return flattenChildren(children.props.children);
        return "";
    };

    const MarkdownContent = useCallback(
        ({ content }: { content: string }) => (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code({ node, className, children, ...props }) {
                        const codeContent = flattenChildren(children).replace(
                            /\n$/,
                            ""
                        );
                        const [copied, setCopied] = useState(false);

                        const copyToClipboard = () => {
                            navigator.clipboard.writeText(codeContent);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        };

                        const downloadCode = () => {
                            try {
                                const blob = new Blob([codeContent], {
                                    type: "text/plain;charset=utf-8",
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `code-${Date.now()}.txt`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            } catch (err) {
                                console.error("下载失败:", err);
                            }
                        };

                        return className ? (
                            <div className="relative group">
                                <code className={className} {...props}>
                                    {children}
                                </code>
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                        title="复制代码"
                                    >
                                        {copied ? "✓" : "📋"}
                                    </button>
                                    <button
                                        onClick={downloadCode}
                                        className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                        title="下载代码"
                                    >
                                        ⬇️
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <code
                                className="bg-gray-100 dark:bg-gray-700 px-1 rounded"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        ),
        []
    );

    const processStreamResponse = async (
        reader: ReadableStreamDefaultReader<Uint8Array>,
        updateContent: (chunk: string) => void
    ) => {
        const decoder = new TextDecoder();
        let buffer = "";

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const chunks = buffer.split("\n");
                buffer = chunks.pop() || "";

                for (const chunk of chunks) {
                    if (!chunk.startsWith("data:")) continue;

                    try {
                        const jsonStr = chunk.replace(/^data:\s*/, "");
                        if (jsonStr === "[DONE]") continue;

                        const data = JSON.parse(jsonStr);
                        const content = data.choices[0]?.delta?.content || "";
                        updateContent(content);
                    } catch (err) {
                        console.error("JSON 解析错误:", err);
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    };

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!input.trim() || isLoading) return;

            setIsLoading(true);
            const newMessages = [...messages, { role: "user", content: input }];
            setMessages(newMessages);
            setInput("");

            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            try {
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: newMessages }),
                    signal: abortControllerRef.current.signal,
                });

                if (!response.ok)
                    throw new Error(`请求失败: ${response.status}`);
                if (!response.body) throw new Error("没有响应内容");

                const reader = response.body.getReader();
                const updateContent = (chunk: string) => {
                    setMessages((prev) => {
                        const lastIndex = prev.length - 1;
                        const lastMessage = prev[lastIndex];
                        return lastMessage?.role === "assistant"
                            ? [
                                  ...prev.slice(0, lastIndex),
                                  {
                                      ...lastMessage,
                                      content: lastMessage.content + chunk,
                                  },
                              ]
                            : [...prev, { role: "assistant", content: chunk }];
                    });
                };

                await processStreamResponse(reader, updateContent);
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error("请求出错:", err);
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "assistant",
                            content: "**请求失败，请稍后重试**",
                        },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [input, isLoading, messages]
    );

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        return () => abortControllerRef.current?.abort();
    }, []);

    return (
        <div className="flex-1 pt-20">
            <div className="h-full w-full flex">
                <div className="flex-1 max-w-[20%] hidden lg:block" />
                <div className="w-full max-w-3xl mx-auto px-4 h-[calc(100vh-10rem)] flex flex-col">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col justify-center items-center">
                            <form
                                onSubmit={handleSubmit}
                                className="w-full max-w-xl mb-8"
                            >
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        placeholder="输入你的问题..."
                                        className="flex-1 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "发送中..." : "发送"}
                                    </button>
                                </div>
                            </form>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                内容由AI生成，请注意甄别
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto pr-2">
                                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                                    {messages.map((message, index) => (
                                        <div
                                            key={`${message.role}-${index}`}
                                            className={`flex ${
                                                message.role === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`max-w-xl p-4 rounded-lg prose dark:prose-invert ${
                                                    message.role === "user"
                                                        ? "bg-gray-900 text-white"
                                                        : "bg-gray-100 dark:bg-gray-900"
                                                }`}
                                            >
                                                {message.role ===
                                                "assistant" ? (
                                                    <MarkdownContent
                                                        content={
                                                            message.content
                                                        }
                                                    />
                                                ) : (
                                                    message.content
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent" />
                                                    <span>生成中...</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex-1 max-w-[20%] hidden lg:block" />
            </div>

            {messages.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
                    <div className="max-w-3xl mx-auto px-4 py-4">
                        <form onSubmit={handleSubmit} className="mb-2">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="输入你的问题..."
                                    className="flex-1 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "发送中..." : "发送"}
                                </button>
                            </div>
                        </form>
                        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            内容由AI生成，请注意甄别
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
