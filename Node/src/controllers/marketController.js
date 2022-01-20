const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const jwtMiddleware = require("../../../config/jwtMiddleware");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const marketModel = require('../models/marketModel');
const { constants } = require('buffer');
const { connect } = require("http2");

/**
 * Market 1. 마켓 메인화면 조회 API ok
 * 화면에 상품명, 상품사진
 * [GET] /market
 */
exports.getMarket = async function (req, res) {
    console.time('/market');
    const marketRows = await marketModel.selectMarket();

    if (!marketRows){
        return res.json({
            isSuccess : false
        })
    }

    console.timeEnd('/market');

    return res.json({
        isSuccess : true,
        result : marketRows
        // productIdx : marketRows[0].productIdx,
        // productImage : marketRows[0].productImage,
        // productName : marketRows[0].productName
    });
};


/**
 * Market 2. 카테고리별 상품 조회 ok
 * [POST] /market/category
 */
exports.getCategory = async function (req, res) {
    console.time('/market/category');
    const { categoryIdx } = req.body;
    try{
        const selectCategoryRows =
            await marketModel.selectCategory(categoryIdx);


        console.timeEnd('/market/category');
        if (!selectCategoryRows){
            return res.json({
                isSuccess : false
            })
        }

        res.json({
            isSuccess : true,
            result : selectCategoryRows
            // productIdx : selectCategoryRows[0].productIdx,
            // productImage : selectCategoryRows[0].productImage,
            // productName : selectCategoryRows[0].productName
        });

    } catch (err){
        logger.error(`selectCategory DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};


/**
 * Market 3. 상품 업로드 API ok
 * [POST] /market/product
 */
exports.postProduct = async function (req, res) {
    // 이미 있는 카테고리, 유저
    console.time('/market/product');
    const {
        marketIdx,
        productName,
        productIntro,
        productPrice,
        productImage,
        productJelly,
        categoryIdx
    } = req.body;

    try{
        const postProduct = await marketModel.postProduct(
            marketIdx, productName, productIntro, productPrice, productImage, productJelly, categoryIdx
        );

        console.timeEnd('/market/product');

        res.json({
            isSuccess: true
        });

    } catch (err){
        logger.error(`postProduct DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};



/**
 * Market 4. 상품 구매 API ok?
 * [POST] /market/purchase
 */
exports.purchaseProduct = async function (req, res) {
    console.time('/market/purchase');
    const {
        userIdx,
        productIdx,
        productAmount
    } = req.body;

    try {
        const productPurchaseRows = await marketModel.purchaseProduct(
            userIdx, productIdx, productAmount
        );

        console.timeEnd('/market/purchase');
        res.json({
            isSuccess: true
        });
    } catch (err){
        logger.error(`purchaseProduct DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};

