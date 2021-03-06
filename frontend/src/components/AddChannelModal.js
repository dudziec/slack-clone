import React from "react";
import { Modal, Button, Form, Input } from "semantic-ui-react";
import { useFormik } from "formik";
import { useMutation, gql } from "@apollo/client";
import { ME_QUERY } from "../graphql/me";
import _, { findIndex } from "lodash";

const ADD_CHANNEL_MUTATION = gql`
  mutation AddChannel($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
      errors {
        path
        message
      }
    }
  }
`;
/*  */
const AddChannelModal = ({ open, onClose, teamId }) => {
  const [registerMutation, { client }] = useMutation(ADD_CHANNEL_MUTATION);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values) => {
      const response = await registerMutation({
        variables: {
          teamId: teamId,
          name: values.name,
        },
      });

      const {
        data: {
          createChannel: { ok, channel },
        },
      } = response;

      if (ok) {
        const data = client.readQuery({ query: ME_QUERY });
        const writeData = _.cloneDeep(data);

        const teamIdx = findIndex(data.me.team, ["id", teamId]);
        writeData.me.team[teamIdx].channels.push(channel);

        client.writeQuery({ query: ME_QUERY, data: writeData });

        onClose();
      } else {
      }
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
            <Button negative fluid onClick={onClose}>
              Cancel
            </Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddChannelModal;
