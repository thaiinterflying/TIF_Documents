import React, { useState, useEffect } from 'react';
import { FormDraftSummary } from '../types/customerTraining';
import { getDraftsList, deleteDraft, saveCurrentForm } from '../utils/storage';
import { sampleCompletedFormValues } from '../utils/defaultValues';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LOGO_BASE64 } from '../assets/logoBase64';
import {
  Plus,
  Search,
  FileText,
  Clock,
  Trash2,
  ExternalLink,
  Edit3,
  Plane,
  CheckCircle,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { formatDateDisplay } from '../utils/calculations';

interface DashboardProps {
  onNewOrder: () => void;
  onContinueDraft: (draft: FormDraftSummary) => void;
  onPreviewDraft: (draft: FormDraftSummary) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewOrder,
  onContinueDraft,
  onPreviewDraft,
}) => {
  const [drafts, setDrafts] = useState<FormDraftSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    refreshDrafts();
  }, []);

  const refreshDrafts = () => {
    setDrafts(getDraftsList());
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteDraft(deleteTargetId);
      setDeleteTargetId(null);
      refreshDrafts();
    }
  };

  const handleLoadSample = () => {
    saveCurrentForm(sampleCompletedFormValues);
    refreshDrafts();
    onContinueDraft({
      id: sampleCompletedFormValues.customer.trackingNo,
      trackingNo: sampleCompletedFormValues.customer.trackingNo,
      fullName: sampleCompletedFormValues.customer.fullName,
      customerType: sampleCompletedFormValues.customer.customerType,
      course: sampleCompletedFormValues.courseOrder.courses.join(', '),
      updatedAt: new Date().toISOString(),
      status: 'Completed',
      formData: sampleCompletedFormValues,
    });
  };

  const filteredDrafts = drafts.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.trackingNo.toLowerCase().includes(q) ||
      d.fullName.toLowerCase().includes(q) ||
      d.course.toLowerCase().includes(q) ||
      d.customerType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 p-6 sm:p-8 text-white shadow-lg border border-blue-900/40">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Plane className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="bg-white p-2.5 rounded-xl shadow-md shrink-0">
              <img src={LOGO_BASE64} alt="Thai Inter Flying" className="h-12 w-auto object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-sky-300 border border-blue-400/30 mb-1.5">
                <Plane className="w-3.5 h-3.5" /> THAI INTER FLYING AVIATION SYSTEM
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white m-0">
                Customer Training Order &amp; Tracking
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Official Flight Training Registration, Financial Tracking, and Document Export System
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={handleLoadSample}
              icon={<Sparkles className="w-4 h-4 text-amber-500" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-sm text-xs sm:text-sm"
            >
              Load Demo Cadet Form
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onNewOrder}
              icon={<Plus className="w-4 h-4" />}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold border-amber-300 text-xs sm:text-sm"
            >
              New Training Order
            </Button>

          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Recorded Orders
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{drafts.length}</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-900 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ready for Export
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">
              {drafts.filter((d) => d.status === 'Completed').length}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              System Document Form
            </span>
            <div className="text-sm font-bold text-slate-800 font-mono mt-1">F-MK-0063 (REV: 01)</div>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* DRAFTS LIST SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Training Orders &amp; Drafts</h3>
            <p className="text-xs text-slate-500">
              Orders cached in browser localStorage with real-time update tracking
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Tracking No, Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
        </div>

        {/* Orders Table */}
        {filteredDrafts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No training orders found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery
                ? 'No draft matches your search criteria. Try a different query.'
                : 'Start a new Customer Training Order or load a demo form to experience the complete workflow.'}
            </p>
            <div className="flex justify-center gap-3">
              <Button size="sm" variant="outline" onClick={handleLoadSample}>
                Load Demo Cadet Form
              </Button>
              <Button size="sm" variant="primary" onClick={onNewOrder} icon={<Plus className="w-3.5 h-3.5" />}>
                Create New Form
              </Button>

            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tracking No.</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Course Ordered</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDrafts.map((draft) => (
                  <tr
                    key={draft.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-950 whitespace-nowrap">
                      {draft.trackingNo}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {draft.fullName || 'Untitled Customer'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {draft.customerType || 'Individual'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate font-medium">
                      {draft.course}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-xs flex items-center gap-1.5 pt-4">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateDisplay(draft.updatedAt)}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          draft.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {draft.status === 'Completed' ? '✓ Ready' : '• In Progress'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onContinueDraft(draft)}
                          icon={<Edit3 className="w-3.5 h-3.5" />}
                          className="text-xs py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onPreviewDraft(draft)}
                          icon={<ExternalLink className="w-3.5 h-3.5" />}
                          className="text-xs py-1"
                        >
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTargetId(draft.id)}
                          icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                          className="text-xs py-1 px-2 hover:bg-red-50"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Delete"
        description="This action cannot be undone."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
              Delete Record
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-700">
          Are you sure you want to delete this Customer Training Order draft from browser storage?
        </p>
      </Modal>
    </div>
  );
};
