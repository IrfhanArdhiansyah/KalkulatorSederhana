const display = document.querySelector('#display');
const expression = document.querySelector('#expression');
const keys = document.querySelectorAll('.key');

let currentValue = '0';
let previousValue = null;
let operator = null;
let shouldResetDisplay = false;
let completedExpression = null;

const operatorLabels = { '+': '+', '-': '-', '*': 'x', '/': '/', '%': '%' };

function updateDisplay() {
	display.textContent = currentValue;
	expression.textContent = completedExpression || (previousValue !== null && operator
		? `${previousValue} ${operatorLabels[operator]}`
		: '\u00a0');
}

function inputNumber(number) {
	if (shouldResetDisplay || currentValue === 'Error') {
		currentValue = number;
		shouldResetDisplay = false;
		completedExpression = null;
	} else {
		currentValue = currentValue === '0' ? number : currentValue + number;
	}
	updateDisplay();
}

function inputDecimal() {
	if (shouldResetDisplay || currentValue === 'Error') {
		currentValue = '0.';
		shouldResetDisplay = false;
		completedExpression = null;
	} else if (!currentValue.includes('.')) {
		currentValue += '.';
	}
	updateDisplay();
}

function chooseOperator(nextOperator) {
	if (currentValue === 'Error') return;

	if (operator && !shouldResetDisplay) calculate();
	previousValue = Number(currentValue);
	operator = nextOperator;
	shouldResetDisplay = true;
	completedExpression = null;
	updateDisplay();
}

function calculate() {
	if (operator === null || previousValue === null) return;

	const current = Number(currentValue);
	let result;

	if (operator === '+') result = previousValue + current;
	if (operator === '-') result = previousValue - current;
	if (operator === '*') result = previousValue * current;
	if (operator === '/') result = current === 0 ? 'Error' : previousValue / current;
	if (operator === '%') result = previousValue % current;

	completedExpression = `${previousValue} ${operatorLabels[operator]} ${currentValue} =`;
	currentValue = result === 'Error' ? result : String(Number(result.toPrecision(12)));
	previousValue = null;
	operator = null;
	shouldResetDisplay = true;
	updateDisplay();
}

function clearCalculator() {
	currentValue = '0';
	previousValue = null;
	operator = null;
	shouldResetDisplay = false;
	completedExpression = null;
	updateDisplay();
}

function deleteLast() {
	if (shouldResetDisplay || currentValue === 'Error') {
		clearCalculator();
		return;
	}
	currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
	if (currentValue === '-') currentValue = '0';
	updateDisplay();
}

function pressKey(key) {
	if (/^\d$/.test(key)) inputNumber(key);
	else if (key === '.') inputDecimal();
	else if ('+-*/%'.includes(key)) chooseOperator(key);
	else if (key === 'Enter' || key === '=') calculate();
	else if (key === 'Escape' || key.toLowerCase() === 'c') clearCalculator();
	else if (key === 'Backspace') deleteLast();
}

keys.forEach((key) => {
	key.addEventListener('click', () => {
		if (key.dataset.number !== undefined) inputNumber(key.dataset.number);
		else if (key.dataset.operator) chooseOperator(key.dataset.operator);
		else if (key.dataset.action === 'decimal') inputDecimal();
		else if (key.dataset.action === 'calculate') calculate();
		else if (key.dataset.action === 'clear') clearCalculator();
		else if (key.dataset.action === 'delete') deleteLast();
	});
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Enter' || event.key === '=') event.preventDefault();
	pressKey(event.key);

	const pressedKey = [...keys].find((key) => (
		key.dataset.number === event.key || key.dataset.operator === event.key
	));
	if (pressedKey) {
		pressedKey.classList.add('is-pressed');
		setTimeout(() => pressedKey.classList.remove('is-pressed'), 100);
	}
});

updateDisplay();
