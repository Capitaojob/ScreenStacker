import { addBook, deleteBook, updateBook } from "./books.js";
import { applyNameSecrets } from "./secrets.js";

const addBookButton = document.querySelector("[data-button-action]");
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

    if (e.target.dataset.buttonAction === "create") {
        addBook(null, bookFormInputs[0].value ?? "", bookFormInputs[1].value ?? "", bookFormInputs[2].value ?? 1, bookFormInputs[3].checked ?? false);
    } else {
        updateBook(
            idElement.innerText,
            bookFormInputs[0].value ?? "",
            bookFormInputs[1].value ?? "",
            bookFormInputs[2].value ?? 1,
            bookFormInputs[3].checked ?? false
        );
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

    bookFormInputs[0].value = name;
    bookFormInputs[1].value = mediaType;
    bookFormInputs[2].value = length;
    bookFormInputs[3].checked = completed;
    bookForm.querySelector("h3").innerHTML = title;
    if (formSideImageClass !== "") {
        const leftFormPage = document.getElementById("side_image");
        leftFormPage.classList.remove("default");
        leftFormPage.classList.add(formSideImageClass);
    }

    bookForm.querySelector(".btn__delete__item").style.display = isUpdate ? "initial" : "none";

    // Change button properties
    const formActionButton = bookForm.querySelector("button");
    if (isUpdate) {
        formActionButton.innerHTML = "Save Changes";
        formActionButton.setAttribute("data-button-action", "update");
    } else {
        formActionButton.innerHTML = "Create Book";
        formActionButton.setAttribute("data-button-action", "create");
    }

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
