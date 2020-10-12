/**
 * Author: zollero
 * Github: https://github.com/zollero
 * 
 */

const ONE_IMG_REGEX = /<img class="fp-one-imagen" src="([\S]*)"/;
const ONE_STATEMENT_REGEX = /class="fp-one-cita"\>\s*<a href="(\S)*"\>([\S]*)\<\/a\>/;

const current = new Date();

const weekDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];

const bgImg = '/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/bg7.PNG';

const widget = new ListWidget();

const calendars = await Calendar.forEvents();
const calendarEvents = await CalendarEvent.today(calendars);

Location.setAccuracyToHundredMeters();

const AMAP_KEY = '02f33d95d248f25fad4d99e687c38d96';
let decodeCity = `https://restapi.amap.com/v3/geocode/regeo?output=json&key=${AMAP_KEY}&radius=100&extensions=all`;
let baseWeatherUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}`;

(async () => {
  try {
    // 获取 one 当日图片
    const ONE_HOME = await new Request('http://wufazhuce.com/').loadString();
    const imgUrl = ONE_IMG_REGEX.exec(ONE_HOME)[1];
    const statement = ONE_STATEMENT_REGEX.exec(ONE_HOME)[2];

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
    firstStack.spacing = 10;

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
    nextEvent.centerAlignContent();

    const goingOnEvent = calendarEvents.find(v => !v.isAllDay && current.getTime() > new Date(v.startDate).getTime() && current.getTime() < new Date(v.endDate).getTime());
    const nextOneEvent = calendarEvents.find(v => !v.isAllDay && current.getTime() < new Date(v.startDate).getTime());
    const allDayEvent = calendarEvents.find(v => v.isAllDay);
    let currentEvent;
    console.log(goingOnEvent)
    console.log(nextOneEvent)

    if (goingOnEvent || nextOneEvent || allDayEvent) {
      const nextEventLabel = nextEvent.addText(nextOneEvent ? 'UP NEXT' : 'GOING ON');
      nextEvent.addSpacer();
      nextEventLabel.font = Font.mediumRoundedSystemFont(14);
      nextEventLabel.textColor = new Color('#ff0000');

      currentEvent = goingOnEvent || nextOneEvent || allDayEvent;

      const nextEventTitleStack = nextEvent.addStack();
      nextEventTitleStack.layoutVertically();
      nextEventTitleStack.spacing = 10;

      const nextEventSign = nextEventTitleStack.addStack();
      nextEventSign.size = new Size(16, 4);
      nextEventSign.cornerRadius = 3;
      nextEventSign.backgroundColor = new Color(`#${currentEvent.calendar.color.hex}`, 0.7);
  
      const nextEventTitle = nextEventTitleStack.addText(currentEvent.title);
      nextEventTitle.font = Font.mediumRoundedSystemFont(15);
      nextEventTitle.textColor = new Color(`#dddddd`);
  
      nextEvent.addSpacer();

      const eventStartTime = ('0' + new Date(currentEvent.startDate).getHours()).substr(-2) + ':' + ('0' + new Date(currentEvent.startDate).getMinutes()).substr(-2);
      const eventEndTime = ('0' + new Date(currentEvent.endDate).getHours()).substr(-2) + ':' + ('0' + new Date(currentEvent.endDate).getMinutes()).substr(-2);
  
      const nextEventTime = nextEvent.addText(currentEvent.isAllDay ? 'All Day' : `${eventStartTime} - ${eventEndTime}`);
      nextEventTime.font = Font.italicSystemFont(12);
      nextEventTime.textColor = new Color('#dddddd');
    } else {
      const nextEventLabel = nextEvent.addText('EMPTY TODAY!')
      nextEventLabel.font = Font.mediumRoundedSystemFont(14);
      nextEventLabel.textColor = new Color('#dddddd');
    }

    const restEvents = calendarEvents.filter(v => currentEvent && (v.identifier !== currentEvent.identifier) && (current.getTime() < new Date(v.endDate).getTime()));

    const eventListStack = calendarStack.addStack();
    eventListStack.size = new Size(170, 120);
    eventListStack.layoutVertically();
    // eventListStack.topAlignContent();
    eventListStack.spacing = 15;

    if (restEvents.length > 0) {
      for (let i = 0; i < 3; i++) {
        const eventStack = eventListStack.addStack();
        if (restEvents[i]) {
          eventStack.spacing = 5;
          const signStack = eventStack.addStack();
          signStack.size = new Size(4, restEvents[i].isAllDay ? 15 : 30)
          signStack.cornerRadius = 3;
          signStack.backgroundColor = new Color(`#${restEvents[i].calendar.color.hex}`, 0.7);
  
          const eventInfo = eventStack.addStack();
          eventInfo.layoutVertically();
          const eventTitle = eventInfo.addText(restEvents[i].title)
          eventTitle.font = Font.italicSystemFont(12);
          eventTitle.textColor = new Color('#eeeeee');
          eventTitle.lineLimit = 1;
  
          if (!restEvents[i].isAllDay) {
            const eventStartTime = ('0' + new Date(restEvents[i].startDate).getHours()).substr(-2) + ':' + ('0' + new Date(restEvents[i].startDate).getMinutes()).substr(-2);
            const eventEndTime = ('0' + new Date(restEvents[i].endDate).getHours()).substr(-2) + ':' + ('0' + new Date(restEvents[i].endDate).getMinutes()).substr(-2);
            const eventTime = eventInfo.addText(restEvents[i].isAllDay ? 'All Day' : `${eventStartTime} - ${eventEndTime}`);
            eventTime.font = Font.italicSystemFont(12);
            eventTime.textColor = new Color('#dddddd');
          }
        }
      }
    } else {
      const statementText = eventListStack.addText(statement);
      statementText.font = Font.italicSystemFont(14);
      statementText.textColor = new Color('#ffffff');
    }

    widget.presentLarge();
    Script.setWidget(widget);
    Script.complete();
  } catch (error) {
    console.error(error);
  }
})();
