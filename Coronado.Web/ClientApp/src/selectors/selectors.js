import { each } from 'lodash';

export function getCategoriesForDropdown(categories, accounts, invoices) {
  let categoryList = categories.slice();
  each(accounts, a => {
    categoryList.push({ categoryId: 'TRF:' + a.accountId, name: 'TRANSFER: ' + a.name, accountId: a.accountId });
  });
  each(accounts, a => {
    if (a.accountType === "Mortgage") {
      categoryList.push({ categoryId: 'MRG:' + a.accountId, name: 'MORTGAGE: ' + a.name, accountId: a.accountId });
    }
  });
  if (invoices) {
    each(invoices, i => {
      if (i.balance > 0) {
        categoryList.push(
          {
            categoryId: 'PMT:' + i.invoiceId,
            name: 'PAYMENT: ' + i.invoiceNumber + ' (' + i.balance.toFixed(2) + ')', 
            invoiceId: i.invoiceId,
            balance: i.balance
          });

      }
    });
  }
  return categoryList;
}