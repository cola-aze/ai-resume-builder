import React, { useState, useRef, useEffect } from "react";

interface ResumeData {
    name: string;
    jobTitle: string;
    avatar: string;
    phone: string;
    email: string;
    education: string[];
    workExperience: string[];
    projects: string[];
    skills: string[];
    hobbies?: string[];
}

const PAGE_HEIGHT = 1191; // A4页面高度（像素）
const PAGE_PADDING = 8 * 2; // 页面上下内边距之和
const SECTION_MARGIN = 24; // 部分之间的间距
const MIN_CONTENT_FOR_SPLIT = 100; // 最小分割内容高度

const Demo3: React.FC<{ data: ResumeData }> = ({ data }) => {
    const [phone, setPhone] = useState(data.phone || "");
    const [email, setEmail] = useState(data.email || "");

    // 使用ref来获取每个部分的实际DOM元素
    const headerRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);
    const educationRef = useRef<HTMLDivElement>(null);
    const workExperienceRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLDivElement>(null);
    const skillsRef = useRef<HTMLDivElement>(null);
    const hobbiesRef = useRef<HTMLDivElement>(null);

    // 页面构建逻辑使用的状态
    const [isRendered, setIsRendered] = useState(false);
    const [sectionHtmlMap, setSectionHtmlMap] = useState<{
        [key: string]: string;
    }>({});
    const [pages, setPages] = useState<React.ReactNode[]>([]);

    // 初始高度估算 - 后续会基于实际DOM更新
    const [sectionHeights, setSectionHeights] = useState({
        header: 200,
        contact: 150,
        education: 100 + data.education.length * 40, // 增加每项高度估算
        workExperience: 100 + data.workExperience.length * 40,
        projects: 100 + data.projects.length * 40,
        skills: 100 + Math.ceil(data.skills.length / 3) * 40, // 降低单行容纳技能数以避免高度估算不足
        hobbies: data.hobbies ? 100 + data.hobbies.length * 40 : 100,
    });

    // 测量各部分实际高度
    useEffect(() => {
        const calculateHeights = () => {
            // 获取所有组件的实际高度
            const calculatedHeights = {
                header:
                    headerRef.current?.getBoundingClientRect().height || 200,
                contact:
                    contactRef.current?.getBoundingClientRect().height || 150,
                education:
                    educationRef.current?.getBoundingClientRect().height ||
                    100 + data.education.length * 40,
                workExperience:
                    workExperienceRef.current?.getBoundingClientRect().height ||
                    100 + data.workExperience.length * 40,
                projects:
                    projectsRef.current?.getBoundingClientRect().height ||
                    100 + data.projects.length * 40,
                skills:
                    skillsRef.current?.getBoundingClientRect().height ||
                    100 + Math.ceil(data.skills.length / 3) * 40,
                hobbies:
                    hobbiesRef.current?.getBoundingClientRect().height ||
                    (data.hobbies ? 100 + data.hobbies.length * 40 : 100),
            };

            // 为安全起见，对所有高度增加一点缓冲空间（10%）
            const bufferedHeights = Object.entries(calculatedHeights).reduce(
                (acc, [key, value]) => {
                    acc[key] = Math.ceil(value * 1.1); // 增加10%的缓冲
                    return acc;
                },
                {} as { [key: string]: number }
            );

            // 保存计算出的高度
            setSectionHeights(bufferedHeights);

            // 为了内容重排，获取每个部分的HTML内容
            const htmlMap: { [key: string]: string } = {};
            if (headerRef.current) htmlMap.header = headerRef.current.innerHTML;
            if (contactRef.current)
                htmlMap.contact = contactRef.current.innerHTML;
            if (educationRef.current)
                htmlMap.education = educationRef.current.innerHTML;
            if (workExperienceRef.current)
                htmlMap.workExperience = workExperienceRef.current.innerHTML;
            if (projectsRef.current)
                htmlMap.projects = projectsRef.current.innerHTML;
            if (skillsRef.current) htmlMap.skills = skillsRef.current.innerHTML;
            if (hobbiesRef.current)
                htmlMap.hobbies = hobbiesRef.current.innerHTML;

            setSectionHtmlMap(htmlMap);
            setIsRendered(true);
        };

        // 初次渲染后计算高度
        const timer = setTimeout(calculateHeights, 100);

        // 监听窗口大小变化，重新计算高度
        window.addEventListener("resize", calculateHeights);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", calculateHeights);
        };
    }, [data]);

    // 在获取实际高度后，重新构建页面
    useEffect(() => {
        if (!isRendered) return;

        // 重新构建页面的函数
        const buildPages = () => {
            const newPages: React.ReactNode[] = [];
            let currentPage: React.ReactNode[] = [];
            let currentHeight = PAGE_PADDING;

            // 创建新的页面内容数组
            const sectionData = [
                {
                    type: "header",
                    title: "个人信息",
                    content: sectionHtmlMap.header,
                    height: sectionHeights.header,
                },
                {
                    type: "contact",
                    title: "联系方式",
                    content: sectionHtmlMap.contact,
                    height: sectionHeights.contact,
                },
                {
                    type: "education",
                    title: "教育背景",
                    content: sectionHtmlMap.education,
                    height: sectionHeights.education,
                },
                {
                    type: "workExperience",
                    title: "工作经历",
                    content: sectionHtmlMap.workExperience,
                    height: sectionHeights.workExperience,
                },
                {
                    type: "projects",
                    title: "项目经验",
                    content: sectionHtmlMap.projects,
                    height: sectionHeights.projects,
                },
                {
                    type: "skills",
                    title: "技能",
                    content: sectionHtmlMap.skills,
                    height: sectionHeights.skills,
                },
                {
                    type: "hobbies",
                    title: "兴趣爱好",
                    content: sectionHtmlMap.hobbies,
                    height: sectionHeights.hobbies,
                },
            ];

            // 遍历每个部分进行页面分配
            for (let i = 0; i < sectionData.length; i++) {
                const section = sectionData[i];
                const totalSectionHeight = section.height + SECTION_MARGIN;

                // 检查当前页是否有足够空间
                if (currentHeight + totalSectionHeight > PAGE_HEIGHT) {
                    // 如果不能完全放入当前页面
                    const remainingHeight = PAGE_HEIGHT - currentHeight - 40; // 减去一些边距

                    // 判断是否有足够空间进行分割（至少满足最低分割高度要求）
                    if (remainingHeight >= MIN_CONTENT_FOR_SPLIT) {
                        // 分割当前部分
                        // 第一部分 - 当前页
                        const firstPartClassName = `${section.type}-part1`;
                        currentPage.push(
                            <div
                                key={`${section.type}-part1`}
                                className={`${firstPartClassName} section-container relative overflow-hidden`}
                            >
                                <h3 className="text-2xl font-bold text-black mb-4">
                                    {section.title}
                                </h3>
                                <div
                                    className="content-container"
                                    style={{
                                        height: `${remainingHeight - 40}px`,
                                        overflow: "hidden",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            section.content?.replace(
                                                /<h3.*?<\/h3>/,
                                                ""
                                            ) || "",
                                    }}
                                />
                                {/* 淡出效果指示内容继续 */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-12"
                                    style={{
                                        background:
                                            "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
                                    }}
                                ></div>
                            </div>
                        );

                        // 完成当前页面并添加到页面数组
                        newPages.push(
                            <div
                                key={`page-${newPages.length}`}
                                className="w-[842px] h-[1191px] p-8 bg-white rounded-3xl shadow-2xl animate-fade-in transition-all duration-500 overflow-hidden relative mt-8 mb-8"
                            >
                                {currentPage}
                            </div>
                        );

                        // 第二部分 - 下一页
                        // 重置当前页内容，并开始新的一页
                        currentPage = [
                            <div
                                key={`${section.type}-part2`}
                                className="section-container mt-4"
                            >
                                <div className="continuation-indicator text-sm text-gray-500 italic mb-3">
                                    (续上页 - {section.title})
                                </div>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            section.content?.replace(
                                                /<h3.*?<\/h3>/,
                                                ""
                                            ) || "",
                                    }}
                                />
                            </div>,
                        ];

                        // 更新当前高度 - 考虑这部分在新页面上的高度
                        currentHeight =
                            PAGE_PADDING +
                            totalSectionHeight -
                            remainingHeight +
                            30; // 增加续接标识的高度
                    } else {
                        // 如果剩余空间太小，完成当前页，整个部分放到下一页
                        newPages.push(
                            <div
                                key={`page-${newPages.length}`}
                                className="w-[842px] h-[1191px] p-8 bg-white rounded-3xl shadow-2xl animate-fade-in transition-all duration-500 overflow-hidden relative mt-8 mb-8"
                            >
                                {currentPage}
                            </div>
                        );

                        // 创建新页面并添加整个部分
                        currentPage = [
                            <div
                                key={section.type}
                                className="section-container mt-4"
                            >
                                <h3 className="text-2xl font-bold text-black mb-4">
                                    {section.title}
                                </h3>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            section.content?.replace(
                                                /<h3.*?<\/h3>/,
                                                ""
                                            ) || "",
                                    }}
                                />
                            </div>,
                        ];

                        // 更新当前高度
                        currentHeight = PAGE_PADDING + totalSectionHeight;
                    }
                } else {
                    // 有足够空间，直接添加到当前页
                    currentPage.push(
                        <div
                            key={section.type}
                            className="section-container mt-4"
                        >
                            <h3 className="text-2xl font-bold text-black mb-4">
                                {section.title}
                            </h3>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html:
                                        section.content?.replace(
                                            /<h3.*?<\/h3>/,
                                            ""
                                        ) || "",
                                }}
                            />
                        </div>
                    );

                    // 更新当前高度
                    currentHeight += totalSectionHeight;
                }
            }

            // 添加最后一页（如果有剩余内容）
            if (currentPage.length > 0) {
                newPages.push(
                    <div
                        key={`page-${newPages.length}`}
                        className="w-[842px] h-[1191px] p-8 bg-white rounded-3xl shadow-2xl animate-fade-in transition-all duration-500 overflow-hidden relative mt-8 mb-8"
                    >
                        {currentPage}
                    </div>
                );
            }

            // 设置页面
            setPages(newPages);
        };

        buildPages();
    }, [isRendered, sectionHtmlMap, sectionHeights]);

    // 初始渲染时，展示带有所有部分的视图以便测量高度
    if (!isRendered) {
        return (
            <div
                className="measuring-container"
                style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "-9999px",
                }}
            >
                {/* 头部信息 */}
                <div ref={headerRef} className="header-section">
                    <div className="flex items-center justify-center flex-col mt-8">
                        <img
                            src={data.avatar}
                            alt={data.name}
                            className="w-32 h-32 rounded-full border-4 border-animePink object-cover"
                        />
                        <h1 className="mt-4 text-4xl font-extrabold text-black tracking-wide">
                            {data.name}
                        </h1>
                        <h2 className="text-xl font-semibold text-black mt-2">
                            {data.jobTitle}
                        </h2>
                    </div>
                </div>

                {/* 联系方式 */}
                <div ref={contactRef} className="contact-section">
                    <h3 className="text-2xl font-bold text-black">联系方式</h3>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="ml-3 text-black text-lg border border-gray-300 rounded px-2 py-1 flex-grow"
                            />
                        </div>
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="ml-3 text-black text-lg border border-gray-300 rounded px-2 py-1 flex-grow"
                            />
                        </div>
                    </div>
                </div>

                {/* 教育背景 */}
                <div ref={educationRef} className="education-section">
                    <h3 className="text-2xl font-bold text-black">教育背景</h3>
                    <ul className="mt-4 space-y-4 pl-6 list-disc">
                        {data.education.map((edu, index) => (
                            <li
                                key={`education-${index}`}
                                className="text-black text-lg"
                            >
                                {edu}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 工作经历 */}
                <div
                    ref={workExperienceRef}
                    className="work-experience-section"
                >
                    <h3 className="text-2xl font-bold text-black">工作经历</h3>
                    <ul className="mt-4 space-y-4 pl-6 list-disc">
                        {data.workExperience.map((exp, index) => (
                            <li
                                key={`workExperience-${index}`}
                                className="text-black text-lg"
                            >
                                {exp}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 项目经验 */}
                <div ref={projectsRef} className="projects-section">
                    <h3 className="text-2xl font-bold text-black">项目经验</h3>
                    <ul className="mt-4 space-y-4 pl-6 list-disc">
                        {data.projects.map((project, index) => (
                            <li
                                key={`projects-${index}`}
                                className="text-black text-lg"
                            >
                                {project}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 技能 */}
                <div ref={skillsRef} className="skills-section">
                    <h3 className="text-2xl font-bold text-black">技能</h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {data.skills.map((skill, index) => (
                            <span
                                key={`skills-${index}`}
                                className="bg-animeBlue text-black px-4 py-2 rounded-full text-lg font-medium shadow-md"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 兴趣爱好 */}
                <div ref={hobbiesRef} className="hobbies-section">
                    <h3 className="text-2xl font-bold text-black">兴趣爱好</h3>
                    {data.hobbies && data.hobbies.length > 0 ? (
                        <ul className="mt-4 space-y-4 pl-6 list-disc">
                            {data.hobbies.map((hobby, index) => (
                                <li
                                    key={`hobbies-${index}`}
                                    className="text-black text-lg"
                                >
                                    {hobby}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-black text-lg">暂无兴趣爱好信息</p>
                    )}
                </div>
            </div>
        );
    }

    // 渲染最终的分页视图
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-12">
            <div className="print:break-inside-avoid-page">
                {pages.map((page, index) => (
                    <React.Fragment key={`page-wrapper-${index}`}>
                        {page}
                        {index < pages.length - 1 && (
                            <div
                                className="page-break"
                                style={{ pageBreakAfter: "always" }}
                            ></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Demo3;
