class ReportApi {
  static async getNetWorthReport() {
    const response = await fetch("api/Reports/NetWorth");
    return response.json();
  }

}

export default ReportApi;