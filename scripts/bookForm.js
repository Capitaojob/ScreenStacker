import { addBook, deleteBook, updateBook } from "./books.js";
import { applyNameSecrets } from "./secrets.js";

const addBookButton = document.querySelector("[data-add-book]");
const deleteBookButton = document.querySelector("[data-delete-book]");
const closeFormButton = document.querySelector("[data-close-form]");

const bookForm = document.querySelector("[data-form-container]");
const idElement = bookForm.querySelector("#book__id");
const bookFormInputs = bookForm.querySelectorAll(".form__input");
const bookTypeSelect = bookForm.querySelector("#mediatype");

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

closeFormButton.addEventListener("click", () => {
	closeBookForm();
});

deleteBookButton.addEventListener("click", (e) => {
	deleteBook(idElement.innerHTML); //e.target.parentElement.querySelector("#book__id")
	closeBookForm();
});

export function setMediaChangeEventListener() {
	bookTypeSelect.addEventListener("change", () => {
		changeMediaLengthLabelType();
	});
}

export function changeMediaLengthLabelType() {
	const bookType = bookTypeSelect.value;
	const lengthLabel = bookForm.querySelector("#media_length_label");
	if (bookType === "book") {
		lengthLabel.innerHTML = "Pages";
	} else if (bookType === "movie") {
		lengthLabel.innerHTML = "Hours";
	} else if (bookType === "series") {
		lengthLabel.innerHTML = "Episodes/Seasons";
	}
}

export function openBookForm(
	name = "",
	mediaType = "book",
	length = 1,
	completed = false,
	title = "Create Book",
	buttonText = "Create Book",
	// imgSrc = "./images/formside.png",
	formSideImageClass = "",
	deleteBtnDisplay = "none",
	id = ""
) {
	resetBookFormStyles();

	if (completed === "true") completed = true;
	else if (completed === "false") completed = false;

	if (id !== "") applyNameSecrets(name, id);

	bookFormInputs[0].value = name;
	bookFormInputs[1].value = mediaType;
	bookFormInputs[2].value = length;
	bookFormInputs[3].checked = completed;
	bookForm.querySelector("h3").innerHTML = title;
	bookForm.querySelector("button").innerHTML = buttonText;
	// bookForm.querySelector("img").src = imgSrc;
	if (formSideImageClass !== "") {
		const leftFormPage = document.getElementById("side_image");
		leftFormPage.classList.remove("default");
		leftFormPage.classList.add(formSideImageClass);
	}
	bookForm.querySelector(".btn__delete__item").style.display = deleteBtnDisplay;

	const bookIdElement = bookForm.querySelector("#book__id");
	if (id === "") {
		bookIdElement.style.display = "none";
	} else {
		bookIdElement.style.display = "block";
		bookIdElement.innerText = id;
	}

	changeMediaLengthLabelType();

	bookForm.classList.remove("hidden");
	bookFormInputs[0].focus();
}

function closeBookForm() {
	bookForm.classList.add("hidden");
}

function resetBookFormStyles() {
	const rightFormPage = document.getElementById("create_book");
	const leftFormPage = document.getElementById("side_image");

	leftFormPage.classList.forEach((c) => {
		leftFormPage.classList.remove(c);
	});
	leftFormPage.classList.add("default");
	rightFormPage.style.background = "#ffffff";
}
