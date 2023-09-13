import mongoose from 'mongoose'
let hm = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    tag: { type: String, required: true },
    region: { type: String, required: true },
    email_verified: { type: Boolean, required: true },
    country: { type: String, required: true },
    puuid: { type: String, required: true },
    phone_verified: { type: Boolean, required: true },
    accID: { type: String, required: true },
    ent_token: { type: String, required: true },
    token: { type: String, required: true },
    cookieString: { type: String, required: true },
    lastUpdated: { type: Number, required: true },
});
export default mongoose.model("account", hm);