const { instance } = require("../../utils/instance");
const { token_headers, data } = require("../../constants");
const axios = require("axios");
const { UserInfo } = require("../../constants/riot_routes.json");
async function getInfo(token) {
    try {
        token_headers.Authorization = token_headers.Authorization.replace("{token}", token); 
        const res = await instance.post(UserInfo.url, data, { headers: token_headers });
        return res.data;
} catch (error) {
    //console.log(error);
    return "An error occured";
}
}
module.exports = getInfo;

