const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2,
    pin: 5555,
    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
        "2020-07-28T23:36:17.929Z",
        "2020-08-01T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
};
  
const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};
  
const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};
  
const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};
  
const accounts = [account1, account2, account3, account4];
  
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

const formatMovementDate = function (date) {
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  
    const daysPassed = calcDaysPassed(new Date(), date);
  
    if (daysPassed === 0) return "Today";
    if (daysPassed === 1) return "Yesterday";
    if (daysPassed <= 7) return `${daysPassed} days ago`;
  
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
  

const displayMovements = function (accs, sort = false) {
    containerMovements.innerHTML = '';
  
    const movs = sort ? accs.movements.slice().sort((a,b) => a-b) : accs.movements
    movs.forEach(function (mov, i) {
        const type = mov > 0 ? "deposit" : "withdrawal";

        const date = new Date(accs.movementsDates[i]);
        const displayDate = formatMovementDate(date);
        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
        `;
  
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};
  
const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const depositBalane = function(acc) {
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}€`;
}

const withdrawnBalance = function(acc) {
    const incomes = acc.movements.filter(mov => mov < 0).reduce((acc,mov) => acc+mov,0);
    labelSumOut.textContent = `${Math.abs(incomes.toFixed(2))}€`;
}

const totalInterest = function(acc) {
    const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100).reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

const createUsernames = function (accs) {
    accs.forEach(function (acc) {
      acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');
    });
};
createUsernames(accounts);

const logOutTime = function() {
    const tick = () => {
        const min = String(Math.trunc(time/60)).padStart(2,0);
        const sec = String(time%60).padStart(2,0);
        labelTimer.textContent = `${min}:${sec}`;
        if(time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = 'Log in to get started';
            containerApp.style.opacity = 0;
        }
        time--;
    }
    let time = 120;
    tick();
    const timer = setInterval(tick,1000);
    return timer;
}
  
let currentAccount, timer;
  
btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
  
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
      // Display UI and message
      labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
      containerApp.style.opacity = 100;
  
      // Clear input fields
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();

      if (timer) clearInterval(timer);
      timer = logOutTime();

      displayMovements(currentAccount);
      depositBalane(currentAccount);
      withdrawnBalance(currentAccount);
      calcDisplayBalance(currentAccount);
      totalInterest(currentAccount);
    }
});

btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value = '';
    if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());
        displayMovements(currentAccount);
        depositBalane(currentAccount);
        withdrawnBalance(currentAccount);
        calcDisplayBalance(currentAccount);
        totalInterest(currentAccount);
        clearInterval(timer);
        timer = logOutTime();
    }
})

btnLoan.addEventListener('click', function(e) {
    e.preventDefault();
    const loanAmount = Number(inputLoanAmount.value);
    if(loanAmount >=0 && currentAccount.movements.some(mov => mov >= loanAmount*0.1)) {
        currentAccount.movements.push(loanAmount);
        currentAccount.movementsDates.push(new Date().toISOString());
        displayMovements(currentAccount);
        depositBalane(currentAccount);
        withdrawnBalance(currentAccount);
        calcDisplayBalance(currentAccount);
        totalInterest(currentAccount);
        clearInterval(timer);
        timer = logOutTime();
    }
    inputLoanAmount.value = '';
})

btnClose.addEventListener('click', function(e) {
    e.preventDefault();
    if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === currentAccount.username);
        accounts.splice(index,1);
        //hide UI
        containerApp.style.opacity = 0;
    }
})

let sorted = false;

btnSort.addEventListener('click', function(e) {
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted; 
})