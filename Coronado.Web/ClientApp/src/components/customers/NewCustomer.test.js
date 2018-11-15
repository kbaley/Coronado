import React from 'react';
import ConnectedNewCustomer, { NewCustomer } from './NewCustomer';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

describe('NewCustomer tests', () => {
  it('should render properly', () => {
    const tree = renderer
      .create(<NewCustomer />)
    expect(tree.toJSON()).toMatchSnapshot();
  }); 

  it('should map customers to props', () => {
    const customers = [{customerId: "moo", name: "cust1"}];
    const store = mockStore({customers});
    
    const wrapper = shallow(<ConnectedNewCustomer store={store} />);

    expect(wrapper.props().customers).toHaveLength(1);
    expect(wrapper.props().customers).toBe(customers);
  });
});