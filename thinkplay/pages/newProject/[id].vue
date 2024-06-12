<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <Navbar :userId="userId" />
    <div class="relative">
      <button @click="voltar" class="absolute top-4 left-4 text-gray-600 hover:text-gray-800 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <p class="mt-8 mx-8 md:mx-16 lg:mx-32 xl:mx-48 text-3xl font-bold text-center">
        Novo Projeto
      </p>
    </div>
    <div class="flex justify-center mt-8 w-full">
      <div class="w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
        <form @submit.prevent="cadastrarProjeto" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-300">
          <div class="mb-4">
            <label class="block text-black text-md font-bold mb-2" for="nome">
              Nome
            </label>
            <input v-model="nome" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="nome" type="text" placeholder="Nome do Projeto">
          </div>
          <div class="mb-4">
            <label class="block text-black text-md font-bold mb-2" for="objetivo">
              Objetivo
            </label>
            <textarea v-model="objetivo" class="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" id="objetivo" rows="4" placeholder="Objetivo do Projeto"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-black text-md font-bold mb-2" for="publicoAlvo">
              Público Alvo
            </label>
            <input v-model="publicoAlvo" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="publicoAlvo" type="text" placeholder="Público Alvo do Projeto">
          </div>


          <div class="flex justify-center mt-8">
            <button 
              :disabled="this.publicoAlvo == '' || this.nome == '' || this.objetivo == '' " 
              type="submit" 
              class="w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline  bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed">
              {{ cadastrando ? 'Cadastrando...' : 'Cadastrar' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../../components/Navbar.vue';
import axios from 'axios';

export default {
  components: { Navbar },
  data() {
    return {
      nome: '',
      objetivo: '',
      publicoAlvo: '',
      indicadores: '',
      dataCriacao: '',
      userId: '',
      cadastrando: false,
      projectId: ''
    };
  },
  methods: {
    async cadastrarProjeto() {
      this.cadastrando = true;
      const currentDate = new Date().toLocaleDateString('en-CA');7
      console.log(currentDate)
      const payload = {
        nome: this.nome,
        objetivo: this.objetivo,
        publico_alvo: this.publicoAlvo,
        usuario_id: this.userId, // Supondo que o ID do usuário seja 1
        indicadores: null,
        data_criacao: currentDate,
      };

      try{
        const response = await axios.post('http://localhost:4000/projetos', JSON.stringify(payload), {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log('Projeto cadastrado:', response.data);
        console.log(response.data.id)
        this.projectId = response.data.id
        this.nome = '';
        this.objetivo = '';
        this.publicoAlvo = '';
        this.indicadores = ''; 
        this.dataCriacao = '';
        this.$router.push({path: `/categories/${this.userId}/${this.projectId}`});
      } catch(error) {
        console.error('Erro ao cadastrar o projeto:', error);
      } finally {
        this.cadastrando = false;
      }
    },
    voltar() {
      this.$router.push({path: `/projects/${this.userId}`});
    }
  },
  created() {
    this.userId = Number(this.$route.params.id);
  }
};
</script>
