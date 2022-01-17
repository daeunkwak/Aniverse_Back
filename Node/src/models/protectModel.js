const { pool } = require("../../../config/database");
const {logger} = require('../../../config/winston');


// Protect_list.xml (보호중), 임시보호, (보호완료) 조회API ok
async function selectProtectList() {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        const selectProtectListQuery = `
        select pl.animalImage,
               pl.animalSpecies,
               pl.animalAge
        from ProtectList pl
        `;

        // const selectProtectlistParams = [animalIdx, protectedImage, animalSpecies, animalAge,protectDateStart, protectDateEnd];
        const [selectProtectListRows] = await connection.query(
            selectProtectListQuery
        );
        connection.release();
        return selectProtectListRows;
    } catch (err){
        logger.error(`selectProtectList DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}


// 사진눌렀을시 정보조회 API ok
async function selectProtectInfo(protectListIdx) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const selectProtectInfoQuery = `
            SELECT
                pl.animalSpecies,
                pl.animalAge,
                pl.animalGender,
                pl.animalWeight,
                pl.animalNeutralization,
                pl.animalDisease,
                pl.animalVaccinated,
                pl.animalIntro,
                pl.animalImage,
                pl.protectPeriod,
                pl.protectCondition,
                c.centerName,
                c.centerAddress,
                c.centerPhoneNum
            FROM ProtectList pl left join User u on pl.userIdx = u.userIdx
                           left join Center c on u.centerName = c.centerName
            WHERE pl.protectListIdx= ?;
    `;
        const selectProtectInfoParams = [protectListIdx];
        const [selectProtectInfoRows] = await connection.query(
            selectProtectInfoQuery,
            selectProtectInfoParams
        );

        connection.release();
        return selectProtectInfoRows;
    } catch (err){
        logger.error(`selectProtectInfo DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}


// 4. 임보신청 등록 protectListIdx 뽑기
// async function selectProtectListIdx(animalIdx) {
//     try{
//         const connection = await pool.getConnection(async (conn) => conn);
//
//         const selectProtectListIdxQuery = `
//             select pl.protectListIdx
//             from ProtectList pl left join Animal a on pl.animalIdx = a.animalIdx
//             where a.animalIdx = ?;
//         `;
//
//         const selectProtectListIdxParams = [animalIdx];
//         const [selectProtectListIdxRows] = await connection.query(
//             selectProtectListIdxQuery,
//             selectProtectListIdxParams
//         );
//
//         connection.release();
//         return selectProtectListIdxRows;
//     } catch (err){
//         logger.error(`selectProtectListIdx DB Connection error\n: ${err.message}`);
//         return res.status(500).send(`Error: ${err.message}`);
//     }
// }


// 4. 임보신청 등록 API 토큰필요 ok
async function insertProtectRequest(userIdx, protectListIdx, protectComment) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        const insertProtectRequestQuery = `
            INSERT into ProtectRequest
            (userIdx, protectListIdx, protectComment)
            value ("?", "?","?");
        `;

        const insertProtectRequestParams = [userIdx, protectListIdx, protectComment];
        const [insertProtectRequestRows] = await connection.query(
            insertProtectRequestQuery,
            insertProtectRequestParams
        );
        connection.release();
        return insertProtectRequestRows;
    } catch (err){
        logger.error(`insertProtectRequest DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}


module.exports = {
    selectProtectList,
    selectProtectInfo,
    insertProtectRequest
}