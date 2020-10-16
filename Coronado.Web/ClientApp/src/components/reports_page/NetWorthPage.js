import React from 'react';
import {
  Grid, Hidden,
} from '@material-ui/core';
import NetWorthGraph from './NetWorthGraph';
import NetWorthReport from './NetWorthReport';
import NetWorthBreakdown from './NetWorthBreakdown';

export default function NetWorthPage() {

  return (
    <div style={{ margin: "10px" }}>
      <h2>Net Worth</h2>
      <Grid container spacing={2}>
        <Hidden smDown>
        <Grid item xs={5}>
          <NetWorthGraph />
        </Grid>
        </Hidden>
        <Grid item xs={12} md={7}>
          <NetWorthReport />
        </Grid>
        <Grid item xs={12}>
          <NetWorthBreakdown />
        </Grid>
      </Grid>
      <div>
      </div>
    </div>
  );
}
