<template>
  <div>
    <!--<button @click="$store.commit('add')">+</button>-->
    <!--<button @click="$store.commit('reduce')">-</button>-->
    子组件
  </div>
</template>

<script>
    export default {
        name: "count.vue",
        data(){
            return{
              msg:'Hello Vuex',
            }
        }
    }
</script>

<style scoped>

</style>
