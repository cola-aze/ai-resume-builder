"use client";
import React, { useState, Suspense } from "react";
import AIChat from "./AIchat/page";
import ResumeGenerator from "./resumeGenerator/page";
import { useRouter } from "next/navigation";
import { ResumeData, ResumeTemplateProps } from "./types";

// 定义简历模板的键类型
type ResumeTemplateKey = "demo1" | "demo2" | "demo3";
// 定义简历模板映射类型
type ResumeTemplateMap = {
    [key in ResumeTemplateKey]: React.ComponentType<ResumeTemplateProps> | null;
};

// 动态导入简历模板组件
const resumeTemplates: ResumeTemplateMap = {
    demo1: React.lazy(
        () => import("./resumeTemplate/components/demo1")
    ) as React.LazyExoticComponent<React.ComponentType<ResumeTemplateProps>>,
    demo2: React.lazy(
        () => import("./resumeTemplate/components/demo2")
    ) as React.LazyExoticComponent<React.ComponentType<ResumeTemplateProps>>,
    demo3: React.lazy(
        () => import("./resumeTemplate/components/demo3")
    ) as React.LazyExoticComponent<React.ComponentType<ResumeTemplateProps>>,
};

export default function HomePage() {
    // 管理当前激活的标签页状态
    const [activeTab, setActiveTab] = useState("ai");
    // 管理当前选中的简历模板状态
    const [selectedTemplate, setSelectedTemplate] = useState<
        ResumeTemplateKey | "default"
    >("default");
    const router = useRouter();

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as ResumeTemplateKey | "default";
        setSelectedTemplate(value);
        if (value !== "default") {
            setActiveTab("resumeTemplate");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4 fixed w-full top-0 z-10">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab("ai")}
                            className={`hover:text-gray-600 dark:hover:text-gray-300 ${
                                activeTab === "ai" ? "font-bold" : ""
                            }`}
                        >
                            AI
                        </button>
                        <button
                            onClick={() => setActiveTab("resumeGenerator")}
                            className={`hover:text-gray-600 dark:hover:text-gray-300 ${
                                activeTab === "resumeGenerator"
                                    ? "font-bold"
                                    : ""
                            }`}
                        >
                            生成简历
                        </button>
                        <button
                            onClick={() => setActiveTab("about")}
                            className={`hover:text-gray-600 dark:hover:text-gray-300 ${
                                activeTab === "about" ? "font-bold" : ""
                            }`}
                        >
                            关于
                        </button>
                        <select
                            value={selectedTemplate}
                            onChange={handleTemplateChange}
                            className="p-1 border rounded hover:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="default">选择简历模板</option>
                            <option value="demo1">简历模板1</option>
                            <option value="demo2">简历模板2</option>
                            <option value="demo3">简历模板3</option>
                        </select>
                    </div>
                </div>
            </nav>

            <main className="flex-1 mt-16">
                {activeTab === "ai" && <AIChat />}
                {activeTab === "resumeGenerator" && <ResumeGenerator />}
                {activeTab === "resumeTemplate" &&
                    selectedTemplate !== "default" && (
                        <Suspense fallback={<div>加载中...</div>}>
                            {(() => {
                                const TemplateComponent =
                                    resumeTemplates[selectedTemplate];
                                if (TemplateComponent) {
                                    const resumeData: ResumeData = {
                                        name: "张三",
                                        jobTitle: "前端开发工程师",
                                        workExperience: [
                                            "在 XX 公司担任前端开发工程师 3 年，深度参与公司从初创到稳定发展阶段的多个前端项目开发，积累了丰富的全流程开发经验。",
                                            "【社交平台项目 - 核心功能开发】在公司自主研发的社交平台项目中，负责用户个人主页、动态流等核心模块的前端开发。运用 React 框架结合 TypeScript 编写可维护性强的代码，借助 Redux Toolkit 高效管理复杂的应用状态。实现了动态点赞、评论和分享等交互功能，通过 WebSocket 技术达成实时消息推送，显著提升了用户之间的互动体验。",
                                            "【性能优化 - 提升用户体验】针对社交平台首屏加载慢的问题，主导性能优化工作。采用图片懒加载、代码分割和缓存策略，将首屏加载时间从原本的 5 秒缩短至 1.5 秒，页面交互响应时间平均减少了 60%。通过这些优化，用户留存率提升了 20%，日均活跃用户数增长了 15%。",
                                            "【电商平台项目 - 技术栈升级】参与公司电商平台的前端重构项目，将原有的 jQuery 技术栈升级为 Vue 3 + Pinia。重新设计页面组件结构，提高了代码的复用性和可维护性。与 UI 设计师紧密合作，实现了符合品牌形象的高保真页面，并通过响应式设计确保在多种设备上的完美展示。",
                                            "【跨团队协作 - 接口对接与优化】在电商平台开发过程中，积极与后端团队协作，完成接口对接工作。使用 Axios 封装统一的请求拦截器和响应拦截器，提高了请求的稳定性和安全性。参与接口性能优化，通过减少不必要的数据传输和优化查询逻辑，将 API 响应时间平均缩短了 40%。",
                                            "【自动化测试 - 保障代码质量】引入 Jest 和 Cypress 自动化测试框架，为电商平台编写单元测试和端到端测试用例，将代码测试覆盖率从 30% 提升至 80%。有效降低了线上 bug 率，提高了项目的整体质量和稳定性。",
                                            "【团队知识分享 - 技术传承】定期在团队内部进行技术分享，内容涵盖 React、Vue 等前端框架的新特性，以及性能优化、测试策略等实用技巧。帮助团队成员提升技术水平，促进了团队整体技术氛围的提升。",
                                        ],
                                        // 添加更多前端技能
                                        skills: [
                                            "React",
                                            "Vue",
                                            "JavaScript",
                                            "TypeScript",
                                            "Angular",
                                            "HTML5",
                                            "CSS3",
                                            "Sass",
                                            "Less",
                                            "Webpack",
                                            "Vite",
                                            "Redux",
                                            "Vuex",
                                            "Next.js",
                                            "Nuxt.js",
                                        ],
                                        education: ["XX 大学计算机科学专业"],
                                        projects: ["参与 XX 项目开发"],
                                    };
                                    return (
                                        <TemplateComponent data={resumeData} />
                                    );
                                }
                                return null;
                            })()}
                        </Suspense>
                    )}
                {activeTab === "about" && (
                    <div className="flex-1 pt-20 flex justify-center items-center">
                        <div className="text-xl">关于页面开发中</div>
                    </div>
                )}
            </main>
        </div>
    );
}
