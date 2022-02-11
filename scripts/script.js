'use strict';
const log = console.log;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayUIMessages = function (owner, greeting="Welcome"){
  labelWelcome.textContent = `${greeting}, ${owner}`;
};

const createMovementElementCode = function(movement, index) {

  const depositOrWithdrawal = movement < 0 ? "withdrawal" : "deposit";

  const code = `<div class="movements__row">
    <div class="movements__type movements__type--${depositOrWithdrawal}">${index+1} ${depositOrWithdrawal}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${movement} €</div>
  </div>`

  return code;
};

const displayMovements = function(movements) {

  containerMovements.innerHTML = "";

  movements.forEach(function(movement, index){
    containerMovements.insertAdjacentHTML('afterbegin', createMovementElementCode(movement, index));
  });

};

const createUsernames = function(accounts){
  accounts.forEach(
    account=>{
      account.username = account.owner
        .split(' ')
        .map(
          names=>names[0].toLowerCase()
        ).join('')
    }
  )
};

const calcPrintBalance = function(movements){
  const accBalance = movements.reduce((acc, movement)=>acc+movement, 0);
  labelBalance.textContent = `${accBalance} EUR`;
};

const calcDisplaySummary = function(movements, interest) {
  
  const deposits = movements.filter(movement => movement > 0);
  const withdrawal = movements.filter(movement => movement< 0);

  labelSumIn.textContent = `${deposits.reduce((acc, curr)=>acc+curr)}€`;
  labelSumOut.textContent = `${Math.abs(withdrawal.reduce((acc, curr)=>acc+curr))}€`;

  labelSumInterest.textContent = `${deposits.reduce((sum, deposit) => sum + (deposit * interest/100), 0)}€`;
};

// Event handlers

createUsernames(accounts);

btnLogin.addEventListener('click', function(event) {
  
  event.preventDefault();
  
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  const user = accounts.find(
                acc => acc.username === username && acc.pin === pin
  );

  if (user){
    containerApp.style.opacity = "1.0";
    displayUIMessages(user.owner.split(' ')[0], "Welcome")
    displayMovements(user.movements);
    calcDisplaySummary(user.movements, user.interestRate);
    calcPrintBalance(user.movements);
  }

});