import React, { Component } from 'react';
import { actionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DeleteIcon } from './icons/DeleteIcon';
import { EditIcon } from './icons/EditIcon';
import CategoryForm from './CategoryForm';
import './CategoryList.css';

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.saveCategory = this.saveCategory.bind(this);
    this.state = {
      show: false,
      selectedCategory: {}
    }
  }

  deleteCategory(categoryId, categoryName) {
    this.props.deleteCategory(categoryId, categoryName);
  }

  startEditing(category) {
    this.setState({show:true, selectedCategory: category});
  }

  handleClose() {
    this.setState({show:false});
  }

  saveCategory(category) {
    this.props.updateCategory(category);
  }
  
  render() {
    return (<table className='table category-list'>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Type</th>
          <th>Parent</th>
        </tr>
      </thead>
      <tbody>
        <CategoryForm show={this.state.show} onClose={this.handleClose} category={this.state.selectedCategory} onSave={this.saveCategory} />
        {this.props.categoryState.categories.map(cat => <tr key={cat.categoryId}>
          <td>
            <EditIcon onStartEditing={() => this.startEditing(cat)} />
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