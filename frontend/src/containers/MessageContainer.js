import React from "react";
import Messages from "../components/Messages";
import ALL_MESSAGES_QUERY from "../graphql/message";
import { useQuery } from "@apollo/client";
import { Comment } from "semantic-ui-react";
import getDate from "../currentTime";

const MessageContainer = ({ channelId }) => {
  const { loading, data } = useQuery(ALL_MESSAGES_QUERY, {
    variables: {
      channelId: channelId,
    },
  });

  if (loading) {
    return null;
  }

  const messages = data.allMessages;

  return (
    <Messages channelId={channelId}>
      <Comment.Group>
        {messages.map((message) => (
          <Comment key={`message-${message.id}`}>
            <Comment.Author as='a'>{message.user.username}</Comment.Author>
            <Comment.Metadata>{getDate(message.createdAt)}</Comment.Metadata>
            <Comment.Content>{message.text}</Comment.Content>
            <Comment.Actions>
              <Comment.Action>Replay</Comment.Action>
            </Comment.Actions>
          </Comment>
        ))}
      </Comment.Group>
    </Messages>
  );
};

export default MessageContainer;
