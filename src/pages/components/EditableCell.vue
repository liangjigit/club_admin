<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input
        v-model.number="value"
        @change="handleChange"
        @pressEnter="check"
      /><a-icon type="check" class="editable-cell-icon-check" @click="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: Number
  },
  data() {
    return {
      value: this.text,
      editable: false
    };
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      this.value = value;
    },
    check() {
      let reg = new RegExp(/^[0-9]\d*$/);
      if (reg.test(this.value)) {
        this.editable = false;
        this.value = Number(this.value) || 0;
        this.$emit("change", this.value);
      } else {
        this.$message.error({
          content: "排序格式错误，要求是 ≥0 的整数",
          key: "changeSort",
          duration: 2
        });
      }
    },
    edit() {
      this.editable = true;
    }
  }
};
</script>

<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
