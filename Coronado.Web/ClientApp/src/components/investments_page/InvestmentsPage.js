import React, { Component } from 'react';
import * as investmentActions from '../../actions/investmentActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NewInvestment from "./NewInvestment";
import InvestmentList from "./InvestmentList";
import {Icon} from "../icons/Icon";
import './InvestmentsPage.css';
import { filter } from 'lodash';

class InvestmentsPage extends Component {
  constructor(props) {
    super(props);
    this.makeCorrectingEntries = this.makeCorrectingEntries.bind(this);
    this.state = {
    }
  }

  makeCorrectingEntries() {
    this.props.actions.makeCorrectingEntries();
  }

  render() {
    return (
      <div>
        <div style={{float: "right", width: "150px", textAlign: "right"}}>
          <Icon className="make-correcting-entry" glyph="transfer" onClick={this.makeCorrectingEntries} />
        </div>
        <h1>
          Investments <NewInvestment />
        </h1>
        <h3>USD</h3>
        <InvestmentList investments={filter(this.props.investments, i => i.currency === 'USD')} currency='USD' />
        <h3>CAD</h3>
        <InvestmentList investments={filter(this.props.investments, i => i.currency === 'CAD')} currency='CAD' />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    investments: state.investments
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(investmentActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentsPage);