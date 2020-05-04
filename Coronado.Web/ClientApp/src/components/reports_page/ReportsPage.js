import React from 'react';
import NetWorthReport from './NetWorthReport';
import ExpensesByCategoryReport from './ExpensesByCategoryReport';
import { Tab, Tabs, Box } from '@material-ui/core';
import { PropTypes } from 'prop-types';

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

export default function ReportsPage() {

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }
  return (
    <div className='reports-list'>
      <h1>Reports</h1>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Net worth over time" id='tab-0' />
        <Tab label="Expenses by category" id='tab-1' />
      </Tabs>
      <TabPanel value={value} index={0}>
        <NetWorthReport />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ExpensesByCategoryReport />
      </TabPanel>
    </div>
  );
}
