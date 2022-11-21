const a: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]


const toSubArray_number = (srcArray: number[], subItemNum: number) => {
  let wkAray: number[] = Array(subItemNum)
  let result: number[][] = []
  result = srcArray.reduce((previousValue, currentValue, currentIndex) => {
    if (currentIndex % subItemNum == 0) {
      wkAray = Array(subItemNum).fill(undefined)
      previousValue.push(wkAray)
    }
    wkAray[currentIndex % subItemNum] = currentValue
    console.debug(`${currentIndex} wkAray ${wkAray} ${currentIndex % subItemNum == 0 ? "pushed" : ""}`)
    return previousValue
  }, result)
  return result

}

const tosubarray = <T>(srcArray: T[], subItemNum: number) => {
  let wkAray: T[] = Array(subItemNum)
  let result: T[][] = []
  result = srcArray.reduce((previousValue, currentValue, currentIndex) => {
    if (currentIndex % subItemNum == 0) {
      wkAray = Array(subItemNum).fill(undefined)
      previousValue.push(wkAray)
    }
    wkAray[currentIndex % subItemNum] = currentValue
    // console.debug(`${currentIndex} wkAray ${wkAray} ${currentIndex % subItemNum == 0 ?"pushed" : ""}`)
    return previousValue
  }, result)
  return result

}

const result = tosubarray(a, 5)
console.debug(result)


console.debug(tosubarray(a, 2))

