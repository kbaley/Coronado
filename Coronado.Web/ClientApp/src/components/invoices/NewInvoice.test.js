import React from 'react';
import { NewInvoice } from './NewInvoice';
import renderer from 'react-test-renderer';

describe('NewInvoice tests', () => {
  it('should render properly', () => {
    const tree = renderer
      .create(<NewInvoice />)
    expect(tree.toJSON()).toMatchSnapshot();
  }); 
});