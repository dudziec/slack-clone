import React from "react";
import Header from "../components/Header";
import Messages from "../components/Messages";
import AppLayout from "../components/AppLayout";
import SendMessage from "../components/SendMessage";
import SideBar from "../containers/Sidebar";
import { ALL_TEAMS_QUERY } from "../graphql/team";
import { useQuery } from "@apollo/client";
import _ from "lodash";

const ViewTeam = ({
  match: {
    params: { teamId, channelId },
  },
}) => {
  const { loading, data } = useQuery(ALL_TEAMS_QUERY);

  if (loading) {
    return null;
  }

  const { allTeams } = data;

  const teamIdx = teamId
    ? _.findIndex(allTeams, ["id", parseInt(teamId, 10)])
    : 0;

  const team = allTeams[teamIdx];
  const currentChannelId = channelId ? _.findIndex(team.channels, ['id', parseInt(channelId, 10)]) : 0;
  const currentChannel = team.channels[currentChannelId];

  return (
    <AppLayout>
      <SideBar
        currentTeamId={teamId}
        teams={allTeams.map((t) => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
      />
      <Header channelName={currentChannel.name} />
      <Messages channelId={currentChannel.id}>
        <ul className="message-list">
          <li />
          <li />
        </ul>
      </Messages>
      <SendMessage channelName={currentChannel.name}  />
    </AppLayout>
  );
};

export default ViewTeam;
