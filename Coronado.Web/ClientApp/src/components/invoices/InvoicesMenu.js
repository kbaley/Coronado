import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { sumBy } from 'lodash';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { SidebarMenuItem } from '../common/SidebarMenuItem';

export class InvoicesMenu extends Component {
  render() {
    return (
      <SidebarMenuItem 
        to='/invoices' 
        primary="Invoices" 
        icon={<ListAltIcon />}
        secondary={<CurrencyFormat value={sumBy(this.props.invoices, i => { return i.balance })} />}
        />
    );
  }
}

function mapStateToProps(state) {
  return {
    invoices: state.invoices
  }
}

export default withRouter(connect(
  mapStateToProps,
  null,
  null,
  {pure:false}
)(InvoicesMenu));