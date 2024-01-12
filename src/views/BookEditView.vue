<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import html2canvas from 'html2canvas';
import DragableTextomponent from '@/DragableTextomponent.vue';
import { storeToRefs } from 'pinia'
import { useBook } from '../store/store.js';

const image = ref(null);
const imageUrl = ref(null);
const router = useRouter();
let imageContainer = ref(null);
let imageDataURL = ref(null);
const book = useBook();
const { getBookData, getRawImageData } = storeToRefs(book);

watchEffect(() => {
	if (!image.value) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		imageUrl.value = e.target.result;
		book.setRawImageData(imageUrl.value);
	};
	reader.readAsDataURL(image.value);
});

const handleFileAdd = (e) => {
	image.value = e.target.files[0];
};

const  nextPageToPreviewImage = () => {
	const capture = document.querySelector('.image-container');
	html2canvas(capture, {width: capture.offsetWidth, height: capture.offsetHeight}).then(canvas => {
		canvas.getContext('2d', { willReadFrequently: true })
		imageDataURL.value = canvas.toDataURL('image/png');
		book.setFinalImageData(imageDataURL.value);
	})
	router.push('/preview-and-download');
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
		<input type="file" accept="image/*" @change="handleFileAdd">
		<div class="image-container" ref="imageContainer">
			<div class="image-container" v-if="getRawImageData">
				<DragableTextomponent :text="getBookData.title" :container="imageContainer" @selectText="(a) => console.log(a)" />
				<DragableTextomponent :text="getBookData.author" :container="imageContainer" @selectText="(a) => console.log(a)" />
				<img v-if="getRawImageData" :src="getRawImageData" class="image" alt="Uploaded image">
			</div>
		</div>
		<button @click="nextPageToPreviewImage">Download</button>
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