import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navListActions from '../../actions/navListActions'
import { withStyles, Button } from '@material-ui/core';
import hexToRgb from '../../theme/palette';

const styles = theme => ({
  background: {
    backgroundColor: theme.palette.blue,
  }
});

class ToggleAllAccounts extends Component {

  displayName = ToggleAllAccounts.name;
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.actions.toggleAllAccounts();
  }

  render() {
    const { classes } = this.props;
    var text = this.props.showAllAccounts ? "Hide inactive" : "Show all"
    return (
        <Button onClick={this.toggle} className={classes.background} size="small">
          {text}
        </Button>
    );
  }
}
function mapStateToProps(state) {
   return {
     showAllAccounts: state.showAllAccounts
   }
}

function mapDispatchToProps(dispatch) {
   return {
     actions: bindActionCreators({...navListActions}, dispatch)
   }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ToggleAllAccounts));
