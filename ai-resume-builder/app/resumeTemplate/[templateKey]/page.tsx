"use client";
import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import Demo1 from "../components/demo1";

// 定义简历模板的键类型
type ResumeTemplateKey = "demo1";
// 定义简历模板映射类型
type ResumeTemplateMap = {
    [key in ResumeTemplateKey]: React.ComponentType | null;
};

const resumeTemplates: ResumeTemplateMap = {
    demo1: Demo1,
};

export default function ResumeTemplatePage() {
    const { templateKey } = useParams();
    const TemplateComponent = resumeTemplates[templateKey as ResumeTemplateKey];

    if (!TemplateComponent) {
        return <div>未找到对应的简历模板</div>;
    }

    return (
        <Suspense fallback={<div>加载中...</div>}>
            <TemplateComponent />
        </Suspense>
    );
}
