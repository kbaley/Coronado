import React, { Component } from 'react';
import NewCustomer from './NewCustomer';

export class CustomersPage extends Component {
  render() {
    return (
      <div>
        <h1>
          Customers <NewCustomer />
        </h1>
      </div>
    );
  }
}

export default CustomersPage;