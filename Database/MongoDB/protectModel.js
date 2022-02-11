const { pool } = require("../../../config/database");
const {logger} = require('../../../config/winston');
const {PL} = require('./query.js');
let MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017';


// Protect_list.xml (보호중), 임시보호, (보호완료) 조회API
async function selectProtectList() {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        const a = await db.collection('ProtectList').find({},{animalImage:1, animalSpecies:1, animalAge :1}).toArray()

        // const a = await PL.find({},{animalSpecies:1, animalAge :1})


        // const selectProtectlistParams = [animalIdx, protectedImage, animalSpecies, animalAge,protectDateStart, protectDateEnd];
        // const [selectProtectlistRows] = await connection.query(
        //     selectProtectlistQuery
        // );
        // connection.release();
        // return selectProtectlistRows;

        console.log(`res => ${JSON.stringify(a)}`);

        return a
    }

    catch (err){
        logger.error(`selectProtectList DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}


// 사진눌렀을시 정보조회 API
async function selectProtectAnimal(animalIdx) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        var a = await db.collection('ProtectList').find({protectListIdx: animalIdx},{userIdx:0, createdAt:0, updatedAt:0, status:0 }).toArray()
        protectListUserIdx = a[0].userIdx
        var b = await db.collection('User').find({userIdx: protectListUserIdx},{userIdx:1, centerName:1,}).toArray()
        centerCenterName = b[0].centerName
        var c = await db.collection('Center').find({centerName : centerCenterName},{centerName:1, centerAddress:1, centerPhoneNum:1}).toArray()


    //     const connection = await pool.getConnection(async (conn) => conn);
    //     const selectProtectAnimalQuery = `
    //         SELECT
    //             Animal.animalIdx,
    //             Center.centerIdx,
    //             Animal.animalSpecies,
    //             Animal.animalName,
    //             Animal.animalAge,
    //             Animal.animalGender,
    //             Animal.animalWeight,
    //             Animal.animalNeutralization,
    //             Animal.animalVaccinated,
    //             Animal.animalDiseases,
    //             Animal.animalFind,
    //             Animal.animalIntro,
    //             Animal.createdAt,
    //             Animal.status,
    //             ProtectList.protectListIdx,
    //             ProtectList.updatedAt,
    //             ProtectList.protectDateStart,
    //             ProtectList.protectDateEnd,
    //             ProtectList.protectImage
    //
    //         FROM ProtectList,
    //              Animal,
    //              Center
    //
    //         WHERE Animal.animalIdx = ProtectList.animalIdx
    //           and Animal.centerIdx = Center.centerIdx and Animal.animalIdx = '?';
    // `;
        const selectProtectAnimalParams = [a,b,c];
        console.log(`res => ${JSON.stringify(selectProtectAnimalParams)}`);


        // const [selectProtectAnimalRows] = await connection.query(
        //     selectProtectAnimalQuery,
        //     selectProtectAnimalParams
        // );

        return selectProtectAnimalParams;
    } catch (err){
        logger.error(`selectProtectAnimal DB Connection error\n: ${err.message}`);

    }
    finally {
        await connection.close();
    }
}


// 4. 임보신청 등록 protectListIdx 뽑기
async function selectProtectListIdx(animalIdx) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        var a = await db.collection('AdoptList').find({animalIdx: "0"}).toArray()
        protectListAnimalIdx = a[0].animalIdx
        var b = await db.collection('ProtectList').find({animalIdx: protectListAnimalIdx},{animalIdx:1,protectListIdx:1}).toArray()

        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectProtectListIdxQuery = `
        //     select pl.protectListIdx
        //     from ProtectList pl left join Animal a on pl.animalIdx = a.animalIdx
        //     where a.animalIdx = ?;
        // `;

        const selectProtectListIdxParams = [a,b];
        // const [selectProtectListIdxRows] = await connection.query(
        //     selectProtectListIdxQuery,
        //     selectProtectListIdxParams
        // );


        return selectProtectListIdxParams;
    } catch (err){
        logger.error(`selectProtectListIdx DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}


// 4. 임보신청 등록 API 토큰필요
async function insertProtectRequestInfo(protectListIdx, userIdx, contactName, contactNum, protectComment) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);

        // const insertProtectRequestInfoQuery = `
        //     INSERT into ProtectRequest
        //     (protectListIdx, userIdx, contactName, contactNum, protectComment)
        //     value ("?", "?","?", "?", "?");
        // `;
        var a = await db.collection('ProtectRequest').insertOne({ protectListIdx : protectListIdx, userIdx : userIdx, protectComment: protectComment})

        return a;
    } catch (err){
        logger.error(`insertProtectRequestInfo DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}


module.exports = {
    selectProtectList,
    selectProtectAnimal,
    selectProtectListIdx,
    insertProtectRequestInfo
}