import { accountTypeReducer } from "./accountTypeReducer";
import { LOAD_ACCOUNT_TYPES_SUCCESS } from "../constants/accountTypeActionTypes";

describe('accountTypeReducer tests', () => {
  it('should fall through', () => {
    const action = {type: "SOMETHING ELSE"};
    const state = "My state";
    const newState = accountTypeReducer(state, action);
    expect(newState).toBe(state);
  });

  it('should load account types', () => {
    const accountTypes = [{
      accountTypeId: "qwe",
      name: "type 1"
    }, {
      accountTypeId: "123",
      name: "type 2"
    }]
    const action = {type: LOAD_ACCOUNT_TYPES_SUCCESS, accountTypes};
    const state = [];
    const newState = accountTypeReducer(state, action);
    expect(newState).toBe(accountTypes);
  });
});