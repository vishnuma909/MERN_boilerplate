import { Container } from 'react-bootstrap';
import React from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container className="pageContainer">
        <h2>Dashboard</h2>
      </Container>
    )
  }
}
Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
}
let mapStateToProps = state => ({
  auth: state.auth
})
export default connect(mapStateToProps)(Dashboard);
