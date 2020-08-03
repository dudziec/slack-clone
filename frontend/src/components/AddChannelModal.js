import React from "react";
import { Modal, Button, Form, Input } from "semantic-ui-react";
import { useFormik } from "formik";
import { useMutation, gql } from "@apollo/client";

const ADD_CHANNEL_MUTATION = gql`
  mutation AddChannel($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      id
    }
  }
`;

const AddChannelModal = ({ open, onClose, teamId }) => {
  const [registerMutation] = useMutation(ADD_CHANNEL_MUTATION);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values) => {
      await registerMutation({
        variables: {
          teamId: teamId,
          name: values.name,
        },
      });
      onClose();
    },
  });

  return (
    <Modal open={open} closeIcon onClose={onClose}>
      <Modal.Header>Add channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              id="name"
              name="name"
              onChange={formik.handleChange}
              placeholder="Channel name"
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

export default AddChannelModal;
