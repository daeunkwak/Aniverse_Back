const { pool } = require("../../../config/database");
const {logger} = require('../../../config/winston');
let MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017';

// 1. 마켓 상품 전체 조회 API
async function selectMarket() {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        var a = await db.collection('Product').find({},{productIdx:1,productImage:1,productName:1}).toArray()
        console.log(`res => ${JSON.stringify(a)}`);
        return a;
    } catch (err){
        logger.error(`selectMarket DB Connection error\n: ${err.message}`);

    } finally {
        await connection.close();
    }
}

// 2. 카테고리별 상품 조회 API
async function selectCategory(categoryIdx) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        var a = await db.collection('Category').find({categoryIdx: categoryIdx},{categoryIdx:1}).toArray()
        productCategoryIdx = a[0].categoryIdx
        var b = await db.collection('Product').find({categoryIdx: productCategoryIdx},{categoryIdx:1, productIdx:1,productImage:1,productName:1 }).toArray()
        const selectCategoryParams = [a,b];

        return selectCategoryParams;
    } catch (err){
        logger.error(`selectCategory DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}


// 3. 상품 업로드 API
async function postProduct1(marketIdx, productName, productIntro, productPrice, productImage, productJelly,categoryIdx) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try {
        var a = await db.collection('Product').insertOne({ marketIdx: marketIdx, productName: productName, productIntro: productIntro, productPrice: productPrice, productImage: productImage,productJelly: productJelly, categoryIdx: categoryIdx})
        return a;
    } catch (err) {
        logger.error(`InsertProduct1 DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}

// 4. 상품 구매 API ok?
async function purchaseProduct(userIdx, productIdx, productAmount) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try {
        await db.collection('PurchaseProduct').insertOne({ userIdx: userIdx, productIdx: productIdx,productAmount: productAmount})
    }catch (err) {
        logger.error(`purchaseProduct DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }
}


// 3. 상품 업로드 API
// async function postProduct2(marketName, marketAddress, marketPhoneNum) {
//     try {
//         const connection = await pool.getConnection(async (conn) => conn);
//         try {
//             const insertProductQuery2 = `
//                 insert into Market (marketName, marketAddress, marketPhoneNum)
//                 values (?, ?, ?);
//             `;
//             const insertProductParams2 = [productName, productIntro, productPrice, productImage, categoryIdx];
//             const insertProductRow2 =await connection.query(
//                 insertProductQuery2,
//                 insertProductParams2
//             );
//             connection.release();
//             return insertProductRow2;
//         } catch (err){
//             connection.release();
//             // logger.error(`InsertUserInfo Transaction error\n: ${err.message}`);
//             return res.status(500).send(`Error: ${err.message}`);
//         }
//     } catch (err) {
//         logger.error(`InsertProduct2 DB Connection error\n: ${err.message}`);
//         return res.status(500).send(`Error: ${err.message}`);
//     }
// }


module.exports = {
    selectMarket,
    selectCategory,
    postProduct1,
    purchaseProduct
}
