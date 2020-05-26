import React from 'react';
import {
  Grid,
} from '@material-ui/core';
import NetWorthGraph from './NetWorthGraph';
import NetWorthReport from './NetWorthReport';

export default function NetWorthPage() {

  return (
    <div style={{ margin: "10px" }}>
      <h2>Net Worth</h2>
      <Grid container spacing={2}>
        <Grid item xs={7}>

          <NetWorthGraph />
          }
        </Grid>
        <Grid item xs={5}>
          <NetWorthReport />
        </Grid>
      </Grid>
      <div>
      </div>
    </div>
  );
}
