import React from "react";
import styled from "styled-components";
import { Input } from "semantic-ui-react";
import { Formik, Field, Form } from "formik";
import { gql, useMutation } from "@apollo/client";

const ADD_MESSAGE_MUTATION = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
`;

const SendMessage = ({ channel }) => {
  const [registerMutation] = useMutation(ADD_MESSAGE_MUTATION);

  return (
    <Formik
      initialValues={{
        message: "",
      }}
      onSubmit={async (values, { resetForm }) => {
        if (!values.message || !values.message.trim()) {
          return;
        }

        const response = await registerMutation({
          variables: {
            text: values.message,
            channelId: channel.id,
          },
        });

        resetForm(true);
        console.log(response);
      }}
    >
      <SendMessageWrapper>
        <Form>
          <Field
            fluid
            id="message"
            as={Input}
            name="message"
            placeholder={`Message # ${channel.name}`}
          />
        </Form>
      </SendMessageWrapper>
    </Formik>
  );
};

export default SendMessage;
