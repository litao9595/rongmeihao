<template>
  <quill-editor ref="myTextEditor"
                v-model="content" :options="quillOption">
  </quill-editor>
</template>

<script>

  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'
  import quillConfig from './faTouTiao/quill-config.js'

  export default {
    components: {
      quillEditor
    },
    mounted(){
      quillConfig.initButton();
    },
    data() {
      return {
        content: '<h2>freddy</h2>',
        quillOption: quillConfig,
      }
    }
  }
</script>
<style scoped>

</style>
