import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import {
  Form,
  Header,
  Button,
  Input,
  Message,
  Container,
} from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

const CREATE_TEAM_MUTATION = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

const CreateTeam = () => {
  const [registerMutation] = useMutation(CREATE_TEAM_MUTATION);
  const history = useHistory();

  const store = useLocalStore(() => ({
    name: "",
    errors: {
      nameError: "",
    },
  }));

  return useObserver(() => (
    <Container text fluid>
      {store.errors.nameError ? (
        <Message
          error
          header="There was some errors with your submission"
          list={[store.errors.nameError].filter((x) => x)}
        />
      ) : null}
      <Form>
        <Header as="h2">Create a team</Header>
        <Form.Field error={store.errors.nameError !== ""}>
          <Input
            name="name"
            onChange={(e) => (store.name = e.target.value)}
            placeholder="Team name"
            value={store.name}
          />
        </Form.Field>
        <Button
          onClick={async () => {
            const { name } = store;
            let response = null;

            try {
              response = await registerMutation({ variables: { name } });
            } catch (err) {
              history.push("/login");
              return;
            }

            const { ok, team, errors } = response.data.createTeam;

            if (ok) {
              history.push(`/view-team/${team.id}`);
            } else {
              const err = {
                nameError: "",
              };

              errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
              });
              console.log(err);
              store.errors = err;
            }
          }}
        >
          Submit
        </Button>
      </Form>
    </Container>
  ));
};

export default CreateTeam;
