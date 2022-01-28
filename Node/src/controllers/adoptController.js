const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const jwtMiddleware = require("../../../config/jwtMiddleware");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const adoptModel = require('../models/adoptModel');
const { constants } = require('buffer');
const {connect} = require("http2");


/**
 * Adopt 1. 입양신청위한 동물 정보 업로드 API
 * [POST] /adopt/animalinfo
 */
// exports.postAdoptAniamlInfo = async function (req, res) {
//
//     try {
//         const {animalImage, animalSpecies, animalAge, animalWeight, animalGender,
//                animalVaccinated, animalDisease, animalFind, animalIntro, adoptEnd,
//                centerName, centerAddress, centerPhoneNum, adoptCondition} = req.body;
//
//         const insertAdoptInfoRows1 =
//             await adoptModel.insertAdoptInfo1(centerName, centerAddress, centerPhoneNum);
//
//         const insertAdoptInfoRows2 =
//             await adoptModel.insertAdoptInfo2(animalSpecies, animalGender, animalAge,
//                 animalVaccinated, animalDiseases, animalFind, animalIntro, animalImage);
//
//         const insertAdoptInfoRows3 =
//             await adoptModel.insertAdoptInfo3(contactName, contactPhoneNum, adoptComment);
//
//         // if (!insertAdoptInfoRows){
//         //     return res.json({
//         //         isSuccess : false
//         //     })
//         // }
//
//         res.json({
//             isSuccess: true
//         });
//
//     } catch (err){
//         logger.error(`postAnimalInfo DB Connection error\n: ${err.message}`);
//         return res.status(500).send(`Error: ${err.message}`);
//     }
// };



/**
 * Adopt 2. 입양중/임보중/입양완료 동물 조회 ok
 * [GET] /adopt/list
 */
exports.getAdoptList = async function (req, res) {
    console.time('/adopt/list');
    const { status } = req.body;
    console.log(status);

    // 동물 전체 조회
    const adoptListRows = await adoptModel.selectAdoptList(status);

    if (!adoptListRows){
        return res.json({
            isSuccess : false
        })
    }
    console.timeEnd('/adopt/list');
    return res.json({
        isSuccess : true,
        adoptListRows
        // animalIdx : adoptListRows[0].animalIdx,
        // animalImage : adoptListRows[0].animalImage,
        // animalSpecies : adoptListRows[0].animalSpecies,
        // animalAge : adoptListRows[0].animalAge
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
        // const {animalIdx, adoptListFile, animalSpecies, animalAge} = req.body;

        // const CommentListResult = await adoptModel.selectAdoptAnimal(
        //     animalIdx, adoptListFile, animalSpecies, animalAge
        // );
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
            // animalIdx : AdoptListResult[0].animalIdx,
            // centerIdx : AdoptListResult[0].centerIdx,
            // animalSpecies : AdoptListResult[0].animalSpecies,
            // animalName : AdoptListResult[0].animalName,
            // animalAge : AdoptListResult[0].animalAge,
            // animalGender : AdoptListResult[0].animalGender,
            // animalWeight : AdoptListResult[0].animalWeight,
            // animalNeutralization : AdoptListResult[0].animalNeutralization,
            // animalVaccinated : AdoptListResult[0].animalVaccinated,
            // animalDiseases : AdoptListResult[0].animalDiseases,
            // animalFind : AdoptListResult[0].animalFind,
            // animalIntro : AdoptListResult[0].animalIntro,
            // createdAt : AdoptListResult[0].createdAt,
            // status : AdoptListResult[0].status,
            // updatedAt : AdoptListResult[0].updatedAt,
            // animalImage : AdoptListResult[0].animalImage
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
//         // animalIdx : adoptListRows[0].animalIdx,
//         // animalImage : adoptListRows[0].animalImage,
//         // animalSpecies : adoptListRows[0].animalSpecies,
//         // animalAge : adoptListRows[0].animalAge
//     })
// };
