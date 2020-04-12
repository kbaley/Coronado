import React, { Component } from 'react';
import * as investmentActions from '../../actions/investmentActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InvestmentForm from './InvestmentForm';
import './InvestmentList.css';
import { find } from 'lodash';
import { InvestmentRow } from './InvestmentRow';
import InvestmentsTotal from './InvestmentsTotal';
import Spinner from '../common/Spinner';
import InvestmentPriceHistory from './InvestmentPriceHistory';

class InvestmentList extends Component {
  constructor(props) {
    super(props);
    this.deleteInvestment = this.deleteInvestment.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.saveInvestment = this.saveInvestment.bind(this);
    this.getInvestmentName = this.getInvestmentName.bind(this);
    this.openPriceHistory = this.openPriceHistory.bind(this);
    this.handleClosePriceHistory = this.handleClosePriceHistory.bind(this);
    this.savePrices = this.savePrices.bind(this);
    this.state = {
      show: false,
      selectedInvestment: {},
      showPriceHistory: false
    }
  }

  deleteInvestment(investmentId, investmentName) {
    this.props.actions.deleteInvestment(investmentId, investmentName);
  }

  openPriceHistory(investment) {
    this.setState({showPriceHistory: true, selectedInvestment: investment});
  }

  handleClosePriceHistory() {
    this.setState({showPriceHistory:false});
  }

  startEditing(investment) {
    this.setState({show:true, selectedInvestment: investment});
  }

  handleClose() {
    this.setState({show:false});
  }

  saveInvestment(investment) {
    this.props.actions.updateInvestment(investment);
  }

  savePrices(investment, prices) {
    this.props.actions.updatePriceHistory(investment, prices);
  }

  getInvestmentName(investmentId) {
    if (!investmentId || investmentId === '') return '';

    var investment = find(this.props.investments, c => c.investmentId === investmentId);
    return investment ? investment.name : '';
  }
  
  render() {
    return (
    <table className='table investment-list'>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Currency</th>
          <th>Shares</th>
          <th>Last Price</th>
          <th>Current Value</th>
        </tr>
      </thead>
      <tbody>
        <InvestmentForm 
          show={this.state.show} 
          onClose={this.handleClose} 
          investment={this.state.selectedInvestment} 
          investments={this.props.investments}
          onSave={this.saveInvestment} />
        <InvestmentPriceHistory
          show={this.state.showPriceHistory}
          onClose={this.handleClosePriceHistory}
          onSave={this.savePrices}
          investment={this.state.selectedInvestment} />
        { this.props.isLoading ? <tr><td colSpan="2"><Spinner /></td></tr> :
          this.props.investments.map(i => 
        <InvestmentRow 
          key={i.investmentId} 
          investment={i} 
          onEdit={() => this.startEditing(i)} 
          onDelete={()=>this.deleteInvestment(i.investmentId, i.name)} 
          openPriceHistory={() => this.openPriceHistory(i)} />
        )}
        <InvestmentsTotal
            investments={this.props.investments}
            currency={this.props.currency}
            currencies={this.props.currencies} />
      </tbody>
    </table>
    );
  }
}

function mapStateToProps(state) {
 
  return {
    notifications: state.notifications,
    isLoading: state.loading.investments,
    currencies: state.currencies
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(investmentActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InvestmentList);