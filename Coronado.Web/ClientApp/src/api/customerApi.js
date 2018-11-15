class CustomerApi {
  static async getAllCustomers() {
    const response = await fetch("api/Customers");
    return response.json();
  }

  static async createCustomer(customer) {
    const response = await fetch('/api/Customers', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    });
    return response.json();
  }
}

export default CustomerApi;