const { pool } = require("../../../config/database");
const {logger} = require('../../../config/winston');


// 입양 동물정보 업로드 API
// async function insertAdoptInfo1(centerName, centerAddress, centerPhoneNum) {
//     try{
//         const connection = await pool.getConnection(async (conn) => conn);
//
//         const insertAdoptInfo1Query = `
//         INSERT into Center(centerName, centerAddress, centerPhoneNum)
//         value ("?","?","?");
//           `;
//         const  insertAdoptInfo1Params = [centerName, centerAddress, centerPhoneNum]
//         const [insertAdoptInfoRows1] = await connection.query(
//             insertAdoptInfo1Query,
//             insertAdoptInfo1Params
//         );
//
//         connection.release();
//         return insertAdoptInfoRows1;
//     } catch (err){
//         logger.error(`insertAdoptInfo1 DB Connection error\n: ${err.message}`);
//         return res.status(500).send(`Error: ${err.message}`);
//     }
// }

// async function selectCenterIdx(centerName){
//     try{
//         const connection = await pool.getConnection(async (conn) => conn);
//
//         const selectCenterQuery = `
//             SELECT Center.centerIdx
//             FROM Center
//             WHERE Center.centerName = ?;
//         `;
//
//         const  selectCenterParams = [centerName];
//         const [selectCenterRows] = await connection.query(
//             selectCenterQuery,
//             selectCenterParams
//         );
//
//         connection.release();
//         return selectCenterRows;
//     } catch (err){
//         logger.error(`selectCenter DB Connection error\n: ${err.message}`);
//         return res.status(500).send(`Error: ${err.message}`);
//     }
// }

//
// // 입양 동물정보 업로드 API
// async function insertAdoptInfo2(centerIdx, animalSpecies, animalGender, animalAge, animalVaccinated, animalDiseases, animalFind, animalIntro, animalImage) {
//     try{
//         const connection = await pool.getConnection(async (conn) => conn);
//
//         const insertAdoptInfo2Query = `
//         INSERT into Animal (centerIdx, animalSpecies, animalGender, animalAge, animalVaccinated, animalDiseases, animalFind, animalIntro, animalImage)
//         value ("?","?","?","?","?","?","?", "?", "?");
//         `;
//
//         const  insertAdoptInfo2Params = [centerIdx, animalSpecies, animalGender, animalAge, animalVaccinated, animalDiseases, animalFind, animalIntro, animalImage]
//         const [insertAdoptInfoRows2] = await connection.query(
//             insertAdoptInfo2Query,
//             insertAdoptInfo2Params
//         );
//
//         connection.release();
//         return insertAdoptInfoRows2;
//     } catch (err){
//         logger.error(`insertAdoptInfo2 DB Connection error\n: ${err.message}`);
//         return res.status(500).send(`Error: ${err.message}`);
//     }
// }
//
//
// // // 입양 동물정보 업로드 API
// async function insertAdoptInfo3(animalIdx, userIdx, adoptCondition, adoptEnd) {
//     try{
//         const connection = await pool.getConnection(async (conn) => conn);
//
//         const insertAdoptInfo3Query = `
//         INSERT into AdoptList (userIdx, adoptCondition, adoptEnd)
//         value ("?","?","?");
//         `;
//
//         const  insertAdoptInfo3Params = [userIdx, adoptEtc,AdoptDeadLine]
//         const [insertAdoptInfoRows3] = await connection.query(
//             insertAdoptInfo3Query,
//             insertAdoptInfo3Params
//         );
//
//         connection.release();
//         return insertAdoptInfoRows3;
//     } catch (err){
//         logger.error(`insertAdoptInfo3 DB Connection error\n: ${err.message}`);
//         return res.status(500).send(`Error: ${err.message}`);
//     }
// }



