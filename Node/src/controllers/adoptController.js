const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const jwtMiddleware = require("../../../config/jwtMiddleware");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const fs = require('fs');
const AWS = require('aws-sdk');
const BUCKET_NAME = 'bucket-54ci7a'
AWS.config.update({
    region:         'ap-northeast-2',
    accessKeyId:    'AKIA5EBOKBSTDY76LWTZ',
    secretAccessKey:'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'
})

const adoptModel = require('../models/adoptModel');
const { constants } = require('buffer');
const {connect} = require("http2");



/**
 * Adopt 1. 입양신청위한 동물 정보 업로드 API
 * [POST] /adopt/animalinfo
 */
exports.postAdoptAniamlInfo = async function (req, res) {

    try {
        console.time('/adopt/animalinfo');

        const {animalImage, animalGender, animalSpecies, animalAge,
            animalVaccinated, animalDisease, animalFind, animalIntro,
            adoptEnd, adoptCondition, animalWeight} = req.body;
        console.log(animalImage, animalGender, animalSpecies, animalAge,
            animalVaccinated, animalDisease, animalFind, animalIntro,
            adoptEnd, adoptCondition, animalWeight);

        const insertAdoptInfoRows =
            await adoptModel.insertAdoptInfo(animalImage, animalGender, animalSpecies, animalAge,
                animalVaccinated, animalDisease, animalFind, animalIntro,
                adoptEnd, adoptCondition, animalWeight);

        console.timeEnd('/adopt/animalinfo');
        res.json({
            isSuccess: true
        });

    } catch (err){
        logger.error(`postAnimalInfo DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};


/**
 * Adopt 1.2 사진 업로드 test API
 * [POST] /adopt/imagetest
 */
exports.postImage = async function (req, res) {
    function base64_encode(file) {
        // 바이너리 데이터 읽기 file 에는 파일의 경로를 지정
        var bitmap = fs.readFileSync(file);
        //바이너리 데이터를 base64 포멧으로 인코딩하여 스트링 획등
        return new Buffer(bitmap).toString('base64');
    }

    // base64포멧의 스트링을 디코딩하여 파일로 쓰는 함수
    function base64_decode(base64str, file) {
        // 버퍼 객체를 만든후 첫번째 인자로 base64 스트링, 두번째 인자는 파일 경로를 지정 파일이름만 있으면 프로젝트 root에 생성
        var bitmap = new Buffer(base64str, 'base64');
        // 버퍼의 파일을 쓰기
        fs.writeFileSync(file, bitmap);
    }

    try {
        console.time('/adopt/imagetestt');

        const {animalImage, animalGender, animalSpecies, animalAge,
            animalVaccinated, animalDisease, animalFind, animalIntro,
            adoptEnd, adoptCondition, animalWeight} = req.body;

        // type check
        console.log('animalImageType : ', typeof (animalImage)); // string

        var filename = animalSpecies + animalAge;
        console.log('filename : ', filename);

        var filepath = 'filefile/' + filename + '.jpg';
        console.log('filepath : ', filepath);
        base64_decode(animalImage, filepath);

        const imageStream = fs.createReadStream(filepath);
        const params = { Bucket:BUCKET_NAME, Key:filename, Body:imageStream, ContentType: 'image' }
        const upload = new AWS.S3.ManagedUpload({ params });
        upload.promise()

        const postImageTestRows =
            await adoptModel.insertAdoptInfo(filepath, animalGender, animalSpecies, animalAge,
                animalVaccinated, animalDisease, animalFind, animalIntro,
                adoptEnd, adoptCondition, animalWeight);

        console.timeEnd('/adopt/imagetestt');
        res.json({
            isSuccess: true
        });

    } catch (err){
        logger.error(`postImagTeste DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};


/**
 * Adopt 2. 입양중/임보중/입양완료 동물 조회 <-> AWS storage 추가
 * [GET] /adopt/list
 */
exports.getAdoptList = async function (req, res) {
    console.time('/adopt/list');
    const {status} = req.body;
    console.log(status);

    // 동물 전체 조회
    const adoptListRows = await adoptModel.selectAdoptList(status);

    var sizee = adoptListRows.length;
    for (let i = 0; i < sizee; i++) {
        var checkk = adoptListRows[i].animalImage;
        if (checkk.charAt(0) == 'h'){
            continue;
        }
        else{
            var species = adoptListRows[i].animalSpecies;
            var age = adoptListRows[i].animalAge;
            var filename = species + age;
            adoptListRows[i].animalImage = "https://bucket-54ci7a.s3.ap-northeast-2.amazonaws.com/" + filename;
        }
    }
    ;

    if (!adoptListRows) {
        return res.json({
            isSuccess: false
        })
    }

    console.timeEnd('/adopt/list');
    return res.json({
        isSuccess: true,
        adoptListRows
    })
};



/**
 * Adopt 2.2 입양중/임보중/입양완료 동물 조회 이미지전달 -> 문자열 리턴
 * [POST] /adopt/listlist
 */
exports.getAdoptListList = async function (req, res) {
    console.time('/adopt/listlist');
    const { status } = req.body;
    console.log(status);

    function base64_encode(file) {
        // 바이너리 데이터 읽기 file 에는 파일의 경로를 지정
        var bitmap = fs.readFileSync(file);
        //바이너리 데이터를 base64 포멧으로 인코딩하여 스트링 획등
        return new Buffer(bitmap).toString('base64');
    }

    // 동물 전체 조회
    const adoptListRows = await adoptModel.selectAdoptListList(status);

    var sizee = adoptListRows.length;
    for (let i = 0; i < sizee; i++){
        var filepath = adoptListRows[i].animalImage;
        var resImage = base64_encode(filepath);
        adoptListRows[i].animalImage = resImage;
        console.log('filepath : ', filepath);
        console.log('resImage : ', resImage);
    }

    if (!adoptListRows){
        return res.json({
            isSuccess : false
        })
    }

    console.timeEnd('/adopt/listlist');
    return res.json({
        isSuccess : true,
        adoptListRows
    })
};

/**
 * Adopt 2.3 입양중/임보중/입양완료 동물 조회 이미지전달 -> 이미지파일 리턴
 * [POST] /adopt/listlist
 */
exports.getAdoptListListList = async function (req, res) {
    console.time('/adopt/listlistlist');
    const { status } = req.body;
    console.log(status);

    function base64_encode(file) {
        // 바이너리 데이터 읽기 file 에는 파일의 경로를 지정
        var bitmap = fs.readFileSync(file);
        //바이너리 데이터를 base64 포멧으로 인코딩하여 스트링 획등
        return new Buffer(bitmap).toString('base64');
    }

    // 동물 전체 조회
    const adoptListRows = await adoptModel.selectAdoptListListList(status);

    var sizee = adoptListRows.length;
    for (let i = 0; i < sizee; i++){
        var filepath = adoptListRows[i].animalImage;
        fs.readFile(filepath, function(err, data){
            res.writeHead(200, {"Content-Type": "image/jpg"});
            res.write(data);
            res.end();
        });

        adoptListRows[i].animalImage = resImage;
        console.log('filepath : ', filepath);
        console.log('resImage : ', resImage);
    }

    if (!adoptListRows){
        return res.json({
            isSuccess : false
        })
    }

    console.timeEnd('/adopt/listlistlist');
    return res.json({
        isSuccess : true,
        adoptListRows
    })
};


/**
 * Adopt 2.4 입양중/임보중/입양완료 aws test
 * [GET] /adopt/list/aws
 */
exports.getAdoptListAws = async function (req, res) {
    console.time('/adopt/list/aws');
    const {status} = req.body;
    console.log(status);

    // 동물 전체 조회
    const adoptListRows = await adoptModel.selectAdoptList(status);

    var sizee = adoptListRows.length;
    for (let i = 0; i < sizee; i++) {
        var checkk = adoptListRows[i].animalImage;
        if (checkk.charAt(0) == 'h'){
            continue;
        }
        else{
            var species = adoptListRows[i].animalSpecies;
            var age = adoptListRows[i].animalAge;
            var filename = species + age;
            adoptListRows[i].animalImage = "https://bucket-54ci7a.s3.ap-northeast-2.amazonaws.com/" + filename;
        }
    }
    ;

    if (!adoptListRows) {
        return res.json({
            isSuccess: false
        })
    }

    console.timeEnd('/adopt/list/aws');
    return res.json({
        isSuccess: true,
        adoptListRows
    })
};





/**
 * Adopt 3. 사진눌렀을시 정보조회 API ok
 * [GET] /app/adopt/getImgClick
 */
exports.getImgClick = async function (req, res) {
    console.time('/adopt/getImgClick');
    const { adoptListIdx } = req.body;
    try{
        const AdoptListResult = await adoptModel.selectAdoptAnimal(adoptListIdx);

        if (!AdoptListResult){
            return res.json({
                isSuccess : false
            })
        }

        console.timeEnd('/adopt/getImgClick');
        return res.json({
            isSuccess: true,
            AdoptListResult
        });
    } catch (err){
        logger.error(`getImgClick DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};


/**
 * Adopt 4. 입양신청글 작성 API 토큰필요 ok
 * [POST] /adopt/request
 */
exports.postAdoptRequest = async function (req, res) {
    console.time('adopt/request');
    const {userIdx, adoptListIdx, adoptComment} = req.body;
    try{
        // var adoptListIdxRows = await adoptModel.selectAdoptListIdx(animalIdx);
        // console.log(adoptListIdxRows[0].adoptListIdx);
        // var adoptListIdx = adoptListIdxRows[0].adoptListIdx;
        // const postAdoptListIdx = await adoptModel.insertAdoptListIdx(adoptListIdx);
        const postAdoptRequest = await adoptModel.insertAdoptRequest(
            userIdx, adoptListIdx, adoptComment
        );

        console.timeEnd('adopt/request');
        res.json({
            isSuccess: true
        });

    } catch (err){
        logger.error(`postAdoptUser DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};


/**
 * Adopt 5. 입양 모니터링 작성 API ok?
 * [POST] /adopt/review
 */
// 변수개수를 동적으로 받자
// 1. 리뷰글작성 -> 리뷰글 인덱스 생성
// 2. 인덱스 뽑아오기
// 3. 뽑아온 리뷰글에 파일 추가

// 파일을 추가할 때 리뷰글 인덱스를 쓰지말고 request를 사용??
exports.postReview = async function (req, res) {
    const {adoptRequestIdx, adoptReviewText,
        adoptReviewFile1, adoptReviewFile2, adoptReviewFile3, adoptReviewFile4, adoptReviewFile5} = req.body;

    var fileArrayCheck = [adoptReviewFile1, adoptReviewFile2, adoptReviewFile3, adoptReviewFile4, adoptReviewFile5];
    var fileArray = [];

    for (let i = 0; i < 5; i++){
        if (fileArrayCheck[i] != null){
            fileArray.push(fileArrayCheck[i]);
        }
    }
    var fileArrayLength = fileArray.length;

    try{
        // 1. 입양 모니터링글 작성
        const resultRows = adoptModel.insertAdoptReview(adoptRequestIdx, adoptReviewText);
        // 2. 작성한 모니터링글 인덱스 가져오기
        const adoptReviewIdx = adoptModel.selectAdoptReviewIdx(adoptRequestIdx);
        // 3. 해당 글에 파일들 첨부
        for (let i = 0; i < fileArrayLength; i++){
            console.log(fileArray[i]);
            const resultFileRows = adoptModel.insertAdoptReviewFile(adoptReviewIdx, fileArray[i]);
        }

        res.json({
            isSuccess: true,
            fileArray
        });

    } catch (err){
        logger.error(`postReview DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};



/**
 * Adopt 6. 입양후기글 조회 API
 * [GET] /adopt/review'
 */
// exports.getAdoptList = async function (req, res) {
//     console.time('/adopt/review');
//     const { status } = req.body;
//     console.log(status);
//
//     // 동물 전체 조회
//     const adoptListRows = await adoptModel.selectAdoptList(status);
//
//     if (!adoptListRows){
//         return res.json({
//             isSuccess : false
//         })
//     }
//     console.timeEnd('/adopt/list');
//     return res.json({
//         isSuccess : true,
//         adoptListRows
//     })
// };








