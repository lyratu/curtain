<template>
  <div>
    <span class="title">
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "标题",
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  font-weight: bold;
  font-size: 1.25rem;
}
</style>