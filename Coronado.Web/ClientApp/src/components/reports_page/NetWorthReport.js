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
          <tbody>
            {this.props.report.map( (r, index) =>
              <tr key={index}>
                <td>
                  <Moment format="MMMM YYYY">{r.date}</Moment>
                </td>
                <td>
                  <CurrencyFormat value={r.netWorth} />
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