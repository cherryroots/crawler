export { normalizeURL, getURLsFromHTML, crawlPage };
import { JSDOM } from 'jsdom'

function normalizeURL(url) {
    try {
        const urlObj = new URL(url)
        var fullUrl = `${urlObj.hostname}${urlObj.pathname}`
        fullUrl = fullUrl.replace(/\/+$/, '')
        return fullUrl
    } catch (error) {
        return error.message
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    var links = []
    const dom = new JSDOM(htmlBody)
    const anchors = dom.window.document.querySelectorAll('a')
    for (const a of anchors) {
        var url = a.href
        try {
            url = new URL(url, baseURL)
            links.push(url.href)
        } catch (error) {
            console.log(`${error.message}: ${url.href}`)
        }
    }
    return links
}

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
    const base = new URL(baseURL)
    const curr = new URL(currentURL)
    if (curr.hostname != base.hostname) {
        return pages
    }

    const normalized = normalizeURL(currentURL)
    if (normalized in pages) {
        pages[normalized] += 1
        return pages
    } else {
        pages[normalized] = 1
    }

    try {
        const html = await getHTML(currentURL)
        const urls = getURLsFromHTML(html, baseURL)
        for (const url of urls) {
            const newPages = crawlPage(baseURL, url, pages)
            pages = { ...pages, ...newPages }
        }
    } catch (error) {
        console.log(error.message)
        return pages
    }

    return pages
}

async function getHTML(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            mode: "cors"
        })
        if (response.status >= 400) {
            throw new Error(`${response.status}: ${response.message}`)
        }
        if (response.headers.get("Content-Type") != "text/html; charset=utf-8") {
            throw new Error(`Response was not HTML: ${response.headers.get("Content-Type")}`)
        }
        return await response.text()
    } catch (error) {
        console.log(error.message)
        return
    }
}