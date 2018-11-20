class InvoiceApi {
  static async getAllInvoices() {
    const response = await fetch("api/Invoices");
    return response.json();
  }

  static async getInvoice(invoiceId) {
    const response = await fetch("/api/Invoices/" + invoiceId);
    return response.json();
  }

  static async createInvoice(invoice) {
    const response = await fetch('/api/Invoices', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoice)
    });
    return response.json();
  }

  static async updateInvoice(invoice) {
    const response = await fetch('/api/Invoices/' + invoice.invoiceId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoice)
    });
    return response.json();
  }
}

export default InvoiceApi;