// 2. 입양중, (임시보호), 입양완료 조회API ok
async function selectAdoptList(status) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        const selectAdoptListQuery = `
            select AdoptList.animalImage, 
                   AdoptList.animalSpecies, 
                   AdoptList.animalAge
            from AdoptList
        `;
        selectAdoptListParams = [status];
        const [selectAdoptListRows] = await connection.query(
            selectAdoptListQuery,
            selectAdoptListParams
        );

        connection.release();
        return selectAdoptListRows;
    } catch (err){
        logger.error(`selectAdoptList DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}



// 3. 사진눌렀을시 입양디테일 조회 API ok
async function selectAdoptAnimal(adoptListIdx) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const selectAdoptAnimalQuery = `
        SELECT
            AdoptList.animalSpecies,
            AdoptList.animalAge,
            AdoptList.animalGender,
            AdoptList.animalWeight,
            AdoptList.animalNeutralization,
            AdoptList.animalDisease,
            AdoptList.animalVaccinated,
            AdoptList.animalFind,
            AdoptList.animalIntro,
            AdoptList.animalImage,
            AdoptList.adoptEnd,
            AdoptList.adoptCondition,
            Center.centerName,
            Center.centerAddress,
            Center.centerPhoneNum
        FROM AdoptList left join User on AdoptList.userIdx = User.userIdx
                       left join Center on User.centerName = Center.centerName 
        WHERE AdoptList.adoptListIdx = ?;
    `;
        const selectAdoptAnimalParams = [adoptListIdx];
        const [selectAdoptAnimalRows] = await connection.query(
            selectAdoptAnimalQuery,
            selectAdoptAnimalParams
        );
        connection.release();
        return selectAdoptAnimalRows;
    } catch (err){
        logger.error(`selectAdoptAnimal DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}


// 4. 입양신청 등록 adoptListIdx 뽑기
async function selectAdoptListIdx(animalIdx) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        const selectAdoptListIdxQuery = `
            select al.adoptListIdx
            from AdoptList al left join Animal a on al.animalIdx = a.animalIdx
            where a.animalIdx = ?;
        `;

        const selectAdoptListIdxParams = [animalIdx];
        const [selectAdoptListIdxRows] = await connection.query(
            selectAdoptListIdxQuery,
            selectAdoptListIdxParams
        );

        connection.release();
        return selectAdoptListIdxRows;
    } catch (err){
        logger.error(`selectAdoptListIdx DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}



// 4. 입양신청 등록 API adoptListIdx먼저 삽입하기
// async function insertAdoptListIdx(adoptListIdx) {
//     try{
//         const connection = await pool.getConnection(async (conn) => conn);
//
//         const insertAdoptListIdxQuery = `
//             INSERT into AdoptRequest
//             (adoptListIdx)
//             value ("?");
//         `;
//
//         const insertAdoptListIdxParams = [adoptListIdx];
//         const [insertAdoptListIdxRows] = await connection.query(
//             insertAdoptListIdxQuery,
//             insertAdoptListIdxParams
//         );
//         connection.release();
//         return insertAdoptListIdxRows;
//     } catch (err){
//         logger.error(`insertAdoptListIdx DB Connection error\n: ${err.message}`);
//         return res.status(500).send(`Error: ${err.message}`);
//     }
// }



// 4. 입양신청 등록 API 토큰필요 ok
async function insertAdoptRequest(userIdx, adoptListIdx, adoptComment) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        const insertAdoptRequestQuery = `
            INSERT into AdoptRequest
            (userIdx, adoptListIdx, adoptComment)
            value ("?", "?","?");
        `;

        const insertAdoptRequestParams = [userIdx, adoptListIdx, adoptComment];
        const [insertAdoptRequestRows] = await connection.query(
            insertAdoptRequestQuery,
            insertAdoptRequestParams
        );
        connection.release();
        return insertAdoptRequestRows;
    } catch (err){
        logger.error(`insertAdoptRequest DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}

// 5. 후기(모니터링)글 업로드1
// async function insertReview1(adoptRequestIdx, adoptReviewText) {
//     try{
//         const connection = await pool.getConnection(async (conn) => conn);
//         const insertReview1Params = [adoptRequestIdx, adoptReviewText]
//
//         const insertReview1Query = `
//         INSERT into AdoptReview (adoptRequestIdx, adoptReviewText)
//         value ("?","?");
//         `;
//
//         const [insertReview1Rows] = await connection.query(
//             insertReview1Query,
//             insertReview1Params);
//
//         connection.release();
//         return [insertReview1Rows];
//     } catch (err){
//         logger.error(`insertReview1 DB Connection error\n: ${err.message}`);
//         return res.status(500).send(`Error: ${err.message}`);
//     }
// }
//
//
// // 5. 후기(모니터링)글 업로드2
// async function insertReview2(adoptReviewIdx,adoptReviewFile) {
//     try{
//         const connection = await pool.getConnection(async (conn) => conn);
//         const insertReview2Params = [adoptReviewIdx,adoptReviewFile]
//
//         const insertReview2Query = `
//         INSERT into AdoptReviewFile (adoptReviewIdx,adoptReviewFile)
//         value ("?","?");
//         `;
//
//         const [insertReview2Rows] = await connection.query(
//             insertReview2Query,
//             insertReview2Params
//         );
//
//         connection.release();
//         return [insertReview2Rows];
//     } catch (err){
//         logger.error(`insertReview2 DB Connection error\n: ${err.message}`);
//         return res.status(500).send(`Error: ${err.message}`);
//     }
// }



module.exports = {
    // insertAdoptInfo1,
    // selectCenterIdx,
    // insertAdoptInfo2,
    // insertAdoptInfo3,
    selectAdoptList,
    selectAdoptAnimal,
    selectAdoptListIdx,
    // insertAdoptListIdx
    insertAdoptRequest
    // insertReview1,
    // insertReview2
}