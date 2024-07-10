import {defineConfig} from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import {LogLevel,RollupLog,LogHandler} from "rollup";
import {svelte} from "@sveltejs/vite-plugin-svelte";

declare const __dirname:string;

export default defineConfig({
    root:`${__dirname}/web/html`,
    mode:"development",
    base:"",

    plugins:[
        svelte(),
        checker({
            typescript:true
        }),
        tsconfigPaths()
    ],

    resolve:{
        alias:{
            "@":`${__dirname}/web`,
        }
    },

    build:{
        outDir:`${__dirname}/build`,
        target:["esnext"],
        sourcemap:true,
        // emptyOutDir:true,
        minify:false,

        rollupOptions:{
            input:{
                "index":`${__dirname}/web/html/index.html`,
            },

            onLog(level:LogLevel,log:RollupLog,handler:LogHandler):void
            {
                if (log.message.includes("Error when using sourcemap for reporting"))
                {
                    return;
                }

                handler(level,log);
            }
        }
    },

    // test:{
    //     root:`${__dirname}/tests`
    // }
});