import React from "react";
import Header from "../components/Header";
import MessageContainer from "../containers/MessageContainer";
import AppLayout from "../components/AppLayout";
import SendMessage from "../components/SendMessage";
import SideBar from "../containers/Sidebar";
import { ALL_TEAMS_QUERY } from "../graphql/team";
import { useQuery } from "@apollo/client";
import _ from "lodash";
import { Redirect } from "react-router-dom";

const ViewTeam = ({
  match: {
    params: { teamId, channelId },
  },
}) => {
  const { loading, data } = useQuery(ALL_TEAMS_QUERY);

  if (loading) {
    return null;
  }

  const { allTeams, inviteTeams } = data;

  const teams = inviteTeams ? [...allTeams, ...inviteTeams] : allTeams;
  
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

  return (
    <AppLayout>
      <SideBar
        currentTeamId={teamId}
        teams={teams.map((t) => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
      />
      {channel && [
        <Header key="channel-view-header" channelName={channel.name} />,
        <MessageContainer key="channel-view-messages" channelId={channel.id}/>,
        <SendMessage key="channel-view-send" channel={channel} />,
      ]}
    </AppLayout>
  );
};

export default ViewTeam;
