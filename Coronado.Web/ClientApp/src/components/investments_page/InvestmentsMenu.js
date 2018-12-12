import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem, Glyphicon } from 'react-bootstrap';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';

export class InvestmentsMenu extends Component {
  constructor(props) {
    super(props);
    this.goToInvestments = this.goToInvestments.bind(this);
    this.state = { };
  }

  componentDidMount() {
    Mousetrap.bind('g n', this.goToInvestments);
  }

  componentWillUnmount() {
    Mousetrap.unbind('g n');
  }
  

  goToInvestments() {
    this.props.history.push('/investments');
  }

  render() {
    return (
    <LinkContainer to={'/investments'}>
      <NavItem>
        <Glyphicon glyph='usd' /> Investments
      </NavItem>
    </LinkContainer>
    );
  }
}

export default withRouter(InvestmentsMenu);