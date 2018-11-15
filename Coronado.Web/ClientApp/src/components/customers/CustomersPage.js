import React, { Component } from 'react';
import NewCustomer from './NewCustomer';
import CustomerList from './CustomerList';
import { connect } from 'react-redux';

export class CustomersPage extends Component {
  render() {
    return (
      <div>
        <h1>
          Customers <NewCustomer />
        </h1>
        <CustomerList customers={this.props.customers} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    customers: state.customers,
  }
}

export default connect(
  mapStateToProps
)(CustomersPage);