import React, { useState } from "react";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import decode from "jwt-decode";
import AddChannelModal from "../components/AddChannelModal";
import InvitePeopleModal from "../components/InvitePeopleModal";
import DirectMessageModal from "../components/DirectMessageModal";

const Sidebar = ({ teams, team, directMessageMembers }) => {
  const [modal, setModal] = useState(false);
  const [invitePeopleModal, setInvitePeopleModal] = useState(false);
  const [directMessageModal, setDirectMessageModal] = useState(false);

  let username = "";
  let isOwner = false;

  try {
    const token = localStorage.getItem("token");
    const { user } = decode(token);
    username = user.username;
    isOwner = team.admin;
  } catch (err) {}

  const toggleAddChannelModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    setModal(!modal);
  };

  const toggleOnInvitePeople = (e) => {
    if (e) {
      e.preventDefault();
    }
    setInvitePeopleModal(!invitePeopleModal);
  };

  const toggleDirectMessageModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    setDirectMessageModal(!directMessageModal);
  };

  return [
    <Teams key="sidebar-teams" teams={teams} />,
    <Channels
      key="sidebar-channels"
      teamName={team.name}
      username={username}
      channels={team.channels}
      isOwner={isOwner}
      onInvitePeople={toggleOnInvitePeople}
      onDirectMessageClick={toggleDirectMessageModal}
      teamId={team.id}
      users={directMessageMembers}
      onAddChannelClick={toggleAddChannelModal}
    />,
    <AddChannelModal
      teamId={team.id}
      open={modal}
      onClose={toggleAddChannelModal}
      key="sidebar-add-channel-modal"
    />,
    <DirectMessageModal
      teamId={team.id}
      open={directMessageModal}
      onClose={toggleDirectMessageModal}
      key="sidebar-direct-message-modal"
    />,
    <InvitePeopleModal
      teamId={team.id}
      open={invitePeopleModal}
      onClose={toggleOnInvitePeople}
      key="sidebar-invite-people-modal"
    />,
  ];
};

export default Sidebar;
