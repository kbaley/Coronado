import React from 'react';
import ConnectedInvoicesPage, { InvoicesPage } from "./InvoicesPage";
import renderer from "react-test-renderer";
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

describe('InvoicesPage tests', () => {
  it('should render the component', () => {
    const tree = renderer
      .create(<InvoicesPage />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should map invoices to props', () => {
    const invoices = [{invoiceId: "id1", customer: "cust1"}];
    const store = mockStore({invoices});

    const wrapper = shallow(<ConnectedInvoicesPage store={store} />);

    expect(wrapper.props().invoices).toHaveLength(1);
    expect(wrapper.props().invoices).toBe(invoices);
  });
});