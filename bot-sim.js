const fs = require('fs');

// Load menu text from file
const menuText = fs.readFileSync('./menu.txt', 'utf-8');

// Simulated user message input (change this to test others)
const testInput = '.menu'; // Change to .ai menu, .group menu, etc.

function handleMessage(body) {
  if (!body) return;

  if (body === '.menu') {
    console.log('\n📷 [Image: emex-buraun bot menu.jpg]');
    console.log(menuText);
  }

  else if (body === '.ai menu') {
    console.log('\n🤖 AI Menu:');
    console.log(`✦ .askai - Ask AI anything\n✦ .genimage - Generate image with AI`);
  }

  else if (body === '.group menu') {
    console.log('\n👥 Group Menu:');
    console.log(`✦ .antilink - Enable/disable link control\n✦ .welcome - Set welcome message`);
  }

  else {
    console.log('⚠️ Command not recognized.');
  }
}

handleMessage(testInput);
