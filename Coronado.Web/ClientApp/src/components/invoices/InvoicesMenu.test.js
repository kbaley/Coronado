import { InvoicesMenu } from "./InvoicesMenu";
import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from "react-router";

describe('InvoicesMenu tests', () => {
  it('should render an InvoicesMenu', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
        <InvoicesMenu />
        </MemoryRouter>
      );
    expect(tree.toJSON()).toMatchSnapshot();
  });  

});