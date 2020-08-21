import React from 'react';
import { Card, InputGroup, FormControl, Container, Row,Col, Button} from 'react-bootstrap';
import Axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import AlertComponent from '../Alerts/alert';
import { trackPromise } from 'react-promise-tracker';

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password : '',
            message : '',
            type: '',
            show: false,
            iserror: false
        }
        this.logindetails = this.logindetails.bind(this);
        this.ispassedtest = this.ispassedtest.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }
    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
          this.props.history.push("/dashboard"); // push user to dashboard when they login
        }
        if (nextProps.errors) {
            this.setState({errors: nextProps.errors});
        }
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

    showAlert(message, show, variant) {
        let msg = message,display = show, color = variant;
        this.setState(state => ({iserror: true, message: msg, show: display, variant: color}))
    }

    logindetails() {
        if(this.state.email !== undefined && this.state.password !== undefined && this.state.email !== '' && this.state.password !== '') {
            if(this.ispassedtest(this.state.email)) {
                let user = {
                    email: this.state.email,
                    password: this.state.password
                }
                trackPromise(
                    Axios.post('/api/auth/login', user)
                    .then(res => {
                        if(res.data.success === false) {
                            this.showAlert(res.data.message,true,'danger');
                        }else {
                            this.props.loginUser(res.data.token);
                        }
                    }).catch(res => {
                        console.log(res);
                    })
                )
            }else {
                this.showAlert("Please provide valid email id",true,'danger');
            }
        }else {
            this.showAlert("Provide Valid credentials",true,'danger');
        }
    }

    getEmail=event=> {
        this.setState({email : event.target.value,iserror: false})
    }
    getPassword=event=> {
        this.setState({password : event.target.value,iserror: false})
    }
    handleEnter=event=> {
        if(event.charCode==13){
            this.logindetails();
        } 
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
                                <Card.Title>Login</Card.Title>
                                <InputGroup className="mb-3">
                                    <FormControl placeholder="Email" type="text" onChange={this.getEmail} aria-label="provide registered email" />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <FormControl onKeyPress={this.handleEnter} placeholder="Password" type="password" onChange={this.getPassword} aria-label="provide registered password" />
                                </InputGroup>
                            </Card.Body>
                            <Card.Body>
                                <Button onClick={this.logindetails} variant="primary">Login</Button>
                                <div style={{marginTop: '10px'}}>Not registered yet, then click below link to register.</div>
                                <Card.Link href="/register">Register</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={3}></Col>
                </Row>
            </Container>
        );
    }
}
LoginComponent.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(mapStateToProps, {loginUser})(LoginComponent);