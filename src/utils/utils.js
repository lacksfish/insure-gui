export const leadingZeros = (x) => {
    return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1
}

export const getFormattedDate = (date) => {
    let year = date.getFullYear()

    let month = (1 + date.getMonth()).toString()
    month = month.length > 1 ? month : '0' + month

    let day = date.getDate().toString()
    day = day.length > 1 ? day : '0' + day

    return day + '-' + month + '-' + year
}

export const getIntFromStringEnd = (string) => {
    let number = null
    let matches = string.match(/\d+$/)
    if (matches) {
        number = parseInt(matches[matches.length-1], 10)
    }
    return number
}

export const roundDownToClosest = (number, closest) => {
    let rounder = 1 / closest
    return Math.floor(Math.round(number * 100) / 100 * rounder) / rounder
}

// Maximize output amounts given a percentage distribution
export const percentageDistributionMaximize = (percentages, total) => {
    let remainder = total
    let values = new Array(percentages.length).fill(0)
    let lastRemainder = null
    while (remainder > 0 || remainder == total) {
        values = percentages.map((percent, idx) => {
            return values[idx] + Math.floor(remainder / ( 100 / percent))
        })
        lastRemainder = remainder
        remainder = total - values.reduce((x, y) => { return x+y }, 0)
        // Halt if theres no more change
        if (lastRemainder == remainder) break
    }
    return values
}
