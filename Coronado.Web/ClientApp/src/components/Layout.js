import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import NavMenu from './NavMenu';
import NotificationsComponent from './Notifications';
import { ShortcutHelper } from './common/ShortcutHelper';
import { Icon } from "./icons/Icon";

export default props => (
  <Grid fluid>
    <Row>
      <Col sm={2} style={{"width": "20%"}}>
        <NavMenu />
      </Col>
      <Col sm={10} style={{"width": "80%"}}>
        <div style={{textAlign: "right", marginTop: 4}}>
          <Icon glyph="log-out" onClick={() => { localStorage.removeItem('coronado-user'); window.location.reload(true);}} />
        </div>
        {props.children}
      </Col>
    </Row>
    <NotificationsComponent />
    <ShortcutHelper />
  </Grid>
);
