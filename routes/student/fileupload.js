const multer=require('multer');
const path=require('path');

const storage=(destinition)=>multer.diskStorage({
    destination:destinition,
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileupload=(destination)=>multer({
    storage:storage(destination),
    limits:{
        fileSize:2*1024*1024,
    },
    fileFilter:(req,file,cb)=>{
        if(file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg"){
            cb(null,true);
        }else{
            cb(null,false);
            return cb(new Error('only .png, .jpg, .jpeg formate allowed!'));
        }
    },
    onError:function(err,next){
        return console.log('error',err)
        next(err);
    }
}).single('image')


module.exports=fileupload;