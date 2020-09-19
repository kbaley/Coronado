import React from 'react';
import {
  Grid, Hidden,
} from '@material-ui/core';
import InvestmentGraph from './InvestmentGraph';
import InvestmentReport from './InvestmentReport';

export default function InvestmentReportPage() {

  return (
    <div style={{ margin: "10px" }}>
      <h2>Investments</h2>
      <Grid container spacing={2}>
        <Hidden smDown>
          <Grid item xs={5}>
            <InvestmentGraph />
          </Grid>
        </Hidden>
        <Grid item xs={12} md={7}>
          <InvestmentReport />
        </Grid>
      </Grid>
      <div>
      </div>
    </div>
  );
}
