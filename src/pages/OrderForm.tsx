import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  customerTrainingSchema,
  CustomerTrainingFormData,
} from '../schemas/customerTrainingSchema';
import { CustomerTrainingForm } from '../types/customerTraining';
import {
  saveCurrentForm,
  loadCurrentForm,
  clearCurrentForm,
} from '../utils/storage';
import {
  initialFormValues,
  sampleCompletedFormValues,
} from '../utils/defaultValues';

// Sections
import { DistributionSection } from '../components/form/DistributionSection';
import { CustomerInformationSection } from '../components/form/CustomerInformationSection';
import { EmergencyContactSection } from '../components/form/EmergencyContactSection';
import { LicenseMedicalSection } from '../components/form/LicenseMedicalSection';
import { CourseOrderSection } from '../components/form/CourseOrderSection';
import { OtherSection } from '../components/form/OtherSection';
import { FinanceSection } from '../components/form/FinanceSection';
import { ApprovalSection } from '../components/form/ApprovalSection';

// UI
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ImportClickUpCard } from '../components/clickup/ImportClickUpCard';
import {
  Send,
  User,
  PhoneCall,
  Award,
  Plane,
  Briefcase,
  DollarSign,
  ShieldCheck,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Save,
  Check,
  Layers,
  BookOpen,
} from 'lucide-react';

interface OrderFormProps {
  initialData?: CustomerTrainingForm | null;
  onGoToPreview: (data: CustomerTrainingForm) => void;
  onBackToDashboard: () => void;
}

interface StepItem {
  id: number;
  key: string;
  code: string;
  title: string;
  icon: React.ReactNode;
}

const STEPS: StepItem[] = [
  { id: 1, key: 'distribution', code: 'A', title: 'Distribution', icon: <Send className="w-4 h-4" /> },
  { id: 2, key: 'customer', code: 'B', title: 'Customer Info', icon: <User className="w-4 h-4" /> },
  { id: 3, key: 'emergencyContact', code: 'C', title: 'Emergency Contact', icon: <PhoneCall className="w-4 h-4" /> },
  { id: 4, key: 'licenseMedical', code: 'D', title: 'License & Medical', icon: <Award className="w-4 h-4" /> },
  { id: 5, key: 'courseOrder', code: 'E', title: 'Course Order Details', icon: <Plane className="w-4 h-4" /> },
  { id: 6, key: 'otherServices', code: 'F', title: 'Other Services', icon: <Briefcase className="w-4 h-4" /> },
  { id: 7, key: 'finance', code: 'G', title: 'Finance Tracking', icon: <DollarSign className="w-4 h-4" /> },
  { id: 8, key: 'approval', code: 'J', title: 'Approval & Signature', icon: <ShieldCheck className="w-4 h-4" /> },
];

