import React from 'react';
import NewCustomer from './NewCustomer';
import CustomerList from './CustomerList';
import { useSelector } from 'react-redux';

export default function CustomersPage(props) {
  const customers = useSelector(state => state.customers);
  return (
    <div>
      <h1>
        Customers <NewCustomer />
      </h1>
      <CustomerList customers={customers} />
    </div>
    );
}
