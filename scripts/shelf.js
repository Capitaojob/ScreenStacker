import { renderBooks } from "./books.js";

let MAX_BOOKS;

export const bookshelfDiv = document.querySelector("#bookshelf");

export function getBookshelfShelfs() {
	return bookshelfDiv.querySelectorAll(".shelf");
}

export function findOrCreateShelf(bookshelfShelfs) {
	const lastShelf = bookshelfShelfs[bookshelfShelfs.length - 1];
	const lastShelfChilds = lastShelf?.childNodes.length || 0;

	if (bookshelfShelfs.length === 0 || lastShelf === null || lastShelfChilds >= MAX_BOOKS) {
		const newShelf = createShelfElement();
		bookshelfDiv.appendChild(newShelf);
		return newShelf;
	}

	return lastShelf;
}

function createShelfElement() {
	const shelf = document.createElement("div");
	shelf.classList.add("shelf");
	return shelf;
}

export function setMaxBooks() {
	const windowWidth = window.innerWidth;
	if (windowWidth > 800) {
		MAX_BOOKS = Math.floor((Math.min(windowWidth, 1700) - 0.3 * windowWidth) / 93);
	} else {
		MAX_BOOKS = Math.floor((windowWidth - 0.2 * windowWidth) / 92);
	}

	renderBooks();
}
