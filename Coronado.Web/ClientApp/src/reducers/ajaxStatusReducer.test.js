import { ajaxStatusReducer } from "./ajaxStatusReducer";
import initialState from './initialState';
import { LOAD_ACCOUNTS, LOAD_ACCOUNTS_SUCCESS } from "../constants/accountActionTypes";
import { LOAD_CATEGORIES, LOAD_CATEGORIES_SUCCESS } from "../constants/categoryActionTypes";

describe('ajaxStatusReducer tests', () => {
  it('should fall through', () => {
    const action = {type: "SOMETHING ELSE"};
    const state = "My state";
    const newState = ajaxStatusReducer(state, action);
    expect(newState).toBe(state);
  });

  it('should indicate when accounts are loading', () => {
    // ARRANGE
    const action = {type: LOAD_ACCOUNTS };
    const state = {};
    
    // ACT
    const newState = ajaxStatusReducer(state, action);

    // ASSERT
    expect(newState.accounts).toBe(true);
  });

  it('should reset when accounts loaded', () => {
    const action = {type: LOAD_ACCOUNTS_SUCCESS, accounts: []};
    const state = initialState.loading;
    const newState = ajaxStatusReducer(state, action);
    expect(newState.accounts).toBe(false);
  });

  it('should indicated when categories are loading', () => {
    // ARRANGE
    const action = {type: LOAD_CATEGORIES };
    const state = {};
    
    // ACT
    const newState = ajaxStatusReducer(state, action);

    // ASSERT
    expect(newState.categories).toBe(true);
  });

  it('should reset when categories loaded', () => {
    // ARRANGE
    const action = {type: LOAD_CATEGORIES_SUCCESS, categories: []};
    const state = initialState.loading;

    // ACT
    const newState = ajaxStatusReducer(state, action);

    // ASSERT
    expect(newState.categories).toBe(false);
  });
});