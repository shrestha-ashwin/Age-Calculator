const day = document.querySelector("#day");
const month = document.querySelector("#month");
const year = document.querySelector("#year");
const form = document.querySelector(".form");
const inputs = document.querySelectorAll(".input-field");
const inputHeaders = document.querySelectorAll("label");
const dateErrors = document.querySelectorAll(".date-error");
const pageDay = document.querySelector(".day");
const pageMonth = document.querySelector(".month");
const pageYear = document.querySelector(".year");
const pageDates = document.querySelectorAll(".time");
const dateInMonth = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  unvalidatePrev();
  validate();
});

for (let input of inputs) {
  input.addEventListener("focus", () => {
    unvalidatePrev();
  });
}

function validate() {
  if (!isFormEmpty() && !isInputEmpty() && !isDateInvalid()) {
    showTime();
  }
}

function isDateInvalid() {
  let isDateInvalid = false;
  dateInMonth[2] = 28;

  let list = {
    day: "Must be a valid date",
    month: "Must be a valid month",
    year: "Must be in the past",
    past: "Must be in the past",
  };

  if (parseInt(year.value) > 2024) {
    makeValidDate(dateErrors[2], list.year);
    isDateInvalid = true;
  } else if (
    parseInt(year.value) === 2024 &&
    (parseInt(month.value) > 6 ||
      (parseInt(month.value) === 6 && parseInt(day.value) > 15))
  ) {
    for (let dateError of dateErrors) {
      makeValidDate(dateError, list.past);
    }
    isDateInvalid = true;
  }

  //for leap year
  if (
    year.value % 4 === 0 &&
    (year.value % 400 === 0 || year.value % 100 != 0)
  ) {
    dateInMonth[2] = 29;
  }

  if (!(month.value >= 1 && month.value <= 12)) {
    makeValidDate(dateErrors[1], list.month);
    isDateInvalid = true;
  }

  if (day.value >= 1 && day.value <= 31) {
    const monthDay = month.value;
    const inputDays = dateInMonth[monthDay];
    if (day.value > inputDays) {
      makeValidDate(dateErrors[0], list.day);
      isDateInvalid = true;
    }
  } else {
    makeValidDate(dateErrors[0], list.day);
    isDateInvalid = true;
  }
  return isDateInvalid;
}

function isFormEmpty() {
  let isEmpty = false;
  if (day.value === "" && month.value === "" && year.value === "") {
    makeRed(inputs, "borderRed");
    makeRed(inputHeaders, "textRed");
    makeDateError(dateErrors);
    isEmpty = true;
  }
  return isEmpty;
}

function isInputEmpty() {
  let isEmpty = false;
  const dates = [day, month, year];
  for (let i = 0; i < dates.length; i++) {
    if (dates[i].value === "") {
      makeEmptyError(inputs[i], inputHeaders[i], dateErrors[i]);
      isEmpty = true;
    }
  }
  if (isEmpty) {
    makeRed(inputs, "borderRed");
    makeRed(inputHeaders, "textRed");
  }
  return isEmpty;
}

function makeRed(elements, className) {
  for (let element of elements) {
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    }
  }
}

function makeValidDate(dateError, errorMsg) {
  makeRed(inputs, "borderRed");
  makeRed(inputHeaders, "textRed");
  dateError.append(errorMsg);
}

function makeDateError(dateErrors) {
  for (let dateError of dateErrors) {
    dateError.append("This field is required");
  }
}

function makeEmptyError(input, inputHeader, dateError) {
  input.classList.add("borderRed");
  inputHeader.classList.add("textRed");
  dateError.append("This field is required");
}

function getTime(inputDay, inputMonth, inputYear) {
  const currentDate = new Date();
  const startDate = new Date(inputYear, inputMonth - 1, inputDay);

  let yearsDiff = currentDate.getFullYear() - startDate.getFullYear();

  let monthsDiff = currentDate.getMonth() - startDate.getMonth();
  if (
    monthsDiff < 0 ||
    (monthsDiff === 0 && currentDate.getDate() < startDate.getDate())
  ) {
    yearsDiff--;
    monthsDiff += 12;
  }

  let daysDiff = currentDate.getDate() - startDate.getDate();
  if (daysDiff < 0) {
    const tempDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      0
    );
    daysDiff += tempDate.getDate();
    monthsDiff--;
  }

  return {
    year: yearsDiff,
    month: monthsDiff,
    day: daysDiff,
  };
}

function showTime() {
  const time = getTime(
    parseInt(day.value),
    parseInt(month.value),
    parseInt(year.value)
  );
  pageDay.innerText = time.day;
  pageMonth.innerText = time.month;
  pageYear.innerText = time.year;
}

function unvalidatePrev() {
  for (let input of inputs) {
    input.classList.remove("borderRed");
  }
  for (let inputHeader of inputHeaders) {
    inputHeader.classList.remove("textRed");
  }
  for (let dateError of dateErrors) {
    dateError.innerText = "";
  }

  for (let pageDate of pageDates) {
    pageDate.innerText = "- -";
  }
}
