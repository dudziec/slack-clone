import React from "react";
import Header from "../components/Header";
import MessageContainer from "../containers/MessageContainer";
import AppLayout from "../components/AppLayout";
import SendMessage from "../components/SendMessage";
import SideBar from "../containers/Sidebar";
import { ME_QUERY } from "../graphql/me";
import { useQuery } from "@apollo/client";
import _ from "lodash";
import { Redirect } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const ADD_MESSAGE_MUTATION = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

const ViewTeam = ({
  match: {
    params: { teamId, channelId },
  },
}) => {
  const [registerMutation] = useMutation(ADD_MESSAGE_MUTATION);

  const { loading, data } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return null;
  }

  const teams = data.me.team;

  // there is no team created
  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  let teamIdx = 0;
  let currentChannelId = 0;

  const teamTableIndex = _.findIndex(teams, ["id", parseInt(teamId, 10)]);

  if (teamTableIndex !== -1) {
    teamIdx = teamTableIndex;
  }

  const team = teams[teamIdx];

  const channelTableIndex = _.findIndex(team.channels, [
    "id",
    parseInt(channelId, 10),
  ]);

  if (channelTableIndex !== -1) {
    currentChannelId = channelTableIndex;
  }

  const channel = team.channels[currentChannelId];

  const directMessageMembers = data.me.team[
    teamIdx
  ].directMessageMembers.filter(
    (member) => member.username !== data.me.username
  );

  return (
    <AppLayout>
      <Header block>123 </Header>
      <SideBar
        currentTeamId={teamId}
        teams={teams.map((t) => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        directMessageMembers={directMessageMembers}
      />
      {channel && [
        <Header key="channel-view-header" channelName={channel.name} />,
        <MessageContainer key="channel-view-messages" channelId={channel.id} />,
        <SendMessage
          onSubmit={async (values, { resetForm }) => {
            if (!values.message || !values.message.trim()) {
              return;
            }

            await registerMutation({
              variables: {
                text: values.message,
                channelId: channel.id,
              },
            });

            resetForm(true);
          }}
          key="channel-view-send"
          placeholder={channel.name}
        />,
      ]}
    </AppLayout>
  );
};

export default ViewTeam;
