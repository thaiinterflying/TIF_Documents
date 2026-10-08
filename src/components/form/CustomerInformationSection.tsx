import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CustomerTrainingFormData } from '../../schemas/customerTrainingSchema';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { User, RefreshCw, Hash, Users, Building, ShieldCheck } from 'lucide-react';
import { generateTrackingNo } from '../../utils/defaultValues';

interface CustomerInformationSectionProps {
  register: UseFormRegister<CustomerTrainingFormData>;
  errors: FieldErrors<CustomerTrainingFormData>;
  watch: UseFormWatch<CustomerTrainingFormData>;
  setValue: UseFormSetValue<CustomerTrainingFormData>;
}

export const CustomerInformationSection: React.FC<CustomerInformationSectionProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const customerType = watch('customer.customerType');

  const handleRegenerateTrackingNo = () => {
    const newNo = generateTrackingNo();
    setValue('customer.trackingNo', newNo, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-800" />
            SECTION B – CUSTOMER INFORMATION
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            General Student / Client Profile &amp; Document Registration
          </p>
        </div>
      </div>

      {/* TOP TRACKING & CUSTOMER TYPE BANNER (As in Document Header Box) */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-xl p-5 border border-blue-900/60 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Tracking No */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-amber-400" /> Tracking No. <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleRegenerateTrackingNo}
                className="text-[11px] text-blue-200 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/20 px-2 py-0.5 rounded transition cursor-pointer font-medium"
                title="Generate new ID"
              >
                <RefreshCw className="w-3 h-3" /> Auto Gen
              </button>
            </div>
            <input
              {...register('customer.trackingNo')}
              className={`w-full font-mono text-base font-bold px-3 py-2 rounded-lg bg-white/10 border text-white placeholder-blue-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 ${
                errors.customer?.trackingNo ? 'border-red-500 bg-red-950/40' : 'border-white/20'
              }`}
              placeholder="e.g. TIF-2026-001"
            />
            {errors.customer?.trackingNo && (
              <p className="text-xs text-red-400 mt-1 font-medium">{errors.customer.trackingNo.message}</p>
            )}
          </div>

          {/* Joining Batch */}
          <div>
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              Joining Batch
            </label>
            <input
              {...register('customer.joiningBatch')}
              className="w-full text-sm font-semibold px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Batch 2026/01"
            />
          </div>

          {/* Customer Type summary */}
          <div>
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              Customer Classification
            </label>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-semibold text-white w-full">
              <Users className="w-4 h-4 text-blue-200" />
              <span>{customerType || 'Individual'}</span>
            </div>
          </div>
        </div>

        {/* CUSTOMER TYPE SELECTION CARDS */}
        <div className="mt-4 pt-3.5 border-t border-white/10">
          <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">
            Customer Type <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Individual', label: 'Individual' },
              { id: 'Group', label: 'Group' },
              { id: 'Corporate', label: 'Corporate' },
              { id: 'Agency', label: 'Agency' },
            ].map((type) => {
              const isSelected = customerType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setValue('customer.customerType', type.id, { shouldValidate: true })}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm font-bold'
                      : 'bg-white/5 text-blue-100 border-white/15 hover:bg-white/15'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-slate-950 bg-slate-950' : 'border-white/40'}`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </span>
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Conditional Corporate Name */}
          {customerType === 'Corporate' && (
            <div className="mt-3.5 p-3 rounded-lg bg-white/10 border border-white/20 animate-in fade-in">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Building className="w-4 h-4" /> Corporate Name (ชื่อองค์กร / บริษัท)
              </label>
              <input
                {...register('customer.corporateName')}
                placeholder="Enter company or corporate sponsor name..."
                className="w-full text-sm px-3 py-2 rounded-lg bg-white/90 text-slate-900 border border-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
            </div>
          )}

          {/* Conditional Agency Name */}
          {customerType === 'Agency' && (
            <div className="mt-3.5 p-3 rounded-lg bg-white/10 border border-white/20 animate-in fade-in">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Agency Name (ชื่อเอเจนซี่ / ตัวแทน)
              </label>
              <input
                {...register('customer.agencyName')}
                placeholder="Enter agency or recruitment partner name..."
                className="w-full text-sm px-3 py-2 rounded-lg bg-white/90 text-slate-900 border border-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
            </div>
          )}
        </div>
      </div>

      {/* DETAILED CUSTOMER INFORMATION FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <Input
          label="Full Name (ชื่อ-นามสกุล)"
          requiredStar
          placeholder="e.g. Thanaphat Wongsuwan"
          {...register('customer.fullName')}
          error={errors.customer?.fullName?.message}
        />

        {/* Nickname */}
        <Input
          label="Nickname (ชื่อเล่น)"
          placeholder="e.g. Pat"
          {...register('customer.nickname')}
        />

        {/* Date of Birth */}
        <Input
          label="Date of Birth (วันเกิด)"
          type="date"
          {...register('customer.dateOfBirth')}
        />

        {/* Nationality */}
        <Input
          label="Nationality (สัญชาติ)"
          placeholder="e.g. Thai"
          {...register('customer.nationality')}
        />

        {/* ID / Passport No. */}
        <Input
          label="ID / Passport No. (เลขบัตรประชาชน / หนังสือเดินทาง)"
          placeholder="e.g. 1-1005-00123-45-6"
          {...register('customer.idPassportNo')}
        />

        {/* Phone */}
        <Input
          label="Phone (เบอร์โทรศัพท์)"
          requiredStar
          placeholder="e.g. 081-234-5678"
          {...register('customer.phone')}
          error={errors.customer?.phone?.message}
        />

        {/* Email */}
        <Input
          label="Email (อีเมล)"
          requiredStar
          type="email"
          placeholder="e.g. pilot@example.com"
          {...register('customer.email')}
          error={errors.customer?.email?.message}
        />

        {/* Line / WeChat */}
        <Input
          label="Line / WeChat ID"
          placeholder="e.g. pilot_tif"
          {...register('customer.lineWechat')}
        />
      </div>

      {/* Address */}
      <div>
        <Textarea
          label="Address (ที่อยู่ปัจจุบัน)"
          rows={2}
          placeholder="e.g. 123/45 Vibhavadi Rangsit Rd, Don Mueang, Bangkok 10210"
          {...register('customer.address')}
        />
      </div>
    </div>
  );
};
