import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sumBy} from 'lodash';
import { ListItemSecondaryAction } from '@material-ui/core';

class NetWorth extends Component {
  render() {
    return (
      <ListItemSecondaryAction>
        {Number(this.props.netWorth).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}
      </ListItemSecondaryAction>
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