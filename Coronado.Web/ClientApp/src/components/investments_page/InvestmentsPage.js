import React, { Component } from 'react';
import * as investmentActions from '../../actions/investmentActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NewInvestment from "./NewInvestment";
import InvestmentList from "./InvestmentList";
import {Icon} from "../icons/Icon";
import './InvestmentsPage.css';
import { filter, sumBy } from 'lodash';
import { CurrencyFormat } from '../common/CurrencyFormat';
import DisplayTotalRow from './DisplayTotalRow';

class InvestmentsPage extends Component {
  constructor(props) {
    super(props);
    this.makeCorrectingEntries = this.makeCorrectingEntries.bind(this);
    this.getTotal = this.getTotal.bind(this);
    this.state = {
    }
  }

  makeCorrectingEntries() {
    this.props.actions.makeCorrectingEntries();
  }

  getTotal() {
    return sumBy(this.props.investments, i => {
      if (i.currency === 'CAD') {
        return (i.shares * i.price) / this.props.currencies['CAD'];
      } else {
        return (i.shares * i.price)
      }
    }).toFixed(2);
  }

  render() {
    return (
      <div>
        <div style={{float: "right", width: "150px", textAlign: "right"}}>
          <Icon className="make-correcting-entry" glyph="transfer" onClick={this.makeCorrectingEntries} />
        </div>
        <h1>
          Investment <NewInvestment />
        </h1>
        <h3>USD</h3>
        <InvestmentList investments={filter(this.props.investments, i => i.currency === 'USD')} currency='USD' />
        <h3>CAD</h3>
        <InvestmentList investments={filter(this.props.investments, i => i.currency === 'CAD')} currency='CAD' />
        <table className='table investment-list'>
          <tbody>
            <React.Fragment>
              <DisplayTotalRow text="Grand Total" value={this.getTotal()} />
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