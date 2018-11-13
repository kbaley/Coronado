import React from 'react';
import { NewTransactionRow } from './NewTransactionRow';
import {shallow} from 'enzyme';
import { CheckIcon } from "./icons/CheckIcon";
import { CategorySelect } from './common/CategorySelect';

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

  it('should update the transaction when the category is changed', () => {
    
    const account = { accountId: 'accountId'}
    const selectedCategory = { categoryId: 'catId', name: 'catName' }
    const wrapper = shallow(<NewTransactionRow account={account}/>);    

    expect(wrapper.state().trx.categoryId).toBeUndefined();
    wrapper.find(CategorySelect).simulate('categoryChanged', selectedCategory);
    expect(wrapper.state().trx.categoryId).toBe(selectedCategory.categoryId);
    expect(wrapper.state().trx.categoryDisplay).toBe(selectedCategory.name);

  });
});