import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

class ReportsPage extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      key: 1
    }
  }

  handleSelect(key) {
    this.setState({key});
  }

  render() {
    return (
      <div>
        <h1>Reports</h1>
          <Tabs
            activeKey={this.state.key}
            onSelect={this.handleSelect}
            id="reports-tab"
          >
            <Tab eventKey={1} title="Net worth over time">
            </Tab>           
            <Tab eventKey={2} title="Expenses by category">
              No report yet
            </Tab>           
          </Tabs>
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
)(ReportsPage);