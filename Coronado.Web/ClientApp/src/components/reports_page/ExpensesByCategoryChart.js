import React from 'react';
import * as reportActions from '../../actions/reportActions';
import { useDispatch } from 'react-redux';
import {
  makeStyles,
  Button,
} from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { sumBy } from 'lodash';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const styles = (theme) => ({
  navigation: {
    width: "100%",
    height: 30,
  },
  prevYear: {
    float: "left",
  },
  nextYear: {
    float: "right",
  },
});

const useStyles = makeStyles(styles);

export default function ExpensesByCategoryChart({data}) {

  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const report = [];
  const total = sumBy(data.expenses, e => e.total);
  let rest = 0.0;
  data.expenses.map(e => {
    if (e.total / total > 0.03) {
      report.push(Object.assign({}, e));
    } else {
      rest += e.total;
    }
  });
  if (rest > 0) {
    report.push({
      categoryName: "Other",
      total: rest
    });
  }
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
      <div className={classes.navigation}>
        <div className={classes.prevYear}>
          <Button
            onClick={goToPreviousYear}
            startIcon={<KeyboardArrowLeftIcon />}
          >
            {selectedYear - 1}
          </Button>
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
      {report && 
      <ResponsiveContainer width="100%" aspect={4.0/3.0}>

        <PieChart
        >
          <Pie 
            isAnimationActive={false} // See https://github.com/recharts/recharts/issues/929
            dataKey="total" 
            data={report} 
            labelLine={false}
            paddingAngle={1}
            label={(entry) => entry.categoryName}
            fill="#4682b4" 
          >
            {
              report.map((_, index) => <Cell fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      }
    </div>
  );
}
