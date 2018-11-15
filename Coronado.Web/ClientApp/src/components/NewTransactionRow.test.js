import React from 'react';
import ConnectedNewTransactionRow, { NewTransactionRow } from './NewTransactionRow';
import {shallow} from 'enzyme';
import { CheckIcon } from "./icons/CheckIcon";
import { CategorySelect } from './common/CategorySelect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

describe('NewTransactionRow tests', () => {
  it('should save when button clicked', () => {
    const account = { accountId: 'accountId'}
    const saveTransaction = jest.fn();
    const wrapper = shallow(<NewTransactionRow account={account}/>);    
    wrapper.instance().saveTransaction = saveTransaction;
    wrapper.instance().forceUpdate();

    wrapper.find(CheckIcon).simulate('click');

    expect(saveTransaction).toHaveBeenCalled();
  });

  it('should map dispatch to props', () => {

  });

  it('should update the transaction when the category is changed', () => {
    
    const account = { accountId: 'accountId'}
    const selectedCategory = { categoryId: 'catId', name: 'catName' }
    const wrapper = shallow(<NewTransactionRow account={account}/>);    

    expect(wrapper.state().trx.categoryId).toBeUndefined();
    wrapper.find(CategorySelect).simulate('categoryChanged', selectedCategory);
    expect(wrapper.state().trx.categoryId).toBe(selectedCategory.categoryId);
    expect(wrapper.state().trx.categoryDisplay).toBe(selectedCategory.name);

  });

  it('should update the props from state', () => {
    
    // ARRANGE
    const accounts = [{accountId: "moo", name: "account-name"}, {accountId: "mortgage1", name: "my mortgage", accountType: "Mortgage"}];
    const categories = [{categoryId: "cat1", name: "cat-name"}];
    const store = mockStore({accounts, categories});
    
    // ACT
    const wrapper = shallow(<ConnectedNewTransactionRow store={store} />);
    
    // ASSERT
    expect(wrapper.props().accounts).toHaveLength(2);
    expect(wrapper.props().accounts).toBe(accounts);
    expect(wrapper.props().categories).toHaveLength(4);
  });

});