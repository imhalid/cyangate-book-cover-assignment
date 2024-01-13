<!-- MoveableTitle.vue -->
<template>
    <h1 class="title" ref="title" :style="{ left: `${x}px`, top: `${y}px` }" 
    @click="$emit('selectText', {type: type })" 
    @mousedown="moveStart" 
    @mousemove="move"
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
const props = defineProps({
    text: String,
    container: HTMLElement,
    type: String,
});

defineEmits(['selectText']);
let title = ref(null);
const x = ref(0);
const y = ref(0);
const mouseDown = ref(false);
let startX = 0;
let startY = 0;

if (getBookData.value.titlePosition.x > 1) {
    const position = props.type === 'title'
        ? getBookData.value.titlePosition
        : getBookData.value.authorPosition;
    x.value = position.x;
    y.value = position.y;
} else if (getBookData.value.titlePosition.x === 0) {
    const defaults = {
        title: { x: 20, y: 40 },
        author: { x: 20, y: 80 }
    };
    const defaultPosition = defaults[props.type];
    x.value = defaultPosition.x;
    y.value = defaultPosition.y;
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
    let containerHeight = props.container.offsetHeight;
    let titleWidth = title.value.offsetWidth;
    let titleHeight = title.value.offsetHeight;

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + titleWidth > containerWidth) newX = containerWidth - titleWidth;
    if (newY + titleHeight > containerHeight) newY = containerHeight - titleHeight;

    x.value = newX;
    y.value = newY;
    setTitlePosition(newX, newY);
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
    user-select: none;
    text-align: center;
    cursor: move;
}
</style>