const sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../model/user');
const ForgetPassword = require('../model/forgetpassword');

exports.sendPasswordResetEmail = async (req, res) => {
    try {
        const receiverEmail = req.body.email;
        const user = await User.findOne({ email: receiverEmail });
        const id = uuidv4();
      
        if(user){
            await ForgetPassword.create({ id, userId: user._id }); 
        }

        const client = new sib.ApiClient();
        client.authentications['api-key'].apiKey = process.env.SENGRID_API_KEY;
        const tranEmailApi = new sib.TransactionalEmailsApi(client);

        const sender = {
            email: 'varaluckky.2@gmail.com'
        };

        await tranEmailApi.sendTransacEmail({
            sender,
            to: [{ email: receiverEmail }],
            subject: 'Reset your password',
            html: `<a href="http://localhost:1280/resetpassword/${id}">Reset password</a>`
        });

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send password reset email' });
    }
};

exports.resetpassword = async (req, res) => {
    try {
        const id = req.params.id;
        const passwordRequest = await ForgetPassword.findOne({ id });
        if (!passwordRequest) {
            return res.status(404).send('Password reset request not found');
        }

        await ForgetPassword.updateOne({ id }, { isactive: false });

        res.status(200).send(`
            <html>
                <form action="/updatepassword/${id}" method="post">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button type="submit">Reset password</button>
                </form>
            </html>
        `);
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updatepassword = async (req, res) => {
    try {
        const { newpassword } = req.body;
        const { resetpasswordid } = req.params;
        
        const resetpasswordrequest = await ForgetPassword.findOne({ id: resetpasswordid });
        if (!resetpasswordrequest) {
            return res.status(404).json({ error: 'No password reset request found' });
        }
    
        const user = await User.findById(resetpasswordrequest.userId);
        if (!user) {
            return res.status(404).json({ error: 'No user found' });
        }
    
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(newpassword, salt);
    
        await user.update({ password: hash });

        res.status(201).json({ message: 'Password successfully updated' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
