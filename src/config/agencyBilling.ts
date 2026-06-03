/**
 * Agency billing & bank transfer details for client invoices (PDF).
 * No payment gateway — clients pay via bank transfer or UPI per invoice.
 */

export interface BankTransferDetails {
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  branch: string;
  accountType: string;
  mmid: string;
  upiVpa: string;
}

export interface AgencyBillingConfig {
  /** Display name on invoices */
  agencyLegalName: string;
  /** Default monthly retainer (PROJECT-CONCEPT model) */
  defaultRetainerAmount: number;
  currency: 'INR' | 'USD';
  paymentMethods: Array<'bank_transfer' | 'upi' | 'online_transfer'>;
  bankTransfer: BankTransferDetails;
  /** Shown on every invoice PDF footer */
  paymentInstructions: string;
}

export const AGENCY_BILLING: AgencyBillingConfig = {
  agencyLegalName: 'Multi-Agent Web Agency',
  defaultRetainerAmount: 400,
  currency: 'INR',
  paymentMethods: ['bank_transfer', 'upi', 'online_transfer'],
  bankTransfer: {
    accountHolder: 'VISHAL ASHOK PENDHARKAR',
    accountNumber: '50100744781715',
    ifsc: 'HDFC0009218',
    bankName: 'HDFC Bank',
    branch: 'MANKOLI',
    accountType: 'SAVING',
    mmid: '9240177',
    upiVpa: '9867638113@hdfcbank',
  },
  paymentInstructions:
    'Please remit payment by bank transfer (NEFT/RTGS/IMPS) or UPI online transfer. Quote the invoice number in the payment reference.',
};
