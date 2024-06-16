const express=require('express');
const purchase=require('../controller/purchase');

const authenticate=require('../middleware/auth');
const router=express.Router();
router.get('/purchase/premium', authenticate.authenticateToken, purchase.createPurchase)
router.post('/purchase/transaction', authenticate.authenticateToken, purchase.transaction);


module.exports=router;