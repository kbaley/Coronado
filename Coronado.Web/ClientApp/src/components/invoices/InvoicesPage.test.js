import React from 'react';
import InvoicesPage from "./InvoicesPage";
import renderer from "react-test-renderer";

jest.mock('./NewInvoice', () => 'new invoice');

describe('InvoicesPage tests', () => {
  it('should render the component', () => {
    const tree = renderer
      .create(<InvoicesPage />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

});