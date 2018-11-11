  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

class CategoryApi {
  static async getAllCategories() {
    await sleep(5000);
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