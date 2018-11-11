import { loadAccountTypes } from "./accountTypeActions";
import { LOAD_ACCOUNT_TYPES_SUCCESS } from "../constants/accountTypeActionTypes";

describe('accountTypeActions tests', () => {

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should do nothing if account types are already loaded', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    getState.mockReturnValue({accountTypes: [{accountTypeId: "123", name: "type 1"}]});
    await loadAccountTypes()(dispatch, getState);
    expect(dispatch).not.toHaveBeenCalled();
    expect(getState).toHaveBeenCalled();
  }); 

  it('should load the account types into state', async () => {
    const returnedAccountTypes = [{accountTypeId: "moo", name: "moo"}];
    fetch.mockResponseOnce(JSON.stringify(returnedAccountTypes));
    const dispatch = jest.fn();
    const getState = jest.fn();
    getState.mockReturnValue({accountTypes: []});
    await loadAccountTypes()(dispatch, getState);
    expect(dispatch).toHaveBeenCalled();
    expect(fetch.mock.calls.length).toBe(1);
    expect(dispatch).toBeCalledWith({type: LOAD_ACCOUNT_TYPES_SUCCESS, accountTypes: returnedAccountTypes});
  });
});