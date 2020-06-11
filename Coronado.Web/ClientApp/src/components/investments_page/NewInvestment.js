import React from 'react';
import * as actions from '../../actions/investmentActions';
import { useDispatch, useSelector } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { NewIcon } from '../icons/NewIcon';
import './NewInvestment.css';
import InvestmentForm from './InvestmentForm';

export default function NewInvestment() {
  const [ show, setShow ] = React.useState(false);
  const dispatch = useDispatch();
  const accounts = useSelector(state => state.accounts.filter(a => !a.isHidden));

  React.useEffect(() => {
    Mousetrap.bind('n v', showForm);

    return function cleanup() {
      Mousetrap.unbind('n v');
    }
  })

  const showForm = () => {
    setShow(true);
    return false;
  }

  const handleClose = () => {
    setShow(false);
  }

  const saveInvestment = (investment) => {
    dispatch(actions.purchaseInvestment(investment));
  }

    return (<span>
        <NewIcon onClick={showForm} className="new-investment"/>
        <InvestmentForm 
          show={show} 
          onClose={handleClose} 
          accounts={accounts}
          onSave={saveInvestment} 
        />
      </span>);
  };
