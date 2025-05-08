import Head from "next/head";
import { NextPage } from "next";
import React, { useState, useRef } from "react";

// 定义类型
interface BasicInfoItem {
    label: string;
    value: string;
    label2?: string;
    value2?: string;
}

interface SingleInfoItem {
    label: string;
    value: string;
}

interface Job {
    id: number;
    description: string;
}

interface WorkExperience {
    years: number;
    jobs: Job[];
}

interface SelfEvaluation {
    work: string;
    professional: string;
}

const Resume: NextPage = () => {
    // 基本信息
    const [basicInfo, setBasicInfo] = useState({
        name: "廖良工",
        photoUrl: "/placeholder.jpg", // 需要添加占位图片
    });

    // 基本信息数据
    const [basicInfoData, setBasicInfoData] = useState<BasicInfoItem[]>([
        {
            label: "出生日期",
            value: "2020年10月",
            label2: "民族",
            value2: "景颇族",
        },
        {
            label: "婚姻状况",
            value: "dy 文友",
            label2: "籍贯",
            value2: "北京市",
        },
        {
            label: "政治面貌",
            value: "党 员",
            label2: "邮箱",
            value2: "艾特913",
        },
        {
            label: "期望月薪",
            value: "5500+/月",
            label2: "电话",
            value2: "宋高岛 1349",
        },
    ]);

    // 求职意向数据
    const [intentionData, setIntentionData] = useState<SingleInfoItem[]>([
        { label: "求职意向", value: "期望能在北京市从事电子商务相关岗位" },
        { label: "兴趣爱好", value: "摄影、无人机、跑步、房良工等" },
    ]);

    // 教育经验数据
    const [educationData, setEducationData] = useState<BasicInfoItem[]>([
        {
            label: "毕业院校",
            value: "长沙理工大学",
            label2: "专业名称",
            value2: "单元科学",
        },
        {
            label: "毕业日期",
            value: "2013年12月",
            label2: "最高学历",
            value2: "本科",
        },
    ]);

    // 校内荣誉数据
    const [competitionData, setCompetitionData] = useState<SingleInfoItem[]>([
        {
            label: "校内荣誉",
            value: '第九届"发明杯"全国高职高专创新创业大赛，第四届"浩辰杯"华东区大学生 CAD 应用技术大赛三等奖',
        },
    ]);

    // 技能数据
    const [skillsData, setSkillsData] = useState<SingleInfoItem[]>([
        { label: "语言技能", value: "普通话四级甲等，英语四级证书" },
        {
            label: "计算机技能",
            value: "熟练掌握 OFFICE、PS 等日常办公软件，国际贸易货代师",
        },
        { label: "其他技能", value: "C1 驾照、汽车技术服务与营销师" },
    ]);

    // 工作经验
    const [workExperience, setWorkExperience] = useState<WorkExperience>({
        years: 3,
        jobs: [
            {
                id: 1,
                description:
                    "于 2020 年 10 月至 2013 年 12 月在中原出版传媒投资控股集团有限公司担任电子商务师一职，主要负责公司市场组织的建设、培训与考核，销售渠道的建立和维护，制订市场营销战略计划，以心理学为切入点，研究人的需求与潜意识的对应关系，并形成可观量的问卷报告",
            },
            {
                id: 2,
                description:
                    "于 2020 年 10 月至 2013 年 12 月在广西玉柴机器集团担任技术副总经理一职，提导产品 V1.0-V2.4 版本需求支持，推动产品研发每个过程；；监测 PLUS 测览器、PPT 插件 等产品海外营销推广状况，分析评估产品日常营销数据；",
            },
        ],
    });

    // 自我评价
    const [selfEvaluation, setSelfEvaluation] = useState<SelfEvaluation>({
        work: "有很强的产品规划、需求分析、交互设计能力，遇到困勤奋上进,认真细致,踏实肯干,对工作认真负责；热情大方，待人热心,勤奋好学，踏实肯干，动手能力强，认真负责，善于沟通，对工作认真负责，积极主动，能吃苦耐劳；",
        professional:
            "有很强的产品规划、需求分析、交互设计能力，遇到困勤奋上进,认真细致,踏实肯干,对工作认真负责；热情大方，",
    });

    // 编辑状态管理
    const [editingCell, setEditingCell] = useState<{
        type: string;
        index?: number;
        subIndex?: number;
        field: string;
    } | null>(null);

    const handleEditStart = (
        type: string,
        field: string,
        index?: number,
        subIndex?: number
    ) => {
        setEditingCell({ type, index, subIndex, field });
    };

    const handleEditEnd = (newValue: string) => {
        if (!editingCell) return;

        const { type, index, subIndex, field } = editingCell;

        switch (type) {
            case "basicInfo":
                setBasicInfo((prev) => ({ ...prev, [field]: newValue }));
                break;
            case "basicInfoData":
                if (index !== undefined) {
                    setBasicInfoData((prev) => {
                        const newData = [...prev];
                        if (field === "label2" || field === "value2") {
                            newData[index][field] = newValue;
                        } else {
                            newData[index] = {
                                ...newData[index],
                                [field]: newValue,
                            };
                        }
                        return newData;
                    });
                }
                break;
            case "intentionData":
                if (index !== undefined) {
                    setIntentionData((prev) => {
                        const newData = [...prev];
                        newData[index] = {
                            ...newData[index],
                            [field]: newValue,
                        };
                        return newData;
                    });
                }
                break;
            case "educationData":
                if (index !== undefined) {
                    setEducationData((prev) => {
                        const newData = [...prev];
                        if (field === "label2" || field === "value2") {
                            newData[index][field] = newValue;
                        } else {
                            newData[index] = {
                                ...newData[index],
                                [field]: newValue,
                            };
                        }
                        return newData;
                    });
                }
                break;
            case "competitionData":
                if (index !== undefined) {
                    setCompetitionData((prev) => {
                        const newData = [...prev];
                        newData[index] = {
                            ...newData[index],
                            [field]: newValue,
                        };
                        return newData;
                    });
                }
                break;
            case "skillsData":
                if (index !== undefined) {
                    setSkillsData((prev) => {
                        const newData = [...prev];
                        newData[index] = {
                            ...newData[index],
                            [field]: newValue,
                        };
                        return newData;
                    });
                }
                break;
            case "workExperience":
                if (subIndex !== undefined) {
                    setWorkExperience((prev) => {
                        const newJobs = [...prev.jobs];
                        newJobs[subIndex] = {
                            ...newJobs[subIndex],
                            [field]: newValue,
                        };
                        return { ...prev, jobs: newJobs };
                    });
                } else if (field === "years") {
                    setWorkExperience((prev) => ({
                        ...prev,
                        [field]: Number(newValue),
                    }));
                }
                break;
            case "selfEvaluation":
                setSelfEvaluation((prev) => ({ ...prev, [field]: newValue }));
                break;
            default:
                break;
        }

        setEditingCell(null);
    };

    // 表格行生成函数
    const renderTableRow = (
        item: BasicInfoItem,
        index: number
    ): React.JSX.Element => {
        const renderCell = (value: string, field: string) => {
            const [tempValue, setTempValue] = useState(value); // 新增临时状态来存储输入值

            if (
                editingCell &&
                editingCell.type === "basicInfoData" &&
                editingCell.index === index &&
                editingCell.field === field
            ) {
                return (
                    <input
                        value={tempValue} // 使用临时状态的值
                        onChange={(e) => {
                            setTempValue(e.target.value); // 更新临时状态
                        }}
                        onBlur={(e) => {
                            handleEditEnd(tempValue); // 使用临时状态的值更新数据
                        }}
                        className="w-full border border-gray-300 p-1"
                    />
                );
            }
            return (
                <span
                    onClick={() =>
                        handleEditStart(
                            "basicInfoData",
                            field,
                            index,
                            undefined
                        )
                    }
                >
                    {value}
                </span>
            );
        };

        return (
            <tr className="border-b border-gray-300">
                <td className="p-2 border-r border-gray-300 bg-gray-100 font-medium w-24 text-black">
                    {renderCell(item.label, "label")}
                </td>
                <td className="p-2 border-r border-gray-300 text-black">
                    {renderCell(item.value, "value")}
                </td>
                {item.label2 && (
                    <>
                        <td className="p-2 border-r border-gray-300 bg-gray-100 font-medium w-24 text-black">
                            {renderCell(item.label2, "label2")}
                        </td>
                        <td className="p-2 text-black">
                            {renderCell(item.value2!, "value2")}
                        </td>
                    </>
                )}
            </tr>
        );
    };

    // 单行表格行生成函数
    const renderSingleTableRow = (
        item: SingleInfoItem,
        index: number,
        type: string
    ): React.JSX.Element => {
        const renderCell = (value: string, field: string) => {
            const [tempValue, setTempValue] = useState(value); // 新增临时状态来存储输入值

            if (
                editingCell &&
                editingCell.type === type &&
                editingCell.index === index &&
                editingCell.field === field
            ) {
                return (
                    <input
                        value={tempValue} // 使用临时状态的值
                        onChange={(e) => {
                            setTempValue(e.target.value); // 更新临时状态
                        }}
                        onBlur={(e) => {
                            handleEditEnd(tempValue); // 使用临时状态的值更新数据
                        }}
                        className="w-full border border-gray-300 p-1"
                    />
                );
            }
            return (
                <span
                    onClick={() =>
                        handleEditStart(type, field, index, undefined)
                    }
                >
                    {value}
                </span>
            );
        };

        return (
            <tr className="border-b border-gray-300">
                <td className="p-2 border-r border-gray-300 bg-gray-100 font-medium w-24 text-black">
                    {renderCell(item.label, "label")}
                </td>
                <td className="p-2 text-black" colSpan={3}>
                    {renderCell(item.value, "value")}
                </td>
            </tr>
        );
    };

    const renderWorkExperienceCell = (job: Job, subIndex: number) => {
        const [tempValue, setTempValue] = useState(job.description); // 新增临时状态来存储输入值

        if (
            editingCell &&
            editingCell.type === "workExperience" &&
            editingCell.subIndex === subIndex &&
            editingCell.field === "description"
        ) {
            return (
                <textarea
                    value={tempValue} // 使用临时状态的值
                    onChange={(e) => {
                        setTempValue(e.target.value); // 更新临时状态
                    }}
                    onBlur={(e) => {
                        handleEditEnd(tempValue); // 使用临时状态的值更新数据
                    }}
                    className="w-full border border-gray-300 p-1"
                />
            );
        }
        return (
            <span
                onClick={() =>
                    handleEditStart(
                        "workExperience",
                        "description",
                        undefined,
                        subIndex
                    )
                }
            >
                {job.description}
            </span>
        );
    };

    const renderSelfEvaluationCell = (value: string, field: string) => {
        const [tempValue, setTempValue] = useState(value); // 新增临时状态来存储输入值

        if (
            editingCell &&
            editingCell.type === "selfEvaluation" &&
            editingCell.field === field
        ) {
            return (
                <textarea
                    value={tempValue} // 使用临时状态的值
                    onChange={(e) => {
                        setTempValue(e.target.value); // 更新临时状态
                    }}
                    onBlur={(e) => {
                        handleEditEnd(tempValue); // 使用临时状态的值更新数据
                    }}
                    className="w-full border border-gray-300 p-1"
                />
            );
        }
        return (
            <span
                onClick={() =>
                    handleEditStart(
                        "selfEvaluation",
                        field,
                        undefined,
                        undefined
                    )
                }
            >
                {value}
            </span>
        );
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setBasicInfo((prev) => ({ ...prev, photoUrl: imageUrl }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-5 font-sans text-black">
            <Head>
                <title>个人简历</title>
                <meta name="description" content="个人简历模板" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1 className="text-2xl font-bold text-center mb-6 text-black">
                个人简历模板
            </h1>

            <div className="mb-6 bg-white shadow-md rounded">
                <div className="p-3 bg-gray-200 border-b border-gray-300 font-bold text-black">
                    {basicInfo.name} 的简历
                </div>
                <div className="p-4">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-grow">
                            <table className="w-full border border-gray-300">
                                <tbody>
                                    {/* 基本信息 */}
                                    {basicInfoData.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {renderTableRow(item, index)}
                                        </React.Fragment>
                                    ))}
                                    {/* 求职意向 */}
                                    {intentionData.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {renderSingleTableRow(
                                                item,
                                                index,
                                                "intentionData"
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {/* 教育经验 */}
                                    {educationData.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {renderTableRow(item, index)}
                                        </React.Fragment>
                                    ))}
                                    {/* 校内荣誉 */}
                                    {competitionData.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {renderSingleTableRow(
                                                item,
                                                index,
                                                "competitionData"
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {/* 技能数据 */}
                                    {skillsData.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {renderSingleTableRow(
                                                item,
                                                index,
                                                "skillsData"
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {/* 工作经验 */}
                                    <tr className="border-b border-gray-300">
                                        <td className="p-2 border-r border-gray-300 bg-gray-100 font-medium w-24 text-black">
                                            主要工作经验
                                        </td>
                                        <td
                                            className="p-2 text-black"
                                            colSpan={3}
                                        >
                                            个人有 {workExperience.years}{" "}
                                            年工作经验，主要工作履历如下：
                                            {workExperience.jobs.map(
                                                (job, subIndex) => (
                                                    <div key={job.id}>
                                                        {renderWorkExperienceCell(
                                                            job,
                                                            subIndex
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                    {/* 自我评价 */}
                                    <tr>
                                        <td className="p-2 border-r border-gray-300 bg-gray-100 font-medium w-24 text-black">
                                            自我评价
                                        </td>
                                        <td
                                            className="p-2 text-black"
                                            colSpan={3}
                                        >
                                            <p>
                                                <span className="font-bold">
                                                    工作方面：
                                                </span>
                                                {renderSelfEvaluationCell(
                                                    selfEvaluation.work,
                                                    "work"
                                                )}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    职业素养：
                                                </span>
                                                {renderSelfEvaluationCell(
                                                    selfEvaluation.professional,
                                                    "professional"
                                                )}
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="md:ml-4 mt-4 md:mt-0 flex justify-center md:w-36">
                            <div
                                className="w-32 h-40 border border-gray-300 flex items-center justify-center cursor-pointer"
                                onClick={handlePhotoUpload}
                            >
                                <div className="relative w-28 h-36">
                                    {basicInfo.photoUrl &&
                                    basicInfo.photoUrl !==
                                        "/placeholder.jpg" ? (
                                        <img
                                            src={basicInfo.photoUrl}
                                            alt="一寸照"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 text-black">
                                            照片
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default Resume;
