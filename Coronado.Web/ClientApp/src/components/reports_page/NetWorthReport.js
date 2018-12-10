import React, { Component } from 'react';
import * as reportActions from '../../actions/reportActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Moment from 'react-moment';
import { CurrencyFormat } from '../common/CurrencyFormat';

class NetWorthReport extends Component {

  componentDidMount() {
    this.props.actions.loadNetWorthReport();
  }
  
  render() {
    return (
      <div style={{margin: "10px"}}>
        <h4>Net Worth</h4>
        <table className="table" style={{width: "400px"}}>
          <thead>
            <tr>
              <th>Date</th>
              <th style={{textAlign: "right"}}>Net worth</th>
              <th style={{textAlign: "right"}}>Change</th>
            </tr>
          </thead>
          <tbody>
            {this.props.report.map( (r, index) =>
              <tr key={index}>
                <td>
                  <Moment format="MMMM YYYY">{r.date}</Moment>
                </td>
                <td>
                  <CurrencyFormat value={r.netWorth} />
                </td>
                <td>
                  {index < this.props.report.length - 1 &&
                  <span><CurrencyFormat value={r.netWorth - this.props.report[index + 1].netWorth} /></span>
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    report: state.reports.netWorth
  };
}

function mapDispatchToProps(dispatch) {
   return {
     actions: bindActionCreators(reportActions, dispatch)
   }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NetWorthReport);