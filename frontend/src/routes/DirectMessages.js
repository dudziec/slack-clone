import React from "react";
import Header from "../components/Header";
import DirectMessageContainer from "../containers/DirectMessageContainer";
import AppLayout from "../components/AppLayout";
import SendMessage from "../components/SendMessage";
import SideBar from "../containers/Sidebar";
import { ME_QUERY } from "../graphql/me";
import { useQuery } from "@apollo/client";
import _ from "lodash";
import { gql, useMutation } from "@apollo/client";
import { Redirect } from "react-router-dom";

const ADD_DIRECT_MESSAGE_MUTATION = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

const DIRECT_MSG_ME = gql`
  query($userId: Int!) {
    getUsername(id: $userId)

    me {
      id
      username
      team {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

const DirectMessages = ({
  match: {
    params: { teamId, userId },
  },
}) => {

  const { loading, data } = useQuery(DIRECT_MSG_ME, {
    variables: {
      userId: parseInt(userId),
    },
    options: {
      fetchPolicy: "network-only",
    },
  });

  const [registerMutation, { client }] = useMutation(
    ADD_DIRECT_MESSAGE_MUTATION
  );

  if (loading) {
    return null;
  }
  

  const teams = data.me.team;

  // there is no team created
  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  let teamIdx = 0;

  const teamTableIndex = _.findIndex(teams, ["id", parseInt(teamId, 10)]);

  if (teamTableIndex !== -1) {
    teamIdx = teamTableIndex;
  }

  const team = teams[teamIdx];

  const directMessageMembers = data.me.team[
    teamIdx
  ].directMessageMembers.filter(
    (member) => member.username !== data.me.username
  );

  return (
    <AppLayout>
      <SideBar
        currentTeamId={teamId}
        teams={teams.map((t) => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        directMessageMembers={directMessageMembers}
      />

      <Header channelName={data.getUsername} />
      <DirectMessageContainer teamId={teamId} interlocutorId={userId} />

      <SendMessage
        onSubmit={async (values, { resetForm }) => {
          if (!values.message || !values.message.trim()) {
            return;
          }

          const result = await registerMutation({
            variables: {
              text: values.message,
              receiverId: parseInt(userId),
              teamId: parseInt(teamId),
            },
          });

          if (result) {
            const data = client.readQuery({ query: ME_QUERY });
            const writeData = _.cloneDeep(data);

            writeData.me.team[teamIdx].directMessageMembers.push({
              __typename: "user",
              id: userId,
              username: data.getUsername,
            });

            client.writeQuery({ query: ME_QUERY, data: writeData });
          }

          resetForm(true);
        }}
        placeholder={userId}
      />
    </AppLayout>
  );
};

export default DirectMessages;
