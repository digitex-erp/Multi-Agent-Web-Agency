# Client invoicing (offline payments)

This agency does **not** use a payment gateway. Converted clients pay via **bank transfer** or **UPI** using the details on each invoice PDF.

## Bank transfer details (source of truth)

Configured in [`src/config/agencyBilling.ts`](./src/config/agencyBilling.ts):

| Field | Value |
|-------|--------|
| Account holder | VISHAL ASHOK PENDHARKAR |
| Account number | 50100744781715 |
| IFSC | HDFC0009218 |
| Bank | HDFC Bank |
| Branch | MANKOLI |
| Account type | SAVING |
| MMID | 9240177 |
| UPI (VPA) | 9867638113@hdfcbank |

**Accepted methods:** NEFT · RTGS · IMPS · UPI online transfer

## Formatters for PDF generation

Use these when building invoice PDFs (Phase 6):

| Function | File | Output |
|----------|------|--------|
| `formatInvoicePaymentPlainText()` | `src/lib/invoicePaymentBlock.ts` | Plain text footer |
| `formatInvoicePaymentMarkdown()` | `src/lib/invoicePaymentBlock.ts` | Markdown section |
| `formatInvoicePaymentHtml()` | `src/lib/invoicePaymentBlock.ts` | HTML for Puppeteer / print |

Example:

```typescript
import { formatInvoicePaymentHtml } from './src/lib/invoicePaymentBlock.ts';

const paymentBlock = formatInvoicePaymentHtml({
  invoiceNumber: 'INV-2026-0042',
  amount: 400,
  currency: 'INR',
  dueDate: '2026-07-01',
});
// Embed paymentBlock in invoice HTML before PDF render
```

## API (for future invoice module)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/billing/payment-instructions` | JSON bank details + formatted snippets |

## Planned invoice PDF features

See [TODO.md](./TODO.md) — Lane E:

- **E5** Client invoice PDF with embedded bank transfer block
- **E1** Audit deck PDF (separate from client invoices)

## Default commercial terms

From [PROJECT-CONCEPT.md](./PROJECT-CONCEPT.md):

- **Model:** $400/mo retainer per converted client (adjust currency/amount in `agencyBilling.ts` for INR invoices)
- **Collection:** Manual reconciliation after bank/UPI transfer — no Stripe/PayPal/Razorpay in-app

## Updating bank details

Edit **only** `src/config/agencyBilling.ts`. All invoice PDFs and the Ledger UI read from that file.
