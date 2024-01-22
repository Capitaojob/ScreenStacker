export function applyNameSecrets(name, id) {
	name = name.toLowerCase();
	const book = document.getElementById(id);

	if (!book) return;

	if (name.includes("mystery")) {
		console.log("Play mysterious music");
	} else if (name.includes("food") || name.includes("comida")) {
		console.log("food link");
	} else if (name.includes("antique") || name.includes("old") || name.includes("velho") || name.includes("antigo")) {
		document.getElementById("create_book").style.background = "#ebe2d7";
		document.getElementById("side_image").classList.add("antique");
	} else if (name.includes("dragon")) {
		document.getElementById("side_image").classList.add("dragon");
	}
}
