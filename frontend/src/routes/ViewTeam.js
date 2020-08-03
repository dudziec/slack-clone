import React from "react";
import Header from "../components/Header";
import Messages from "../components/Messages";
import AppLayout from "../components/AppLayout";
import SendMessage from "../components/SendMessage";
import SideBar from "../containers/Sidebar";

const ViewTeam = ({ match: { params } }) => {
  return (
    <AppLayout>
      <SideBar currentTeamId={params.teamId} />
      <Header channelName="general" />
      <Messages>
        <ul className="message-list">
          <li />
          <li />
        </ul>
      </Messages>
      <SendMessage channelName="general" />
    </AppLayout>
  );
};
export default ViewTeam;
