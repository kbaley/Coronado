import React from 'react';
import { CurrencyFormat } from '../common/CurrencyFormat';
import {
  makeStyles,
  Grid,
} from '@material-ui/core';
import * as reportActions from '../../actions/reportActions';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

const styles = (theme) => ({
  header: {
    ...theme.table.head,
  },
  row: {
    ...theme.table.body,
  },
  right: {
    textAlign: "right",
  },
  navigation: {
    width: 450,
    height: 30,
  },
  prevYear: {
    float: "left",
  },
  nextYear: {
    float: "right",
  },
  report: {
    maxWidth: 450,
  },
});

const useStyles = makeStyles(styles);

export default function NetWorthReport() {

  const reportData = useSelector(state => state.reports.netWorth);
  const report = reportData.report || [];
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!reportData || reportData.length === 0)
      dispatch(reportActions.loadNetWorthReport());
  });

  const classes = useStyles();
  return (
    <Grid container spacing={0} className={classes.report}>
      <Grid item xs={5} className={classes.header}>Date</Grid>
      <Grid item xs={4} className={classes.header + " " + classes.right}>Net worth</Grid>
      <Grid item xs={3} className={classes.header + " " + classes.right}>Change</Grid>
      {report.map((r, index) => {
          return (
            <React.Fragment key={index}>
              <Grid item xs={5} className={classes.row}>
                {moment(r.date).format("MMMM YYYY")}
              </Grid>
              <Grid item xs={4} className={classes.row}>
                <CurrencyFormat value={r.netWorth} />
              </Grid>
              <Grid item xs={3} className={classes.row}>
                {
                  index < report.length - 1
                    ? <CurrencyFormat value={r.netWorth - report[index + 1].netWorth} />
                    : null
                }
              </Grid>
            </React.Fragment>
          )
      })}
    </Grid>
  );
}
