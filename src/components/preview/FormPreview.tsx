import React from 'react';
import { CustomerTrainingForm } from '../../types/customerTraining';
import { formatCurrency, formatDateDisplay } from '../../utils/calculations';
import { LOGO_BASE64 } from '../../assets/logoBase64';

interface FormPreviewProps {
  data: CustomerTrainingForm;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ data }) => {
  // Helper for rendering checkboxes exactly as in the original form
  const renderCheck = (checked: boolean, label: string, extra?: string | React.ReactNode) => (
    <span className="inline-flex items-center gap-1 mr-3 whitespace-nowrap text-[12px] leading-tight">
      <span className="inline-block w-3.5 h-3.5 border border-black text-[10px] leading-[13px] text-center font-bold font-mono bg-white select-none">
        {checked ? '✓' : ''}
      </span>
      <span className={checked ? 'font-semibold text-black' : 'text-slate-800'}>
        {label}
      </span>
      {extra && <span className="text-slate-700">{extra}</span>}
    </span>
  );

  const formatMoney = (val: number | string | null | undefined) => {
    if (val === null || val === undefined || val === '') return '';
    return formatCurrency(val);
  };

  const finalCalc =
    typeof data.finance.finalPrice === 'number'
      ? data.finance.finalPrice
      : (Number(data.finance.totalPrice) || 0) - (Number(data.finance.discount) || 0);

  // Reusable Top Header Block (Present on both Page 1 and Page 2)
  const renderHeaderBox = () => (
    <div className="border border-black grid grid-cols-12 text-[12px] leading-snug">
      {/* Left Column: Logo Only */}
      <div className="col-span-4 border-r border-black p-2 flex items-center justify-center bg-white min-h-[90px]">
        <img src={LOGO_BASE64} alt="THAI INTER FLYING" className="h-16 max-w-full object-contain" />
      </div>


      {/* Right Column: Title and Tracking Grid */}
      <div className="col-span-8 flex flex-col justify-between">
        {/* Title */}
        <div className="border-b border-black py-1.5 px-2 text-center">
          <h2 className="text-[14px] font-bold tracking-normal text-black uppercase m-0">
            CUSTOMER TRAINING ORDER &amp; TRACKING FORM
          </h2>
        </div>

        {/* Tracking No & Customer Type Grid */}
        <div className="grid grid-cols-12 border-b border-black flex-1">
          {/* Tracking & Customer Type Labels */}
          <div className="col-span-5 border-r border-black p-1.5 flex flex-col justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold whitespace-nowrap">Tracking No:</span>
              <span className="font-mono font-bold text-slate-950 underline decoration-dotted">
                {data.customer.trackingNo || ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="font-bold whitespace-nowrap">Customer Type:</span>
            </div>
          </div>

          {/* Customer Type Checkboxes */}
          <div className="col-span-7 p-1.5 flex flex-col justify-between">
            <div className="flex flex-wrap items-center">
              {renderCheck(data.customer.customerType === 'Individual', 'Individual')}
              {renderCheck(data.customer.customerType === 'Group', 'Group')}
              {renderCheck(
                data.customer.customerType === 'Corporate',
                'Corporate',
                data.customer.corporateName ? ` ${data.customer.corporateName}` : '...................'
              )}
            </div>
            <div className="flex items-center mt-1">
              {renderCheck(
                data.customer.customerType === 'Agency',
                'Agency',
                data.customer.agencyName ? ` ${data.customer.agencyName}` : '...................'
              )}
            </div>
          </div>
        </div>

        {/* Joining Batch */}
        <div className="p-1.5 flex items-center gap-2">
          <span className="font-bold whitespace-nowrap">Joining Batch:</span>
          <span className="font-medium text-slate-950">
            {data.customer.joiningBatch || ''}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 select-text text-black font-sans">
      {/* ======================================================== */}
      {/*                      PAGE 1                              */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-400 shadow-xl p-8 sm:p-12 max-w-[820px] mx-auto min-h-[1120px] flex flex-col justify-between print:shadow-none print:border-none print:p-0 page-break">

        <div>
          {/* Outer Border wrapping all page 1 content */}
          <div className="border border-black">
            {/* Header Box */}
            {renderHeaderBox()}

            {/* SECTION A – DISTRIBUTION */}
            <div className="border-t border-black text-[12px]">
              <div className="bg-slate-200/80 font-bold px-2 py-0.5 border-b border-black text-black">
                SECTION A – DISTRIBUTION (Sales controls &amp; sends to departments)
              </div>
              <div className="p-1.5 space-y-1">
                <div className="flex flex-wrap items-center">
                  <span className="font-bold mr-2 whitespace-nowrap">Send to:</span>
                  {['Operation', 'Finance', 'Training', 'Standard/Compliance', 'Management'].map((d) =>
                    renderCheck((data.distribution.sendTo || []).includes(d), d)
                  )}
                </div>
                <div className="flex items-center pt-0.5 border-t border-slate-300">
                  <span className="font-bold mr-2 whitespace-nowrap">Customer status:</span>
                  {renderCheck(data.distribution.customerStatus === 'Fulltime', 'Fulltime')}
                  {renderCheck(data.distribution.customerStatus === 'Part Time', 'Part Time')}
                </div>
              </div>
            </div>

            {/* SECTION B – CUSTOMER INFORMATION */}
            <div className="border-t border-black text-[12px]">
              <div className="bg-slate-200/80 font-bold px-2 py-0.5 border-b border-black text-black">
                SECTION B – CUSTOMER INFORMATION
              </div>
              <div className="divide-y divide-black">
                {/* Full Name & Nickname */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-7 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Full Name:</span>
                    <span className="font-medium text-slate-950">{data.customer.fullName || ''}</span>
                  </div>
                  <div className="col-span-5 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Nickname:</span>
                    <span className="font-medium text-slate-950">{data.customer.nickname || ''}</span>
                  </div>
                </div>

                {/* Date of Birth & Nationality */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-7 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Date of Birth:</span>
                    <span className="font-medium text-slate-950">
                      {formatDateDisplay(data.customer.dateOfBirth)}
                    </span>
                  </div>
                  <div className="col-span-5 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Nationality:</span>
                    <span className="font-medium text-slate-950">{data.customer.nationality || ''}</span>
                  </div>
                </div>

                {/* ID/Passport No & Phone */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-7 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">ID/Passport No:</span>
                    <span className="font-medium text-slate-950 font-mono">
                      {data.customer.idPassportNo || ''}
                    </span>
                  </div>
                  <div className="col-span-5 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Phone:</span>
                    <span className="font-medium text-slate-950">{data.customer.phone || ''}</span>
                  </div>
                </div>

                {/* Email & Line/WeChat */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-7 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Email:</span>
                    <span className="font-medium text-slate-950">{data.customer.email || ''}</span>
                  </div>
                  <div className="col-span-5 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Line/WeChat:</span>
                    <span className="font-medium text-slate-950">{data.customer.lineWechat || ''}</span>
                  </div>
                </div>

                {/* Address (Full row) */}
                <div className="p-1.5 flex items-center">
                  <span className="font-bold mr-1.5 whitespace-nowrap">Address:</span>
                  <span className="font-medium text-slate-950">{data.customer.address || ''}</span>
                </div>
              </div>
            </div>

            {/* SECTION C – EMERGENCY CONTACT */}
            <div className="border-t border-black text-[12px]">
              <div className="bg-slate-200/80 font-bold px-2 py-0.5 border-b border-black text-black">
                SECTION C – EMERGENCY CONTACT (บุคคลที่ติดต่อได้ ในกรณีฉุกเฉิน )
              </div>
              <div className="divide-y divide-black">
                {/* Name & Phone */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-7 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Name:</span>
                    <span className="font-medium text-slate-950">{data.emergencyContact.name || ''}</span>
                  </div>
                  <div className="col-span-5 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Phone:</span>
                    <span className="font-medium text-slate-950">{data.emergencyContact.phone || ''}</span>
                  </div>
                </div>

                {/* Relationship & Email */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-7 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Relationship:</span>
                    <span className="font-medium text-slate-950">
                      {data.emergencyContact.relationship || ''}
                    </span>
                  </div>
                  <div className="col-span-5 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Email:</span>
                    <span className="font-medium text-slate-950">{data.emergencyContact.email || ''}</span>
                  </div>
                </div>

                {/* Additional Contact */}
                <div className="p-1.5 flex items-center">
                  <span className="font-bold mr-1.5 whitespace-nowrap">
                    Additional contact (optional):
                  </span>
                  <span className="font-medium text-slate-950 flex-1 border-b border-dotted border-black/40 pb-0.5">
                    {data.emergencyContact.additionalContact || ''}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION D – LICENSE & MEDICAL */}
            <div className="border-t border-black text-[12px]">
              <div className="bg-slate-200/80 font-bold px-2 py-0.5 border-b border-black text-black">
                SECTION D – LICENSE &amp; MEDICAL
              </div>
              <div className="divide-y divide-black">
                {/* Current License */}
                <div className="p-1.5 flex flex-wrap items-center">
                  <span className="font-bold mr-2 whitespace-nowrap">Current License:</span>
                  {['None', 'Student', 'PPL', 'CPL', 'ATPL Theory'].map((lic) =>
                    renderCheck(data.licenseMedical.currentLicense === lic, lic)
                  )}
                  {renderCheck(
                    data.licenseMedical.currentLicense === 'Other',
                    'Other:',
                    data.licenseMedical.otherLicense
                      ? ` ${data.licenseMedical.otherLicense}`
                      : ' ________'
                  )}
                </div>

                {/* Ratings held & Total Flight Time */}
                <div className="p-1.5 flex flex-wrap items-center justify-between">
                  <div className="flex flex-wrap items-center">
                    <span className="font-bold mr-2 whitespace-nowrap">Ratings held:</span>
                    {['SEP', 'MEP', 'IR'].map((r) =>
                      renderCheck((data.licenseMedical.ratingsHeld || []).includes(r), r)
                    )}
                    {renderCheck(
                      (data.licenseMedical.ratingsHeld || []).includes('Other'),
                      'Other:',
                      data.licenseMedical.otherRating
                        ? ` ${data.licenseMedical.otherRating}`
                        : ' ________'
                    )}
                  </div>
                  <div className="flex items-center whitespace-nowrap">
                    <span className="font-bold mr-1">Total Flight Time:</span>
                    <span className="border-b border-black px-2 min-w-[50px] text-center font-mono font-bold">
                      {data.licenseMedical.totalFlightTime !== '' &&
                      data.licenseMedical.totalFlightTime !== null
                        ? data.licenseMedical.totalFlightTime
                        : ''}
                    </span>
                    <span className="ml-1 font-bold">hrs</span>
                  </div>
                </div>

                {/* Medical, Issuing Authority, Expiry */}
                <div className="p-1.5 flex flex-wrap items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-bold mr-2 whitespace-nowrap">Medical:</span>
                    {['Class 1', 'Class 2', "Don't have"].map((m) =>
                      renderCheck(data.licenseMedical.medical === m, m)
                    )}
                  </div>
                  <div className="flex items-center whitespace-nowrap">
                    <span className="font-bold mr-1">Issuing Authority:</span>
                    <span className="border-b border-black px-2 min-w-[80px] text-center font-medium">
                      {data.licenseMedical.issuingAuthority || ''}
                    </span>
                  </div>
                  <div className="flex items-center whitespace-nowrap">
                    <span className="font-bold mr-1">Expiry:</span>
                    <span className="border-b border-black px-2 min-w-[80px] text-center font-medium">
                      {formatDateDisplay(data.licenseMedical.expiry)}
                    </span>
                  </div>
                </div>

                {/* Underlying disease / Remarks */}
                <div className="p-1.5 flex items-center">
                  <span className="font-bold mr-1.5 whitespace-nowrap">
                    Underlying disease/Remarks:
                  </span>
                  <span className="font-medium text-slate-950 flex-1">
                    {data.licenseMedical.underlyingDiseaseRemarks || ''}
                  </span>
                </div>

                {/* Drug allergy & Food allergy */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-7 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Drug allergy:</span>
                    <span className="font-medium text-slate-950">{data.licenseMedical.drugAllergy || ''}</span>
                  </div>
                  <div className="col-span-5 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Food allergy:</span>
                    <span className="font-medium text-slate-950">{data.licenseMedical.foodAllergy || ''}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION E – COURSE ORDER DETAILS */}
            <div className="border-t border-black text-[12px]">
              <div className="bg-slate-200/80 font-bold px-2 py-0.5 border-b border-black text-black">
                SECTION E – COURSE ORDER DETAILS (for Sales / Operation / Standard)
              </div>
              <div className="divide-y divide-black">
                {/* Course Ordered Checkboxes */}
                <div className="p-1.5">
                  <div className="font-bold mb-1">Course ordered:</div>
                  <div className="flex flex-wrap items-center gap-y-1">
                    {[
                      'PPL',
                      'CPL/IR Integrated + ATP',
                      'IR',
                      'ME',
                      'ATP',
                      'Conversion TCAR',
                      'Recurrent',
                      'Type Rating',
                    ].map((c) => renderCheck((data.courseOrder.courses || []).includes(c), c))}
                    {renderCheck(
                      (data.courseOrder.courses || []).includes('Other'),
                      'Other:',
                      data.courseOrder.otherCourse ? ` ${data.courseOrder.otherCourse}` : ' ____'
                    )}
                  </div>
                </div>

                {/* Aircraft Type & Package */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-7 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Aircraft type:</span>
                    <span className="font-medium text-slate-950">{data.courseOrder.aircraftType || ''}</span>
                  </div>
                  <div className="col-span-5 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Package:</span>
                    <span className="font-medium text-slate-950">{data.courseOrder.package || ''}</span>
                  </div>
                </div>

                {/* Preferred Start & Est Duration */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-7 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Preferred start:</span>
                    <span className="font-medium text-slate-950">
                      {formatDateDisplay(data.courseOrder.preferredStart)}
                    </span>
                  </div>
                  <div className="col-span-5 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Est. duration:</span>
                    <span className="font-medium text-slate-950">
                      {data.courseOrder.estimatedDuration || ''}
                    </span>
                  </div>
                </div>

                {/* Training Components */}
                <div className="p-1.5 flex flex-wrap items-center">
                  <span className="font-bold mr-2 whitespace-nowrap">Training components:</span>
                  {['Ground', 'Flight', 'Simulator', 'CAAT Exam', 'Skill Test', 'ICAO ELP'].map((comp) =>
                    renderCheck((data.courseOrder.trainingComponents || []).includes(comp), comp)
                  )}
                </div>

                {/* Special Requirements / Notes */}
                <div className="p-1.5 flex items-center">
                  <span className="font-bold mr-1.5 whitespace-nowrap">
                    Special requirements / notes:
                  </span>
                  <span className="font-medium text-slate-950 flex-1 border-b border-dotted border-black/40 pb-0.5">
                    {data.courseOrder.specialRequirements || ''}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION F – OTHER (Page 1 segment) */}
            <div className="border-t border-black text-[12px]">
              <div className="bg-slate-200/80 font-bold px-2 py-0.5 border-b border-black text-black">
                SECTION F – Other
              </div>
              <div className="p-1.5 flex flex-wrap items-center gap-y-1">
                <div className="flex items-center mr-2">
                  <span className="font-bold mr-1.5 whitespace-nowrap">Accommodation:</span>
                  {renderCheck(data.otherServices.accommodation === 'Included', 'Included')}
                  {renderCheck(data.otherServices.accommodation === 'Not Included', 'Not Included')}
                </div>
                <div className="flex items-center mr-2">
                  <span className="font-bold mr-1.5 whitespace-nowrap">Meals:</span>
                  {renderCheck(data.otherServices.meals === 'Included', 'Included')}
                  {renderCheck(data.otherServices.meals === 'Not Included', 'Not Included')}
                </div>
                <div className="flex items-center mr-2">
                  <span className="font-bold mr-1.5 whitespace-nowrap">Transportation:</span>
                  {renderCheck(data.otherServices.transportation === 'Included', 'Included')}
                  {renderCheck(data.otherServices.transportation === 'Not Included', 'Not Included')}
                </div>
                <div className="flex items-center mr-2">
                  <span className="font-bold mr-1.5 whitespace-nowrap">Visa fee:</span>
                  {renderCheck(data.otherServices.visaFee === 'Included', 'Included')}
                  {renderCheck(data.otherServices.visaFee === 'Not Included', 'Not Included')}
                </div>
                <div className="flex items-center">
                  <span className="font-bold mr-1.5 whitespace-nowrap">Exam fee :</span>
                  {renderCheck(data.otherServices.examFee === 'Included', 'Included')}
                  {renderCheck(data.otherServices.examFee === 'Not Included', 'Not Included')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 1 FOOTER (Outside border) */}
        <div className="flex justify-between items-center text-[10px] font-mono text-black mt-3 pt-1">
          <span>F-MK-0063</span>
          <span>ISS: NO.01, REV: 01, ED: 08-MAY-26</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/*                      PAGE 2                              */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-400 shadow-xl p-8 sm:p-12 max-w-[820px] mx-auto min-h-[1120px] flex flex-col justify-between print:shadow-none print:border-none print:p-0">
        <div>
          {/* Outer Border wrapping all page 2 content */}
          <div className="border border-black">
            {/* Header Box (Identical to Page 1) */}
            {renderHeaderBox()}

            {/* Other items/support */}
            <div className="border-t border-black p-1.5 text-[12px] flex items-center">
              <span className="font-bold mr-1.5 whitespace-nowrap">Other items/support:</span>
              <span className="font-medium text-slate-950 flex-1 border-b border-dotted border-black/40 pb-0.5">
                {data.otherServices.otherSupport || ''}
              </span>
            </div>

            {/* SECTION G – FINANCE (tracking) */}
            <div className="border-t border-black text-[12px]">
              <div className="bg-slate-200/80 font-bold px-2 py-0.5 border-b border-black text-black">
                SECTION G – FINANCE (tracking)
              </div>
              <div className="divide-y divide-black">
                {/* Total price, Discount, Final */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-4 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Total price (THB):</span>
                    <span className="font-mono font-semibold text-slate-950">
                      {formatMoney(data.finance.totalPrice)}
                    </span>
                  </div>
                  <div className="col-span-4 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Discount:</span>
                    <span className="font-mono font-semibold text-slate-950">
                      {formatMoney(data.finance.discount)}
                    </span>
                  </div>
                  <div className="col-span-4 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Final:</span>
                    <span className="font-mono font-bold text-slate-950">
                      {finalCalc ? `${formatCurrency(finalCalc)} THB` : ''}
                    </span>
                  </div>
                </div>

                {/* Deposit required, Deposit received, Yes/No Checkboxes */}
                <div className="grid grid-cols-12 divide-x divide-black">
                  <div className="col-span-4 p-1.5 flex items-center">
                    <span className="font-bold whitespace-nowrap">Deposit required:</span>
                  </div>
                  <div className="col-span-4 p-1.5 flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Deposit received:</span>
                    <span className="font-mono font-medium text-slate-950">
                      {data.finance.depositReceived ? `${formatMoney(data.finance.depositReceived)} THB` : ''}
                    </span>
                  </div>
                  <div className="col-span-4 p-1.5 flex items-center">
                    {renderCheck(
                      data.finance.depositRequired === 'Yes',
                      'Yes',
                      data.finance.depositDate ? ` (Date: ${formatDateDisplay(data.finance.depositDate)})` : ' (Date:____________)'
                    )}
                    {renderCheck(data.finance.depositRequired === 'No', 'No')}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-1.5 flex flex-wrap items-center">
                  <span className="font-bold mr-2 whitespace-nowrap">Payment method:</span>
                  {renderCheck((data.finance.paymentMethod || []).includes('Cash'), 'Cash')}
                  {renderCheck((data.finance.paymentMethod || []).includes('Transfer'), 'Transfer')}
                  {renderCheck(
                    (data.finance.paymentMethod || []).includes('Installments'),
                    '...........Installments',
                    data.finance.installmentDetails ? ` (${data.finance.installmentDetails})` : ''
                  )}
                  {renderCheck(
                    (data.finance.paymentMethod || []).includes('Corporate Balance'),
                    'Corporate Balance:',
                    data.finance.corporateBalance ? ` ${formatMoney(data.finance.corporateBalance)} THB` : ' __________ THB'
                  )}
                </div>

                {/* Documents */}
                <div className="p-1.5 flex flex-wrap items-center">
                  <span className="font-bold mr-2 whitespace-nowrap">Documents:</span>
                  {['ID copy', 'Medical', 'License copy', 'Logbook', 'English/ELP', 'Photos'].map((doc) =>
                    renderCheck((data.finance.documents || []).includes(doc), doc)
                  )}
                  {renderCheck(
                    (data.finance.documents || []).includes('Other'),
                    'Other:',
                    data.finance.otherDocument ? ` ${data.finance.otherDocument}` : ' ____'
                  )}
                </div>

                {/* Eligibility verified */}
                <div className="p-1.5 flex flex-wrap items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-bold mr-2 whitespace-nowrap">Eligibility verified:</span>
                    {renderCheck(data.finance.eligibilityVerified === 'Yes', 'Yes')}
                    {renderCheck(data.finance.eligibilityVerified === 'No', 'No')}
                  </div>
                  <div className="flex items-center flex-1 ml-4">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Remarks:</span>
                    <span className="font-medium text-slate-950 flex-1 border-b border-dotted border-black/40 pb-0.5">
                      {data.finance.eligibilityRemarks || ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* REMARKS / SPECIAL CONDITIONS */}
            <div className="border-t border-black text-[12px]">
              <div className="bg-slate-200/80 font-bold px-2 py-0.5 border-b border-black text-black">
                REMARKS / SPECIAL CONDITIONS
              </div>
              <div className="p-2 min-h-[140px] text-[12px] leading-relaxed whitespace-pre-wrap font-medium text-slate-900">
                {data.finance.remarks || ''}
              </div>
            </div>

            {/* SECTION J – APPROVAL & SIGNATURE */}
            <div className="border-t border-black text-[12px]">
              <div className="bg-slate-200/80 font-bold px-2 py-0.5 border-b border-black text-black">
                SECTION J – APPROVAL &amp; SIGNATURE
              </div>
              <div className="grid grid-cols-12 divide-x divide-black min-h-[90px]">
                {/* Approved by */}
                <div className="col-span-6 p-2 flex flex-col justify-between">
                  <div className="flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">
                      Approved by (Sales Mgr/Dir):
                    </span>
                    <span className="font-medium text-slate-950 flex-1 border-b border-black/60 pb-0.5">
                      {data.approval.approvedBy || ''}
                    </span>
                  </div>
                  <div className="flex items-center pt-4">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Date:</span>
                    <span className="font-medium text-slate-950 flex-1 border-b border-black/60 pb-0.5">
                      {formatDateDisplay(data.approval.approvalDate)}
                    </span>
                  </div>
                </div>

                {/* Sales Officer & Signature */}
                <div className="col-span-6 p-2 flex flex-col justify-between">
                  <div className="flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Sales Officer:</span>
                    <span className="font-medium text-slate-950 flex-1 border-b border-black/60 pb-0.5">
                      {data.approval.salesOfficer || ''}
                    </span>
                  </div>

                  {/* Digital Signature Display */}
                  <div className="my-1 flex items-center justify-center min-h-[45px]">
                    {data.approval.signature ? (
                      <img
                        src={data.approval.signature}
                        alt="Officer Signature"
                        className="max-h-12 object-contain"
                      />
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        (Signature / ลายมือชื่อ)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <span className="font-bold mr-1.5 whitespace-nowrap">Date:</span>
                    <span className="font-medium text-slate-950 flex-1 border-b border-black/60 pb-0.5">
                      {formatDateDisplay(data.approval.salesOfficerDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 2 FOOTER (Outside border) */}
        <div className="flex justify-between items-center text-[10px] font-mono text-black mt-3 pt-1">
          <span>F-MK-0063</span>
          <span>ISS: NO.01, REV: 01, ED: 08-MAY-26</span>
        </div>
      </div>
    </div>
  );
};
