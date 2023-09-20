
const socket = io();
const messageBox = document.querySelector('.message-box');
const messageInput = document.getElementById('message');
const users = document.querySelectorAll('.user-chat');
const chatContainer = document.querySelector('.chat');
const senderId = localStorage.getItem('id');
let recipentId;

const senderMessage = (msg) => {
  return `
    <div class="msg-container">
      <div>${msg}</div>
    </div>
  `;
}

const recipentMessage = (msg) => {
  return `
    <div class="msg-container recipent">
      <div class="recipent-msg">${msg}</div>
    </div>
  `;
}

const showMessages = (msgs, recId, messagesContainer) => {
  localStorage.removeItem(recId);
  msgs.forEach(msg => {
    messagesContainer.innerHTML += recipentMessage(msg);
    messagesContainer.scrollTop += 70;
  });
}

const openRoom = () => {
  messageBox.style.visibility = 'visible';
  chatContainer.innerHTML = '';
  chatContainer.classList.add('room');
  const messagesContainer = document.createElement('div');
  messagesContainer.classList.add('messages-container');
  const msgs = JSON.parse(localStorage.getItem(recipentId));
  console.log(recipentId);
  console.log(msgs);
  if(msgs) {
    showMessages(msgs, recipentId, messagesContainer);
  }
  return messagesContainer;
}

const closeRoom = (backArrow) => {
  backArrow.innerHTML = '';
  chatContainer.classList.remove('room');
  chatContainer.innerHTML = usersStr;
  messageBox.style.visibility = 'hidden';
}

const manageChatDom = (users) => {
  users.forEach(user => {
    user.addEventListener('click', e => {
      recipentId = e.target.dataset.id;
      if(!recipentId) {
        recipentId = e.target.parentElement.dataset.id;
      }
      socket.emit('open room', { senderId, recipentId });
      const usersStr = chatContainer.innerHTML;
      const messagesContainer = openRoom();
      const backArrow = document.createElement('i');
      backArrow.classList.add('fa-solid','fa-arrow-right');
      backArrow.addEventListener('click', () => {
        closeRoom(backArrow, usersStr);
        const usersNodes = chatContainer.querySelectorAll('.user-chat');
        manageChatDom(usersNodes);
      });
      chatContainer.append(backArrow);
      chatContainer.append(messagesContainer);
    });
  });
}

const updateStatus = (users) => {
  const usersDom = document.querySelectorAll('.user-chat');
  usersDom.forEach(user => {
    const id = user.dataset.id;
    const status = user.querySelector('.status');
    if (users.includes(id)) {
      status.classList.add('online');
    } else {
      status.classList.remove('online');
    }
  });
}

socket.on("connect", () => {
  console.log('connected');
});

socket.emit('authenticate', senderId);

// socket.on('update status', (users) => {
//   updateStatus(users);
//   console.log('inside update status');
// });

const sendMessage = document.getElementById('send-message');
sendMessage.addEventListener('click', e => {
  e.preventDefault();
  const messagesContainer = document.querySelector('.messages-container');
  socket.emit('send message', { message: messageInput.value, senderId, recipentId });
  messagesContainer.innerHTML += senderMessage(messageInput.value);
  messageInput.value = '';
  messagesContainer.scrollTop += 70;
});

const saveMessages = (msg, senderId) => {
  let unreadMsgs = JSON.parse(localStorage.getItem(senderId));
  const users = document.querySelectorAll('.user-chat');
  if(!unreadMsgs) {
    unreadMsgs = [];
  }
  unreadMsgs.push(msg);
  localStorage.setItem(senderId, JSON.stringify(unreadMsgs));
  users.forEach(user => {
    console.log(user.dataset.id + '===' + senderId);
    if(user.dataset.id === senderId) {
      const newMsgCame = user.querySelector('.new-message-came');
      newMsgCame.style.display = 'initial';
    }
  });
}

socket.on('send message', ({ message: msg, senderId, recipentId: recId }) => {
  if(!chatContainer.classList.contains('room') || !recipentId === recId) {
    saveMessages(msg, senderId);
    console.log(senderId);
    return;
  }
  const messagesContainer = document.querySelector('.messages-container');
  showMessages([msg], senderId, messagesContainer);
});

manageChatDom(users);
fetch('/api/v1/status')
.then(response => {
  return response.json();
})
.then(data => {
  updateStatus(data.users);
})
.catch(err => {
  console.error(err);
});