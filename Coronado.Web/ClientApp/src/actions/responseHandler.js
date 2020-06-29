import { logout } from "../api/authApi";
import { error } from 'react-notification-system-redux';

export async function handleResponse(dispatch, response, successCallback) {
  if (response.ok) {
    successCallback();
  } else {
    handleError(response, dispatch);
  }
}

export default async function handleApiCall(dispatch, apiCall, successCall) {
  const response = await apiCall();
  await handleResponse(dispatch, response,
    async () => {
      if (successCall) {
        dispatch(successCall(await response.json()));
      }
    });
}

const handleError = (response, dispatch) => {
  let message = response.statusText;
  switch (response.status) {
    case 404:
      message = "API not found. Is the app running?";
      break;
    case 500:
      message = "Server error. Check the backend."
      break;
    case 401:
      message = "Not logged in.";
      logout();
      break;
    default:
  }
  const notificationOpts = {
    title: "An error occurred",
    message,
    position: 'bl',
    autoDismiss: 0,
  };
  dispatch(error(notificationOpts));
}