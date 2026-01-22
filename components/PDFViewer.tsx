"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ file }: { file: string }) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    return (
        <div className="w-full h-full flex flex-col items-center overflow-auto bg-zinc-900/50 backdrop-blur-sm relative">
            <div className="w-full h-full flex justify-center p-4">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50">
                        Loading PDF...
                    </div>
                )}
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center"
                    loading={
                        <div className="flex items-center justify-center h-full text-white/50">
                            Loading PDF...
                        </div>
                    }
                    error={
                        <div className="flex items-center justify-center h-full text-red-400">
                            Failed to load PDF.
                        </div>
                    }
                >
                    <Page
                        pageNumber={pageNumber}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        scale={1.0}
                        className="shadow-2xl mb-4"
                    />
                </Document>
            </div>
        </div>
    );
}
