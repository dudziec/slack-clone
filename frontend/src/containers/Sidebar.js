import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import _ from 'lodash';
import decode from 'jwt-decode';
import AddChannelModal from '../components/AddChannelModal';

const ALL_TEAMS_QUERY = gql`
    query {
        allTeams {
            id
            name
            channels {
              id
              name
            }
          }
    }
`;

const Sidebar = ({ currentTeamId }) => {
    const { loading, data } = useQuery(ALL_TEAMS_QUERY);
    const [ modal, setModal ] = useState(false);

    const handleAddChannelClick = () => {
        setModal(true);
    }

    const handleAddChannelModal = () => {
        setModal(false);
    }


    if(loading) {
        return null; 
    }

    const allTeams = data.allTeams;
    const teamIdx = currentTeamId ? _.findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;

    const team = allTeams[teamIdx];

    let username = '';

    try {
        const token = localStorage.getItem('token');
        const { user }  = decode(token);
        username = user.username;
    } catch (err) {

    }

    return [
        <Teams key="sidebar-teams" teams={allTeams.map(t => ({
            id: t.id,
            letter: t.name.charAt(0).toUpperCase(),
        }))}/>,
        <Channels
            key="sidebar-channels"
            teamName={team.name}
            username={username}
            channels={team.channels}
            users={[{id: 1, name: 'slackbot'}]}
            onAddChannelClick={handleAddChannelClick}
            
        />,
        <AddChannelModal 
            open={modal} 
            onClose={handleAddChannelModal} 
            key="sidebar-add-channel-modal"
        />
    ];
}

export default Sidebar;