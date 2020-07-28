import React from 'react';
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { Form, Button, Container, Input, Header } from 'semantic-ui-react';
import { gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
    mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            ok,
            token,
            refreshToken, 
            errors {
                path,
                message
            }
        }
    }
`;

export default observer(class Login extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            email: '',
            password: '',
        });
    }

    onSubmit = () => {
        const { email, password } = this;
    }

    onChange = e => {
        const { name, value } = e.target;
         this[name] = value;
    }

    render() {
        const { email, password } = this;
        return (
            <Container text fluid> 
            <Header as='h1'>Login</Header>
            <Form>
                <Form.Field>
                    <Input 
                        name="email"
                        fluid
                        value={email} 
                        onChange={this.onChange} 
                        placeholder="E-Mail" 
                        type="email"/>
                </Form.Field>
                <Form.Field>
                    <Input 
                        name="password"
                        fluid
                        value={password} 
                        onChange={this.onChange} 
                        placeholder="Password" 
                        type="password"/>
                </Form.Field>
                <Button onClick={this.onSubmit}>Submit</Button>
            </Form>
        </Container>)
    }
});
