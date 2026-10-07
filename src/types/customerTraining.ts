export interface DistributionInfo {
  sendTo: string[]; // 'Operation' | 'Finance' | 'Training' | 'Standard/Compliance' | 'Management'
  customerStatus: string; // 'Fulltime' | 'Part Time' | ''
}

export interface CustomerInfo {
  fullName: string;
  nickname: string;
  trackingNo: string;
  customerType: string; // 'Individual' | 'Group' | 'Corporate' | 'Agency' | ''
  corporateName: string;
  agencyName: string;
  joiningBatch: string;
  dateOfBirth: string;
  idPassportNo: string;
  email: string;
  phone: string;
  lineWechat: string;
  nationality: string;
  address: string;
}

export interface EmergencyContactInfo {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  additionalContact: string;
}

export interface LicenseMedicalInfo {
  currentLicense: string; // 'None' | 'Student' | 'PPL' | 'CPL' | 'ATPL Theory' | 'Other' | ''
  otherLicense: string;
  ratingsHeld: string[]; // 'SEP' | 'MEP' | 'IR' | 'Other'
  otherRating: string;
  totalFlightTime: number | '' | null;
  medical: string; // 'Class 1' | 'Class 2' | "Don't have" | ''
  issuingAuthority: string;
  expiry: string;
  underlyingDiseaseRemarks: string;
  drugAllergy: string;
  foodAllergy: string;
}

export interface CourseOrderInfo {
  courses: string[]; // 'PPL', 'CPL/IR Integrated + ATP', 'IR', 'ME', 'ATP', 'Conversion TCAR', 'Recurrent', 'Type Rating', 'Other'
  otherCourse: string;
  aircraftType: string;
  package: string;
  preferredStart: string;
  estimatedDuration: string;
  trainingComponents: string[]; // 'Ground' | 'Flight' | 'Simulator' | 'CAAT Exam' | 'Skill Test' | 'ICAO ELP'
  specialRequirements: string;
}

export interface OtherServicesInfo {
  accommodation: string; // 'Included' | 'Not Included' | ''
  meals: string; // 'Included' | 'Not Included' | ''
  transportation: string; // 'Included' | 'Not Included' | ''
  visaFee: string; // 'Included' | 'Not Included' | ''
  examFee: string; // 'Included' | 'Not Included' | ''
  otherSupport: string; // Other items/support
}

export interface FinanceInfo {
  totalPrice: number | '' | null;
  discount: number | '' | null;
  finalPrice: number | '' | null; // calculated
  depositRequired: 'Yes' | 'No' | '';
  depositDate: string;
  depositReceived: number | '' | null;
  paymentMethod: string[]; // 'Cash' | 'Transfer' | 'Installments' | 'Corporate Balance'
  installmentDetails: string;
  corporateBalance: number | '' | null;
  documents: string[]; // 'ID copy' | 'Medical' | 'License copy' | 'Logbook' | 'English/ELP' | 'Photos' | 'Other'
  otherDocument: string;
  eligibilityVerified: 'Yes' | 'No' | '';
  eligibilityRemarks: string;
  remarks: string; // Remarks / Special Conditions
}

export interface ApprovalInfo {
  approvedBy: string; // Sales Mgr/Dir
  approvalDate: string;
  salesOfficer: string;
  salesOfficerDate: string;
  signature: string; // Base64 data URL
}

export interface CustomerTrainingForm {
  id?: string;
  updatedAt?: string;
  distribution: DistributionInfo;
  customer: CustomerInfo;
  emergencyContact: EmergencyContactInfo;
  licenseMedical: LicenseMedicalInfo;
  courseOrder: CourseOrderInfo;
  otherServices: OtherServicesInfo;
  finance: FinanceInfo;
  approval: ApprovalInfo;
  // ClickUp Metadata
  source?: 'manual' | 'clickup';
  clickupTaskId?: string;
  clickupTaskUrl?: string;
  lastImportedAt?: string;
}


export interface FormDraftSummary {
  id: string;
  trackingNo: string;
  fullName: string;
  customerType: string;
  course: string;
  updatedAt: string;
  status: 'Draft' | 'Completed';
  formData: CustomerTrainingForm;
}
