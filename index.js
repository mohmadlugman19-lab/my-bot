
c
const { Telegraf } = require('telegraf');
const http = require('http');
const fetch = require('node-fetch');

const bot = new Telegraf(process.env.BOT_TOKEN);

// معالجة الأخطاء العامة
bot.catch((err, ctx) => {
  console.error('خطأ عام:', err);
  ctx.reply('حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.');
});

// الأوامر الأساسية
bot.start((ctx) => ctx.reply('مرحباً! أنا جاهز للرد على استفساراتك.'));
bot.help((ctx) => ctx.reply('أرسل أي نص وسأرد عليك باستخدام الذكاء الاصطناعي.'));

bot.on('text', async (ctx) => {
  // التحقق من وجود نص
  if (!ctx.message.text) return ctx.reply('الرجاء إرسال نص للرد عليه.');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: ctx.message.text }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'خطأ في الاتصال بـ API');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      // التعامل مع الرسائل الطويلة وتقسيمها
      if (text.length > 4096) {
        for (let i = 0; i < text.length; i += 4096) {
          await ctx.reply(text.substring(i, i + 4096), { parse_mode: 'Markdown' });
        }
      } else {
        ctx.reply(text, { parse_mode: 'Markdown' });
      }
    } else {
      ctx.reply('لم يتمكن الذكاء الاصطناعي من توليد رد.');
    }
  } catch (error) {
    console.error('خطأ:', error.message);
    ctx.reply('خطأ تقني: ' + error.message);
  }
});

// تشغيل الخادم للمراقبة
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
});
server.listen(process.env.PORT || 3000);

// الإغلاق الآمن
process.once('SIGINT', () => { bot.stop('SIGINT'); server.close(); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); server.close(); });

bot.launch().catch(err => console.error('فشل بدء البوت:', err));
