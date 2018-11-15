import React from 'react';
import CustomersPage from "./CustomersPage";
import renderer from "react-test-renderer";

jest.mock('./NewCustomer', () => 'new customer');

describe('CustomersPage tests', () => {
  it('should render the component', () => {
    const tree = renderer
      .create(<CustomersPage />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

});