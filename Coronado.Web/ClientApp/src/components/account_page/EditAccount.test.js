import React from 'react';
import EditAccount from "./EditAccount";
import renderer from 'react-test-renderer';

describe('EditAccount tests', () => {

  it('should render an EditIcon', () => {
    const tree = renderer
      .create(
        <EditAccount
          />
      );
    expect(tree.toJSON()).toMatchSnapshot();
  });  
});