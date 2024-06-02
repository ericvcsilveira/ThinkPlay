<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="relative">
      <button @click="voltar" class="absolute top-4 left-4 text-gray-600 hover:text-gray-800 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <p v-if="this.userId == 0" class="mt-4 mx-8 md:mx-16 lg:mx-32 xl:mx-48 text-3xl font-bold text-center">
        Cadastro de Usuário
      </p>
      <p v-else class="mt-4 mx-8 md:mx-16 lg:mx-32 xl:mx-48 text-3xl font-bold text-center">
        Editar Usuário
      </p>
    </div>
    <div class="flex justify-center mt-8 w-full">
      <div class="w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
        <form @submit.prevent="cadastrarUsuario" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-300">
          <div class="mb-4">
            <label class="block text-gray-700 text-md font-bold mb-2" for="nome">
              Nome
            </label>
            <input v-model="nome" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="nome" type="text" placeholder="Nome">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-md font-bold mb-2" for="email">
              E-mail
            </label>
            <input v-model="email" @input="validarEmail" :class="{ 'border-red-500': emailInvalido }" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="E-mail">
            <p v-if="emailInvalido" class="text-red-500 text-xs italic">Formato de e-mail inválido.</p>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-md font-bold mb-2" for="senha">
              Senha
            </label>
            <input v-model="senha" @input="validarSenha" :class="{ 'border-red-500': senhaCurta }" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="senha" type="password" placeholder="Senha">
            <p v-if="senhaCurta" class="text-red-500 text-xs italic">A senha deve ter pelo menos 8 caracteres.</p>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-md font-bold mb-2" for="ocupacao">
              Ocupação
            </label>
            <select v-model="ocupacao" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ocupacao">
              <option value="" disabled selected>Selecione uma ocupação</option>
              <option value="Desenvolvedor de Jogos">Desenvolvedor de Jogos</option>
              <option value="Designer de Jogos">Designer de Jogos</option>
              <option value="Analista de Dados">Analista de Dados</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-md font-bold mb-2" for="dataNascimento">
              Data de Nascimento
            </label>
            <input v-model="dataNascimento" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="dataNascimento" type="date">
          </div>
          <div class="mb-4 flex">
            <label for="experienciaGla" class="block text-gray-700">Experiência GLA:</label>
            <input type="checkbox" id="experienciaGla" v-model="experienciaGla" class="mx-4" />
          </div>

          <div class="flex justify-center mt-8">
            <button v-if="this.userId == 0" :class="{ 'opacity-50': !nome || !email || !senha || !ocupacao || !dataNascimento }" :disabled="!nome || !email || !senha || !ocupacao || !dataNascimento" class="bg-green-500 hover:bg-green-600 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cadastrar
            </button>
            <button v-else :class="{ 'opacity-50': !nome || !email || !senha || !ocupacao || !dataNascimento }" :disabled="!nome || !email || !senha || !ocupacao || !dataNascimento" class="bg-green-500 hover:bg-green-600 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nome: '',
      email: '',
      senha: '',
      ocupacao: '',
      dataNascimento: '',
      experienciaGla: false,
      emailInvalido: false,
      senhaCurta: false,
      cadastrando: false,
      userId: null
    };
  },
  methods: {
    async cadastrarUsuario() {
      if (this.userId == 0){
        try {
          this.cadastrando = true;
          const payload = {
            nome: this.nome,
            email: this.email,
            senha: this.senha,
            ocupacao: this.ocupacao,
            data_nascimento: this.dataNascimento,
            experiencia_gla: this.experienciaGla,
            dica: 1
          };
          const response = await axios.post('http://localhost:4000/usuarios', payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(response => {
            console.log('Usuário cadastrado:', response.data);
            this.nome = '';
            this.email = '';
            this.senha = '';
            this.ocupacao = '';
            this.dataNascimento = '';
            this.experienciaGla = false;
            this.voltar()
          }).catch(error => {
              console.error('Erro ao excluir o projeto:', error);
          });
        } catch (error) {
          console.error('Erro ao cadastrar o usuário:', error);
        } finally {
          this.cadastrando = false;
        }
      } else {
        try {
          this.cadastrando = true;
          const payload = {
              nome: this.nome,
              email: this.email,
              senha: this.senha,
              ocupacao: this.ocupacao,
              data_nascimento: this.dataNascimento,
              experiencia_gla: this.experienciaGla,
          };
          const response = await axios.put(`http://localhost:4000/usuarios/${this.userId}`, payload, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          console.log('Usuário atualizado:', response.data);
          // Limpar os campos do formulário ou fazer qualquer outra ação necessária após a atualização bem-sucedida
          this.nome = '';
          this.email = '';
          this.senha = '';
          this.ocupacao = '';
          this.dataNascimento = '';
          this.experienciaGla = false;
          this.voltar();
      } catch (error) {
          console.error('Erro ao atualizar o usuário:', error);
      } finally {
          this.cadastrando = false;
      }
      }
    },
    voltar() {
      if (this.userId == 0){
        this.$router.push('/');
      } else {
        this.$router.push({path: `/projects/${this.userId}`});
      }
      
    },
    validarEmail() {
      const regexEmail = /\S+@\S+\.\S+/;
      this.emailInvalido = !regexEmail.test(this.email);
    },
    validarSenha() {
      this.senhaCurta = this.senha.length < 8;
    },
    async getUser () {
      try {
        const response = await axios.get(`http://localhost:4000/usuarios/${this.userId}`);
        const usuario = response.data;
        this.nome = usuario.nome
        this.email = usuario.email
        this.senha = usuario.senha
        this.ocupacao = usuario.ocupacao
        this.dataNascimento = usuario.data_nascimento
        if (usuario.experiencia_gla == true) {
          this.experienciaGla = true
        } else {
          this.experienciaGla = false
        }
      } catch (error) {
        console.error('Erro ao verificar o usuário:', error);
        alert('Erro ao verificar o usuário');
      }
    }
  },
  created() {
    this.userId = Number(this.$route.params.id);
    if (this.userId != 0){
      this.getUser()
    } else {
      this.userId = 0
    }

  }
};
</script>
