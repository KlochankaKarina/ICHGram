import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      // required: true,
      default: ""
    },
    imagePublicId: {
       type: String,
      // required: true,
      default: ""
    },
    caption: {
        type: String,
          default: "",
          maxlength: 2200,
          trim: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
     default: []
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;