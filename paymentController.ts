import {Request, Response} from 'express';
import {Transaction} from './TransactionModel';


export const createQrOrder = async (req: Request, res: Response) => {
    try{
        const userId = req.user._id.toString();
        const tn = `user_id_${userId}_${Date.now()}`;
        const sessionAmount = 200;
        const newTransaction = await Transaction.create({
            user: userId,
            amount: sessionAmount,
            tn: tn
    });
        return res.status(200).json({
            tn: newTransaction.tn,
            amount: newTransaction.amount,
            upiVpa: process.env.MERCHANT_UPI_ID,  
            upiName: process.env.MERCHANT_UPI_NAME
          });
}catch (error) {
    console.error('Error creating QR order:', error);
        return res.status(500).json({ message: 'Failed to initialize payment' });
}   

    }



export const webhook = async (req: Request, res: Response) => {
    try{
        const { tn, note } = req.body;
        let resolvedTn = tn;
        if (!resolvedTn&&note) {
            const match = note.match(/user_id_[a-zA-Z0-9]+_\d+/);
            resolvedTn = match ? match[0] : null;
        }
        const transaction = await Transaction.findOneAndUpdate({tn: resolvedTn, status: 'pending'}, {status: 'completed'}, {new: true});
        if (!transaction) {
            return res.status(200).json({ message: 'Transaction not found or already processed' });

        }
        console.log('Transaction updated:', transaction);
        return res.status(200).json({ message: 'Transaction updated successfully' });
    }catch (error) {
        console.error('Error updating transaction:', error);
        return res.status(500).json({ message: 'Failed to update transaction' });
    }
}