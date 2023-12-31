#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --watch
import router from "./routes.ts";
import { Application } from "oak"
import { oakCors } from "cors"
import { green, yellow } from "$std/fmt/colors.ts"
import { Init } from "./system/index.ts";
import { envVariable } from "./utils/env.ts";


const PORT = envVariable<number>("PORT", 'number')
const domain = envVariable<string>("DOMAIN")
const needSystemSetup = envVariable<boolean>("NEED_SYSTEM_SETUP", 'boolean')


const app = new Application()

app.use(oakCors())
app.use(router.routes());
app.use(router.allowedMethods());


app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https://" : "http://"
    const url = `${protocol}${hostname ?? "localhost"}:${port}`
    
    if(needSystemSetup) {
        Init()
    }

    console.log(`${yellow("Listening on:")} ${green(url)}`)
})


await app.listen({ port: PORT });