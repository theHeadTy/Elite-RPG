
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

 Vue.component('example', require('./components/Example.vue'));
 Vue.component('chat-message', require('./components/ChatMessage.vue'));
 Vue.component('chat-log', require('./components/ChatLog.vue'));
 Vue.component('chat-compose', require('./components/ChatCompose.vue'));

 /* Elite-RPG Map */
 Vue.component('elite-map', require('./components/Map.vue'));
 Vue.component('elite-mobs', require('./components/world/Mobs.vue'));
 /* Admin Test Map */
 Vue.component('test-map', require('./components/MapTest.vue'));

 /**
  * @todo - restructure this.
  */
 const app = new Vue({
     el: '#app',

     data: {

         // chat
         items: [],
         usersInRoom: [],

         // world
         playersInWorld: [],
         maps: [],
         x: 150,
         y: 150,
         src: '',
         roomName: '',

         mobs: [],

     },

     methods: {

         // Chat send message
         sendMessage: function(item) {
             this.items.push(item);
             axios.post('/messages', item).then(response => {

             });
         },

         // TODO: Seperate maps[] and players[]
         loadMap: function() {
             axios.get('/loadmap').then(response => {
                 this.maps = [];
                 this.maps.push({
                     src: response.data.image,
                     x: this.x,
                     y: this.y,
                     width: 384,
                     height: 384
                 });
             });
         },

         loadMobs: function() {
         }
     },

     created: function() {

         this.loadMap();

         axios.get('/mobs/1/150/150').then(response => {
            // this.mobs.push(response.data);
            console.log(response.data);
         });

         // Elite-RPG websocket - 'pusher'
         Echo.join('eliteworld')
            .here((users) => {
                this.playersInWorld = users;
            })
            .joining((user) => {
                this.playersInWorld.push(user);
            })
            .leaving((user) => {
                this.playersInWorld = this.playersInWorld.filter(u => u != user)
            });

        // Chat
        axios.get('/messages').then(response => {
                this.items = response.data;
        });

        Echo.join('chatroom')
             .here((users) => {
                 this.usersInRoom = users;
             })
             .joining((user) => {
                 this.usersInRoom.push(user);
             })
             .leaving((user) => {
                 this.usersInRoom = this.usersInRoom.filter(u => u != user)
             })
             .listen('MessagePosted', (e) => {
                 this.items.push({
                     message: e.message.message,
                     user: e.user,
                 });
             });
       },
 });
