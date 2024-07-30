const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
// ===============================================================================================

const token = '6991080542:AAHSpd-TcAQ0Lu_0mqaXIHT6-cn_A6hoZJI';
const chatId = '1172848565';
const bot = new TelegramBot(token, { polling: false });

const dbPath = path.join(__dirname, '../database', 'database.db');
const backupPath = path.join(__dirname, '../database', 'backup.db');

// --------------------------------------------------------------------------------------------------
// const sendBackupToTelegram = async () => {
//     try {
//       await bot.sendDocument(chatId, backupPath);
//       console.log('Backup sent to Telegram successfully.');
//     } catch (error) {
//       console.error('Error sending backup to Telegram:', error);
//     }
//   };
  
// sendBackupToTelegram();
  

const backupAndSend = () => {
  fs.copyFile(dbPath, backupPath, (err) => {
    if (err) {
      console.error('Error creating backup:', err);
      return;
    }

    bot.sendDocument(chatId, backupPath).then(() => {
      console.log('Backup sent to Telegram successfully.');
      
        // delete backup file
        fs.unlinkSync(backupPath);
    }).catch((err) => {
      console.error('Error sending backup to Telegram:', err);
    });
  });
};

backupAndSend();
