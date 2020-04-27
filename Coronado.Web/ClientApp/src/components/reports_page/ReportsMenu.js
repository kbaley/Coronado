import React, { Component } from 'react';
import * as Mousetrap from 'mousetrap';
import { withRouter, NavLink } from 'react-router-dom';
import { MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

export class ReportsMenu extends Component {
  constructor(props) {
    super(props);
    this.goToCustomers = this.goToCustomers.bind(this);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    Mousetrap.bind('g u', this.goToCustomers);
  }

  componentWillUnmount() {
    Mousetrap.unbind('g u');
  }
  

  goToCustomers() {
    this.props.history.push('/customers');
  }

  render() {
    return (
      <NavLink to={'/reports'}>
        <MenuItem button key="Reports">
          <ListItemIcon><TrendingUpIcon /></ListItemIcon>
          <ListItemText primary="Reports" />
        </MenuItem>
      </NavLink>
    );
  }
}

export default withRouter(ReportsMenu);