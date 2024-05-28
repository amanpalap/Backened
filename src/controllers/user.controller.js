import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler ( async (req, res) => {
    const { fullName, email, username, password } = req.body
    console.log("email", email)

    if(
        [fullName, username, password, email].some((field)=> field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are necessary")
    }

    const existedUser = User.findOne({
        $or: [{ username },{ email }]
    })

    if(existedUser){s
        throw new ApiError(409, "User already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something Went Wrong While creating User")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Created Successfully")
    )

})

export { registerUser }