import React, { Component } from 'react';
import { actionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DeleteIcon } from './icons/DeleteIcon';
import { EditIcon } from './icons/EditIcon';

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  deleteCategory(categoryId, categoryName) {
    this.props.deleteCategory(categoryId, categoryName);
  }

  startEditing(categoryId) {
    console.log(categoryId);
  }
  
  render() {
    return (<table className='table'>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Type</th>
          <th>Parent</th>
        </tr>
      </thead>
      <tbody>
        {this.props.categoryState.categories.map(cat => <tr key={cat.categoryId}>
          <td>
            <EditIcon onStartEditing={() => this.startEditing(cat.categoryId)} />
            <DeleteIcon onDelete={() => this.deleteCategory(cat.categoryId, cat.name)} />
          </td>
          <td>{cat.name}</td>
          <td>{cat.type}</td>
          <td>{cat.parent ? cat.parent.name : ""}</td>
        </tr>)}
      </tbody>
    </table>);
  }
}

export default connect(
    state => ({categoryState: state.categories, notifications: state.notifications}),
    dispatch => bindActionCreators(actionCreators, dispatch)
)(CategoryList);