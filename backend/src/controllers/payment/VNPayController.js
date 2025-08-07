import crypto from 'crypto';
import querystring from 'qs';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

class VNPayController {
    constructor() {
        this.vnp_TmnCode = process.env.VNP_TMN_CODE;
        this.vnp_HashSecret = process.env.VNP_HASH_SECRET;
        this.vnp_Url = process.env.VNP_URL;
        this.vnp_ReturnUrl = process.env.VNP_RETURN_URL;
    }

    payment = async (req, res) => {
        try {
            const { amount, bank_code } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount is required and must be greater than 0'
                });
            }

            const date = new Date();
            const createDate = moment(date).format('YYYYMMDDHHmmss');
            const orderId = moment(date).format('DDHHmmss');
            const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress || '127.0.0.1';

            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = this.vnp_TmnCode;
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = 'VND';
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang ${orderId}`;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100; 
            vnp_Params['vnp_ReturnUrl'] = this.vnp_ReturnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;

            if (bank_code && bank_code !== '') {
                vnp_Params['vnp_BankCode'] = bank_code;
            }

            vnp_Params = this.sortObject(vnp_Params);

            const signData = querystring.stringify(vnp_Params, { encode: false });
            
            const hmac = crypto.createHmac("sha512", this.vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;

            const paymentUrl = this.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

            return res.status(200).json({
                success: true,
                message: 'Payment URL created successfully',
                data: {
                    paymentUrl: paymentUrl,
                    orderId: orderId
                }
            });

        } catch (error) {
            console.error('Payment error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    callback = async (req, res) => {
        try {
            let vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = this.sortObject(vnp_Params);

            const signData = querystring.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac("sha512", this.vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

            if (secureHash === signed) {
                const orderId = vnp_Params['vnp_TxnRef'];
                const rspCode = vnp_Params['vnp_ResponseCode'];
                const amount = vnp_Params['vnp_Amount'] / 100; 
                const bankCode = vnp_Params['vnp_BankCode'];
                const transactionNo = vnp_Params['vnp_TransactionNo'];

                if (rspCode === '00') {
                    console.log('Payment Success:', {
                        orderId,
                        amount,
                        bankCode,
                        transactionNo
                    });
                    
                    return res.status(200).json({
                        success: true,
                        message: 'Payment successful',
                        data: {
                            orderId,
                            amount,
                            bankCode,
                            transactionNo,
                            status: 'SUCCESS'
                        }
                    });
                } else {
                    console.log('Payment Failed:', {
                        orderId,
                        rspCode,
                        amount
                    });

                    return res.status(400).json({
                        success: false,
                        message: 'Payment failed',
                        data: {
                            orderId,
                            amount,
                            responseCode: rspCode,
                            status: 'FAILED'
                        }
                    });
                }
            } else {
                console.log('Invalid signature');
                return res.status(400).json({
                    success: false,
                    message: 'Invalid signature'
                });
            }

        } catch (error) {
            console.error('Callback error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    sortObject(obj) {
        const sorted = {};
        const str = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (let key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
}

export default new VNPayController();