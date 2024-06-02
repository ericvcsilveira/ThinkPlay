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
        <div class="flex">
            <h2 class="text-3xl font-bold mb-4">Projeto: </h2>
            <p class="text-3xl font-semibold mb-4 mx-2">{{ nomeProjeto }}</p>
        </div>
        <h3 class="text-xl font-semibold text-red-500 mb-8">Indicadores Selecionados: {{ totalIndicadores }}</h3>
  
        <!-- Lista de Indicadores Agrupados por Categoria -->
        <div v-for="(indicadores, categoria) in indicadoresProjeto" :key="categoria" class="mb-8">
          <h4 class="text-2xl font-bold mb-4">{{ categoria }}</h4>
          <div v-for="(indicador, index) in indicadores" :key="index" class="flex justify-between items-center mb-4 bg-white p-4 rounded shadow-md">
            <div>
              <p class="text-lg font-semibold">{{ indicador }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        modalOpen: false,
        nomeProjeto: '',
        indicadoresProjeto: {}
      };
    },
    methods: {
      openModal(nomeProjeto, indicadoresProjeto) {
        this.modalOpen = true;
        this.nomeProjeto = nomeProjeto;
        this.indicadoresProjeto = indicadoresProjeto;
      },
      closeModal() {
        this.modalOpen = false;
      }
    },
    computed: {
      totalIndicadores() {
        let total = 0;
        for (let categoria in this.indicadoresProjeto) {
          total += this.indicadoresProjeto[categoria].length;
        }
        return total;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Adicione estilos adicionais, se necessário */
  </style>
  