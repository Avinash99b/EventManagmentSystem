import dotenv from 'dotenv';
dotenv.config();
// Import the built app with explicit extension so Node ESM can resolve it after tsc
import app from './app.js';
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
