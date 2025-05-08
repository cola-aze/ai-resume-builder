"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { Document, Paragraph, TextRun } from "docx";
// import html2pdf from "html2pdf.js";
import {
    FaBold,
    FaItalic,
    FaListOl,
    FaListUl,
    FaImage,
    FaLink,
    FaQuoteLeft,
    FaCode,
    FaHeading,
    FaMinus,
    FaTable,
    FaSuperscript,
    FaSubscript,
    FaStrikethrough,
    FaHighlighter,
    FaAlignCenter,
} from "react-icons/fa";
import rehypeRaw from "rehype-raw";
import { FaUpload } from "react-icons/fa";
import { ImageRun } from "docx";
const defaultMarkdown = `



<div style="text-align: center;">
<h3>蒙奇·D·路飞--个人简历</h3>
</div>


<div style=float:right;"><img src="https://pic.rmb.bdstatic.com/bjh/events/f31a0dfc0cbeda810d8326d16af779302662.jpeg@h_1280" style="width:110px;height:180px;" alt="网络图片" /></div>

#### 个人信息
姓名：蒙奇·D·路飞


出生日期：1993-05-05

联系：https://one-piece.com

学历：毕业于大海，专业是自由，导师是冒险

婚姻状况：未婚

求职意向：找到匹配的对手能够solo一场

兴趣爱好：吃肉，打架

![个人头像](/images/luffy.png)



##### 目标职位： 海贼王

核心能力：橡胶果实能力者、霸王色霸气、领导力、团队协作、逆境突破

<br>

###### 1.项目总览
项目名称：成为海贼王的终极冒险

项目周期：17岁起至今

项目目标：找到ONE PIECE，实现自由与梦想

<br>

**2. 工作分解结构 (WBS)**

2.1 初始阶段：组建团队与启航

实施：招募核心成员（索隆、娜美、乌索普等）


事件：击败东海恶龙海贼团（阿龙公园事件）

成果：获得首艘海贼船“黄金梅利号”，悬赏金首次达到 3000万贝里


**2.2 伟大航路征程**


司法岛事件：登陆空岛，击败艾尼路，营救罗宾

成果：悬赏金升至 3亿贝里

顶上战争事件：一人单挑三大将

成就：虽败犹荣，习得武装色与见闻色霸气



###### 2.3 新世界争霸

蛋糕岛事件：击败卡塔库栗，悬赏金 15亿贝里（“第五皇”称号）

和之国战役：联合盟友击败凯多与大妈

获得四块红色路标历史正文，锁定拉夫德鲁坐标

###### 2.4 团队与资源管理

新增成员：甚平（前七武海）、乔巴等

建立“草帽大船团”5600人势力

更换旗舰“千阳号”，配备弗兰奇科技

<br>

#####  关键里程碑

里程碑1：成为超新星（香波地群岛）

里程碑2：顶上战争生还，开启2年修炼

里程碑3：悬赏金突破 30亿贝里（和之国后）

<br>

##### 核心技能

战斗能力：四档形态、霸王色缠绕、五档太阳神尼卡形态

领导力：凝聚多元背景船员，达成共同目标

风险管理：多次在绝境中逆转（如推进城越狱）

<br>


##### 项目成果

当前悬赏金：30亿贝里

势力范围：影响多个王国（德雷斯罗萨、和之国等）解锁四皇称号

历史贡献：推翻世界政府傀儡政权（如克罗克达尔）







`;

