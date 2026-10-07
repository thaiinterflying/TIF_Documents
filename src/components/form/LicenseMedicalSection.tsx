import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CustomerTrainingFormData } from '../../schemas/customerTrainingSchema';
import { Input } from '../ui/Input';
import { Award, Clock, HeartPulse } from 'lucide-react';

interface LicenseMedicalSectionProps {
  register: UseFormRegister<CustomerTrainingFormData>;
  errors: FieldErrors<CustomerTrainingFormData>;
  watch: UseFormWatch<CustomerTrainingFormData>;
  setValue: UseFormSetValue<CustomerTrainingFormData>;
}

const LICENSES = ['None', 'Student', 'PPL', 'CPL', 'ATPL Theory', 'Other'];
const RATINGS = ['SEP', 'MEP', 'IR', 'Other'];
const MEDICAL_CLASSES = ['Class 1', 'Class 2', "Don't have"];

export const LicenseMedicalSection: React.FC<LicenseMedicalSectionProps> = ({
  register,
  watch,
  setValue,
}) => {
  const currentLicense = watch('licenseMedical.currentLicense');
  const ratingsHeld = watch('licenseMedical.ratingsHeld') || [];
  const medicalClass = watch('licenseMedical.medical');

  const toggleRating = (r: string) => {
    if (ratingsHeld.includes(r)) {
      setValue(
        'licenseMedical.ratingsHeld',
        ratingsHeld.filter((item) => item !== r),
        { shouldValidate: true }
      );
    } else {
      setValue('licenseMedical.ratingsHeld', [...ratingsHeld, r], { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-800" />
          SECTION D – LICENSE &amp; MEDICAL
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Pilot Qualifications, Aeronautical Experience, and Aviation Medical Status
        </p>
      </div>

      {/* CURRENT LICENSE */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Current License (ใบอนุญาตนักบินปัจจุบัน):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {LICENSES.map((lic) => {
            const isSelected = currentLicense === lic;
            return (
              <button
                type="button"
                key={lic}
                onClick={() => setValue('licenseMedical.currentLicense', lic, { shouldValidate: true })}
                className={`px-3 py-2.5 rounded-lg border text-xs font-semibold text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'border-blue-900 bg-blue-900 text-white shadow-xs font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{lic}</span>
              </button>
            );
          })}
        </div>

        {currentLicense === 'Other' && (
          <div className="pt-2 animate-in fade-in">
            <Input
              label="Other License (ระบุใบอนุญาตอื่น)"
              placeholder="e.g. Glider / Drone / Foreign ICAO License"
              {...register('licenseMedical.otherLicense')}
            />
          </div>
        )}
      </div>

      {/* RATINGS HELD & TOTAL FLIGHT TIME */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ratings held */}
        <div className="md:col-span-2 bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Ratings held (ศักยการบินที่ถือครอง):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {RATINGS.map((rating) => {
              const isChecked = ratingsHeld.includes(rating);
              return (
                <div
                  key={rating}
                  onClick={() => toggleRating(rating)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer select-none ${
                    isChecked
                      ? 'border-blue-900 bg-blue-50/80 text-blue-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleRating(rating)}
                    className="w-4 h-4 rounded text-blue-900 border-slate-300 pointer-events-none accent-blue-900"
                  />
                  <span>{rating}</span>
                </div>
              );
            })}
          </div>

          {ratingsHeld.includes('Other') && (
            <div className="pt-2 animate-in fade-in">
              <Input
                label="Other Rating (ระบุศักยการบินอื่น)"
                placeholder="e.g. Night Rating / FI / Tailwheel"
                {...register('licenseMedical.otherRating')}
              />
            </div>
          )}
        </div>

        {/* Total Flight Time */}
        <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-800" /> Total Flight Time (ชั่วโมงบินรวม)
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="0.0"
              rightAddon="hrs"
              {...register('licenseMedical.totalFlightTime', {
                valueAsNumber: true,
              })}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Logged hours confirmed in official pilot logbook.
          </p>
        </div>
      </div>

      {/* MEDICAL INFORMATION */}
      <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-600" />
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Medical Examination (ใบสำคัญแพทย์เวชศาสตร์การบิน)
          </h4>
        </div>

        {/* Medical Class Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Medical:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MEDICAL_CLASSES.map((med) => {
              const isSelected = medicalClass === med;
              return (
                <button
                  type="button"
                  key={med}
                  onClick={() => setValue('licenseMedical.medical', med, { shouldValidate: true })}
                  className={`p-3 rounded-lg border text-sm font-semibold text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'border-blue-900 bg-blue-900 text-white shadow-xs font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{med}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Issuing Authority & Expiry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <Input
            label="Issuing Authority (สถาบันที่ออกใบรับรอง)"
            placeholder="e.g. CAAT / Institute of Aviation Medicine (IAM RTAF) / Bangkok Hospital"
            {...register('licenseMedical.issuingAuthority')}
          />

          <Input
            label="Expiry (วันหมดอายุ)"
            type="date"
            {...register('licenseMedical.expiry')}
          />
        </div>

        {/* Underlying disease / Remarks */}
        <Input
          label="Underlying disease / Remarks (โรคประจำตัว / ข้อจำกัดทางการแพทย์)"
          placeholder="e.g. None / Mild myopia (glasses required for flight)"
          {...register('licenseMedical.underlyingDiseaseRemarks')}
        />

        {/* Drug Allergy & Food Allergy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Drug allergy (ประวัติแพ้ยา)"
            placeholder="e.g. None / Penicillin / Aspirin"
            {...register('licenseMedical.drugAllergy')}
          />

          <Input
            label="Food allergy (ประวัติแพ้อาหาร)"
            placeholder="e.g. None / Seafood / Peanut"
            {...register('licenseMedical.foodAllergy')}
          />
        </div>
      </div>
    </div>
  );
};
