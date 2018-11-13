import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem, Glyphicon } from 'react-bootstrap';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';

export class InvoicesMenu extends Component {
  constructor(props) {
    super(props);
    this.goToInvoices = this.goToInvoices.bind(this);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    Mousetrap.bind('g', this.goToInvoices);
  }

  goToInvoices() {
    this.props.history.push('/invoices');
  }

  render() {
    return (
    <LinkContainer to={'/invoices'}>
      <NavItem>
        <Glyphicon glyph='list-alt' /> Invoices
      </NavItem>
    </LinkContainer>
    );
  }
}

export default withRouter(InvoicesMenu);