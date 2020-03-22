import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

function mapStateToProps(state) {
  return {
    remainingTransactionCount: state.transactionModel.remainingTransactionCount
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

class LoadMoreTransactions extends Component {
  render() {
    return (
      <div style={{"margin": "15px 15px 40px 15px"}}>
        <Button>Load {this.props.remainingTransactionCount} more transactions</Button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadMoreTransactions);
