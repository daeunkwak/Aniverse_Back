const { pool } = require("../../../config/database");
const {logger} = require('../../../config/winston');
let MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017';


// 입양 동물정보 업로드 API
async function insertAdoptInfo2(animalImage, animalGender, animalSpecies, animalAge,
                                animalVaccinated, animalDisease, animalFind, animalIntro,
                                adoptEnd, adoptCondition, animalWeight) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        var a = await db.collection('AdoptList').insertOne({ animalImage : animalImage, animalGender : animalGender, animalSpecies: animalSpecies, animalAge: animalAge, animalVaccinated: animalVaccinated, animalDisease: animalDisease, animalFind: animalFind, animalIntro: animalIntro, adoptEnd: adoptEnd, adoptCondition: adoptCondition,animalWeight: animalWeight  })
        return a;
    }
    catch (err){
        logger.error(`insertAdoptInfo2 DB Connection error\n: ${err.message}`)
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
        var a = await db.collection('AdoptList').find({},{animalImage:1, animalSpecies:1,animalAge:1, adoptListIdx:1 }).toArray()
        return a;
    }
    catch (err){
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
        var a = await db.collection('AdoptList').find({adoptListIdx : adoptListIdx},{animalSpecies:1, animalAge:1, animalGender:1, animalWeight:1, animalNeutralization:1, animalDisease:1,animalVaccinated:1, animalFind:1, animalIntro:1, animalImage:1,adoptEnd:1, adoptCondition:1 }).toArray()
        adoptListUserIdx = a[0].userIdx
        var b = await db.collection('User').find({userIdx: adoptListUserIdx},{userIdx:1, centerName:1,}).toArray()
        centerCenterName = b[0].centerName
        var c = await db.collection('Center').find({centerName : centerCenterName},{centerName:1, centerAddress:1, centerPhoneNum:1}).toArray()
        const selectAdoptAnimalRows = [a,b,c]
        return selectAdoptAnimalRows;
    }
    catch (err){
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
        var a = await db.collection('AdoptList').find({animalIdx:animalIdx},{animalIdx:1, adoptListIdx:1}).toArray()
        return a;
    }
    catch (err){
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
        var a = await db.collection('AdoptRequest').insertOne({ adoptListIdx : adoptListIdx})
        return a;
    }
    catch (err){
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
        var a = await db.collection('AdoptRequest').insertOne({ userIdx : userIdx, adoptListIdx:adoptListIdx ,adoptComment: adoptComment})
        return a;
    }
    catch (err){
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
        var a = await db.collection('AdoptReview').insertOne({ adoptRequestIdx : adoptRequestIdx, adoptReviewText:adoptReviewText })
        return a;
    }
    catch (err){
        logger.error(`insertReview1 DB Connection error\n: ${err.message}`);

    }
    finally {
        await connection.close();
    }
}

// 5. 후기(모니터링)글 업로드2
async function selectAdoptReviewIdx(adoptRequestIdx) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        var a = await db.collection('AdoptReview').find({adoptRequestIdx:adoptRequestIdx}).sort({adoptRequestIdx:1}).limit(1)
        return a;
    }
    catch (err){
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
    }
    catch (err){
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
