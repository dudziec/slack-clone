import React from "react";
import styled from "styled-components";
import { Button, Icon, Input } from "semantic-ui-react";
import { Formik, Field, Form } from "formik";

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  form {
    display: grid;
    grid-template-columns: 3% 97%;
  }
`;

const SendMessage = ({ onSubmit, placeholder }) => {
  return (
    <Formik
      initialValues={{
        message: "",
      }}
      onSubmit={onSubmit}
    >
      <SendMessageWrapper>
        <Form>
          <Button>
            <Icon name="file image"></Icon>
          </Button>
          <Field
            id="message"
            as={Input}
            name="message"
            placeholder={`Message # ${placeholder}`}
          />
        </Form>
      </SendMessageWrapper>
    </Formik>
  );
};

export default SendMessage;
