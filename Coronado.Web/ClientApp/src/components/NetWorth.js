import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sumBy} from 'lodash';

class NetWorth extends Component {
  render() {
    return (
      <div style={{ float: "right" }}>
      {Number(this.props.netWorth).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}
    </div>
    );

  }
}

function mapStateToProps(state) {
  return {
    netWorth: sumBy(state.accounts, a => a.currentBalance)
  }
}

export default connect(
  mapStateToProps
)(NetWorth);