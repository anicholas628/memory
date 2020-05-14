document.addEventListener("DOMContentLoaded", () =>{

var cardToFlip = document.querySelectorAll(".card");

//give cards ability to flip when clicked
function cardsClickable(){
for (var card of cardToFlip){
    card.addEventListener("click", toggleToFlip);
    }
}

cardsClickable();

//makes them flip on click:
function toggleToFlip() {
    this.classList.toggle("flipped");
}
//same idea as above
//document.querySelectorAll(".card").forEach( card => card.addEventListener('click', toggleToFlip) );

//reset button to reset the game
var reset = document.getElementById("reset");
reset.addEventListener("click", resetGame);
function resetGame(){
    location.reload();
}

//image on all cards before flipped
var cardFronts = document.querySelectorAll(".cardFronts");

//image after flipped on cards in our stack
var cardBacksNodeList = document.getElementsByClassName("cardBacks");
var cardBacks = Array.from(cardBacksNodeList);

console.log(cardBacks[1]);

//mix up our deck
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

shuffle(cardBacks);

//create the deck
var cards =[];

function collectCards(){
for (i=0; i<cardBacks.length; i++){
    var newElement = {};
    newElement["img"] = cardBacks[i].src;
    newElement["name"] = cardBacks[i].alt;
    cards.push(newElement);
    };
}

collectCards();

//distribute the shuffled src's to the deck, give data id, set card name
function setUpDeck(){
    for (i=0; i<cardBacks.length; i++){
        cardBacksNodeList[i].setAttribute("src", cards[i].img);
        cardBacksNodeList[i].setAttribute("alt", cards[i].name)
        cardFronts[i].setAttribute("data-id", i);
        cardFronts[i].addEventListener("click", flipCard);
    }   
}

setUpDeck();

//let's play!

const grid = document.querySelector(".grid");
const displayResult = document.querySelector("#result");
const scoreWord = document.getElementById("score");
var cardsChosen = [];
var cardsChosenId = [];
var cardsWon = [];

displayResult.textContent = cardsWon.length;


function flipCard(){
    var cardId = this.getAttribute("data-id");

    //prevent them from clicking the same card twice to get match
    if (cardId == cardsChosenId[0]){
        alert("Please try again. You cannot choose the same card twice in a row.");
        cardBacksNodeList[cardId].click();
        cardsChosenId=[];
        cardsChosen=[];
    }
    else{
        cardsChosen.push(cardBacksNodeList[cardId].alt);
        console.log("cardsChosen: " + cardsChosen);
        cardsChosenId.push(cardId);
        if (cardsChosen.length === 2){
            setTimeout(checkForMatch, 500);
        }
    }
}


function checkForMatch(){
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if(cardsChosen[0] === cardsChosen[1]){
        alert("You found a match!");
        cardBacksNodeList[optionOneId].setAttribute("src", "img/white.png");
        cardBacksNodeList[optionTwoId].setAttribute("src", "img/white.png");
        //turn off click function after I "pick up" my match
        cardToFlip[optionOneId].removeEventListener("click", toggleToFlip);
        cardToFlip[optionTwoId].removeEventListener("click", toggleToFlip);
        cardsWon.push(cardsChosen);
    }
    else{
         alert("Sorry, try again.");
         //turn the cards back over automatically
         cardBacksNodeList[optionTwoId].click();
         cardBacksNodeList[optionOneId].click();
    }

    //reset my arrays, so I can choose two new cards
    cardsChosen = [];
    cardsChosenId = [];
    displayResult.textContent = cardsWon.length;

    if (cardsWon.length === cards.length/2){
        scoreWord.innerHTML="";
        displayResult.textContent = "Congrats! You found them all!";
        //change the reset button to a "Play again" button
        reset.innerHTML = "Play again?";
        reset.removeEventListener("click", resetGame);
        reset.addEventListener("click", playAgain);
    } 

}

function playAgain(){
        //put back the cards I won and reset the score
        cardsWon = [];
        displayResult.textContent = cardsWon.length;
        scoreWord.innerHTML="Score: ";
        shuffle(cards); 
        //turn on ability to click again
        cardsClickable();       
        //turn the cards back over
        for(i=0; i<cardBacksNodeList.length; i++){
        cardBacksNodeList[i].click();
        }
        //deal the cards
        setUpDeck();
        //Change the reset button back to reset
        reset.innerHTML = "Reset Game";
        reset.addEventListener("click", resetGame);
        reset.removeEventListener("click", playAgain);

}


})