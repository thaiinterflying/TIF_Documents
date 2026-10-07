import {
  ClickUpTask,
  ClickUpCustomField,
  ClickUpServiceError,
} from '../types/clickup';
import { CustomerTrainingForm } from '../types/customerTraining';
import { initialFormValues } from '../utils/defaultValues';

/**
 * Clean and extract task ID from raw input or full ClickUp URL
 * e.g. "https://app.clickup.com/t/90181592377/86eyatw7p" -> "86eyatw7p"
 * e.g. "#86eyatw7p" -> "86eyatw7p"
 */
export function extractClickUpTaskId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  
  // If it's a URL like https://app.clickup.com/t/90181592377/86eyatw7p or https://app.clickup.com/t/86eyatw7p
  const urlMatch = trimmed.match(/\/t\/(?:[0-9]+\/)?([a-zA-Z0-9]+)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }

  // Remove leading hash or query parameters
  const clean = trimmed.replace(/^#/, '').split(/[?#]/)[0].trim();
  return clean;
}

/**
 * Fetch task data from backend proxy
 */
export async function getTask(taskId: string): Promise<ClickUpTask> {
  const cleanId = extractClickUpTaskId(taskId);
  if (!cleanId) {
    const err: ClickUpServiceError = {
      code: 'INVALID_TASK_ID',
      message: 'Please enter a valid ClickUp Task ID.',
      status: 400,
    };
    throw err;
  }

  let response: Response;
  try {
    response = await fetch(`/api/clickup/task?taskId=${encodeURIComponent(cleanId)}`);
  } catch {
    const err: ClickUpServiceError = {
      code: 'NETWORK_ERROR',
      message: 'Unable to connect to ClickUp. Please try again.',
    };
    throw err;
  }

  if (!response.ok) {
    let errorData: any = null;
    try {
      errorData = await response.json();
    } catch {}

    if (response.status === 404) {
      const err: ClickUpServiceError = {
        code: 'TASK_NOT_FOUND',
        message: 'ClickUp task not found. Please check the Task ID.',
        status: 404,
      };
      throw err;
    }

    if (response.status === 401) {
      const err: ClickUpServiceError = {
        code: 'AUTH_FAILED',
        message: 'ClickUp authentication failed. Please check the server configuration.',
        status: 401,
      };
      throw err;
    }

    if (response.status === 403) {
      const err: ClickUpServiceError = {
        code: 'FORBIDDEN',
        message: "You don't have permission to access this ClickUp task.",
        status: 403,
      };
      throw err;
    }

    if (response.status === 429) {
      const err: ClickUpServiceError = {
        code: 'RATE_LIMITED',
        message: 'ClickUp API rate limit reached. Please try again later.',
        status: 429,
      };
      throw err;
    }

    // Server returned configured message or generic error
    const err: ClickUpServiceError = {
      code: (errorData?.code as any) || 'UNKNOWN',
      message: errorData?.message || 'Unable to connect to ClickUp. Please try again.',
      status: response.status,
    };
    throw err;
  }

  const data = await response.json();
  const task: ClickUpTask = data.task || data;
  if (!task || !task.id) {
    const err: ClickUpServiceError = {
      code: 'TASK_NOT_FOUND',
      message: 'ClickUp task not found. Please check the Task ID.',
      status: 404,
    };
    throw err;
  }

  return task;
}

/**
 * Get Custom Fields array from task or taskId
 */
export async function getTaskCustomFields(
  taskIdOrTask: string | ClickUpTask
): Promise<ClickUpCustomField[]> {
  if (typeof taskIdOrTask === 'string') {
    const task = await getTask(taskIdOrTask);
    return task.custom_fields || [];
  }
  return taskIdOrTask.custom_fields || [];
}

/**
 * Resolve value of a single Custom Field depending on its field_type
 */
