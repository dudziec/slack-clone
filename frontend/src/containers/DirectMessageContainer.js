import React, { useEffect } from "react";
import Messages from "../components/Messages";
import { useQuery, gql } from "@apollo/client";
import { Comment } from "semantic-ui-react";
import getDate from "../currentTime";

const DIRECT_MESSAGES_QUERY = gql`
  query($teamId: Int!, $interlocutorId: Int!) {
    allDirectMessages(teamId: $teamId, interlocutorId: $interlocutorId) {
      id
      text
      sender {
        id
        username
      }
      createdAt
    }
  }
`;

const newDirectMessageSubscription = gql`
  subscription($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      text
      sender {
        username
      }
      createdAt
    }
  }
`;

const DirectMessageContainer = ({ teamId, interlocutorId }) => {
  const { loading, data, subscribeToMore } = useQuery(DIRECT_MESSAGES_QUERY, {
    variables: {
      teamId: parseInt(teamId),
      interlocutorId: parseInt(interlocutorId),
    },
    options: {
      fetchPolicy: "network-only",
    },
  });

  useEffect(() => {
    subscribeToMore({
      document: newDirectMessageSubscription,
      variables: { teamId: parseInt(teamId), userId: parseInt(interlocutorId) },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        console.log(subscriptionData);
        return {
          ...prev,
          allDirectMessages: [
            ...prev.allDirectMessages,
            subscriptionData.data.newDirectMessage,
          ],
        };
      },
    });
  }, [subscribeToMore, teamId, interlocutorId]);

  if (loading) {
    return null;
  }

  return (
    <Messages>
      <Comment.Group>
        {data.allDirectMessages.map((message) => (
          <Comment key={`direct-message-${message.id}`}>
            <Comment.Author as="a">{message.sender.username}</Comment.Author>
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

export default DirectMessageContainer;
