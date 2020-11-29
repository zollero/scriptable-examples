
/**
 * Author: zollero
 * Github: https://github.com/zollero
 * 
 */

const WEATHER_MAP = {
  '晴': '☀️',
  '少云': '🌤',
  '晴间多云': '🌤',
  '多云': '⛅️',
  '阴': '☁️',
  '有风': '🌬️',
  '强风/劲风': '🌬️',
  '疾风': '🌬️',
  '大风': '🌬️',
  '烈风': '🌬️',
  '风暴': '🌪️',
  '狂爆风': '🌪️',
  '飓风': '🌪️',
  '龙卷风': '🌪️',
  '霾': '🌫️',
  '中度霾': '🌫️',
  '重度霾': '🌫️',
  '严重霾': '🌫️',
  '雾': '🌫️',
  '浓雾': '🌫️',
  '强浓雾': '🌫️',
  '轻雾': '🌫️',
  '特强浓雾': '🌫️',
  '阵雨': '🌦️',
  '雷阵雨': '🌦️',
  '雷阵雨并伴有冰雹': '⛈️',
  '小雨': '🌧️',
  '中雨': '🌧️',
  '大雨': '🌧️',
  '暴雨': '🌧️',
  '大暴雨': '🌧️',
  '特大暴雨': '🌧️',
  '强阵雨': '⛈️',
  '强雷阵雨': '⛈️',
  '极端降雨': '🌧️',
  '毛毛雨/细雨': '🌦️',
  '雨': '🌧️',
  '小雨-中雨': '🌧️',
  '中雨-大雨': '🌧️',
  '大雨-暴雨': '⛈️',
  '暴雨-大暴雨': '⛈️',
  '大暴雨-特大暴雨': '⛈️',
  '雨雪天气': '🌨️',
  '雨夹雪': '🌨️',
  '阵雨夹雪': '🌨️',
  '冻雨': '🌨️',
  '雪': '🌨️',
  '阵雪': '🌨️',
  '小雪': '🌨️',
  '中雪': '🌨️',
  '大雪': '🌨️',
  '暴雪': '🌨️',
  '小雪-中雪': '🌨️',
  '中雪-大雪': '🌨️',
  '大雪-暴雪': '🌨️',
  '中雪-大雪': '🌨️',
  '中雪-大雪': '🌨️',
  '中雪-大雪': '🌨️',
  '中雪-大雪': '🌨️',
  '中雪-大雪': '🌨️',
};

const current = new Date();

const weekDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];

const bgImg = '/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/bg8.PNG';

const widget = new ListWidget();
widget.url = 'calshow://';

const calendars = await Calendar.forEvents();
const calendarEvents = await CalendarEvent.today(calendars);

Location.setAccuracyToHundredMeters();

const AMAP_KEY = '02f33d95d248f25fad4d99e687c38d96';
let decodeCity = `https://restapi.amap.com/v3/geocode/regeo?output=json&key=${AMAP_KEY}&radius=100&extensions=all`;
let baseWeatherUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}`;

(async () => {
  try {
    const location = await Location.current();
    const today = ('0' + (current.getMonth() + 1)).substr(-2) + '-' + ('0' + current.getDate()).substr(-2);
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

    const weatherIcon = WEATHER_MAP[weatherInfo.weather];
    widget.backgroundImage = Image.fromFile(bgImg);

    const firstStack = widget.addStack();
    firstStack.layoutVertically();
    firstStack.spacing = 10;

    const weatherStack = firstStack.addStack();
    weatherStack.size = new Size(330, 300);
    weatherStack.layoutVertically();
    // weatherStack.centerAlignContent();
    // weatherStack.spacing = 10;

    // --------------- 天气 ---------------
    const temperatureStack = weatherStack.addStack();
    temperatureStack.layoutHorizontally();
    temperatureStack.addSpacer();
    const weatherLine = temperatureStack.addText(`${weatherIcon ? weatherIcon : weatherInfo.weather}`)
    temperatureStack.addSpacer();
    weatherLine.textColor = new Color('#ffffff');
    weatherLine.font = Font.mediumRoundedSystemFont(80);
    weatherLine.centerAlignText();

    const weatherInfoStack = weatherStack.addStack();
    weatherInfoStack.layoutHorizontally();
    weatherInfoStack.addSpacer();
    const weatherInfoText = weatherInfoStack.addText(weatherInfo.weather);
    weatherInfoText.textColor = new Color('#ffffff');
    weatherInfoText.font = Font.mediumRoundedSystemFont(16);
    weatherInfoStack.addSpacer();

    weatherStack.addSpacer();

    const dateStack = weatherStack.addStack();
    dateStack.layoutHorizontally();
    dateStack.addSpacer();
    const weekText = dateStack.addText(weekDays[current.getDay()] + '      ' + today);
    weekText.textColor = new Color('#ffffff');
    weekText.font = Font.regularMonospacedSystemFont(20);
    dateStack.addSpacer();

    weatherStack.addSpacer();

    const tempStack = weatherStack.addStack();
    tempStack.layoutHorizontally();
    tempStack.centerAlignContent();
    tempStack.addSpacer();
    const temperatureText = tempStack.addText(`${weatherInfo.temperature}°`);
    temperatureText.textColor = new Color('#ffffff');
    temperatureText.font = Font.mediumMonospacedSystemFont(60);
    temperatureText.centerAlignText();
    tempStack.addSpacer();

    weatherStack.addSpacer();

    const cityStack = weatherStack.addStack();
    cityStack.layoutHorizontally();
    cityStack.addSpacer();
    const cityLine = cityStack.addText(weatherInfo.city);
    cityLine.font = Font.regularMonospacedSystemFont(20);
    cityLine.textColor = new Color('#ffffff');
    cityStack.addSpacer();

    weatherStack.addSpacer();

    widget.presentLarge();
    Script.setWidget(widget);
    Script.complete();
  } catch (error) {
    console.error(error);
  }
})();
