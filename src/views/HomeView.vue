<template>
	<div class="container">
		<div class="list-name">
			<label for="listName">List Name</label>
			<a-select style="width: 15rem;" id="listName" v-model:value="selectedBookList" @change="fetchListData" placeholder="Select your option">
				<a-select-option v-for="(item, index) in getBooksLists" :key="index" :value="item.list_name_encoded">
					{{ item.list_name }}
				</a-select-option>
			</a-select>
		</div>
		<div v-if="selectedBookList" class="book-list">
			<label for="bookList">Book List</label>
			<a-select style="width: 15rem;" id="bookList" v-model:value="selectedBook" @change="addBook" placeholder="Select your option">
				<a-select-option v-for="(item, index) in getListsNames" :key="index" :value="index">
					{{ item.title }}
				</a-select-option>
			</a-select>
		</div>
		<div class="buttonContainer" v-if="selectedBook">
	        <router-link v-if="getBooksLists" to="/cover-edit">
	            <a-button type="primary" :disabled="!selectedBook">Next</a-button>
	        </router-link>
	    </div>
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue';
import { useBook } from '../store/store.js';

const book = useBook();
const { getBooksLists, getListsNames } = storeToRefs(book);

const selectedBookList = ref(null);
const selectedBook = ref(null);

const addBook = () => {
	book.setBookData(getListsNames.value[selectedBook.value]);
};

onMounted(() => {
	getBooksLists.value.length <= 0 && book.fetchBooksLists()
});

const fetchListData = async () => {
	if (!getBooksLists.value) return;
	await book.fetchListsNames(selectedBookList.value)
};
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 16px;
}

.buttonContainer {
	margin-top: 2rem;
}

.list-name {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 1rem;
}

.book-list {
	display: flex;
	align-items: center;
	flex-direction: row;
	justify-content: space-between;
	gap: 1rem;
	margin-top: 1rem;
	width: 100%;
}

#bookList,
#listName {
	width: 15rem;
}

.defaultClass {
	background-color: #ccc;
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	text-decoration: none;
	;
}

.disableButton {
	pointer-events: none;
	opacity: 0.5;
}

.activeButton {
	pointer-events: auto;
	opacity: 1;
}
</style>