import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CustomerTrainingFormData } from '../../schemas/customerTrainingSchema';
import { Radio } from '../ui/Radio';
import { Send, Building2 } from 'lucide-react';

interface DistributionSectionProps {
  register: UseFormRegister<CustomerTrainingFormData>;
  errors: FieldErrors<CustomerTrainingFormData>;
  watch: UseFormWatch<CustomerTrainingFormData>;
  setValue: UseFormSetValue<CustomerTrainingFormData>;
}

const DEPARTMENTS = [
  'Operation',
  'Finance',
  'Training',
  'Standard/Compliance',
  'Management',
];

export const DistributionSection: React.FC<DistributionSectionProps> = ({
  register,
  watch,
  setValue,
}) => {
  const currentSendTo = watch('distribution.sendTo') || [];
  const currentStatus = watch('distribution.customerStatus');

  const toggleDept = (dept: string) => {
    if (currentSendTo.includes(dept)) {
      setValue(
        'distribution.sendTo',
        currentSendTo.filter((d) => d !== dept),
        { shouldValidate: true }
      );
    } else {
      setValue('distribution.sendTo', [...currentSendTo, dept], { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-800" />
          SECTION A – DISTRIBUTION
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Sales controls &amp; sends to departments (ฝ่ายขายบันทึกและส่งต่อไปยังแผนกต่างๆ)
        </p>
      </div>

      {/* Send To Departments */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Send to (ส่งถึงแผนก):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {DEPARTMENTS.map((dept) => {
            const isChecked = currentSendTo.includes(dept);
            return (
              <div
                key={dept}
                onClick={() => toggleDept(dept)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'border-blue-900 bg-blue-50/80 text-blue-950 shadow-2xs font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDept(dept)}
                  className="w-4 h-4 rounded text-blue-900 border-slate-300 focus:ring-blue-700 pointer-events-none accent-blue-900"
                />
                <span className="text-xs sm:text-sm">{dept}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Status */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Customer status (สถานะลูกค้า):
        </label>
        <div className="flex flex-wrap gap-4">
          <label
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm cursor-pointer transition-all ${
              currentStatus === 'Fulltime'
                ? 'border-blue-900 bg-blue-50/80 text-blue-950 font-semibold shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Radio
              {...register('distribution.customerStatus')}
              value="Fulltime"
              label="Fulltime"
              checked={currentStatus === 'Fulltime'}
            />
          </label>

          <label
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm cursor-pointer transition-all ${
              currentStatus === 'Part Time'
                ? 'border-blue-900 bg-blue-50/80 text-blue-950 font-semibold shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Radio
              {...register('distribution.customerStatus')}
              value="Part Time"
              label="Part Time"
              checked={currentStatus === 'Part Time'}
            />
          </label>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
        <Building2 className="w-4 h-4 text-blue-800 shrink-0" />
        <span>
          Information in this section directs workflow notifications across flight operations, finance, and training facilities.
        </span>
      </div>
    </div>
  );
};
