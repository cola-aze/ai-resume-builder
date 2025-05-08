declare module "html2pdf.js" {
    interface Html2PdfOptions {
        margin?: number;
        filename?: string;
        image?: { type: string; quality: number };
        html2canvas?: {
            scale?: number;
            useCORS?: boolean;
            allowTaint?: boolean;
        };
        jsPDF?: {
            unit?: string;
            format?: string | number[];
            orientation?: string;
        };
    }

    interface Html2Pdf {
        from: (element: HTMLElement) => Html2Pdf;
        set: (options: Html2PdfOptions) => Html2Pdf;
        save: (filename?: string) => Promise<void>;
    }

    const html2pdf: () => Html2Pdf;
    export default html2pdf;
}

interface ResumeData {
    name: string;
    jobTitle: string;
    phone: string;
    email: string;
    workExperience: string[];
    skills: string[];
    education: string[];
    // 添加缺少的 address 字段
    address?: string;
    // 根据实际情况可以添加更多字段
    [key: string]: any; // 通用索引签名（可选）
}
