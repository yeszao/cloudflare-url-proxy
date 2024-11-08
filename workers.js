function error(msg) {
    return new Response(msg instanceof Error ? msg.message : msg, {
        status: 403,
    });
}

async function wfetch(url, opt = {}) {
    if (!opt) {
        opt = {};
    }
    const options = {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
        },
    };
    if (opt.referer) {
        options.headers["Referer"] = opt.referer;
    }

    return await fetch(url, options);
}


export default {
    async fetch(req, env, ctx) {
        if (req.method.toLowerCase() !== "get") {
            return error("Method not allowed");
        }

        const origin = req.headers.get("origin");
        const { searchParams } = new URL(req.url);
        let url = searchParams.get("url");
        if (!url) {
            return error("url cannot empty");
        }

        url = decodeURIComponent(url);
        console.log("proxy url:", url);

        if (!/^https?:\/\//.test(url)) {
            return error("url not valid");
        }

        const response = await wfetch(url);

        return new Response(response.body, {
            headers: {
                "Access-Control-Allow-Origin": origin,
                "Content-Type": response.headers.get("Content-Type"),
            },
        });
    },
};