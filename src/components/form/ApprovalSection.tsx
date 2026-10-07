import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CustomerTrainingFormData } from '../../schemas/customerTrainingSchema';
import { Input } from '../ui/Input';
import { SignaturePad } from '../ui/SignaturePad';
import { ShieldCheck, UserCheck, Calendar } from 'lucide-react';

interface ApprovalSectionProps {
  register: UseFormRegister<CustomerTrainingFormData>;
  errors: FieldErrors<CustomerTrainingFormData>;
  watch: UseFormWatch<CustomerTrainingFormData>;
  setValue: UseFormSetValue<CustomerTrainingFormData>;
}

export const ApprovalSection: React.FC<ApprovalSectionProps> = ({
  register,
  watch,
  setValue,
}) => {
  const signature = watch('approval.signature');
  const salesOfficer = watch('approval.salesOfficer');

  const handleSignatureChange = (dataUrl: string) => {
    setValue('approval.signature', dataUrl, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-800" />
          SECTION J – APPROVAL &amp; SIGNATURE
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Sales Authority Authorization &amp; Officer Verification Signature
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approved By (Sales Mgr/Dir) */}
        <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <UserCheck className="w-4 h-4 text-blue-800" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Management Authorization
            </h4>
          </div>

          <Input
            label="Approved by (Sales Mgr/Dir) (ผู้อนุมัติ)"
            placeholder="e.g. Capt. Somchai Prasert (Sales Director)"
            {...register('approval.approvedBy')}
          />

          <Input
            label="Approval Date (วันที่อนุมัติ)"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            {...register('approval.approvalDate')}
          />
        </div>

        {/* Sales Officer */}
        <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <UserCheck className="w-4 h-4 text-blue-800" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Sales Officer In-Charge
            </h4>
          </div>

          <Input
            label="Sales Officer (เจ้าหน้าที่ฝ่ายขายผู้รับเรื่อง)"
            placeholder="e.g. Napasorn Wongsuwan"
            {...register('approval.salesOfficer')}
          />

          <Input
            label="Date (วันที่บันทึก)"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            {...register('approval.salesOfficerDate')}
          />
        </div>
      </div>

      {/* DIGITAL SIGNATURE CANVAS */}
      <div className="pt-2">
        <SignaturePad
          value={signature}
          onChange={handleSignatureChange}
          title="Sales Officer / Representative Digital Signature"
          signeeName={salesOfficer || 'Representative'}
        />
        <p className="text-[11px] text-slate-500 mt-2">
          This signature will be directly embedded into official PDF and Microsoft Word (.docx) exports.
        </p>
      </div>
    </div>
  );
};
