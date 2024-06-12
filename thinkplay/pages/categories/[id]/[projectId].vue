<template>
  <div class="min-h-screen bg-gray-100 flex flex-col relative">
    <Navbar :userId="usuario_id" />
    <div class="px-8 md:px-16 lg:px-32 xl:px-48 mt-12">
      <p class="text-3xl font-bold text-center text-gray-800">
        Explore as categorias e encontre os indicadores para seu Jogo Digital Educacional
      </p>
      <div class="grid gap-6 mt-8">
        <div v-for="categoria in categorias" :key="categoria.id" class="bg-white shadow-md rounded-lg p-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-black flex items-center">
              <button @click="toggleDescription(categoria)" class="focus:outline-none mr-2">
                <svg v-if="!categoria.showDescription" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {{ categoria.nome }}
            </h2>
            <span v-if="getIndicatorCount(categoria.nome) > 0" class="text-sm text-gray-600">
              {{ getIndicatorCount(categoria.nome) }} indicadores selecionados
            </span>
          </div>
          <div v-if="categoria.showDescription" class="mt-4">
            <p class="text-gray-600">{{ categoria.descricao }}</p>
            <button @click="openModal(categoria.nome)" class="mt-2 flex items-center text-yellow-500 hover:text-yellow-600 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 5.333c0-.736.597-1.333 1.333-1.333.736 0 1.333.597 1.333 1.333 0 .736-.597 1.333-1.333 1.333-.736 0-1.333-.597-1.333-1.333zm1 8c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-4.25c0-.414.336-.75.75-.75s.75.336.75.75V13.333z" fill="currentColor"/>
              </svg>
              <span class="ml-2">Ver mais</span>
            </button>
          </div>
        </div>
        <div class="text-center">
          <button :disabled="carrinhoLista.length == 0" 
            @click="cadastrar" 
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-10 mb-12 text-lg rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed">
            Ver Indicadores Selecionados
          </button>
        </div>
      </div>
    </div>
    <IndicadoresModal ref="modalComponent" @indicadorModal="indicadorModal"/>
    <IndicadorModal ref="indicadorModal" @carrinho="carrinho" @detalhe="detalhe" @relacionado="indicadorModal"/>
    <CarrinhoModal ref="carrinhoModal" @indicadorModal="detalhes" @remove-indicador="removeIndicador"/>
  </div>
</template>

<script>
import Navbar from '../../../components/Navbar.vue';
import IndicadoresModal from '~/components/IndicadoresModal.vue';
import IndicadorModal from '~/components/Indicador.vue';
import CarrinhoModal from '~/components/CarrinhoModal.vue';
import axios from 'axios';

export default {
  components: { Navbar, IndicadoresModal, IndicadorModal, CarrinhoModal },
  data() {
    return {
      categorias: [
        { id: 1, nome: 'Completáveis', showDescription: false, descricao: 'Indicadores que refletem as ações repetíveis dos jogadores, como fases completadas, tentativas, e acertos.' },
        { id: 6, nome: 'Curvas de Aprendizado', showDescription: false, descricao: 'Indicadores que mostram a evolução do desempenho dos jogadores ao longo do tempo, ajudando a identificar progressos e dificuldades.' },
        { id: 7, nome: 'Dados que Precisam de Outros Dispositivos', showDescription: false, descricao: 'Indicadores obtidos através de dispositivos externos.' },
        { id: 5, nome: 'Dados de Fases', showDescription: false, descricao: 'Indicadores que fornecem informações sobre as fases do jogo, como quantas vezes uma fase foi jogada e se foi concluída.' },
        { id: 4, nome: 'Dados de Jogadores', showDescription: false, descricao: 'Indicadores que coletam informações sobre o desempenho e comportamento dos jogadores, como habilidades, estilo de jogo, e número de amigos.' },
        { id: 3, nome: 'Experiência do Usuário', showDescription: false, descricao: 'Indicadores que capturam como os jogadores interagem com a interface do jogo, incluindo cliques, seleções de menu, e engajamento.' },
        { id: 2, nome: 'Rastreamento de Tempo', showDescription: false, descricao: 'Indicadores relacionados ao tempo gasto pelos jogadores em diferentes aspectos do jogo, como tempo em fases, tempo de inatividade, e horários de uso.' }
      ],
      carrinhoLista: [],
      usuario_id: ''
    };
  },
  methods: {
    toggleDescription(categoria) {
      categoria.showDescription = !categoria.showDescription;
    },
    openModal(categoria) {
      this.$refs.modalComponent.openModal(categoria, this.carrinhoLista);
    },
    indicadorModal(categoria, indicador, id) {
      this.$refs.indicadorModal.openModal(categoria, indicador, id, this.carrinhoLista);
    },
    carrinho(indicador, categoria, id) {
      const adicionado = this.carrinhoLista.some(item => item.indicador == indicador && item.categoria == categoria && item.id == id );
      if (!adicionado) {
        const item = { indicador, categoria, id };
        this.carrinhoLista.push(item);
      } else {
        console.log("O indicador já está presente na lista.");
      }
    },

    cadastrar () {
      this.$refs.carrinhoModal.openModal(this.carrinhoLista, this.usuario_id, this.project_id);
    },
    detalhes (categoria, indicador, id) {
      this.$refs.indicadorModal.openModal(categoria, indicador, id, this.carrinhoLista, 1);
    },
    detalhe (){
      this.$refs.carrinhoModal.openModal(this.carrinhoLista, this.usuario_id, this.project_id);
    },
    removeIndicador(id) {
      const index = this.carrinhoLista.findIndex(indicador => indicador.id === id);
      if (index !== -1) {
        this.carrinhoLista.splice(index, 1);
        this.detalhe();
      }
    },
    async loadProject() {
      try {
        const response = await axios.get(`http://localhost:4000/indicadores/${this.usuario_id}/${this.project_id}`);
        const indicadores = response.data;
        if (indicadores && indicadores.length > 0) {
          this.carrinhoLista = indicadores.map(indicador => ({
            ...indicador,
            categoria: indicador.categoria.trim()
          }));
        }
      } catch (error) {
        console.error('Erro ao obter os indicadores:', error);
      }
    },
    getIndicatorCount(categoriaNome) {
      return this.carrinhoLista.filter(item => item.categoria === categoriaNome).length;
    }
  },
  created() {
    this.usuario_id = Number(this.$route.params.id);
    this.project_id = Number(this.$route.params.projectId);
    this.loadProject()
  }
};
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
