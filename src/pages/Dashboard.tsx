import React, { useState } from 'react';
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
  CheckCircle2,
  BookOpen,
  Award,
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
  const [drafts, setDrafts] = useState<FormDraftSummary[]>(() => getDraftsList());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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
    const matchesSearch =
      !q ||
      d.trackingNo.toLowerCase().includes(q) ||
      d.fullName.toLowerCase().includes(q) ||
      d.course.toLowerCase().includes(q) ||
      d.customerType.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (statusFilter === 'completed') return d.status === 'Completed';
    if (statusFilter === 'in-progress') return d.status !== 'Completed';
    return true;
  });

  const completedCount = drafts.filter((d) => d.status === 'Completed').length;
  const inProgressCount = drafts.length - completedCount;

  return (
    <div className="space-y-6">
      {/* CORPORATE EXECUTIVE BANNER */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 border border-blue-900/60 p-6 sm:p-7 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shrink-0 shadow-xs">
              <img src={LOGO_BASE64} alt="Thai Inter Flying" className="h-11 w-auto object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-900/80 text-blue-200 border border-blue-700/60 mb-1.5">
                DOC: F-MK-0063 (REV: 01)
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white m-0">
                Customer Training Order &amp; Tracking
              </h1>
              <p className="text-xs sm:text-sm text-blue-200/90 mt-1 max-w-xl font-normal leading-relaxed">
                Flight Training Registration, Multi-Department Workflow Distribution, and Document Generation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={handleLoadSample}
              icon={<BookOpen className="w-4 h-4 text-blue-200" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs sm:text-sm font-medium"
            >
              Load Sample Record
            </Button>
            <Button
              variant="gold"
              size="md"
              onClick={onNewOrder}
              icon={<Plus className="w-4 h-4 text-slate-950" />}
              className="font-bold text-xs sm:text-sm shadow-md"
            >
              New Training Order
            </Button>
          </div>
        </div>
      </div>

      {/* OPERATIONS KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Recorded Orders
            </span>
            <div className="text-2xl font-bold text-blue-950 mt-1 tracking-tight flex items-baseline gap-1.5">
              {drafts.length}
              <span className="text-xs font-normal text-slate-400">records</span>
            </div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg border border-blue-200">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Ready for Export */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Ready for Export
            </span>
            <div className="text-2xl font-bold text-emerald-700 mt-1 tracking-tight flex items-baseline gap-1.5">
              {completedCount}
              <span className="text-xs font-normal text-emerald-600">verified</span>
            </div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Drafts in Progress
            </span>
            <div className="text-2xl font-bold text-amber-700 mt-1 tracking-tight flex items-baseline gap-1.5">
              {inProgressCount}
              <span className="text-xs font-normal text-amber-600">active</span>
            </div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Document Standard */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Document Standard
            </span>
            <div className="text-sm font-bold text-slate-800 font-mono mt-1.5 flex items-center gap-1.5">
              <span className="bg-blue-50 text-blue-900 font-semibold px-2 py-0.5 rounded border border-blue-200">F-MK-0063</span>
              <span className="text-xs text-slate-500 font-normal">REV: 01</span>
            </div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg border border-blue-200">
            <Award className="w-5 h-5 text-blue-900" />
          </div>
        </div>
      </div>

      {/* ORDERS TABLE SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/60">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Training Orders &amp; Records
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Form records stored locally in browser storage
            </p>
          </div>

          {/* Filter Pills + Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Filter Chips */}
            <div className="flex items-center bg-slate-200/60 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({drafts.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  statusFilter === 'completed'
                    ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ready ({completedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('in-progress')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  statusFilter === 'in-progress'
                    ? 'bg-white text-amber-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Drafts ({inProgressCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tracking no, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredDrafts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-200">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No training orders found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
              {searchQuery
                ? 'No draft matches your search criteria. Try a different query.'
                : 'Start a new Customer Training Order or load a sample record to inspect the system.'}
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button size="sm" variant="outline" onClick={handleLoadSample} icon={<BookOpen className="w-3.5 h-3.5 text-slate-600" />}>
                Load Sample Record
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
              <tbody className="divide-y divide-slate-100">
                {filteredDrafts.map((draft) => (
                  <tr
                    key={draft.id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap text-blue-900">
                      {draft.trackingNo}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {(draft.fullName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[180px] sm:max-w-xs">{draft.fullName || 'Untitled Cadet'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {draft.customerType || 'Individual'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate font-medium">
                      {draft.course || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateDisplay(draft.updatedAt)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {draft.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready for Export
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" /> In Progress
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
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
                          className="text-xs py-1 font-semibold"
                        >
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTargetId(draft.id)}
                          icon={<Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-600" />}
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
        <p className="text-sm text-slate-700 leading-relaxed">
          Are you sure you want to delete this Customer Training Order record from browser storage?
        </p>
      </Modal>
    </div>
  );
};
