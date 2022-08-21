import React, {useState} from 'react';
import '../styles/Sidebar.css';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SidebarChat from './SidebarChat';


const Sidebar = () => {
    const [input, setInput] = useState("");

    const search = async (e) => {
        e.preventDefault();
        // await axios.post('/messages/new', {
        //     message: input,
        //     name: "Anish Mitagar",
        //     timestamp: "Just now",
        //     received: true
        // });
  
        setInput("");
    };

    return (
        <div className='sidebar'>
            <div className='sidebar__header'>
                <Avatar/>
                <div className='sidebar__headerRight'>
                    <IconButton>
                        <DonutLargeIcon/>
                    </IconButton>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </div>
            </div>

            <div className='sidebar__search'>
                <SearchIcon/>
                <form onSubmit={search}>
                    <input onChange={(e) => setInput(e.target.value)} placeholder="Search" type="text"/>
                    <button type="submit"></button>
                </form>
            </div>

            <div className='sidebar__chats'>
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
            </div>

        </div>
    )
}

export default Sidebar