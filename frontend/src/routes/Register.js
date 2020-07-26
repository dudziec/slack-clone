import React, { useState } from 'react';
import { Form, Button, Container, Input, Header } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';


const REGISTER_MUTATION = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password)
    }
`;

const Register = () => {
    const [ user, setUser ] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [registerMutation] = useMutation(REGISTER_MUTATION);

    return (
        <Container text fluid> 
            <Form>
                <Form.Field>
                    <Header as='h2'>Username</Header>
                    <Input value={user.username} onChange={e => setUser( {...user, username: e.target.value} )} placeholder="Username"/>
                </Form.Field>
                <Form.Field>
                    <Header as='h2'>E-Mail</Header>
                    <Input value={user.email} onChange={e => setUser( {...user, email: e.target.value} )} placeholder="E-Mail" type="email"/>
                </Form.Field>
                <Form.Field>
                    <Header as='h2'>Password</Header>
                    <Input value={user.password} onChange={e => setUser( {...user, password: e.target.value} )} placeholder="Password" type="password"/>
                </Form.Field>
                <Button primary type='submit' onClick={e => registerMutation({variables: {...user}})}>Submit</Button>
            </Form>
        </Container>
    );
}

export default Register;
