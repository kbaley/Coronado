import React, { Component } from 'react';
import * as actions from '../../actions/invoiceActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InvoiceForm from './InvoiceForm';
import './InvoiceList.css';
import { InvoiceRow } from './InvoiceRow';
import Spinner from '../common/Spinner';

class InvoiceList extends Component {
  constructor(props) {
    super(props);
    this.deleteInvoice = this.deleteInvoice.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.saveInvoice = this.saveInvoice.bind(this);
    this.state = {
      show: false,
      selectedInvoice: {}
    }
  }

  deleteInvoice(invoiceId, invoiceNumber) {
    this.props.actions.deleteInvoice(invoiceId, invoiceNumber);
  }

  startEditing(invoice) {
    invoice = this.props.invoices.filter(i => i.invoiceId === invoice.invoiceId)[0];
    
    this.setState({show:true, selectedInvoice: invoice});
  }

  handleClose() {
    this.setState({show:false});
  }

  saveInvoice(invoice) {
    this.props.actions.updateInvoice(invoice);
  }
  
  render() {
    return (
    <table className='table invoice-list'>
      <thead>
        <tr>
          <th></th>
          <th>Number</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        <InvoiceForm 
          show={this.state.show} 
          onClose={this.handleClose} 
          invoice={this.state.selectedInvoice} 
          invoices={this.props.invoices}
          customers={this.props.customers}
          onSave={this.saveInvoice} />
        { this.props.isLoading ? <tr><td colSpan="4"><Spinner /></td></tr> :
          this.props.invoices.map(invoice => 
        invoice.balance > 0 && <InvoiceRow 
          key={invoice.invoiceId} 
          invoice={invoice} 
          onEdit={() => this.startEditing(invoice)} 
          onDelete={()=>this.deleteInvoice(invoice.invoiceId, invoice.invoiceNumber)} />
        )}
      </tbody>
    </table>
    );
  }
}

function mapStateToProps(state) {
  return {
    invoices: state.invoices,
    notifications: state.notifications,
    customers: state.customers,
    isLoading: state.loading.invoices
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InvoiceList);