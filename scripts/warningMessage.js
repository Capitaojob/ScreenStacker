let timeoutId = 0;

export function createErrorMessage(warn, message) {
	if (document.getElementById("warn-message") === null) {
		const errorMessageElement = document.createElement("div");
		errorMessageElement.classList.add("error__message");
		errorMessageElement.setAttribute("id", "warn-message");

		const errorWarning = document.createElement("h6");
		errorWarning.innerText = warn;
		errorMessageElement.appendChild(errorWarning);

		const errorMessage = document.createElement("p");
		errorMessage.innerText = message;
		errorMessageElement.appendChild(errorMessage);

		document.querySelector("body").appendChild(errorMessageElement);
	}

	if (timeoutId !== 0) {
		clearTimeout(timeoutId);
	}

	timeoutId = setTimeout(() => {
		console.log("Now");
		const elementToRemove = document.getElementById("warn-message");

		if (elementToRemove === null || elementToRemove === undefined) return;

		console.log(elementToRemove, elementToRemove.parentElement);
		elementToRemove.parentElement.removeChild(elementToRemove);
		timeoutId = 0;
	}, 10000);
}
