import G from 'generatorics'

const nextTick = () => {
  return new Promise((resolve) => {
    setTimeout(resolve)
  })
}

export default async function pick(types, min = 1, max, validate?) {
  const map = new Map()
  let count = 0
  for (let i = min; i <= max; i++) {
    console.log('calculate', i)
    const nums = G.baseN(types, i)
    for (var num of nums) {
      count++
      if (count % 10000 === 0) {
        console.log('计算次数', count)
        await nextTick()
      }
      const one = [...num]
      if (validate && !validate(one)) continue
      const sorted = one.sort((a, b) => b - a)
      const key = sorted.join(',')
      if (map.has(key)) continue
      map.set(key, one)
    }
  }
  console.log('总计算次数：', count)
  console.log('总方案数：', map.size)
  return map
}