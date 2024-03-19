import { app } from "./app.js";
import colors from 'colors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Sever is running on PORT ${PORT}`.yellow.bold);
})