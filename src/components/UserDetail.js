import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
class UserDetail extends Component {
    constructor() {
        super();
        this.state = {
            email: "test@test.com"
        };
    }
    componentDidMount() {
        this.props.socket.on('checkUserDetailResponse', data => {
            console.log(data);
            this.props.registrationConfirmation(data);
        });
    }
    submitEmail = () => {
        this.props.socket.emit('checkUserDetail', { "email": this.state.email });
    };
    onEmailNumberChange = (e) => {
        this.setState({ email: e.target.value });
    };
    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Enter Your Email</Form.Label>
                    <Form.Control type="email" value={this.state.email} onChange={this.onEmailNumberChange} placeholder="Enter Email" />
                    {/*<Form.Text className="text-muted">*/}
                    {/*    Enter Your Email*/}
                    {/*</Form.Text>*/}
                    <Button className="btn-outline-success" disabled={this.state.email.length <3 } onClick={this.submitEmail} variant="" type="button">
                        Login
                    </Button>
                </Form.Group>
            </Form>

        );
    }
}

export default UserDetail;