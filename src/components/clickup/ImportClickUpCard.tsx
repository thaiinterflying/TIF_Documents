import React, { useState, useRef } from 'react';
import {
  getTask,
  mapClickUpToForm,
  extractClickUpTaskId,
  formatImportedDate,
} from '../../services/clickupService';
import { CustomerTrainingForm } from '../../types/customerTraining';
import { ClickUpServiceError } from '../../types/clickup';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  ArrowDownToLine,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ImportClickUpCardProps {
  currentFormData: CustomerTrainingForm;
  onImportSuccess: (importedForm: CustomerTrainingForm) => void;
}

export const ImportClickUpCard: React.FC<ImportClickUpCardProps> = ({
  currentFormData,
  onImportSuccess,
}) => {
  const [taskInput, setTaskInput] = useState<string>(
    () => currentFormData.clickupTaskId || ''
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localSuccessInfo, setLocalSuccessInfo] = useState<{
    taskId: string;
    lastImportedAt: string;
    taskUrl?: string;
  } | null>(null);

  // Derived success information from local import or form state
  const successInfo =
    localSuccessInfo ||
    (currentFormData.source === 'clickup' && currentFormData.clickupTaskId
      ? {
          taskId: currentFormData.clickupTaskId,
          lastImportedAt: currentFormData.lastImportedAt || '',
          taskUrl: currentFormData.clickupTaskUrl,
        }
      : null);

  // Snapshot of form when imported to detect subsequent edits
  const lastImportedSnapshotRef = useRef<string | null>(null);

  // Modals
  const [isConfirmImportOpen, setIsConfirmImportOpen] = useState<boolean>(false);
  const [isConfirmRefreshOpen, setIsConfirmRefreshOpen] = useState<boolean>(false);
  const [pendingTaskId, setPendingTaskId] = useState<string>('');

  /**
   * Check if the form currently has meaningful user-entered data
   */
  const hasExistingData = (): boolean => {
    const cust = currentFormData.customer;
    if (!cust) return false;
    return Boolean(
      cust.fullName?.trim() ||
      cust.phone?.trim() ||
      cust.email?.trim() ||
      cust.dateOfBirth ||
      cust.idPassportNo ||
      (currentFormData.courseOrder?.courses && currentFormData.courseOrder.courses.length > 0)
    );
  };

  /**
   * Check if current form data was modified after last import
   */
  const isFormModifiedSinceImport = (): boolean => {
    if (!lastImportedSnapshotRef.current) return true;
    try {
      const currentSnapshot = JSON.stringify({
        customer: currentFormData.customer,
        courseOrder: currentFormData.courseOrder,
        finance: currentFormData.finance,
        licenseMedical: currentFormData.licenseMedical,
      });
      return currentSnapshot !== lastImportedSnapshotRef.current;
    } catch {
      return true;
    }
  };

  /**
   * Execute actual task fetch and form mapping
   */
  const executeImport = async (targetId: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const cleanId = extractClickUpTaskId(targetId);
      const task = await getTask(cleanId);
      const mapped = mapClickUpToForm(task, currentFormData);

      // Save snapshot to detect user modifications later
      lastImportedSnapshotRef.current = JSON.stringify({
        customer: mapped.customer,
        courseOrder: mapped.courseOrder,
        finance: mapped.finance,
        licenseMedical: mapped.licenseMedical,
      });

      const importedTimestamp = mapped.lastImportedAt || '';
      setLocalSuccessInfo({
        taskId: task.id,
        lastImportedAt: importedTimestamp,
        taskUrl: mapped.clickupTaskUrl,
      });
      setTaskInput(task.id);

      onImportSuccess(mapped);
    } catch (err: any) {
      const serviceError = err as ClickUpServiceError;
      setErrorMessage(serviceError.message || 'Unable to connect to ClickUp. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * User clicks "Import Data"
   */
  const handleInitiateImport = () => {
    const cleanId = extractClickUpTaskId(taskInput);
    if (!cleanId) {
      setErrorMessage('Please check the Task ID.');
      return;
    }

    setErrorMessage(null);
    setPendingTaskId(cleanId);

    // If form already has data, show confirmation modal (Requirement 7)
    if (hasExistingData()) {
      setIsConfirmImportOpen(true);
    } else {
      executeImport(cleanId);
    }
  };

  const handleConfirmImport = () => {
    setIsConfirmImportOpen(false);
    if (pendingTaskId) {
      executeImport(pendingTaskId);
    }
  };

  /**
   * User clicks "Refresh from ClickUp" (Requirement 11)
   */
  const handleInitiateRefresh = () => {
    const targetId = successInfo?.taskId || extractClickUpTaskId(taskInput);
    if (!targetId) return;

    setPendingTaskId(targetId);

    // If form was modified since last import, show warning modal (Requirement 11)
    if (isFormModifiedSinceImport()) {
      setIsConfirmRefreshOpen(true);
    } else {
      executeImport(targetId);
    }
  };

  const handleConfirmRefresh = () => {
    setIsConfirmRefreshOpen(false);
    if (pendingTaskId) {
      executeImport(pendingTaskId);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-blue-900/40 relative overflow-hidden transition-all">
        {/* Subtle decorative background pattern */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <Layers className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Import from ClickUp
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                    Auto-fill
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Fetch task details, custom fields &amp; notes directly into the Customer Training Form
                </p>
              </div>
            </div>

            {/* Quick Refresh button if task is already imported */}
            {successInfo && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={handleInitiateRefresh}
                  icon={
                    isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    )
                  }
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold backdrop-blur-xs"
                >
                  {isLoading ? 'Refreshing...' : 'Refresh from ClickUp'}
                </Button>
              </div>
            )}
          </div>

          {/* Form & Input Controls */}
          <div className="mt-4 pt-1">
            <label
              htmlFor="clickup-task-id-input"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              ClickUp Task ID
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  id="clickup-task-id-input"
                  type="text"
                  value={taskInput}
                  onChange={(e) => {
                    setTaskInput(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!isLoading) handleInitiateImport();
                    }
                  }}
                  placeholder="e.g. 86eyatw7p or https://app.clickup.com/t/..."
                  disabled={isLoading}
                  className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition disabled:opacity-50"
                />
              </div>

              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={isLoading || !taskInput.trim()}
                onClick={handleInitiateImport}
                icon={
                  isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  ) : (
                    <ArrowDownToLine className="w-4 h-4 text-amber-300" />
                  )
                }
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 shrink-0 shadow-sm disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading data from ClickUp...' : 'Import Data'}
              </Button>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                Enter the Task ID (e.g. <code className="text-amber-200 font-mono">86eyatw7p</code>) or paste the full ClickUp Task URL.
              </span>
            </p>
          </div>

          {/* Loading status banner (Requirement 8) */}
          {isLoading && (
            <div className="mt-4 p-3 rounded-xl bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs flex items-center gap-2.5 animate-pulse">
              <Loader2 className="w-4 h-4 text-blue-300 animate-spin shrink-0" />
              <span className="font-medium">Loading data from ClickUp...</span>
            </div>
          )}

          {/* Error Message banner (Requirement 10) */}
          {errorMessage && !isLoading && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-red-100 whitespace-pre-line">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Info banner (Requirement 9) */}
          {successInfo && !isLoading && !errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-emerald-200">
                  ✓ Successfully imported from ClickUp
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-300 flex-wrap">
                <div>
                  <span className="text-slate-400 mr-1.5">ClickUp Task</span>
                  <span className="font-mono font-bold text-amber-300 bg-black/30 px-2 py-0.5 rounded border border-white/10">
                    {successInfo.taskId}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 mr-1.5">Last imported</span>
                  <span className="font-mono font-medium text-slate-200">
                    {formatImportedDate(successInfo.lastImportedAt)}
                  </span>
                </div>

                {successInfo.taskUrl && (
                  <a
                    href={successInfo.taskUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 underline font-medium"
                  >
                    Open Task <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRMATION BEFORE IMPORT MODAL (Requirement 7) */}
      <Modal
        isOpen={isConfirmImportOpen}
        onClose={() => setIsConfirmImportOpen(false)}
        title="Replace Existing Form Data?"
        description="Confirmation needed before importing from ClickUp"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmImportOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmImport}
              className="bg-blue-900 hover:bg-blue-800"
            >
              Import
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-slate-700 text-sm">
          <p className="font-medium text-slate-900">
            Importing data from ClickUp will replace existing form data.
          </p>
          <p className="text-xs text-slate-500">
            Are you sure you want to proceed? Any unsaved edits in current sections will be overwritten by the task's latest values.
          </p>
        </div>
      </Modal>

      {/* REFRESH WARNING MODAL (Requirement 11) */}
      <Modal
        isOpen={isConfirmRefreshOpen}
        onClose={() => setIsConfirmRefreshOpen(false)}
        title="Refresh Data from ClickUp?"
        description="Form has modifications since last import"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmRefreshOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmRefresh}
              className="bg-blue-900 hover:bg-blue-800"
            >
              Continue
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-slate-700 text-sm">
          <p className="font-medium text-slate-900">
            Refreshing from ClickUp may replace your current form data.
          </p>
          <p className="text-xs text-slate-500">
            Continue? Your manual changes may be replaced by the current ClickUp task data.
          </p>
        </div>
      </Modal>
    </>
  );
};
