import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface BookingModalProps {
    mentorId: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface PaymentData {
    tn: string;
    amount: number;
    upiVpa: string;
    upiName: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ mentorId, onClose, onSuccess }) => {
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');

    // 1. Fetch QR Order details on mount
    useEffect(() => {
        const initializePayment = async () => {
            try {
                const response = await fetch('/api/payment/create-qr', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mentorId })
                });
                if (!response.ok) throw new Error('Failed to initialize payment');
                const data = await response.json();
                setPaymentData(data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        initializePayment();
    }, [mentorId]);

    useEffect(() => {
        if (!paymentData || status !== 'pending') return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/payment/status/${paymentData.tn}`);
                if (!response.ok) return;
                const data = await response.json();

                if (data.status === 'completed') {
                    setStatus('completed');
                    clearInterval(interval);
                    setTimeout(() => {
                        onSuccess();
                    }, 2000);
                } else if (data.status === 'failed') {
                    setStatus('failed');
                    clearInterval(interval);
                }
            } catch (err) {
                console.error('Error polling transaction status:', err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [paymentData, status, onSuccess]);

    if (loading) return <div className="modal-loader">Initializing secure payment...</div>;
    if (error) return <div className="modal-error">Error: {error}</div>;
    if (!paymentData) return null;

    const upiUrl = `upi://pay?pa=${encodeURIComponent(paymentData.upiVpa)}&pn=${encodeURIComponent(paymentData.upiName)}&am=${paymentData.amount}&tn=${encodeURIComponent(paymentData.tn)}&tr=${encodeURIComponent(paymentData.tn)}`;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>

                {status === 'pending' && (
                    <div className="payment-flow">
                        <h3>Scan QR to Pay</h3>
                        <p className="amount">₹{paymentData.amount}</p>

                        <div className="qr-container">
                            <QRCodeSVG value={upiUrl} size={200} />
                        </div>

                        <p className="instruction">
                            Scan this QR using any UPI app (GPay, PhonePe, Paytm).
                            Do not modify the transaction note/ref in the app.
                        </p>
                        <div className="status-indicator">
                            <span className="spinner"></span> Waiting for payment confirmation...
                        </div>
                    </div>
                )}

                {status === 'completed' && (
                    <div className="payment-success">
                        <div className="success-icon">✓</div>
                        <h3>Payment Successful!</h3>
                        <p>Your booking is confirmed.</p>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="payment-failed">
                        <div className="failed-icon">✗</div>
                        <h3>Payment Failed</h3>
                        <p>The transaction expired or failed. Please try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
