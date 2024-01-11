<template>
	<select v-model="state.selected" @change="fetchListData">
		<option v-for="(item, index) in state.data" :key="index" :value="item">
			{{ item.list_name }}
		</option>
	</select>
	<select v-if="state.listData">
		<option v-for="(item, index) in state.listData" :key="index" :value="item">
			{{ item.book_details[0].title }}
		</option>
	</select>
	<router-link :to="!state.listData ? '':'/book-edit'"
	:class="['defaultClass', !state.listData ? 'disableButton':'activeButton']">Next</router-link>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

const state = reactive({
	data: [],
	selected: null,
	listData: null
});

onMounted(async () => {
	try {
		const response = await fetch('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=AydaTuOw7sG8ANNZU7wAAPPKVNINLTsj');
		const json = await response.json();
		state.data = json.results;
	} catch (error) {
		console.error('Error:', error);
	}
});

const fetchListData = async () => {
	if (!state.selected) return;
	try {
		const response = await fetch(`https://api.nytimes.com/svc/books/v3/lists.json?list=${state.selected.list_name_encoded}&api-key=AydaTuOw7sG8ANNZU7wAAPPKVNINLTsj`);
		const json = await response.json();
		state.listData = json.results;
	} catch (error) {
		console.error('Error:', error);
	}
};
</script>

<style scoped>

.defaultClass {
	background-color: #ccc;
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	text-decoration: none;;
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