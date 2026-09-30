const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

fetch('https://api.groq.com/openai/v1/models', {
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data.data.map(m => m.id), null, 2)))
.catch(console.error);
