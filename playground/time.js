var moment = require('moment');

var date = moment(createdAt);
// date.add(100, 'year').subtract(9,'months');
// console.log(date.format('MMM Do, YYYY'));


var  createdAt = 1234;

console.log(date.format('h:mm a'));