export const OrderForm: React.FC<OrderFormProps> = ({
  initialData,
  onGoToPreview,
  onBackToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState<boolean>(false);
  const [hasPromptedRestore, setHasPromptedRestore] = useState<boolean>(false);
  const [savedToastVisible, setSavedToastVisible] = useState<boolean>(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CustomerTrainingFormData>({
    resolver: zodResolver(customerTrainingSchema),
    defaultValues: (initialData || initialFormValues) as any,
    mode: 'onBlur',
  });

  const formValues = watch();

  // Check if a saved draft exists on first load
  useEffect(() => {
    if (!initialData && !hasPromptedRestore) {
      const saved = loadCurrentForm();
      if (saved && saved.customer && (saved.customer.fullName || saved.customer.trackingNo)) {
        setIsRestoreModalOpen(true);
      }
      setHasPromptedRestore(true);
    }
  }, [initialData, hasPromptedRestore]);

  // Real-time auto save to localStorage
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      saveCurrentForm(formValues as CustomerTrainingForm);
    }, 400);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [formValues]);

  const handleRestoreDraft = () => {
    const saved = loadCurrentForm();
    if (saved) {
      reset(saved as any);
    }
    setIsRestoreModalOpen(false);
  };

  const handleStartFresh = () => {
    clearCurrentForm();
    reset(initialFormValues as any);
    setIsRestoreModalOpen(false);
  };

  const handleConfirmReset = () => {
    clearCurrentForm();
    reset(initialFormValues as any);
    setCurrentStep(1);
    setIsResetModalOpen(false);
  };

  const handleFillDemoData = () => {
    reset(sampleCompletedFormValues as any);
    triggerAutoSaveToast();
  };

  const handleImportSuccess = (importedData: CustomerTrainingForm) => {
    reset(importedData as any);
    saveCurrentForm(importedData);
    triggerAutoSaveToast();
  };

  const triggerAutoSaveToast = () => {
    setSavedToastVisible(true);
    setTimeout(() => setSavedToastVisible(false), 2000);
  };

  // Step Completion logic for checkmarks (✓)
  const isStepComplete = (stepId: number): boolean => {
    const val = formValues as CustomerTrainingForm;
    if (!val) return false;
    switch (stepId) {
      case 1:
        return Boolean(val.distribution?.sendTo?.length > 0 && val.distribution?.customerStatus);
      case 2:
        return Boolean(val.customer?.fullName && val.customer?.trackingNo && val.customer?.phone && val.customer?.email);
      case 3:
        return Boolean(val.emergencyContact?.name && val.emergencyContact?.phone);
      case 4:
        return Boolean(val.licenseMedical?.currentLicense && val.licenseMedical?.medical);
      case 5:
        return Boolean(val.courseOrder?.courses?.length > 0 && val.courseOrder?.preferredStart);
      case 6:
        return Boolean(val.otherServices?.accommodation && val.otherServices?.meals);
      case 7:
        return Boolean(typeof val.finance?.totalPrice === 'number' && val.finance?.paymentMethod?.length > 0);
      case 8:
        return Boolean(val.approval?.approvedBy || val.approval?.signature);
      default:
        return false;
    }
  };

  const completedCount = STEPS.filter((s) => isStepComplete(s.id)).length;
  const progressPercent = Math.round((completedCount / STEPS.length) * 100);

  // Submit & Validation handler
  const onValidSubmit = (data: CustomerTrainingFormData) => {
    saveCurrentForm(data as CustomerTrainingForm);
    onGoToPreview(data as CustomerTrainingForm);
  };

  const onInvalidSubmit = (formErrors: any) => {
    console.warn('Form validation failed:', formErrors);

    // Identify which step contains the first error and switch to it
    if (formErrors.distribution) {
      setCurrentStep(1);
    } else if (formErrors.customer) {
      setCurrentStep(2);
    } else if (formErrors.emergencyContact) {
      setCurrentStep(3);
    } else if (formErrors.licenseMedical) {
      setCurrentStep(4);
    } else if (formErrors.courseOrder) {
      setCurrentStep(5);
    } else if (formErrors.otherServices) {
      setCurrentStep(6);
    } else if (formErrors.finance) {
      setCurrentStep(7);
    } else if (formErrors.approval) {
      setCurrentStep(8);
    }

    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* TOP HEADER / WORKFLOW ACTION BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-slate-700" />
                {formValues.customer?.trackingNo || 'NEW-ORDER'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Step {currentStep} of {STEPS.length}: <span className="font-bold text-slate-800">{STEPS[currentStep - 1].title}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {progressPercent}% Complete
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              CUSTOMER TRAINING ORDER &amp; TRACKING FORM
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBackToDashboard}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Dashboard
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const el = document.getElementById('clickup-task-id-input');
                if (el) {
                  el.focus();
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              icon={<Layers className="w-3.5 h-3.5 text-blue-700" />}
              title="Import data from ClickUp"
              className="border-slate-300 text-slate-800 hover:bg-slate-50 font-medium"
            >
              Import ClickUp
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillDemoData}
              icon={<BookOpen className="w-3.5 h-3.5 text-slate-500" />}
              title="Load sample cadet data"
            >
              Fill Sample
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsResetModalOpen(true)}
              icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:text-red-600" />}
              className="text-slate-600 hover:bg-red-50 hover:text-red-700"
            >
              Reset
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit(onValidSubmit, onInvalidSubmit)}
              icon={<Eye className="w-4 h-4" />}
              className="font-semibold shadow-xs"
            >
              Preview &amp; Export
            </Button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-500 shrink-0">
            {completedCount}/{STEPS.length} Sections Complete
          </span>
        </div>
      </div>

      {/* ERROR BANNER IF ANY */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 animate-in fade-in shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h5 className="font-bold">Required Information Missing</h5>
            <p className="text-xs text-red-700 mt-0.5 font-medium">
              Please complete all required fields before generating Preview, PDF, or Word documents. Check the highlighted red fields.
            </p>
          </div>
        </div>
      )}

      {/* IMPORT FROM CLICKUP */}
      <ImportClickUpCard
        currentFormData={formValues as CustomerTrainingForm}
        onImportSuccess={handleImportSuccess}
      />

      {/* MAIN CONTAINER: SIDEBAR + FORM BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* DESKTOP SIDEBAR STEPPER */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 sticky top-20 hidden lg:block">
          <div className="px-3 py-2 border-b border-slate-100 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Form Sections
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">
              {completedCount}/{STEPS.length}
            </span>
          </div>

          <nav className="space-y-1 relative">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const completed = isStepComplete(step.id);

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left group ${
                    isActive
                      ? 'bg-blue-900 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`w-5.5 h-5.5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {step.code}
                    </span>
                    <span className="truncate">{step.title}</span>
                  </div>

                  {completed && (
                    <span
                      className={`shrink-0 ml-2 rounded-full p-0.5 ${
                        isActive ? 'text-amber-300' : 'text-emerald-600'
                      }`}
                      title="Section has complete data"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={handleSubmit(onValidSubmit, onInvalidSubmit)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-700" />
                  <span>Preview &amp; Export</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
              </button>
            </div>
          </nav>

          {/* Autosave status indicator */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 px-3 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Save className="w-3.5 h-3.5 text-emerald-600" /> Auto-saved
            </span>
            <span className="font-mono text-[10px] text-slate-400">local storage</span>
          </div>
        </aside>

        {/* MOBILE / TABLET STEPPER */}
        <div className="lg:hidden col-span-1 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const completed = isStepComplete(step.id);
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="font-mono">{step.code}.</span>
                  <span>{step.title}</span>
                  {completed && <Check className="w-3.5 h-3.5 text-emerald-600 inline ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* FORM BODY CARD */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-9">
          <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
            {/* RENDER STEP ACCORDING TO CURRENT STEP */}
            {currentStep === 1 && (
              <DistributionSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            )}

            {currentStep === 2 && (
              <CustomerInformationSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            )}

            {currentStep === 3 && (
              <EmergencyContactSection
                register={register}
                errors={errors}
              />
            )}

            {currentStep === 4 && (
              <LicenseMedicalSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            )}

            {currentStep === 5 && (
              <CourseOrderSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            )}

            {currentStep === 6 && (
              <OtherSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            )}

            {currentStep === 7 && (
              <FinanceSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            )}

            {currentStep === 8 && (
              <ApprovalSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            )}

            {/* STEP CONTROLS / PAGINATION FOOTER */}
            <div className="mt-9 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    icon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous Section
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setCurrentStep((prev) => Math.min(STEPS.length, prev + 1))}
                    icon={<ChevronRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Save &amp; Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    icon={<Eye className="w-5 h-5 text-slate-950" />}
                    className="font-bold shadow-lg"
                  >
                    Complete &amp; Open Preview
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* RESTORE PREVIOUS DATA MODAL */}
      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        title="Restore previous form data?"
        description="We found an existing training order draft saved in your browser."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={handleStartFresh}>
              Start New Form
            </Button>
            <Button variant="primary" size="sm" onClick={handleRestoreDraft}>
              Restore Draft
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-700 leading-relaxed">
          Would you like to resume editing your saved draft, or start completely fresh with blank fields?
        </p>
      </Modal>

      {/* RESET CONFIRMATION MODAL */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Clear Form Data"
        description="Are you sure you want to clear all form data?"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReset}>
              Clear Data
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-700 leading-relaxed">
          All inputs across all sections will be erased and reset to empty values. This cannot be undone.
        </p>
      </Modal>

      {/* TOAST NOTIFICATION */}
      {savedToastVisible && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950/90 text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Form draft saved successfully</span>
        </div>
      )}
    </div>
  );
};
