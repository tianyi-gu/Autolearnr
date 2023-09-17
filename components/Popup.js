import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react';


export const PopChat = (props) => {
  const [chatopen, setChatopen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(props.messages);

  const chatContainer = {
    width: '20%',
    position: 'absolute',
    bottom: '3%',
    right: '3%',
  };
  const chatBox = {
    height: 500,
    borderRadius: 25,
    backgroundColor: '#eee',
  };
  const show = {
    display: 'block',
  };
  const hide= {
    display: 'none',
  };
  const header = {
    backgroundColor: '#3fda73',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  };
  const headerText = {
    color: '#fff',
    fontSize: 20,
  };
  const msgArea = {
    overflow: 'hidden',
    height: 370,
    padding: 15,
  };
  const left = {
    flexDirection: 'row',
  };
  const right = {
    flexDirection: 'row-reverse',
  };
  const messageText = {
    display: 'flex',
    fontSize: 17.5,
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#ddd',
  };
  const footer = {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
  const input = {
    border: '1px solid #fff',
    padding: 10,
    width: '80%',
    borderRadius: 15,
  };
  const sendButton = {
    border: 'none',
    fontSize: 22.5,
    color: 'lightgreen',
    cursor: 'pointer',
  };
  const sendButtonText = {
    color: 'lightgreen',
  };
  const pop = {
    width: '100%',
    height: '25%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  };
  const popText = {
    textAlign: 'right',
  };
  
  const toggleChat = () => {
    setChatopen(!chatopen);
  };

  const handleSend = () => {
    if (message) {
      setMessages([...messages, { text: message, isUser: true }]);
      setMessage('');
      props.getMessage(message);
    }
  };

  return (
    <View style={chatContainer}>
      <View style={[chatBox, chatopen ? show : hide]}>
        <View style={header}>
          <Text style={headerText}>Chat with me</Text>
        </View>
        <View style={msgArea}>
          {messages.map((msg, i) => (
            <View key={i} style={msg.isUser ? right : left}>
              <Text style={messageText}>{msg.text}</Text>
            </View>
          ))}
        </View>
        <View style={footer}>
          <TextInput
            style={input}
            value={message}
            onChangeText={(text) => setMessage(text)}
            placeholder="Type your message..."
          />
          <TouchableOpacity style={sendButton} onPress={handleSend}>
            <Text style={sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={pop} onPress={toggleChat}>
        <Text style={popText}>Open Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PopChat;
