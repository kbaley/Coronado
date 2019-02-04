import { authHeader } from './auth-header';
import { logout } from "./authApi";

class CustomerApi {
  static async getAllCustomers() {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch("api/Customers", requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response.json();
  }

  static async createCustomer(customer) {
    const response = await fetch('/api/Customers', {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    });
    return response.json();
  }

  static async updateCustomer(customer) {
    const response = await fetch('/api/Customers/' + customer.customerId, {
      method: 'PUT',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    });
    return response.json();
  }
}

export default CustomerApi;