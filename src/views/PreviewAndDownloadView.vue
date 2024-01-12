<template>
  <div class="container">
    <img :src="getFinalImageData" alt="Preview" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useBook } from '../store/store.js';
const book = useBook();
const { getFinalImageData } = storeToRefs(book);
</script>

<style>
.container {
  color: black;
}

img {
  max-height: 700px;
}
</style>