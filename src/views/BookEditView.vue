<template>
	<div class="bookEditContainer">

		<div class="wrapper">
			<div v-if="getRawImageData" class="selectWrapper">
				<a-select style="width: 8rem;" v-model:value="selectedTextStyle.fontSize" placeholder="Select font size">
					<a-select-option v-for="size in FONT_SIZES" :value="size" :key="size">{{ size }}</a-select-option>
				</a-select>
				<a-select style="width: 8rem;" v-model:value="selectedTextStyle.textColor" placeholder="Select text color">
					<a-select-option v-for="color in COLORS" :value="color" :key="color">{{ color }}</a-select-option>
				</a-select>
				<a-select style="width: 8rem;" v-model:value="selectedTextStyle.letterSpacing" placeholder="Select letter spacing">
					<a-select-option v-for="spacing in LETTER_SPACINGS" :value="spacing" :key="spacing">{{ spacing }}</a-select-option>
				</a-select>
			</div>

			<div class="imageContainer">
				<div class="imageWrapper" v-if="getRawImageData" ref="imageContainer">
					<DraggableTextComponent :text="getBookData.title" :container="imageContainer" @selectText="selectText"
						type="title"
						:style="{ 'color': textStyles.title.textColor, 'letter-spacing': textStyles.title.letterSpacing, 'font-size': textStyles.title.fontSize, 'outline': selectedText === 'title' ? '2px dashed blue' : '2px dashed gray' }" />
					<DraggableTextComponent :text="getBookData.author" :container="imageContainer" @selectText="selectText"
						type="author"
						:style="{ 'color': textStyles.author.textColor, 'letter-spacing': textStyles.author.letterSpacing, 'font-size': textStyles.author.fontSize, 'outline': selectedText === 'author' ? '2px dashed blue' : '2px dashed gray' }" />
					<img v-if="getRawImageData" :src="getRawImageData" class="image" alt="Uploaded image">
				</div>
				<a-button v-if="getRawImageData" type="primary" @click="nextPageToPreviewImage">Save and Preview</a-button>
			</div>
		</div>
		<input type="file" accept="image/*" @change="handleFileAdd" ref="fileInput" style="display: none">
		<a-button v-if="!getRawImageData" type="default" @click="openFileUpload" class="uploadButton">
			<template #icon><UploadIcon /></template>
			Add Image
		</a-button>
	</div>
</template>

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
const book = useBook();
const { getBookData, getRawImageData, listsNames } = storeToRefs(book);
const textStyles = reactive({
	title: {
		fontSize: '26px',
		textColor: 'red',
		letterSpacing: '0px',
	},
	author: {
		fontSize: '26px',
		textColor: 'green',
		letterSpacing: '0px',
	},
});
const imageSizes = ref({
	width: 0,
	height: 0,
});

const FONT_SIZES = ['20px', '24px', '26px', '28px'];
const COLORS = ['red', 'blue', 'green', 'white', 'black'];
const LETTER_SPACINGS = ['-1px','0px', '2px', '3px'];

const selectedTextStyle = computed(() => textStyles[selectedText.value]);

if (listsNames.value.length <= 0) {
	router.push('/');
}

watchEffect(() => {
	if (!image.value) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		imageUrl.value = e.target.result;
		imageSizes.value.width = image.value.width;
		imageSizes.value.height = image.value.height;
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
};

const openFileUpload = () => {
	fileInput.value.click();
};
</script>

<style scoped>
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