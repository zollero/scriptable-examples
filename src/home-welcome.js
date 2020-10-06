
const ONE_IMG_REGEX = /<img class="fp-one-imagen" src="([\S]*)"/;

const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

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

  console.log(WEATHER)


  const img = await new Request(imgUrl).loadImage();
  
  widget.backgroundImage = Image.fromFile(bgImg);

  const firstStack = widget.addStack();

  firstStack.layoutHorizontally();
  // firstStack.setPadding(15, 15, 15, 15);
  firstStack.backgroundColor = new Color('#ffffff', 0.4);
  firstStack.spacing = 20;

  const imgStack = firstStack.addStack();
  const textStack = firstStack.addStack();

  // imgStack.size = new Size(150, 100);
  textStack.size = new Size(100, 120)
  textStack.layoutVertically();
  textStack.backgroundColor = new Color('#ff0000', 0.4);
  textStack.centerAlignContent();

  const imgLine = imgStack.addImage(img);
  imgLine.imageSize = new Size(180, 120);
  imgLine.cornerRadius = 10;

  const weatherLine = textStack.addText('22°C')
  weatherLine.textColor = new Color('#ff0000');
  weatherLine.centerAlignText();

  const dateLine = textStack.addText('Monday')
  dateLine.textColor = new Color('#ffffff');
  dateLine.font = Font.italicSystemFont(10);


  widget.presentMedium();
  
  Script.setWidget(widget);
  Script.complete();
})();



