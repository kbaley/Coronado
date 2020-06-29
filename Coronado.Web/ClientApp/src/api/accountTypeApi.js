class AccountTypeApi {

  static async getAccountTypes() {
    const response = await fetch(this.baseUrl);
    return response;
  }
}

AccountTypeApi.baseUrl = "/api/AccountTypes"
export default AccountTypeApi;