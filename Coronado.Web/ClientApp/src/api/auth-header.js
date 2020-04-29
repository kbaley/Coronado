export function authHeader() {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem('coronado-user'));

  
  if (user && user.token) {
      return { 'Authorization': 'Bearer ' + user.token };
  } else {
      return {};
  }
}

export function defaultHeaders() {
  return {
    ...authHeader(),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}