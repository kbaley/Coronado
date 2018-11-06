import React, { Component } from 'react';
import { connect } from 'react-redux';
import CategoryList from './CategoryList';
import NewCategory from './NewCategory';

class Categories extends Component {
  displayName = Categories.name;

  render() {
    
    return (
      <div>
        <h1>
          Categories
          <NewCategory />
        </h1>
        <CategoryList categories={this.props.categories} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    categories: state.categoryState.categories,
  }
}

export default connect(
  mapStateToProps,
)(Categories);
