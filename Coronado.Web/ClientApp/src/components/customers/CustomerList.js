import React from 'react';
import * as customerActions from '../../actions/customerActions';
import { useDispatch, useSelector } from 'react-redux';
import CustomerForm from './CustomerForm';
import { CustomerRow } from './CustomerRow';
import Spinner from '../common/Spinner';
import CustomTable from '../common/Table';

export default function CustomerList() {
  const [ show, setShow ] = React.useState(false);
  const [ selectedCustomer, setSelectedCustomer ] = React.useState({});
  const customers = useSelector(state => state.customers);
  const isLoading = useSelector(state => state.loading.customers);
  const dispatch = useDispatch();

  const deleteCustomer = (customerId, customerName) => {
    dispatch(customerActions.deleteCustomer(customerId, customerName));
  }

  const startEditing = (customer) => {
    setSelectedCustomer(customer);
    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
  }

  const saveCustomer = (customer) => {
    dispatch(customerActions.updateCustomer(customer));
  }

    return (
      <CustomTable
        tableHeader={["", "Name", "Email", "Street Address", "City", "Region"]}
      >
        <CustomerForm 
          show={show} 
          onClose={handleClose} 
          customer={selectedCustomer} 
          customers={customers}
          onSave={saveCustomer} />
        { isLoading ? <tr><td colSpan="2"><Spinner /></td></tr> :
          customers.map(cust => 
        <CustomerRow 
          key={cust.customerId} 
          customer={cust} 
          onEdit={() => startEditing(cust)} 
          onDelete={()=>deleteCustomer(cust.customerId, cust.name)} />
        )}
      </CustomTable>
    );
}
