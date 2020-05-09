import React, { Component } from 'react';
import * as investmentActions from '../../actions/investmentActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NewInvestment from "./NewInvestment";
import InvestmentList from "./InvestmentList";
import TodaysPrices from "./TodaysPrices";
import {Icon} from "../icons/Icon";
import './InvestmentsPage.css';
import { filter } from 'lodash';
import DisplayTotalRow from './DisplayTotalRow';
import { getInvestmentsTotal } from '../common/investmentHelpers';
import { orderBy } from 'lodash';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

class InvestmentsPage extends Component {
  constructor(props) {
    super(props);
    this.makeCorrectingEntries = this.makeCorrectingEntries.bind(this);
    this.getLatestPrices = this.getLatestPrices.bind(this);
    this.saveTodaysPrices = this.saveTodaysPrices.bind(this);
    this.state = {
    }
  }

  makeCorrectingEntries() {
    this.props.actions.makeCorrectingEntries();
  }

  getLatestPrices() {
    this.props.actions.getLatestPrices();
  }

  saveTodaysPrices(investments) {
    this.props.actions.saveTodaysPrices(investments);
  }

  render() {
    return (
      <div>
        <div style={{float: "right", width: "150px", textAlign: "right"}}>
          <Icon 
            onClick={this.makeCorrectingEntries} 
            title="Sync with Investments accont" 
            icon={<SwapHorizIcon />}
          />
          <Icon 
            onClick={this.getLatestPrices} 
            title="Get latest prices from Yahoo" 
            icon={<CloudDownloadIcon />}
          />
        </div>
        <h1>
          Investments <NewInvestment /> <TodaysPrices 
            investments={orderBy(this.props.investments, ['symbol'], ['asc'])} 
            onSave={this.saveTodaysPrices} />
        </h1>
        <h3>USD</h3>
        <InvestmentList investments={filter(this.props.investments, i => i.currency === 'USD')} currency='USD' />
        <h3>CAD</h3>
        <InvestmentList investments={filter(this.props.investments, i => i.currency === 'CAD')} currency='CAD' />
        <table className='table investment-list'>
          <tbody>
            <React.Fragment>
              <DisplayTotalRow text="Grand Total" value={getInvestmentsTotal()} />
            </React.Fragment>
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    investments: state.investments,
    currencies: state.currencies
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(investmentActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentsPage);