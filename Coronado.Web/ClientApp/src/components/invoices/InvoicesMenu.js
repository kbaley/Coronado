import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { NavItem, Glyphicon, Row, Col } from 'react-bootstrap';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';
import { CurrencyFormat } from '../common/CurrencyFormat';
import { connect } from 'react-redux';
import { sumBy } from 'lodash';

export class InvoicesMenu extends Component {
  constructor(props) {
    super(props);
    this.goToInvoices = this.goToInvoices.bind(this);
  }

  componentDidMount() {
    Mousetrap.bind('g i', this.goToInvoices);
  }

  componentWillUnmount() {
    Mousetrap.unbind('g i');
  }


  goToInvoices() {
    this.props.history.push('/invoices');
  }

  render() {
    return (
      <LinkContainer to={'/invoices'}>
        <NavItem>
          <Row>
            <Col sm={1}>
              <Glyphicon glyph='list-alt' />
            </Col>
            <Col sm={7} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>Invoices</Col>
            <Col sm={3} style={{ textAlign: "right", fontSize: "13px", padding: "0 13px 0 0" }}>
              <CurrencyFormat value={sumBy(this.props.invoices, i => { return i.balance })} />
            </Col>
          </Row>
        </NavItem>
      </LinkContainer>
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