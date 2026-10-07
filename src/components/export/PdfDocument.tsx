import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CustomerTrainingForm } from '../../types/customerTraining';
import { formatCurrency, formatDateDisplay } from '../../utils/calculations';
import { LOGO_BASE64 } from '../../assets/logoBase64';

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 22,
    paddingRight: 22,
    fontSize: 7.2,
    fontFamily: 'Helvetica',
    color: '#000000',
    lineHeight: 1.2,
  },
  // Main Outer Table Box wrapping all content on the page
  pageBorderBox: {
    borderWidth: 1,
    borderColor: '#000000',
  },

  // Header Box
  headerBox: {
    flexDirection: 'row',
  },
  headerLogoCol: {
    width: '32%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  logoImg: {
    width: 95,
    height: 42,
    objectFit: 'contain',
  },

  logoTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 7,
    letterSpacing: 0.5,
  },
  headerRightCol: {
    width: '68%',
    flexDirection: 'column',
  },
  headerMainTitle: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingVertical: 3,
    paddingHorizontal: 4,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
  },
  headerMidRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    minHeight: 26,
  },
  headerMidLeft: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    padding: 2.5,
    justifyContent: 'space-between',
  },
  headerMidRight: {
    width: '60%',
    padding: 2.5,
    justifyContent: 'space-between',
  },
  headerBottomRow: {
    padding: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Section Headers & Cells
  sectionHeader: {
    backgroundColor: '#d9d9d9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingVertical: 2,
    paddingHorizontal: 4,
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.2,
  },
  rowItem: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  rowItemLast: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  twoColRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  twoColRowLast: {
    flexDirection: 'row',
  },
  colLeft60: {
    width: '60%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colRight40: {
    width: '40%',
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  threeColRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  colThree: {
    width: '33.33%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colThreeLast: {
    width: '33.34%',
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Typography
  boldLabel: {
    fontFamily: 'Helvetica-Bold',
    marginRight: 2,
    fontSize: 7,
  },
  normalValue: {
    fontFamily: 'Helvetica',
    fontSize: 7,
  },

  // Checkbox Widget
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    marginVertical: 0.5,
  },
  checkboxBox: {
    width: 7,
    height: 7,
    borderWidth: 0.8,
    borderColor: '#000000',
    marginRight: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxTick: {
    width: 3.5,
    height: 3.5,
    backgroundColor: '#000000',
  },
  checkboxLabel: {
    fontSize: 6.8,
    fontFamily: 'Helvetica',
  },
  checkboxLabelBold: {
    fontSize: 6.8,
    fontFamily: 'Helvetica-Bold',
  },

  // Footer (Outside page border)
  footerRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 6.5,
    fontFamily: 'Helvetica',
  },
});

interface PdfCheckProps {
  checked: boolean;
  label: string;
  extra?: string;
}

const PdfCheck: React.FC<PdfCheckProps> = ({ checked, label, extra }) => (
  <View style={styles.checkboxItem}>
    <View style={styles.checkboxBox}>
      {checked && <View style={styles.checkboxTick} />}
    </View>
    <Text style={checked ? styles.checkboxLabelBold : styles.checkboxLabel}>
      {label}
      {extra ? ` ${extra}` : ''}
    </Text>
  </View>
);

