<template>
  <div class="min-h-screen bg-gray-200 flex flex-col">
    <Navbar />
    <div class="flex justify-center mt-12">
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-8">
          Encontre seus indicadores de dados para seu Jogo Digital Educacional!
        </h1>
        <form @submit.prevent="verificarUsuario" class="space-y-6">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              E-mail
            </label>
            <input v-model="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="E-mail">
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Senha
            </label>
            <input v-model="senha" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********">
          </div>
          <div class="flex items-center justify-between">
            <button :class="{ 'opacity-50': !email || !senha }" :disabled="!email || !senha" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline transition ease-in-out duration-300" type="submit">
              Entrar
            </button>
          </div>
        </form>
        <div class="flex items-center justify-center mt-6">
          <p class="text-gray-700">Ainda não tem cadastro?</p>
          <button @click="goToProfile" class="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-300" type="button">
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import axios from 'axios';

export default {
  components: { Navbar },
  data() {
    return {
      email: '',
      senha: '',
    };
  },
  methods: {
    async verificarUsuario() {
      let id = null
      try {
        const response = await axios.get('http://localhost:4000/usuarios');
        const usuarios = response.data;
        const usuario = usuarios.find(user => user.email === this.email && user.senha === this.senha);
        if (usuario) {
          id = usuario.id
        }
        console.log(id)

        if (usuario) {
          this.$router.push({path: `/projects/${usuario.id}`});
        } else {
          alert('Email ou senha incorretos');
        }
      } catch (error) {
        console.error('Erro ao verificar o usuário:', error);
        alert('Erro ao verificar o usuário');
      }
    },
    goToProfile() {
      this.$router.push('/profile/0');
    }
  }
};
</script>