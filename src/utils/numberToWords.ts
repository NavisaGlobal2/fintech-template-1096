const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

function convertHundreds(num: number): string {
  let result = '';
  
  if (num > 99) {
    result += ones[Math.floor(num / 100)] + ' hundred';
    num %= 100;
    if (num > 0) result += ' and ';
  }
  
  if (num > 19) {
    result += tens[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) result += '-' + ones[num];
  } else if (num > 0) {
    result += ones[num];
  }
  
  return result;
}

export function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + numberToWords(-num);
  
  let result = '';
  let scaleIndex = 0;
  
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      const chunkWords = convertHundreds(chunk);
      const scale = scales[scaleIndex];
      result = chunkWords + (scale ? ' ' + scale : '') + (result ? ' ' + result : '');
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }
  
  return result.trim();
}

export function numberToWordsCapitalized(num: number): string {
  const words = numberToWords(num);
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function currencyToWords(amount: number, currency: string = 'pounds'): string {
  const wholePart = Math.floor(amount);
  const decimalPart = Math.round((amount - wholePart) * 100);
  
  let result = numberToWordsCapitalized(wholePart) + ' ' + currency;
  
  if (decimalPart > 0) {
    result += ' and ' + numberToWords(decimalPart) + ' pence';
  }
  
  return result + ' sterling';
}