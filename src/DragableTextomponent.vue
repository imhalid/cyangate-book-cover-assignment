<!-- MoveableTitle.vue -->
<template>
    <h1 class="title" ref="title" :style="{ left: `${x}px`, top: `${y}px` }" @click="$emit('selectText', {data: true})" @mousedown="moveStart" @mousemove="move"
        @mouseup="moveEnd">
        {{ text }}
    </h1>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useBook } from '../src/store/store.js';
const book = useBook();
const { getBookData } = storeToRefs(book);
console.log(getBookData.titlePosition)
const props = defineProps({
    text: String,
    container: HTMLElement,
    type: String,
});


// emit
defineEmits(['selectText']);

console.log(props);

let title = ref(null);
const x = ref(0);
const y = ref(0);
const mouseDown = ref(false);
let startX = 0;
let startY = 0;

if (props.type === 'title') {
    x.value = getBookData.value.titlePosition.x;
    y.value = getBookData.value.titlePosition.y;
} else if (props.type === 'author') {
    x.value = getBookData.value.authorPosition.x;
    y.value = getBookData.value.authorPosition.y;
}

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

function setTitlePosition(x,y) {
    if (props.type === 'title') {
        book.setTitlePosition({x, y})
    } else if (props.type === 'author') {
        book.setAuthorPosition({x, y})
    }
}

const move = (e) => {
    if (!mouseDown.value) return;
    let newX = e.clientX - startX;
    let newY = e.clientY - startY;
    let containerWidth = props.container.offsetWidth;
    let containerHeight = props.offsetHeight;
    let titleWidth = title.value.offsetWidth;
    let titleHeight = title.value.offsetHeight;

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + titleWidth > containerWidth) newX = containerWidth - titleWidth;
    if (newY + titleHeight > containerHeight) newY = containerHeight - titleHeight;

    x.value = newX;
    y.value = newY;
    setTitlePosition(newX, newY);
    console.log(getBookData.value.titlePosition)
};

const moveEnd = () => {
    mouseDown.value = false;
};
</script>

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
</style>