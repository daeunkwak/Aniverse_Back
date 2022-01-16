
-- main화면 쿼리
-- 입양, 펀딩, 마켓 각각 쿼리짜자 이건 너무 연관성이 없음

-- 입양
select aaf.adoptListFile
from AdoptAnimalFile aaf
    left join AdoptList al on al.adoptListIdx = aaf.adoptListIdx
order by al.createdAt desc limit 3;

-- 펀딩
select f.fundingFile
from Funding f
order by f.createdAt desc limit 3;

-- 마켓 상품
select p.productImage
from Product p
order by p.createdAt limit 3;

-- 구매한 상품 조회 OK
select p.productName,
       p.productPrice,
       p.productImage,
       pp.createdAt
from Product p left join PurchaseProduct pp
        on pp.productIdx = p.productIdx
where pp.userIdx = ?;

-- 업로드한 상품 조회 마켓입장
select p.productName,
       p.productPrice,
       p.productImage
from Product p left join PurchaseProduct pp on pp.productIdx = p.productIdx
               left join Market m on m.marketIdx = p.marketIdx
where m.userIdx = ?;


-- 입양 동물 조회 사용자입장
select a.animalName,
       a.animalSpecies,
       aaf.adoptListFile,
       ar.adoptDate
from Animal a left join AdoptList al on a.animalIdx = al.animalIdx
              left join AdoptRequest ar on ar.adoptListIdx = al.adoptListIdx
              left join AdoptAnimalFile aaf on aaf.adoptListIdx = al.adoptListIdx
where ar.userIdx = 3 and ar.status = 'S';


-- 임보 동물 조회 사용자입장
select a.animalName,
       a.animalSpecies,
       pl.protectImage,
       pl.protectDateStart,
       pl.protectDateEnd
from Animal a left join ProtectList pl on a.animalIdx = pl.animalIdx
              left join ProtectRequest pr on pl.protectListIdx = pr.protectListIdx
where pr.userIdx = 4 and pr.status = 'S';


-- 입양 동물 조회 센터입장
select a.animalName,
       a.animalAge,
       a.animalSpecies,
       (select aaf.adoptListFile
        from AdoptAnimalFile aaf limit 1),
       al.status
from AdoptList al left join Animal a on al.animalIdx = a.animalIdx
                  left join AdoptAnimalFile aaf on aaf.adoptListIdx = al.adoptListIdx
where al.userIdx = 4;



-- 임보 동물 조회 센터입장
select a.animalName,
       a.animalAge,
       a.animalSpecies,
       pl.protectImage,
       pl.protectDateStart,
       pl.protectDateEnd
from ProtectList pl left join Animal a on pl.animalIdx = a.animalIdx
where pl.userIdx = 1;

-- 펀딩 일반유저입장
select a.animalName,
       f.fundingImage,
       f.fundingPurpose,
       dj.donateJellyNum
from Funding f left join Animal a on f.animalIdx = a.animalIdx
               left join DonateJelly DJ on f.fundingIdx = DJ.fundingIdx
where dj.userIdx = ?;


-- 펀딩 센터입장


-- 판매한 상품 주문 조회 -> 사용자 인덱스 받아와서 OK
select p.productName,
       p.productPrice,
       p.productImage,
       u.userId,
       pp.createdAt
from Product p left join PurchaseProduct pp on pp.productIdx = p.productIdx
               left join User u on pp.userIdx = u.userIdx
               left join Market m on m.marketIdx = p.marketIdx
where m.userIdx = ?;

          select p.productName,
                 p.productPrice,
                 p.productImage,
                 c.categoryName,
                 p.productIntro
          from Product p left join PurchaseProduct pp on pp.productIdx = p.productIdx
                         left join Category c on p.categoryIdx = c.categoryIdx
          where pp.userIdx = 4;

-- 펀딩리스트 조회
select f.fundingName,
       f.fundingImage,
       f.fundingPurpose
from Funding f
where f.status  = ?;

-- 펀딩중 사진 클릭 조회
select f.fundingName,
       f.fundingImage,
       f.fundingPurpose,
       f.fundingAmount,
       f.fundingReceived,
       f.fundingPeriod
from Funding f
where f.fundingIdx = ?;


-- 펀딩완료 사진 클릭 조회 -> 모니터링화면 사진 불러오기
select frf.fundingReviewFile
from FundingReviewFile f left join FundingReview fr
    on f.fundingReviewIdx = fr.fundingReviewIdx
                         left join FundingReviewFile frf
    on frf.fundingReviewIdx = fr.fundingReviewIdx
                         left join Funding f
    on f.fundingIdx = fr.fundingIdx
where f.fundingIdx = ?;

-- 펀딩 모니터링 내용 불러오기
select fr.fundingReviewText
from FundingReview fr left join Funding f
    on fr.fundingIdx = f.fundingIdx
where f.fundingIdx = ?;

-- 입양 animalIdx 연결
select al.adoptListIdx
from AdoptList al left join Animal a on al.animalIdx = a.animalIdx
where a.animalIdx = 2;


            select fr.fundingReviewIdx,
                   f.userIdx
            from FundingReview fr left join Funding f on fr.fundingIdx = f.fundingIdx
            where f.fundingIdx = 14;


            select f.userIdx
            from Funding f
            where f.fundingIdx = 14;

alter table Product drop constraint FK_Product_marketIdx_Market_marketIdx;


alter table Product add constraint FK_Product_userIdx_Market_userIdx foreign key(userIdx)
references Market(userIdx);

            select frf.fundingReviewFileIdx,
                   frf.fundingReviewFile
            from Funding f left join FundingReview fr on f.fundingIdx = fr.fundingIdx
                           left join FundingReviewFile frf on frf.fundingReviewIdx = fr.fundingReviewIdx
            where f.fundingName = "moongchi";


        select ProtectList.protectImage,
               Animal.animalIdx,
               Animal.animalSpecies,
               Animal.animalAge,
               ProtectList.protectDateStart,
               ProtectList.protectDateEnd
        from ProtectList, Animal
        where Animal.animalIdx = ProtectList.animalIdx
          and ProtectList.status = 'Y';

