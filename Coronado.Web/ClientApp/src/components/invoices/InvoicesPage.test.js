import React from 'react';
import { InvoicesPage } from "./InvoicesPage";
import renderer from "react-test-renderer";
import { shallow } from 'enzyme';
// import configureMockStore from 'redux-mock-store';

// const mockStore = configureMockStore();

describe('InvoicesPage tests', () => {
  it('should render the component', () => {
    const tree = renderer
      .create(<InvoicesPage />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should map invoices to props', () => {
    


  });
});