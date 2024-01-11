<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';

const image = ref(null);
const imageUrl = ref(null);

watchEffect(() => {
    if (!image.value) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        imageUrl.value = e.target.result;
    };
    reader.readAsDataURL(image.value);
});

const handleFileChange = (e) => {
    image.value = e.target.files[0];
};



let imageContainer = ref(null);
let title = ref(null);
const x = ref(0);
const y = ref(0);
const mouseDown = ref(false);
let startX = 0;
let startY = 0;

onMounted(() => {
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', moveEnd);
});

onUnmounted(() => {
    window.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', moveEnd);
});

const moveStart = (e) => {
    mouseDown.value = true;
    startX = e.clientX - x.value;
    startY = e.clientY - y.value;
};

const move = (e) => {
    title.value = document.getElementById('title');
    if (!mouseDown.value) return;
    let newX = e.clientX - startX;
    let newY = e.clientY - startY;
    let containerWidth = imageContainer.value.offsetWidth;
    let containerHeight = imageContainer.value.offsetHeight;
    let titleWidth = title.value.offsetWidth;
    let titleHeight = title.value.offsetHeight;

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + titleWidth > containerWidth) newX = containerWidth - titleWidth;
    if (newY + titleHeight > containerHeight) newY = containerHeight - titleHeight;

    x.value = newX;
    y.value = newY;
};

const moveEnd = () => {
    mouseDown.value = false;
};
</script>

<template>
    <div>
        <div v-if="image">
            <select name="fontSize" id="">
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="16">16</option>
            </select>
            <select name="textColor" id="">
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
            </select>
            <select name="letterSpacing" id="">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
            </select>
        </div>
        <input type="file" accept="image/*" @change="handleFileChange">
        <div class="image-container" v-if="image" ref="imageContainer">
                <h1 class="title" id="title" 
                    :style="{ left: `${x}px`, top: `${y}px` }"
                    @mousedown="moveStart"
                    @mousemove="move"
                    @mouseup="moveEnd"
                >
                    Hello World
                </h1>
                <img v-if="imageUrl" :src="imageUrl" class="image" alt="Uploaded image">
            </div>
    </div>
</template>

<style scoped>

.title {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    user-select: none;
}

.image-container {
    position: relative;
    display: flex;
}
.image {
    max-height: 700px;
}
</style>