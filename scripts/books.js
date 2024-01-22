import { openBookForm } from "./bookForm.js";
import { generateRandomId } from "./randomId.js";
import { createErrorMessage } from "./warningMessage.js";
import { findOrCreateShelf, getBookshelfShelfs, bookshelfDiv } from "./shelf.js";

let BOOKS = getBooks();
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
	const width = Math.round(Math.random() * 20) + 80 + "px"; //80px - 100px   const width = Math.round(Math.random() * 60) + 60 + "px";
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

function createBookElement(book, name, mediaType, length, completed) {
	const newBook = document.createElement("div");
	newBook.classList.add("book");
	newBook.tabIndex = 0;
	newBook.draggable = true;

	if (book === null) {
		book = getBookRandomValues();
		book = { name, mediaType, length, completed, ...book };
		saveBook(book);
	}

	applyBookStyles(newBook, book);

	addBookOpenEvent(newBook);
	addBookRemoveEvent(newBook);

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

function addBookOpenEvent(newBook) {
	newBook.addEventListener("dblclick", handleBookEvent);
	newBook.addEventListener("keydown", handleBookEvent);

	function handleBookEvent(e) {
		if (e.type === "keydown" && e.key !== "Enter") return;
		e.preventDefault();

		const id = e.target.id;
		const bookData = BOOKS.find((book) => book.id == id);
		openBookForm(bookData.name, bookData.mediaType, bookData.length, bookData.completed, bookData.name, "Save Changes", "written", "initial", bookData.id);
	}
}

function addBookRemoveEvent(newBook) {
	newBook.addEventListener("contextmenu", (e) => {
		e.preventDefault();

		console.log(removeBookId, removeBookStage);

		if (removeBookStage === 0) {
			createErrorMessage("Warning", "Do you really want to remove the book? Right-click again to remove");
			removeBookStage = 1;
			removeBookId = e.target.id;
			return;
		} else if (removeBookStage === 1 && removeBookId === e.target.id) {
			deleteBook(e.target.id);
		}
		removeBookStage = 0;
		removeBookId = "";
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

	let formatedTitle = title.substring(0, 25);
	if (formatedTitle.length < title.length) formatedTitle += ".";

	if (type == "label") {
		label.classList.add("vertical__text");
		label.innerText = formatedTitle;
	} else {
		label.innerText = formatedTitle;
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
