class AccountTypeApi {

  static async getAccountTypes() {
    const response = await fetch(this.baseUrl);
    return response.json();
  }
}

AccountTypeApi.baseUrl = "/api/AccountTypes"
export default AccountTypeApi;