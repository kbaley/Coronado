import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem } from 'react-bootstrap';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class CustomersMenu extends Component {
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
    <LinkContainer to={'/customers'}>
      <NavItem>
        <FontAwesomeIcon icon="user" /><span style={{marginLeft: "15px"}}>Customers</span>
      </NavItem>
    </LinkContainer>
    );
  }
}

export default withRouter(CustomersMenu);