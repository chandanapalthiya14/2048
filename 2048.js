// Initialize variables for the game board and score
var board;
var score = 0;
var rows = 4;
var columns = 4;

// When the window loads, the game is set up
window.onload = function() {
    setGame();
}

// Function to set up the game board initially
function setGame() {
    // Example board setup (commented out) to manually set values for testing
    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ];

    // Initialize the board with zeros (empty tiles)
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    // Create the HTML elements for each tile on the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");  // Create a new div element for each tile
            tile.id = r.toString() + "-" + c.toString();  // Set a unique ID based on row and column
            let num = board[r][c];  // Get the number from the board (initially 0)
            updateTile(tile, num);  // Update the tile's appearance based on its value
            document.getElementById("board").append(tile);  // Add the tile to the game board in the HTML
        }
    }
    // Create two initial "2" tiles to start the game
    setTwo();
    setTwo();
}

// Function to update a tile's appearance based on its value
function updateTile(tile, num) {
    tile.innerText = "";  // Clear the text content of the tile
    tile.classList.value = "";  // Clear all classes from the tile
    tile.classList.add("tile");  // Add the base tile class
    if (num > 0) {
        tile.innerText = num.toString();  // Set the text of the tile to its value
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());  // Add a class for styling based on the value
        } else {
            tile.classList.add("x8192");  // Handle cases where the value exceeds 4096
        }                
    }
}

// Event listener for key presses to move tiles
document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();  // Move tiles left
        setTwo();     // Add a new "2" tile after the move
    }
    else if (e.code == "ArrowRight") {
        slideRight(); // Move tiles right
        setTwo();     // Add a new "2" tile after the move
    }
    else if (e.code == "ArrowUp") {
        slideUp();    // Move tiles up
        setTwo();     // Add a new "2" tile after the move
    }
    else if (e.code == "ArrowDown") {
        slideDown();  // Move tiles down
        setTwo();     // Add a new "2" tile after the move
    }
    document.getElementById("score").innerText = score;  // Update the score display
})

// Function to filter out zeros from a row (return only non-zero values)
function filterZero(row){
    return row.filter(num => num != 0); // Create a new array of all non-zero numbers
}

// Function to slide and merge tiles in a row
function slide(row) {
    row = filterZero(row);  // Remove zeros from the row
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {  // If two adjacent numbers are the same
            row[i] *= 2;  // Double the value of the first tile
            row[i + 1] = 0;  // Set the second tile to zero
            score += row[i];  // Add the merged value to the score
        }
    }
    row = filterZero(row);  // Remove zeros again after merging
    while (row.length < columns) {  // Add zeros back to the end of the row until it is full
        row.push(0);
    }
    return row;
}

// Function to slide all rows to the left
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];  // Get the current row
        row = slide(row);  // Slide and merge the row
        board[r] = row;  // Update the board with the new row values
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);  // Update the appearance of each tile in the row
        }
    }
}

// Function to slide all rows to the right
function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         // Get the current row
        row.reverse();              // Reverse the row to slide it to the right
        row = slide(row);           // Slide and merge the row
        board[r] = row.reverse();   // Reverse the row back and update the board
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);  // Update the appearance of each tile in the row
        }
    }
}

// Function to slide all columns up
function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];  // Get the current column as a row
        row = slide(row);  // Slide and merge the row (which represents the column)
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];  // Update the board with the new column values
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);  // Update the appearance of each tile in the column
        }
    }
}

// Function to slide all columns down
function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];  // Get the current column as a row
        row.reverse();  // Reverse the row to slide it down
        row = slide(row);  // Slide and merge the row (which represents the column)
        row.reverse();  // Reverse the row back
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];  // Update the board with the new column values
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);  // Update the appearance of each tile in the column
        }
    }
}

// Function to randomly place a "2" tile on an empty spot on the board
function setTwo() {
    if (!hasEmptyTile()) {
        return;  // If there are no empty tiles, do nothing
    }
    let found = false;
    while (!found) {
        // Find a random row and column to place a "2" tile
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {  // If the selected spot is empty
            board[r][c] = 2;  // Place a "2" tile there
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";  // Set the tile's text to "2"
            tile.classList.add("x2");  // Add the "x2" class for styling
            found = true;  // Stop the loop once a spot is found
        }
    }
}

// Function to check if there are any empty tiles on the board
function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { // If there is at least one empty spot (zero)
                return true;
            }
        }
    }
    return false;  // Return false if no empty spots are found
}
