import React from 'react';
import {
  makeStyles,
  Button,
} from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

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


export default function DateNavigation(props) {

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const classes = useStyles();

  const goToPreviousYear = () => {
    goToYear(selectedYear - 1);
  }

  const goToNextYear = () => {
    goToYear(selectedYear + 1);
  }

  const goToYear = (year) => {
    setSelectedYear(year);
    props.goToYear(year);
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
