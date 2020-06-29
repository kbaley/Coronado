import { authHeader } from './auth-header';
import { logout } from "./authApi";

class CategoryApi {
  static async getAllCategories() {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch("api/Categories", requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response;
  }

  static async updateCategory(category) {
    const response = await fetch('/api/Categories/' + category.categoryId, {
      method: 'PUT',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    return response;
  }

  static async deleteCategory(categoryId) {
    return await fetch('/api/Categories/' + categoryId, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  static async createCategory(category) {
    const response = await fetch('/api/Categories', {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    return response.json();
  }
}


export default CategoryApi;