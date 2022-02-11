const { pool } = require("../../../config/database");
const {logger} = require('../../../config/winston');
let MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017';

// 1. 회원가입 API
async function insertUserInfo(userId, userAmmo, userPhoneNum, userName) {
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try {
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
       var a = await db.collection('Product').find({},{productImage:1, productIdx:1}).sort({createdAt:-1})
    }
    catch (err){
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

        var a = await db.collection('DonateJelly').find({userIdx: userIdx},{userIdx :1, fundingIdx:1}).toArray()
        fundingFundingIdx = a[0].fundingIdx
        var b = await db.collection('Funding').find({fundingIdx :fundingFundingIdx},{fundingName :1, fundingImage:1}).toArray()

        const selectMypageRows = [a,b]
        return selectMypageRows;

    }
    catch (err){
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

        var a = await db.collection('User').find({userIdx: userIdx},{userId :1}).toArray()
        return a;
    }
    catch (err){
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

        var a = await db.collection('PurchaseProduct').find({userIdx: userIdx},{userIdx:1, productIdx :1, productAmount:1}).toArray()
        productProductIdx = a[0].productIdx
        var b = await db.collection('Product').find({productIdx: productProductIdx},{productName:1, productIdx :1, productPrice:1,productImage:1,productIntro:1,categoryIdx:1 }).toArray()
        categoryCategoryIdx = b[0].categoryIdx
        var c = await db.collection('Category').find({categoryIdx: categoryCategoryIdx},{categoryName:1, categoryIdx :1}).toArray()

        const mypageProductRows = [a,b,c]
        return mypageProductRows
    }
    catch (err){
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

        var a = await db.collection('Market').find({userIdx: userIdx},{userIdx:1}).toArray()
        productUserIdx = a[0].userIdx
        var b = await db.collection('Product').find({userIdx: productUserIdx},{productName:1, productPrice:1, productImage:1, productIdx:1 }).toArray()

        const mypageProductRows = [a,b]
        return mypageProductRows;

    }
    catch (err){
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

        var a = await db.collection('AdoptRequest').find({userIdx:userIdx , status:"S"},{userIdx:1, adoptListIdx:1, status :1,adoptDate:1,adoptRequestIdx:1  }).toArray()
        adoptListadoptListIdx = a[0].adoptListIdx
        var b = await db.collection('AdoptList').find({adoptListIdx: adoptListadoptListIdx},{animalIdx:1, adoptListIdx :1, animalName :1, animalAge:1, animalSpecies:1}).toArray()
        adoptAnimalFileAdoptListIdx = b[0].adoptListIdx
        animalAnimalIdx = b[0].animalIdx
        var c = await db.collection('AdoptAnimalFile').find({adoptListIdx: adoptAnimalFileAdoptListIdx},{adoptListIdx :1, adoptListFile :1}).toArray()


        const mypageAdoptRows = [a,b,c]
        return mypageAdoptRows;

    }
    catch (err){
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
        var a = await db.collection('ProtectRequest').find({userIdx : userIdx, status : "S"},{userIdx:1, status:1, protectListIdx:1}).toArray()
        plId = a[0].protectListIdx
        var b = await db.collection('ProtectList').find({protectListIdx: plId},{protectDateStart:1, protectDateEnd:1, protectListIdx:1, animalIdx:1,protectImage:1}).toArray()
        aniId = b[0].animalIdx
        var c = await db.collection('AdoptList').find({animalIdx: aniId},{animalName:1, animalAge:1, animalSpecies:1, animalIdx:1}).toArray()

        const mypageProtectRows = [a,b,c]
        return mypageProtectRows;

    }
    catch (err){
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
        var a = await db.collection('AdoptList').find({userIdx: userIdx},{userIdx:1, animalIdx  :1, status :1,animalName:1, animalAge:1, animalSpecies:1 }).toArray()
        adoptAnimalFileadoptListIdx = a[0].adoptListIdx
        var b = await db.collection('AdoptAnimalFile').find({adoptListIdx : adoptAnimalFileadoptListIdx},{adoptListIdx:1, adoptListFile:1}).toArray()

        const mypageProtectRows = [a,b,c]
        return mypageProtectRows;
    }
    catch (err){
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
        var a = await db.collection('ProtectList').find({userIdx: userIdx},{userIdx:1, protectImage  :1, protectDateStart :1, protectDateEnd:1,status:1,protectListIdx:1  }).toArray()
        animalAnimalIdx = a[0].animalIdx
        var b = await db.collection('AdoptList').find({animalIdx :animalAnimalIdx },{animalName:1, animalAge  :1, animalSpecies :1, animalIdx :1 }).toArray()

        const mypageProtectRows = [a,b]
        return mypageProtectRows;

    }
    catch (err){
        logger.error(`selectMypageProtect DB Connection error\n: ${err.message}`);
    }finally {
        await connection.close();
    }

}

// mypage funding -> 일반유저입장 펀딩중
async function selectMypageFundingUM(userIdx){
    let connection = await MongoClient.connect(connectionString);
    let db = connection.db('hy')
    try{
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
    }
    catch (err){
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
        var a = await db.collection('Funding').find({userIdx : userIdx,status: "Y" },{userIdx:1,fundingName:1,fundingImage:1 }).toArray()
        return a;
    }
    catch (err){
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
        var a = await db.collection('Funding').find({fundingIdx: userIdx},{fundingIdx:1,fundingName:1,fundingImage:1,fundingPurpose:1 }).toArray()
        return a;
    }
    catch (err){
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
