<template>
  <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white w-3/5 p-8 rounded-lg shadow-lg relative max-h-full overflow-y-auto mt-8 mb-8">
      <!-- Botão para fechar a modal -->
      <button @click="closeModal" class="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Título da Modal -->
      <h2 class="text-3xl font-bold mb-4">Projeto: {{ (this.projectName) }}</h2>
      <h3 class="text-xl font-semibold text-red-500 mb-8">Indicadores Selecionados: {{ totalIndicadores }}</h3>

      <!-- Lista de Indicadores Agrupados por Categoria -->
      <div v-for="(indicadores, categoria) in indicadoresAgrupados" :key="categoria" class="mb-8">
        <h4 class="text-2xl font-bold mb-4">{{ categoria }}</h4>
        <div v-for="(indicador) in indicadores" :key="indicador.id" class="flex justify-between items-center mb-4 bg-white p-4 rounded shadow-md">
          <div>
            <p class="text-lg font-semibold">{{ indicador.nome }}</p>
          </div>
          <div class="flex items-center">
            <!-- Botão para abrir a modal com detalhes -->
            <button @click="openDetalheModal(indicador.categoria, indicador.nome, indicador.id)" class="text-yellow-500 hover:text-yellow-700 mx-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
              </svg>
            </button>
            <!-- Botão para remover o indicador -->
            <button @click="confirmDeleteIndicador(indicador.id)" class="text-red-500 hover:text-red-700 mx-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Botões de Editar e Salvar -->
      <div class="flex justify-center mt-8">
        <button @click="closeModal" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg mx-2">
          Editar
        </button>
        <button @click="confirmRegister" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mx-2">
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '~/components/Navbar.vue';
import IndicadorModal from '~/components/Indicador.vue';

export default {
  components: { Navbar, IndicadorModal },
  data() {
    return {
      indicadores: [],
      modalOpen: false,
      usuario_id: '',
      projectName: ''
    };
  },
  computed: {
    indicadoresAgrupados() {
      return this.indicadores.reduce((acc, indicador) => {
        if (!acc[indicador.categoria]) {
          acc[indicador.categoria] = [];
        }
        acc[indicador.categoria].push(indicador);
        return acc;
      }, {});
    },
    totalIndicadores() {
      return this.indicadores.length;
    }
  },
  methods: {
    openModal(carrinhoLista, usuario_id, project_id) {
      this.project_id = project_id
      this.getProjectName(project_id)
      this.usuario_id = usuario_id
      this.modalOpen = true;
      this.indicadores = carrinhoLista.map(item => ({
        id: item.id,
        nome: item.indicador,
        categoria: item.categoria
      }));
    },
    openDetalheModal(categoria, indicador, id) {
      this.closeModal();
      setTimeout(() => {
        this.$emit('indicadorModal', categoria, indicador, id);
      }, 50);
    },
    closeModal() {
      this.modalOpen = false;
    },
    confirmDeleteIndicador(id) {
      if (window.confirm('Tem certeza que deseja excluir este indicador?')) {
        this.removerIndicador(id);
      }
    },
    removerIndicador(id) {
      this.indicadores = this.indicadores.filter(indicador => indicador.id !== id);
      this.$emit('remove-indicador', id);
    },
    confirmRegister() {
      if (window.confirm('Tem certeza que deseja salvar este projeto?')) {
        this.salvarIndicadores();
      }
    },
    async salvarIndicadores() {
      try {
        const projetoId = this.project_id
        const payload = {
          indicadores: this.indicadores.map(indicador => ({
            ...indicador,
            categoria: indicador.categoria.trim()
          }))
        }
        const response = await axios.put(`http://localhost:4000/projetos/${projetoId}/indicadores`, payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.$router.push({path: `/projects/${this.usuario_id}`});
      } catch (error) {
        console.error('Erro ao atualizar os indicadores:', error);
      }
    },
    async getProjectName(projeto_id) {
      try {
        const response = await axios.get(`http://localhost:4000/projetos/nome/${projeto_id}`);
        this.projetos = response.data;
        this.projectName = this.projetos[0].nome
      } catch (error) {
        console.error('Erro ao obter os projetos:', error);
      }
    },
  }
};
</script>
