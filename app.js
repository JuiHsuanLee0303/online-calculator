let main = document.querySelector('main');
let screen = document.querySelector('div.screen');
let number = document.querySelector('div.screen h2');

let keysPressed = {}; 
let operate = null;
let previousNumber = null;
let previousInput = null;
let _isNewNumber = false;

function pressAction(ope) {
    document.querySelectorAll(`div.button`).forEach(button => {
        button.classList.remove('press');
        button.classList.add('unpress');
    });
    if (ope != null) {
        document.querySelector(`div#${ope}`).classList.add('press');
        document.querySelector(`div#${ope}`).classList.remove('unpress');
    }

}

function enterNum(num) {
    if (number.innerText.length > 27) { }
    else if(num === '.' && number.innerText.includes('.')) { }
    else {
        if (_isNewNumber || previousInput === 'equal') {
            number.innerText = '';
            _isNewNumber = false;
        }
        number.innerText += num.toString();
        previousInput = num;
        pressAction(null);
    }
}

function preciseCalculate(ope, num1, num2) {
    const num1Digits = (num1.toString().split('.')[1] || '').length;
    const num2Digits = (num2.toString().split('.')[1] || '').length;
    const baseNum1 = Math.pow(10, num1Digits);
    const baseNum2 = Math.pow(10, num2Digits);
    const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
    if (ope === 'plus') { return (num1 * baseNum + num2 * baseNum) / baseNum; }
    else if (ope ==='minus') { return (num1 * baseNum - num2 * baseNum) / baseNum; }
    else if (ope ==='multiply') { return (num1 * baseNum1) * (num2 * baseNum2) / (baseNum1 * baseNum2); }
    else if (ope === 'divide') { return (num1 * baseNum) / (num2 * baseNum); }
}

function enterEqual() {
    if (operate === null) {
        return;
    }

    let num1 = parseFloat(previousNumber);
    let num2 = parseFloat(number.innerText);

    number.innerText = preciseCalculate(operate, num1, num2).toString();
    operate = null;
    previousNumber = null;
    previousInput = 'equal';
}


function enterOperator(ope) {
    if (!_isNewNumber) {
        if (operate != null) { enterEqual(); }
    
        operate = ope;
        previousNumber = number.innerText;
        _isNewNumber = true;
        pressAction(ope);
        previousInput = ope;
    }
}

function checkShowNumber() {
    if (number.innerText[0] === '0' && number.innerText[1] != '.') {
        number.innerText = number.innerText.slice(1);
    }
    if (number.innerText.length === 0) {
        number.innerText = '0';
    }
}

// operate from keyboard
window.addEventListener("keydown", function(e) {
    keysPressed[e.code] = true;
    let code = e.code;
    console.log(code);

    //operators
    if (code === 'Backspace' || code === 'Delete') {
        if (number.innerText[number.innerText.length - 2] === '.') {
            number.innerText = number.innerText.slice(0, -2);
        }
        else {
            number.innerText = number.innerText.slice(0, -1);
        }
    }

    else if (code === 'Minus') { enterOperator('minus'); }
    else if (code === 'Plus') { enterOperator('plus'); }
    else if (code === 'Multiply') { enterOperator('multiply'); }
    else if (code === 'Slash' ) { enterOperator('divide'); }
    else if (code === 'Equal' && keysPressed['ShiftRight'] || keysPressed['ShiftLeft'] ) { 
        enterOperator('plus');
        keysPressed['ShiftRight'] = false;
        keysPressed['ShiftLeft'] = false;
    }
    else if (code === 'Digit8' && keysPressed['ShiftRight'] || keysPressed['ShiftLeft'] ) { 
        enterOperator('multiply');
        keysPressed['ShiftRight'] = false;
        keysPressed['ShiftLeft'] = false;
    }

    else if (code === 'Enter' || code === 'Equal') {
        enterEqual();
        pressAction(null);
    }

    //numbers
    else if (code === 'Digit1') { enterNum(1); }
    else if (code === 'Digit2') { enterNum(2); }
    else if (code === 'Digit3') { enterNum(3); }
    else if (code === 'Digit4') { enterNum(4); }
    else if (code === 'Digit5') { enterNum(5); }
    else if (code === 'Digit6') { enterNum(6); }
    else if (code === 'Digit7') { enterNum(7); }
    else if (code === 'Digit8') { enterNum(8); }
    else if (code === 'Digit9') { enterNum(9); }
    else if (code === 'Digit0') { enterNum(0); }
    else if (code === 'Period') { enterNum('.'); }

    // check digits
    checkShowNumber();
    
}); 

// number from screen
let numberButtons = document.querySelectorAll('div.number');
numberButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
        
        console.log(e.target.innerText);
        // cannot enter numbers greater than 28
        enterNum(e.target.innerText);
        
        // check digits
        checkShowNumber();
    });
});

// operators from screen
let operatorButtons = document.querySelectorAll('div.operator');
operatorButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
        console.log(e.target.innerText);

        if (e.target.innerText === 'AC') {
            number.innerText = '0';
            operate = null;
            previousNumber = null;
        }

        else if (e.target.innerText === '+/-') {
            if (number.innerText[0] === '-') {
                number.innerText = number.innerText.slice(1);
            }
            else {
                number.innerText = '-' + number.innerText;
            }
        }

        else if (e.target.innerText === '%') { 
            number.innerText /= 100;
        }

        else if (e.target.innerText === '÷') { enterOperator('divide'); }
        else if (e.target.innerText === 'x') { enterOperator('multiply'); }
        else if (e.target.innerText === '-') { enterOperator('minus'); }
        else if (e.target.innerText === '+') { enterOperator('plus'); }
        else if (e.target.innerText === '=') { enterEqual(); }
    });
});