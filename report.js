export { printPages };

function printPages(pages) {
    console.log("---Starting Report---")
    const sorted = sortPages(pages)
    for (const key in sorted) {
        console.log(`Found ${sorted[key]} internal links to ${key}`)
    }
}

function sortPages(pages) {
    const sortedDict = Object.fromEntries(
        Object.entries(pages).sort(([, a], [, b]) => b - a)
    );
    return sortedDict
}