import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem, Glyphicon } from 'react-bootstrap';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';

export class CustomersMenu extends Component {
  constructor(props) {
    super(props);
    this.goToCustomers = this.goToCustomers.bind(this);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    Mousetrap.bind('g', this.goToInvoices);
  }

  goToCustomers() {
    this.props.history.push('/customers');
  }

  render() {
    return (
    <LinkContainer to={'/customers'}>
      <NavItem>
        <Glyphicon glyph='user' /> Customers
      </NavItem>
    </LinkContainer>
    );
  }
}

export default withRouter(CustomersMenu);