export function resolveCustomFieldValue(field: ClickUpCustomField): any {
  if (field.value === undefined || field.value === null) {
    return null;
  }

  const type = (field.type || '').toLowerCase();
  const val = field.value;

  // Dropdown single select
  if (type === 'drop_down') {
    const options = field.type_config?.options || [];
    if (typeof val === 'number') {
      const opt = options.find((o) => o.orderindex === val) || options[val];
      return opt ? opt.name : String(val);
    }
    if (typeof val === 'string') {
      const opt = options.find((o) => o.id === val || o.name === val);
      return opt ? opt.name : val;
    }
    return String(val);
  }

  // Labels / Multi-select
  if (type === 'labels' || type === 'label') {
    const options = field.type_config?.options || [];
    if (Array.isArray(val)) {
      return val.map((item) => {
        if (typeof item === 'string') {
          const opt = options.find((o) => o.id === item || o.name === item);
          return opt ? opt.name : item;
        }
        return String(item);
      });
    }
    return [String(val)];
  }

  // Date field (ClickUp stores epoch timestamp ms as string or number)
  if (type === 'date') {
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      try {
        const d = new Date(num);
        return d.toISOString().slice(0, 10);
      } catch {
        return String(val);
      }
    }
    return String(val);
  }

  // Checkbox boolean
  if (type === 'checkbox') {
    return Boolean(val);
  }

  // Currency or Number
  if (type === 'currency' || type === 'number') {
    const parsed = parseFloat(String(val));
    return isNaN(parsed) ? null : parsed;
  }

  return val;
}

/**
 * Parse structured key-value lines from task description if present
 * e.g.:
 * Name: Thanaphat Wongsuwan
 * Phone: 0812345678
 * Email: pilot@example.com
 * Course: PPL
 */
export function parseTaskDescription(description?: string): Record<string, string> {
  if (!description) return {};
  const result: Record<string, string> = {};

  // Normalize lines
  const lines = description.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Matches "Key: Value" or "Key = Value" or "- Key: Value"
    const match = line.match(/^[-*•]?\s*([A-Za-z0-9\s/&()_.-]+?)\s*[:=]\s*(.+)$/);
    if (match) {
      const rawKey = match[1].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const rawVal = match[2].trim();
      if (rawKey && rawVal) {
        result[rawKey] = rawVal;
      }
    }
  }

  return result;
}

/**
 * Normalizes field key for matching
 * e.g. "Full Name (ชื่อ-นามสกุล)" -> "fullname"
 */
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Map real ClickUp Task (Custom fields + Description + Task fields) to CustomerTrainingForm
 */
