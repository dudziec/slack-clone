import React, { useState } from "react";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import decode from "jwt-decode";
import AddChannelModal from "../components/AddChannelModal";
import InvitePeopleModal from "../components/InvitePeopleModal";

const Sidebar = ({ teams, team }) => {
  const [modal, setModal] = useState(false);
  const [invitePeopleModal, setInvitePeopleModal] = useState(false);

  let username = "";

  try {
    const token = localStorage.getItem("token");
    const { user } = decode(token);
    username = user.username;
  } catch (err) {}

  const handleAddChannelClick = () => {
    setModal(true);
  };

  const handleAddChannelModal = () => {
    setModal(false);
  };

  const handleOnInvitePeople = () => {
    setInvitePeopleModal(true);
  }

  const handleCloseInvitePeople = () => {
    setInvitePeopleModal(false);
  }

  return [
    <Teams key="sidebar-teams" teams={teams} />,
    <Channels
      key="sidebar-channels"
      teamName={team.name}
      username={username}
      channels={team.channels}
      onInvitePeople={handleOnInvitePeople}
      teamId={team.id}
      users={[{ id: 1, name: "slackbot" }]}
      onAddChannelClick={handleAddChannelClick}
    />,
    <AddChannelModal
      teamId={team.id}
      open={modal}
      onClose={handleAddChannelModal}
      key="sidebar-add-channel-modal"
    />,
    <InvitePeopleModal
      teamId={team.id}
      open={invitePeopleModal}
      onClose={handleCloseInvitePeople}
      key="sidebar-invite-people-modal"
  />,
  ];
};

export default Sidebar;
