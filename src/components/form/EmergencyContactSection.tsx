import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CustomerTrainingFormData } from '../../schemas/customerTrainingSchema';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { PhoneCall, AlertCircle } from 'lucide-react';

interface EmergencyContactSectionProps {
  register: UseFormRegister<CustomerTrainingFormData>;
  errors: FieldErrors<CustomerTrainingFormData>;
}

export const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-blue-800" />
          SECTION C – EMERGENCY CONTACT (บุคคลที่ติดต่อได้ ในกรณีฉุกเฉิน)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Emergency contact details for urgent operational or medical notifications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Name */}
        <Input
          label="Name (ชื่อ-นามสกุล ผู้ติดต่อ)"
          placeholder="e.g. Somchai Wongsuwan"
          {...register('emergencyContact.name')}
          error={errors.emergencyContact?.name?.message}
        />

        {/* Relationship */}
        <Input
          label="Relationship (ความสัมพันธ์)"
          placeholder="e.g. Father / Mother / Spouse / Guardian"
          {...register('emergencyContact.relationship')}
          error={errors.emergencyContact?.relationship?.message}
        />

        {/* Phone */}
        <Input
          label="Phone (เบอร์โทรศัพท์ติดต่อ)"
          placeholder="e.g. 089-999-8888"
          {...register('emergencyContact.phone')}
          error={errors.emergencyContact?.phone?.message}
        />

        {/* Email */}
        <Input
          label="Email (อีเมล)"
          type="email"
          placeholder="e.g. contact@example.com"
          {...register('emergencyContact.email')}
          error={errors.emergencyContact?.email?.message}
        />
      </div>

      {/* Address */}
      <div>
        <Textarea
          label="Address (ที่อยู่ของผู้ติดต่อ)"
          rows={2}
          placeholder="e.g. Same as student / 88/12 Sukhumvit Road..."
          {...register('emergencyContact.address')}
        />
      </div>

      {/* Additional contact (optional) */}
      <div>
        <Input
          label="Additional contact (optional) (ช่องทางติดต่อเพิ่มเติม เช่น ญาติสำรอง, โทรศัพท์ที่ทำงาน)"
          placeholder="e.g. Second contact person, work phone, or alternative relative..."
          {...register('emergencyContact.additionalContact')}
        />
      </div>

      <div className="text-xs text-amber-800 bg-amber-50/80 p-3 rounded-lg border border-amber-200 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Aviation Protocol:</strong> In case of flight training emergencies or urgent schedule changes, dispatch and ground safety officers will contact this person immediately.
        </span>
      </div>
    </div>
  );
};
