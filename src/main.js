import 'babel-polyfill';
import 'es6-map';

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueApollo from 'vue-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'unfetch';

import createStore from './store';
import App from './components/main_page/App.vue';
import Event from './components/event_page/Event.vue';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueApollo);

const routes =
  PROD_MODE === 'publish'
    ? [
        { path: '/entrance-task-2/dist/', name: '/', component: App },
        { path: '/entrance-task-2/dist/event.html', name: 'event', component: Event },
      ]
    : [{ path: '/', name: '/', component: App }, { path: '/event/', name: 'event', component: Event }];

const router = new VueRouter({
  mode: 'history',
  routes,
});

const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri: '/graphql',
    fetch,
  }),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store: createStore(),
  apolloProvider,
  router,
});
