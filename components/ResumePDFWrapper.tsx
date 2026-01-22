"use client";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./PDFViewer"), {
    ssr: false,
    loading: () => <div className="text-white/50 p-10 text-center">Loading PDF Viewer...</div>
});

export default function ResumePDFWrapper({ file }: { file: string }) {
    return <PDFViewer file={file} />;
}
