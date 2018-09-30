import React, { Component } from 'react';
import { actionCreators } from '../store/Categories';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

 class Categories extends Component {
  displayName = Categories.name;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.requestCategories();
  }

  render() {
    return (
      <div>
        {this.props.isLoading ? <p><em>Loading...</em></p> : (
          <div>
            <h1>Categories</h1>
            <CategoryList categories={this.props.categories} />
          </div>
        )}
      </div>
    );
  }
}

function CategoryList(props) {
  return (
    <table className='table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {props.categories.map(cat =>
          <tr key={cat.categoryId}>
            <td>{cat.name}</td>
            <td>{cat.type}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default connect(
  state => state.categories,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Categories);
