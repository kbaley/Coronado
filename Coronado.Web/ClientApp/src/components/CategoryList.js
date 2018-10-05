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

  deleteCategory(categoryId, categoryName) {
    this.props.deleteCategory(categoryId, categoryName);
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
        {this.props.categoryState.categories.map(cat => <tr key={cat.categoryId}>
          <td>{cat.name}</td>
          <td>{cat.type}</td>
          <td>
            <DeleteIcon onDelete={() => this.deleteCategory(cat.categoryId, cat.name)} />
          </td>
        </tr>)}
      </tbody>
    </table>);
  }
}

export default connect(
    state => ({categoryState: state.categories, notifications: state.notifications}),
    dispatch => bindActionCreators(actionCreators, dispatch)
)(CategoryList);