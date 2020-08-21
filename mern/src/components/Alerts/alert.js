import React, { Component } from 'react'
import { Alert } from 'react-bootstrap';

class AlertComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            type: '',
            message: ''
        }
    }
    componentDidMount() {
        this.setState(state=>({show: this.props.show, type: this.props.type, message: this.props.message}))
    }
    render() {
        if(this.props.show) {
            return (
                <Alert variant={this.props.type} style={{textAlign: 'center'}}>
                    {this.props.message}
                </Alert>
            )
        }
    }
}

export default AlertComponent;