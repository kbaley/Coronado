import React, { Component } from 'react';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CustomerForm from './CustomerForm';
import './CustomerList.css';
import { find } from 'lodash';
import { CustomerRow } from './CustomerRow';
import Spinner from '../common/Spinner';

class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.deleteCustomer = this.deleteCustomer.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.saveCustomer = this.saveCustomer.bind(this);
    this.getCustomerName = this.getCustomerName.bind(this);
    this.state = {
      show: false,
      selectedCustomer: {}
    }
  }

  deleteCustomer(customerId, customerName) {
    this.props.actions.deleteCustomer(customerId, customerName);
  }

  startEditing(customer) {
    this.setState({show:true, selectedCustomer: customer});
  }

  handleClose() {
    this.setState({show:false});
  }

  saveCustomer(customer) {
    this.props.actions.updateCustomer(customer);
  }

  getCustomerName(customerId) {
    if (!customerId || customerId === '') return '';

    var customer = find(this.props.customers, c => c.customerId === customerId);
    return customer ? customer.name : '';
  }
  
  render() {
    return (
    <table className='table customer-list'>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Street Address</th>
          <th>City</th>
          <th>Region</th>
        </tr>
      </thead>
      <tbody>
        <CustomerForm 
          show={this.state.show} 
          onClose={this.handleClose} 
          customer={this.state.selectedCustomer} 
          customers={this.props.customers}
          onSave={this.saveCustomer} />
        { this.props.isLoading ? <tr><td colSpan="2"><Spinner /></td></tr> :
          this.props.customers.map(cust => 
        <CustomerRow 
          key={cust.customerId} 
          customer={cust} 
          onEdit={() => this.startEditing(cust)} 
          onDelete={()=>this.deleteCustomer(cust.customerId, cust.name)} />
        )}
      </tbody>
    </table>
    );
  }
}

function mapStateToProps(state) {
  return {
    customers: state.customers,
    notifications: state.notifications,
    isLoading: state.loading.customers
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(customerActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerList);