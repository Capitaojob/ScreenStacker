import { addBook, clearBooks, deleteBook, renderBooks, updateBook } from "./books.js";

const createBookButton = document.querySelector("[data-create-book]");
const clearBookButton = document.querySelector("[data-clear-book]");
const addBookButton = document.querySelector("[data-add-book]");
const closeFormButton = document.querySelector("[data-close-form]");
const deleteBookButton = document.querySelector("[data-delete-book]");

const bookForm = document.querySelector("[data-form-container]");
const idElement = bookForm.querySelector("#book__id");
const bookFormInputs = bookForm.querySelectorAll(".form__input");

createBookButton.addEventListener("click", (e) => {
	openBookForm();
});

addBookButton.addEventListener("click", (e) => {
	let valid = true;

	bookFormInputs.forEach((input) => {
		if (!input.checkValidity()) {
			valid = false;
			return;
		}
	});

	if (valid === false) return;

	e.preventDefault();

	if (e.target.innerText === "Create Book") {
		addBook(null, bookFormInputs[0].value ?? "", bookFormInputs[1].value ?? "", bookFormInputs[2].value ?? 1, bookFormInputs[3].checked ?? false);
	} else {
		updateBook(idElement.innerHTML, bookFormInputs[0].value ?? "", bookFormInputs[1].value ?? "", bookFormInputs[2].value ?? 1, bookFormInputs[3].checked ?? false);
	}

	closeBookForm();
});

clearBookButton.addEventListener("click", (e) => {
	localStorage.removeItem("BOOKS");
	clearBooks();
	renderBooks();
});

closeFormButton.addEventListener("click", () => {
	closeBookForm();
});

deleteBookButton.addEventListener("click", (e) => {
	deleteBook(idElement.innerHTML); //e.target.parentElement.querySelector("#book__id")
	closeBookForm();
});

bookForm.querySelector("select").addEventListener("change", (e) => {
	const type = e.target.value;
	if (type === "book") {
	} else if (type === "movie") {
	} else if (type === "series") {
	}
});

export function openBookForm(
	name = "",
	mediaType = "book",
	length = 1,
	completed = false,
	title = "Create Book",
	buttonText = "Create Book",
	imgSrc = "./images/formside.png",
	deleteBtnDisplay = "none",
	id = ""
) {
	if (completed === "true") completed = true;
	else if (completed === "false") completed = false;

	bookFormInputs[0].value = name;
	bookFormInputs[1].value = mediaType;
	bookFormInputs[2].value = length;
	bookFormInputs[3].checked = completed;
	bookForm.querySelector("h3").innerHTML = title;
	bookForm.querySelector("button").innerHTML = buttonText;
	bookForm.querySelector("img").src = imgSrc;
	bookForm.querySelector(".btn__delete__item").style.display = deleteBtnDisplay;

	const bookIdElement = bookForm.querySelector("#book__id");
	if (id === "") {
		bookIdElement.style.display = "none";
	} else {
		bookIdElement.style.display = "block";
		bookIdElement.innerText = id;
	}

	bookForm.classList.remove("hidden");
}

function closeBookForm() {
	bookForm.classList.add("hidden");
}
