import { useEffect, useState } from "react";
import { LoadingSpinner } from "../UI/LoadingSpinner";
import { ProjectPDF } from "../Export/ProjectPDF";
import { pdf } from "@react-pdf/renderer";

interface EmailPdfPreviewProps {
  project: any;
}

export function EmailPdfPreview({ project }: EmailPdfPreviewProps) {
  const [pdfURL, setPdfURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url: string;

    const generatePdf = async () => {
      setLoading(true);
      const blob = await pdf(<ProjectPDF project={project} />).toBlob();
      url = URL.createObjectURL(blob);
      setPdfURL(url);
      setLoading(false);
    };

    generatePdf();

    return () => {
      if (url) URL.revokeObjectURL(url);
      setPdfURL(null);
    };
  }, [project]);

  return (
    <div className="w-full h-[500px] mb-4">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <iframe
          src={pdfURL!}
          style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
        />
      )}
    </div>
  );
}
