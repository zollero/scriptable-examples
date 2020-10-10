/**
 * Author: zollero
 * Github: https://github.com/zollero
 * 
 */

const ONE_IMG_REGEX = /<img class="fp-one-imagen" src="([\S]*)"/;

const current = new Date();

const weekDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];

const bgImg = '/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/bg7.PNG';

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
    firstStack.layoutVertically();

    const weatherStack = firstStack.addStack();
    weatherStack.size = new Size(330, 130);
    weatherStack.layoutHorizontally();
    weatherStack.centerAlignContent();
    weatherStack.spacing = 10;

    const calendarStack = firstStack.addStack();
    calendarStack.size = new Size(330, 170);
    calendarStack.layoutHorizontally();
    calendarStack.centerAlignContent();
    // calendarStack.backgroundColor = new Color('#fff', 0.3);
    calendarStack.spacing = 10;

    // --------------- 天气 ---------------
    const textStack = weatherStack.addStack();
    const imgStack = weatherStack.addStack();

    textStack.size = new Size(140, 140)
    textStack.layoutVertically();
    textStack.centerAlignContent();
    textStack.spacing = 12;

    const imgLine = imgStack.addImage(img);
    imgLine.imageSize = new Size(180, 120);
    imgLine.cornerRadius = 20;

    const temperatureStack = textStack.addStack();
    temperatureStack.layoutHorizontally();
    temperatureStack.addSpacer();
    const weatherLine = temperatureStack.addText(`${weatherInfo.temperature}°`)
    temperatureStack.addSpacer();
    weatherLine.textColor = new Color('#ffffff');
    weatherLine.font = Font.mediumRoundedSystemFont(32);
    weatherLine.centerAlignText();
    weatherLine.borderWidth = 5;

    const cityStack = textStack.addStack();
    cityStack.addSpacer();
    const locationLine = cityStack.addText(weatherInfo.city);
    cityStack.addSpacer();
    locationLine.font = Font.regularRoundedSystemFont(14);
    locationLine.textColor = new Color('#ffffff');

    const dateStack = textStack.addStack();
    dateStack.layoutHorizontally();
    const dateText = dateStack.addText(('0' + (current.getMonth() + 1)).substr(-2) + '-' + ('0' + current.getDate()).substr(-2));
    dateText.textColor = new Color('#ffffff');
    dateText.font = Font.mediumRoundedSystemFont(16);
    dateStack.addSpacer();
    const weekText = dateStack.addText(weekDays[current.getDay()]);
    weekText.textColor = new Color('#ffffff');
    weekText.font = Font.mediumRoundedSystemFont(16);

    const subWeather = textStack.addStack();
    subWeather.layoutHorizontally();

    const weatherLine2 = subWeather.addText(weatherInfo.weather);
    weatherLine2.font = Font.regularRoundedSystemFont(14);
    weatherLine2.textColor = new Color('#ffffff');
    subWeather.addSpacer();
    const windInfo = weatherInfo.winddirection + '风' + weatherInfo.windpower + '级';
    const weatherLine3 = subWeather.addText(windInfo);
    weatherLine3.font = Font.regularRoundedSystemFont(14);
    weatherLine3.textColor = new Color('#ffffff');

    // -------- 日历 --------
    const nextEventStack = calendarStack.addStack();
    nextEventStack.size = new Size(150, 150);
    nextEventStack.centerAlignContent();
    nextEventStack.layoutHorizontally();
    nextEventStack.cornerRadius = 10;
    nextEventStack.backgroundColor = new Color('#F3ABA5', 0.1);

    const nextEvent = nextEventStack.addStack();
    nextEvent.size = new Size(134, 120);
    // nextEvent.backgroundColor = new Color('#F3ABA5', 0.2);
    nextEvent.layoutVertically();
    nextEvent.topAlignContent();
    // nextEvent.spacing = 15;

    const nextEventLabel = nextEvent.addText('UP NEXT');
    nextEvent.addSpacer();
    nextEventLabel.font = Font.mediumRoundedSystemFont(14);
    nextEventLabel.textColor = new Color('#ff0000');

    const nextEventTitle = nextEvent.addText('记得写公众号文章，按时发布');
    nextEventTitle.font = Font.mediumRoundedSystemFont(15);
    nextEventTitle.textColor = new Color('#dddddd');

    nextEvent.addSpacer();

    const nextEventTime = nextEvent.addText('2:00 - 3:00');
    nextEventTime.font = Font.italicSystemFont(12);
    nextEventTime.textColor = new Color('#dddddd');

    const eventListStack = calendarStack.addStack();
    eventListStack.size = new Size(170, 150);
    eventListStack.layoutVertically();
    // eventListStack.backgroundColor = new Color('#0000ff', 0.2);
    eventListStack.addSpacer();
    
    for (let i = 0; i < 3; i++) {
      const eventStack = eventListStack.addStack();
      eventStack.layoutHorizontally();
      eventStack.centerAlignContent();
      eventStack.spacing = 5;
      const signStack = eventStack.addStack();
      signStack.size = new Size(8, 8)
      signStack.cornerRadius = 8;
      signStack.backgroundColor = new Color('#ff0000')
      const eventTitle =  eventStack.addText('记得写公众号文章，按时发布')
      eventTitle.font = Font.italicSystemFont(12);
      eventTitle.textColor = new Color('#eeeeee');

      eventListStack.addSpacer();
    }
    


    widget.presentLarge();
    
    Script.setWidget(widget);
    Script.complete();

  } catch (error) {
    console.error(error);
  }
})();
