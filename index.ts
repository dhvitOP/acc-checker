import { Hono, Next, Context } from "hono";
import config from "./constants/config.json";
import contactWebsite from "./utils/misc/contactWebsite";
import database from "./database/connect";
import routes from "./constants/routes.json";
import { prettyJSON } from 'hono/pretty-json'

const { port, websiteUrl } = config;

const token = "vedant_is_da_best_programmer";
const app: Hono = new Hono({ strict: false });

database();

app.use('*', prettyJSON())

setTimeout(async () => {
  global.checkAuth = async function(c:Context,next:Next) {
    if(!c.req.header('authorization')) return c.json({msg:"Authorization header not provided"});
    const auth = c.req.header('authorization').split(" ")[1];
    if(auth !== token) return c.json({msg:"Invalid token"});
    await next();
  }
  for (const property in routes) {
    const routeModule = await import(`./routes/${routes[property] as string}`);
    app.route(property, routeModule.default); 
    console.log(`Loaded ${property} route`);
  }
  app.notFound((c) => {
    return c.text(' 404 Route Not Found', 404)
  })
  app.showRoutes();
 

  contactWebsite(websiteUrl);
}, 1300);

const cachedTime: Number = Date.now();

export default { time :cachedTime, port,
  fetch: app.fetch, } ;
