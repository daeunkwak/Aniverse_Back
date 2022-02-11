const { pool } = require("../../../config/database");
const {logger} = require('../../../config/winston');
let MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017';

// 1. 회원가입 API
async function insertUserInfo(userId, userAmmo, userPhoneNum, userName) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try {
        // const connection = await pool.getConnection(async (conn) => conn);
        // try {
        //     const insertUserInfoQuery = `
        //         insert into User (userId, userAmmo, userPhoneNum, userName)
        //         values (?, ?, ?, ?);
        //     `;
        //     const insertUserInfoParams = [userId, userAmmo, userPhoneNum, userName];
        //     const insertUserInfoRow = await connection.query(
        //         insertUserInfoQuery,
        //         // userId
        //         insertUserInfoParams
        //     );
        var a = await db.collection('User').insertOne({ userId : userId, userPassword : userAmmo, userPhoneNum: userPhoneNum, userName: userName })
            return a;

    } catch (err) {
        logger.error(`InsertUserInfo DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }
}

// 2. 아이디 중복확인 API
async function userIdCheck(userId) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try {
        // const connection = await pool.getConnection(async (conn) => conn);
        // const selectIdQuery = `
        //     select exists(
        //                    select userId
        //                    from User
        //                    where userId = ? and status= 'Y') as exist;
        // `;
        // const selectIdParams = [userId];
        // const [userIdRows] = await connection.query(
        //     selectIdQuery,
        //     selectIdParams
        // );
        // connection.release();
        var a = await db.collection('User').find({userIdx : userId, status : "Y"},{userId:1}).toArray()
        return a;
    } catch (err) {
        logger.error(`CheckId DB Connection error\n: ${err.message}`);
    }
    finally {
        await connection.close();
    }
}

