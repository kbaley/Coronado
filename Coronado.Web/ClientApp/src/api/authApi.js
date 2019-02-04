class AuthApi {
  static async login(email, password) {
    const response = await fetch('/api/Auth/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Email: email, Password: password})
    });
    return response.json();
  }

}

export function logout() {
  localStorage.removeItem('coronado-user');
}

export default AuthApi;