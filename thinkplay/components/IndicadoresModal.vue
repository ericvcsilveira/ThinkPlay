<template>
  <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white w-4/5 p-8 rounded-lg shadow-lg relative">
      <!-- Botão para fechar a modal -->
      <button @click="closeModal" class="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Texto da modal -->
      <h2 class="text-3xl font-bold text-center mb-4">{{ categoria }}</h2>

      <!-- Indicadores -->
      <div class="mt-12 grid grid-cols-3 gap-4">
        <button
          v-for="(indicador, index) in indicadores"
          :key="index"
          @click="abrirIndicadorModal(indicador.nome, indicador.id)"
          @mouseover="showTooltip = index"
          @mouseleave="showTooltip = null"
          :disabled="estaNoCarrinho(indicador.nome)"
          :class="{
            'bg-white text-gray-800 hover:bg-gray-100': !estaNoCarrinho(indicador.nome),
            'bg-green-100 text-green-700 border-green-300': estaNoCarrinho(indicador.nome)
          }"
          class="font-semibold py-2 shadow-md rounded-md relative mt-4 mx-4 border border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
        >
          {{ indicador.nome }}
          <span class="tooltip" v-if="showTooltip === index">
            <p v-if="!estaNoCarrinho(indicador.nome)">Clique para ver mais</p>
            <p v-else>Indicador já adicionado ao projeto</p>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalOpen: false,
      categoria: '',
      indicadores: [],
      showTooltip: null,
      carrinhoLista: []
    };
  },
  watch: {
    // Monitora a mudança na categoria escolhida e atualiza os indicadores
    categoria(newValue) {
      if (newValue) {
        this.categoria = newValue;
        this.carregarIndicadores(newValue);
      }
    }
  },
  methods: {
    openModal(categoria, carrinhoLista) {
      this.carrinhoLista = carrinhoLista;
      this.modalOpen = true;
      this.categoria = categoria;
    },
    closeModal() {
      this.modalOpen = false;
    },
    async carregarIndicadores(categoria) {
      try {
        // Mapear a categoria para o código de categoria correspondente
        const codigo_categoria = this.mapCategoriaParaCodigo(categoria);

        // Fazer a requisição para buscar os indicadores com base no código de categoria
        const response = await fetch(`http://localhost:4000/indicadores/${codigo_categoria}`);
        const data = await response.json();
        this.indicadores = data;
      } catch (error) {
        console.error('Erro ao carregar os indicadores:', error);
      }
    },
    mapCategoriaParaCodigo(categoria) {
      const categorias = {
        'Completáveis': 1,
        'Rastreamento de Tempo': 2,
        'Experiência do Usuário': 3,
        'Dados de Jogadores': 4,
        'Dados de Fases': 5,
        'Curvas de Aprendizado': 6,
        'Dados que Precisam de Outros Dispositivos': 7
      };

      if (categoria in categorias) {
        return categorias[categoria];
      } else {
        console.error('Categoria não mapeada:', categoria);
        return -1;
      }
    },
    abrirIndicadorModal(nome, id) {
      this.closeModal();
      this.$emit('indicadorModal', this.categoria, nome, id);
    },
    estaNoCarrinho(indicadorNome) {
      return this.carrinhoLista.some(item => item.indicador === indicadorNome);
    }
  }
};
</script>

<style>
.tooltip {
  visibility: hidden;
  background-color: rgba(55, 65, 81, 0.9);
  color: #ffffff;
  text-align: center;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(55, 65, 81, 0.9) transparent transparent transparent;
}

.relative:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
