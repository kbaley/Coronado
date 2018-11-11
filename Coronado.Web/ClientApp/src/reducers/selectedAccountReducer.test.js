import { selectedAccountReducer } from "./selectedAccountReducer";
import { SELECT_ACCOUNT } from "../constants/selectAccountActionTypes";

describe('selectedAccountReducer tests', () => {
  it('should select the account', () => {
    const state = "original account id";
    const action = {type:SELECT_ACCOUNT, accountId: "new account id"};
    const newState = selectedAccountReducer(state, action);
    expect(newState).toBe("new account id");
  });

  it('should fall through for other actions', () => {
    const state = "original account id";
    const action = {type:"SOMETHING ELSE", accountId: "new account id"};
    const newState = selectedAccountReducer(state, action);
    expect(newState).toBe(state);
  });
});