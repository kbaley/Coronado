import React, { Component } from 'react';
import { actionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CategoryList from './CategoryList';
import NewCategory from './NewCategory';

class Categories extends Component {
  displayName = Categories.name;

  componentDidMount() {
    this.props.requestCategories();
  }

  render() {
    return (
      <div>
        {this.props.isLoading ? <p><em>Loading...</em></p> : (
          <div>
            <h1>
              Categories
              <NewCategory />
            </h1>
            <CategoryList categories={this.props.categories} />
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  state => state.categories,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Categories);
