// 定义简历数据类型
export interface ResumeData {
    name: string;
    jobTitle: string;
    workExperience: string[];
    skills: string[];
    education: string[];
    projects: string[]; // 确保包含 projects 属性
    // 可以根据实际情况添加更多属性
}

// 定义简历模板组件的 props 类型
export interface ResumeTemplateProps {
    data: ResumeData;
}
