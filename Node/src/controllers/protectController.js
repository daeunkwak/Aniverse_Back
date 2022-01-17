const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const jwtMiddleware = require("../../../config/jwtMiddleware");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const protectModel = require('../models/protectModel');
const { constants } = require('buffer');
const { connect } = require("http2");


/**
 * Adopt 2. 입양중/임보중/입양완료 동물 조회 ok
 * [GET] /protect/list
 */
exports.getProtectList = async function (req, res) {
    // const { status } = req.body;
    // 동물 전체 조회
    console.time('/protect/list');
    try{
        // 동물 전체 조회
        const getProtectListResult = await protectModel.selectProtectList();
        // return res.send(response(baseResponse.SUCCESS, getProtectlistResult));

        if (!getProtectListResult){
            return res.json({
                isSuccess : false
            })
        }

        console.timeEnd('/protect/list');
        res.json({
            isSuccess: true,
            getProtectListResult
            // animalIdx : getProtectlistResult[0].animalIdx,
            // animalSpecies : getProtectlistResult[0].animalSpecies,
            // animalAge : getProtectlistResult[0].animalAge,
            // protectDateStart : getProtectlistResult[0].protectDateStart,
            // protectDateEnd : getProtectlistResult[0].protectDateEnd,
            // protectImage : getProtectlistResult[0].protectImage
        });
    } catch (err){
        logger.error(`postProtectList DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};


/**
 * API No. 5 임시보호 세부화면 조회 API ok
 * [POST] /protect/info
 */
exports.getImgClick = async function (req, res) {
    try{
        console.time('/protect/info');
        const {protectListIdx} = req.body;

        // const CommentListResult = await adoptModel.selectAdoptAnimal(
        //     animalIdx, adoptListFile, animalSpecies, animalAge
        // );
        const getImgClickRows = await protectModel.selectProtectInfo(protectListIdx);

        if (!getImgClickRows){
            return res.json({
                isSuccess : false
            })
        }

        console.timeEnd('/protect/info');
        res.json({
            isSuccess: true,
            getImgClickRows
            // animalIdx : getImgClickRows[0].animalIdx,
            // centerIdx : getImgClickRows[0].centerIdx,
            // animalSpecies : getImgClickRows[0].animalSpecies,
            // animalName : getImgClickRows[0].animalName,
            // animalAge : getImgClickRows[0].animalAge,
            // animalGender : getImgClickRows[0].animalGender,
            // animalWeight : getImgClickRows[0].animalWeight,
            // animalNeutralization : getImgClickRows[0].animalNeutralization,
            // animalVaccinated : getImgClickRows[0].animalVaccinated,
            // animalDiseases : getImgClickRows[0].animalDiseases,
            // animalFind : getImgClickRows[0].animalFind,
            // animalIntro : getImgClickRows[0].animalIntro,
            // createdAt : getImgClickRows[0].createdAt,
            // status : getImgClickRows[0].status,
            // protectListIdx : getImgClickRows[0].protectListIdx,
            // updatedAt : getImgClickRows[0].updatedAt,
            // protectDateStart : getImgClickRows[0].protectDateStart,
            // protectDateEnd : getImgClickRows[0].protectDateEnd,
            // protectImage : getImgClickRows[0].protectImage

        });
    } catch (err){
        logger.error(`getImgClick DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};

/**
 * API No. 6 임보신청 업로드 API ok
 * [POST] /protect/request
 */
exports.postProtectRequest = async function (req, res) {
    console.time('protect/request');
    const {userIdx, protectListIdx, protectComment} = req.body;
    try{
        // var adoptListIdxRows = await adoptModel.selectAdoptListIdx(animalIdx);
        // console.log(adoptListIdxRows[0].adoptListIdx);
        // var adoptListIdx = adoptListIdxRows[0].adoptListIdx;
        // const postAdoptListIdx = await adoptModel.insertAdoptListIdx(adoptListIdx);
        const postProtectRequest = await protectModel.insertProtectRequest(
            userIdx, protectListIdx, protectComment
        );

        console.timeEnd('protect/request');
        res.json({
            isSuccess: true
        });

    } catch (err){
        logger.error(`postProtectRequest DB Connection error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};
