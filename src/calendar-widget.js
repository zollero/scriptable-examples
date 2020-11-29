/**
 * Author: zollero
 * Github: https://github.com/zollero
 * 
 */

const ONE_STATEMENT_REGEX = /class="fp-one-cita"\>\s*<a href="(\S)*"\>([\S]*)\<\/a\>/;
const ONE_VOL_REGEX = /class="fp-one-titulo-pubdate"\>\s*\<p class="titulo"\>([\S]*)\<\/p\>/;

const current = new Date();

const bgImg = '/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/bg_bottom.PNG';

const widget = new ListWidget();
widget.url = 'calshow://';

const calendars = await Calendar.forEvents();
const calendarEvents = await CalendarEvent.today(calendars);

(async () => {
  try {
    // 获取 one 当日图片
    const ONE_HOME = await new Request('http://wufazhuce.com/').loadString();
    const statement = ONE_STATEMENT_REGEX.exec(ONE_HOME)[2];
    const oneVol = ONE_VOL_REGEX.exec(ONE_HOME)[1];

    widget.backgroundImage = Image.fromFile(bgImg);

    const firstStack = widget.addStack();
    firstStack.layoutVertically();
    firstStack.spacing = 10;

    const calendarStack = firstStack.addStack();
    calendarStack.size = new Size(330, 170);
    calendarStack.layoutHorizontally();
    calendarStack.centerAlignContent();
    calendarStack.spacing = 10;

    // -------- 日历 --------
    const nextEventStack = calendarStack.addStack();
    nextEventStack.size = new Size(150, 150);
    nextEventStack.centerAlignContent();
    nextEventStack.layoutHorizontally();
    nextEventStack.cornerRadius = 10;
    nextEventStack.backgroundColor = new Color('#F3ABA5', 0.1);

    const nextEvent = nextEventStack.addStack();
    nextEvent.size = new Size(134, 120);
    nextEvent.layoutVertically();
    nextEvent.centerAlignContent();

    const goingOnEvent = calendarEvents.find(v => !v.isAllDay && current.getTime() > new Date(v.startDate).getTime() && current.getTime() < new Date(v.endDate).getTime());
    const nextOneEvent = calendarEvents.find(v => !v.isAllDay && current.getTime() < new Date(v.startDate).getTime());
    const allDayEvent = calendarEvents.find(v => v.isAllDay);
    let currentEvent;

    if (goingOnEvent || nextOneEvent || allDayEvent) {
      const nextEventLabel = nextEvent.addText(nextOneEvent ? 'UP NEXT' : 'GOING ON');
      nextEvent.addSpacer();
      nextEventLabel.font = Font.mediumRoundedSystemFont(14);
      nextEventLabel.textColor = new Color(nextOneEvent ? '#ec407a' : '#00ff00');

      currentEvent = goingOnEvent || nextOneEvent || allDayEvent;

      const nextEventTitleStack = nextEvent.addStack();
      nextEventTitleStack.layoutVertically();
      nextEventTitleStack.spacing = 10;

      const nextEventSign = nextEventTitleStack.addStack();
      nextEventSign.size = new Size(16, 4);
      nextEventSign.cornerRadius = 3;
      nextEventSign.backgroundColor = new Color(`#${currentEvent.calendar.color.hex}`, 0.7);
  
      const nextEventTitle = nextEventTitleStack.addText(currentEvent.title);
      nextEventTitle.font = Font.mediumRoundedSystemFont(14);
      nextEventTitle.textColor = new Color(`#dddddd`);
      nextEventTitle.lineLimit = 2;

      const nextEventLocation = nextEventTitleStack.addText(currentEvent.location ? currentEvent.location: '     ');
      nextEventLocation.font = Font.regularRoundedSystemFont(12);
      nextEventLocation.textColor = new Color('#f3aba5')
  
      nextEvent.addSpacer();

      const eventStartTime = ('0' + new Date(currentEvent.startDate).getHours()).substr(-2) + ':' + ('0' + new Date(currentEvent.startDate).getMinutes()).substr(-2);
      const eventEndTime = ('0' + new Date(currentEvent.endDate).getHours()).substr(-2) + ':' + ('0' + new Date(currentEvent.endDate).getMinutes()).substr(-2);
  
      const nextEventTime = nextEvent.addText(currentEvent.isAllDay ? 'All Day' : `${eventStartTime} - ${eventEndTime}`);
      nextEventTime.font = Font.italicSystemFont(12);
      nextEventTime.textColor = new Color('#dddddd');
    } else {
      nextEvent.layoutHorizontally();
      nextEvent.addSpacer();
      const nextEventLabel = nextEvent.addText('EMPTY TODAY!')
      nextEventLabel.font = Font.mediumRoundedSystemFont(14);
      nextEventLabel.textColor = new Color('#abafcd');
      nextEvent.addSpacer();
    }

    const restEvents = calendarEvents.filter(v => currentEvent && (v.identifier !== currentEvent.identifier) && (current.getTime() < new Date(v.endDate).getTime()));

    const eventListStack = calendarStack.addStack();
    eventListStack.size = new Size(170, 120);
    eventListStack.layoutVertically();
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
      if (restEvents.length < 3) {
        eventListStack.addSpacer();
      }
    } else {
      const statementText = eventListStack.addText(statement);
      statementText.font = Font.italicSystemFont(14);
      statementText.textColor = new Color('#bbceca');

      eventListStack.addSpacer();

      const oneVolStack = eventListStack.addStack();
      oneVolStack.layoutHorizontally();
      oneVolStack.addSpacer();
      const oneVolText = oneVolStack.addText(`ONE · ${oneVol}   `);
      oneVolText.font = Font.italicSystemFont(12);
      oneVolText.textColor = new Color('#bbceca');
    }

    widget.presentMiddle();
    Script.setWidget(widget);
    Script.complete();
  } catch (error) {
    console.error(error);
  }
})();
