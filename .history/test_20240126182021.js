const logger = (type) => {
return ((content) => {
    console.log(`${type}: ${content} `)
})
}