export function mapClickUpToForm(
  task: ClickUpTask,
  baseForm?: CustomerTrainingForm
): CustomerTrainingForm {
  // Start with clean initial form structure or baseForm
  const form: CustomerTrainingForm = JSON.parse(
    JSON.stringify(baseForm || initialFormValues)
  );

  // 1. Build list of Custom Fields
  const cfList: { name: string; nKey: string; field: ClickUpCustomField; resolvedValue: any }[] = [];
  if (task.custom_fields && Array.isArray(task.custom_fields)) {
    for (const cf of task.custom_fields) {
      const nKey = normalizeKey(cf.name);
      const resVal = resolveCustomFieldValue(cf);
      cfList.push({ name: cf.name, nKey, field: cf, resolvedValue: resVal });
    }
  }

  // 2. Build dictionary of parsed Description lines
  const descMap = parseTaskDescription(task.description || task.text_content);

  // Helper to look up a single value across Custom Fields first, then Description
  const getValue = (...keys: string[]): any => {
    for (const key of keys) {
      const nKey = normalizeKey(key);
      const cfMatch = cfList.find(
        (entry) =>
          entry.nKey === nKey &&
          entry.resolvedValue !== null &&
          entry.resolvedValue !== undefined &&
          entry.resolvedValue !== ''
      );
      if (cfMatch) return cfMatch.resolvedValue;
      if (descMap[nKey]) return descMap[nKey];
    }
    return undefined;
  };

  // Helper to gather all values across all matching fields (supports multiple fields with similar names)
  const getAllValues = (...keys: string[]): any[] => {
    const results: any[] = [];
    const nKeys = keys.map(normalizeKey);
    for (const entry of cfList) {
      if (
        nKeys.includes(entry.nKey) &&
        entry.resolvedValue !== null &&
        entry.resolvedValue !== undefined &&
        entry.resolvedValue !== ''
      ) {
        if (Array.isArray(entry.resolvedValue)) {
          results.push(...entry.resolvedValue);
        } else {
          results.push(entry.resolvedValue);
        }
      }
    }
    for (const nk of nKeys) {
      if (descMap[nk]) results.push(descMap[nk]);
    }
    return results;
  };

  // Helper for string
  const getString = (...keys: string[]): string | undefined => {
    const val = getValue(...keys);
    if (val === undefined || val === null) return undefined;
    return String(val).trim();
  };

  // Helper for number
  const getNumber = (...keys: string[]): number | undefined => {
    const val = getValue(...keys);
    if (val === undefined || val === null || val === '') return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  };

  // Helper for string array
  const getStringArray = (...keys: string[]): string[] | undefined => {
    const val = getValue(...keys);
    if (!val) return undefined;
    if (Array.isArray(val)) {
      return val.map(String).map((s) => s.trim()).filter(Boolean);
    }
    if (typeof val === 'string') {
      return val.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
    }
    return undefined;
  };

  // ==========================================
  // SECTION A – DISTRIBUTION
  // ==========================================
  const sendToVal = getStringArray('sendto', 'send to', 'distribution', 'departments');
  if (sendToVal && sendToVal.length > 0) {
    form.distribution.sendTo = sendToVal;
  }
  const custStatusVal = getString('customerstatus', 'customer status', 'status type');
  if (custStatusVal) {
    if (custStatusVal.toLowerCase().includes('part')) {
      form.distribution.customerStatus = 'Part Time';
    } else if (custStatusVal.toLowerCase().includes('full')) {
      form.distribution.customerStatus = 'Fulltime';
    }
  }

  // ==========================================
  // SECTION B – CUSTOMER INFORMATION
  // ==========================================
  // Extract Name & Nickname from Task name if formatted like "Name Surname (Nickname)"
  let extractedFullNameFromTask = '';
  let extractedNicknameFromTask = '';
  if (task.name) {
    const trimmedTaskName = task.name.trim();
    const parenMatch = trimmedTaskName.match(/^([^(]+?)\s*\(([^)]+)\)$/);
    if (parenMatch) {
      extractedFullNameFromTask = parenMatch[1].trim();
      extractedNicknameFromTask = parenMatch[2].trim();
    } else {
      extractedFullNameFromTask = trimmedTaskName.split(/[-–|]/)[0]?.trim();
    }
  }

  const fullNameVal =
    getString('namesurname', 'fullname', 'full name', 'name', 'namelast', 'studentname', 'customer name') ||
    extractedFullNameFromTask;
  if (fullNameVal) {
    form.customer.fullName = fullNameVal;
  }

  const nicknameVal =
    getString('nickname', 'nick name', 'call name') ||
    extractedNicknameFromTask;
  if (nicknameVal) form.customer.nickname = nicknameVal;

  const trackingVal =
    getString('trackingno', 'tracking number', 'tracking', 'order no', 'order id') ||
    task.custom_id ||
    task.id;
  if (trackingVal) form.customer.trackingNo = trackingVal;

  const custTypeVal = getString('customertype', 'customer type', 'client type');
  if (custTypeVal) {
    const lower = custTypeVal.toLowerCase();
    if (lower.includes('corp')) form.customer.customerType = 'Corporate';
    else if (lower.includes('agency')) form.customer.customerType = 'Agency';
    else if (lower.includes('group')) form.customer.customerType = 'Group';
    else form.customer.customerType = 'Individual';
  }

  const corpNameVal = getString('corporatename', 'corporate name', 'company', 'organization');
  if (corpNameVal) form.customer.corporateName = corpNameVal;

  const agencyNameVal = getString('agencyname', 'agency name', 'agency');
  if (agencyNameVal) form.customer.agencyName = agencyNameVal;

  const batchVal = getString('joiningbatch', 'batch', 'joining batch', 'class');
  if (batchVal) form.customer.joiningBatch = batchVal;

  const dobVal = getString('dateofbirth', 'dob', 'birth date', 'birthday');
  if (dobVal) form.customer.dateOfBirth = dobVal;

  const idVal = getString(
    'idcardnumberorpassportnumber',
    'idpassportno',
    'id passport no',
    'passport no',
    'citizen id',
    'id card',
    'passport'
  );
  if (idVal) form.customer.idPassportNo = idVal;

  const emailVal = getString('email', 'e-mail', 'customer email', 'contact email');
  if (emailVal) form.customer.email = emailVal;

  const phoneVal = getString(
    'contactnumber',
    'phonenumber',
    'phone',
    'phone number',
    'tel',
    'mobile',
    'telephone'
  );
  if (phoneVal) form.customer.phone = phoneVal;

  const lineVal = getString('line', 'lineid', 'linewechat', 'wechat', 'line/wechat');
  if (lineVal) form.customer.lineWechat = lineVal;

  const nationalityVal = getString('netionality', 'nationality', 'nation', 'country');
  if (nationalityVal) form.customer.nationality = nationalityVal;

  const addressVal = getString('currentaddress', 'address', 'home address');
  if (addressVal) form.customer.address = addressVal;

  // ==========================================
  // SECTION C – EMERGENCY CONTACT
  // ==========================================
  const emNameVal = getString('emergencyname', 'emergency contact name', 'emergency name', 'next of kin');
  if (emNameVal) form.emergencyContact.name = emNameVal;

  const emRelVal = getString('emergencyrelationship', 'relationship', 'emergency relation');
  if (emRelVal) form.emergencyContact.relationship = emRelVal;

  const emPhoneVal = getString('emergencyphone', 'emergency contact phone', 'emergency phone', 'emergency tel');
  if (emPhoneVal) form.emergencyContact.phone = emPhoneVal;

  const emEmailVal = getString('emergencyemail', 'emergency contact email', 'emergency email');
  if (emEmailVal) form.emergencyContact.email = emEmailVal;

  const emAddContactVal = getString('additionalcontact', 'additional contact', 'alternative contact');
  if (emAddContactVal) form.emergencyContact.additionalContact = emAddContactVal;

  // ==========================================
  // SECTION D – LICENSE & MEDICAL
  // ==========================================
  const licenseVal = getString('currentlicense', 'license', 'current license held');
  if (licenseVal) {
    const l = licenseVal.toLowerCase();
    if (l.includes('student')) form.licenseMedical.currentLicense = 'Student';
    else if (l.includes('cpl')) form.licenseMedical.currentLicense = 'CPL';
    else if (l.includes('ppl')) form.licenseMedical.currentLicense = 'PPL';
    else if (l.includes('atpl')) form.licenseMedical.currentLicense = 'ATPL Theory';
    else if (l.includes('none')) form.licenseMedical.currentLicense = 'None';
    else {
      form.licenseMedical.currentLicense = 'Other';
      form.licenseMedical.otherLicense = licenseVal;
    }
  }

  const ratingsVal = getStringArray('ratingsheld', 'ratings held', 'ratings');
  if (ratingsVal && ratingsVal.length > 0) {
    form.licenseMedical.ratingsHeld = ratingsVal;
  }

  const flightTimeVal = getNumber('totalflighttime', 'flight time', 'total hours', 'hours flown', 'tt');
  if (flightTimeVal !== undefined) {
    form.licenseMedical.totalFlightTime = flightTimeVal;
  }

  const medicalVal = getString('medical', 'medical class', 'aviation medical');
  if (medicalVal) {
    if (medicalVal.includes('1')) form.licenseMedical.medical = 'Class 1';
    else if (medicalVal.includes('2')) form.licenseMedical.medical = 'Class 2';
    else form.licenseMedical.medical = "Don't have";
  }

  const issuingAuthVal = getString('issuingauthority', 'issuing authority', 'medical authority', 'hospital');
  if (issuingAuthVal) form.licenseMedical.issuingAuthority = issuingAuthVal;

  const expiryVal = getString('expiry', 'medical expiry', 'expiry date', 'medical expiration');
  if (expiryVal) form.licenseMedical.expiry = expiryVal;

  const diseaseVal = getString('underlyingdisease', 'underlying disease', 'remarks medical', 'medical remarks');
  if (diseaseVal) form.licenseMedical.underlyingDiseaseRemarks = diseaseVal;

  const drugVal = getString('drugallergy', 'drug allergy', 'allergies drug');
  if (drugVal) form.licenseMedical.drugAllergy = drugVal;

  const foodVal = getString('foodallergy', 'food allergy', 'allergies food');
  if (foodVal) form.licenseMedical.foodAllergy = foodVal;

  // ==========================================
  // SECTION E – COURSE ORDER DETAILS
  // ==========================================
  const canonicalCourseMap: Record<string, string> = {
    'ppl': 'PPL',
    'private pilot': 'PPL',
    'cpl': 'CPL/IR Integrated + ATP',
    'integrated': 'CPL/IR Integrated + ATP',
    'ir': 'IR',
    'instrument': 'IR',
    'me': 'ME',
    'multi engine': 'ME',
    'atp': 'ATP',
    'atpl': 'ATP',
    'tcar': 'Conversion TCAR',
    'conversion': 'Conversion TCAR',
    'convert license': 'Conversion TCAR',
    'recurrent': 'Recurrent',
    'rcm': 'Recurrent',
    'type rating': 'Type Rating',
  };

  const rawCourses = getAllValues('course', 'coursename', 'courseordered', 'trainingprogram', 'courses');
  const mappedCourses: string[] = [];
  for (const raw of rawCourses) {
    const rawStr = String(raw).trim();
    const lower = rawStr.toLowerCase();
    let matched = false;
    for (const [pattern, canonical] of Object.entries(canonicalCourseMap)) {
      if (lower.includes(pattern)) {
        if (!mappedCourses.includes(canonical)) {
          mappedCourses.push(canonical);
        }
        matched = true;
        break;
      }
    }
    if (!matched && rawStr && !mappedCourses.includes(rawStr)) {
      mappedCourses.push(rawStr);
    }
  }
  // If custom fields had no courses, scan task name & description (Requirement 6)
  if (mappedCourses.length === 0) {
    const textToScan = `${task.name || ''} ${task.description || ''} ${task.text_content || ''}`;
    const courseRegexes: [RegExp, string][] = [
      [/(?:tcar|conversion|convert license)/i, 'Conversion TCAR'],
      [/(?:recurrent|recurent|rcm)/i, 'Recurrent'],
      [/\b(?:ppl|private pilot)\b/i, 'PPL'],
      [/\b(?:cpl|integrated)\b/i, 'CPL/IR Integrated + ATP'],
      [/\b(?:me|multi engine)\b/i, 'ME'],
      [/\b(?:ir|instrument rating)\b/i, 'IR'],
      [/\b(?:atp|atpl)\b/i, 'ATP'],
      [/\b(?:type rating)\b/i, 'Type Rating'],
    ];

    for (const [regex, canonical] of courseRegexes) {
      if (regex.test(textToScan)) {
        if (!mappedCourses.includes(canonical)) {
          mappedCourses.push(canonical);
        }
      }
    }
  }

  if (mappedCourses.length > 0) {
    form.courseOrder.courses = mappedCourses;
  }

  const aircraftVal = getString('aircrafttype', 'aircraft', 'aircraft type', 'plane type');
  if (aircraftVal) form.courseOrder.aircraftType = aircraftVal;

  const pkgVal = getString('package', 'training package', 'course package');
  if (pkgVal) form.courseOrder.package = pkgVal;

  // Preferred start: check field or due_date / start_date
  let startDateVal = getString('preferredstart', 'preferred start', 'start date', 'commence date');
  if (!startDateVal && task.start_date) {
    const num = Number(task.start_date);
    if (!isNaN(num) && num > 0) startDateVal = new Date(num).toISOString().slice(0, 10);
  }
  if (!startDateVal && task.due_date) {
    const num = Number(task.due_date);
    if (!isNaN(num) && num > 0) startDateVal = new Date(num).toISOString().slice(0, 10);
  }
  if (startDateVal) form.courseOrder.preferredStart = startDateVal;

  const durationVal = getString('estimatedduration', 'duration', 'est duration', 'estimated duration');
  if (durationVal) form.courseOrder.estimatedDuration = durationVal;

  const componentsVal = getStringArray('trainingcomponents', 'training components', 'components');
  if (componentsVal && componentsVal.length > 0) {
    form.courseOrder.trainingComponents = componentsVal;
  }

  const specialReqVal = getString('specialrequirements', 'special requirements', 'notes', 'special conditions');
  if (specialReqVal) form.courseOrder.specialRequirements = specialReqVal;

  // ==========================================
  // SECTION F – OTHER SERVICES
  // ==========================================
  const parseIncNotInc = (...keys: string[]): string | undefined => {
    const v = getString(...keys);
    if (!v) return undefined;
    const l = v.toLowerCase();
    if (l === 'true' || l === 'yes' || l.includes('included')) return 'Included';
    if (l === 'false' || l === 'no' || l.includes('not')) return 'Not Included';
    return v;
  };

  const accomVal = parseIncNotInc('accommodation', 'housing', 'hotel');
  if (accomVal) form.otherServices.accommodation = accomVal;

  const mealsVal = parseIncNotInc('meals', 'food', 'catering');
  if (mealsVal) form.otherServices.meals = mealsVal;

  const transVal = parseIncNotInc('transportation', 'transport', 'shuttle');
  if (transVal) form.otherServices.transportation = transVal;

  const visaVal = parseIncNotInc('visafee', 'visa fee', 'visa');
  if (visaVal) form.otherServices.visaFee = visaVal;

  const examVal = parseIncNotInc('examfee', 'exam fee', 'caat exam fee');
  if (examVal) form.otherServices.examFee = examVal;

  const otherSupportVal = getString('otheritems', 'other items/support', 'other support', 'other items', 'equipment');
  if (otherSupportVal) form.otherServices.otherSupport = otherSupportVal;

  // ==========================================
  // SECTION G – FINANCE (tracking)
  // ==========================================
  const totalPriceVal = getNumber('estimatedvalue', 'totalprice', 'total price', 'tuition fee', 'price', 'total');
  if (totalPriceVal !== undefined) form.finance.totalPrice = totalPriceVal;

  const discountVal = getNumber('discount', 'scholarship', 'special discount');
  if (discountVal !== undefined) form.finance.discount = discountVal;

  // Check task status or custom field for deposit
  if (task.status?.status) {
    const st = task.status.status.toLowerCase();
    if (st.includes('deposit')) {
      form.finance.depositRequired = 'Yes';
    }
  }

  const depositReqVal = getString('depositrequired', 'deposit required');
  if (depositReqVal) {
    const l = depositReqVal.toLowerCase();
    if (l === 'true' || l === 'yes' || l.includes('yes')) form.finance.depositRequired = 'Yes';
    else if (l === 'false' || l === 'no' || l.includes('no')) form.finance.depositRequired = 'No';
  }

  const depositDateVal = getString('depositdate', 'deposit date');
  if (depositDateVal) form.finance.depositDate = depositDateVal;

  const depositReceivedVal = getNumber('depositreceived', 'deposit received', 'deposit amount', 'deposit');
  if (depositReceivedVal !== undefined) form.finance.depositReceived = depositReceivedVal;

  const paymentMethodVal = getStringArray('paymentmethod', 'payment method', 'payment');
  if (paymentMethodVal && paymentMethodVal.length > 0) {
    form.finance.paymentMethod = paymentMethodVal;
  }

  const installmentVal = getString('installmentdetails', 'installment details', 'installments schedule');
  if (installmentVal) form.finance.installmentDetails = installmentVal;

  const corpBalanceVal = getNumber('corporatebalance', 'corporate balance');
  if (corpBalanceVal !== undefined) form.finance.corporateBalance = corpBalanceVal;

  const docsVal = getStringArray('documents', 'documents submitted', 'documents required');
  if (docsVal && docsVal.length > 0) {
    form.finance.documents = docsVal;
  }

  const eligibilityVal = getString('eligibilityverified', 'eligibility verified', 'eligible');
  if (eligibilityVal) {
    const l = eligibilityVal.toLowerCase();
    if (l === 'true' || l === 'yes' || l.includes('yes')) form.finance.eligibilityVerified = 'Yes';
    else if (l === 'false' || l === 'no' || l.includes('no')) form.finance.eligibilityVerified = 'No';
  }

  const eligibilityRemVal = getString('eligibilityremarks', 'eligibility remarks');
  if (eligibilityRemVal) form.finance.eligibilityRemarks = eligibilityRemVal;

  const remarksVal = getString('remarks', 'special conditions', 'general remarks');
  if (remarksVal) form.finance.remarks = remarksVal;

  // ==========================================
  // CLICKUP METADATA (Requirement 13)
  // ==========================================
  form.source = 'clickup';
  form.clickupTaskId = task.id;
  form.clickupTaskUrl = task.url || `https://app.clickup.com/t/${task.id}`;
  form.lastImportedAt = new Date().toISOString();

  return form;
}

/**
 * Format imported date string for UI display (e.g. "07 Oct 2026 14:30")
 */
export function formatImportedDate(isoOrEpoch?: string | number): string {
  if (!isoOrEpoch) return '';
  const d = new Date(isoOrEpoch);
  if (isNaN(d.getTime())) return String(isoOrEpoch);

  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

