const mongoose= require("mongoose")
const multer = require("multer")
const path = require("path")
const FilePath = path.join('/uploads')

const advSchema= new mongoose.Schema({
    advfile :{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    advtype:{
      type:String
    },
    gender:{
        type:String,
        default:"all"
    },
    cars:[{
        type: String
    }],
    maxage:{
        type:String,
        default:'100'
    },
    minage:{
        type:String,
        default:'0'
    }
},{
    timestamps: true
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', FilePath))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

advSchema.statics.uploadedFile = multer({storage:storage}).single('advfile')
advSchema.statics.filePath = FilePath;

const Adv= mongoose.model("Adv",advSchema);
module.exports= Adv;