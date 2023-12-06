import app from './app.js';
import dotenv from 'dotenv';
// to access .env variables
dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
