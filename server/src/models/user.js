const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const { hash, compare, genSalt } = require("bcryptjs");
const opts = { timestamps: true }

const userSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "username field is required."]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        required: [true, "email field is required."],
        validate: [isEmail, "invalid email."],
        trim: true
    },
    password: {
        type: String,
        required: [true, "password field is required."],
    }
}, opts)

userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    return await compare(this.password, candidatePassword);
}

userSchema.pre("save", async function () {
    const salt = await genSalt(12);
    this.password = await hash(this.password, salt);
})

//convert the _id from ObjectId to string when returned.
userSchema.path("_id").get(v => v.toString());

module.exports = model("user", userSchema);