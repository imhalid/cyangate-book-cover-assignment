<template>
  <header>
    <nav>
      <a-breadcrumb separator=">">
      <a-breadcrumb-item>
      <RouterLink to="/">Home</RouterLink>
      </a-breadcrumb-item>
      <a-breadcrumb-item :class="{ 'bold-class': editPageActive, 'disabled-class': !editPageAvailable }">
        <RouterLink to="/book-edit">Book Edit</RouterLink>
      </a-breadcrumb-item>
      <a-breadcrumb-item :class="{ 'bold-class': previewPageActive, 'disabled-class': !previewPageAvailable }">
        <RouterLink to="/preview-and-download">Preview and Download</RouterLink>
      </a-breadcrumb-item>
    </a-breadcrumb>
    </nav>
  </header>
  <div class="view">
    <RouterView />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useBook } from './store/store.js';
import { useRoute } from 'vue-router';
import {ref, watch } from 'vue'

const editPageActive = ref(false)
const previewPageActive = ref(false)
const editPageAvailable = ref(false)
const previewPageAvailable = ref(false)
const route = useRoute();
const book = useBook();

const { getRawImageData, listsNames } = storeToRefs(book);

watch(route, (newRoute) => {
  if (listsNames.value.length > 0) {
    editPageAvailable.value = true
  } else  {
    editPageAvailable.value = false
  }

  if (getRawImageData.value) {
    previewPageActive.value = true
    previewPageAvailable.value = true
  } else {
    previewPageActive.value = false
    previewPageAvailable.value = false
  }
  
   if (newRoute.path === '/book-edit') {
    editPageActive.value = true
  } else {
    editPageActive.value = false
  }

  if (newRoute.path === '/preview-and-download') {
    previewPageActive.value = true
  } else {
    previewPageActive.value = false
  }

});

</script>

<style scoped>
nav {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

a {
  text-decoration: none;
  color: black;
}

.view {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  height: calc(100vh - (86px + 2rem + 2rem));
}

.bold-class {
    font-weight: bold;
}

.disabled-class {
    pointer-events: none;
    opacity: 0.5;
}
</style>
