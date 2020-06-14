import { authHeader } from './auth-header';
import { logout } from "./authApi";

class ReportApi {
  static async getNetWorthReport(year) {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    }
    if (!year) {
      year = new Date().getFullYear();
    }
    const response = await fetch("api/Reports/NetWorth?year=" + year, requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response.json();
  }

  static async getExpensesByCategoryReport(year) {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    if (!year) {
      year = new Date().getFullYear();
    }
    const response = await fetch("api/Reports/ExpensesByCategory?year=" + year, requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response.json();
  }

  static async getExpensesForCategoryAndMonth(categoryId, month) {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch("api/Reports/ExpensesForCategory?categoryId=" + categoryId + "&month=" + month, requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response.json();
  }

  static async getIncomeReport(year) {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    if (!year) {
      year = new Date().getFullYear();
    }
    const response = await fetch("api/Reports/Income?year=" + year, requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response.json();
  }

  static async getDashboardStats() {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch("api/Reports/GetDashboardStats", requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response.json();
  }

}

export default ReportApi;