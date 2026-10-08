import { useState, useEffect } from 'react';
import { CustomerTrainingForm, FormDraftSummary } from './types/customerTraining';
import { initialFormValues } from './utils/defaultValues';
import { loadCurrentForm, saveCurrentForm } from './utils/storage';
import { Dashboard } from './pages/Dashboard';
import { OrderForm } from './pages/OrderForm';
import { PreviewPage } from './pages/PreviewPage';
import { LOGO_BASE64 } from './assets/logoBase64';
import { LayoutDashboard, FileEdit, Eye, Plane } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'form' | 'preview'>('dashboard');
  const [formData, setFormData] = useState<CustomerTrainingForm>(() => {
    return loadCurrentForm() || initialFormValues;
  });

  // Keep state synced to localStorage
  useEffect(() => {
    if (formData) {
      saveCurrentForm(formData);
    }
  }, [formData]);

  const handleStartNewOrder = () => {
    setFormData(initialFormValues);
    setView('form');
  };

  const handleContinueDraft = (draft: FormDraftSummary) => {
    setFormData(draft.formData);
    setView('form');
  };

  const handlePreviewDraft = (draft: FormDraftSummary) => {
    setFormData(draft.formData);
    setView('preview');
  };

  const handleGoToPreview = (data: CustomerTrainingForm) => {
    setFormData(data);
    setView('preview');
  };

  const handleBackToEdit = () => {
    setView('form');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col font-sans">
      {/* CORPORATE ENTERPRISE HEADER (HIDDEN IN PRINT) */}
      <header className="bg-blue-950 text-white border-b border-blue-900 sticky top-0 z-40 print:hidden shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => setView('dashboard')}
            >
              <div className="bg-white p-1.5 rounded-lg border border-slate-200 shrink-0 shadow-xs">
                <img src={LOGO_BASE64} alt="Thai Inter Flying" className="h-8 w-auto object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-wide text-white block">
                  THAI INTER FLYING
                </span>
                <p className="text-[10px] sm:text-[11px] text-blue-200 tracking-wider uppercase font-semibold">
                  Aviation Training Operations
                </p>
              </div>
            </div>

            {/* Navigation Tabs (Clean Corporate Aviation Style) */}
            <nav className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  view === 'dashboard'
                    ? 'bg-white/20 text-white font-bold border border-white/20 shadow-xs'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setView('form')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  view === 'form'
                    ? 'bg-white/20 text-white font-bold border border-white/20 shadow-xs'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileEdit className="w-4 h-4" />
                <span>Training Form</span>
              </button>

              <button
                type="button"
                onClick={() => setView('preview')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  view === 'preview'
                    ? 'bg-amber-400 text-slate-950 font-bold border border-amber-300 shadow-xs'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Preview &amp; Export</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {view === 'dashboard' && (
          <Dashboard
            onNewOrder={handleStartNewOrder}
            onContinueDraft={handleContinueDraft}
            onPreviewDraft={handlePreviewDraft}
          />
        )}

        {view === 'form' && (
          <OrderForm
            initialData={formData}
            onGoToPreview={handleGoToPreview}
            onBackToDashboard={handleBackToDashboard}
          />
        )}

        {view === 'preview' && (
          <PreviewPage
            data={formData}
            onBackToEdit={handleBackToEdit}
            onBackToDashboard={handleBackToDashboard}
          />
        )}
      </main>

      {/* CORPORATE FOOTER (HIDDEN IN PRINT) */}
      <footer className="bg-white border-t border-slate-200 py-4 text-slate-500 text-xs print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-blue-900" />
            <span className="font-semibold text-slate-700">Thai Inter Flying School</span>
            <span className="text-slate-400">• Customer Training Order &amp; Tracking System</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">
              DOC: F-MK-0063
            </span>
            <span>ISS: NO.01</span>
            <span>REV: 01</span>
            <span>ED: 08-MAY-26</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
