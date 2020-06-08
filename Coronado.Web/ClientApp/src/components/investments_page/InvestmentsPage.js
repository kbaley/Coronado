import React from 'react';
import * as investmentActions from '../../actions/investmentActions';
import { useSelector, useDispatch } from 'react-redux';
import NewInvestment from "./NewInvestment";
import InvestmentList from "./InvestmentList";
import TodaysPrices from "./TodaysPrices";
import { Icon } from "../icons/Icon";
import { filter, sumBy } from 'lodash';
import DisplayTotalRow from './DisplayTotalRow';
import { orderBy } from 'lodash';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

export default function InvestmentsPage() {

  const investments = useSelector(state => state.investments);
  const currencies = useSelector(state => state.currencies);
  const dispatch = useDispatch();

  const makeCorrectingEntries = () => {
    dispatch(investmentActions.makeCorrectingEntries());
  }

  const getLatestPrices = () => {
    dispatch(investmentActions.getLatestPrices());
  }

  const saveTodaysPrices = (investments) => {
    dispatch(investmentActions.saveTodaysPrices(investments));
  }

  const getInvestmentsTotal = () => {

    return sumBy(investments, i => {
      if (i.currency === 'CAD') {
        return (parseFloat(i.currentValue)) / currencies['CAD'];
      } else {
        return (parseFloat(i.currentValue));
      }
    }).toFixed(2);
  }

  return (
    <div>
      <div style={{ float: "right", width: "150px", textAlign: "right" }}>
        <Icon
          onClick={makeCorrectingEntries}
          title="Sync with Investments accont"
          icon={<SwapHorizIcon />}
        />
        <Icon
          onClick={getLatestPrices}
          title="Get latest prices from Yahoo"
          icon={<CloudDownloadIcon />}
        />
      </div>
      <h1>
        Investments <NewInvestment /> <TodaysPrices
          investments={orderBy(investments, ['symbol'], ['asc'])}
          onSave={saveTodaysPrices} />
      </h1>
      <h3>USD</h3>
      <InvestmentList investments={filter(investments, i => i.currency === 'USD')} currency='USD' />
      <h3>CAD</h3>
      <InvestmentList investments={filter(investments, i => i.currency === 'CAD')} currency='CAD'>
        <DisplayTotalRow text="Grand Total" value={getInvestmentsTotal()} />
      </InvestmentList>
    </div>
  );
}