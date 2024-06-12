<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <Navbar :userId="userId" />
    <div class="relative">
      <button @click="voltar" class="absolute top-4 left-4 text-gray-600 hover:text-gray-800 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button @click="showDicaModal" class="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v1m0 4h.01M12 10V3"></path>
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </button>


      <p class="mt-8 text-3xl font-bold text-center">
        Meus Projetos
      </p>
    </div>
    <div class="flex justify-center mt-8 w-full px-8">
      <div class="w-full max-w-5xl">
        <table class="min-w-full bg-white shadow-md rounded mb-4">
          <thead>
            <tr>
              <th class="py-2 px-4 bg-gray-200">Nome</th>
              <th class="py-2 px-4 bg-gray-200">Indicadores</th>
              <th class="py-2 px-4 bg-gray-200">Data</th>
              <th class="py-2 px-4 bg-gray-200">Editar</th>
              <th class="py-2 px-4 bg-gray-200">Excluir</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="projeto in projetos" :key="projeto.id">
              <td class="text-center border-t py-2 px-4">{{ projeto.nome }}</td>
              <td class="text-center border-t py-2 px-4">
                <p v-if="!projeto.indicadores_json">
                  <router-link :to="`/categories/${this.userId}/${projeto.id}`" class="font-bold text-green-500">Cadastrar agora!</router-link>
                </p>
                <ul v-else>
                  <li>
                    <button @click="abrirModalIndicadores(projeto.nome, projeto.indicadores_json)" class="font-bold text-blue-500">
                      {{ numeroDeIndicadores(projeto.indicadores_json) }} Indicador(es)
                    </button>
                  </li>
                </ul>
              </td>
              <td class="text-center border-t py-2 px-4">{{ formatDate(projeto.data_criacao) }}</td>
              <td class="text-center border-t py-2 px-4">
                <router-link :to="`/categories/${this.userId}/${projeto.id}`">
                  <button class="text-blue-500 hover:text-blue-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-1.5l-8.036 8.036-1.5 4.5 4.5-1.5 8.036-8.036-3.536-3.536zm3.536-1.5a2.5 2.5 0 00-3.536 0l-8.036 8.036a2.5 2.5 0 000 3.536l3.536 3.536a2.5 2.5 0 003.536 0l8.036-8.036a2.5 2.5 0 000-3.536l-3.536-3.536z"></path>
                    </svg>
                  </button>
                </router-link>
              </td>
              <td class="text-center border-t py-2 px-4">
                <button @click="confirmDeleteProject(projeto.id)" class="text-red-500 hover:text-red-700">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-center mt-8">
          <button @click="createProject" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Novo Projeto
          </button>
        </div>
      </div>
    </div>
    <IndicadoresProjeto ref="indicadoresProjeto" />
    <DicaModal ref="dicaModal" @naoMostrarNovamente="naoMostrarNovamente" />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import axios from 'axios';
import IndicadoresProjeto from '../components/IndicadoresProjeto.vue';
import DicaModal from '../components/DicaModal.vue';

export default {
  components: { Navbar, IndicadoresProjeto, DicaModal },
  data() {
    return {
      projetos: [],
      userId: 0,
      userDica: 1
    }
  },
  methods: {
    confirmDeleteProject(id) {
      if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
        this.deleteProject(id);
      }
    },
    deleteProject(id) {
      axios.delete(`http://localhost:4000/projetos/${id}`)
        .then(response => {
          console.log(response.data); 
          this.getProjetos(this.userId);
        })
        .catch(error => {
          console.error('Erro ao excluir o projeto:', error);
        });
    },
    createProject() {
      this.$router.push({path: `/newProject/${this.userId}`});
    },
    voltar() {
      this.$router.push('/');
    },
    async getProjetos(userId) {
      try {
        const response = await axios.get(`http://localhost:4000/projetos/${userId}`);
        this.projetos = response.data;
      } catch (error) {
        console.error('Erro ao obter os projetos:', error);
      }
    },
    parseIndicadores(indicadoresJson) {
      try {
        return JSON.parse(indicadoresJson);
      } catch (error) {
        console.error('Erro ao parsear indicadores JSON:', error);
        return [];
      }
    },
    numeroDeIndicadores(indicadoresJson) {
      const indicadores = this.parseIndicadores(indicadoresJson);
      return indicadores.length;
    },
    abrirModalIndicadores(nomeProjeto, indicadoresJson) {
      const indicadores = this.parseIndicadores(indicadoresJson);
      const indicadoresProjeto = indicadores.reduce((acc, indicador) => {
        if (!acc[indicador.categoria]) {
          acc[indicador.categoria] = [];
        }
        acc[indicador.categoria].push(indicador.nome);
        return acc;
      }, {});
      this.$refs.indicadoresProjeto.openModal(nomeProjeto, indicadoresProjeto);
    },
    showDicaModal() {
      this.$refs.dicaModal.openModal(this.userDica);
    },
    async naoMostrarNovamente() {
      try {
          await axios.put(`http://localhost:4000/usuarios/dica/${this.userId}`, {}, {
              headers: {
                  'Content-Type': 'application/json'
              }
          });
      } catch (error) {
          console.error('Erro ao atualizar o atributo dica do usuário:', error.message);
      }
    },
    async verificarUsuario() {
      try {
        const response = await axios.get(`http://localhost:4000/usuarios/${this.userId}`);
        const usuario = response.data;
        if (usuario.dica == 1) {
          this.$refs.dicaModal.openModal(1);
        } else {
          this.userDica = 0
        }
      } catch (error) {
        console.error('Erro ao verificar o usuário:', error);
      }
    },
    formatDate(dateString) {
      console.log('data', dateString);
      const date = new Date(dateString);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  },
  created() {
    this.userId = Number(this.$route.params.id);
    this.getProjetos(this.userId);
    setTimeout(() => {
      this.verificarUsuario()
    }, 50);
  }
}
</script>