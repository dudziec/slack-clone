import React from 'react';
import { useLocalStore, useObserver } from 'mobx-react-lite'
import { Form, Button, Container, Input, Header } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

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

const Login = () => {
    const store = useLocalStore(() => ({
        email: '',
        password: '',
    }));

    const [registerMutation] = useMutation(LOGIN_MUTATION);
    const history = useHistory();

    return useObserver( () => (
        <Container text fluid> 
        <Header as='h1'>Login</Header>
        <Form>
            <Form.Field>
                <Input 
                    name="email"
                    fluid
                    value={store.email} 
                    onChange={e => {
                        store.email = e.target.value;
                    }} 
                    placeholder="E-Mail" 
                    type="email"/>
            </Form.Field>
            <Form.Field>
                <Input 
                    name="password"
                    fluid
                    value={store.password} 
                    onChange={e => store.password = e.target.value} 
                    placeholder="Password" 
                    type="password"/>
            </Form.Field>
            <Button onClick={async() => {
                    const { email, password } = store;
                    const response = await registerMutation({variables: {
                        email, password
                    }});

                    console.log(response);
                    const { ok, token, refreshToken, errors } = response.data.login;

                    
                    if(ok) {
                        localStorage.setItem('token', token);
                        localStorage.setItem('refreshToken', refreshToken);
                        history.push('/');
                    }
                    
                }}
                >
                Submit
            </Button>
        </Form>
    </Container>
    ));
}

export default Login;
