import { addBook, clearBooks, renderBooks } from "./books.js";
import { setMaxBooks } from "./shelf.js";
import { setMediaChangeEventListener, closeBookForm, setMediaLengthChangeEvent } from "./bookForm.js";
import { openBookForm } from "./bookForm.js";

const createBookButton = document.querySelector("[data-create-book]");
const createBlankButton = document.querySelector("[data-create-blank]");
const dataGoToEndButton = document.querySelector("[data-goto-end]");

const clearBookButton = document.querySelector("[data-clear-book]");

window.addEventListener("resize", () => {
	setMaxBooks();
});

window.addEventListener("keydown", (e) => {
	if (e.key !== "Escape") return;

	if (document.querySelector(".form__container:not(.hidden)") !== null) closeBookForm();
});

createBookButton.addEventListener("click", (e) => {
	openBookForm();
});

createBlankButton.addEventListener("click", (e) => {
	addBook(null, "", "book", 1, false);
});

dataGoToEndButton.addEventListener("click", () => {
	location.href = "#";
	location.href = "#end";

	setTimeout(() => {
		history.replaceState(null, null, window.location.pathname + window.location.search);
	}, 1000);
});

clearBookButton.addEventListener("click", (e) => {
	localStorage.removeItem("BOOKS");
	clearBooks();
	renderBooks();
});

setMediaChangeEventListener();
setMediaLengthChangeEvent();
setMaxBooks();
