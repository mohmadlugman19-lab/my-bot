const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const http = require('http');

// إعداد التوكن والمفتاح من البيئة
const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

bot.start((ctx) => ctx.reply('مرحباً! أنا جاهز، كيف يمكنني مساعدتك؟'));

bot.on('text', async (ctx) => {
  try {
    // تم التحديث لاستخدام النموذج المدعوم حالياً
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(ctx.message.text);
    const response = await result.response;
    ctx.reply(response.text());
  } catch (error) {
    ctx.reply('خطأ في الاتصال: ' + error.message);
  }
});

// فتح خادم وهمي لإرضاء متطلبات Render
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running!');
});
server.listen(process.env.PORT || 3000);

bot.launch();
