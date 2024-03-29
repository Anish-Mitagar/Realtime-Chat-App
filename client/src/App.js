import React, {useEffect, useState} from "react"
import '../src/styles/App.css';
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import Pusher from "pusher-js"
import axios from "./utils/axios"

function App() {

  const [messages, setMessages] = useState([]);


  useEffect(()=>{
    axios.get('/messages/encryptedsync').then(response => {
      setMessages(response.data)
    })
  }, []);

  useEffect(() => {
    const pusher = new Pusher('4ff174e122389c3e4450', {
      cluster: 'mt1'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages])

  console.log(messages)

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar/>
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
