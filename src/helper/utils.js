const formatDateForSQL = (date, withTime = false) => {
  const pad = (num) => (num < 10 ? "0" + num : num);

  let result =
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate());

  if (withTime)
    result +=
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds());

  return result;
};

function convertToIndonesianRupiahWords(number) {
  const units = ["", "Ribu", "Juta", "Milyar", "Triliun"];
  const numbersInWords = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan"];

  if (number === 0) return "Nol Rupiah";
  if (number < 0) return "Minus " + convertToIndonesianRupiahWords(Math.abs(number));

  let words = "";
  let unitIndex = 0;

  while (number > 0) {
    let groupOfThree = number % 1000;

    if (groupOfThree > 0) {
      let groupWords = "";

      if (groupOfThree >= 100) {
        if (groupOfThree >= 200) {
          groupWords += numbersInWords[Math.floor(groupOfThree / 100)] + " Ratus ";
        } else {
          groupWords += "Seratus ";
        }
        groupOfThree %= 100;
      }

      if (groupOfThree >= 10) {
        if (groupOfThree >= 20) {
          groupWords += numbersInWords[Math.floor(groupOfThree / 10)] + " Puluh ";
          groupOfThree %= 10;
        } else if (groupOfThree === 10) {
          groupWords += "Sepuluh ";
          groupOfThree = 0;
        } else if (groupOfThree === 11) {
          groupWords += "Sebelas ";
          groupOfThree = 0;
        } else {
          groupWords += numbersInWords[groupOfThree] + " Belas ";
          groupOfThree = 0;
        }
      }

      if (groupOfThree > 0) {
        if (groupOfThree === 1 && unitIndex === 1) {
          groupWords += "Se";
        } else {
          groupWords += numbersInWords[groupOfThree] + " ";
        }
      }

      words = groupWords + units[unitIndex] + " " + words;
    }

    number = Math.floor(number / 1000);
    unitIndex++;
  }

  return words.trim() + " Rupiah";
}

function getMonthAndDayRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new Error("startDate must be before endDate");
  }

  let months = 0;
  let days = 0;

  // Calculate the difference in months and days
  while (start < end) {
    // If adding a month goes beyond the end date, break the loop
    const nextMonth = new Date(start);
    nextMonth.setMonth(start.getMonth() + 1);

    if (nextMonth <= end) {
      months++;
      start.setMonth(start.getMonth() + 1);
    } else {
      break;
    }
  }

  // Calculate the remaining days
  days = Math.floor((end - start) / (1000 * 60 * 60 * 24));

  return `${months} bulan ${days} hari`;
}

function formatToIndonesianDate(sqlDatetime) {
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Convert the SQL datetime string into a JavaScript Date object
  const date = new Date(sqlDatetime);

  // Extract the day, month, and year
  const day = date.getDate(); // Get the day (1-31)
  const month = date.getMonth(); // Get the month (0-11)
  const year = date.getFullYear(); // Get the full year

  // Format the date in Indonesian format
  return `${day} ${monthNames[month]} ${year}`;
}

function calculateAndConvertToIndonesianWords(startDatetime, endDatetime) {
  const units = ["", "Ribu", "Juta", "Milyar", "Triliun"];
  const numbersInWords = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan"];

  // Helper function to convert a number into Indonesian words
  function convertToIndonesianWords(number) {
    if (number === 0) return "Nol";
    if (number < 0) return "Minus " + convertToIndonesianWords(Math.abs(number));

    let words = "";
    let unitIndex = 0;

    while (number > 0) {
      let groupOfThree = number % 1000;

      if (groupOfThree > 0) {
        let groupWords = "";

        if (groupOfThree >= 100) {
          if (groupOfThree >= 200) {
            groupWords += numbersInWords[Math.floor(groupOfThree / 100)] + " Ratus ";
          } else {
            groupWords += "Seratus ";
          }
          groupOfThree %= 100;
        }

        if (groupOfThree >= 10) {
          if (groupOfThree >= 20) {
            groupWords += numbersInWords[Math.floor(groupOfThree / 10)] + " Puluh ";
            groupOfThree %= 10;
          } else if (groupOfThree === 10) {
            groupWords += "Sepuluh ";
            groupOfThree = 0;
          } else if (groupOfThree === 11) {
            groupWords += "Sebelas ";
            groupOfThree = 0;
          } else {
            groupWords += numbersInWords[groupOfThree] + " Belas ";
            groupOfThree = 0;
          }
        }

        if (groupOfThree > 0) {
          if (groupOfThree === 1 && unitIndex === 1) {
            groupWords += "Se";
          } else {
            groupWords += numbersInWords[groupOfThree] + " ";
          }
        }

        words = groupWords + units[unitIndex] + " " + words;
      }

      number = Math.floor(number / 1000);
      unitIndex++;
    }

    return words.trim();
  }

  // Convert datetimes to Date objects
  const startDate = new Date(startDatetime);
  const endDate = new Date(endDatetime);

  // Calculate the difference in years and months
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthsDiff = endDate.getMonth() - startDate.getMonth();

  // Calculate the total number of months between the two dates
  let totalMonths = yearsDiff * 12 + monthsDiff;

  // If the end date's month is earlier than the start date's month, subtract 1
  if (monthsDiff < 0) {
    totalMonths -= 1;
  }

  // Convert the number of months to Indonesian words
  const text = convertToIndonesianWords(totalMonths);

  // Return the result
  return { length: totalMonths, text };
}


module.exports = {
  formatDateForSQL,
  convertToIndonesianRupiahWords,
  formatToIndonesianDate,
  getMonthAndDayRange,
  calculateAndConvertToIndonesianWords
};
