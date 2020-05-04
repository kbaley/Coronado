import React, { Component } from 'react';
import * as actions from '../../actions/invoiceActions';
import CustomTable from '../common/Table';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InvoiceForm from './InvoiceForm';
import { InvoiceRow } from './InvoiceRow';
import Spinner from '../common/Spinner';

class InvoiceList extends Component {
  constructor(props) {
    super(props);
    this.deleteInvoice = this.deleteInvoice.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.saveInvoice = this.saveInvoice.bind(this);
    this.downloadInvoice = this.downloadInvoice.bind(this);
    this.emailInvoice = this.emailInvoice.bind(this);
    this.previewInvoice = this.previewInvoice.bind(this);
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

  downloadInvoice(invoiceId) {
    window.open("/invoice/GeneratePDF?invoiceId=" + invoiceId);
  }

  emailInvoice(invoiceId) {
    this.props.actions.emailInvoice(invoiceId);
  }

  previewInvoice(invoiceId) {
    window.open("/invoice/GenerateHTML?invoiceId=" + invoiceId);
  }
  
  render() {
    const showInvoice = (invoice) => {
      return invoice.balance > 0 || this.props.showPaid[0];
    }
    
    return (
      <CustomTable
        tableHeader={['', 'Number', 'Date', 'Customer', 'Email', 'Balance']}
        headerAlignment={['inherit', 'inherit', 'inherit', 'inherit', 'inherit', 'right']}
      >
        <InvoiceForm 
          show={this.state.show} 
          onClose={this.handleClose} 
          invoice={this.state.selectedInvoice} 
          invoices={this.props.invoices}
          customers={this.props.customers}
          onSave={this.saveInvoice} />
        { this.props.isLoading ? <tr><td colSpan="4"><Spinner /></td></tr> :
          this.props.invoices.map((invoice, key) => 
        showInvoice(invoice) && <InvoiceRow 
          key={invoice.invoiceId} 
          invoice={invoice} 
          onEdit={() => this.startEditing(invoice)} 
          onDownload={() => this.downloadInvoice(invoice.invoiceId)}
          onEmail={() => this.emailInvoice(invoice.invoiceId)}
          onPreview={() => this.previewInvoice(invoice.invoiceId)}
          onDelete={()=>this.deleteInvoice(invoice.invoiceId, invoice.invoiceNumber)} />
        )}
      </CustomTable>
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