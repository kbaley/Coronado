import React, { Component } from 'react';
import * as investmentActions from '../../actions/investmentActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InvestmentForm from './InvestmentForm';
import './InvestmentList.css';
import { find } from 'lodash';
import { InvestmentRow } from './InvestmentRow';
import Spinner from '../common/Spinner';

class InvestmentList extends Component {
  constructor(props) {
    super(props);
    this.deleteInvestment = this.deleteInvestment.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.saveInvestment = this.saveInvestment.bind(this);
    this.getInvestmentName = this.getInvestmentName.bind(this);
    this.state = {
      show: false,
      selectedInvestment: {}
    }
  }

  deleteInvestment(investmentId, investmentName) {
    this.props.actions.deleteInvestment(investmentId, investmentName);
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
          <th>Shares</th>
          <th>Price</th>
          <th>Current Value</th>
        </tr>
      </thead>
      <tbody>
        <InvestmentForm 
          show={this.state.show} 
          onClose={this.handleClose} 
          moo={this.state.show}
          investment={this.state.selectedInvestment} 
          investments={this.props.investments}
          onSave={this.saveInvestment} />
        { this.props.isLoading ? <tr><td colSpan="2"><Spinner /></td></tr> :
          this.props.investments.map(i => 
        <InvestmentRow 
          key={i.investmentId} 
          investment={i} 
          onEdit={() => this.startEditing(i)} 
          onDelete={()=>this.deleteInvestment(i.investmentId, i.name)} />
        )}
      </tbody>
    </table>
    );
  }
}

function mapStateToProps(state) {
  
  return {
    investments: state.investments,
    notifications: state.notifications,
    isLoading: state.loading.investments
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