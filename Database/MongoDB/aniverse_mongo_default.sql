db.Center.drop()
db.createCollection("Center")
db.Center.insert({centerIdx: "0",
centerName: "0",
centerAddress: "0",
centerPhoneNum: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.User.drop()
db.createCollection("User")
db.User.insert({userIdx: "0",
userId: "0",
userPassword: "0",
userName: "0",
userAddress: "0",
userPhoneNum: "0",
userAuth: "0",
userJellyNum: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})


db.AdoptList.drop()
db.createCollection("AdoptList")
db.AdoptList.insert({adoptListIdx: "0",
userIdx: "0",
animalSpecies: "0",
animalAge: "0",
animalGender: "0",
animalVaccinated: "0",
animalFind: "0",
animalIntro: "0",
adoptCondition: "0",
adoptEnd: "0",
createdAt: "0",
updatedAt: "0",
status: "0"
})

db.AdoptRequest.drop()
db.createCollection("AdoptRequest")
db.AdoptRequest.insert({adoptRequestIdx: "0",
adoptListIdx: "0",
userIdx: "0",
adoptComment: "0",
adoptDate: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.Market.drop()
db.createCollection("Market")
db.Market.insert({marketIdx: "0",
userIdx: "0",
marketName: "0",
marketIntro: "0",
marketAddress: "0",
marketPhoneNum: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.Category.drop()
db.createCollection("Category")
db.Category.insert({categoryIdx: "0",
categoryName: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.Funding.drop()
db.createCollection("Funding")
db.Funding.insert({fundingIdx: "0",
userIdx: "0",
fundingName: "0",
fundingPurpose: "0",
fundingImage: "0",
receivedAmount: "0",
fundingAmount: "0",
fundingPeriod: "0",
createdAt: "0",
updatedAt: "0",
status:"0"})


db.FundingReview.drop()
db.createCollection("FundingReview")
db.FundingReview.insert({fundingReviewIdx: "0",
fundingIdx: "0",
userIdx: "0",
fundingReviewText: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.ProtectList.drop()
db.createCollection("ProtectList")
db.ProtectList.insert({protectListIdx: "0",
userIdx: "0",
animalGender: "0",
animalSpecies: "0",
animalAge: "0",
animalVaccinated: "0",
animalIntro: "0",
protectRequestEnd: "0",
protectPeriod: "0",
protectCondition: "0",
createdAt: "0",
updatedAt: "0",
status: "0"
})

db.AdoptReview.drop()
db.createCollection("AdoptReview")
db.AdoptReview.insert({adoptReviewIdx: "0",
adoptRequestIdx: "0",
adoptReviewText: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.Product.drop()
db.createCollection("Product")
db.Product.insert({productIdx: "0",
marketIdx: "0",
categoryIdx: "0",
productName: "0",
productPrice: "0",
productIntro: "0",
productImage: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.AdoptReviewFile.drop()
db.createCollection("AdoptReviewFile")
db.AdoptReviewFile.insert({adoptReviewFileIdx: "0",
adoptReviewIdx: "0",
adoptReviewFileSort: "0",
adoptReviewFile: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.ProtectRequest.drop()
db.createCollection("ProtectRequest")
db.ProtectRequest.insert({protectRequestIdx: "0",
protectListIdx: "0",
userIdx: "0",
protectDate: "0",
protectComment: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.DonateJelly.drop()
db.createCollection("DonateJelly")
db.DonateJelly.insert({donateJellyIdx: "0",
fundingIdx: "0",
userIdx: "0",
donateJellyNum: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.FundingReviewFile.drop()
db.createCollection("FundingReviewFile")
db.FundingReviewFile.insert({fundingReviewFileIdxg: "0",
fundingReviewIdx: "0",
fundingReviewFileSort: "0",
fundingReviewFile: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.PurchaseJelly.drop()
db.createCollection("PurchaseJelly")
db.PurchaseJelly.insert({purchaseJellyIdx: "0",
userIdx: "0",
purchaseJellyNum: "0",
purchaseJellyPay: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.PurchaseProduct.drop()
db.createCollection("PurchaseProduct")
db.PurchaseProduct.insert({purchaseProductIdx: "0",
productIdx: "0",
userIdx: "0",
purchaseProductPay: "0",
getJellyNum: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})

db.AdoptAnimalFile.drop()
db.createCollection("AdoptAnimalFile")
db.AdoptAnimalFile.insert({adoptAnimalFileIdx: "0",
adoptListIdx: "0",
adoptLisfFileSort: "0",
adoptListFile: "0",
createdAt: "0",
updatedAt: "0",
status: "0"})
