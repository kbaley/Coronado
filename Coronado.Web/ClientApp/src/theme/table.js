import palette from './palette';
import { colors } from '@material-ui/core';

export default {
  head: {
    backgroundColor: colors.grey[50],
    fontWeight: 500,
    color: palette.text.primary,
    fontSize: 14,
    lineHeight: "1.5rem",
    padding: "10px 5px",
  },
  body: {
    color: palette.text.primary,
    padding: "13px 5px",
    fontSize: "14px",
  }
};
