function parseIndex(num){
  const str = '' + num;
  return str.length===1 ? dic(str) : (str[0] === '1' ? '十' + dic(str[1]) : dic(str[0])+'十'+dic(str[1]));
}

function dic(n){
  switch (n) {
    case '1':
      return '一'
      break;
    case '2':
      return '二'
      break;
    case '3':
      return '三'
      break;
    case '4':
      return '四'
      break;
    case '5':
      return '五'
      break;
    case '6':
      return '六'
      break;
    case '7':
      return '七'
      break;
    case '8':
      return '八'
      break;
    case '9':
      return '九'
      break;
    case '0':
      return ''
      break;
    default:
      return ''
  }
}

export default parseIndex
