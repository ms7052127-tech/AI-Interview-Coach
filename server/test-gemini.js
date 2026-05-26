// Quick test script - run: node test-gemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODELS_TO_TRY = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro-latest',
  'gemini-pro',
  'gemini-1.0-pro',
];

async function testKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.error('❌ GEMINI_API_KEY not set in .env file!');
    process.exit(1);
  }

  console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
  console.log('🧪 Testing models...\n');

  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of MODELS_TO_TRY) {
    try {
      process.stdout.write(`Testing ${modelName}... `);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "OK" in one word only.');
      const text = result.response.text();
      console.log(`✅ WORKS! Response: "${text.trim()}"`);
      console.log(`\n🎯 USE THIS MODEL: ${modelName}`);
      console.log(`\nUpdate your gemini.js to use: '${modelName}'`);
      process.exit(0);
    } catch (err) {
      console.log(`❌ ${err.status || ''} ${err.message?.substring(0, 60)}`);
    }
  }

  console.log('\n❌ No models worked. Issues could be:');
  console.log('   1. API key is invalid or expired');
  console.log('   2. Free tier quota exhausted for today');
  console.log('   3. Billing not set up on Google Cloud project');
  console.log('\nGet a new key at: https://aistudio.google.com/app/apikey');
}

testKey();