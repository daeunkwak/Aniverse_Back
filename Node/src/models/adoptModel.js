const { pool } = require("../../../config/database");
const {logger} = require('../../../config/winston');


// 1. 입양 동물 업로드 API
async function insertAdoptInfo(animalImage, animalGender, animalSpecies, animalAge,
                               animalVaccinated, animalDisease, animalFind, animalIntro,
                               adoptEnd, adoptCondition, animalWeight) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        const insertAdoptInfoQuery = `
        INSERT into AdoptList(animalImage, animalGender, animalSpecies, animalAge,
                              animalVaccinated, animalDisease, animalFind, animalIntro,
                              adoptEnd, adoptCondition, animalWeight)
        value (?, ?,?,?,?,?,?,?,?,?,?);
          `;
        const  insertAdoptInfoParams = [animalImage, animalGender, animalSpecies, animalAge,
            animalVaccinated, animalDisease, animalFind, animalIntro,
            adoptEnd, adoptCondition, animalWeight]
        const [insertAdoptInfoRows] = await connection.query(
            insertAdoptInfoQuery,
            insertAdoptInfoParams
        );

        connection.release();
        return insertAdoptInfoRows;
    } catch (err){
        logger.error(`insertAdoptInfo DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}


// 2. 입양중, (임시보호), 입양완료 조회API ok
async function selectAdoptList(status) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        const selectAdoptListQuery = `
            select AdoptList.animalImage, 
                   AdoptList.animalSpecies, 
                   AdoptList.animalAge,
                   AdoptList.adoptListIdx
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


// 5. 후기(모니터링)글 업로드 - 1
async function insertAdoptReview(adoptRequestIdx, adoptReviewText) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const insertAdoptReviewParams = [adoptRequestIdx, adoptReviewText]

        const insertAdoptReviewQuery = `
        INSERT into AdoptReview (adoptRequestIdx, adoptReviewText)
        value ("?","?");
        `;

        const [insertAdoptReviewRows] = await connection.query(
            insertAdoptReviewQuery,
            insertAdoptReviewParams);

        connection.release();
        return [insertAdoptReviewRows];
    } catch (err){
        logger.error(`insertAdoptReview DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}


// 5. 후기(모니터링)글 업로드 - 2
async function selectAdoptReviewIdx(adoptRequestIdx){
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const selectAdoptReviewIdxParams = [adoptRequestIdx]

        const selectAdoptReviewIdxQuery = `
            select adoptReviewIdx
            from AdoptReview ar
            order by ar.adoptRequestIdx = "?"
            desc limit 1;
        `;

        const [selectAdoptReviewIdxRows] = await connection.query(
            selectAdoptReviewIdxQuery,
            selectAdoptReviewIdxParams);

        connection.release();
        return [selectAdoptReviewIdxRows];
    } catch (err){
        logger.error(`selectAdoptReviewIdx DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}

// 5. 후기(모니터링)글 업로드 - 3
async function insertAdoptReviewFile(adoptReviewIdx, filee) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const insertAdoptReviewFileParams = [adoptReviewIdx, filee]

        const insertAdoptReviewFileQuery = `
        INSERT into AdoptReviewFile (adoptReviewIdx, adoptReviewFile)
        value ("?","?")
        `;

        const [insertAdoptReviewFileRows] = await connection.query(
            insertAdoptReviewFileQuery,
            insertAdoptReviewFileParams);

        connection.release();
        return [insertAdoptReviewFileRows];
    } catch (err){
        logger.error(`insertAdoptReviewFile DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
}


module.exports = {
    insertAdoptInfo,
    selectAdoptList,
    selectAdoptAnimal,
    selectAdoptListIdx,
    insertAdoptRequest,
    insertAdoptReview,
    selectAdoptReviewIdx,
    insertAdoptReviewFile
}