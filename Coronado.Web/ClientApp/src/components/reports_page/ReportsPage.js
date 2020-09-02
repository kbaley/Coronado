import React from 'react';
import { Tab, Tabs, Box } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import ExpensesByCategoryPage from './ExpensesByCategoryPage';
import NetWorthPage from './NetWorthPage';
import IncomePage from './IncomePage';
import InvestmentReportPage from './InvestmentReportPage';

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

  const allTabs = ['/reports', '/reports/expenses', '/reports/income', '/reports/investments']
  const selectedTab = allTabs.indexOf(props.history.location.pathname);
  const [value, setValue] = React.useState(selectedTab);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  }

  return (
    <div className='reports-list'>
      <h1>Reports</h1>
      <Tabs 
        value={value} 
        onChange={handleChange}
        variant="scrollable"
      >
        <Tab label="Net worth over time" id='tab-0' component={Link} to={allTabs[0]} />
        <Tab label="Expenses by category" id='tab-1' component={Link} to={allTabs[1]} />
        <Tab label="Income" id='tab-2' component={Link} to={allTabs[2]} />
        <Tab label="Investments" id='tab-2' component={Link} to={allTabs[3]} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <NetWorthPage />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ExpensesByCategoryPage />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <IncomePage />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <InvestmentReportPage />
      </TabPanel>
    </div>
  );
}
