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

### Shortcut keys:

  - `n a`: New account
  - `g n`: Go to invoices page
  - `g i`: Go to investments page
  - `g r`: Go to reports page
  - `g [1-9]`: Go to account page (too bad for you if you have more than 9 accounts)
  - `n c`: New category (when on categories page)
  - `n u`: New customer (when on customers page)
  - `n i`: New invoice (when on invoices page)
  - `n t`: New transaction (sets focus to the date field on an account detail page)

### Undo

Deleting some objects (e.g. accounts, invoices, categories, investments) can be undone within a certain timeframe (notable exception: transactions). When deleting something, the UI will be updated to reflect the item being deleted and a notification will appear indicating the item is deleted. The notification lies. The item is not deleted, it's in a holding pattern for a few seconds waiting for the notification to either be dismissed explicitly (by clicking on the X) or to run its course and go away. Once it is gone, _then_ an explicit command is sent to the server to delete the item.

If you click on the Undo button in the notification instead, the item is pulled from its holding pattern and reinserted into its rightful place. Similarly, if you refresh the page before the notification disappears, it won't be deleted.

### Invoices

Modify `wwwroot\SampleInvoiceTemplate.html` as necessary and upload it on the invoices page. Template fields are indicated with `{{CurlyBraces}}` and all available fields are included in the sample template.

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

Investments are for tracking holdings of stocks, ETFs, etc. Any changes on this page are not reflected in the net worth or other reports. I did this to simplify the reporting. Instead, the application half-expects there to be an account with type "Investment" somewhere. This is a holding account used to calculate reports (specifically the net worth an income reports) without having to dive into price histories for individual holdings.

The idea is this: keep track of your individual stocks in the investments page where you can add/remove investments and update the prices. It will support investments in either USD or CAD. Canadian holdings are converted to USD using https://api.exchangeratesapi.io. At regular intervals (preferably as close to the end of the month as possible), click the icon on the Investments page with two arrows. This will reconcile the current value of your investments with what is currently reported in your "Investment" account and create a reconciling entry using the built-in "gain/loss on investments" category. Which means the net worth report isn't always right up-to-the-minute but is close enough for my long-term sensibilities and during times of volatility, you can always click the reconciling entry button to bring it up-to-date.

One thing I sometimes do is, at the end of the month, delete all the intermediate ones during the month then click the reconcile button to create a single one. Only reason I do that is to reduce the number of "gain/loss" entries in the investment account.

Investment price retrieval uses the Yahoo Finance RapidAPI service. Set the `RapidApiKey` value in `appSettings` to use this. Historical currency values are not stored though the app keeps track of investment prices (though not automatically).

### Console app

The console app is currently under development. It relies on a key in `appSettings.json` for the URL to the API. For example:

```
  "Coronado": {
    "url": "http://localhost:5000/api/"
  }
```

This can be provided in the command to launch the app as well: `dotnet run --Coronado:url=https://mysite.net/api`.

The following commands are available:

- `la` or `list-accounts`: List all accounts and their balances in their home currency
- `ga<#>`: Go to an account. The number corresponds to its alias in the account listing. This will list the 10 most recent transactions in the account
- `lt` or `list-transactions`: List the 10 most recent transactions in the selected account. 
- `nt` or `new-transaction`: Starts a new transaction in the selected account.
- `li` or `list-investments`: Lists the investments
- `uip` or `update-investment-prices`: Retrieve the latest prices (from the Yahoo finance API) of all investments and update them.

The application uses a fork of https://github.com/tonerdo/readline which mimics many GNU Readline commands, such as using the up and down arrows for command history. There is also auto-complete which is used when entering new transactions.

#### New transactions

After selecting an account (with `ga<#>`), start a new transaction with `nt` or `new-transaction`. You'll be prompted to enter the transaction date, vendor, category, description, and amount.

The default date is today. Press the up or down arrow to quickly navigate forward or back one day.

The vendor and category fields support autocomplete. Type the first few letters, then press Tab to autocomplete. If there is more than one result, keep press Tab or Shift Tab to iterate forward and backward through them.

The amount must be negative to debit the account and positive to credit it. 

## Still to come

