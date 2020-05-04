import React, { Component } from 'react';
import * as actions from '../../actions/invoiceActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InvoiceForm from './InvoiceForm';
import { InvoiceRow } from './InvoiceRow';
import Spinner from '../common/Spinner';
import { Table, TableHead, TableRow, withStyles, TableBody, TableCell } from '@material-ui/core';
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";

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
    const { classes } = this.props;
    
    return (
      <Table className={classes.table}>
        <TableHead className={classes.primaryTableHeader}>
          <TableRow className={classes.tableHeadRow}>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}></TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Number</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Date</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Customer</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Email</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <InvoiceForm 
            show={this.state.show} 
            onClose={this.handleClose} 
            invoice={this.state.selectedInvoice} 
            invoices={this.props.invoices}
            customers={this.props.customers}
            onSave={this.saveInvoice} />
          { this.props.isLoading ? <tr><td colSpan="4"><Spinner /></td></tr> :
            this.props.invoices.map(invoice => 
          showInvoice(invoice) && <InvoiceRow 
            key={invoice.invoiceId} 
            invoice={invoice} 
            onEdit={() => this.startEditing(invoice)} 
            onDownload={() => this.downloadInvoice(invoice.invoiceId)}
            onEmail={() => this.emailInvoice(invoice.invoiceId)}
            onPreview={() => this.previewInvoice(invoice.invoiceId)}
            onDelete={()=>this.deleteInvoice(invoice.invoiceId, invoice.invoiceNumber)} />
          )}
        </TableBody>
      </Table>
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
)(withStyles(styles)(InvoiceList));