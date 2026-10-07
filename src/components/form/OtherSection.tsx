import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CustomerTrainingFormData } from '../../schemas/customerTrainingSchema';
import { Textarea } from '../ui/Textarea';
import { Sparkles, Home, Utensils, Car, FileBadge, CheckCircle } from 'lucide-react';

interface OtherSectionProps {
  register: UseFormRegister<CustomerTrainingFormData>;
  errors: FieldErrors<CustomerTrainingFormData>;
  watch: UseFormWatch<CustomerTrainingFormData>;
  setValue: UseFormSetValue<CustomerTrainingFormData>;
}

interface ServiceOption {
  key: keyof CustomerTrainingFormData['otherServices'];
  label: string;
  subLabel: string;
  icon: React.ReactNode;
}

const SERVICES: ServiceOption[] = [
  { key: 'accommodation', label: 'Accommodation', subLabel: 'ที่พัก', icon: <Home className="w-4 h-4" /> },
  { key: 'meals', label: 'Meals', subLabel: 'อาหาร', icon: <Utensils className="w-4 h-4" /> },
  { key: 'transportation', label: 'Transportation', subLabel: 'การเดินทางรับ-ส่ง', icon: <Car className="w-4 h-4" /> },
  { key: 'visaFee', label: 'Visa fee', subLabel: 'ค่าธรรมเนียมวีซ่า', icon: <FileBadge className="w-4 h-4" /> },
  { key: 'examFee', label: 'Exam fee', subLabel: 'ค่าธรรมเนียมสอบ', icon: <CheckCircle className="w-4 h-4" /> },
];

export const OtherSection: React.FC<OtherSectionProps> = ({
  register,
  watch,
  setValue,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-800" />
          SECTION F – OTHER (Additional Service Options)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Student accommodations, logistics, exam fees, and additional aviation support
        </p>
      </div>

      {/* SERVICE OPTIONS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((srv) => {
          const val = watch(`otherServices.${srv.key}` as any);
          return (
            <div
              key={srv.key}
              className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-100/60 text-blue-900">
                  {srv.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{srv.label}</h4>
                  <p className="text-[11px] text-slate-500">{srv.subLabel}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {['Included', 'Not Included'].map((opt) => {
                  const isSelected = val === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() =>
                        setValue(`otherServices.${srv.key}` as any, opt, { shouldValidate: true })
                      }
                      className={`py-2 px-2.5 rounded-lg border text-xs font-semibold text-center transition cursor-pointer ${
                        isSelected
                          ? opt === 'Included'
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-2xs font-bold'
                            : 'border-slate-700 bg-slate-700 text-white shadow-2xs font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* OTHER ITEMS / SUPPORT */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Other items / support (รายการสนับสนุนหรืออุปกรณ์อื่นๆ):
        </label>
        <Textarea
          rows={3}
          placeholder="e.g. Flight headset, uniform kit, student pilot bag, navigation plotter, training manual package..."
          {...register('otherServices.otherSupport')}
        />
        <p className="text-[11px] text-slate-500">
          This field appears on Page 2 of the official Thai Inter Flying tracking form.
        </p>
      </div>
    </div>
  );
};
