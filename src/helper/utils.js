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

module.exports = {
  formatDateForSQL,
  convertToIndonesianRupiahWords
};
