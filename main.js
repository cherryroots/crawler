import { crawlPage } from "./crawl.js";
import { printPages } from "./report.js";

async function main() {
    if (process.argv.length != 3) {
        console.log(`Invalid amount of args: ${process.argv.length - 2}, takes 1`)
        return
    }
    const baseUrl = process.argv[2]

    const pages = await crawlPage(baseUrl)
    printPages(pages)

}

main()