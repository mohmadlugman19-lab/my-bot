const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

bot.launch();
