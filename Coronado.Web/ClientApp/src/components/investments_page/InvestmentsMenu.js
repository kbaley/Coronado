import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem, Glyphicon, Row, Col } from 'react-bootstrap';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';
import { getInvestmentsTotal } from '../common/investmentHelpers';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { connect } from 'react-redux';
import { sumBy } from 'lodash';

export class InvestmentsMenu extends Component {
  constructor(props) {
    super(props);
    this.goToInvestments = this.goToInvestments.bind(this);
    this.getInvestmentsTotal = this.getInvestmentsTotal.bind(this);
    this.state = {};
  }

  componentDidMount() {
    Mousetrap.bind('g n', this.goToInvestments);
  }

  componentWillUnmount() {
    Mousetrap.unbind('g n');
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

  goToInvestments() {
    this.props.history.push('/investments');
  }

  render() {
    return (
      <LinkContainer to={'/investments'}>
        <NavItem>
          <Row>
            <Col sm={1}>
              <Glyphicon glyph='usd' />
            </Col>
            <Col sm={7} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>Investments</Col>
            <Col sm={3} style={{ textAlign: "right", fontSize: "13px", padding: "0 13px 0 0" }}>
              <CurrencyFormat value={getInvestmentsTotal()} />
            </Col>
          </Row>
        </NavItem>
      </LinkContainer>
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