import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewInvestment from "./NewInvestment";
import InvestmentList from "./InvestmentList";

class InvestmentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <h1>
          Investments <NewInvestment />
        </h1>
        <InvestmentList investments={this.props.investments} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    investments: state.investments
  };
}

export default connect(
  mapStateToProps,
)(InvestmentsPage);