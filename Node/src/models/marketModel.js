const { pool } = require("../../../config/database");
const {logger} = require('../../../config/winston');

// 1. 마켓 상품 전체 조회 API
async function selectMarket() {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        const selectMarketQuery = `
            select p.productIdx,
                   p.productImage,
                   p.productName
            from Product p;
        `;

        const [selectMarketRows] = await connection.query(
            selectMarketQuery
        );

        connection.release();
        return selectMarketRows;
    } catch (err){
        logger.error(`selectMarket DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}

// 2. 카테고리별 상품 조회 API
async function selectCategory(categoryIdx) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        const selectMarketQuery = `
            select p.productIdx,
                   p.productImage,
                   p.productName
            from Product p left join Category c on p.categoryIdx = c.categoryIdx
            where c.categoryIdx = ?;
        `;

        const selectCategoryParams = [categoryIdx];
        const [selectCategoryRows] = await connection.query(
            selectMarketQuery,
            selectCategoryParams
        );

        connection.release();
        return selectCategoryRows;
    } catch (err){
        logger.error(`selectCategory DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}


// 3. 상품 업로드 API ok
async function postProduct(marketIdx, productName, productIntro, productPrice, productImage, productJelly, categoryIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        console.log(marketIdx, productName, productIntro, productPrice, productImage, productJelly, categoryIdx);

        try {
            const insertProductQuery = `
                insert into Product (marketIdx, productName, productIntro, productPrice, productImage, productJelly, categoryIdx)
                values (?, ?, ?, ?, ?, ?, ?);
            `;
            const insertProductParams = [marketIdx, productName, productIntro, productPrice, productImage, productJelly, categoryIdx];
            const insertProductRow = await connection.query(
                insertProductQuery,
                insertProductParams
            );
            return insertProductRow;
            connection.release();

        } catch (err){
            connection.release();
            // logger.error(`InsertUserInfo Transaction error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
    } catch (err) {
        logger.error(`InsertProduct DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}


// 4. 상품 구매 API ok?
async function purchaseProduct(userIdx, productIdx, productAmount) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        console.log(userIdx, productIdx, productAmount);

        try {
            const purchaseProductQuery = `
                insert into PurchaseProduct (userIdx, productIdx, productAmount)
                values (?, ?, ?);
            `;
            const purchaseProductParams = [userIdx, productIdx, productAmount];
            const purchaseProductRow =await connection.query(
                purchaseProductQuery,
                purchaseProductParams
            );
            return purchaseProductRow;
            connection.release();

        } catch (err){
            connection.release();
            return res.status(500).send(`Error: ${err.message}`);
        }
    } catch (err) {
        logger.error(`purchaseProduct DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
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
    postProduct,
    purchaseProduct
    // postProduct2
}