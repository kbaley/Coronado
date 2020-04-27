import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { getInvestmentsTotal } from '../common/investmentHelpers';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { connect } from 'react-redux';
import { sumBy } from 'lodash';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import { SidebarMenuItem } from '../common/SidebarMenuItem';

export class InvestmentsMenu extends Component {
  constructor(props) {
    super(props);
    this.getInvestmentsTotal = this.getInvestmentsTotal.bind(this);
    this.state = {};
  }

  getInvestmentsTotal() {

    return sumBy(this.props.investments, i => {
      if (i.currency === 'CAD') {
        return (parseFloat(i.currentValue)) / this.props.currencies['CAD'];
      } else {
        return (parseFloat(i.currentValue));
      }
    }).toFixed(2);
  }

  render() {
    return (
      <SidebarMenuItem 
        to='/investments' 
        primary="Investments" 
        icon={<LocalAtmIcon />}
        secondary={<CurrencyFormat value={getInvestmentsTotal()} />}
        />
    );
  }
}

function mapStateToProps(state) {
  return {
    investments: state.investments,
    currencies: state.currencies
  }
}

export default withRouter(connect(
  mapStateToProps,
  null,
  null,
  { pure: false }
)(InvestmentsMenu));