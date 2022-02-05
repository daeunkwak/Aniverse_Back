module.exports = function(app){
    const adopt = require('../controllers/adoptController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 입양 동물 정보 업로드 API
    app.post('/adopt/animalinfo', adopt.postAdoptAniamlInfo);

    // 1.2 사진 업로드 test API
    app.post('/adopt/imagetest', adopt.postImage);

    // 2. 입양중, (임시보호), 입양완료 조회 API
    app.post('/adopt/list', adopt.getAdoptList);

    // 2. 입양리스트 조회 사진 test AWS
    // app.post('/adopt/list/aws', adopt.getAdoptListAws);

    // 3. 사진눌렀을시 정보조회 API
    app.post('/adopt/imgclick', adopt.getImgClick);

    // 4. 입양신청글 업로드 API
    app.post('/adopt/request', adopt.postAdoptRequest);

    //5. 후기(모니터링)글 업로드 API
    // app.post('/adopt/review', adopt.postReview);

    //6. 후기사진 업로드 API

    //7. 후기(모니터링)글 : 검진결과, 소식 조회
    // app.get('/adopt/review', adopt.getReview);

};