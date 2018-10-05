import React, { Component } from 'react';
import { actionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DeleteIcon } from './DeleteIcon';

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  deleteCategory(categoryId) {
    this.props.deleteCategory(categoryId);
  }
  
  render() {
    return (<table className='table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {this.props.categories.map(cat => <tr key={cat.categoryId}>
          <td>{cat.name}</td>
          <td>{cat.type}</td>
          <td>
            <DeleteIcon onDelete={() => this.deleteCategory(cat.categoryId)} />
          </td>
        </tr>)}
      </tbody>
    </table>);
  }
}

export default connect(
    state => state.categories,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(CategoryList);