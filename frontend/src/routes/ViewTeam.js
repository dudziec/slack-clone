import React from 'react';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import Header from '../components/Header';
import Messages from '../components/Messages';
import Input from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import SendMessage from '../components/SendMessage';

const ViewTeam = () => {
    return (
        <AppLayout>
        <Teams teams={[{id: 1, letter: 'S'}]}/>
        <Channels
            teamName="Team name"
            username="Username"
            channels={[{id: 1, name: 'general'}, {id: 2, name: 'random random'}]}
            users={[{id: 1, name: 'slackbot'}]}
        />
        <Header channelName="general"/>
        <Messages>
          <ul className="message-list">
            <li />
            <li />
          </ul>
        </Messages>
        <SendMessage channelName="general"/>
      </AppLayout>
    );
}
export default ViewTeam;