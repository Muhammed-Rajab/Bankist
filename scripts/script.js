'use strict';
const log = console.log;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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
let sort = true;

// Changes login message to owner greeting message
const displayUIMessages = function (owner, greeting="Welcome"){
  labelWelcome.textContent = `${greeting}, ${owner}`;
};

// Creates a new element of movement
const createMovementElementCode = function(movement, index, date, locale='en-US') {

  const formatter = new Intl.NumberFormat(currentAccount.locale, {currency:currentAccount.currency, style: 'currency'});

  const depositOrWithdrawal = movement < 0 ? "withdrawal" : "deposit";

  const now = new Date();
  const dateObj = new Date(date);

  const difference = Math.round(Math.abs(+now - +dateObj) / (60*60*24*1000)) || 0;
  let dateString = ""

  switch(difference){
    case 0:
      dateString = "Today";
      break;
    case 1:
      dateString = "Yesterday";
      break;
    default:
      dateString = new Intl.DateTimeFormat(locale).format(now);
      break;
  }

  if (difference <= 7  && difference >= 2){
    dateString = `${difference} day${difference > 1?'s':""} ago`  
  }

  const code = `<div class="movements__row">
    <div class="movements__type movements__type--${depositOrWithdrawal}">${index+1} ${depositOrWithdrawal}</div>
    <div class="movements__date">${dateString}</div>
    <div class="movements__value">${formatter.format(movement.toFixed(2))} €</div>
  </div>`

  return code;
};

// Displays movements
const displayMovements = function(currentAccount, sort=false) {

  containerMovements.innerHTML = "";

  const movs = sort ? currentAccount.movements.slice().sort((a, b) => a - b)
  : currentAccount.movements

  movs.forEach(function(movement, index){
    containerMovements.insertAdjacentHTML('afterbegin', createMovementElementCode(movement, index, currentAccount.movementsDates[index]), currentAccount.locale);
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
  const formatter = new Intl.NumberFormat(currentAccount.locale, {currency:currentAccount.currency, style: 'currency'});
  const accBalance = formatter.format(checkAccountBalance(currentAccount).toFixed(2));
  labelBalance.textContent = `${accBalance}`;
};

// Displays account summary to ui
const calcDisplaySummary = function(currentAccount) {
  
  const formatter = new Intl.NumberFormat(currentAccount.locale, {currency:currentAccount.currency, style: 'currency'});

  const deposits = currentAccount.movements.filter(movement => movement > 0);
  const withdrawal = currentAccount.movements.filter(movement => movement< 0);

  labelSumIn.textContent = `${formatter.format(deposits.reduce((acc, curr)=>acc+curr).toFixed(2))}`;
  labelSumOut.textContent = `${formatter.format(Math.abs(withdrawal.reduce((acc, curr)=>acc+curr).toFixed(2)))}`;

  labelSumInterest.textContent = `${formatter.format(deposits.reduce((sum, deposit) => sum + (deposit * currentAccount.interestRate/100), 0).toFixed(2)  )}`;
};

const UpdateUI = function(currentAccount) {
  displayMovements(currentAccount);
  calcDisplaySummary(currentAccount);
  calcPrintBalance(currentAccount);
};

// Event handlers

createUsernames(accounts);

currentAccount = account1;
UpdateUI(currentAccount);
containerApp.style.opacity = "1.0";

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

    const options = {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
      year: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
    };
    const  currDate = new Date();
    labelDate.textContent = new Intl.DateTimeFormat(user.locale, options).format(currDate);
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

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  /*
    only grants a loan
    if there at least one deposit
    with at least 10% of the requested loan amount.
  */
  
  const loanAmount = Math.floor(+inputLoanAmount.value);

  if(loanAmount <= 0) return;

  if (currentAccount.movements.some(movement => movement >= loanAmount*0.1)){
    alert("Load approved!!")
    currentAccount.movements.push(loanAmount);
    UpdateUI(currentAccount);
  };

  inputLoanAmount.value = ""
});

btnSort.addEventListener("click", function(e) {
  e.preventDefault();
  
  displayMovements(currentAccount, sort); sort = !sort;
});

btnClose.addEventListener("click", function(e) {
  
  e.preventDefault();
  
  
  const closeUsername = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value)

  if  (currentAccount.username === closeUsername&&
    currentAccount.pin === closePin){
      
      const currentUserIndex = accounts.findIndex(acc => acc.username === currentAccount.username);
      accounts.splice(accounts[currentUserIndex], 1);
      
      displayUIMessages(currentAccount.owner.split(' ')[0], "Good bye");
      containerApp.style.opacity = "0.0";

      inputCloseUsername.value = inputClosePin.value = "";
  }
});