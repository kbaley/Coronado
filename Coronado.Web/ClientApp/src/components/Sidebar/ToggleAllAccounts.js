import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navListActions from '../../actions/navListActions'
import { withStyles, Button } from '@material-ui/core';

const infoColor = ["#4682b4", "#26c6da", "#00acc1", "#00d3ee"];
const styles = theme => ({
  blue: {
    backgroundColor: infoColor[0],
    "&:hover,&:focus": {
      backgroundColor: infoColor[0],
    }
  },
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
        <Button onClick={this.toggle} className={classes.blue} size="small">
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
