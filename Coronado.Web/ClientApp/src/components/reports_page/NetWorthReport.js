import React, { Component } from 'react';
import * as reportActions from '../../actions/reportActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CurrencyFormat } from '../common/CurrencyFormat';
import CustomTable, { CustomTableRow } from '../common/Table';
import { withStyles } from '@material-ui/core';
import moment from 'moment';

const styles = (theme) => ({
  reportTable: {
    width: "450px"
  }
});

class NetWorthReport extends Component {

  componentDidMount() {
    this.props.actions.loadNetWorthReport();
  }
  
  render() {
    const { classes } = this.props;
    return (
      <div style={{margin: "10px"}}>
        <h4>Net Worth</h4>
        <CustomTable
          className={classes.reportTable}
          tableHeader={["Date", "Net worth", "Change"]}
          headerAlignment={['inherit', 'right', 'right']}
        >
            {this.props.report.map( (r, index) => {
              const date = moment(r.date).format("MMMM YYYY");
              const value = CurrencyFormat({value: r.netWorth});
              const change = 
                index < this.props.report.length - 1 
                ? CurrencyFormat({value: r.netWorth - this.props.report[index + 1].netWorth})
                : null;
              return (
                <CustomTableRow
                  key={index}
                  skipFirstCell={true}
                  tableData={[date, value, change]}>
                </CustomTableRow>
              )
            })}
        </CustomTable>
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
)(withStyles(styles)(NetWorthReport));