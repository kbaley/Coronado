# Coronado Personal Finance App

Coronado is the personal finance app I want. I've tried QuickBooks, YNAB, Excel/Google spreadsheets, Wave, Zoho (invoices), Pocketsmith, and a few others to varying degrees and in the end, I kept running into issues, including:

- Doing one thing well but not others
- Slow
- Complicated
- Having to use two or three different technologies to get a full financial overview
- Assuming I live in a country where online banking works and is more automated
- Assuming I want to keep business and personal finances separate

Plus I wanted to learn React.

## Highlights

- Shortcut keys:
  - `n a`: New account
  - `g c`: Go to categories page
  - `g u`: Go to customers page
  - `g i`: Go to invoices page
  - `g [1-9]`: Go to account page
  - `n c`: New category (when on categories page)
  - `n u`: New customer (when on customers page)
  - `n i`: New invoice (when on invoices page)

### Invoices

Copy `wwwroot\SampleInvoiceTemplate.html` to `wwwroot\InvoiceTemplate.html` and edit as necessary. Template fields are indicated with `{{CurlyBraces}}` and all available fields are included in the sample template. Files called `InvoiceTemplate.html` are ignored by git to prevent them being checked in.

Payments for invoices can be entered as transactions with a category of:

> PAYMENT: {invoice number} ({Remaining balance})

### Mortgages

Two types of mortgage payment are available: fixed payment and fixed principal.

### Fixed payment

This is the traditional mortgage payment where you pay the same amount each month and the amount that's applied to the principal increases over time. When this type of mortgage payment is selected while entering transactions, the amount of the payment will appear in the Debit column. Update this to match the amount applied to the principal and the Credit column will automatically update the interest. When committed, this will create two transactions: 1) a transfer from the current account to the mortgage account, and 2) a `Mortgage Interest` transaction

### Fixed principal

In this type of payment, the monthly payment varies. It includes a fixed amount applied to the principal each month and the interest is calculated based on the remaining mortgage balance and the time since the last payment. When entering this type of payment as a transaction, the Debit column will be populated to the fixed principal amount and you can enter the interest payment in the Credit column. When committed, this will create two transactions: 1) a transfer from the current account to the mortgage account, and 2) a `Mortgage Interest` transaction

### Bank fees

Bank fee transactions can be added automatically when entering a new transaction by appending the following to the description:

> bf: {amount} {bank fee description}

Example:

> Groceries bf: 6.00 currency conversion

When this transaction is committed, it will have a description of "Groceries". But a second transation will also be added in the amount of 6.00 (as a debit) and with a description of "currency conversion" and a category of "Bank Fees".

Multiple bank fees can be used. For example:

> Transfer to chequing bf: 1.00 transfer fee bf: 0.15 tax on transfer fee

This will add three transactions: the main one and two bank fees.

Of course, bank fee transactions can also be added manually as regular transactions with a category of "Bank Fees".


## Still to come

- investments
- currency conversion (e.g. automatic creation of transactions at the end of the month)
- transaction tagging (e.g. `spring 2018 vacation` or `rental expense`)
- QIF import (maybe export)
- nested categories
- net worth report
- simple balance sheet
- income report
- income vs. expenses report
- simple what-if mortgage analysis (e.g. effect of extra payment, effect of increased regular payments)
- possibly budgeting but not likely since I'm so bad at it