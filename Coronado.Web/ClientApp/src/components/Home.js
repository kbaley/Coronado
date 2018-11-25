import React from 'react';
import { connect } from 'react-redux';

const Home = props => (
  <div>
    <h1>Coronado Financial App for Me</h1>
  </div>
);

export default connect()(Home);
