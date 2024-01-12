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
                titlePosition: {x: 0, y: 0},
                author: '',
                authorPosition: {x:0, y:0},
            },

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
    },
    actions: {
        setRawImageData(rawImageData) {
            this.rawImageData = rawImageData
            console.log('image data',this.rawImageData)
        },
        setFinalImageData(finalImageData) {
            this.finalImageData = finalImageData
            console.log('image data',this.finalImageData)
        },
        setBookData(data) {
            // only title and author are allowed
            this.bookData.title = data.title
            this.bookData.author = data.author

            console.log(data)
        },
        setTitlePosition(position) {
            this.bookData.titlePosition = position
            console.log('title position', this.bookData.titlePosition)
        },
        setAuthorPosition(position) {
            this.bookData.authorPosition = position
        },
    }
})
