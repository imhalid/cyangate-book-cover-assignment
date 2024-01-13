import { defineStore } from 'pinia'

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useBook = defineStore('storeId', {
	// arrow function recommended for full type inference
	state: () => ({
		rawImageData: null,
		finalImageData: null,
		bookData: {
			title: '',
			titlePosition: { x: 0, y: 0 },
			author: '',
			authorPosition: { x: 0, y: 0 },
		},
		booksLists: [],
		listsNames: [],
	}),
	getters: {
		getRawImageData() {
			return this.rawImageData
		},
		getFinalImageData() {
			return this.finalImageData
		},
		getBookData() {
			return {
				title: this.bookData.title,
				author: this.bookData.author,
				titlePosition: this.bookData.titlePosition,
				authorPosition: this.bookData.authorPosition,
			}
		},
		getBooksLists() {
			return this.booksLists
		},
		getListsNames() {
			return this.listsNames
		}
	},
	actions: {
		setRawImageData(rawImageData) {
			this.rawImageData = rawImageData
			console.log('image data', this.rawImageData)
		},
		setFinalImageData(finalImageData) {
			this.finalImageData = finalImageData
			console.log('image data', this.finalImageData)
		},
		setBookData(data) {
			this.bookData.title = data.title
			this.bookData.author = data.author
		},
		setTitlePosition(position) {
			this.bookData.titlePosition = position
		},
		setAuthorPosition(position) {
			this.bookData.authorPosition = position
		},
		async fetchBooksLists() {
			try {
				const response = await fetch('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=AydaTuOw7sG8ANNZU7wAAPPKVNINLTsj');
				const json = await response.json();
				this.booksLists = json.results.map(list => ({
					list_name: list.list_name,
					list_name_encoded: list.list_name_encoded
				}));
			} catch (error) {
				console.error('Error:', error);
			}
		},
		async fetchListsNames(list_name_encoded) {
			try {
				const response = await fetch(`https://api.nytimes.com/svc/books/v3/lists.json?list=${list_name_encoded}&api-key=AydaTuOw7sG8ANNZU7wAAPPKVNINLTsj`);
				const json = await response.json();
				this.listsNames = json.results.map(list => ({
					title: list.book_details[0].title,
					author: list.book_details[0].author,
				}))
			} catch (error) {
				console.error('Error:', error);
			}
		}
	}
})