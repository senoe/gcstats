var moment = require('moment-timezone');

const formatComma = function (x) {
    if(x) return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else return 0;
}

const formatTime = function (timestamp) {
    if(timestamp == null || timestamp == 0) {
        return "Unknown";
    }
    return moment(timestamp).tz('America/New_York').format('MMM D YYYY, h:mm A');
}

const formatTimeFromNow = function (timestamp) {
    if(timestamp == null || timestamp == 0) {
        return "Unknown";
    }
    return moment(timestamp).fromNow();
}

const formatTimeDiff = function (time) {
    if(time == null || time == 0) {
        return "Unknown";
    }
    return moment.duration(time).humanize();
}

const fixed = function (number, decimals) {
    return number.toFixed(decimals);
}

const cleanArray = function (array) {
    var newArray = [];
    for(var index = 0; index < array.length; index++) {
        if(array[index] || array[index] == "") {
            newArray.push(array[index]);
        }
    }
    return newArray;
}

const chunkArray = function (arr, size) {
    var chunkedArr = [];
    for(var i = 0; i < arr.length; i += size) {
        chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
}

const containsIndexArray = function (string, array) {
    var result = -1;
    for(i = 0; i < array.length; i++){
        if((array[i].indexOf(string)) > -1){
            result = i;
        }
    }
    return result;
}

const toCapitalized = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const contains = function (str, substr) {
    if(!str) return false;
    return str.indexOf(substr) > -1
}

const ratio = function (num1, num2) {
    if((num1 / num2) < 0) return "0.00";

    var result = num1 / num2
    
    result = result.toFixed(2)

    return !isNaN(result) ? result.toString() : "0.00"
}

const prevItem = function(i, arr) {
    if (i === 0) { // i would become 0
        i = arr.length; // so put it at the other end of the array
    }
    i--; // decrease by one
    return arr[i]; // give us back the item of where we are now
}

const isEven = function(number) {
    if(number % 2 == 0) return true;
    return false;
}

const isOdd = function(number) {
    return !isEven(number);
}

const everyOtherOther = function(number) {
    if(number % 3 == 0) return true;
    return false;
}

module.exports = {
    formatComma, formatTime, formatTimeFromNow, formatTimeDiff, fixed, cleanArray, chunkArray, containsIndexArray, toCapitalized, contains, ratio, prevItem, isEven, isOdd, everyOtherOther
}