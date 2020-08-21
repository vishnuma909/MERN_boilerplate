import React, { Fragment } from 'react'
import { Row, Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import './header.css';
import { Link } from 'react-router-dom';

class HeaderComp extends React.Component {
    constructor(props) {
        super(props);
        this.onlogout = this.onlogout.bind(this);
    }
    onlogout() {
        this.props.logoutUser();
        window.location.href = './login';
    }
    render() {
        const { user } = this.props.auth;
        const containStyle = {
            margin: '0px'
        }
        const logoStyle = {
            color: 'black',
            background: 'white',
            width: '45px',
            paddingTop: '10px',
            fontSize: 'small',
            borderRadius: '50%',
            height: '45px',
            fontStyle: 'italic'
        }
        let headers = ['Dashboard', 'Route2', 'Route3', 'Route4'];
        return (
            <Fragment>
                {(this.props.auth.isAuthenticated)
                    ?
                    <div id="header" className="App">
                        <header>
                            <Navbar
                                expand="lg"
                                fixed="top"
                                bg="dark"
                                variant="dark">
                                <Container style={containStyle}>
                                    <Row>
                                        <Navbar.Brand style={logoStyle}>
                                            {'MERN'}
                                        </Navbar.Brand>
                                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                                        <Navbar.Collapse id="responsive-navbar-nav">
                                            <Navbar.Brand className="customA">
                                                <Link to="/dashboard">
                                                    {headers[0]}
                                                </Link>
                                            </Navbar.Brand>
                                            <Navbar.Brand className="customA">
                                                <Link to="/articles">
                                                    {headers[1]}
                                                </Link>
                                            </Navbar.Brand>
                                            <Navbar.Brand className="customA">
                                                <Link to="/people">
                                                    {headers[2]}
                                                </Link>
                                            </Navbar.Brand>
                                            <Navbar.Brand className="customA">
                                                <Link to="/settings">
                                                    {headers[3]}
                                                </Link>
                                            </Navbar.Brand>
                                            <Nav className="logout">
                                                <NavDropdown
                                                    title={
                                                        <span>
                                                            <img src="dop.png" alt='dp' width="30" height="30" style={{ borderRadius: '50px' }} />
                                                            <span> {user.username} </span>
                                                        </span>
                                                    }
                                                    id="basic-nav-dropdown">
                                                    <NavDropdown.Item onClick={this.onlogout}>Logout</NavDropdown.Item>
                                                </NavDropdown>
                                            </Nav>
                                        </Navbar.Collapse>
                                    </Row>
                                </Container>
                            </Navbar>
                        </header>
                    </div>
                    :
                    ''
                }
            </Fragment>

        );
    }
}
HeaderComp.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps, { logoutUser })(HeaderComp);