// types.ts
export interface ResumeData {
    name: string;
    jobTitle: string;
    phone: string;
    email: string;
    workExperience: string[];
    skills: string[];
    education: string[];
    // Additional fields can be added as needed
    [key: string]: string | string[] | undefined; // Index signature to allow array access with bracket notation
}
