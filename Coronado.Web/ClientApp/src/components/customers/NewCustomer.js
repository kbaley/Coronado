import React from 'react';
import * as actions from '../../actions/customerActions';
import { useDispatch } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { NewIcon } from '../icons/NewIcon';
import './NewCustomer.css';
import CustomerForm from './CustomerForm';

export default function NewCustomer() {
  const [ show, setShow ] = React.useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    Mousetrap.bind('n u', showForm);

    return function cleanup() {
      Mousetrap.unbind('n u');
    }
  })

  const saveCustomer = (customer) => {
    dispatch(actions.createCustomer(customer));
  }

  const showForm = () => {
    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
  }
    return (<span>
        <NewIcon onClick={showForm} className="new-customer"/>
        <CustomerForm show={show} onClose={handleClose} onSave={saveCustomer} />
      </span>);
}