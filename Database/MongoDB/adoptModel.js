const { pool } = require("../../../config/database");
const {logger} = require('../../../config/winston');
let MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017';

// 입양 동물정보 업로드 API
async function insertAdoptInfo1(centerName, centerAddress, centerPhoneNum) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')

    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const insertAdoptInfo1Query = `
        // INSERT into Center(centerName, centerAddress, centerPhoneNum)
        // value ("?","?","?");
        //   `;
        // const  insertAdoptInfo1Params = [centerName, centerAddress, centerPhoneNum]
        // const [insertAdoptInfoRows1] = await connection.query(
        //     insertAdoptInfo1Query,
        //     insertAdoptInfo1Params
        // );
        var a = await db.collection('Center').insertOne({ centerName : centerName, centerAddress : centerAddress, centerPhoneNum: centerPhoneNum})

        return a;
    } catch (err){
        logger.error(`insertAdoptInfo1 DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}

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
async function insertAdoptInfo2(centerIdx, animalSpecies, animalGender, animalAge, animalVaccinated, animalDiseases, animalFind, animalIntro, animalImage) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const insertAdoptInfo2Query = `
        // INSERT into Animal (centerIdx, animalSpecies, animalGender, animalAge, animalVaccinated, animalDiseases, animalFind, animalIntro, animalImage)
        // value ("?","?","?","?","?","?","?", "?", "?");
        // `;
        //
        // const  insertAdoptInfo2Params = [centerIdx, animalSpecies, animalGender, animalAge, animalVaccinated, animalDiseases, animalFind, animalIntro, animalImage]
        // const [insertAdoptInfoRows2] = await connection.query(
        //     insertAdoptInfo2Query,
        //     insertAdoptInfo2Params
        // );
        var a = await db.collection('Animal').insertOne({ centerIdx : "0", animalSpecies : "0", animalGender: "0", animalAge: "0", animalVaccinated: "0", animalDiseases: "0", animalFind: "0", animalIntro: "0", animalImage: "0"})

        return a;
    } catch (err){
        logger.error(`insertAdoptInfo2 DB Connection error\n: ${err.message}`)
    }
    finally {
        await connection.close();
    }
}
//
//
// // // 입양 동물정보 업로드 API
async function insertAdoptInfo3(userIdx, adoptCondition, adoptEnd) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try {
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const insertAdoptInfo3Query = `
        // INSERT into AdoptList (userIdx, adoptCondition, adoptEnd)
        // value ("?","?","?");
        // `;
        //
        // const  insertAdoptInfo3Params = [userIdx, adoptEtc,AdoptDeadLine]
        // const [insertAdoptInfoRows3] = await connection.query(
        //     insertAdoptInfo3Query,
        //     insertAdoptInfo3Params
        // );
        var a = await db.collection('AdoptList').insertOne({ userIdx : userIdx, adoptCondition :adoptCondition, adoptEnd: adoptEnd})


        return a;
    } catch (err) {
        logger.error(`insertAdoptInfo3 DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}



// 2. 입양중, (임시보호), 입양완료 조회API
async function selectAdoptList(status) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectAdoptListQuery = `
        //     select Animal.animalIdx,
        //            Animal.animalImage,
        //            Animal.animalSpecies,
        //            Animal.animalAge
        //     from AdoptList, Animal
        //     where Animal.animalIdx = AdoptList.animalIdx
        //       and AdoptList.status = ?;
        // `;
        // selectAdoptListParams = [status];
        // const [selectAdoptListRows] = await connection.query(
        //     selectAdoptListQuery,
        //     selectAdoptListParams
        // );
        var a = await db.collection('AdoptList').find({},{animalImage:1, animalSpecies:1,animalAge:1, adoptListIdx:1 }).toArray()

        return a;
    } catch (err){
        logger.error(`selectAdoptList DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}



// 3. 사진눌렀을시 정보조회 API
async function selectAdoptAnimal(adoptListIdx) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
    //     const connection = await pool.getConnection(async (conn) => conn);
    //     const selectAdoptAnimalQuery = `
    //     SELECT
    //         Animal.animalIdx,
    //         Center.centerIdx,
    //         Animal.animalSpecies,
    //         Animal.animalName,
    //         Animal.animalAge,
    //         Animal.animalGender,
    //         Animal.animalWeight,
    //         Animal.animalNeutralization,
    //         Animal.animalVaccinated,
    //         Animal.animalDiseases,
    //         Animal.animalFind,
    //         Animal.animalIntro,
    //         Animal.createdAt,
    //         Animal.status,
    //         Animal.animalImage,
    //         AdoptList.adoptListIdx,
    //         AdoptList.updatedAt
    //     FROM AdoptList,
    //          AdoptAnimalFile,
    //          Animal,
    //          Center
    //     WHERE Animal.animalIdx = AdoptList.animalIdx
    //       and Animal.centerIdx = Center.centerIdx
    //       and Animal.animalIdx = '?'
    // `;
    //     const selectAdoptAnimalParams = [animalIdx];
    //     const [selectAdoptAnimalRows] = await connection.query(
    //         selectAdoptAnimalQuery,
    //         selectAdoptAnimalParams
    //     );
        var a = await db.collection('AdoptList').find({adoptListIdx : adoptListIdx},{animalSpecies:1, animalAge:1, animalGender:1, animalWeight:1, animalNeutralization:1, animalDisease:1,animalVaccinated:1, animalFind:1, animalIntro:1, animalImage:1,adoptEnd:1, adoptCondition:1 }).toArray()
        adoptListUserIdx = a[0].userIdx
        var b = await db.collection('User').find({userIdx: adoptListUserIdx},{userIdx:1, centerName:1,}).toArray()
        centerCenterName = b[0].centerName
        var c = await db.collection('Center').find({centerName : centerCenterName},{centerName:1, centerAddress:1, centerPhoneNum:1}).toArray()

        const selectAdoptAnimalRows = [a,b,c]
        return selectAdoptAnimalRows;
    } catch (err){
        logger.error(`selectAdoptAnimal DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}


// 4. 입양신청 등록 adoptListIdx 뽑기
async function selectAdoptListIdx(animalIdx) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectAdoptListIdxQuery = `
        //     select al.adoptListIdx
        //     from AdoptList al left join Animal a on al.animalIdx = a.animalIdx
        //     where a.animalIdx = ?;
        // `;
        //
        // const selectAdoptListIdxParams = [animalIdx];
        // const [selectAdoptListIdxRows] = await connection.query(
        //     selectAdoptListIdxQuery,
        //     selectAdoptListIdxParams
        // );

        var a = await db.collection('AdoptList').find({animalIdx:animalIdx},{animalIdx:1, adoptListIdx:1}).toArray()

        return a;
    } catch (err){
        logger.error(`selectAdoptListIdx DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}



// 4. 입양신청 등록 API adoptListIdx먼저 삽입하기
async function insertAdoptListIdx(adoptListIdx) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const insertAdoptListIdxQuery = `
        //     INSERT into AdoptRequest
        //     (adoptListIdx)
        //     value ("?");
        // `;
        //
        // const insertAdoptListIdxParams = [adoptListIdx];
        // const [insertAdoptListIdxRows] = await connection.query(
        //     insertAdoptListIdxQuery,
        //     insertAdoptListIdxParams
        // );
        var a = await db.collection('AdoptRequest').insertOne({ adoptListIdx : adoptListIdx})
        return a;
    } catch (err){
        logger.error(`insertAdoptListIdx DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}



// 4. 입양신청 등록 API 토큰필요
async function insertAdoptRequestInfo(adoptListIdx, userIdx, adoptComment) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const insertAdoptRequestInfoQuery = `
        //     INSERT into AdoptRequest
        //     (adoptListIdx, userIdx, contactName, contactPhoneNum, adoptComment)
        //     value ("?", "?","?", "?", "?");
        // `;
        //
        // const insertAdoptRequestInfoParams = [adoptListIdx, userIdx, contactName, contactPhoneNum, adoptComment];
        // const [insertAdoptRequestInfoRows] = await connection.query(
        //     insertAdoptRequestInfoQuery,
        //     insertAdoptRequestInfoParams
        // );
         var a = await db.collection('AdoptRequest').insertOne({ userIdx : userIdx, adoptListIdx:adoptListIdx ,adoptComment: adoptComment})
        return a;
    } catch (err){
        logger.error(`insertAdoptRequestInfo DB Connection error\n: ${err.message}`);

    }
    finally {
        await connection.close();
    }
}

// 5. 후기(모니터링)글 업로드1
async function insertAdoptReview(adoptRequestIdx, adoptReviewText) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        // const insertReview1Params = [adoptRequestIdx, adoptReviewText]
        //
        // const insertReview1Query = `
        // INSERT into AdoptReview (adoptRequestIdx, adoptReviewText)
        // value ("?","?");
        // `;
        //
        // const [insertReview1Rows] = await connection.query(
        //     insertReview1Query,
        //     insertReview1Params);
        var a = await db.collection('AdoptReview').insertOne({ adoptRequestIdx : adoptRequestIdx, adoptReviewText:adoptReviewText })

        return a;
    } catch (err){
        logger.error(`insertReview1 DB Connection error\n: ${err.message}`);

    }
    finally {
        await connection.close();
    }
}
//
//
// // 5. 후기(모니터링)글 업로드2
async function selectAdoptReviewIdx(adoptRequestIdx) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        // const insertReview2Params = [adoptReviewIdx,adoptReviewFile]
        //
        // const insertReview2Query = `
        // INSERT into AdoptReviewFile (adoptReviewIdx,adoptReviewFile)
        // value ("?","?");
        // `;
        //
        // const [insertReview2Rows] = await connection.query(
        //     insertReview2Query,
        //     insertReview2Params
        // );
        var a = await db.collection('AdoptReview').find({adoptRequestIdx:adoptRequestIdx}).sort({adoptRequestIdx:1}).limit(1)

        return a;
    } catch (err){
        logger.error(`insertReview2 DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }

}
// 5. 후기(모니터링)글 업로드 - 3
async function insertAdoptReviewFile(adoptReviewIdx, filee) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        var a = await db.collection('AdoptReviewFile').insertOne({adoptReviewIdx:adoptReviewIdx,adoptReviewFile: filee })


        return a;
    } catch (err){
        logger.error(`insertAdoptReviewFile DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }
}



module.exports = {
    insertAdoptInfo1,
    // selectCenterIdx,
    insertAdoptInfo2,
    insertAdoptInfo3,
    selectAdoptList,
    selectAdoptAnimal,
    selectAdoptListIdx,
    insertAdoptListIdx,
    insertAdoptRequestInfo,
    insertAdoptReview,
    selectAdoptReviewIdx,
    insertAdoptReviewFile

}