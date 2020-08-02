import React from 'react';
import { Modal, Button, Form, Input } from 'semantic-ui-react';

const AddChannelModal = ({ open, onClose }) => {

    return (
      <Modal
        open={open}
        closeIcon
        onClose={onClose}
      >
        <Modal.Header>Add channel</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field fluid>
                    <Input
                        name="name"
                        placeholder="Channel name"
                    />
                </Form.Field>
                <Form.Group fluid>
                    <Button primary fluid>Create channel</Button>
                    <Button negative fluid>Cancel</Button>
                </Form.Group>
            </Form>
        </Modal.Content>

      </Modal>
    )
}

export default AddChannelModal;