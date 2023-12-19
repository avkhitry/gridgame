let checkSymbols; // Declare checkSymbols globally
document.addEventListener('DOMContentLoaded', function () {
    const symbols = ['☂', '☘', '☸', '♥', '♨'];
    let symbolPositions = [];
    let currentLevel = 1;


    function logChildren(obj = 'symbolBar') {
        const symbolBar = document.getElementById(obj);
        const children = symbolBar.children;

        console.log("Children of " + obj);
        for (let i = 0; i < children.length; i++) {
            console.log(children[i]);
        }
    }

    function initializeGame() {
        const gameCanvas = document.getElementById('gameCanvas');
        const symbolBar = document.getElementById('symbolBar');

        // Clear previous symbols from both the game canvas and the symbol bar
        gameCanvas.innerHTML = '';
        symbolBar.innerHTML = '';

        // Clear symbols appended to document.body
        document.querySelectorAll('.symbol').forEach(symbol => {
            if (symbol.parentElement === document.body) {
                document.body.removeChild(symbol);
            }
        });

        // Clear the symbol positions from the previous game
        symbolPositions = [];

        // Create and display symbols
        for (let i = 0; i < currentLevel; i++) {
            const color = getRandomColor(); // Generate color

            const symbol = document.createElement('div');
            symbol.className = 'symbol';
            symbol.textContent = symbols[i % symbols.length];
            symbol.style.color = color; // Use the generated color

            symbol.style.top = `${Math.random() * 350}px`;
            symbol.style.left = `${Math.random() * 550}px`;

            symbolPositions.push({ symbol: symbol.textContent, color: color, top: symbol.style.top, left: symbol.style.left });
            gameCanvas.appendChild(symbol);

            // Add drag functionality
            symbol.addEventListener('mousedown', startDrag);
        }
        logChildren(obj = 'gameCanvas')// debug
        setTimeout(clearAndDisplayBar, 1000);
    }

    function clearAndDisplayBar() {
        const gameCanvas = document.getElementById('gameCanvas');
        gameCanvas.innerHTML = '';
        const symbolBar = document.getElementById('symbolBar');
        symbolBar.innerHTML = '';

        symbolPositions.forEach((pos, index) => {
            const symbol = document.createElement('div');
            symbol.className = 'symbol';
            symbol.textContent = pos.symbol;
            symbol.style.color = pos.color; // Use the stored color
            symbol.id = `symbol-${index}`;
            symbolBar.appendChild(symbol);

            symbol.addEventListener('mousedown', startDrag);
        });
        logChildren(obj = 'symbolBar')// debug

    }



    function startDrag(event) {
        const symbol = event.target;
        let offsetX, offsetY;

        if (event.type === 'mousedown') {
            offsetX = event.offsetX;
            offsetY = event.offsetY;
        } else if (event.type === 'touchstart') {
            const rect = event.target.getBoundingClientRect();
            offsetX = event.touches[0].pageX - rect.left;
            offsetY = event.touches[0].pageY - rect.top;
        }

        function moveAt(pageX, pageY) {
            symbol.style.left = pageX - offsetX + 'px';
            symbol.style.top = pageY - offsetY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        function onTouchMove(event) {
            moveAt(event.touches[0].pageX, event.touches[0].pageY);
        }

        if (event.type === 'mousedown') {
            document.addEventListener('mousemove', onMouseMove);
            symbol.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                symbol.onmouseup = null;
            };
        } else if (event.type === 'touchstart') {
            document.addEventListener('touchmove', onTouchMove);
            symbol.ontouchend = function () {
                document.removeEventListener('touchmove', onTouchMove);
                symbol.ontouchend = null;
            };
        }

        symbol.ondragstart = function () {
            return false;
        };
    }
    // Add touch event listeners
    document.addEventListener('touchstart', startDrag);

    // Define checkSymbols here
    function checkSymbols() {
        let success = true;
        const messageDiv = document.getElementById('message');

        for (let i = 0; i < symbolPositions.length; i++) {
            const original = symbolPositions[i];
            const movedSymbol = document.getElementById(`symbol-${i}`);

            if (!isCloseEnough(original, movedSymbol)) {
                success = false;
                break;
            }
        }

        symbolPositions.forEach((pos, index) => {
            const symbol = document.getElementById(`symbol-${index}`);
            if (symbol) {
                // Animate the symbol back to its original position
                symbol.style.transition = 'top 0.5s, left 0.5s'; // Smooth transition for the movement
                symbol.style.position = 'absolute'; // Ensure the symbol can be positioned absolutely
                symbol.style.left = pos.left;
                symbol.style.top = pos.top;
            }
        });

        if (success) {
            messageDiv.innerText = "Correct! Level Up!";
            currentLevel++;
        } else {
            messageDiv.innerText = "Incorrect. Try Again!";
        }
        messageDiv.style.display = 'block';

        // Hide the message after a few seconds
        setTimeout(function () {
            messageDiv.style.display = 'none';
            initializeGame(); // Start a new game round
        }, 2000);
    };

    function isCloseEnough(original, element) {
        const tolerance = 30; // pixels
        const originalX = parseInt(original.left);
        const originalY = parseInt(original.top);
        const elementX = parseInt(element.style.left);
        const elementY = parseInt(element.style.top);

        return Math.abs(originalX - elementX) < tolerance && Math.abs(originalY - elementY) < tolerance;
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Set the event handler for the button
    document.getElementById('checkButton').onclick = checkSymbols;


    initializeGame();
});

