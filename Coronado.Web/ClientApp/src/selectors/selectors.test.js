import { getCategoriesForDropdown } from "./selectors";

describe("Selector tests", () => {

  describe("getCategoriesForDropdown", () => {
    let categories = [ {
      categoryId: "123",
      "name": "Bank Fees"
    }, {
      "categoryId": "qwe",
      "name": "Starting Balance"
    }, {
      "categoryId": "asd",
      "name": "Mortgage Interest"
    }];
    let accounts = [ {
      accountId: "123",
      name: "Chequing",
      accountType: "Bank"
    }, {
      accountId: "qwe",
      name: "Savings",
      accountType: "Bank"
    }, {
      accountId: "asd",
      name: "Mortgage",
      accountType: "Mortgage"
    }];
    beforeEach(() => {
      
    });
    it("should include a list of categories", () => {
      const categoryList = getCategoriesForDropdown(categories, accounts);
      expect(categoryList).toHaveLength(categories.length + accounts.length + (accounts.filter(a => a.accountType === "Mortgage").length));
      expect(categoryList).toContainEqual({categoryId: "123", name: "Bank Fees"});
      expect(categoryList).toContainEqual({categoryId: "TRF:123", name: "TRANSFER: Chequing", accountId: "123"});
      expect(categoryList).toContainEqual({categoryId: "MRG:asd", name: "MORTGAGE: Mortgage", accountId: "asd"});
    });
  });
});