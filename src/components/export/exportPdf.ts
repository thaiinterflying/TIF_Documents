import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import React from 'react';
import { CustomerTrainingForm } from '../../types/customerTraining';
import { PdfDocument } from './PdfDocument';

export async function exportToPdf(data: CustomerTrainingForm): Promise<void> {
  try {
    const docElement = React.createElement(PdfDocument, { data }) as any;
    const blob = await pdf(docElement).toBlob();
    const trackingNo = data.customer.trackingNo || 'TIF-DOC';
    const cleanTrackingNo = trackingNo.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Customer_Training_Order_${cleanTrackingNo}.pdf`;
    saveAs(blob, filename);
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw error;
  }
}
