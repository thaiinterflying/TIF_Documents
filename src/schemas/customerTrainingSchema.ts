import { z } from 'zod';

export const customerTrainingSchema = z.object({
  distribution: z.object({
    sendTo: z.array(z.string()),
    customerStatus: z.string(),
  }),

  customer: z.object({
    fullName: z.string().trim().min(1, 'Full Name is required'),
    nickname: z.string().optional(),
    trackingNo: z.string().trim().min(1, 'Tracking Number is required'),
    customerType: z.string().min(1, 'Customer Type is required'),
    corporateName: z.string().optional(),
    agencyName: z.string().optional(),
    joiningBatch: z.string().optional(),
    dateOfBirth: z.string().optional(),
    idPassportNo: z.string().optional(),
    email: z.string().trim().min(1, 'Email is required').email('Invalid email address format'),
    phone: z.string().trim().min(1, 'Phone number is required'),
    lineWechat: z.string().optional(),
    nationality: z.string().optional(),
    address: z.string().optional(),
  }),

  emergencyContact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    additionalContact: z.string().optional(),
  }),

  licenseMedical: z.object({
    currentLicense: z.string().optional(),
    otherLicense: z.string().optional(),
    ratingsHeld: z.array(z.string()),
    otherRating: z.string().optional(),
    totalFlightTime: z.union([z.number(), z.literal(''), z.null()]).optional(),
    medical: z.string().optional(),
    issuingAuthority: z.string().optional(),
    expiry: z.string().optional(),
    underlyingDiseaseRemarks: z.string().optional(),
    drugAllergy: z.string().optional(),
    foodAllergy: z.string().optional(),
  }),

  courseOrder: z.object({
    courses: z.array(z.string()).min(1, 'At least one Course Ordered must be selected'),
    otherCourse: z.string().optional(),
    aircraftType: z.string().optional(),
    package: z.string().optional(),
    preferredStart: z.string().trim().min(1, 'Preferred Start date is required'),
    estimatedDuration: z.string().optional(),
    trainingComponents: z.array(z.string()),
    specialRequirements: z.string().optional(),
  }),

  otherServices: z.object({
    accommodation: z.string().optional(),
    meals: z.string().optional(),
    transportation: z.string().optional(),
    visaFee: z.string().optional(),
    examFee: z.string().optional(),
    otherSupport: z.string().optional(),
  }),

  finance: z.object({
    totalPrice: z.union([z.number(), z.literal(''), z.null()]).optional(),
    discount: z.union([z.number(), z.literal(''), z.null()]).optional(),
    finalPrice: z.union([z.number(), z.literal(''), z.null()]).optional(),
    depositRequired: z.string().optional(),
    depositDate: z.string().optional(),
    depositReceived: z.union([z.number(), z.literal(''), z.null()]).optional(),
    paymentMethod: z.array(z.string()),
    installmentDetails: z.string().optional(),
    corporateBalance: z.union([z.number(), z.literal(''), z.null()]).optional(),
    documents: z.array(z.string()),
    otherDocument: z.string().optional(),
    eligibilityVerified: z.string().optional(),
    eligibilityRemarks: z.string().optional(),
    remarks: z.string().optional(),
  }),

  approval: z.object({
    approvedBy: z.string().optional(),
    approvalDate: z.string().optional(),
    salesOfficer: z.string().optional(),
    salesOfficerDate: z.string().optional(),
    signature: z.string().optional(),
  }),

  // ClickUp Metadata
  source: z.enum(['manual', 'clickup']).optional(),
  clickupTaskId: z.string().optional(),
  clickupTaskUrl: z.string().optional(),
  lastImportedAt: z.string().optional(),
});


export type CustomerTrainingFormData = z.infer<typeof customerTrainingSchema>;
