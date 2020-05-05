import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import * as transactionActions from '../../actions/transactionActions';

class LoadMoreTransactions extends Component {
  displayName = LoadMoreTransactions.name;

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
    };
  }

  loadMore() {
    this.props.actions.loadAllTransactions(this.props.selectedAccount);
  }

  render() {
    return (
      <div style={{"margin": "15px 15px 40px 15px"}}>
        <Button onClick={this.loadMore}>Load {this.props.remainingTransactionCount} more transactions</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    remainingTransactionCount: state.transactionModel.remainingTransactionCount,
    selectedAccount: state.selectedAccount
  };
}

function mapDispatchToProps(dispatch) {
   return {
     actions: bindActionCreators({...transactionActions}, dispatch)
   }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadMoreTransactions);
