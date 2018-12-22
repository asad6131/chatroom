
//it will return true for string and false for any non string value
var isRealString = (str) => {
  return typeof str==='string' && str.trim().length > 0;
};

module.exports = {isRealString};