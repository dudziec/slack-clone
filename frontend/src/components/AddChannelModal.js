import React from 'react';
import { Modal, Button, Form, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { gql } from '@apollo/client';

const CREATE_CHANNEL_MUTATION = gql`
    mutation createChannel($teamId: Int!, $name: String!){
        createChannel(teamId: $teamId, name: $name) {
        id,
        name
        }
    }
`;

const AddChannelModal = ({ 
    open, 
    onClose,      
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting 
    }) => {

    return (
      <Modal
        open={open}
        closeIcon
        onClose={onClose}
      >
        <Modal.Header>Add channel</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                    <Input
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="name"
                        placeholder="Channel name"
                    />
                </Form.Field>
                <Form.Group>
                    <Button disabled={isSubmitting} onClick={handleSubmit} primary fluid>Create channel</Button>
                    <Button disabled={isSubmitting} onClick={onClose} negative fluid>Cancel</Button>
                </Form.Group>
            </Form>
        </Modal.Content>

      </Modal>
    )
}

export default withFormik({
    mapPropsToValues: () => ({name: ''}),
    handleSubmit: (values, { props, setSubmitting }) => {
        const [ registerMutation ] = useMutation(CREATE_CHANNEL_MUTATION);
        setSubmitting(false);
    }
}) (AddChannelModal);