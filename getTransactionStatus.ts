import { Request, Response } from 'express';
import { Transaction } from './TransactionModel';

export const getTransactionStatus = async (req: Request, res: Response) => {
    try {
        const tn = req.params.tn;
        const transaction = await Transaction.findOne({ tn });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        return res.status(200).json({
            tn: transaction.tn,
            amount: transaction.amount,
            status: transaction.status,
            expiresAt: transaction.expiresAt
        });
    }
    catch (error) {
        console.error('Error fetching transaction status:', error);
        return res.status(500).json({ message: 'Failed to fetch transaction status' });
    }
}
