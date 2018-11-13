class InvoiceApi {
  static async getAllInvoices() {
    const response = await fetch("api/Invoices");
    return response.json();
  }
}

export default InvoiceApi;