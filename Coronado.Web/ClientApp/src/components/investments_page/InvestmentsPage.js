import React from 'react';
import * as investmentActions from '../../actions/investmentActions';
import * as investmentCategoriesActions from '../../actions/investmentCategoryActions';
import { useSelector, useDispatch } from 'react-redux';
import NewInvestment from "./NewInvestment";
import InvestmentList from "./InvestmentList";
import TodaysPrices from "./TodaysPrices";
import { Icon } from "../icons/Icon";
import { filter, sumBy } from 'lodash';
import DisplayTotalRow from './DisplayTotalRow';
import { orderBy } from 'lodash';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { Typography, makeStyles } from '@material-ui/core';
import { PercentageFormat } from '../common/DecimalFormat';
import AdjustPercentages from './AdjustPercentages';

const styles = () => ({
  irr: {
    display: "inline-block",
  }
});

const useStyles = makeStyles(styles);

export default function InvestmentsPage() {

  const [ showAdjustPercentages, setShowAdjustPercentages ] = React.useState(false);
  const classes = useStyles();
  const investments = useSelector(state => state.investments);
  const investmentCategories = useSelector(state => state.investmentCategories);
  const portfolioStats = useSelector(state => state.portfolioStats);
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

  const getBookValueTotal = () => {
    return sumBy(investments, i => {
      if (i.currency === 'CAD') {
        return (parseFloat(i.bookValue)) / currencies['CAD'];
      } else {
        return (parseFloat(i.bookValue));
      }
    }).toFixed(2);
  }

  const adjustPercentages = () => {
    setShowAdjustPercentages(true);
  }

  const saveCategories = (categories) => {
    dispatch(investmentCategoriesActions.updateInvestmentCategories(categories));
    setShowAdjustPercentages(false);
  }

  return (
    <div>
      <div style={{ float: "right", width: "250px", textAlign: "right" }}>
        <Typography
          variant="h4"
          className={classes.irr}
        >
          <PercentageFormat amount={portfolioStats.irr} />
        </Typography>
        <Icon
          onClick={adjustPercentages}
          title="Adjust portfolio percentages"
          icon={<ViewWeekIcon />}
        />
        <AdjustPercentages 
          show={showAdjustPercentages} 
          onSaveCategories={saveCategories}
          onClose={() => setShowAdjustPercentages(false)}
          investmentCategories={investmentCategories}
        />
        <Icon
          onClick={makeCorrectingEntries}
          title="Sync with Investments account"
          icon={<SwapHorizIcon />}
        />
        <Icon
          onClick={getLatestPrices}
          title="Get latest prices"
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
      <DisplayTotalRow text="Grand Total" value={getInvestmentsTotal()} secondaryValue={getBookValueTotal()} />
      </InvestmentList>
    </div>
  );
}