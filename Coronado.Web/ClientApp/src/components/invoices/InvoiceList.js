import React from 'react';
import * as actions from '../../actions/invoiceActions';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceForm from './InvoiceForm';
import { InvoiceRow } from './InvoiceRow';
import Spinner from '../common/Spinner';
import { Grid } from '@material-ui/core';
import GridHeader from '../common/grid/GridHeader';
import * as widths from './InvoiceWidths';

export default function InvoiceList({ showPaid }) {
  const [show, setShow] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState({});
  const invoices = useSelector(state => state.invoices);
  const customers = useSelector(state => state.customers);
  const isLoading = useSelector(state => state.loading.invoices);
  const dispatch = useDispatch();

  const deleteInvoice = (invoiceId, invoiceNumber) => {
    dispatch(actions.deleteInvoice(invoiceId, invoiceNumber));
  }

  const startEditing = (invoice) => {
    invoice = invoices.filter(i => i.invoiceId === invoice.invoiceId)[0];
    setSelectedInvoice(invoice);
    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
  }

  const saveInvoice = (invoice) => {
    dispatch(actions.updateInvoice(invoice));
  }

  const downloadInvoice = (invoiceId) => {
    window.open("/invoice/GeneratePDF?invoiceId=" + invoiceId);
  }

  const emailInvoice = (invoiceId) => {
    dispatch(actions.emailInvoice(invoiceId));
  }

  const previewInvoice = (invoiceId) => {
    window.open("/invoice/GenerateHTML?invoiceId=" + invoiceId);
  }

  const showInvoice = (invoice) => {
    return invoice.balance > 0 || showPaid;
  }

  return (
    <React.Fragment>
        <InvoiceForm
          show={show}
          onClose={handleClose}
          invoice={selectedInvoice}
          invoices={invoices}
          customers={customers}
          onSave={saveInvoice} />
    <Grid container spacing={0}>
      <GridHeader xs={widths.ICON_WIDTH}></GridHeader>
      <GridHeader xs={widths.NUMBER_WIDTH}>Number</GridHeader>
      <GridHeader xs={widths.DATE_WIDTH}>Date</GridHeader>
      <GridHeader xs={widths.CUSTOMER_WIDTH}>Customer</GridHeader>
      <GridHeader xs={widths.DATE_SENT_WIDTH}>Date sent</GridHeader>
      <GridHeader xs={widths.BALANCE_WIDTH} alignRight>Balance</GridHeader>
        {isLoading ? <Grid item xs={12}><Spinner /></Grid> :
          invoices.map((invoice, key) =>
            showInvoice(invoice) &&
            <InvoiceRow
              key={invoice.invoiceId}
              invoice={invoice}
              onEdit={() => startEditing(invoice)}
              onDownload={() => downloadInvoice(invoice.invoiceId)}
              onEmail={() => emailInvoice(invoice.invoiceId)}
              onPreview={() => previewInvoice(invoice.invoiceId)}
              onDelete={() => deleteInvoice(invoice.invoiceId, invoice.invoiceNumber)} />
          )}
    </Grid>
    </React.Fragment>
  );
}
