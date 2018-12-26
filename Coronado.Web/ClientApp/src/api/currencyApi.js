class CurrencyApi {

  static async getCurrencies() {
    // Support only for CAD for now
    const response = await fetch(this.baseUrl + "?symbol=CAD");
    return response.json();
  }
}

CurrencyApi.baseUrl = "/api/currencies"
export default CurrencyApi;