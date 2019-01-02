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
  - `g [1-9]`: Go to account page (too bad for you if you have more than 9 accounts)
  - `n c`: New category (when on categories page)
  - `n u`: New customer (when on customers page)
  - `n i`: New invoice (when on invoices page)
  - `n t`: New transaction (sets focus to the date field on an account detail page)

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

### Investments

This section is more or less hard-coded to my current situation. It assumes all investments are in CAD and need to be converted to USD and that they can be looked up as mutual funds on globeandmail.com.

Investment prices are screenscraped a maximum of once per day from https://www.theglobeandmail.com/investing/markets/funds/{symbol}.CF/performance/. Same with the current USD->CAD rate from https://api.exchangeratesapi.io/latest/?base=USD&symbols=CAD. This gives you a total in CAD and in USD. From there, correcting entries can be made to the first account marked as an investment type so bring it in sync with the current value for the purpose of net worth reporting.

Currency and investment gain/loss are not reported separately in the correcting entry and Coronado does not store historical rates of investments or currency. I thought about this for a while and decided I didn't care about keeping the two concepts separate; Coronado tracks only the total value of investments in USD.

## Still to come

- some form of scrolling mechanism for accounts with lots of transactions
- investments
- currency conversion (e.g. automatic creation of transactions at the end of the month)
- transaction tagging (e.g. `spring 2018 vacation` or `rental expense`)
- console app to enter certain things (e.g. transactions) quickly from the command line
- reconcile transactions for outdated banks with crappy online service (*cough* ScotiaBank *cough*)
- ~QIF import~ (maybe export)
- nested categories
- net worth report
- simple balance sheet
- income report
- income vs. expenses report
- reimbursable expenses (mark expenses as reimbursable so they can be tracked if they have been paid)
- simple what-if mortgage analysis (e.g. effect of extra payment, effect of increased regular payments)
- possibly budgeting but not likely since I'm so bad at it

## Tech

ASP.NET Core in the back, React in the front, PostgreSQL for the database

Why PostgreSQL? I started this project at my brother's cabin in Manitoba, Canada. He had no internet and cell service was slow and, because my provider is in Panama, expensive. I didn't have SQL Server on the VM I normally do Windows development work and, since this a .NET Core app, I wasn't keen to work in the VM anyway. My host machine (macOS) had only PostgreSQL installed as a Docker container from some previous work I had done so I went with that.

The `sql-server` branch contains a version that works with SQL Server though the migrations are out of date. I did a test migration and it was pretty straight-forward:

- Replace all `NpgsqlConnection` references in the repositories to `SqlConnection`
- Update the `ApplicationDbContext` in `Startup.cs` to `UseSqlServer`
- Delete existing migrations
- Update connection string as necessary. Note that SQL Server uses `User Id` in the connection string whereas Postgres uses `UserId`
- Run `dotnet ef migrations add InitialMigration` then `dotnet ef database update`

To migrate data, use `pg_dump` with `--data-only` and --column-inserts` to get a SQL file with data inserts. It can be modified to work with SQL Server by removing all the Postgres stuff at the beginning, replacing `false` with `0`, replacing `true` with `1`, and removing foreign key constraints temporarily.

### Why Dapper _and_ Entity Framework?

I started with only EF. A few weeks in, I started hitting problems managing the interdependencies between my entities. Things like accounts having transactions which link to other accounts, etc. It's been a while since I've had to deal with a full ORM and I don't have the patience for it anymore so I switched to Dapper for the data access. But I like how EF handles the migrations so I've kept it around for that purpose only.