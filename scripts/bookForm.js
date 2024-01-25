import { addBook, deleteBook, updateBook } from "./books.js";
import { applyNameSecrets } from "./secrets.js";

const addBookButton = document.querySelector("[data-button-action]");
const deleteBookButton = document.querySelector("[data-delete-book]");
const closeFormButton = document.querySelector("[data-close-form]");

const bookForm = document.querySelector("[data-form-container]");
const idElement = bookForm.querySelector("#book__id");
const bookFormInputs = bookForm.querySelectorAll(".form__input");
const bookTypeSelect = bookForm.querySelector("#media_type");

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

	const mediaName = document.getElementById("media_name");
	const mediaType = document.getElementById("media_type");
	const mediaLength = document.getElementById("media_length");
	const mediaWatched = document.getElementById("media_watched");
	const mediaCompleted = document.getElementById("media_completed");

	if (e.target.dataset.buttonAction === "create") {
		addBook(null, mediaName.value ?? "", mediaType.value ?? "", mediaLength.value ?? 1, mediaWatched.value ?? "", mediaCompleted.checked ?? false);
	} else {
		updateBook(idElement.innerText, mediaName.value ?? "", mediaType.value ?? "", mediaLength.value ?? 1, mediaWatched.value ?? "", mediaCompleted.checked ?? false);
	}

	closeBookForm();
});

closeFormButton.addEventListener("click", () => {
	closeBookForm();
});

deleteBookButton.addEventListener("click", () => {
	deleteBook(idElement.innerHTML); //e.target.parentElement.querySelector("#book__id")
	closeBookForm();
});

export function setMediaChangeEventListener() {
	bookTypeSelect.addEventListener("change", () => {
		changeMediaLengthLabelType();
	});
}

// Add into index
export function setMediaLengthChangeEvent() {
	const mediaLength = document.getElementById("media_length");
	const mediaWatched = document.getElementById("media_watched");

	mediaLength.addEventListener("change", (e) => {
		updateMaxLengthAndCompleted(mediaLength, mediaWatched);
	});

	mediaWatched.addEventListener("change", (e) => {
		updateMaxLengthAndCompleted(mediaLength, mediaWatched);
	});
}

export function changeMediaLengthLabelType() {
	const bookType = bookTypeSelect.value;
	const lengthLabel = bookForm.querySelector("#media_length_label");
	const readLabel = bookForm.querySelector("#media_watched_label");
	if (bookType === "book") {
		lengthLabel.innerHTML = "Pages";
		readLabel.innerHTML = "Read";
	} else if (bookType === "movie") {
		lengthLabel.innerHTML = "Hours";
		readLabel.innerHTML = "Watched";
	} else if (bookType === "series") {
		lengthLabel.innerHTML = "Episodes/Seasons";
		readLabel.innerHTML = "Watched";
	}
}

function updateMaxLengthAndCompleted(lengthElement, watchedElement) {
	const length = Number(lengthElement.value);
	const watched = Number(watchedElement.value);
	const mediaCompleted = document.getElementById("media_completed");

	if (length > watched) {
		mediaCompleted.checked = false;
		return;
	}

	if (length < watched) watchedElement.value = length;

	mediaCompleted.checked = true;
}

export function openBookForm(
	name = "",
	type = "book",
	length = 1,
	read = 1,
	completed = false,
	title = "Create Book",
	// buttonText = "Create Book", //isUpdate = false
	isUpdate = false,
	formSideImageClass = "",
	// deleteBtnDisplay = "none", // isUpdate = false
	id = ""
) {
	resetBookFormStyles();

	if (completed === "true") completed = true;
	else if (completed === "false") completed = false;

	if (id !== "") applyNameSecrets(name, id);

	const mediaName = document.getElementById("media_name");
	const mediaType = document.getElementById("media_type");
	const mediaLength = document.getElementById("media_length");
	const mediaWatched = document.getElementById("media_watched");
	const mediaCompleted = document.getElementById("media_completed");

	mediaName.value = name;
	mediaType.value = type;
	mediaLength.value = length;
	mediaWatched.value = read;
	mediaCompleted.checked = completed;
	bookForm.querySelector("h3").innerHTML = title;
	if (formSideImageClass !== "") {
		const leftFormPage = document.getElementById("side_image");
		leftFormPage.classList.remove("default");
		leftFormPage.classList.add(formSideImageClass);
	}

	// Change properties based on action
	const formActionButton = bookForm.querySelector("button");
	const bookIdElement = bookForm.querySelector("#book__id");
	if (isUpdate) {
		formActionButton.innerHTML = "Save Changes";
		formActionButton.setAttribute("data-button-action", "update");
		bookForm.querySelector(".btn__delete__item").style.display = "initial";
		mediaWatched.max = Number(mediaLength.value);
		bookIdElement.style.display = "block";
		bookIdElement.innerText = id;
	} else {
		formActionButton.innerHTML = "Create Book";
		formActionButton.setAttribute("data-button-action", "create");
		bookForm.querySelector(".btn__delete__item").style.display = "none";
		bookIdElement.style.display = "none";
	}

	changeMediaLengthLabelType();

	bookForm.classList.remove("hidden");
	mediaName.focus();
}

export function closeBookForm() {
	bookForm.classList.add("hidden");
}

function resetBookFormStyles() {
	const rightFormPage = document.getElementById("create_book");
	const leftFormPage = document.getElementById("side_image");

	leftFormPage.className = "";
	leftFormPage.classList.add("default");
	rightFormPage.style.background = "#ffffff";
}
