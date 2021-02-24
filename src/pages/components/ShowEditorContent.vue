<template>
  <div style="width:750px">
    <div class="ql-container ql-snow">
      <div class="ql-editor" v-html="content"></div>
    </div>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  props: {
    content: String
  }
};
</script>
<style scoped>
.ql-container.ql-snow {
  border-width: 0;
  height: auto;
  min-height: auto;
}
.ql-editor {
  padding: 0;
}
</style>
