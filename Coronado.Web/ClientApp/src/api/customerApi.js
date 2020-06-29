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
    return response;
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
    return response;
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
    return response;
  }

  static async deleteCustomer(customerId) {
    return await fetch('/api/Customers/' + customerId, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}

export default CustomerApi;