// main.js - Punto de Entrada de la Aplicación Vue 3 + Vuetify + Vue Router

const { createApp } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify();

const app = createApp({
  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    }
  }
});

app.use(vuetify);
app.use(router);
app.mount('#app');
