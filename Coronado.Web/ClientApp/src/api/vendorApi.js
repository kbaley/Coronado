class VendorApi {

  static async getVendors() {
    const response = await fetch(this.baseUrl);
    return response.json();
  }
}

VendorApi.baseUrl = "/api/Vendors"
export default VendorApi;