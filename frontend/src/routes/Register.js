import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Input,
  Header,
  Message,
} from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

const REGISTER_MUTATION = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    usernameError: "",
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
  });

  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const history = useHistory();

  return (
    <Container text fluid>
      {(user.usernameError || user.passwordError || user.emailError) && (
        <Message
          error
          header="There was some errors with your submission"
          list={[
            user.usernameError,
            user.passwordError,
            user.emailError,
          ].filter((x) => x)}
        />
      )}
      <Form>
        <Form.Field error={user.usernameError !== ""}>
          <Header as="h2">Username</Header>
          <Input
            fluid
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Username"
          />
        </Form.Field>
        <Form.Field error={user.emailError !== ""}>
          <Header as="h2">E-Mail</Header>
          <Input
            fluid
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="E-Mail"
            type="email"
          />
        </Form.Field>
        <Form.Field error={user.passwordError !== ""}>
          <Header as="h2">Password</Header>
          <Input
            fluid
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Password"
            type="password"
          />
        </Form.Field>
        <Button
          primary
          type="submit"
          onClick={async (e) => {
            registerMutation({ variables: { ...user } }).then((response) => {
              const { ok, errors } = response.data.register;
              if (ok) {
                history.push("/login");
              } else {
                const err = {
                  usernameError: "",
                  emailError: "",
                  passwordError: "",
                };

                errors.forEach(({ path, message }) => {
                  err[`${path}Error`] = message;
                });

                setUser({ ...user, ...err });
              }
            });
          }}
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
