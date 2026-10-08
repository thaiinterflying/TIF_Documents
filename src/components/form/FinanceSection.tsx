import React, { useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CustomerTrainingFormData } from '../../schemas/customerTrainingSchema';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Radio } from '../ui/Radio';
import { DollarSign, FileCheck, CheckCircle2, Calculator } from 'lucide-react';
import { calculateFinalPrice, formatCurrency } from '../../utils/calculations';

interface FinanceSectionProps {
  register: UseFormRegister<CustomerTrainingFormData>;
  errors: FieldErrors<CustomerTrainingFormData>;
  watch: UseFormWatch<CustomerTrainingFormData>;
  setValue: UseFormSetValue<CustomerTrainingFormData>;
}

const PAYMENT_METHODS = ['Cash', 'Transfer', 'Installments', 'Corporate Balance'];
const DOCUMENTS_LIST = [
  'ID copy',
  'Medical',
  'License copy',
  'Logbook',
  'English/ELP',
  'Photos',
  'Other',
];

export const FinanceSection: React.FC<FinanceSectionProps> = ({
  register,
  watch,
  setValue,
}) => {
  const totalPrice = watch('finance.totalPrice');
  const discount = watch('finance.discount');
  const depositRequired = watch('finance.depositRequired');
  const paymentMethods = watch('finance.paymentMethod') || [];
  const selectedDocs = watch('finance.documents') || [];
  const eligibility = watch('finance.eligibilityVerified');

  // Automatic calculation of Final Price whenever totalPrice or discount changes
  useEffect(() => {
    const finalVal = calculateFinalPrice(totalPrice, discount);
    setValue('finance.finalPrice', finalVal, { shouldValidate: true });
  }, [totalPrice, discount, setValue]);

  const togglePaymentMethod = (method: string) => {
    if (paymentMethods.includes(method)) {
      setValue(
        'finance.paymentMethod',
        paymentMethods.filter((m) => m !== method),
        { shouldValidate: true }
      );
    } else {
      setValue('finance.paymentMethod', [...paymentMethods, method], { shouldValidate: true });
    }
  };

  const toggleDocument = (doc: string) => {
    if (selectedDocs.includes(doc)) {
      setValue(
        'finance.documents',
        selectedDocs.filter((d) => d !== doc),
        { shouldValidate: true }
      );
    } else {
      setValue('finance.documents', [...selectedDocs, doc], { shouldValidate: true });
    }
  };

  const currentFinal = calculateFinalPrice(totalPrice, discount);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-700" />
          SECTION G – FINANCE (tracking)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Tuition pricing, payment tracking, document verification, and eligibility checks
        </p>
      </div>

      {/* PRICING & AUTO CALCULATION CARD */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-xl p-5 border border-blue-900/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h4 className="text-sm font-bold text-blue-200 flex items-center gap-2 tracking-tight">
            <Calculator className="w-4 h-4 text-emerald-400" /> Tuition Fee &amp; Auto Calculation
          </h4>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded">
            Auto-calculated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* Total Price */}
          <div>
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              Total price (THB)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                placeholder="0"
                {...register('finance.totalPrice', { valueAsNumber: true })}
                className="w-full text-base font-semibold px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              />
              <span className="absolute right-3 top-2 text-xs text-blue-300 font-medium">THB</span>
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              Discount (THB)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                placeholder="0"
                {...register('finance.discount', { valueAsNumber: true })}
                className="w-full text-base font-semibold px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              />
              <span className="absolute right-3 top-2 text-xs text-blue-300 font-medium">THB</span>
            </div>
          </div>

          {/* Final Price Highlight */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex flex-col justify-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Final Amount (สุทธิ)
            </span>
            <div className="text-2xl font-black text-emerald-300 font-mono tracking-tight mt-0.5">
              {formatCurrency(currentFinal)} <span className="text-xs font-normal text-emerald-400">THB</span>
            </div>
          </div>
        </div>
      </div>

      {/* DEPOSIT DETAILS */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Deposit Required (การวางเงินมัดจำ):
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex gap-3">
            {['Yes', 'No'].map((opt) => (
              <label
                key={opt}
                className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-semibold cursor-pointer transition ${
                  depositRequired === opt
                    ? 'border-blue-900 bg-blue-900 text-white shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Radio
                  {...register('finance.depositRequired')}
                  value={opt}
                  label={opt === 'Yes' ? 'Yes (มีมัดจำ)' : 'No (ไม่มีมัดจำ)'}
                  checked={depositRequired === opt}
                />
              </label>
            ))}
          </div>

          {depositRequired === 'Yes' && (
            <Input
              label="Deposit Date (วันที่วางมัดจำ)"
              type="date"
              {...register('finance.depositDate')}
            />
          )}

          <Input
            label="Deposit received (จำนวนเงินมัดจำที่รับแล้ว)"
            type="number"
            placeholder="0"
            rightAddon="THB"
            {...register('finance.depositReceived', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* PAYMENT METHOD */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Payment method (วิธีการชำระเงิน):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PAYMENT_METHODS.map((pm) => {
            const isChecked = paymentMethods.includes(pm);
            return (
              <div
                key={pm}
                onClick={() => togglePaymentMethod(pm)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-xs sm:text-sm font-medium transition cursor-pointer select-none ${
                  isChecked
                    ? 'border-blue-900 bg-blue-50/90 text-blue-950 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => togglePaymentMethod(pm)}
                  className="w-4 h-4 rounded text-blue-900 border-slate-300 pointer-events-none accent-blue-900"
                />
                <span>{pm}</span>
              </div>
            );
          })}
        </div>

        {/* Installment details input */}
        {paymentMethods.includes('Installments') && (
          <div className="pt-2 animate-in fade-in">
            <Input
              label="Installment Details (รายละเอียดงวดชำระ)"
              placeholder="e.g. 4 installments divided equally every 3 months"
              {...register('finance.installmentDetails')}
            />
          </div>
        )}

        {/* Corporate balance input */}
        {paymentMethods.includes('Corporate Balance') && (
          <div className="pt-2 animate-in fade-in">
            <Input
              label="Corporate Balance (ยอดคงเหลือขององค์กร)"
              type="number"
              placeholder="0"
              rightAddon="THB"
              {...register('finance.corporateBalance', { valueAsNumber: true })}
            />
          </div>
        )}
      </div>

      {/* DOCUMENTS CHECKLIST */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-blue-800" /> Documents submitted (เอกสารประกอบที่ได้รับ):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {DOCUMENTS_LIST.map((doc) => {
            const isChecked = selectedDocs.includes(doc);
            return (
              <div
                key={doc}
                onClick={() => toggleDocument(doc)}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer select-none ${
                  isChecked
                    ? 'border-blue-900 bg-blue-50/90 text-blue-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDocument(doc)}
                  className="w-4 h-4 rounded text-blue-900 border-slate-300 pointer-events-none accent-blue-900"
                />
                <span>{doc}</span>
              </div>
            );
          })}
        </div>

        {selectedDocs.includes('Other') && (
          <div className="pt-2 animate-in fade-in">
            <Input
              label="Other Document (ระบุเอกสารอื่น)"
              placeholder="e.g. Academic Degree Certificate / Recommendation Letter"
              {...register('finance.otherDocument')}
            />
          </div>
        )}
      </div>

      {/* ELIGIBILITY VERIFIED */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-blue-800" /> Eligibility verified (การตรวจสอบคุณสมบัติ):
        </label>
        <div className="flex flex-wrap items-center gap-4">
          {['Yes', 'No'].map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer transition ${
                eligibility === opt
                  ? 'border-blue-900 bg-blue-900 text-white shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Radio
                {...register('finance.eligibilityVerified')}
                value={opt}
                label={opt === 'Yes' ? 'Yes (ผ่านคุณสมบัติ)' : 'No (ไม่ผ่าน / รอตรวจสอบ)'}
                checked={eligibility === opt}
              />
            </label>
          ))}
        </div>

        <Input
          label="Eligibility Remarks (หมายเหตุการตรวจสอบคุณสมบัติ)"
          placeholder="e.g. Verified educational background and age qualification."
          {...register('finance.eligibilityRemarks')}
        />
      </div>

      {/* REMARKS / SPECIAL CONDITIONS */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          REMARKS / SPECIAL CONDITIONS (ข้อตกลงและเงื่อนไขพิเศษ):
        </label>
        <Textarea
          rows={4}
          placeholder="Enter special flight conditions, payment schedules, penalty policies, or customized training requirements..."
          {...register('finance.remarks')}
        />
      </div>
    </div>
  );
};
