 
const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const http = require('http');

// إعداد التوكن والمفتاح من البيئة
const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

bot.start((ctx) => ctx.reply('مرحباً! أنا جاهز، كيف يمكنني مساعدتك؟'));

bot.on('text', async (ctx) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(ctx.message.text);
    const response = await result.response;
    ctx.reply(response.text());
  } catch (error) {
    ctx.reply('حدث خطأ، يرجى التأكد من مفاتيح الإعدادات.');
  }
});

// هذا الجزء هو الحل لمشكلة الـ Timeout على Render
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running!');
});
server.listen(process.env.PORT || 3000);

bot.launch();
