import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  ImageRun,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Footer,
} from 'docx';
import { saveAs } from 'file-saver';
import { CustomerTrainingForm } from '../../types/customerTraining';
import { formatCurrency, formatDateDisplay } from '../../utils/calculations';
import { LOGO_RAW_BASE64 } from '../../assets/logoBase64';

function base64ToUint8Array(base64: string): Uint8Array {
  const clean = base64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  const binaryString = atob(clean);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function exportToWord(data: CustomerTrainingForm): Promise<void> {
  try {
    const logoData = base64ToUint8Array(LOGO_RAW_BASE64);
    let signatureData: Uint8Array | null = null;
    if (data.approval.signature) {
      try {
        signatureData = base64ToUint8Array(data.approval.signature);
      } catch (e) {
        console.warn('Failed to parse signature image for docx:', e);
      }
    }

    const currentFinal =
      typeof data.finance.finalPrice === 'number'
        ? data.finance.finalPrice
        : (Number(data.finance.totalPrice) || 0) - (Number(data.finance.discount) || 0);

    const blackBorder = {
      style: BorderStyle.SINGLE,
      size: 6,
      color: '000000',
    };

    const tableBordersAll = {
      top: blackBorder,
      bottom: blackBorder,
      left: blackBorder,
      right: blackBorder,
      insideHorizontal: blackBorder,
      insideVertical: blackBorder,
    };

    // Checkbox text runs matching exact document notation
    const chk = (checked: boolean, label: string, extra?: string) => [
      new TextRun({
        text: checked ? ' ☑ ' : ' ☐ ',
        bold: true,
        size: 17,
        color: '000000',
      }),
      new TextRun({
        text: label + (extra ? ` ${extra}` : ''),
        bold: checked,
        size: 16,
      }),
      new TextRun({ text: '  ' }),
    ];

    const sectionHeaderRow = (title: string, colSpan: number = 2) =>
      new TableRow({
        children: [
          new TableCell({
            columnSpan: colSpan,
            shading: { fill: 'D9D9D9', type: ShadingType.CLEAR },
            borders: tableBordersAll,
            children: [
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 17,
                    color: '000000',
                  }),
                ],
              }),
            ],
          }),
        ],
      });

    // REUSABLE TOP HEADER TABLE (Exact match to Page 1 & 2 of original PDF)
    const createHeaderTable = () =>
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBordersAll,
        rows: [
          new TableRow({
            children: [
              // Left: Logo & Company Name
              new TableCell({
                width: { size: 32, type: WidthType.PERCENTAGE },
                verticalAlign: 'center',
                borders: tableBordersAll,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 40, after: 40 },
                    children: [
                      new ImageRun({
                        data: logoData,
                        transformation: { width: 130, height: 55 },
                        type: 'jpg',
                      }),
                    ],
                  }),
                ],
              }),


              // Right: Title & Tracking Sub-table
              new TableCell({
                width: { size: 68, type: WidthType.PERCENTAGE },
                borders: tableBordersAll,
                children: [
                  // Title Bar
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 40, after: 40 },
                    children: [
                      new TextRun({
                        text: 'CUSTOMER TRAINING ORDER & TRACKING FORM',
                        bold: true,
                        size: 18,
                      }),
                    ],
                  }),
                  // Tracking No & Customer Type
                  new Paragraph({
                    spacing: { before: 40, after: 20 },
                    children: [
                      new TextRun({ text: 'Tracking No: ', bold: true, size: 16 }),
                      new TextRun({
                        text: data.customer.trackingNo || '',
                        bold: true,
                        underline: {},
                        size: 16,
                      }),
                      new TextRun({ text: '             ' }),
                      ...chk(data.customer.customerType === 'Individual', 'Individual'),
                      ...chk(data.customer.customerType === 'Group', 'Group'),
                      ...chk(
                        data.customer.customerType === 'Corporate',
                        'Corporate',
                        data.customer.corporateName ? data.customer.corporateName : '................'
                      ),
                    ],
                  }),
                  new Paragraph({
                    spacing: { before: 20, after: 40 },
                    children: [
                      new TextRun({ text: 'Customer Type:                      ', bold: true, size: 16 }),
                      ...chk(
                        data.customer.customerType === 'Agency',
                        'Agency',
                        data.customer.agencyName ? data.customer.agencyName : '................'
                      ),
                    ],
                  }),
                  // Joining Batch
                  new Paragraph({
                    spacing: { before: 40, after: 40 },
                    children: [
                      new TextRun({ text: 'Joining Batch: ', bold: true, size: 16 }),
                      new TextRun({ text: data.customer.joiningBatch || '', size: 16 }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });

    // ==========================================
    // PAGE 1 TABLE (ALL SECTIONS JOINED IN ONE GRID)
    // ==========================================
    const page1FormTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBordersAll,
      rows: [
        // SECTION A – DISTRIBUTION
        sectionHeaderRow(
          'SECTION A – DISTRIBUTION (Sales controls & sends to departments)'
        ),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 30, after: 20 },
                  children: [
                    new TextRun({ text: 'Send to: ', bold: true, size: 16 }),
                    ...chk((data.distribution.sendTo || []).includes('Operation'), 'Operation'),
                    ...chk((data.distribution.sendTo || []).includes('Finance'), 'Finance'),
                    ...chk((data.distribution.sendTo || []).includes('Training'), 'Training'),
                    ...chk(
                      (data.distribution.sendTo || []).includes('Standard/Compliance'),
                      'Standard/Compliance'
                    ),
                    ...chk((data.distribution.sendTo || []).includes('Management'), 'Management'),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 20, after: 30 },
                  children: [
                    new TextRun({ text: 'Customer status: ', bold: true, size: 16 }),
                    ...chk(data.distribution.customerStatus === 'Fulltime', 'Fulltime'),
                    ...chk(data.distribution.customerStatus === 'Part Time', 'Part Time'),
                  ],
                }),
              ],
            }),
          ],
        }),

        // SECTION B – CUSTOMER INFORMATION
        sectionHeaderRow('SECTION B – CUSTOMER INFORMATION'),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Full Name: ', bold: true, size: 16 }),
                    new TextRun({ text: data.customer.fullName || '', size: 16 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Nickname: ', bold: true, size: 16 }),
                    new TextRun({ text: data.customer.nickname || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Date of Birth: ', bold: true, size: 16 }),
                    new TextRun({ text: formatDateDisplay(data.customer.dateOfBirth), size: 16 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Nationality: ', bold: true, size: 16 }),
                    new TextRun({ text: data.customer.nationality || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'ID/Passport No: ', bold: true, size: 16 }),
                    new TextRun({ text: data.customer.idPassportNo || '', size: 16 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Phone: ', bold: true, size: 16 }),
                    new TextRun({ text: data.customer.phone || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Email: ', bold: true, size: 16 }),
                    new TextRun({ text: data.customer.email || '', size: 16 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Line/WeChat: ', bold: true, size: 16 }),
                    new TextRun({ text: data.customer.lineWechat || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Address: ', bold: true, size: 16 }),
                    new TextRun({ text: data.customer.address || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // SECTION C – EMERGENCY CONTACT
        sectionHeaderRow(
          'SECTION C – EMERGENCY CONTACT (บุคคลที่ติดต่อได้ ในกรณีฉุกเฉิน )'
        ),
        new TableRow({
          children: [
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Name: ', bold: true, size: 16 }),
                    new TextRun({ text: data.emergencyContact.name || '', size: 16 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Phone: ', bold: true, size: 16 }),
                    new TextRun({ text: data.emergencyContact.phone || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Relationship: ', bold: true, size: 16 }),
                    new TextRun({ text: data.emergencyContact.relationship || '', size: 16 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Email: ', bold: true, size: 16 }),
                    new TextRun({ text: data.emergencyContact.email || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({
                      text: 'Additional contact (optional): ',
                      bold: true,
                      size: 16,
                    }),
                    new TextRun({ text: data.emergencyContact.additionalContact || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // SECTION D – LICENSE & MEDICAL
        sectionHeaderRow('SECTION D – LICENSE & MEDICAL'),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Current License: ', bold: true, size: 16 }),
                    ...chk(data.licenseMedical.currentLicense === 'None', 'None'),
                    ...chk(data.licenseMedical.currentLicense === 'Student', 'Student'),
                    ...chk(data.licenseMedical.currentLicense === 'PPL', 'PPL'),
                    ...chk(data.licenseMedical.currentLicense === 'CPL', 'CPL'),
                    ...chk(data.licenseMedical.currentLicense === 'ATPL Theory', 'ATPL Theory'),
                    ...chk(
                      data.licenseMedical.currentLicense === 'Other',
                      'Other:',
                      data.licenseMedical.otherLicense || '________'
                    ),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Ratings held: ', bold: true, size: 16 }),
                    ...chk((data.licenseMedical.ratingsHeld || []).includes('SEP'), 'SEP'),
                    ...chk((data.licenseMedical.ratingsHeld || []).includes('MEP'), 'MEP'),
                    ...chk((data.licenseMedical.ratingsHeld || []).includes('IR'), 'IR'),
                    ...chk(
                      (data.licenseMedical.ratingsHeld || []).includes('Other'),
                      'Other:',
                      data.licenseMedical.otherRating || '________'
                    ),
                    new TextRun({ text: '   Total Flight Time: ', bold: true, size: 16 }),
                    new TextRun({
                      text: `${data.licenseMedical.totalFlightTime !== '' && data.licenseMedical.totalFlightTime !== null ? data.licenseMedical.totalFlightTime : ''} hrs`,
                      bold: true,
                      size: 16,
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Medical: ', bold: true, size: 16 }),
                    ...chk(data.licenseMedical.medical === 'Class 1', 'Class 1'),
                    ...chk(data.licenseMedical.medical === 'Class 2', 'Class 2'),
                    ...chk(data.licenseMedical.medical === "Don't have", "Don't have"),
                    new TextRun({ text: '   Issuing Authority: ', bold: true, size: 16 }),
                    new TextRun({ text: data.licenseMedical.issuingAuthority || '', size: 16 }),
                    new TextRun({ text: '   Expiry: ', bold: true, size: 16 }),
                    new TextRun({ text: formatDateDisplay(data.licenseMedical.expiry), size: 16 }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Underlying disease/Remarks: ', bold: true, size: 16 }),
                    new TextRun({
                      text: data.licenseMedical.underlyingDiseaseRemarks || '',
                      size: 16,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Drug allergy: ', bold: true, size: 16 }),
                    new TextRun({ text: data.licenseMedical.drugAllergy || '', size: 16 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Food allergy: ', bold: true, size: 16 }),
                    new TextRun({ text: data.licenseMedical.foodAllergy || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // SECTION E – COURSE ORDER DETAILS
        sectionHeaderRow(
          'SECTION E – COURSE ORDER DETAILS (for Sales / Operation / Standard)'
        ),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Course ordered: \n', bold: true, size: 16 }),
                    ...chk((data.courseOrder.courses || []).includes('PPL'), 'PPL'),
                    ...chk(
                      (data.courseOrder.courses || []).includes('CPL/IR Integrated + ATP'),
                      'CPL/IR Integrated + ATP'
                    ),
                    ...chk((data.courseOrder.courses || []).includes('IR'), 'IR'),
                    ...chk((data.courseOrder.courses || []).includes('ME'), 'ME'),
                    ...chk((data.courseOrder.courses || []).includes('ATP'), 'ATP'),
                    ...chk(
                      (data.courseOrder.courses || []).includes('Conversion TCAR'),
                      'Conversion TCAR'
                    ),
                    ...chk((data.courseOrder.courses || []).includes('Recurrent'), 'Recurrent'),
                    ...chk((data.courseOrder.courses || []).includes('Type Rating'), 'Type Rating'),
                    ...chk(
                      (data.courseOrder.courses || []).includes('Other'),
                      'Other:',
                      data.courseOrder.otherCourse || '____'
                    ),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Aircraft type: ', bold: true, size: 16 }),
                    new TextRun({ text: data.courseOrder.aircraftType || '', size: 16 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Package: ', bold: true, size: 16 }),
                    new TextRun({ text: data.courseOrder.package || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Preferred start: ', bold: true, size: 16 }),
                    new TextRun({
                      text: formatDateDisplay(data.courseOrder.preferredStart),
                      bold: true,
                      size: 16,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Est. duration: ', bold: true, size: 16 }),
                    new TextRun({ text: data.courseOrder.estimatedDuration || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Training components: ', bold: true, size: 16 }),
                    ...chk(
                      (data.courseOrder.trainingComponents || []).includes('Ground'),
                      'Ground'
                    ),
                    ...chk(
                      (data.courseOrder.trainingComponents || []).includes('Flight'),
                      'Flight'
                    ),
                    ...chk(
                      (data.courseOrder.trainingComponents || []).includes('Simulator'),
                      'Simulator'
                    ),
                    ...chk(
                      (data.courseOrder.trainingComponents || []).includes('CAAT Exam'),
                      'CAAT Exam'
                    ),
                    ...chk(
                      (data.courseOrder.trainingComponents || []).includes('Skill Test'),
                      'Skill Test'
                    ),
                    ...chk(
                      (data.courseOrder.trainingComponents || []).includes('ICAO ELP'),
                      'ICAO ELP'
                    ),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Special requirements / notes: ', bold: true, size: 16 }),
                    new TextRun({ text: data.courseOrder.specialRequirements || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // SECTION F – Other
        sectionHeaderRow('SECTION F – Other'),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Accommodation: ', bold: true, size: 16 }),
                    ...chk(data.otherServices.accommodation === 'Included', 'Included'),
                    ...chk(data.otherServices.accommodation === 'Not Included', 'Not Included'),
                    new TextRun({ text: '   Meals: ', bold: true, size: 16 }),
                    ...chk(data.otherServices.meals === 'Included', 'Included'),
                    ...chk(data.otherServices.meals === 'Not Included', 'Not Included'),
                    new TextRun({ text: '   Transportation: ', bold: true, size: 16 }),
                    ...chk(data.otherServices.transportation === 'Included', 'Included'),
                    ...chk(data.otherServices.transportation === 'Not Included', 'Not Included'),
                    new TextRun({ text: '   Visa fee: ', bold: true, size: 16 }),
                    ...chk(data.otherServices.visaFee === 'Included', 'Included'),
                    ...chk(data.otherServices.visaFee === 'Not Included', 'Not Included'),
                    new TextRun({ text: '   Exam fee : ', bold: true, size: 16 }),
                    ...chk(data.otherServices.examFee === 'Included', 'Included'),
                    ...chk(data.otherServices.examFee === 'Not Included', 'Not Included'),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // ==========================================
    // PAGE 2 TABLE (ALL SECTIONS JOINED IN ONE GRID)
    // ==========================================
    const page2FormTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBordersAll,
      rows: [
        // Other items/support
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 30, after: 30 },
                  children: [
                    new TextRun({ text: 'Other items/support: ', bold: true, size: 16 }),
                    new TextRun({ text: data.otherServices.otherSupport || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // SECTION G – FINANCE (tracking)
        sectionHeaderRow('SECTION G – FINANCE (tracking)', 3),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Total price (THB): ', bold: true, size: 16 }),
                    new TextRun({ text: formatCurrency(data.finance.totalPrice), size: 16 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Discount: ', bold: true, size: 16 }),
                    new TextRun({ text: formatCurrency(data.finance.discount), size: 16 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Final: ', bold: true, size: 16 }),
                    new TextRun({
                      text: currentFinal ? `${formatCurrency(currentFinal)}` : '',
                      bold: true,
                      size: 16,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [new TextRun({ text: 'Deposit required: ', bold: true, size: 16 })],
                }),
              ],
            }),
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Deposit received: ', bold: true, size: 16 }),
                    new TextRun({
                      text: data.finance.depositReceived
                        ? `${formatCurrency(data.finance.depositReceived)}`
                        : '',
                      size: 16,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    ...chk(
                      data.finance.depositRequired === 'Yes',
                      'Yes',
                      data.finance.depositDate
                        ? `(Date: ${formatDateDisplay(data.finance.depositDate)})`
                        : '(Date:____________)'
                    ),
                    ...chk(data.finance.depositRequired === 'No', 'No'),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Payment method: ', bold: true, size: 16 }),
                    ...chk((data.finance.paymentMethod || []).includes('Cash'), 'Cash'),
                    ...chk((data.finance.paymentMethod || []).includes('Transfer'), 'Transfer'),
                    ...chk(
                      (data.finance.paymentMethod || []).includes('Installments'),
                      '...........Installments',
                      data.finance.installmentDetails ? `(${data.finance.installmentDetails})` : ''
                    ),
                    ...chk(
                      (data.finance.paymentMethod || []).includes('Corporate Balance'),
                      'Corporate Balance:',
                      data.finance.corporateBalance
                        ? ` ${formatCurrency(data.finance.corporateBalance)} THB`
                        : ' __________ THB'
                    ),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Documents: ', bold: true, size: 16 }),
                    ...chk((data.finance.documents || []).includes('ID copy'), 'ID copy'),
                    ...chk((data.finance.documents || []).includes('Medical'), 'Medical'),
                    ...chk((data.finance.documents || []).includes('License copy'), 'License copy'),
                    ...chk((data.finance.documents || []).includes('Logbook'), 'Logbook'),
                    ...chk((data.finance.documents || []).includes('English/ELP'), 'English/ELP'),
                    ...chk((data.finance.documents || []).includes('Photos'), 'Photos'),
                    ...chk(
                      (data.finance.documents || []).includes('Other'),
                      'Other:',
                      data.finance.otherDocument || '____'
                    ),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: 'Eligibility verified: ', bold: true, size: 16 }),
                    ...chk(data.finance.eligibilityVerified === 'Yes', 'Yes'),
                    ...chk(data.finance.eligibilityVerified === 'No', 'No'),
                    new TextRun({ text: '   Remarks: ', bold: true, size: 16 }),
                    new TextRun({ text: data.finance.eligibilityRemarks || '', size: 16 }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // REMARKS / SPECIAL CONDITIONS
        sectionHeaderRow('REMARKS / SPECIAL CONDITIONS', 3),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 40, after: 400 }, // Generous spacing matching open box
                  children: [new TextRun({ text: data.finance.remarks || '', size: 16 })],
                }),
              ],
            }),
          ],
        }),

        // SECTION J – APPROVAL & SIGNATURE
        sectionHeaderRow('SECTION J – APPROVAL & SIGNATURE', 3),
        new TableRow({
          children: [
            // Left Box: Approved by
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 30, after: 30 },
                  children: [
                    new TextRun({ text: 'Approved by (Sales Mgr/Dir): ', bold: true, size: 16 }),
                    new TextRun({ text: data.approval.approvedBy || '', size: 16 }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 100, after: 30 },
                  children: [
                    new TextRun({ text: 'Date: ', bold: true, size: 16 }),
                    new TextRun({ text: formatDateDisplay(data.approval.approvalDate), size: 16 }),
                  ],
                }),
              ],
            }),

            // Right Box: Sales Officer & Signature
            new TableCell({
              columnSpan: 2,
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: tableBordersAll,
              children: [
                new Paragraph({
                  spacing: { before: 30, after: 10 },
                  children: [
                    new TextRun({ text: 'Sales Officer: ', bold: true, size: 16 }),
                    new TextRun({ text: data.approval.salesOfficer || '', size: 16 }),
                  ],
                }),
                signatureData
                  ? new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 10, after: 10 },
                      children: [
                        new ImageRun({
                          data: signatureData,
                          transformation: { width: 140, height: 45 },
                          type: 'png',
                        }),
                      ],
                    })
                  : new Paragraph({
                      spacing: { before: 50, after: 50 },
                      children: [new TextRun({ text: '(Signature)', italics: true, size: 15 })],
                    }),
                new Paragraph({
                  spacing: { before: 10, after: 30 },
                  children: [
                    new TextRun({ text: 'Date: ', bold: true, size: 16 }),
                    new TextRun({
                      text: formatDateDisplay(data.approval.salesOfficerDate),
                      size: 16,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const doc = new Document({
      sections: [
        // Page 1 Section
        {
          properties: {
            page: {
              margin: {
                top: 540,
                right: 540,
                bottom: 540,
                left: 540,
              },
            },
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.BOTH,
                  children: [
                    new TextRun({ text: 'F-MK-0063', size: 15, font: 'Courier New' }),
                    new TextRun({ text: '\t\t\t\t\t\t\t\t' }),
                    new TextRun({
                      text: 'ISS: NO.01, REV: 01, ED: 08-MAY-26',
                      size: 15,
                      font: 'Courier New',
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            createHeaderTable(),
            page1FormTable,
          ],
        },

        // Page 2 Section
        {
          properties: {
            page: {
              margin: {
                top: 540,
                right: 540,
                bottom: 540,
                left: 540,
              },
            },
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.BOTH,
                  children: [
                    new TextRun({ text: 'F-MK-0063', size: 15, font: 'Courier New' }),
                    new TextRun({ text: '\t\t\t\t\t\t\t\t' }),
                    new TextRun({
                      text: 'ISS: NO.01, REV: 01, ED: 08-MAY-26',
                      size: 15,
                      font: 'Courier New',
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            createHeaderTable(),
            page2FormTable,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const trackingNo = data.customer.trackingNo || 'TIF-DOC';
    const cleanTrackingNo = trackingNo.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Customer_Training_Order_${cleanTrackingNo}.docx`;
    saveAs(blob, filename);
  } catch (error) {
    console.error('Failed to export Word document:', error);
    throw error;
  }
}
