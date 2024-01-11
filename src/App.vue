<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/book-edit">Book Edit</RouterLink>
      <RouterLink to="/preview-and-download">Preview and Download</RouterLink>
    </nav>
  </header>
  <div class="view">
    <RouterView />
  </div>
</template>

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
  height: 100vh;
  font-size: 2rem;
}
</style>
