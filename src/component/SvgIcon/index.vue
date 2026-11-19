<template>
  <svg aria-hidden="true">
    <use :href="iconName" fill="currentColor" />
  </svg>
</template>
<script>
export default defineComponent({
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const iconName = computed(() => `#icon-${props.iconClass}`)
    return { iconName }
  },
})
</script>
<style></style>
