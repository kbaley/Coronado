import React from 'react';
import * as investmentActions from '../../actions/investmentActions';
import InvestmentForm from './InvestmentForm';
import './InvestmentList.css';
import { orderBy } from 'lodash';
import { InvestmentRow } from './InvestmentRow';
import InvestmentsTotal from './InvestmentsTotal';
import Spinner from '../common/Spinner';
import { Grid, Hidden } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import GridHeader from '../common/grid/GridHeader';

export default function InvestmentList({ investments, currency, children }) {
  const [show, setShow] = React.useState(false);
  const [selectedInvestment, setSelectedInvestment] = React.useState({});
  const [isBuying, setIsBuying] = React.useState(false);
  const currencies = useSelector(state => state.currencies);
  const isLoading = useSelector(state => state.isLoading);
  const accounts = useSelector(state => state.accounts);
  const dispatch = useDispatch();
  const sortedInvestments = orderBy(investments, ['symbol'], ['asc']);

  const deleteInvestment = (investmentId, investmentName) => {
    dispatch(investmentActions.deleteInvestment(investmentId, investmentName));
  }

  const startEditing = (investment) => {
    setSelectedInvestment(investment);
    setIsBuying(false);
    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
  }

  const saveInvestment = (investment) => {
    if (isBuying) {
      dispatch(investmentActions.buySellInvestment(investment));
    } else {
      dispatch(investmentActions.updateInvestment(investment));
    }
    setIsBuying(false);
  }

  const buySell = (investment) => {
    setSelectedInvestment(investment);
    setIsBuying(true);
    setShow(true);
  }

  return (
    <div>
      <InvestmentForm
        show={show}
        onClose={handleClose}
        investment={selectedInvestment}
        investments={investments}
        isBuying={isBuying}
        accounts={accounts}
        onSave={saveInvestment}
      />
      <Grid container spacing={0}>
        <Hidden smDown>
          <GridHeader xs={2}></GridHeader>
          <GridHeader xs={3}>Name</GridHeader>
        </Hidden>
          <GridHeader xs={4} md={1}>Symbol</GridHeader>
        <Hidden smDown>
          <GridHeader xs={1}>Shares</GridHeader>
        </Hidden>
        <GridHeader xs={4} md={1} alignRight>Last Price</GridHeader>
        <Hidden smDown>
          <GridHeader xs={1} alignRight>Average Price</GridHeader>
          <GridHeader xs={1} alignRight>IRR</GridHeader>
          <GridHeader xs={1} alignRight>Book Value</GridHeader>
        </Hidden>
        <GridHeader xs={4} md={1} alignRight>Current Value</GridHeader>
        {isLoading ? <Grid item xs={12}><Spinner /></Grid> :
          sortedInvestments.map(i =>
            <InvestmentRow
              key={i.investmentId}
              investment={i}
              onEdit={() => startEditing(i)}
              onDelete={() => deleteInvestment(i.investmentId, i.name)}
              onBuySell={() => buySell(i)}
            />
          )}
        <InvestmentsTotal
          investments={investments}
          currency={currency}
          currencies={currencies} />
        {children}
      </Grid>
    </div>
  );
}