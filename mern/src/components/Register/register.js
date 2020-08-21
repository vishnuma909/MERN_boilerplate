import React from 'react';
import { Card, InputGroup, FormControl, Container, Row,Col, ButtonToolbar, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { registerUser } from "../../actions/authActions";
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import Axios from 'axios';
import AlertComponent from '../Alerts/alert';

class RegisterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username : '',
            email : '',
            password : '',
            errors: {},
            isdisabled: false,
            iserror: false,
            reg : /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}/
        }
        this.register = this.register.bind(this);
        this.DisableButton = this.DisableButton.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }
    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }
    register() {
        this.DisableButton(true);
        if(this.state.username !== '' && this.state.email !== '' && this.state.password !== '') {
            if(this.ispassedtest(this.state.email)) {
                if(this.testpassword(this.state.password)) {
                    trackPromise(
                        Axios.post('/api/auth/register',{
                            username: this.state.username,
                            email: this.state.email,
                            password: this.state.password
                        }).then(res => {
                            this.DisableButton(false);
                            if(res.data.user !== undefined) {
                                this.props.history.push('/login');
                            }
                        }).catch(err => {
                            this.DisableButton(false);
                            console.log(err)
                        })
                    )
                }else {
                    this.DisableButton(false);
                    this.showAlert("Password must contain at least 1 Upper case, 1 Lower case, 1 Numberic, 6-15 digits.",true,'danger')
                }
            }else {
                this.DisableButton(false);
                this.showAlert("Please provide valid email id",true,'danger');
            }
        }else{
            this.DisableButton(false);
            this.showAlert("Please provide credentials",true,'danger');
        }
    }
    showAlert(message, show, variant) {
        let msg = message,display = show, color = variant;
        this.setState(state => ({iserror: true, message: msg, show: display, variant: color}))
    }
    ispassedtest(value) {
        let email = value;
        let regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        if(regex.test(email)) {
            return true;
        }else {
            return false;
        }
    }
    testpassword(val) {
        let value = val;
        if(value != undefined && value != '') {
            if(value.indexOf('<') >= 0) {
                return false
            }else if(this.state.reg.test(value.trim())) {
                return true
            }else {
                return false
            }
        }
    }
    DisableButton(value) {
        this.setState({
            isdisabled: value
        })
    }
    capturename=event=> {
        this.setState({username : event.target.value,iserror: false})
    }
    captureemail=event=> {
        this.setState({email : event.target.value,iserror: false})
    }
    capturepass=event=> {
        this.setState({password : event.target.value,iserror: false})
    }
    render() {
        return(
            <Container>
                {this.state.iserror ? <AlertComponent message={this.state.message} show={this.state.show} type={this.state.variant} /> : ''}
                <Row style={{marginTop: '60px'}}>
                    <Col xs={3}></Col>
                    <Col className="tocenter" xs={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Registration</Card.Title>
                                <InputGroup className="mb-3">
                                    <FormControl placeholder="User name" onChange={this.capturename} type="text" aria-label="Name" />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <FormControl placeholder="Email" type="text" onChange={this.captureemail} aria-label="Email" />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <FormControl placeholder="Password" type="password" onChange={this.capturepass} aria-label="Password" />
                                </InputGroup>
                            </Card.Body>
                            <Card.Body>
                                <ButtonToolbar className="regbtn">
                                    <Button variant="primary" disabled={this.state.isdisabled} onClick={this.register}>
                                        {this.state.isdisabled ? 'Loading...' : 'Register'}
                                    </Button>
                                </ButtonToolbar>
                                <Card.Link href="/login">Login</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={3}></Col>
                </Row>
            </Container>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
RegisterComponent.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}
export default connect(mapStateToProps,{registerUser})(withRouter(RegisterComponent));