import React, { Component } from 'react';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CustomerForm from './CustomerForm';
import './CustomerList.css';
import { find } from 'lodash';
import { CustomerRow } from './CustomerRow';
import Spinner from '../common/Spinner';
import { withStyles, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";

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
    const { classes } = this.props;
    return (
      <Table className={classes.table}>
        <TableHead className={classes.primaryTableHeader}>
          <TableRow className={classes.tableHeadRow}>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}></TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Name</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Email</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Street Address</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>City</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Region</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
        </TableBody>
      </Table>
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
)(withStyles(styles)(CustomerList));