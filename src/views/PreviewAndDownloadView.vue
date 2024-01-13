<template>
  <div class="container">
    <img class="image" :src="getFinalImageData" alt="Preview" />
    <a-button @click="downloadImage" type="primary">Download Image</a-button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useBook } from '../store/store.js';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();
const book = useBook(); 
const { listsNames, getFinalImageData, getBookData } = storeToRefs(book);

onMounted(() => {
  if (listsNames.value.length <= 0) {
    router.push('/');
  }
});

const downloadImage = () => {
  const a = document.createElement('a');
  a.href = getFinalImageData.value;
  a.download = `${getBookData.value.title}.jpg`;
  a.click();
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.image {
  max-height: 600px;
}
</style>