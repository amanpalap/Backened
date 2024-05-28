import multer from "multer";

const storage = multer.diskStorage({
    destination: function (re, file, cb){
        cb(null, "./public/temp")
    },
    filename: function (re, file, cb){
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage: storage
})