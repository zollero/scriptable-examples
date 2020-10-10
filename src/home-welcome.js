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

Location.setAccuracyToHundredMeters();

const AMAP_KEY = '02f33d95d248f25fad4d99e687c38d96';
let decodeCity = `https://restapi.amap.com/v3/geocode/regeo?output=json&key=${AMAP_KEY}&radius=100&extensions=all`;
let baseWeatherUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}`;

(async () => {
  try {
    // 获取 one 当日图片
    const ONE_HOME = await new Request('http://wufazhuce.com/').loadString();
    const imgUrl = ONE_IMG_REGEX.exec(ONE_HOME)[1];

    const location = await Location.current();
    decodeCity += `&location=${location.longitude},${location.latitude}`;

    const locationInfo = await new Request(decodeCity).loadJSON();

    if (locationInfo && locationInfo.regeocode) {
      const adCode = locationInfo.regeocode.addressComponent.adcode;
      baseWeatherUrl += `&city=${adCode}`
    }

    // 获取当日天气 https://lbs.amap.com/api/webservice/guide/api/weatherinfo
    const WEATHER = await new Request(baseWeatherUrl).loadJSON();

    let weatherInfo = {};

    if (WEATHER.lives && WEATHER.lives[0]) {
      weatherInfo = WEATHER.lives[0];
    }

    const img = await new Request(imgUrl).loadImage();
    
    widget.backgroundImage = Image.fromFile(bgImg);

    const firstStack = widget.addStack();
    firstStack.layoutHorizontally();
    firstStack.centerAlignContent();
    firstStack.spacing = 10;
    firstStack.size = new Size(330, 155)

    const textStack = firstStack.addStack();
    const imgStack = firstStack.addStack();

    textStack.size = new Size(140, 140)
    textStack.layoutVertically();
    textStack.centerAlignContent();
    textStack.spacing = 12;

    const imgLine = imgStack.addImage(img);
    imgLine.imageSize = new Size(180, 120);
    imgLine.cornerRadius = 20;

    const weatherLine = textStack.addText(`        ${weatherInfo.temperature}°`)
    weatherLine.textColor = new Color('#ffffff');
    weatherLine.font = Font.mediumRoundedSystemFont(32);
    weatherLine.centerAlignText();
    weatherLine.borderWidth = 5;

    const locationLine = textStack.addText(`                ${weatherInfo.city}`);
    locationLine.font = Font.regularRoundedSystemFont(14);
    locationLine.textColor = new Color('#ffffff');

    const weekLine = textStack.addText(('0' + (current.getMonth() + 1)).substr(-2) + '-' + ('0' + current.getDate()).substr(-2) + '             ' + weekDays[current.getDay()])
    weekLine.textColor = new Color('#ffffff');
    weekLine.font = Font.mediumRoundedSystemFont(16);

    const subWeather = textStack.addStack();
    subWeather.layoutHorizontally();
    subWeather.spacing = 30;

    const weatherLine2 = subWeather.addText(weatherInfo.weather);
    weatherLine2.font = Font.regularRoundedSystemFont(14);
    weatherLine2.textColor = new Color('#ffffff');

    const windInfo = weatherInfo.winddirection + '风' + weatherInfo.windpower + '级';
    const weatherLine3 = subWeather.addText(windInfo);
    weatherLine3.font = Font.regularRoundedSystemFont(14);
    weatherLine3.textColor = new Color('#ffffff');

    widget.presentMedium();
    
    Script.setWidget(widget);
    Script.complete();

  } catch (error) {
    console.error(error);
  }
})();
