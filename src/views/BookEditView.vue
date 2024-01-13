<script setup>
import { ref, watchEffect, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import html2canvas from 'html2canvas';
import DraggableTextComponent from '@/DraggableTextComponent.vue';
import { storeToRefs } from 'pinia'
import { useBook } from '../store/store.js';
import UploadIcon from '@/icons/UploadIcon.vue';

const image = ref(null);
const imageUrl = ref(null);
const router = useRouter();
let imageContainer = ref(null);
let imageDataURL = ref(null);
const selectedText = ref('title');
const fileInput = ref(null);
const textStyles = reactive({
	title: {
		fontSize: '12px',
		textColor: 'red',
		letterSpacing: '0px',
	},
	author: {
		fontSize: '12px',
		textColor: 'green',
		letterSpacing: '0px',
	},
});
const selectedTextStyle = computed(() => textStyles[selectedText.value]);
const book = useBook();
const { getBookData, getRawImageData, listsNames } = storeToRefs(book);


if (listsNames.value.length <= 0) {
	router.push('/');
}

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

const nextPageToPreviewImage = () => {
	const capture = document.querySelector('.imageWrapper');
	html2canvas(capture, { width: capture.offsetWidth, height: capture.offsetHeight }).then(canvas => {
		canvas.getContext('2d', { willReadFrequently: true })
		imageDataURL.value = canvas.toDataURL('image/jpg');
		book.setFinalImageData(imageDataURL.value);
	})
	router.push('/preview-and-download');
};

const selectText = (text) => {
	selectedText.value = text.type;
	console.log(selectedText.value);
};

const openFileUpload = () => {
	fileInput.value.click();
};
</script>

<template>
	<div class="bookEditContainer">

		<div class="wrapper">
			<div v-if="getRawImageData" class="selectWrapper">
				<a-select style="width: 8rem;" v-model:value="selectedTextStyle.fontSize" placeholder="Select font size">
					<a-select-option value="12px">12</a-select-option>
					<a-select-option value="14px">14</a-select-option>
					<a-select-option value="16px">16</a-select-option>
				</a-select>
				<a-select style="width: 8rem;" v-model:value="selectedTextStyle.textColor" placeholder="Select text color">
					<a-select-option value="red">Red</a-select-option>
					<a-select-option value="blue">Blue</a-select-option>
					<a-select-option value="green">Green</a-select-option>
				</a-select>
				<a-select style="width: 8rem;" v-model:value="selectedTextStyle.letterSpacing"
					placeholder="Select letter spacing">
					<a-select-option value="0px">0</a-select-option>
					<a-select-option value="1px">1</a-select-option>
					<a-select-option value="2px">2</a-select-option>
				</a-select>
			</div>

			<div class="imageContainer" >
				<div class="imageWrapper" v-if="getRawImageData" ref="imageContainer">
					<DraggableTextComponent :text="getBookData.title" :container="imageContainer" @selectText="selectText"
						type="title"
						:style="{ 'color': textStyles.title.textColor, 'letter-spacing': textStyles.title.letterSpacing, 'font-size': textStyles.title.fontSize, 'outline': selectedText === 'title' ? '2px solid blue' : '2px solid gray' }" />
					<DraggableTextComponent :text="getBookData.author" :container="imageContainer" @selectText="selectText"
						type="author"
						:style="{ 'color': textStyles.author.textColor, 'letter-spacing': textStyles.author.letterSpacing, 'font-size': textStyles.author.fontSize, 'outline': selectedText === 'author' ? '2px solid blue' : '2px solid gray' }" />
					<img v-if="getRawImageData" :src="getRawImageData" class="image" alt="Uploaded image" >
				</div>
				<a-button v-if="getRawImageData" type="primary" @click="nextPageToPreviewImage">Save and Preview</a-button>
			</div>
		</div>
	<input type="file" accept="image/*" @change="handleFileAdd" ref="fileInput" style="display: none">
	<a-button v-if="!getRawImageData" type="default" @click="openFileUpload" class="uploadButton">
		<template #icon>
			<UploadIcon />
		</template>
		Add Image</a-button>
		
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

.uploadButton {
	display: flex;
	align-items: center;
}

.imageContainer {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 2rem;
}

.imageWrapper {
	position: relative;
	display: flex;
}

.wrapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 5rem;
}

.selectWrapper {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 1rem;
}

.bookEditContainer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

}

.image {
	max-height: 600px;
}
</style>

		<input type="file" accept="image/*" @change="handleFileAdd">