import React from 'react';
import * as actions from '../../actions/invoiceActions';
import { useDispatch, useSelector } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { NewIcon } from '../icons/NewIcon';
import InvoiceForm from './InvoiceForm';

export default function NewInvoice() {
  const [ show, setShow ] = React.useState(false);
  const customers = useSelector(state => state.customers);
  const dispatch = useDispatch();

  React.useEffect(() => {
    Mousetrap.bind('n i', showForm);

    return function cleanup() {
      Mousetrap.unbind('n i');
    }
  })

  const showForm = () => {
    setShow(true);
    return false;
  }

  const handleClose = () => {
    setShow(false);
  }

  const saveInvoice = (invoice) => {
    dispatch(actions.createInvoice(invoice));
  }

    return (<span>
        <NewIcon onClick={showForm} />
        <InvoiceForm show={show} onClose={handleClose} onSave={saveInvoice} customers={customers} />
      </span>);
  };
