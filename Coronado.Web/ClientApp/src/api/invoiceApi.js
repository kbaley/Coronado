import { authHeader } from './auth-header';
import { logout } from "./authApi";

class InvoiceApi {
  static async getAllInvoices() {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch("/api/Invoices", requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response;
  }

  static async createInvoice(invoice) {
    const response = await fetch('/api/Invoices', {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoice)
    });
    return response;
  }

  static async updateInvoice(invoice) {
    const response = await fetch('/api/Invoices/' + invoice.invoiceId, {
      method: 'PUT',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoice)
    });
    return response;
  }

  static async emailInvoice(invoiceId) {
    const response = await fetch('/Invoice/SendEmail?invoiceId=' + invoiceId, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response;
  }

  static async uploadTemplate(file) {
    const data = new FormData();
    data.append('file', file);
    const response = await fetch('api/Invoices/UploadTemplate/', {
      method: 'POST',
      headers: authHeader(),
      body: data
    });
    return response;
  }

  static async deleteInvoice(invoiceId) {
    return await fetch('/api/Invoices/' + invoiceId, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}

export default InvoiceApi;