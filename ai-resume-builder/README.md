# ai-resume-builder

利用 AI 生成简历模板，提供下载

## 功能

-   输入个人信息，生成简历模板
-   下载简历模板
-   保存简历模板

## 技术栈

ts + react + nextjs + tailwindcss + axios + react-markdown + react-pdf +file-saver + deepseek-ai

## 安装

```bash
npm install
```

## 运行

```bash
npm run dev
```

## AI

若是想要运行 AI 对话功能，需要在.env.local 文件中添加以下环境变量

```bash
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseekai_api_key
```

确保你的账户有足够的余额，否则会报错。