interface PdfDocumentProps {
  data: CustomerTrainingForm;
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({ data }) => {
  const finalPrice =
    typeof data.finance.finalPrice === 'number'
      ? data.finance.finalPrice
      : (Number(data.finance.totalPrice) || 0) - (Number(data.finance.discount) || 0);

  // Reusable Top Header (Page 1 & 2)
  const renderHeader = () => (
    <View style={styles.headerBox}>
      {/* Left Box: Logo Only */}
      <View style={styles.headerLogoCol}>
        <Image src={LOGO_BASE64} style={styles.logoImg} />
      </View>


      {/* Right Box */}
      <View style={styles.headerRightCol}>
        <Text style={styles.headerMainTitle}>
          CUSTOMER TRAINING ORDER &amp; TRACKING FORM
        </Text>

        <View style={styles.headerMidRow}>
          {/* Tracking No & Customer Type Label */}
          <View style={styles.headerMidLeft}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.boldLabel}>Tracking No:</Text>
              <Text style={[styles.normalValue, { fontFamily: 'Helvetica-Bold' }]}>
                {data.customer.trackingNo || ''}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Text style={styles.boldLabel}>Customer Type:</Text>
            </View>
          </View>

          {/* Customer Type Checkboxes */}
          <View style={styles.headerMidRight}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <PdfCheck checked={data.customer.customerType === 'Individual'} label="Individual" />
              <PdfCheck checked={data.customer.customerType === 'Group'} label="Group" />
              <PdfCheck
                checked={data.customer.customerType === 'Corporate'}
                label="Corporate"
                extra={data.customer.corporateName ? data.customer.corporateName : '................'}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 1 }}>
              <PdfCheck
                checked={data.customer.customerType === 'Agency'}
                label="Agency"
                extra={data.customer.agencyName ? data.customer.agencyName : '................'}
              />
            </View>
          </View>
        </View>

        {/* Joining Batch */}
        <View style={styles.headerBottomRow}>
          <Text style={styles.boldLabel}>Joining Batch:</Text>
          <Text style={styles.normalValue}>{data.customer.joiningBatch || ''}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Document title={`Customer_Training_Order_${data.customer.trackingNo || 'TIF'}`}>
      {/* ======================================================== */}
      {/*                         PAGE 1                           */}
      {/* ======================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.pageBorderBox}>
          {/* Top Header */}
          {renderHeader()}

          {/* SECTION A – DISTRIBUTION */}
          <Text style={styles.sectionHeader}>
            SECTION A – DISTRIBUTION (Sales controls &amp; sends to departments)
          </Text>
          <View style={styles.rowItem}>
            <Text style={[styles.boldLabel, { width: 50 }]}>Send to:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              {['Operation', 'Finance', 'Training', 'Standard/Compliance', 'Management'].map((dept) => (
                <PdfCheck
                  key={dept}
                  checked={(data.distribution.sendTo || []).includes(dept)}
                  label={dept}
                />
              ))}
            </View>
          </View>
          <View style={styles.rowItemLast}>
            <Text style={[styles.boldLabel, { width: 75 }]}>Customer status:</Text>
            <PdfCheck
              checked={data.distribution.customerStatus === 'Fulltime'}
              label="Fulltime"
            />
            <PdfCheck
              checked={data.distribution.customerStatus === 'Part Time'}
              label="Part Time"
            />
          </View>

          {/* SECTION B – CUSTOMER INFORMATION */}
          <Text style={styles.sectionHeader}>SECTION B – CUSTOMER INFORMATION</Text>
          <View style={styles.twoColRow}>
            <View style={styles.colLeft60}>
              <Text style={styles.boldLabel}>Full Name:</Text>
              <Text style={styles.normalValue}>{data.customer.fullName || ''}</Text>
            </View>
            <View style={styles.colRight40}>
              <Text style={styles.boldLabel}>Nickname:</Text>
              <Text style={styles.normalValue}>{data.customer.nickname || ''}</Text>
            </View>
          </View>
          <View style={styles.twoColRow}>
            <View style={styles.colLeft60}>
              <Text style={styles.boldLabel}>Date of Birth:</Text>
              <Text style={styles.normalValue}>{formatDateDisplay(data.customer.dateOfBirth)}</Text>
            </View>
            <View style={styles.colRight40}>
              <Text style={styles.boldLabel}>Nationality:</Text>
              <Text style={styles.normalValue}>{data.customer.nationality || ''}</Text>
            </View>
          </View>
          <View style={styles.twoColRow}>
            <View style={styles.colLeft60}>
              <Text style={styles.boldLabel}>ID/Passport No:</Text>
              <Text style={styles.normalValue}>{data.customer.idPassportNo || ''}</Text>
            </View>
            <View style={styles.colRight40}>
              <Text style={styles.boldLabel}>Phone:</Text>
              <Text style={styles.normalValue}>{data.customer.phone || ''}</Text>
            </View>
          </View>
          <View style={styles.twoColRow}>
            <View style={styles.colLeft60}>
              <Text style={styles.boldLabel}>Email:</Text>
              <Text style={styles.normalValue}>{data.customer.email || ''}</Text>
            </View>
            <View style={styles.colRight40}>
              <Text style={styles.boldLabel}>Line/WeChat:</Text>
              <Text style={styles.normalValue}>{data.customer.lineWechat || ''}</Text>
            </View>
          </View>
          <View style={styles.rowItemLast}>
            <Text style={styles.boldLabel}>Address:</Text>
            <Text style={styles.normalValue}>{data.customer.address || ''}</Text>
          </View>

          {/* SECTION C – EMERGENCY CONTACT */}
          <Text style={styles.sectionHeader}>
            SECTION C – EMERGENCY CONTACT (บุคคลที่ติดต่อได้ ในกรณีฉุกเฉิน )
          </Text>
          <View style={styles.twoColRow}>
            <View style={styles.colLeft60}>
              <Text style={styles.boldLabel}>Name:</Text>
              <Text style={styles.normalValue}>{data.emergencyContact.name || ''}</Text>
            </View>
            <View style={styles.colRight40}>
              <Text style={styles.boldLabel}>Phone:</Text>
              <Text style={styles.normalValue}>{data.emergencyContact.phone || ''}</Text>
            </View>
          </View>
          <View style={styles.twoColRow}>
            <View style={styles.colLeft60}>
              <Text style={styles.boldLabel}>Relationship:</Text>
              <Text style={styles.normalValue}>{data.emergencyContact.relationship || ''}</Text>
            </View>
            <View style={styles.colRight40}>
              <Text style={styles.boldLabel}>Email:</Text>
              <Text style={styles.normalValue}>{data.emergencyContact.email || ''}</Text>
            </View>
          </View>
          <View style={styles.rowItemLast}>
            <Text style={styles.boldLabel}>Additional contact (optional):</Text>
            <Text style={styles.normalValue}>{data.emergencyContact.additionalContact || ''}</Text>
          </View>

          {/* SECTION D – LICENSE & MEDICAL */}
          <Text style={styles.sectionHeader}>SECTION D – LICENSE &amp; MEDICAL</Text>
          <View style={styles.rowItem}>
            <Text style={[styles.boldLabel, { width: 70 }]}>Current License:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              {['None', 'Student', 'PPL', 'CPL', 'ATPL Theory'].map((lic) => (
                <PdfCheck
                  key={lic}
                  checked={data.licenseMedical.currentLicense === lic}
                  label={lic}
                />
              ))}
              <PdfCheck
                checked={data.licenseMedical.currentLicense === 'Other'}
                label="Other:"
                extra={data.licenseMedical.otherLicense || '________'}
              />
            </View>
          </View>
          <View style={styles.rowItem}>
            <Text style={[styles.boldLabel, { width: 60 }]}>Ratings held:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              {['SEP', 'MEP', 'IR'].map((r) => (
                <PdfCheck
                  key={r}
                  checked={(data.licenseMedical.ratingsHeld || []).includes(r)}
                  label={r}
                />
              ))}
              <PdfCheck
                checked={(data.licenseMedical.ratingsHeld || []).includes('Other')}
                label="Other:"
                extra={data.licenseMedical.otherRating || '________'}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.boldLabel}>Total Flight Time:</Text>
              <Text style={[styles.normalValue, { fontFamily: 'Helvetica-Bold', marginHorizontal: 2 }]}>
                {data.licenseMedical.totalFlightTime !== '' &&
                data.licenseMedical.totalFlightTime !== null
                  ? data.licenseMedical.totalFlightTime
                  : ''}
              </Text>
              <Text style={styles.normalValue}>hrs</Text>
            </View>
          </View>
          <View style={styles.rowItem}>
            <Text style={[styles.boldLabel, { width: 45 }]}>Medical:</Text>
            <PdfCheck checked={data.licenseMedical.medical === 'Class 1'} label="Class 1" />
            <PdfCheck checked={data.licenseMedical.medical === 'Class 2'} label="Class 2" />
            <PdfCheck checked={data.licenseMedical.medical === "Don't have"} label="Don't have" />
            <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 8 }}>
              <Text style={styles.boldLabel}>Issuing Authority:</Text>
              <Text style={styles.normalValue}>{data.licenseMedical.issuingAuthority || ''}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.boldLabel}>Expiry:</Text>
              <Text style={styles.normalValue}>{formatDateDisplay(data.licenseMedical.expiry)}</Text>
            </View>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.boldLabel}>Underlying disease/Remarks:</Text>
            <Text style={styles.normalValue}>{data.licenseMedical.underlyingDiseaseRemarks || ''}</Text>
          </View>
          <View style={styles.twoColRowLast}>
            <View style={styles.colLeft60}>
              <Text style={styles.boldLabel}>Drug allergy:</Text>
              <Text style={styles.normalValue}>{data.licenseMedical.drugAllergy || ''}</Text>
            </View>
            <View style={styles.colRight40}>
              <Text style={styles.boldLabel}>Food allergy:</Text>
              <Text style={styles.normalValue}>{data.licenseMedical.foodAllergy || ''}</Text>
            </View>
          </View>

          {/* SECTION E – COURSE ORDER DETAILS */}
          <Text style={styles.sectionHeader}>
            SECTION E – COURSE ORDER DETAILS (for Sales / Operation / Standard)
          </Text>
          <View style={styles.rowItem}>
            <Text style={[styles.boldLabel, { width: 75 }]}>Course ordered:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              {[
                'PPL',
                'CPL/IR Integrated + ATP',
                'IR',
                'ME',
                'ATP',
                'Conversion TCAR',
                'Recurrent',
                'Type Rating',
              ].map((c) => (
                <PdfCheck
                  key={c}
                  checked={(data.courseOrder.courses || []).includes(c)}
                  label={c}
                />
              ))}
              <PdfCheck
                checked={(data.courseOrder.courses || []).includes('Other')}
                label="Other:"
                extra={data.courseOrder.otherCourse || '____'}
              />
            </View>
          </View>
          <View style={styles.twoColRow}>
            <View style={styles.colLeft60}>
              <Text style={styles.boldLabel}>Aircraft type:</Text>
              <Text style={styles.normalValue}>{data.courseOrder.aircraftType || ''}</Text>
            </View>
            <View style={styles.colRight40}>
              <Text style={styles.boldLabel}>Package:</Text>
              <Text style={styles.normalValue}>{data.courseOrder.package || ''}</Text>
            </View>
          </View>
          <View style={styles.twoColRow}>
            <View style={styles.colLeft60}>
              <Text style={styles.boldLabel}>Preferred start:</Text>
              <Text style={styles.normalValue}>{formatDateDisplay(data.courseOrder.preferredStart)}</Text>
            </View>
            <View style={styles.colRight40}>
              <Text style={styles.boldLabel}>Est. duration:</Text>
              <Text style={styles.normalValue}>{data.courseOrder.estimatedDuration || ''}</Text>
            </View>
          </View>
          <View style={styles.rowItem}>
            <Text style={[styles.boldLabel, { width: 95 }]}>Training components:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              {['Ground', 'Flight', 'Simulator', 'CAAT Exam', 'Skill Test', 'ICAO ELP'].map((comp) => (
                <PdfCheck
                  key={comp}
                  checked={(data.courseOrder.trainingComponents || []).includes(comp)}
                  label={comp}
                />
              ))}
            </View>
          </View>
          <View style={styles.rowItemLast}>
            <Text style={styles.boldLabel}>Special requirements / notes:</Text>
            <Text style={styles.normalValue}>{data.courseOrder.specialRequirements || ''}</Text>
          </View>

          {/* SECTION F – Other */}
          <Text style={styles.sectionHeader}>SECTION F – Other</Text>
          <View style={[styles.rowItemLast, { flexWrap: 'wrap', paddingVertical: 3 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}>
              <Text style={styles.boldLabel}>Accommodation:</Text>
              <PdfCheck checked={data.otherServices.accommodation === 'Included'} label="Included" />
              <PdfCheck checked={data.otherServices.accommodation === 'Not Included'} label="Not Included" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}>
              <Text style={styles.boldLabel}>Meals:</Text>
              <PdfCheck checked={data.otherServices.meals === 'Included'} label="Included" />
              <PdfCheck checked={data.otherServices.meals === 'Not Included'} label="Not Included" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}>
              <Text style={styles.boldLabel}>Transportation:</Text>
              <PdfCheck checked={data.otherServices.transportation === 'Included'} label="Included" />
              <PdfCheck checked={data.otherServices.transportation === 'Not Included'} label="Not Included" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}>
              <Text style={styles.boldLabel}>Visa fee:</Text>
              <PdfCheck checked={data.otherServices.visaFee === 'Included'} label="Included" />
              <PdfCheck checked={data.otherServices.visaFee === 'Not Included'} label="Not Included" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.boldLabel}>Exam fee :</Text>
              <PdfCheck checked={data.otherServices.examFee === 'Included'} label="Included" />
              <PdfCheck checked={data.otherServices.examFee === 'Not Included'} label="Not Included" />
            </View>
          </View>
        </View>

        {/* Page 1 Footer */}
        <View style={styles.footerRow} fixed>
          <Text>F-MK-0063</Text>
          <Text>ISS: NO.01, REV: 01, ED: 08-MAY-26</Text>
        </View>
      </Page>

      {/* ======================================================== */}
      {/*                         PAGE 2                           */}
      {/* ======================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.pageBorderBox}>
          {/* Top Header */}
          {renderHeader()}

          {/* Other items/support */}
          <View style={styles.rowItemLast}>
            <Text style={styles.boldLabel}>Other items/support:</Text>
            <Text style={styles.normalValue}>{data.otherServices.otherSupport || ''}</Text>
          </View>

          {/* SECTION G – FINANCE (tracking) */}
          <Text style={styles.sectionHeader}>SECTION G – FINANCE (tracking)</Text>
          <View style={styles.threeColRow}>
            <View style={styles.colThree}>
              <Text style={styles.boldLabel}>Total price (THB):</Text>
              <Text style={styles.normalValue}>{formatCurrency(data.finance.totalPrice)}</Text>
            </View>
            <View style={styles.colThree}>
              <Text style={styles.boldLabel}>Discount:</Text>
              <Text style={styles.normalValue}>{formatCurrency(data.finance.discount)}</Text>
            </View>
            <View style={styles.colThreeLast}>
              <Text style={styles.boldLabel}>Final:</Text>
              <Text style={[styles.normalValue, { fontFamily: 'Helvetica-Bold' }]}>
                {finalPrice ? `${formatCurrency(finalPrice)}` : ''}
              </Text>
            </View>
          </View>
          <View style={styles.threeColRow}>
            <View style={styles.colThree}>
              <Text style={styles.boldLabel}>Deposit required:</Text>
            </View>
            <View style={styles.colThree}>
              <Text style={styles.boldLabel}>Deposit received:</Text>
              <Text style={styles.normalValue}>
                {data.finance.depositReceived ? `${formatCurrency(data.finance.depositReceived)}` : ''}
              </Text>
            </View>
            <View style={[styles.colThreeLast, { flexDirection: 'row', alignItems: 'center' }]}>
              <PdfCheck
                checked={data.finance.depositRequired === 'Yes'}
                label="Yes"
                extra={
                  data.finance.depositDate
                    ? `(Date: ${formatDateDisplay(data.finance.depositDate)})`
                    : '(Date:____________)'
                }
              />
              <PdfCheck checked={data.finance.depositRequired === 'No'} label="No" />
            </View>
          </View>
          <View style={styles.rowItem}>
            <Text style={[styles.boldLabel, { width: 80 }]}>Payment method:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              <PdfCheck checked={(data.finance.paymentMethod || []).includes('Cash')} label="Cash" />
              <PdfCheck checked={(data.finance.paymentMethod || []).includes('Transfer')} label="Transfer" />
              <PdfCheck
                checked={(data.finance.paymentMethod || []).includes('Installments')}
                label="...........Installments"
                extra={data.finance.installmentDetails ? `(${data.finance.installmentDetails})` : ''}
              />
              <PdfCheck
                checked={(data.finance.paymentMethod || []).includes('Corporate Balance')}
                label="Corporate Balance:"
                extra={
                  data.finance.corporateBalance
                    ? ` ${formatCurrency(data.finance.corporateBalance)} THB`
                    : ' __________ THB'
                }
              />
            </View>
          </View>
          <View style={styles.rowItem}>
            <Text style={[styles.boldLabel, { width: 55 }]}>Documents:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
              {['ID copy', 'Medical', 'License copy', 'Logbook', 'English/ELP', 'Photos'].map((doc) => (
                <PdfCheck
                  key={doc}
                  checked={(data.finance.documents || []).includes(doc)}
                  label={doc}
                />
              ))}
              <PdfCheck
                checked={(data.finance.documents || []).includes('Other')}
                label="Other:"
                extra={data.finance.otherDocument || '____'}
              />
            </View>
          </View>
          <View style={styles.rowItemLast}>
            <Text style={styles.boldLabel}>Eligibility verified:</Text>
            <PdfCheck checked={data.finance.eligibilityVerified === 'Yes'} label="Yes" />
            <PdfCheck checked={data.finance.eligibilityVerified === 'No'} label="No" />
            <View style={{ flexDirection: 'row', marginLeft: 12, flex: 1 }}>
              <Text style={styles.boldLabel}>Remarks:</Text>
              <Text style={styles.normalValue}>{data.finance.eligibilityRemarks || ''}</Text>
            </View>
          </View>

          {/* REMARKS / SPECIAL CONDITIONS */}
          <Text style={styles.sectionHeader}>REMARKS / SPECIAL CONDITIONS</Text>
          <View style={{ minHeight: 95, padding: 4 }}>
            <Text style={[styles.normalValue, { lineHeight: 1.3 }]}>
              {data.finance.remarks || ''}
            </Text>
          </View>

          {/* SECTION J – APPROVAL & SIGNATURE */}
          <Text style={styles.sectionHeader}>SECTION J – APPROVAL &amp; SIGNATURE</Text>
          <View style={{ flexDirection: 'row', minHeight: 80 }}>
            {/* Left Box: Approved by */}
            <View style={{ width: '50%', borderRightWidth: 1, borderRightColor: '#000000', padding: 4, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.boldLabel}>Approved by (Sales Mgr/Dir):</Text>
                <Text style={styles.normalValue}>{data.approval.approvedBy || ''}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <Text style={styles.boldLabel}>Date:</Text>
                <Text style={styles.normalValue}>{formatDateDisplay(data.approval.approvalDate)}</Text>
              </View>
            </View>

            {/* Right Box: Sales Officer & Signature */}
            <View style={{ width: '50%', padding: 4, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.boldLabel}>Sales Officer:</Text>
                <Text style={styles.normalValue}>{data.approval.salesOfficer || ''}</Text>
              </View>

              {/* Digital Signature Canvas Image */}
              <View style={{ height: 35, alignItems: 'center', justifyContent: 'center', marginVertical: 2 }}>
                {data.approval.signature ? (
                  <Image src={data.approval.signature} style={{ height: 32, width: 120, objectFit: 'contain' }} />
                ) : (
                  <Text style={{ fontSize: 6.5, color: '#9ca3af', fontStyle: 'italic' }}>
                    (Digital Signature)
                  </Text>
                )}
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.boldLabel}>Date:</Text>
                <Text style={styles.normalValue}>{formatDateDisplay(data.approval.salesOfficerDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Page 2 Footer */}
        <View style={styles.footerRow} fixed>
          <Text>F-MK-0063</Text>
          <Text>ISS: NO.01, REV: 01, ED: 08-MAY-26</Text>
        </View>
      </Page>
    </Document>
  );
};
