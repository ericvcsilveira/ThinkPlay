<template>
  <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white w-4/5 max-h-[calc(100vh-4rem)] p-8 rounded-lg shadow-lg relative overflow-y-auto">
      <!-- Botão para fechar a modal -->
      <button @click="closeModal" class="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Conteúdo da modal com scroll -->
      <div>
        <!-- Texto da modal -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ response[0].categoria }}</h2>
          <h3 class="text-2xl font-semibold text-gray-700">{{ response[0].nome }}</h3>
        </div>

        <!-- Atributos do indicador -->
        <div class="mb-6 p-4 border-b border-gray-200 last:border-none">
          <h4 class="text-lg font-semibold text-black mb-1">Definição:</h4>
          <p class="text-gray-700">{{ response[0].definicao }}</p>
        </div>

        <div class="mb-6 p-4 border-b border-gray-200 last:border-none">
          <h4 class="text-lg font-semibold text-black mb-1">Aplicações práticas:</h4>
          <ul class="text-gray-700 list-disc ml-5">
            <li v-for="item in splitValues(response[0].aplicacoes_praticas)" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="mb-6 p-4 border-b border-gray-200 last:border-none">
          <h4 class="text-lg font-semibold text-black mb-1">Como pode ser implementado:</h4>
          <ul class="text-gray-700 ml-5">
            <li>
              <div class="list-disc">
                {{ splitImplementacao(response[0].como_implementado).descricao }}
              </div>
            </li>
            <li>
              <code class="block bg-gray-800 text-green-300 mt-4 px-3 py-1.5 rounded text-sm">
                {{ splitImplementacao(response[0].como_implementado).codigo }}
              </code>
            </li>
          </ul>
        </div>

        <div class="mb-6 p-4 border-b border-gray-200 last:border-none">
          <h4 class="text-lg font-semibold text-black mb-1">Indicadores relacionados:</h4>
          <ul class="text-gray-700 list-disc ml-5">
            <li v-for="item in this.relacionados" :key="item">
              <button @click="indicadorRelacionado(item[0])" class="related-indicator-button hover:text-blue-500">{{ item[1] }}</button>
            </li>
          </ul>
        </div>
        
        <div class="mb-6 p-4 border-b border-gray-200 last:border-none">
          <h4 class="text-lg font-semibold text-black mb-3">Referências</h4>
          <ul class="text-gray-700 list-disc ml-5 space-y-2">
            <li v-for="(item) in splitRef(response[0].referencias, response[0].referencias_completas)" :key="item.url">
              <a :href="item.url" target="_blank" class="reference-tag text-blue-600 hover:underline p-4 text-sm">{{ item.titulo }}</a>
            </li>
          </ul>
        </div>


        <div v-if="response[0].imagens" class="mb-6 p-4 border-b border-gray-200 last:border-none">
          <h4 class="text-lg font-semibold text-black mb-1">Possíveis visualizações:</h4>
          <div class="flex flex-col items-center space-x-4">
            <img v-for="image in splitImages(response[0].imagens)" :key="image" :src="getImagePath(image)" :alt="image.trim()" class="h-64 mt-2 rounded-md shadow-md"/>
          </div>
        </div>
      </div>

      <div v-if="!value" class="flex justify-end mt-4">
        <button
          @click="adicionarAoCarrinho" 
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-md shadow-md relative flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span class="mx-2">Adicionar ao projeto</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      modalOpen: false,
      categoria: '',
      indicador: '',
      value: false,
      id: null,
      detalhe: false,
      response: [],
      teste: ['Incremente o valor por 1 cada vez que um jogador acessa a fase', 'numJogadores = numJogadores  + 1'],
      relacionados: []
    };
  },
  methods: {
    async openModal(categoria, indicador, id, value) {
      console.log(categoria)
      this.modalOpen = true;
      this.categoria = categoria;
      this.indicador = indicador;
      this.id = id;
      if (value) {
        this.value = true;
      } else {
        this.value = false;
      }

      try {
        const response = await axios.get(`http://localhost:4000/indicadores/detalhe/${id}`);
        this.response = response.data;
      } catch (error) {
        console.error('Erro ao obter os detalhes do indicador:', error);
      }
      this.getIndicadorNome(this.response[0].indicadores_relacionados)
    },
    closeModal() {
      if (this.value) {
        this.$emit('detalhe');
      }
      this.modalOpen = false;
    },
    adicionarAoCarrinho() {
      console.log('Adicionado ao carrinho:', this.indicador, this.id);
      this.closeModal();
      this.$emit('carrinho', this.indicador, this.categoria, this.id);
    },
    splitValues(value) {
      return value.split(';').map(item => item.trim());
    },
    splitRef(referencias, referenciasCompletas) {
      const urls = referencias.split(';').map(item => item.trim());
      const titulos = referenciasCompletas.split(';').map(item => item.trim());
      return urls.map((url, index) => ({ url, titulo: titulos[index] }));
    },
    splitImages(value) {
      return value.split(/[,;]/).map(item => item.trim());
    },
    getImagePath(image) {
      return new URL(`../assets/images/indicadores_imagens/${String(image).trim()}`, import.meta.url).href;
    },
    async indicadorRelacionado(id) {
      try {
        const response = await axios.get(`http://localhost:4000/indicadores/detalhe/${id}`);
        this.response = response.data;
        const categoria = this.response[0].categoria.trim()
        console.log(this.response[0])
        console.log(this.response[0].categoria)
        this.closeModal()
        this.$emit('relacionado', categoria, this.response[0].nome, this.response[0].id)
        
      } catch (error) {
        console.error('Erro ao obter os detalhes do indicador:', error);
      }
    },
    splitImplementacao(value) {
      const [descricao, codigo] = value.split(' | ');
      return { descricao, codigo };
    },
    async getIndicadorNome (id) {
      this.relacionados = []
      const numeros = id.split(/[^0-9]+/)
      for (const indicadorRelacionado of numeros) {
        console.log('num', indicadorRelacionado)
        try {
          const relacionado = await axios.get(`http://localhost:4000/indicadores/detalhe/${indicadorRelacionado}`);
          const nome = relacionado.data[0].nome;
          this.relacionados.push([indicadorRelacionado, nome]);
        } catch (error) {
          console.error('Erro ao obter os detalhes do indicador:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.overflow-y-auto {
  max-height: calc(100vh - 4rem); /* Ajuste para garantir que a modal não ocupe toda a altura da tela */
  overflow-y: auto;
}

.reference-tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  border-radius: 0.25rem;
  background-color: #3182ce; /* azul */
  color: white;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
}

.reference-tag:hover {
  background-color: #2b6cb0; /* azul escuro */
}
</style>
