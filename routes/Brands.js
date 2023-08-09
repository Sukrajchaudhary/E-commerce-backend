const express=require('express');
const { fetchBrans, createBrans } = require('../controller/Brand');
const router=express.Router();
router.get('/',fetchBrans).post('/',createBrans);
exports.router=router