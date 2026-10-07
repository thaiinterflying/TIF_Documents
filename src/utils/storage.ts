import { CustomerTrainingForm, FormDraftSummary } from '../types/customerTraining';

const STORAGE_ACTIVE_KEY = 'customer-training-order-form';
const STORAGE_DRAFTS_KEY = 'customer-training-order-drafts';

export function saveCurrentForm(form: CustomerTrainingForm): void {
  try {
    const updated = {
      ...form,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_ACTIVE_KEY, JSON.stringify(updated));
    // Also sync to drafts list if it has a trackingNo or customer name
    syncToDraftsList(updated);
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function loadCurrentForm(): CustomerTrainingForm | null {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomerTrainingForm;
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return null;
  }
}

export function clearCurrentForm(): void {
  try {
    localStorage.removeItem(STORAGE_ACTIVE_KEY);
  } catch (err) {
    console.error('Failed to clear current form:', err);
  }
}

export function getDraftsList(): FormDraftSummary[] {
  try {
    const raw = localStorage.getItem(STORAGE_DRAFTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FormDraftSummary[];
  } catch (err) {
    console.error('Failed to load drafts list:', err);
    return [];
  }
}

export function saveDraftToList(form: CustomerTrainingForm): void {
  try {
    syncToDraftsList(form);
  } catch (err) {
    console.error('Failed to save draft to list:', err);
  }
}

export function syncToDraftsList(form: CustomerTrainingForm): void {
  try {
    const drafts = getDraftsList();
    const id = form.id || form.customer.trackingNo || `draft-${Date.now()}`;
    const trackingNo = form.customer.trackingNo || 'Untitled';
    const fullName = form.customer.fullName || 'Unnamed Customer';
    const course = form.courseOrder.courses.join(', ') || form.courseOrder.otherCourse || 'No Course';
    const updatedAt = form.updatedAt || new Date().toISOString();
    const customerType = form.customer.customerType || 'Individual';
    
    // Check if required fields are filled for status
    const isComplete = Boolean(
      form.customer.fullName &&
      form.customer.trackingNo &&
      form.customer.phone &&
      form.customer.email &&
      form.courseOrder.courses.length > 0 &&
      form.courseOrder.preferredStart
    );

    const summary: FormDraftSummary = {
      id,
      trackingNo,
      fullName,
      customerType,
      course,
      updatedAt,
      status: isComplete ? 'Completed' : 'Draft',
      formData: { ...form, id, updatedAt },
    };

    const existingIndex = drafts.findIndex((d) => d.id === id || (d.trackingNo && d.trackingNo === trackingNo));
    if (existingIndex >= 0) {
      drafts[existingIndex] = summary;
    } else {
      drafts.unshift(summary);
    }

    // Keep up to 50 drafts
    const trimmed = drafts.slice(0, 50);
    localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Error syncing draft list:', err);
  }
}

export function deleteDraft(id: string): void {
  try {
    const drafts = getDraftsList().filter((d) => d.id !== id && d.trackingNo !== id);
    localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(drafts));
    
    const active = loadCurrentForm();
    if (active && (active.id === id || active.customer.trackingNo === id)) {
      clearCurrentForm();
    }
  } catch (err) {
    console.error('Failed to delete draft:', err);
  }
}
