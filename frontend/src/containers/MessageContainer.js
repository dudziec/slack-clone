import React, { useEffect } from "react";
import Messages from "../components/Messages";
import ALL_MESSAGES_QUERY from "../graphql/message";
import { useQuery, gql } from "@apollo/client";
import { Comment } from "semantic-ui-react";
import getDate from "../currentTime";

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      createdAt
    }
  }
`;

const MessageContainer = ({ channelId }) => {
  const { subscribeToMore, loading, data } = useQuery(ALL_MESSAGES_QUERY, {
    variables: {
      channelId: channelId,
    },
    options: {
      fetchPolicy: "network-only",
    },
  });

  useEffect(() => {
    subscribeToMore({
      document: newChannelMessageSubscription,
      variables: { channelId: channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        return {
          ...prev,
          allMessages: [
            ...prev.allMessages,
            subscriptionData.data.newChannelMessage,
          ],
        };
      },
    });
  }, [subscribeToMore, channelId]);

  if (loading) {
    return null;
  }

  return (
    <Messages channelId={channelId}>
      <Comment.Group>
        {data.allMessages.map((message) => (
          <Comment key={`message-${message.id}`}>
            <Comment.Author as="a">{message.user.username}</Comment.Author>
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
