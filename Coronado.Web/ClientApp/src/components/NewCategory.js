import React, { Component } from 'react';
import { actionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import CategoryForm from './CategoryForm';
import { NewIcon } from './icons/NewIcon';
import './NewCategory.css';

class NewCategory extends Component {
  displayName = NewCategory.name;
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
    return (<span>
        <NewIcon onClick={this.showForm} className="new-category"/>
        <CategoryForm show={this.state.show} onClose={this.handleClose} onSave={this.saveCategory}
          categories={this.props.categories} />
      </span>);
  };
}

export default connect(
  state => state.categories,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(NewCategory);