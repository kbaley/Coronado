import { createMuiTheme } from '@material-ui/core';

import palette from './palette';
import typography from './typography';
import table from './table';
import overrides from './overrides';

const theme = createMuiTheme({
  palette,
  typography,
  table,
  overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100
  }
});

export default theme;
