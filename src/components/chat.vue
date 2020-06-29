<template>
    <div class="chat">
        <div class="chat__sidebar">
            <h3>Комната: {{ roomName}}</h3>
            <ul>
                <li v-for="(roomUser, index) in roomUsers" v-bind:key="index">{{ roomUser.username }}</li>
            </ul>
        </div>
        <div class="chat__main">
            <div class="chat__messages" id="messages" >
                <ul>
                    <li v-for="(messageOne, index) in messages" v-bind:key="index">
                        <p>{{ messageOne.username }} : {{ messageOne.createdAt }}</p>
                        <!-- <p>{{ messageOne.username }}</p> -->
                        <p>{{ messageOne.text }}</p>
                    </li>
                </ul>

            </div>
            <div class="compose">
                <form id="message-form" action="">
                        <input v-model="messageOn" name="message" type="text" placeholder="Написать..." autocomplete="off">
                        <button @click="sendMessage">Отправить</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            apiUrl: this.$store.getters.apiUrl, // Ссылка на URL сервера NodeJS
            socket: this.$store.getters.socketUrl,
            chatUsername: '',
            roomName: '',
            createdAt: '',
            message: '',
            messageOn: '',
            roomUsers: [],
            messages: []
        }
    },
    computed: mapState({
        userId: state => state.token.id_user,
        username: state => state.token.full_name,
    }),
    created: function () {
        console.log('Chat apiUrl: ', this.apiUrl)
            axios({
                url: `${this.apiUrl}/api/user/chat`,
                withCredentials: true,
                method: 'POST',
            })  
                .then((resp) => {
                    if (resp.data.error) {
                        console.log('Chat error ', resp.data.error)
                        // return this.$router.push('/login') 
                    }
                    console.log('Chat answer: ', resp.data)
                    // Запись токена в store.js
                    this.$store.dispatch('save_token', resp.data.user)
                })
                .then(() => {
                    this.pageSockets()
                    this.sockets()
                })
                .catch((error) => {
                    console.log('This is Chat error: ', error)
                })
    }, 
    mounted() {
        // this.socket.emit('join', { username, room }, (error) => {
        //     if (error) {
        //         alert(error)
        //         location.href = '/'
        //     }
        // })
    },
    methods: {
        sendMessage(e) {
            e.preventDefault()
            this.socket.emit('sendMessage', { message: this.messageOn, userId: this.userId }, (error) => {
                // console.info('chat: ', this.messageOn)
                if (error) {
                    return console.log(error)
                }

                console.log('Message delivered!')
            })
        },
        pageSockets () {
            let data = { page: 'chat', userId: this.userId }
            // TODO: убрать error, потому что он всегда возвращает true с 
            // callback-а
            this.socket.emit('authorize', data, (error) => {
                console.log('About authorize here.')
                if (error){
                    console.log('About error: ', error)
                }
            })
            this.socket.on('kick', (message) => {
                console.log('Chat.vue socket: ', message)
                this.$router.push('/login')
                this.$store.state.loginBtn = false;
                this.$store.state.sessionQuest = true;
                return this.$store.state.status = message.text
            })
        },
        sockets () {
            this.socket.emit('join', { userId: this.userId, username: this.username, room: 'default' }, (error) => {
                if (error) {
                    // alert(error)
                    console.error('socket join error: ', error)
                    location.href = '/'
                }
            })
            this.socket.on('message', (message) => {
                this.chatUsername = message.username
                this.message = message.text
                this.createdAt = moment(message.createdAt).format('HH:mm:ss')
                this.messages.push(message)
                // console.log(messages)
            })
            
            this.socket.on('roomData', ({ room, users }) => {
                this.roomName = room
                this.roomUsers = users
            })
            console.log('chata asfasfds')
        }
    }
}
</script>
<style scoped>
    input {
        font-size: 14px;
    }
    input {
        border: 1px solid #eeeeee;
        padding: 12px;
        outline: none;
    }
    form { 
        display: flex;
        border: 1px solid rgb(124, 124, 121);
    }

    button {
        cursor: pointer;
        padding: 12px;
        background: #7C5CBF;
        border: none;
        color: white;
        font-size: 16px;
        transition: background .3s ease;
    }

    button:hover {
        background: #6b47b8;
    }

    button:disabled {
        cursor: default;
        background: #7c5cbf94;
    }
    .chat{
        display: flex;
        width: 90%;
        height: 45rem;
        background: var(--white);
    }
    .chat__sidebar{
        width: 20rem;
        height: 45rem;
        padding-left: 2rem;
        color: white;
        background: #333744;
    }
    .chat__main{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 45rem;
    }
    .chat__messages {
        flex-grow: 1;
        padding: 24px 24px 0 24px;
        overflow-y: scroll;
    }
</style>