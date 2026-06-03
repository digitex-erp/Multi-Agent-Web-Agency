import { AGENCY_BILLING, type BankTransferDetails } from '../config/agencyBilling.ts';

export interface InvoicePaymentContext {
  invoiceNumber?: string;
  amount?: number;
  currency?: string;
  dueDate?: string;
}

/** Plain-text block for PDF generators and email footers */
export function formatInvoicePaymentPlainText(ctx: InvoicePaymentContext = {}): string {
  const { bankTransfer: b } = AGENCY_BILLING;
  const lines = [
    'PAYMENT INSTRUCTIONS — BANK TRANSFER / ONLINE (UPI)',
    '─'.repeat(48),
    AGENCY_BILLING.paymentInstructions,
    '',
    `Account Holder:  ${b.accountHolder}`,
    `Account Number:  ${b.accountNumber}`,
    `IFSC:            ${b.ifsc}`,
    `Bank:            ${b.bankName}`,
    `Branch:          ${b.branch}`,
    `Account Type:    ${b.accountType}`,
    `MMID:            ${b.mmid}`,
    `UPI (VPA):       ${b.upiVpa}`,
    '',
    'Accepted: NEFT · RTGS · IMPS · UPI online transfer',
  ];

  if (ctx.invoiceNumber) lines.push('', `Invoice Reference: ${ctx.invoiceNumber}`);
  if (ctx.amount != null) {
    const cur = ctx.currency ?? AGENCY_BILLING.currency;
    lines.push(`Amount Due: ${cur} ${ctx.amount.toLocaleString()}`);
  }
  if (ctx.dueDate) lines.push(`Due Date: ${ctx.dueDate}`);

  return lines.join('\n');
}

/** Markdown block for reports / markdown-to-PDF pipelines */
export function formatInvoicePaymentMarkdown(ctx: InvoicePaymentContext = {}): string {
  const { bankTransfer: b } = AGENCY_BILLING;
  const meta: string[] = [];
  if (ctx.invoiceNumber) meta.push(`**Invoice #:** ${ctx.invoiceNumber}`);
  if (ctx.amount != null) {
    const cur = ctx.currency ?? AGENCY_BILLING.currency;
    meta.push(`**Amount due:** ${cur} ${ctx.amount.toLocaleString()}`);
  }
  if (ctx.dueDate) meta.push(`**Due date:** ${ctx.dueDate}`);

  return [
    '## Payment instructions',
    '',
    AGENCY_BILLING.paymentInstructions,
    '',
    ...meta,
    meta.length ? '' : undefined,
    '| Field | Details |',
    '|-------|---------|',
    `| Account holder | ${b.accountHolder} |`,
    `| Account number | ${b.accountNumber} |`,
    `| IFSC | ${b.ifsc} |`,
    `| Bank | ${b.bankName} |`,
    `| Branch | ${b.branch} |`,
    `| Account type | ${b.accountType} |`,
    `| MMID | ${b.mmid} |`,
    `| UPI (VPA) | ${b.upiVpa} |`,
    '',
    '*Bank transfer or UPI online transfer. No card payment gateway.*',
  ]
    .filter(Boolean)
    .join('\n');
}

/** HTML fragment for Puppeteer / react-pdf invoice templates */
export function formatInvoicePaymentHtml(ctx: InvoicePaymentContext = {}): string {
  const { bankTransfer: b } = AGENCY_BILLING;
  const rows: Array<[string, string]> = [
    ['Account holder', b.accountHolder],
    ['Account number', b.accountNumber],
    ['IFSC', b.ifsc],
    ['Bank', b.bankName],
    ['Branch', b.branch],
    ['Account type', b.accountType],
    ['MMID', b.mmid],
    ['UPI (VPA)', b.upiVpa],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#64748b;font-size:11px;">${label}</td><td style="padding:6px 12px;font-weight:600;font-size:11px;">${value}</td></tr>`
    )
    .join('');

  const metaHtml = [
    ctx.invoiceNumber ? `<p><strong>Invoice #:</strong> ${ctx.invoiceNumber}</p>` : '',
    ctx.amount != null
      ? `<p><strong>Amount due:</strong> ${ctx.currency ?? AGENCY_BILLING.currency} ${ctx.amount.toLocaleString()}</p>`
      : '',
    ctx.dueDate ? `<p><strong>Due date:</strong> ${ctx.dueDate}</p>` : '',
  ]
    .filter(Boolean)
    .join('');

  return `
<section style="margin-top:24px;padding:16px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;">
  <h3 style="margin:0 0 8px;font-size:13px;color:#0f172a;">Payment instructions — bank transfer / UPI</h3>
  <p style="margin:0 0 12px;font-size:11px;color:#475569;">${AGENCY_BILLING.paymentInstructions}</p>
  ${metaHtml}
  <table style="width:100%;border-collapse:collapse;margin-top:8px;">${tableRows}</table>
  <p style="margin:12px 0 0;font-size:10px;color:#64748b;">NEFT · RTGS · IMPS · UPI online transfer</p>
</section>`.trim();
}

export function getBankTransferDetails(): BankTransferDetails {
  return { ...AGENCY_BILLING.bankTransfer };
}
