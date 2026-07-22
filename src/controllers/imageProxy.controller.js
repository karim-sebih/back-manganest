import https from "https";

export async function proxyImage(req, res) {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).send("Missing url");

        // protège un peu
        if (!url.startsWith("https://uploads.mangadex.org/")) {
            return res.status(400).send("Invalid url");
        }

        const response = await fetch(url);

        // renvoie tel quel
        res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
        res.status(response.status);

        const buffer = Buffer.from(await response.arrayBuffer());
        res.send(buffer);
    } catch (e) {
        res.status(500).send("Proxy error");
    }
}