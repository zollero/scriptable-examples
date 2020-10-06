/**
 * Author: zollero
 * Github: https://github.com/zollero
 * 
 */

const ONE_IMG_REGEX = /<img class="fp-one-imagen" src="([\S]*)"/;

const current = new Date();

const weekDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];

const bgImg = '/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/bg6.PNG';

const widget = new ListWidget();

const baseWeatherUrl = 'https://restapi.amap.com/v3/weather/weatherInfo?key=02f33d95d248f25fad4d99e687c38d96&city=330106';

// const imgUrl = 'http://image.wufazhuce.com/FpAAJ1s7jHkilwemj5wf7fB02EJk';

(async () => {

  // 获取 one 当日图片
  const ONE_HOME = await new Request('http://wufazhuce.com/').loadString();
  const imgUrl = ONE_IMG_REGEX.exec(ONE_HOME)[1];

  // 获取当日天气
  const WEATHER = await new Request(baseWeatherUrl).loadJSON();
  /**
   * {
   *  "status":"1",
   *  "info":"OK",
   *  "count":"1",
   *  "infocode":"10000",
   *  "lives":[{
   *    "adcode":"330106",
   *    "city":"西湖区",
   *    "humidity":"49",
   *    "windpower":"≤3",
   *    "temperature":"22",
   *    "weather":"阴",
   *    "winddirection":"北",
   *    "reporttime":"2020-10-06 14:58:15",
   *    "province":"浙江"
   *   }]
   *  }
   */

  let weatherInfo = {};

  console.log(WEATHER)
  if (WEATHER.lives && WEATHER.lives[0]) {
    weatherInfo = WEATHER.lives[0];
  }

  const img = await new Request(imgUrl).loadImage();
  
  widget.backgroundImage = Image.fromFile(bgImg);

  const firstStack = widget.addStack();
  firstStack.layoutHorizontally();
  firstStack.spacing = 20;

  const textStack = firstStack.addStack();
  const imgStack = firstStack.addStack();

  textStack.size = new Size(100, 120)
  textStack.layoutVertically();
  textStack.centerAlignContent();
  textStack.spacing = 20;

  const imgLine = imgStack.addImage(img);
  imgLine.imageSize = new Size(180, 120);
  imgLine.cornerRadius = 10;

  const weatherLine = textStack.addText(`     ${weatherInfo.temperature}°`)
  weatherLine.textColor = new Color('#ffffff');
  weatherLine.font = Font.mediumRoundedSystemFont(30);
  weatherLine.centerAlignText();
  weatherLine.borderWidth = 5;

  const weekLine = textStack.addText(('0' + (current.getMonth() + 1)).substr(-2) + '-' + ('0' + current.getDate()).substr(-2) + '      ' + weekDays[current.getDay()])
  weekLine.textColor = new Color('#ffffff');
  weekLine.font = Font.mediumRoundedSystemFont(14);

  const subWeather = textStack.addStack();
  subWeather.layoutHorizontally();
  subWeather.spacing = 18;

  const weatherLine2 = subWeather.addText(weatherInfo.weather);
  weatherLine2.font = Font.regularRoundedSystemFont(12);
  weatherLine2.textColor = new Color('#ffffff');

  const windInfo = weatherInfo.winddirection + '风' + weatherInfo.windpower + '级';
  const weatherLine3 = subWeather.addText(windInfo);
  weatherLine3.font = Font.regularRoundedSystemFont(12);
  weatherLine3.textColor = new Color('#ffffff');

  widget.presentMedium();
  
  Script.setWidget(widget);
  Script.complete();
})();
