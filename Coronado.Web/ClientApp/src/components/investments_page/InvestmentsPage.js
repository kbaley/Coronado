import React, { Component } from 'react';
import { connect } from 'react-redux';

class InvestmentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1
    }
  }

  render() {
    return (
      <div>
        <h1>Investments</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(
  mapStateToProps,
)(InvestmentsPage);