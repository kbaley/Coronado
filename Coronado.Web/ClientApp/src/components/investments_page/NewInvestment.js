import React, { Component } from 'react';
import * as actions from '../../actions/investmentActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Mousetrap from 'mousetrap';
import { NewIcon } from '../icons/NewIcon';
import './NewInvestment.css';
import InvestmentForm from './InvestmentForm';

export class NewInvestment extends Component {
  constructor(props) {
    super(props);
    this.showForm = this.showForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.saveInvestment = this.saveInvestment.bind(this);
    this.state = { show: false, 
        investment: {name: '', symbol: '', shares: 0, price: 0.00, url: ''}
    };
  }

  componentDidMount() {
      Mousetrap.bind('n v', this.showForm);
  }

  componentWillUnmount() {
      Mousetrap.unbind('n v');
  }

  showForm() {
    this.setState({show:true});
    return false;
  }

  handleClose() {
    this.setState({show:false});
  }

  saveInvestment(investment) {
    this.props.actions.purchaseInvestment(investment);
  }

  render() {
    
    return (<span>
        <NewIcon onClick={this.showForm} className="new-investment"/>
        <InvestmentForm 
          show={this.state.show} 
          onClose={this.handleClose} 
          accounts={this.props.accounts}
          onSave={this.saveInvestment} 
        />
      </span>);
  };
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts.filter(a => !a.isHidden),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewInvestment);