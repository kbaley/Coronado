import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { actionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import CategoryForm from './CategoryForm';

class AddCategory extends Component {
  displayName = AddCategory.name;
  constructor(props) {
    super(props);
    this.saveCategory = this.saveCategory.bind(this);   
    this.showForm = this.showForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = { show: false, 
        category: {name: '', type: ''}
    };
  }

  componentDidMount() {
      Mousetrap.bind('n c', this.showForm);
  }

  componentWillUnmount() {
      Mousetrap.unbind('n c');
  }

  showForm() {
    this.setState({show:true});
    return false;
  }

  saveCategory(category) {
    this.props.saveNewCategory(category);
  }

  handleClose() {
    this.setState({show:false});
  }
  render() {
    return (<span className='add-icon'>
        <a onClick={this.showForm}>
        <Glyphicon glyph='plus-sign' />
        </a>
        <CategoryForm show={this.state.show} onClose={this.handleClose} onSave={this.saveCategory} />
      </span>);
  };
}

export default connect(
  state => state.categories,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(AddCategory);