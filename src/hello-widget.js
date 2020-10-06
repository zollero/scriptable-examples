
let widgetHello = new ListWidget(); 
var today = new Date();

var widgetInputRAW = args.widgetParameter;
// var widgetInputRAW = 'bg6.png|50|#ffffff';

try {
	widgetInputRAW.toString();
} catch(e) {
	throw new Error("Please long press the widget and add a parameter.");
}

var widgetInput = widgetInputRAW.toString();

var inputArr = widgetInput.split("|");

// iCloud file path
var scriptableFilePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/";
var removeSpaces1 = inputArr[0].split(" "); // Remove spaces from file name
var removeSpaces2 = removeSpaces1.join('');
var tempPath = removeSpaces2.split(".");
var backgroundImageURLRAW = scriptableFilePath + tempPath[0];

var fm = FileManager.iCloud();
var backgroundImageURL = scriptableFilePath + tempPath[0] + ".";
var backgroundImageURLInput = scriptableFilePath + removeSpaces2;

// For users having trouble with extensions
// Uses user-input file path is the file is found
// Checks for common file format extensions if the file is not found
if (fm.fileExists(backgroundImageURLInput) == false) {
  var fileTypes = ['png', 'jpg', 'jpeg', 'tiff', 'webp', 'gif'];

  fileTypes.forEach(function(item) {
    if (fm.fileExists((backgroundImageURL + item.toLowerCase())) == true) {
      backgroundImageURL = backgroundImageURLRAW + "." + item.toLowerCase();
    } else if (fm.fileExists((backgroundImageURL + item.toUpperCase())) == true) {
      backgroundImageURL = backgroundImageURLRAW + "." + item.toUpperCase();
    }
  });
} else {
	backgroundImageURL = scriptableFilePath + removeSpaces2;
}

var spacing = parseInt(inputArr[1]);

// Long-form days and months
var days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
var months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];

// Greetings arrays per time period. 
var greetingsMorning = [
  '上午好'
];
var greetingsAfternoon = [
  '下午好'
];
var greetingsEvening = [
  '晚上好'
];
var greetingsNight = [
  '睡觉时间'
];
var greetingsLateNight = [
  '去睡觉💤'
];

// Holiday customization
var holidaysByKey = {
	// month,week,day: datetext
	"11,4,4": "Happy Thanksgiving!"
}

var holidaysByDate = {
	// month,date: greeting
	"1,1": "Happy " + (today.getFullYear()).toString() + "!",
	"10,31": "Happy Halloween!",
	"12,25": "Merry Christmas!"
}

var holidayKey = (today.getMonth() + 1).toString() + "," +  (Math.ceil(today.getDate() / 7)).toString() + "," + (today.getDay()).toString();

var holidayKeyDate = (today.getMonth() + 1).toString() + "," + (today.getDate()).toString();

// Date Calculations
var weekday = days[ today.getDay() ];
var month = months[ today.getMonth() ];
var date = today.getDate();
var hour = today.getHours();

// Append ordinal suffix to date
function ordinalSuffix(input) {
	if (input % 10 == 1 && date != 11) {
		return input.toString() + "st";
	} else if (input % 10 == 2 && date != 12) {
		return input.toString() + "nd";
	} else if (input % 10 == 3 && date != 13) {
		return input.toString() + "rd";
	} else {
		return input.toString() + "th";
	}
}

// Generate date string
var datefull = weekday + ", " + month + " " + ordinalSuffix(date);

// Support for multiple greetings per time period
function randomGreeting(greetingArray) {
	return Math.floor(Math.random() * greetingArray.length);
}

var greeting = new String("Howdy.")
if (hour < 5 && hour >= 1) { // 1am - 5am
	greeting = greetingsLateNight[randomGreeting(greetingsLateNight)];
} else if (hour >= 23 || hour < 1) { // 11pm - 1am
	greeting = greetingsNight[randomGreeting(greetingsNight)];
} else if (hour < 12) { // Before noon (5am - 12pm)
	greeting = greetingsMorning[randomGreeting(greetingsMorning)];
} else if (hour >= 12 && hour <= 17) { // 12pm - 5pm
	greeting = greetingsAfternoon[randomGreeting(greetingsAfternoon)];
} else if (hour > 17 && hour < 23) { // 5pm - 11pm
	greeting = greetingsEvening[randomGreeting(greetingsEvening)];
} 

// Overwrite greeting if calculated holiday
if (holidaysByKey[holidayKey]) {
	greeting = holidaysByKey[holidayKey];
}

// Overwrite all greetings if specific holiday
if (holidaysByDate[holidayKeyDate]) {
	greeting = holidaysByDate[holidayKeyDate];
}

// Try/catch for color input parameter
try {
	inputArr[2].toString();
} catch(e) {
	throw new Error("Please long press the widget and add a parameter.");
}

let themeColor = new Color(inputArr[2].toString());

/* --------------- */
/* Assemble Widget */
/* --------------- */

//Top spacing
widgetHello.addSpacer(parseInt(spacing));

// Greeting label
let hello = widgetHello.addText(greeting);
hello.font = Font.boldSystemFont(42);
hello.textColor = themeColor;

// Date label
let datetext = widgetHello.addText(datefull); 
datetext.font = Font.regularSystemFont(16);
datetext.textColor = themeColor;

// Bottom Spacer
widgetHello.addSpacer();
widgetHello.setPadding(15, 7, 10, 0)

// Background image
widgetHello.backgroundImage = Image.fromFile(backgroundImageURL);

// Set widget
Script.setWidget(widgetHello);