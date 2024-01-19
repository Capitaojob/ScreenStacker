import { openBookForm } from "./index.js";
import { generateRandomId } from "./randomId.js";
import { createErrorMessage } from "./warningMessage.js";

let MAX_BOOKS;
let BOOKS = getBooks();
const bookshelfDiv = document.querySelector("#bookshelf");
let removeBookStage = 0;
let removeBookId = "";

export function addBook(book = null, name = null, mediaType = null, length = null, completed = null) {
	const bookshelfShelfs = getBookshelfShelfs();
	const shelf = findOrCreateShelf(bookshelfShelfs);

	const newBook = createBookElement(book, name, mediaType, length, completed);
	shelf.appendChild(newBook);
}

export function updateBook(id, name = null, mediaType = null, length = null, completed = null) {
	if (id === null || id === "") return;

	BOOKS = BOOKS.map((book) => {
		if (book.id !== id) return book;
		else {
			if (completed === "true") completed = true;
			else if (completed === "false") completed = false;

			const updatedBook = {
				id: book.id,
				name,
				mediaType,
				length,
				completed,
				height: book.height,
				width: book.width,
				color: book.color,
				decoration: book.decoration,
				label: book.label,
				fancy: book.fancy,
			};
			return updatedBook;
		}
	});

	saveBooks();
	renderBooks();
}

function getBooks() {
	return JSON.parse(localStorage.getItem("BOOKS")) ?? [];
}

function getBookRandomValues() {
	const height = Math.round(Math.random() * 30) + 70 + "%";
	const width = Math.round(Math.random() * 20) + 80 + "px"; //80px - 100px
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += Math.floor(Math.random() * 16).toString(16);
	}
	const label = Math.round(Math.random()) === 1 ? true : false;

	return {
		id: generateRandomId(),
		height,
		width,
		color,
		decoration: Math.round(Math.random()) === 1 ? true : false,
		label,
		fancy: label ? (Math.round(Math.random()) === 1 ? true : false) : false,
	};
}

function getBookshelfShelfs() {
	return bookshelfDiv.querySelectorAll(".shelf");
}

function findOrCreateShelf(bookshelfShelfs) {
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

function createBookElement(book, name, mediaType, length, completed) {
	const newBook = document.createElement("div");
	newBook.classList.add("book");
	newBook.tabIndex = 0;

	if (book === null) {
		book = getBookRandomValues();
		book = { name, mediaType, length, completed, ...book };
		saveBook(book);
	}

	applyBookStyles(newBook, book);

	addBookClickEvent(newBook);
	addBookMiddleClickEvent(newBook);

	return newBook;
}

function applyBookStyles(newBook, book) {
	newBook.style.height = book.height;
	newBook.style.width = book.width;
	newBook.style.backgroundColor = book.color;
	if (book.decoration) newBook.classList.add("decorated");
	if (book.label) {
		newBook.classList.add("labeled");
		createAndAppendLabel(newBook, book.name, book.fancy);
	} else {
		createAndAppendTitle(book.name, newBook, "cover");
	}
	newBook.setAttribute("id", book.id);
}

function addBookClickEvent(newBook) {
	newBook.addEventListener("dblclick", (e) => {
		const id = e.target.id;
		const bookData = BOOKS.find((book) => book.id == id);
		openBookForm(bookData.name, bookData.mediaType, bookData.length, bookData.completed, bookData.name, "Save Changes", "./images/pagebackground.jpg", "initial", bookData.id);
	});
}

function addBookMiddleClickEvent(newBook) {
	newBook.addEventListener("contextmenu", (e) => {
		e.preventDefault();
		if (removeBookStage === 0) {
			createErrorMessage("Warning", "Do you really want to remove the book? Right-click again to remove");
			removeBookStage = 1;
			removeBookId = e.target.id;

			setTimeout(() => {
				removeBookStage = 0;
				removeBookId = 0;
			}, 10000);
		} else if (removeBookStage === 1 && removeBookId === e.target.id) {
			deleteBook(e.target.id);
		} else {
			removeBookStage = 0;
			removeBookId = "";
		}
	});
}

function createAndAppendLabel(newBook, bookName, isFancy) {
	const label = document.createElement("div");
	label.classList.add("label");
	if (isFancy) label.classList.add("fancy");
	createAndAppendTitle(bookName, label, "label");
	newBook.appendChild(label);
}

function createAndAppendTitle(title, parent, type) {
	const label = document.createElement("p");

	title = title.substring(0, 20);

	if (type == "label") {
		label.classList.add("vertical__text");
		label.innerText = title;
	} else {
		label.innerText = title;
		// .split(" ")
		// .map((word) => word.charAt(0))
		// .join("");
	}

	parent.appendChild(label);
}

function saveBook(book) {
	BOOKS.push(book);
	saveBooks();
}

function saveBooks() {
	localStorage.setItem("BOOKS", JSON.stringify(BOOKS));
}

export function deleteBook(id) {
	BOOKS = BOOKS.filter((book) => book.id !== id);
	saveBooks();
	renderBooks();
}

export function renderBooks() {
	bookshelfDiv.innerHTML = "";

	if (BOOKS.length === 0) {
		const shelfElement = document.createElement("div");
		shelfElement.classList.add("shelf");

		bookshelfDiv.appendChild(shelfElement);
	} else {
		BOOKS.forEach((book) => {
			addBook(book);
		});
	}
}

export function clearBooks() {
	BOOKS = [];
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

setMaxBooks();
