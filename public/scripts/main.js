const socket = io();
      
        const form = document.getElementById('form');
        const input = document.getElementById('input');
        const messages = document.getElementById('messages');
        const users = document.getElementById('user-list');
      
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
          }
        });
      
        socket.on('chat message', (msg) => {
          const item = document.createElement('li');
          item.textContent = msg;
          messages.appendChild(item);
          window.scrollTo(0, document.body.scrollHeight);
        });

        socket.on('welcome message', message => {
          console.log(message);
          const item = document.createElement('li');
          item.textContent = message;
          users.appendChild(item);
          window.scrollTo(0, document.body.scrollHeight);
        })

        socket.on('disconnection', message => {
          console.log(message);
        })

        socket.on('scoreUpdate', (scoreMessage) => {
          const scoreItem = document.createElement('li');
          scoreItem.textContent = scoreMessage;
          messages.appendChild(scoreItem); 
        });