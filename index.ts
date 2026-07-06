// const response = await fetch(`${BACKEND_URL}/webhook/payment`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     app: appPackage,
//                     tn: extractedTn,            
//                     note: messageText,         
//                     amount: cleanedAmount,
//                     timestamp: Date.now()
//                 })
//             });

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createQrOrder, webhook } from './paymentController';
import { getTransactionStatus } from './getTransactionStatus';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'https://your-frontend-domain.com'
}));


declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string | mongoose.Types.ObjectId;
            };
        }
    }
}

app.use((req: Request, res: Response, next: NextFunction) => {
    req.user = { _id: new mongoose.Types.ObjectId('60d0fe4f5311236168a109ca') };
    next();
});

app.post('/api/payment/create-qr', createQrOrder);
app.get('/api/payment/status/:tn', getTransactionStatus);
app.post('/webhook/payment', webhook);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gpaytrial';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
