
const cards = ["a", "b", "c", "d", "e", "f", "g", "h"];

// doubling the cards for the memory
cards.forEach(function(card) {
   cards.push(card);
});

//shuffles the array -> modern version of the Fisher–Yates shuffle algorithm
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

shuffle(el);
