import { Router, Request, Response } from "express";
const router = Router();
import accSchema from "../../database/schemas/account";
import { apiUrl } from "../../constants/config.json";
import axios from "axios";
import getPenalties from "../../functions/info/getPenalties";
router.get("/", global.checkAuth, async(req:Request, res:Response) => {
    const accID = req.query.accID;
    const data = await (accSchema as any).findOne({ accID: accID });
    if (!data) return res.send({ msg: 'Account not found' });
    const auth = await axios.get(apiUrl + "/acc/reAuth?accID=" + accID);
    if(auth.data.err == "cookie_expired") return res.send({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return res.send({msg: "ID PASS Invalid, maybe password is changed"});
    const { token,ent_token } = auth.data.data;
    const penalties = await getPenalties({token:token,ent_token:ent_token,puuid:data.puuid,region:data.region});
    if(penalties == "An error occured") return res.send({msg: "An error occured"});
    return res.send({msg: "Penalties Fetched Successfully", penalties: penalties})
});
export default router;