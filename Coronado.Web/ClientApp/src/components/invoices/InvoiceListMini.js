import React from 'react';
import * as actions from '../../actions/invoiceActions';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceForm from './InvoiceForm';
import Spinner from '../common/Spinner';
import { Grid, makeStyles } from '@material-ui/core';
import { InvoiceRowMini } from './InvoiceRowMini';
import { groupBy, map, orderBy, filter } from 'lodash';

const styles = theme => ({
  date: {
    padding: 6,
    backgroundColor: "#eee",
  },
})

const useStyles = makeStyles(styles);

function DateTransactionList({ date, invoices }) {

  const classes = useStyles();
  const formatOptions = { year: 'numeric', month: 'long' };

  return (
    <React.Fragment>
      <Grid item
        xs={12}
        className={classes.date}
      >
        {new Date(date).toLocaleDateString("en-US", formatOptions)}
      </Grid>
      {invoices.map(invoice =>
        <InvoiceRowMini 
          key={invoice.invoiceId} 
          invoice={invoice} 
        />
      )}
    </React.Fragment>
  )
}

export default function InvoiceListMini({ showPaid }) {
  const [show, setShow] = React.useState(false);
  const [selectedInvoice] = React.useState({});
  const invoices = useSelector(state => state.invoices);
  const customers = useSelector(state => state.customers);
  const isLoading = useSelector(state => state.loading.invoices);
  const dispatch = useDispatch();
  const filtered = filter(invoices, invoice => invoice.balance > 0 || showPaid);
  const grouped = groupBy(filtered, "date");
  const mapped = map(grouped, (items, date) => ({
    date: date,
    items: items,
  }));
  const sorted = orderBy(mapped, 'date', 'desc');

  const handleClose = () => {
    setShow(false);
  }

  const saveInvoice = (invoice) => {
    dispatch(actions.updateInvoice(invoice));
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
      <Grid container spacing={2}>
          {isLoading ? <Grid item xs={12}><Spinner /></Grid> :
            sorted.map(invoice =>
              <DateTransactionList 
                key={invoice.date} 
                date={invoice.date}
                invoices={invoice.items} 
              />
            )}
      </Grid>
    </React.Fragment>
  );
}
