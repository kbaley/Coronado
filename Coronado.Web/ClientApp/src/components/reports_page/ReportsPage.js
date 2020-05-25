import React from 'react';
import NetWorthReport from './NetWorthReport';
import { Tab, Tabs, Box } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import IncomeReport from './IncomeReport';
import { Link } from 'react-router-dom';
import ExpensesByCategoryPage from './ExpensesByCategoryPage';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

export default function ReportsPage(props) {

  const allTabs = ['/reports', '/reports/expenses', '/reports/income']
  const selectedTab = allTabs.indexOf(props.history.location.pathname);
  const [value, setValue] = React.useState(selectedTab);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  }

  return (
    <div className='reports-list'>
      <h1>Reports</h1>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Net worth over time" id='tab-0' component={Link} to={allTabs[0]} />
        <Tab label="Expenses by category" id='tab-1' component={Link} to={allTabs[1]} />
        <Tab label="Income" id='tab-2' component={Link} to={allTabs[2]} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <NetWorthReport />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ExpensesByCategoryPage />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <IncomeReport />
      </TabPanel>
    </div>
  );
}
