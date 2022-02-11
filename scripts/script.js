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

let currentAccount = {};

// Changes login message to owner greeting message
const displayUIMessages = function (owner, greeting="Welcome"){
  labelWelcome.textContent = `${greeting}, ${owner}`;
};

// Creates a new element of movement
const createMovementElementCode = function(movement, index) {

  const depositOrWithdrawal = movement < 0 ? "withdrawal" : "deposit";

  const code = `<div class="movements__row">
    <div class="movements__type movements__type--${depositOrWithdrawal}">${index+1} ${depositOrWithdrawal}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${movement} €</div>
  </div>`

  return code;
};

// Displays movements
const displayMovements = function(currentAccount) {

  containerMovements.innerHTML = "";

  currentAccount.movements.forEach(function(movement, index){
    containerMovements.insertAdjacentHTML('afterbegin', createMovementElementCode(movement, index));
  });

};

// Creates username from account owners names first letters
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

// Checks user balance
const checkAccountBalance = function (currentAccount){
  return currentAccount.movements.reduce((acc, movement)=>acc+movement, 0);
};

// Prints account balance to UI
const calcPrintBalance = function(currentAccount){
  const accBalance = checkAccountBalance(currentAccount);
  labelBalance.textContent = `${accBalance} EUR`;
};

// Displays account summary to ui
const calcDisplaySummary = function(currentAccount) {
  
  const deposits = currentAccount.movements.filter(movement => movement > 0);
  const withdrawal = currentAccount.movements.filter(movement => movement< 0);

  labelSumIn.textContent = `${deposits.reduce((acc, curr)=>acc+curr)}€`;
  labelSumOut.textContent = `${Math.abs(withdrawal.reduce((acc, curr)=>acc+curr))}€`;

  labelSumInterest.textContent = `${deposits.reduce((sum, deposit) => sum + (deposit * currentAccount.interestRate/100), 0)}€`;
};

const UpdateUI = function(currentAccount) {
  displayMovements(currentAccount);
  calcDisplaySummary(currentAccount);
  calcPrintBalance(currentAccount);
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
    
    inputLoginPin.value = ""
    currentAccount = user;

    containerApp.style.opacity = "1.0";
    
    displayUIMessages(user.owner.split(' ')[0], "Welcome")

    UpdateUI(currentAccount);
  }

});

btnTransfer.addEventListener('click', function(event) {
  
  event.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const transferTo = inputTransferTo.value;

  const recipient = accounts.find(acc=>acc.username === transferTo);

  if (
    transferAmount > 0 && 
    transferAmount <= checkAccountBalance(currentAccount) &&
    transferTo !== currentAccount.username ){
      
      if (recipient?.username){
        recipient.movements.push(transferAmount);
        currentAccount.movements.push(-transferAmount);
        
        inputTransferAmount.value = "";
        inputTransferTo.value = "";
        
        UpdateUI(currentAccount);

      } else{
        alert("Can't transfer, Recipient doesn't exists.");
      }

  } else if (transferAmount <= 0){
    alert("Transfer amount can't be less than or equal to 0");
  }

});