- ~some form of scrolling mechanism for accounts with lots of transactions~
- currency conversion (e.g. automatic creation of transactions at the end of the month)
- transaction tagging (e.g. `spring 2018 vacation` or `rental expense`)
- ~console app to enter certain things (e.g. transactions) quickly from the command line~
- reconcile transactions for outdated banks with crappy online service (*cough* ScotiaBank *cough*)
- ~QIF import~ (maybe export)
- nested categories
- ~net worth report~
- simple balance sheet
- ~simple income report~
- ~income vs. expenses report~
- reimbursable expenses (mark expenses as reimbursable so they can be tracked if they have been paid)
- simple what-if mortgage analysis (e.g. effect of extra payment, effect of increased regular payments)
- possibly budgeting but not likely since I'm so bad at it

## Tech

ASP.NET Core in the back, React in the front, PostgreSQL for the database

Why PostgreSQL? I started this project at a remote-ish cabin in Canada. I had no internet and cell service was slow and, because my provider is in Panama, expensive. I didn't have SQL Server on the VM I normally do Windows development work and, since this a .NET Core app, I wasn't keen to work in the VM anyway. My host machine (macOS) had only PostgreSQL installed as a Docker container from some previous work I had done so I went with that. Since then, I've grown to like it though I recommend something like DataGrip over the stock pgAdmin these days.

The `sql-server` branch contains a version that works with SQL Server though the migrations are out of date. I did a test migration and it was pretty straight-forward:

- Replace all `NpgsqlConnection` references in the repositories to `SqlConnection`
- Update the `ApplicationDbContext` in `Startup.cs` to `UseSqlServer`
- Delete existing migrations
- Update connection string as necessary. Note that SQL Server uses `User Id` in the connection string whereas Postgres uses `UserId`
- Run `dotnet ef migrations add InitialMigration` then `dotnet ef database update`

To migrate data, use `pg_dump` with `--data-only` and --column-inserts` to get a SQL file with data inserts. It can be modified to work with SQL Server by removing all the Postgres stuff at the beginning, replacing `false` with `0`, replacing `true` with `1`, and removing foreign key constraints temporarily.

### Why Dapper _and_ Entity Framework?

I started with only EF. A few weeks in, I started hitting problems managing the interdependencies between my entities. Things like accounts having transactions which link to other accounts, etc. It's been a while since I've had to deal with a full ORM and I don't have the patience for it anymore so I switched to Dapper for some of the more complicated data access and cases where I need to aggregate (e.g. account balances) or for reports. EF6 remains for the remaining stuff.

### Deploying

- `dotnet publish --configuration=Release`
- Then deploy from VS Code from the Azure plugin in the left menu
- At some vague point in the future, try to set this up in GitHub Actions or Travis but honestly VS Code works well for a single developer and user

### Backup/restore

Backup:

1) Right-click the database to backup in Azure and select Backup...
2) Options:
    - Filename: coronadoSchema.backup (If directory not specified, file is saved in the user directory)
    - Only schema: Yes
    - Blobs: Yes
    - Do not save Owner: Yes
    - Verbose messages: Yes
3) Repeat for data with the following options:
    - Filename: coronadoData.backup
    - Only data: Yes
    - Blobs: Yes
    - Do not save Owner: Yes
    - Verbose messages: Yes


Restore:

1) Delete existing database and create a new one with the same name
2) Right-click the database and select Restore...
3) Options:
    - Only schema: Yes
    - Do not save Owner: Yes
    - Single transaction: Yes
    - Verbose messages: Yes
    - Exit on error: Yes
4) Restore data options:
    - Only data: Yes
    - Do not save Owner: Yes
    - Single transaction: Yes
    - Disable Trigger: Yes
    - Verbose messages: Yes
    - Exit on error: Yes

### Acknowledgements

I started this section _very_ late and I will try to edit this as my memory and time allows. If you feel some stuff here looks familiar and you should be credited, let me know.

- Error-handling borrowed from: https://github.com/CodeMazeBlog/react-series/tree/react-series-part5-end
- [Testing React Applications with Jest - Pluralsight](https://www.pluralsight.com/courses/testing-react-applications-jest)
- [Building Applications with React and Redux - Pluralsight](https://app.pluralsight.com/library/courses/react-redux-react-router-es6/)
- 