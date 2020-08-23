import moment from 'moment'

// 阶乘
function Factorial (max, min) {
  if (max >= min && max > 1) {
    return max * Factorial(max - 1, min)
  } else {
    return 1
  }
}

// 排列组合
export function Combine (m, n) {
  if (m < n || n < 0) {
    return 0
  }
  return Factorial(m, m - n + 1) / Factorial(n, 1)
}

/** 获取双色器期号
 *
 * 晚上8点后，包含下期期号
 * @param {*} count 获取期数
 */
export function getSSQqihao (count = 50) {
  const retDate = []
  let startDate = moment('20200101')
  const yearCount = {}

  while (startDate < moment()) {
    if (yearCount[startDate.year()] === undefined) {
      yearCount[startDate.year()] = 1
    }
    if ([0, 2, 4].includes(startDate.weekday())) {
      let countS = String(yearCount[startDate.year()])
      if (countS.length === 1) {
        countS = '00' + countS
      } else if (countS.length === 2) {
        countS = '0' + countS
      }
      retDate.push({
        qihao: String(startDate.year()) + countS,
        mount: startDate.format('YYYY-MM-DD')
      })
      yearCount[startDate.year()] += 1
    }
    startDate = startDate.add(1, 'days')
  }

  // 计算下一期
  if (moment().hour() < 20 && ![0, 2, 4].includes(moment().weekday())) {
    let currentDate = moment()
    while (1) {
      currentDate = currentDate.add(1, 'days')
      if ([0, 2, 4].includes(currentDate.weekday())) {
        let countS = String(yearCount[startDate.year()])
        if (countS.length === 1) {
          countS = '00' + countS
        } else if (countS.length === 2) {
          countS = '0' + countS
        }
        retDate.push({
          qihao: String(currentDate.year()) + countS,
          mount: currentDate.format('YYYY-MM-DD')
        })
        yearCount[currentDate.year()] += 1
        break
      }
    }
  }
  retDate.sort((a, b) => b.qihao - a.qihao)
  return retDate.slice(0, count)
}

// 渲染中奖情况
export function randerAward (obj) {
  const ret = []
  if (obj.A > 0) {
    ret.push(`一等奖${obj.A}注`)
  }
  if (obj.B > 0) {
    ret.push(`二等奖${obj.B}注`)
  }
  if (obj.C > 0) {
    ret.push(`三等奖${obj.C}注`)
  }
  if (obj.D > 0) {
    ret.push(`四等奖${obj.D}注`)
  }
  if (obj.E > 0) {
    ret.push(`五等奖${obj.E}注`)
  }
  if (obj.F > 0) {
    ret.push(`六等奖${obj.F}注`)
  }
  return ret.join(',')
}
