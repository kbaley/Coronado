import * as types from '../constants/loginActionTypes';
import AuthApi from '../api/authApi';

export function loginSuccess(user) {
  return {type: types.LOGIN_SUCCESS, user};
}

export function loginAction() {
  return {type: types.LOGIN};
}

export const login = (email, password) => {
  return async (dispatch) => {
    dispatch(loginAction());
    const user = await AuthApi.login(email, password);
    localStorage.setItem('coronado-user', JSON.stringify(user))
    dispatch(loginSuccess(user));
  };
}
