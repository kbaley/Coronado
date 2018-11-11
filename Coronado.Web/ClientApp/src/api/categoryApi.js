class CategoryApi {
  static async getAllCategories() {
    const response = await fetch("api/Categories");
    return response.json();
  }

  static async updateCategory(category) {
    const response = await fetch('/api/Categories/' + category.categoryId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    return response.json();
  }

  static async createCategory(category) {
    const response = await fetch('/api/Categories', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    return response.json();
  }
}


export default CategoryApi;