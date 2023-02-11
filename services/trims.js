function trims(data) {
    let newData = new Object()
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            newData[key] = typeof (element) === "string" ? element.trim() : element
        }
    }
    return (newData)
}
module.exports = trims;
