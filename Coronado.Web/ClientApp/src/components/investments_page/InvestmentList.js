import React from 'react';
import * as investmentActions from '../../actions/investmentActions';
import InvestmentForm from './InvestmentForm';
import './InvestmentList.css';
import { find, orderBy } from 'lodash';
import { InvestmentRow } from './InvestmentRow';
import InvestmentsTotal from './InvestmentsTotal';
import Spinner from '../common/Spinner';
import InvestmentPriceHistory from './InvestmentPriceHistory';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

export default function InvestmentList(props) {
  const [show, setShow] = React.useState(false);
  const [selectedInvestment, setSelectedInvestment] = React.useState({});
  const [showPriceHistory, setShowPriceHistory] = React.useState(false);
  const currencies = useSelector(state => state.currencies);
  const isLoading = useSelector(state => state.isLoading);
  const dispatch = useDispatch();

  const deleteInvestment = (investmentId, investmentName) => {
    dispatch(investmentActions.deleteInvestment(investmentId, investmentName));
  }

  const openPriceHistory = (investment) => {
    setSelectedInvestment(investment);
    setShowPriceHistory(true);
  }

  const handleClosePriceHistory = () => {
    setShowPriceHistory(false);
    setSelectedInvestment(false);
  }

  const startEditing = (investment) => {
    setSelectedInvestment(investment);
    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
    setSelectedInvestment({});
  }

  const saveInvestment = (investment) => {
    dispatch(investmentActions.updateInvestment(investment));
  }

  const savePrices = (investment, prices) => {
    dispatch(investmentActions.updatePriceHistory(investment, prices));
  }

  const investments = orderBy(props.investments, ['symbol'], ['asc']);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Symbol</TableCell>
          <TableCell>Currency</TableCell>
          <TableCell>Shares</TableCell>
          <TableCell align={'right'}>Last Price</TableCell>
          <TableCell align={'right'}>Average Price</TableCell>
          <TableCell align={'right'}>Current Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <InvestmentForm
          show={show}
          onClose={handleClose}
          investment={selectedInvestment}
          investments={props.investments}
          onSave={saveInvestment} />
        <InvestmentPriceHistory
          show={showPriceHistory}
          onClose={handleClosePriceHistory}
          onSave={savePrices}
          investment={selectedInvestment} />
        {isLoading ? <tr><td colSpan="2"><Spinner /></td></tr> :
          investments.map(i =>
            <InvestmentRow
              key={i.investmentId}
              investment={i}
              onEdit={() => startEditing(i)}
              onDelete={() => deleteInvestment(i.investmentId, i.name)}
              openPriceHistory={() => openPriceHistory(i)} />
          )}
        <InvestmentsTotal
          investments={props.investments}
          currency={props.currency}
          currencies={currencies} />
        {props.children}
      </TableBody>
    </Table>
  );
}