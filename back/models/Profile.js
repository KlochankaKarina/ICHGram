import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
   {   // поле user:
//     // req.user = {
// //      _id: ObjectID("sgdhgcsh"),
// //      username: "",
// //      email: "jsdnejk",
// //      fullmname: "djs"
//       }

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    avatarUrl: {
      type: String,
      default: "",
    },
    avatarPublicId: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
