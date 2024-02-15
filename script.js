console.log('Hello, World!');

// Array to store the card images
const cards = ['card1.jpeg', 'card2.jpeg', 'card3.jpeg', 'card4.jpeg', 'card5.jpeg', 'card6.jpeg', 'card7.jpeg', 'card8.jpeg'];

// Duplicate the cards array
const combinedCards = [...cards, ...cards];

// Shuffle the combinedCards array
combinedCards.sort(() => Math.random() - 0.5);

// Get the container element
const container = document.createElement('div');
container.classList.add('container');

// Loop through the combinedCards array and create card elements
combinedCards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    
    const image = document.createElement('img');
    image.src = `cards/${card}`;
    
    cardElement.appendChild(image);
    container.appendChild(cardElement);
});

// Append the container to the body
document.body.appendChild(container);


// Function to flip all the cards after 3 seconds
function flipAllCards() {
    const cards = document.querySelectorAll('.card');
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.toggle('flipped');
        });
    }, 3000); // 2000ms = 2 seconds
}

// Call the flipAllCards function after the DOM content has loaded
document.addEventListener('DOMContentLoaded', function() {
    flipAllCards();
    
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            card.classList.toggle('flipped');
        });
    });
});

console.log(cards);