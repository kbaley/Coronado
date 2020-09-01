import React from 'react';
import * as actions from '../../actions/invoiceActions';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceForm from './InvoiceForm';
import { InvoiceRow } from './InvoiceRow';
import Spinner from '../common/Spinner';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

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
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={{ width: 260 }}></TableCell>
          <TableCell>Number</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell>Date sent</TableCell>
          <TableCell align="right">Balance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <InvoiceForm
          show={show}
          onClose={handleClose}
          invoice={selectedInvoice}
          invoices={invoices}
          customers={customers}
          onSave={saveInvoice} />
        {isLoading ? <tr><td colSpan="4"><Spinner /></td></tr> :
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
      </TableBody>
    </Table>
  );
}
