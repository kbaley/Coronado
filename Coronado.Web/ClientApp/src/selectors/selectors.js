import { each } from 'lodash';

export function getCategoriesForDropdown(categories, accounts) {
  let categoryList = categories.slice();
  each (accounts, a => {
    categoryList.push({categoryId: 'TRF:' + a.accountId, name: 'TRANSFER: ' + a.name, accountId: a.accountId});
  });
  each(accounts, a => {
    if (a.accountType === "Mortgage") {
      categoryList.push({categoryId: 'MRG:' + a.accountId, name: 'MORTGAGE: ' + a.name, accountId: a.accountId});
    }
  });
  return categoryList;
}