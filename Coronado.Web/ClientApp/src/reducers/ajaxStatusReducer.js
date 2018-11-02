import * as types from '../constants/ajaxStatusActionTypes';
import * as accountTypes from '../constants/accountActionTypes';
import initialState from './initialState';

function actionTypeEndsInSuccess(type) {
  return type.substring(type.length - 8) == '_SUCCESS';
}

export default function ajaxStatusReducer(state = initialState.ajaxCallsInProgress, action) {
  if (action.type == types.BEGIN_AJAX_CALL) {
    return state + 1;
  } else if (action.type == accountTypes.RECEIVE_ACCOUNT_LIST ||
    actionTypeEndsInSuccess(action.type)) {
    return state - 1;
  }


  return state;
}
