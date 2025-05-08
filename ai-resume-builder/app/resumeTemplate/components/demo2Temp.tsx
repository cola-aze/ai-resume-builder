import React, { useState, useEffect, useRef } from "react";
import { ResumeData } from "./types";

// Define the props interface directly in this file
interface ResumeTemplateProps {
    data?: Partial<ResumeData>;
}

// Define default ResumeData
const defaultResumeData: ResumeData = {
    name: "",
    jobTitle: "",
    phone: "",
    email: "",
    workExperience: [],
    skills: [],
    education: [],
};

const Demo2: React.FC<ResumeTemplateProps> = ({ data = {} }) => {
    const [editedData, setEditedData] = useState<ResumeData>({
        ...defaultResumeData,
        ...data,
    });
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<keyof ResumeData | null>(
        null
    );
    const [tempValue, setTempValue] = useState("");
    // Define refs for input and textarea
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof ResumeData
    ) => {
        const value = e.target.value;
        setTempValue(value);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoClick = () => {
        const fileInput = document.getElementById(
            "profile-image-upload"
        ) as HTMLInputElement;
        fileInput.click();
    };

    const handleEditStart = (field: keyof ResumeData) => {
        const initialValue = editedData[field] || "";
        setEditingField(field);
        setTempValue(
            Array.isArray(initialValue)
                ? initialValue.join("\n")
                : String(initialValue)
        );

        // Focus on input in the next render cycle
        setTimeout(() => {
            if (
                field === "workExperience" ||
                field === "skills" ||
                field === "education"
            ) {
                textareaRef.current?.focus();
            } else {
                inputRef.current?.focus();
            }
        }, 0);
    };

    const handleEditEnd = (field: keyof ResumeData) => {
        if (editingField !== field) {
            return; // Prevent multiple triggers
        }

        const value = tempValue.trim();
        setEditedData((prev) => ({
            ...prev,
            [field]: Array.isArray(prev[field])
                ? value.split("\n").filter(Boolean)
                : value,
        }));

        setEditingField(null);
        setTempValue("");
    };

    // Monitor editedData changes
    useEffect(() => {
        console.log("Current editedData:", editedData);
    }, [editedData]);

    // End editing when clicking outside - keep only one useEffect
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const currentRef =
                editingField === "workExperience" ||
                editingField === "skills" ||
                editingField === "education"
                    ? textareaRef.current
                    : inputRef.current;

            if (
                editingField &&
                currentRef &&
                !currentRef.contains(event.target as Node)
            ) {
                handleEditEnd(editingField);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingField, tempValue]);

    // Generic function to render each field
    const renderField = (
        field: keyof ResumeData,
        label: string,
        type: string = "text",
        placeholder: string = ""
    ) => {
        const isTextArea = ["workExperience", "skills", "education"].includes(
            field as string
        );
        const displayValue = isTextArea
            ? editedData[field] && Array.isArray(editedData[field])
                ? (editedData[field] as string[]).join("\n")
                : placeholder
            : editedData[field] || placeholder;

        return (
            <div className="flex flex-col w-full">
                {label && (
                    <label className="text-sm text-gray-600 mb-2 font-medium">
                        {label}
                    </label>
                )}
                {editingField === field ? (
                    isTextArea ? (
                        <textarea
                            ref={textareaRef}
                            value={tempValue}
                            onChange={(e) => handleInputChange(e, field)}
                            onBlur={() => handleEditEnd(field)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 min-h-[150px] transition-all duration-300 shadow-sm"
                            placeholder={placeholder}
                        />
                    ) : (
                        <input
                            ref={inputRef}
                            type={type}
                            value={tempValue}
                            onChange={(e) => handleInputChange(e, field)}
                            onBlur={() => handleEditEnd(field)}
                            className="p-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
                            placeholder={placeholder}
                        />
                    )
                ) : (
                    <div
                        onClick={() => handleEditStart(field)}
                        className={`cursor-pointer ${
                            isTextArea
                                ? "whitespace-pre-line min-h-[100px]"
                                : ""
                        } p-2 hover:bg-gray-50 rounded transition-colors duration-200 ${
                            !displayValue || displayValue === placeholder
                                ? "text-gray-400 italic"
                                : "text-gray-800"
                        }`}
                    >
                        {displayValue}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto my-10">
            {/* Overall container */}
            <div className="w-[595.28pt] h-auto min-h-[841.89pt] mx-auto bg-white text-gray-800 font-sans shadow-lg rounded-lg overflow-hidden border border-gray-100">
                {/* Top decoration bar */}
                <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                {/* Content container */}
                <div className="p-12">
                    {/* Header section */}
                    <div className="flex flex-col md:flex-row md:justify-between items-center mb-10 pb-6 border-b border-gray-200">
                        <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
                            {editingField === "name" ? (
                                <input
                                    className="text-3xl font-bold w-full p-2 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                                    ref={inputRef}
                                    type="text"
                                    value={tempValue}
                                    onChange={(e) =>
                                        handleInputChange(e, "name")
                                    }
                                    onBlur={() => handleEditEnd("name")}
                                />
                            ) : (
                                <h1
                                    onClick={() => handleEditStart("name")}
                                    className="text-3xl font-bold cursor-pointer hover:text-blue-700 transition-colors duration-200"
                                >
                                    {editedData.name || "请输入姓名"}
                                </h1>
                            )}

                            {editingField === "jobTitle" ? (
                                <input
                                    className="text-xl text-gray-600 mt-2 w-full p-2 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                                    ref={inputRef}
                                    type="text"
                                    value={tempValue}
                                    onChange={(e) =>
                                        handleInputChange(e, "jobTitle")
                                    }
                                    onBlur={() => handleEditEnd("jobTitle")}
                                />
                            ) : (
                                <h2
                                    onClick={() => handleEditStart("jobTitle")}
                                    className="text-xl text-gray-600 mt-2 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                                >
                                    {editedData.jobTitle || "请输入职位"}
                                </h2>
                            )}
                        </div>

                        <div>
                            {imagePreview ? (
                                <div className="relative w-32 h-40 overflow-hidden rounded-lg shadow-md group">
                                    <img
                                        src={imagePreview}
                                        alt="个人照片"
                                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                                        onClick={handlePhotoClick}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                        <span className="text-white text-sm font-medium">
                                            更换照片
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <label
                                    htmlFor="profile-image-upload"
                                    className="w-32 h-40 flex flex-col items-center justify-center bg-gray-100 text-gray-500 rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-50 hover:border-blue-400 transition-all duration-300 cursor-pointer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-10 w-10 mb-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="text-sm">添加照片</span>
                                </label>
                            )}
                            <input
                                type="file"
                                id="profile-image-upload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Contact information */}
                    <div className="mb-10">
                        <h3 className="text-lg font-bold text-blue-700 mb-4 pb-2 border-b border-gray-200 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
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
                            联系方式
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-600 mr-3"
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
                                {renderField("phone", "", "tel", "请输入电话")}
                            </div>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-600 mr-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                                {renderField(
                                    "email",
                                    "",
                                    "email",
                                    "请输入邮箱"
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Work experience */}
                    <div className="mb-10">
                        <h3 className="text-lg font-bold text-blue-700 mb-4 pb-2 border-b border-gray-200 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            工作经历
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            {renderField(
                                "workExperience",
                                "",
                                "textarea",
                                "请输入工作经历，每行一条"
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-10">
                        <h3 className="text-lg font-bold text-blue-700 mb-4 pb-2 border-b border-gray-200 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                            工作技能
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            {renderField(
                                "skills",
                                "",
                                "textarea",
                                "请输入工作技能，每行一条"
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <h3 className="text-lg font-bold text-blue-700 mb-4 pb-2 border-b border-gray-200 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                                />
                            </svg>
                            教育经历
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            {renderField(
                                "education",
                                "",
                                "textarea",
                                "请输入教育经历，每行一条"
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom decoration bar */}
                <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>
            </div>
        </div>
    );
};

export default Demo2;
