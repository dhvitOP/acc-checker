import { Hono, Context } from "hono";
const router = new Hono();
import getAccLevel from '../../functions/info/getAccLevel';
import { save, findOne } from '../../database/utils';
import axios from 'axios';

import config from '../../constants/config.json';
const apiUrl = config.apiUrl;

router.get("/", global.checkAuth,async(c:Context) => {

    const accID = c.req.query('accID');
    if(!accID) return c.json({msg: "Please provide an account ID"});

    const acc = await findOne("account", {accID:accID});
    if(!acc) return c.json({msg: "Account not found"});

    const auth = await axios.get(apiUrl + "/acc/reAuth?accID=" + accID);
    if(auth.data.err == "cookie_expired") return c.json({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return c.json({msg: "ID PASS Invalid, maybe password is changed"});

    const { token,ent_token } = auth.data.data;
    const level = await getAccLevel({token:token,ent_token:ent_token,puuid:acc.puuid,region:acc.region});
    if(level == "An error occured") return c.json({msg: "An error occured"});
    
   

    const loadout = await findOne("loadout",{accID: accID});
    if(!loadout) {
        await save("loadout",{
            accID: accID,
            level: level.level,
            xp: level.xp,
        });
    } else {
        loadout.level = level.level;
        loadout.xp = level.xp;
        await loadout.save();
    }
    return c.json({msg: "Level Fetched Successfully", level: level.level, xp: level.xp});
});
export default router;