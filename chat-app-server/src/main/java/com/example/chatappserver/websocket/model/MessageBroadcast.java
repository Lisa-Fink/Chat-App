package com.example.chatappserver.websocket.model;


import com.example.chatappserver.model.Message;

public class MessageBroadcast {
    private MessageType type;
    private Object data;

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public MessageBroadcast(MessageType type, Object data) {
        this.type = type;
        this.data = data;
    }
}