// 로그인 daeun
async function selectUserInfo(userId) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try {
        // const connection = await pool.getConnection(async (conn) => conn);
        // const selectUserInfoQuery = `
        //     select userId, userAmmo, userAuth, userIdx
        //     from User
        //     where userId = ? and status = 'Y';
        // `;
        //
        // const selectUserInfoParams = [userId];
        // const [userInfoRows] = await connection.query(
        //     selectUserInfoQuery,
        //     selectUserInfoParams
        // );
        var a = await db.collection('User').find({userId : userId, status : "Y"},{userId:1, userAmmo:1,userAuth:1,userIdx:1 }).toArray()
        return a;

    } catch (err) {
        logger.error(`SignIn DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }
}


// 센터이름으로 유저인덱스, 권한 뽑아오기
async function selectCenterUserInfo(centerName) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try {
        // const connection = await pool.getConnection(async (conn) => conn);
        // const selectUserInfooQuery = `
        //     select u.userIdx, u.userAuth
        //     from User u left join Center c on u.userIdx = c.userIdx
        //     where c.centerName = ?;
        // `;
        //
        // const selectCenterUserParams = [centerName];
        // const [selectCenterUserRows] = await connection.query(
        //     selectCenterUserQuery,
        //     selectCenterUserParams
        // );
        var a = await db.collection('Center').find({centerName: centerName},{userIdx:1}).toArray()
        userUserIdx = a[0].userIdx
        var b = await db.collection('User').find({userIdx: userUserIdx},{userIdx:1, userAuth:1}).toArray()
        const selectCenterUserRows = [a,b]
        return selectCenterUserRows;

    } catch (err) {
        logger.error(`selectCenterUser DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }

}
//
// // 마켓이름으로 유저인덱스, 권한 뽑아오기
async function selectMarketUserInfo(marketName) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try {
        // const connection = await pool.getConnection(async (conn) => conn);
        // const selectMarketUserQuery = `
        //     select u.userIdx, u.userAuth
        //     from User u left join Market m on u.userIdx = m.userIdx
        //     where m.marketName = ?;
        // `;
        //
        // const selectMarketUserParams = [marketName];
        // const [selectMarketUserRows] = await connection.query(
        //     selectMarketUserQuery,
        //     selectMarketUserParams
        // );
        var a = await db.collection('Market').find({marketName:marketName },{userIdx:1}).toArray()
        userUserIdx = a[0].userIdx
        var b = await db.collection('User').find({userIdx: userUserIdx},{userIdx:1, userAuth:1}).toArray()

        const selectMarketUserRows = [a,b]
        return selectMarketUserRows;

    } catch (err) {
        logger.error(`selectMarketUser DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }
}


// 인덱스로 권한 뽑아오기 daeun
async function selectUserInfoo(userIdx) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try {
        // const connection = await pool.getConnection(async (conn) => conn);
        // const selectUserInfooQuery = `
        //     select userIdx, userAuth
        //     from User
        //     where userIdx = ? and status = 'Y';
        // `;
        //
        // const selectUserInfooParams = [userIdx];
        // const [userInfooRows] = await connection.query(
        //     selectUserInfooQuery,
        //     selectUserInfooParams
        // );
        var a = await db.collection('User').find({userIdx: userIdx, status: "Y"},{userIdx:1, userAuth:1}).toArray()
        return a;

    } catch (err) {
        logger.error(`SignIn DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }
}

// 4. main화면
async function selectAdopt(){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
      //   const connection = await pool.getConnection(async (conn) => conn);
      //   const selectAdoptQuery = `
      //     select a.animalImage, a.animalIdx
      //     from Animal a;
      // `;
      //   // const selectAdoptParams = [];
      //   const [adoptRows] = await connection.query(selectAdoptQuery);
      //   return adoptRows;

        var a = await db.collection('AdoptList').find({},{animalImage:1, adoptListIdx:1}).toArray()
        return a
    } catch (err){
        logger.error(`selectAdopt DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }
}

// 4. main화면
async function selectFunding(){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
      //   const connection = await pool.getConnection(async (conn) => conn);
      //   const selectFundingQuery = `
      //       select f.fundingImage, f.fundingIdx
      //       from Funding f
      //       order by f.createdAt;
      // `;
      //
      //   const [fundingRows] = await connection.query(selectFundingQuery);
      //
      //   return fundingRows;
      //   connection.release();
        var a = await db.collection('Funding').find({},{fundingImage:1, fundingIdx:1}).sort({createdAt:-1}).toArray()
        return a
    } catch (err) {
        logger.error(`selectFunding DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }
}

// 4. main화면
async function selectMarket(){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
      //   const connection = await pool.getConnection(async (conn) => conn);
      //   const selectMarketQuery = `
      //     select p.productImage, p.productIdx
      //     from Product p
      //     order by p.createdAt;
      // `;
      //
      //   const [marketRows] = await connection.query(selectMarketQuery);
      //
      //   return marketRows;
      //   connection.release();
       var a = await db.collection('Product').find({},{productImage:1, productIdx:1}).sort({createdAt:-1})
    } catch (err){
        logger.error(`selectMarket DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }
}

// mypage
async function selectMypage(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectMypageQuery = `
        //     select f.fundingName,
        //            f.fundingImage
        //     from Funding f left join DonateJelly dj on f.fundingIdx = dj.fundingIdx
        //     where dj.userIdx = ?;
        // `;
        //
        // const selectMypageParams = [userIdx];
        // const [selectMypageRows] = await connection.query(
        //     selectMypageQuery,
        //     selectMypageParams
        // );
        var a = await db.collection('DonateJelly').find({userIdx: userIdx},{userIdx :1, fundingIdx:1}).toArray()
        fundingFundingIdx = a[0].fundingIdx
        var b = await db.collection('Funding').find({fundingIdx :fundingFundingIdx},{fundingName :1, fundingImage:1}).toArray()

        const selectMypageRows = [a,b]
        return selectMypageRows;

    } catch (err){
        logger.error(`selectMypage DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }
}

// userId 뽑기
async function selectUserId(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectUserIdQuery = `
        //     select u.userId
        //     from User u
        //     where u.userIdx = ?;
        // `;
        //
        // const selectUserIdParams = [userIdx];
        // const [selectUserIdRows] = await connection.query(
        //     selectUserIdQuery,
        //     selectUserIdParams
        // );
        var a = await db.collection('User').find({userIdx: userIdx},{userId :1}).toArray()
        return a;

    } catch (err){
        logger.error(`selectUserId DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }
}



// mypage product - 일반유저, 센터 -> 구매한 상품 조회
async function selectMypageProductUC(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectMypageProductUCQuery = `
        //     select p.productName,
        //            p.productPrice,
        //            p.productImage,
        //            c.categoryName,
        //            p.productIntro,
        //            pp.productAmount,
        //            p.productIdx
        //     from Product p left join PurchaseProduct pp on pp.productIdx = p.productIdx
        //                    left join Category c on p.categoryIdx = c.categoryIdx
        //     where pp.userIdx = ?;
        // `;
        //
        // const selectMypageProductUCParams = [userIdx];
        // const [mypageProductRows] = await connection.query(
        //     selectMypageProductUCQuery,
        //     selectMypageProductUCParams
        // );
        //
        // return mypageProductRows;
        // connection.release();
        var a = await db.collection('PurchaseProduct').find({userIdx: userIdx},{userIdx:1, productIdx :1, productAmount:1}).toArray()
        productProductIdx = a[0].productIdx
        var b = await db.collection('Product').find({productIdx: productProductIdx},{productName:1, productIdx :1, productPrice:1,productImage:1,productIntro:1,categoryIdx:1 }).toArray()
        categoryCategoryIdx = b[0].categoryIdx
        var c = await db.collection('Category').find({categoryIdx: categoryCategoryIdx},{categoryName:1, categoryIdx :1}).toArray()

        const mypageProductRows = [a,b,c]
        return mypageProductRows
    } catch (err){
        logger.error(`selectMypageProduct DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }
}

// mypage product - 마켓관리자 -> 판매상품 주문 조회
async function selectMypageProductM(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectMypageProductMQuery = `
        //   select p.productName,
        //          p.productPrice,
        //          p.productImage,
        //          p.productIdx
        //   from Product p left join Market m on m.userIdx = p.userIdx
        //   where m.userIdx = ?;
        // `;
        //
        // const selectMypageProductMParams = [userIdx];
        // const [mypageProductRows] = await connection.query(
        //     selectMypageProductMQuery,
        //     selectMypageProductMParams
        // );
        var a = await db.collection('Market').find({userIdx: userIdx},{userIdx:1}).toArray()
        productUserIdx = a[0].userIdx
        var b = await db.collection('Product').find({userIdx: productUserIdx},{productName:1, productPrice:1, productImage:1, productIdx:1 }).toArray()

        const mypageProductRows = [a,b]
        return mypageProductRows;

    } catch (err){
        logger.error(`selectMypageProduct DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }
}

// mypage adopt - 일반,마켓유저 -> 입양동물 조회
async function selectMypageAdoptUM(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectMypageAdoptUMQuery = `
        //     select a.animalName,
        //            a.animalAge,
        //            a.animalSpecies,
        //            aaf.adoptListFile,
        //            ar.adoptDate,
        //            ar.adoptRequestIdx
        //     from Animal a left join AdoptList al on a.animalIdx = al.animalIdx
        //                   left join AdoptRequest ar on ar.adoptListIdx = al.adoptListIdx
        //                   left join AdoptAnimalFile aaf on aaf.adoptListIdx = al.adoptListIdx
        //     where ar.userIdx = ? and ar.status = 'S';
        // `;
        //
        // const selectMypageAdoptUMParams = [userIdx];
        // const [mypageAdoptRows] = await connection.query(
        //     selectMypageAdoptUMQuery,
        //     selectMypageAdoptUMParams
        // );
        var a = await db.collection('AdoptRequest').find({userIdx:userIdx , status:"S"},{userIdx:1, adoptListIdx:1, status :1,adoptDate:1,adoptRequestIdx:1  }).toArray()
        adoptListadoptListIdx = a[0].adoptListIdx
        var b = await db.collection('AdoptList').find({adoptListIdx: adoptListadoptListIdx},{animalIdx:1, adoptListIdx :1, animalName :1, animalAge:1, animalSpecies:1}).toArray()
        adoptAnimalFileAdoptListIdx = b[0].adoptListIdx
        animalAnimalIdx = b[0].animalIdx
        var c = await db.collection('AdoptAnimalFile').find({adoptListIdx: adoptAnimalFileAdoptListIdx},{adoptListIdx :1, adoptListFile :1}).toArray()


        const mypageAdoptRows = [a,b,c]
        return mypageAdoptRows;

    } catch (err){
        logger.error(`selectMypageAdopt DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }
}

// mypage adopt - 일반,마켓유저 -> 임보동물 조회
async function selectMypageProtectUM(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectMypageProtectUMQuery = `
        //     select a.animalName,
        //            a.animalAge,
        //            a.animalSpecies,
        //            pl.protectImage,
        //            pl.protectDateStart,
        //            pl.protectDateEnd,
        //            pl.protectListIdx
        //     from Animal a left join ProtectList pl on a.animalIdx = pl.animalIdx
        //                   left join ProtectRequest pr on pl.protectListIdx = pr.protectListIdx
        //     where pr.userIdx = ? and pr.status = 'S';
        // `;
        //
        // const selectMypageProtectUMParams = [userIdx];
        // const [mypageProtectRows] = await connection.query(
        //     selectMypageProtectUMQuery,
        //     selectMypageProtectUMParams
        // );
        var a = await db.collection('ProtectRequest').find({userIdx : userIdx, status : "S"},{userIdx:1, status:1, protectListIdx:1}).toArray()
        plId = a[0].protectListIdx
        var b = await db.collection('ProtectList').find({protectListIdx: plId},{protectDateStart:1, protectDateEnd:1, protectListIdx:1, animalIdx:1,protectImage:1}).toArray()
        aniId = b[0].animalIdx
        var c = await db.collection('AdoptList').find({animalIdx: aniId},{animalName:1, animalAge:1, animalSpecies:1, animalIdx:1}).toArray()

        const mypageProtectRows = [a,b,c]
        return mypageProtectRows;

    } catch (err){
        logger.error(`selectMypageProtect DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }
}

// mypage adopt - 센터입장 -> 입양 업로드 조회
async function selectMypageAdoptC(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectMypageProtectUMQuery = `
        //     select a.animalName,
        //            a.animalAge,
        //            a.animalSpecies,
        //            (select aaf.adoptListFile
        //             from AdoptAnimalFile aaf limit 1),
        //            al.status,
        //            al.animalIdx
        //     from AdoptList al left join Animal a on al.animalIdx = a.animalIdx
        //                       left join AdoptAnimalFile aaf on aaf.adoptListIdx = al.adoptListIdx
        //     where al.userIdx = ?;
        // `;
        //
        // const selectMypageProtectUMParams = [userIdx];
        // const [mypageProtectRows] = await connection.query(
        //     selectMypageProtectUMQuery,
        //     selectMypageProtectUMParams
        // );
        var a = await db.collection('AdoptList').find({userIdx: userIdx},{userIdx:1, animalIdx  :1, status :1,animalName:1, animalAge:1, animalSpecies:1 }).toArray()
        adoptAnimalFileadoptListIdx = a[0].adoptListIdx
        var b = await db.collection('AdoptAnimalFile').find({adoptListIdx : adoptAnimalFileadoptListIdx},{adoptListIdx:1, adoptListFile:1}).toArray()


        const mypageProtectRows = [a,b,c]
        return mypageProtectRows;

    } catch (err){
        logger.error(`selectMypageProtect DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }
}


// mypage adopt - 센터입장 -> 임보 업로드 조회
async function selectMypageProtectC(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectMypageProtectUMQuery = `
        //     select a.animalName,
        //            a.animalAge,
        //            a.animalSpecies,
        //            pl.protectImage,
        //            pl.protectDateStart,
        //            pl.protectDateEnd,
        //            pl.status,
        //            pl.protectListIdx
        //     from ProtectList pl left join Animal a on pl.animalIdx = a.animalIdx
        //     where pl.userIdx = ?;
        // `;
        //
        // const selectMypageProtectUMParams = [userIdx];
        // const [mypageProtectRows] = await connection.query(
        //     selectMypageProtectUMQuery,
        //     selectMypageProtectUMParams
        // );
        var a = await db.collection('ProtectList').find({userIdx: userIdx},{userIdx:1, protectImage  :1, protectDateStart :1, protectDateEnd:1,status:1,protectListIdx:1  }).toArray()
        animalAnimalIdx = a[0].animalIdx
        var b = await db.collection('AdoptList').find({animalIdx :animalAnimalIdx },{animalName:1, animalAge  :1, animalSpecies :1, animalIdx :1 }).toArray()

        const mypageProtectRows = [a,b]
        return mypageProtectRows;

    } catch (err){
        logger.error(`selectMypageProtect DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }

}
//
// mypage funding -> 일반유저입장 펀딩중
async function selectMypageFundingUM(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectMypageFundingIngUMQuery = `
        //         select f.fundingName,
        //                f.fundingImage
        //         from Funding f left join DonateJelly dj on f.fundingIdx = dj.fundingIdx
        //         where dj.userIdx = ? and f.status = 'Y';
        // `;
        //
        // const selectMypageProtectUMParams = [userIdx];
        // const [mypageFundingIngRows] = await connection.query(
        //     selectMypageFundingIngUMQuery,
        //     selectMypageFundingIngUMParams
        // );
        var a = await db.collection('DonateJelly').find({userIdx: userIdx}).forEach(function(obj1){
             db.collection('Funding').find().forEach(function(obj2){
                if(obj1.fundingIdx  == obj2.fundingIdx && obj2.status == "Y"){
                    fundingFundingIdx = obj1.fundingIdx
                }
            });
        });
        var b = await db.collection('Funding').find({fundingIdx: fundingFundingIdx},{fundingIdx:1,animalIdx:1, fundingName:1, fundingImage :1}).toArray()

        const mypageFundingIngRows = [a,b]
        return mypageFundingIngRows;

    } catch (err){
        logger.error(`selectMypageFunding DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }
}

// mypage funding -> 센터입장 펀딩중
async function selectMypageFundingC(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectMypageFundingIngUMQuery = `
        //         select f.fundingName,
        //                f.fundingImage
        //         from Funding f
        //         where f.userIdx = ? and f.status = 'Y';
        // `;
        //
        // const selectMypageProtectUMParams = [userIdx];
        // const [mypageFundingIngRows] = await connection.query(
        //     selectMypageFundingIngUMQuery,
        //     selectMypageFundingIngUMParams
        // );
        var a = await db.collection('Funding').find({userIdx : userIdx,status: "Y" },{userIdx:1,fundingName:1,fundingImage:1 }).toArray()

        return a;
    } catch (err){
        logger.error(`selectMypageFunding DB Connection error\n: ${err.message}`);

    }finally {
        await connection.close();
    }
}


// mypage funding -> 일반유저입장 펀딩완료 -> 모니터링 조회 API와 동일
async function selectMypageFundingEndUM(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
        // const connection = await pool.getConnection(async (conn) => conn);
        //
        // const selectFundingEndUMQuery = `
        //     select f.fundingName,
        //            f.fundingImage,
        //            f.fundingPurpose,
        //            f.fundingIdx
        //     from Funding f
        //     where f.fundingIdx = ?;
        // `;
        //
        // const selectMypageFundingEndUMParams = [userIdx];
        // const [mypageFundingEndRows] = await connection.query(
        //     selectMypageFundingEndUMQuery,
        //     selectMypageFundingEndUMParams
        // );
        var a = await db.collection('Funding').find({fundingIdx: userIdx},{fundingIdx:1,fundingName:1,fundingImage:1,fundingPurpose:1 }).toArray()

        return a;

    } catch (err){
        logger.error(`selectMypageFunding DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }
}



module.exports = {
    insertUserInfo,
    userIdCheck,
    selectUserInfo,
    selectUserInfoo,
    selectCenterUserInfo,
    selectMarketUserInfo,
    selectAdopt,
    selectFunding,
    selectMarket,
    selectMypage,
    selectUserId,
    selectMypageProductUC,
    selectMypageProductM,
    selectMypageAdoptUM,
    selectMypageProtectUM,
    selectMypageAdoptC,
    selectMypageProtectC,
    selectMypageFundingUM,
    selectMypageFundingC
}