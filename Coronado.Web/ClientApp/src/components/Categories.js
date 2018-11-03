import React, { Component } from 'react';
import { actionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CategoryList from './CategoryList';
import NewCategory from './NewCategory';

class Categories extends Component {
  displayName = Categories.name;

  componentDidMount() {
    this.props.actions.requestCategories();
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

function mapStateToProps(state) {
  return {
    categories: state.categoryState.categories,
    isLoading: state.categoryState.isLoading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);
