import React from 'react';
import * as reportActions from '../../actions/reportActions';
import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles,
  Grid,
  Button,
} from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import NetWorthGraph from './NetWorthGraph';
import NetWorthReport from './NetWorthReport';

const styles = (theme) => ({
  navigation: {
    width: "100%",
    textAlign: "center",
  },
  prevYear: {
    display: "inline-block"
  },
  nextYear: {
    display: "inline-block"
  },
  selectedYearContainer: {
    display: "inline-block",
  },
  selectedYear: {
    fontSize: "30px",
    padding: "6px 20px",
    display: "inline-flex",
    fontWeight: 500,
    verticalAlign: "middle",
  }
});

const useStyles = makeStyles(styles);

export default function NetWorthPage() {

  const currentYear = new Date().getFullYear();
  const reportData = useSelector(state => state.reports.netWorth);
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  React.useEffect(() => {
    if (!reportData || reportData.length === 0)
      dispatch(reportActions.loadNetWorthReport());
  });

  const goToPreviousYear = () => {
    goToYear(selectedYear - 1);
  }

  const goToNextYear = () => {
    goToYear(selectedYear + 1);
  }

  const goToYear = (year) => {
    setSelectedYear(year);
    dispatch(reportActions.loadNetWorthReport(year));
  }

  const classes = useStyles();
  return (
    <div style={{ margin: "10px" }}>
      <h2>Net Worth</h2>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.navigation}>
            <div className={classes.prevYear}>
              <Button
                onClick={goToPreviousYear}
                startIcon={<KeyboardArrowLeftIcon />}
              >
                {selectedYear - 1}
              </Button>
            </div>
            <div className={classes.selectedYearContainer}>
              <span className={classes.selectedYear}>
                {selectedYear}
              </span>
            </div>
            <div className={classes.nextYear}>
              <Button
                onClick={goToNextYear}
                endIcon={<KeyboardArrowRightIcon />}
                disabled={selectedYear >= currentYear}
              >
                {selectedYear + 1}
              </Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={7}>

          {reportData && reportData.report && reportData.report.length > 0 &&
          <NetWorthGraph
            report={reportData.report}
          />
          }
        </Grid>
        <Grid item xs={5}>
          {reportData && reportData.report && reportData.report.length > 0 &&
          <NetWorthReport
            report={reportData.report}
          />
          }
        </Grid>
      </Grid>
      <div>
      </div>
    </div>
  );
}
