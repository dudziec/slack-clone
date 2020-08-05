import React from "react";
import { Modal, Button, Form, Input } from "semantic-ui-react";
import { useFormik } from "formik";
import { useMutation, gql } from "@apollo/client";

const ADD_TEAM_MEMBER_MUTATION = gql`
  mutation addMember($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

const InvitePeopleModal = ({ open, onClose, teamId }) => {
  const [registerMutation ] = useMutation(ADD_TEAM_MEMBER_MUTATION);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values) => {
        const response = await registerMutation({
            variables: {
              teamId: teamId,
              email: values.email,
            },
          });

          console.log(response);
    },
  });

  return (
    <Modal open={open} closeIcon onClose={onClose}>
      <Modal.Header>Add new member to the team</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              id="email"
              name="email"
              onChange={formik.handleChange}
              placeholder="Email"
            />
          </Form.Field>
          <Form.Group>
            <Button type="submit" onClick={formik.handleSubmit} primary fluid>
              Create channel
            </Button>
            <Button negative fluid>
              Cancel
            </Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default InvitePeopleModal;
