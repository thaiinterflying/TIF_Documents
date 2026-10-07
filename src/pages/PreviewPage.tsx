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
  Share2,
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
      setExportSuccessMessage('PDF document downloaded successfully!');
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
      setExportSuccessMessage('Word document (.docx) downloaded successfully!');
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
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              {data.customer.trackingNo || 'PREVIEW'}
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ✓ Ready for Export
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            Form Preview &amp; Document Generation
          </h2>
          <p className="text-xs text-slate-500">
            Official Thai Inter Flying Document Layout (F-MK-0063)
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
            variant="primary"
            size="sm"
            onClick={handleExportPdf}
            isLoading={isExportingPdf}
            icon={<FileDown className="w-4 h-4 text-red-300" />}
            className="bg-red-800 hover:bg-red-700 text-white font-bold"
          >
            Export PDF
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportWord}
            isLoading={isExportingWord}
            icon={<FileText className="w-4 h-4 text-sky-300" />}
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold"
          >
            Export Word (.docx)
          </Button>
        </div>
      </div>

      {/* SUCCESS OR ERROR ALERTS (HIDDEN IN PRINT) */}
      {exportSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs sm:text-sm font-semibold print:hidden animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{exportSuccessMessage}</span>
        </div>
      )}

      {exportErrorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2.5 text-xs sm:text-sm font-semibold print:hidden animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{exportErrorMessage}</span>
        </div>
      )}

      {/* FORM PREVIEW DOCUMENT */}
      <div className="py-2">
        <FormPreview data={data} />
      </div>

      {/* BOTTOM FLOATING / STICKY ACTION BAR (HIDDEN IN PRINT) */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl flex items-center justify-between gap-4 print:hidden sticky bottom-4 z-40 max-w-[850px] mx-auto border border-slate-700">
        <div className="flex items-center gap-2 text-xs">
          <Share2 className="w-4 h-4 text-sky-400" />
          <span>Document certified and prepared for dispatch.</span>
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
            variant="primary"
            onClick={handleExportPdf}
            isLoading={isExportingPdf}
            icon={<FileDown className="w-3.5 h-3.5" />}
            className="bg-red-700 hover:bg-red-600 text-xs py-1 font-bold"
          >
            PDF
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleExportWord}
            isLoading={isExportingWord}
            icon={<FileText className="w-3.5 h-3.5" />}
            className="bg-blue-600 hover:bg-blue-500 text-xs py-1 font-bold"
          >
            Word
          </Button>
        </div>
      </div>
    </div>
  );
};
