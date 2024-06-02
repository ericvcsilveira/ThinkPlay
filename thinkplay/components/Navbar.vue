<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-6 py-3 flex justify-between items-center">
      <div class="text-2xl font-bold text-blue-500">
          <nuxt-link to="/"><span class="text-yellow-500">Think</span>Play</nuxt-link>
      </div>
      <div class="flex space-x-4">
        <nuxt-link :to="`/projects/${userId}`" class="text-gray-700 text-sm hover:text-blue-500">Meus Projetos</nuxt-link>
        <nuxt-link :to="`/newProject/${userId}`" class="text-gray-700 text-sm hover:text-blue-500">Cadastrar Projeto</nuxt-link>
        <nuxt-link :to="`/profile/${userId}`" class="text-gray-700 text-sm hover:text-blue-500">Meu Perfil</nuxt-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    userId: {
      type: Number,
      default: 0
    }
  }
}
</script>
