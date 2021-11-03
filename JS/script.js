/* 
1. Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
2. I numeri nella lista delle bombe non possono essere duplicati.
3. In seguito l’utente clicca su ogni cella: se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina, altrimenti la cella cliccata si colora di azzurro e l’utente può continuare a cliccare sulle altre celle.
4. La partita termina quando il giocatore clicca su una bomba o raggiunge il numero massimo possibile di numeri consentiti.
5. Al termine della partita il software deve scoprire tutte le bombe e comunicare il punteggio, cioè il numero di volte che l’utente ha inserito un numero consentito.
*/

//Ref

const setBtn = document.querySelector('.set-difficulty');
const wrapGrid = document.querySelector('.wrap-grid');
const levelDifficulty = document.getElementById('difficulty');

setBtn.addEventListener('click',() => {
    //Reset content
    wrapGrid.innerHTML = '';

    //Set grid dimension
    let cellsNumber;
    let cellsPerSide;

    switch (levelDifficulty.value) {
        case '1' :
            cellsNumber = 100;
            cellsPerSide = 10;
            break;
        case '2' :
            cellsNumber = 81;
            cellsPerSide = 9;
            break;
        case '3' :
            cellsNumber = 49;
            cellsPerSide = 7;
    }

    //Gen bombs list
    const bombList = genBombs( cellsNumber, 1 );
    console.log('Bombe scelte', bombList);

    //Attempts list
    const attempts = [];
    const maxAttempts = cellsNumber - bombList.length;
    console.log('Tentativi possibili', maxAttempts);

    //Gen grid parent
    const grid = document.createElement('div');
    grid.classList.add('grid');

    //Gen square
    for (let i = 1; i <= cellsNumber; i++) {
        //Gen single square
        const square = createGridSquare(i, cellsPerSide);
        
        //Add click event
        square.addEventListener('click', () => {
            handleSquareClick(square, bombList, attempts, maxAttempts)
        });
        
        grid.append(square);
    }

    //Add grid
    wrapGrid.append(grid);
});

/* 
* Functions
*/
// Create square
function createGridSquare(num, cells) {
        const node = document.createElement('div');
        node.classList.add('square');
        node.style.width = `calc( 100% / ${cells} )`;
        node.style.height = `calc( 100% / ${cells} )`;

        node.append(num);

        return node;
}

// Gen bomb list
function genBombs(totCells, totBombs) {
    // 16 random unique numbers

    const bombs = [];

    while (bombs.length < totBombs) {
        //Random numbers
        const bombNum = getRandomNum(1, totCells);
        //Check it's not in the bomb array
        if ( !bombs.includes(bombNum) ) {
            bombs.push(bombNum);
        }
    }

    return bombs;
}

// Gen random number
function getRandomNum(min, max) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
}

// Gestion click squer events
function handleSquareClick(square, bombList, attempts, maxAttempts) {
    //Get square number
    const number = parseInt(square.innerHTML);
    console.log(number);
    //Find a bomb?
    if ( bombList.includes(number) ) {
        console.log('End game');
        endGame(bombList, attempts, maxAttempts);
    }
    //Not a bomb and is a new number
    else if ( !attempts.includes(number) ) {
        //Add background colora
        square.classList.add('safe');
        //Add number to attempts lista
        attempts.push(number);
        console.log('Tentativi riusciti', attempts);
        //Chech if attempts list length is equal to max attempts
        if (attempts.length === maxAttempts) {
            console.log('U win!');
            endGame(bombList, attempts, maxAttempts);
        }
    }
}

//End game funbction
function endGame(bombList, attempts, maxAttempts) {
    //Get all square
    const squares = document.querySelectorAll('.square');
    //Show all bombs
    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        const squareValue = parseInt( square.innerHTML );

        if ( bombList.includes(squareValue) ) {
            square.classList.add('bomb');
        }
    }

    //GOOD end game
    let message = `Complimenti hai vinto! Hai indovinato i ${maxAttempts} tentativi validi.`
    //BAD end game
    if ( attempts.length < maxAttempts ) {
        message = `Purtroppo hai perso XD Hai indovinato solamente ${attempts.length} volte. Ritenta pivello...`
    }

    //Output endgame message
    const messageOutput = document.createElement('div');
    messageOutput.append(message);

    document.querySelector('.wrap-grid').append(messageOutput);

    //Disable the pointer
    document.querySelector('.grid').classList.add('end-game');
}