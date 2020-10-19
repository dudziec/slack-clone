import React from "react";
import { Modal, Button, Form, Input } from "semantic-ui-react";
import { useFormik } from "formik";
import { gql, useQuery } from "@apollo/client";
import Downshift from "downshift";
import { useHistory } from "react-router";

const USER_FROM_TEAM_QUERY = gql`
  query($id: Int!) {
    getTeamMembers(id: $id) {
      id
      username
    }
  }
`;

const DirectMessageModal = ({ open, onClose, teamId }) => {
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values) => {},
  });

  const { data, loading } = useQuery(USER_FROM_TEAM_QUERY, {
    variables: { id: teamId },
  });

  if (loading) {
    return null;
  }

  return (
    <Modal open={open} closeIcon onClose={onClose}>
      <Modal.Header>Direct Message</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Downshift
              onChange={(selection) =>
                history.push(`/view-team/user/${teamId}/${selection.id}`)
              }
              itemToString={(item) => (item ? item.username : "")}
            >
              {({
                getInputProps,
                getItemProps,
                getMenuProps,
                inputValue,
                highlightedIndex,
                selectedItem,
                isOpen,
              }) => (
                <div>
                  <Input {...getInputProps()} fluid />
                  <ul {...getMenuProps()}>
                    {isOpen &&
                      data.getTeamMembers
                        .filter(
                          (item) =>
                            !inputValue || item.username.includes(inputValue)
                        )
                        .map((item, index) => (
                          <li
                            {...getItemProps({
                              key: `${item.username}${index}`,
                              item,
                              index,
                              style: {
                                backgroundColor:
                                  highlightedIndex === index
                                    ? "lightgray"
                                    : "white",
                                fontWeight:
                                  selectedItem === item ? "bold" : "normal",
                              },
                            })}
                          >
                            {item.username}
                          </li>
                        ))}
                  </ul>
                </div>
              )}
            </Downshift>
          </Form.Field>
          <Form.Group>
            <Button type="submit" onClick={formik.handleSubmit} primary fluid>
              Create direct message
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

export default DirectMessageModal;
