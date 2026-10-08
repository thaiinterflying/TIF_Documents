import React, { useState } from 'react';
import { CustomerTrainingForm } from '../types/customerTraining';
import { FormPreview } from '../components/preview/FormPreview';
import { exportToPdf } from '../components/export/exportPdf';
import { exportToWord } from '../components/export/exportWord';
import { Button } from '../components/ui/Button';
import {
  FileDown,
  FileText,
  Printer,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Plane,
} from 'lucide-react';

interface PreviewPageProps {
  data: CustomerTrainingForm;
  onBackToEdit: () => void;
  onBackToDashboard: () => void;
}

export const PreviewPage: React.FC<PreviewPageProps> = ({
  data,
  onBackToEdit,
  onBackToDashboard,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [exportErrorMessage, setExportErrorMessage] = useState<string | null>(null);

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      setExportSuccessMessage(null);
      setExportErrorMessage(null);
      await exportToPdf(data);
      setExportSuccessMessage('PDF document generated and downloaded successfully.');
      setTimeout(() => setExportSuccessMessage(null), 4000);
    } catch (err) {
      console.error('PDF Export Error:', err);
      setExportErrorMessage('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      setExportSuccessMessage(null);
      setExportErrorMessage(null);
      await exportToWord(data);
      setExportSuccessMessage('Word document (.docx) generated and downloaded successfully.');
      setTimeout(() => setExportSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Word Export Error:', err);
      setExportErrorMessage('Failed to generate Word document. Please try again.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* TOP CONTROL BAR (HIDDEN IN PRINT) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-slate-700" />
              {data.customer.trackingNo || 'PREVIEW'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Ready for Export
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Form Preview &amp; Document Generation
          </h2>
          <p className="text-xs text-slate-500">
            Official Thai Inter Flying Document Layout (F-MK-0063 REV: 01)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToDashboard}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Dashboard
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onBackToEdit}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Edit Form
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4" />}
          >
            Print
          </Button>

          <Button
            size="sm"
            onClick={handleExportPdf}
            isLoading={isExportingPdf}
            icon={<FileDown className="w-4 h-4 text-red-200" />}
            className="font-semibold bg-red-800 hover:bg-red-700 text-white border border-red-700 shadow-2xs"
          >
            Export PDF
          </Button>

          <Button
            size="sm"
            onClick={handleExportWord}
            isLoading={isExportingWord}
            icon={<FileText className="w-4 h-4 text-blue-200" />}
            className="font-semibold bg-blue-900 hover:bg-blue-800 text-white border border-blue-800 shadow-2xs"
          >
            Export Word (.docx)
          </Button>
        </div>
      </div>

      {/* ALERTS (HIDDEN IN PRINT) */}
      {exportSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs sm:text-sm font-semibold print:hidden animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{exportSuccessMessage}</span>
        </div>
      )}

      {exportErrorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2.5 text-xs sm:text-sm font-semibold print:hidden animate-in fade-in shadow-2xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{exportErrorMessage}</span>
        </div>
      )}

      {/* FORM PREVIEW DOCUMENT */}
      <div className="py-2 flex justify-center">
        <div className="shadow-lg rounded-sm ring-1 ring-slate-900/10 bg-white">
          <FormPreview data={data} />
        </div>
      </div>

      {/* BOTTOM ACTION BAR (HIDDEN IN PRINT) */}
      <div className="bg-blue-950 text-white p-3.5 rounded-xl shadow-lg flex items-center justify-between gap-4 print:hidden sticky bottom-6 z-40 max-w-[850px] mx-auto border border-blue-900">
        <div className="flex items-center gap-2 text-xs text-blue-200 font-medium">
          <FileCheck className="w-4 h-4 text-blue-300" />
          <span className="hidden sm:inline">Official flight document verified for distribution.</span>
          <span className="sm:hidden font-mono text-blue-200">F-MK-0063 Ready</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onBackToEdit}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs py-1"
          >
            Edit
          </Button>
          <Button
            size="sm"
            onClick={handleExportPdf}
            isLoading={isExportingPdf}
            icon={<FileDown className="w-3.5 h-3.5 text-red-200" />}
            className="text-xs py-1 font-semibold bg-red-800 hover:bg-red-700 text-white border border-red-700"
          >
            PDF
          </Button>
          <Button
            size="sm"
            onClick={handleExportWord}
            isLoading={isExportingWord}
            icon={<FileText className="w-3.5 h-3.5 text-blue-200" />}
            className="text-xs py-1 font-semibold bg-blue-900 hover:bg-blue-800 text-white border border-blue-800"
          >
            Word
          </Button>
        </div>
      </div>
    </div>
  );
};