export default function ResumeGenerator() {
    const [markdown, setMarkdown] = useState(defaultMarkdown);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 插入文本到光标位置
    const insertText = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = markdown.substring(0, start);
        const after = markdown.substring(end);

        setMarkdown(before + text + after);

        // 聚焦并设置光标位置
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + text.length,
                start + text.length
            );
        }, 0);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            if (!imageUrl) return;

            const width = prompt("请输入宽度(如:200)", "200");
            const height = prompt("请输入高度(如:200)", "200");

            if (width && height) {
                insertText(
                    `<img src="${imageUrl}" width="${width}" height="${height}" alt="上传图片" />`
                );
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUrlImageUpload = () => {
        const imageUrl = prompt("请输入图片URL(完整http地址)");
        if (!imageUrl) return;

        const width = prompt("请输入宽度(如:80)", "80");
        const height = prompt("请输入高度(如:120)", "120");

        if (width && height) {
            insertText(
                `<img src="${imageUrl}" style="width:${width}px;height:${height}px;" alt="网络图片" />`
            );
        }
    };

    // 修改工具栏按钮
    const toolbarActions = [
        // 添加 H1 到 H6 标题按钮
        { icon: <FaHeading />, action: () => insertText("# 标题 1") },
        { icon: <FaHeading />, action: () => insertText("## 标题 2") },
        { icon: <FaHeading />, action: () => insertText("### 标题 3") },
        { icon: <FaHeading />, action: () => insertText("#### 标题 4") },
        { icon: <FaHeading />, action: () => insertText("##### 标题 5") },
        { icon: <FaHeading />, action: () => insertText("###### 标题 6") },
        { icon: <FaBold />, action: () => insertText("**加粗文字**") },
        { icon: <FaItalic />, action: () => insertText("*斜体文字*") },
        { icon: <FaStrikethrough />, action: () => insertText("~~删除线~~") },
        { icon: <FaHighlighter />, action: () => insertText("==高亮==") },
        { icon: <FaSuperscript />, action: () => insertText("^上标^") },
        { icon: <FaSubscript />, action: () => insertText("~下标~") },
        { icon: <FaListOl />, action: () => insertText("1. 有序列表") },
        { icon: <FaListUl />, action: () => insertText("- 无序列表") },
        { icon: <FaQuoteLeft />, action: () => insertText("> 引用文字") },
        { icon: <FaCode />, action: () => insertText("`代码`") },
        { icon: <FaCode />, action: () => insertText("```\n代码块\n```") },
        { icon: <FaLink />, action: () => insertText("[链接](url)") },
        {
            icon: <FaImage />,
            action: () => {
                const imageUrl = prompt("请输入图片URL(完整http地址)");
                if (imageUrl) {
                    const width = prompt("请输入宽度(如:80)", "80");
                    const height = prompt("请输入高度(如:120)", "120");
                    insertText(
                        `<img src="${imageUrl}" style="width:${width}px;height:${height}px;" alt="网络图片" />`
                    );
                }
            },
        },
        {
            icon: <FaUpload />,
            action: () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files?.length) {
                        const reactEvent = {
                            ...e,
                            target: target,
                            currentTarget: target,
                            nativeEvent: e,
                            isDefaultPrevented: () => e.defaultPrevented,
                            isPropagationStopped: () => false,
                            persist: () => {},
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleImageUpload(reactEvent);
                    }
                };
                input.click();
            },
        },
        {
            icon: <FaAlignCenter />, // 假设你引入了对应的图标
            action: () =>
                insertText('<div style="text-align: center;">居中文字</div>'),
        },
    ];

    const previewRef = useRef<HTMLDivElement>(null);

    // 修改PDF下载函数
    const handleDownloadPDF = async () => {
        if (!previewRef.current) return;

        try {
            const originalHeight = previewRef.current.style.height;
            // 暂时移除高度限制
            previewRef.current.style.height = "auto";

            const element = previewRef.current.cloneNode(true) as HTMLElement;
            element.style.padding = "20px";
            element.style.fontFamily = "Arial, sans-serif";
            element.style.width = "100%";
            element.style.backgroundColor = "white";
            element.style.color = "black";

            const images = element.getElementsByTagName("img");
            Array.from(images).forEach((img) => {
                img.style.maxWidth = "100%";
                img.style.height = "auto";
            });

            const html2pdf = (await import("html2pdf.js")).default;
            await html2pdf()
                .from(element)
                .set({
                    margin: 10,
                    filename: "resume.pdf",
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        windowHeight: element.scrollHeight,
                        scrollY: -window.scrollY,
                    },
                    jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation: "portrait",
                    },
                })
                .save();

            // 恢复原来的高度
            previewRef.current.style.height = originalHeight;
        } catch (error) {
            console.error("PDF生成失败:", error);
            alert("PDF生成失败，请检查控制台获取详细信息");
        }
    };

    const getImageType = (
        dataUrl: string
    ): "JPEG" | "PNG" | "GIF" | "BMP" | "SVG" => {
        const match = dataUrl.match(/data:image\/(\w+);/);
        if (match) {
            const type = match[1].toUpperCase();
            if (type === "JPEG") return "JPEG";
            if (["PNG", "GIF", "BMP", "SVG"].includes(type)) {
                return type as "JPEG" | "PNG" | "GIF" | "BMP" | "SVG";
            }
        } else {
            // 尝试从文件扩展名推断类型
            const extension = dataUrl.split(".").pop()?.toLowerCase();
            switch (extension) {
                case "jpg":
                case "jpeg":
                    return "JPEG";
                case "png":
                    return "PNG";
                case "gif":
                    return "GIF";
                case "bmp":
                    return "BMP";
                case "svg":
                    return "SVG";
                default:
                    return "PNG";
            }
        }
        return "PNG";
    };

    const handleDownloadWord = async () => {
        if (!previewRef.current) return;

        try {
            const children = await Promise.all(
                Array.from(previewRef.current.children).map(async (child) => {
                    const images = child.getElementsByTagName("img");
                    if (images.length > 0) {
                        const img = images[0];
                        const imageData = await getImageData(img.src);
                        if (imageData) {
                            const imageType = getImageType(img.src);
                            const imageOptions: any = {
                                data: imageData,
                                transformation: {
                                    width: 200,
                                    height: 200,
                                },
                            };

                            if (imageType === "SVG") {
                                imageOptions.type = "SVG";
                                imageOptions.fallback = {
                                    data: imageData,
                                    transformation: {
                                        width: 200,
                                        height: 200,
                                    },
                                    type: "PNG",
                                };
                            } else {
                                imageOptions.type = imageType;
                            }

                            return new Paragraph({
                                children: [new ImageRun(imageOptions)],
                            });
                        }
                    }

                    return new Paragraph({
                        children: [new TextRun(child.textContent || "")],
                    });
                })
            );

            const doc = new Document({ sections: [{ children }] });
            const blob = await Packer.toBlob(doc);
            saveAs(blob, "resume.docx");
        } catch (error) {
            console.error("Word 生成失败:", error);
        }
    };

    const handleDownloadMarkdown = () => {
        const blob = new Blob([markdown], { type: "text/markdown" });
        saveAs(blob, "resume.md");
    };

    return (
        <div className="flex-1 pt-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">简历生成器</h1>

                {/* 扩展工具栏 */}
                <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {toolbarActions.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.action}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                            title={item.icon.type.name}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Markdown编辑器 */}
                    <div>
                        <label className="block mb-2 font-medium">
                            编辑Markdown
                        </label>
                        <textarea
                            ref={textareaRef}
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className="w-full h-[600px] p-4 border rounded-lg font-mono"
                        />
                    </div>

                    {/* 预览区域 */}
                    <div>
                        <label className="block mb-2 font-medium">预览</label>
                        <div
                            ref={previewRef}
                            className="w-full h-[600px] p-4 border rounded-lg overflow-auto"
                        >
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    h1: ({ children, ...props }) => (
                                        <h1
                                            style={{
                                                fontSize: "2.5rem",
                                                fontWeight: "bold",
                                            }}
                                            {...props}
                                        >
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children, ...props }) => (
                                        <h2
                                            style={{
                                                fontSize: "2rem",
                                                fontWeight: "bold",
                                            }}
                                            {...props}
                                        >
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children, ...props }) => (
                                        <h3
                                            style={{
                                                fontSize: "1.75rem",
                                                fontWeight: "bold",
                                            }}
                                            {...props}
                                        >
                                            {children}
                                        </h3>
                                    ),
                                    h4: ({ children, ...props }) => (
                                        <h4
                                            style={{
                                                fontSize: "1.5rem",
                                                fontWeight: "bold",
                                            }}
                                            {...props}
                                        >
                                            {children}
                                        </h4>
                                    ),
                                    h5: ({ children, ...props }) => (
                                        <h5
                                            style={{
                                                fontSize: "1.25rem",
                                                fontWeight: "bold",
                                            }}
                                            {...props}
                                        >
                                            {children}
                                        </h5>
                                    ),
                                    h6: ({ children, ...props }) => (
                                        <h6
                                            style={{
                                                fontSize: "1rem",
                                                fontWeight: "bold",
                                            }}
                                            {...props}
                                        >
                                            {children}
                                        </h6>
                                    ),
                                    img: ({ src, alt, ...props }) => (
                                        <img
                                            src={src}
                                            alt={alt}
                                            style={{
                                                maxWidth: "100%",
                                                height: "auto",
                                                display: "block",
                                                margin: "10px 0",
                                            }}
                                            {...props}
                                        />
                                    ),
                                }}
                            >
                                {markdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* 下载按钮组 */}
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        下载PDF
                    </button>
                    <button
                        onClick={handleDownloadWord}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        下载Word
                    </button>
                    <button
                        onClick={handleDownloadMarkdown}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        下载Markdown
                    </button>
                </div>
            </div>
        </div>
    );
}

const getImageData = async (src: string): Promise<Uint8Array | null> => {
    if (src.startsWith("data:")) {
        const base64Data = src.split(",")[1];
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    } else {
        try {
            const response = await fetch(src);
            if (!response.ok) {
                throw new Error("Failed to fetch image");
            }
            const arrayBuffer = await response.arrayBuffer();
            return new Uint8Array(arrayBuffer);
        } catch (error) {
            console.error("Error fetching image:", error);
            return null;
        }
    }
};
