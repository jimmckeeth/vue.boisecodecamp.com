<template>
  <div></div>
</template>

<script>
import { onMounted } from 'vue';
import SessionizeService from '../services/SessionizeService.js';

export default {
  setup() {
    onMounted(() => {
      SessionizeService.loadData()
    })
    return {}
  }
}
</script>
