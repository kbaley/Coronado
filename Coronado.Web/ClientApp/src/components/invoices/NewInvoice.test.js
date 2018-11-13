import React from 'react';
import ConnectedNewInvoice, { NewInvoice } from './NewInvoice';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

describe('NewInvoice tests', () => {
  it('should render properly', () => {
    const tree = renderer
      .create(<NewInvoice />)
    expect(tree.toJSON()).toMatchSnapshot();
  }); 

  it('should map invoices to props', () => {
    const invoices = [{invoiceId: "moo", customer: "cust1"}];
    const store = mockStore({invoices});
    
    const wrapper = shallow(<ConnectedNewInvoice store={store} />);

    expect(wrapper.props().invoices).toHaveLength(1);
    expect(wrapper.props().invoices).toBe(invoices);
  });
});