import { CustomersMenu } from "./CustomersMenu";
import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from "react-router";

describe('CustomersMenu tests', () => {
  it('should render an CustomersMenu', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
        <CustomersMenu />
        </MemoryRouter>
      );
    expect(tree.toJSON()).toMatchSnapshot();
  });  

});