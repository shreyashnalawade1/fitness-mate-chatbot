import eventlet
eventlet.monkey_patch()
import socketio
from flask import Flask, request, jsonify
import jwt
import datetime
from dotenv import load_dotenv
from bot.bot import process_msg
import threading
from queue import Queue


import time

load_dotenv()
# Configuration
import os 
SECRET_KEY =os.getenv("JWT_SECRET")

print(SECRET_KEY)
# Create a Flask app
app = Flask(__name__)

# Create a Socket.IO server instance
sio = socketio.Server(cors_allowed_origins="*",async_mode='eventlet')


# Dictionary to store the mapping of sid to user info
connected_users = {}

@app.route('/', methods=['GET'])
def index():
    return "API is running"


@sio.event
def connect(sid, environ):
    query_string = environ.get('QUERY_STRING', '')
    token = None
    for param in query_string.split('&'):
        if param.startswith('token='):
            token = param.split('=')[1]
            break

    if not token:
        return False

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        id = decoded['id']
        connected_users[sid] = id  # Map sid to id
        print(f'Client connected: {sid} with user: {id}')
        sio.enter_room(sid, id)
    except jwt.ExpiredSignatureError:
        print('Token has expired')
        return False
    except jwt.InvalidTokenError:
        print('Invalid token')
        return False

@sio.event
def disconnect(sid):
    if sid in connected_users:
        id = connected_users.pop(sid)
        print(f'Client disconnected: {sid}, user: {id}')
    else:
        print('Client disconnected:', sid)


def process_response(**kwargs):
    ans=process_msg(kwargs['msg'],kwargs['id']);   
    ans['user']='bot'
    ans['id']="fuck"
    print(ans);
    sio.emit('new_msg',
        ans
    ,room=kwargs['id'])

@sio.event
def new_msg_user(sid, data):
    id = connected_users[sid]
    print(f'Message from {id} ({sid}): {data}')
    data['id']=id;
    threading.Thread(target=process_response,kwargs=data).start()



# Wrap the Flask app with the Socket.IO server
app = socketio.WSGIApp(sio,app)

# Run the server
if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 4000)), app)
