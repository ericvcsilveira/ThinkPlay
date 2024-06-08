<template>
    <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white w-3/5 p-8 rounded-lg shadow-2xl relative max-h-full overflow-y-auto mt-8 mb-8">
        <!-- Botão para fechar a modal -->
        <button @click="closeModal" class="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Título da Modal -->
        <div class="flex justify-center">
          <h2 class="text-4xl font-bold mb-6 text-gray-800">ThinkPlay</h2>
        </div>
  
        <!-- Breve Explicação da Ferramenta -->
        <p class="mb-6 text-gray-700">
          Esta é uma ferramenta para auxiliar desenvolvedores de jogos digitais educacionais a incluírem indicadores de Game Learning Analytics em seus jogos.
        </p>
  
        <!-- Definições -->
        <div class="mb-6">
          <h3 class="text-2xl font-bold text-gray-800">Game Learning Analytics (GLA)</h3>
          <p class="text-lg text-gray-700">
            Game Learning Analytics (GLA) é uma abordagem que, por meio da análise de dados, permite uma compreensão mais profunda do comportamento do aluno em ambientes de aprendizado digital, como jogos digitais educacionais (JDEs). O GLA orienta o desenvolvimento de JDEs mais eficazes, tornando o processo de ensino e aprendizado mais eficiente.
          </p>
        </div>
        <div class="mb-6">
          <h3 class="text-2xl font-bold text-gray-800">Indicadores de GLA</h3>
          <p class="text-lg text-gray-700">
            Indicadores de GLA são métricas específicas que ajudam a monitorar e avaliar o desempenho dos jogadores, bem como a eficácia dos elementos educacionais dentro do jogo. Esses indicadores podem incluir registros temporais, ações específicas dos jogadores, entre outros, fornecendo uma visão do progresso e das necessidades dos alunos. Nessa ferramenta, você encontrará indicadores divididos em categorias, acompanhados de diretrizes a seu respeito.
          </p>
        </div>
  
        <!-- Botões -->
        <div class="flex justify-end">
          <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 transition duration-300">Fechar</button>
          <button v-if="userDica == 1" @click="naoMostrarNovamente" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Não mostrar novamente</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        modalOpen: false,
        userDica: 1
      };
    },
    methods: {
      openModal(userDica) {
        this.userDica = userDica 
        this.modalOpen = true;
      },
      closeModal() {
        this.modalOpen = false;
      },
      naoMostrarNovamente() {
        this.closeModal();
        this.$emit('naoMostrarNovamente')
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos adicionais para melhorar a aparência */
  .bg-gray-900 {
    background-color: rgba(17, 24, 39, 0.5);
  }
  .shadow-2xl {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  .transition {
    transition: all 0.3s ease;
  }
  </style>
  