import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const defaultInput = path.resolve(__dirname, '../../uldjqoekj4vi_db (1).sql')
const defaultOutput = path.resolve(__dirname, '../public/data/content.json')

const args = process.argv.slice(2)
const inputPath = args[0] ? path.resolve(process.cwd(), args[0]) : defaultInput
const outputPath = args[1] ? path.resolve(process.cwd(), args[1]) : defaultOutput
const sourceTag = args[2] || 'sql-sync'

function decodeSqlString(raw) {
  return raw
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
    .replace(/\\'/g, "'")
}

function stripHtml(html) {
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toSnippet(text, max = 52) {
  const clean = stripHtml(text)
  return clean.length > max ? `${clean.slice(0, max)}...` : clean
}

function parseColumns(colsRaw) {
  return colsRaw
    .split(',')
    .map((x) => x.trim().replace(/^`|`$/g, ''))
}

function parseToken(token) {
  const t = token.trim()
  if (!t.length) return ''
  if (t === 'NULL') return null

  if (t.startsWith("'") && t.endsWith("'")) {
    const body = t.slice(1, -1).replace(/''/g, "'")
    return decodeSqlString(body)
  }

  if (/^-?\d+(\.\d+)?$/.test(t)) {
    return Number(t)
  }

  return t
}

function parseValuesBlock(valuesRaw) {
  const rows = []
  let i = 0

  while (i < valuesRaw.length) {
    while (i < valuesRaw.length && valuesRaw[i] !== '(') i += 1
    if (i >= valuesRaw.length) break

    i += 1
    const tokens = []
    let buf = ''
    let inQuote = false

    while (i < valuesRaw.length) {
      const ch = valuesRaw[i]

      if (inQuote) {
        if (ch === "'") {
          const next = valuesRaw[i + 1]
          if (next === "'") {
            buf += "''"
            i += 2
            continue
          }
          inQuote = false
          buf += ch
          i += 1
          continue
        }

        buf += ch
        i += 1
        continue
      }

      if (ch === "'") {
        inQuote = true
        buf += ch
        i += 1
        continue
      }

      if (ch === ',') {
        tokens.push(parseToken(buf))
        buf = ''
        i += 1
        continue
      }

      if (ch === ')') {
        tokens.push(parseToken(buf))
        i += 1
        break
      }

      buf += ch
      i += 1
    }

    rows.push(tokens)
  }

  return rows
}

function findSqlStatementEnd(sqlText, startIndex) {
  let i = startIndex
  let inQuote = false

  while (i < sqlText.length) {
    const ch = sqlText[i]

    if (inQuote) {
      if (ch === "'") {
        const next = sqlText[i + 1]
        if (next === "'") {
          i += 2
          continue
        }
        inQuote = false
      }
      i += 1
      continue
    }

    if (ch === "'") {
      inQuote = true
      i += 1
      continue
    }

    if (ch === ';') {
      return i
    }

    i += 1
  }

  return sqlText.length - 1
}

function parseInsertTable(sqlText, tableName) {
  const headerReg = new RegExp(
    `INSERT INTO\\s+\`${tableName}\`\\s*\\(([^)]*)\\)\\s*VALUES\\s*`,
    'gi',
  )

  const records = []
  let m

  while ((m = headerReg.exec(sqlText)) !== null) {
    const cols = parseColumns(m[1])
    const valuesStart = headerReg.lastIndex
    const valuesEnd = findSqlStatementEnd(sqlText, valuesStart)
    const valuesRaw = sqlText.slice(valuesStart, valuesEnd)
    const rows = parseValuesBlock(valuesRaw)

    rows.forEach((values) => {
      const obj = {}
      cols.forEach((col, idx) => {
        obj[col] = values[idx]
      })
      records.push(obj)
    })

    headerReg.lastIndex = valuesEnd + 1
  }

  return records
}

function asArray(value) {
  if (!value) return []
  return String(value)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
}

function isPublished(item) {
  const checkOk = String(item.checkinfo || '') === 'true'
  const notDeleted = String(item.delstate || '') !== 'true'
  return checkOk && notDeleted
}

function pickSiteAddress(contactText, fallbackText) {
  const all = `${contactText || ''} ${fallbackText || ''}`
  const m = all.match(/地址[:：]\s*([^\s]+[^\n]*)/)
  if (!m) return '鸡西市鸡冠区沿河北路花园35号楼212'

  const first = m[1]
    .replace(/电话[:：].*$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return first || '鸡西市鸡冠区沿河北路花园35号楼212'
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input SQL file not found: ${inputPath}`)
    process.exit(1)
  }

  const sqlText = fs.readFileSync(inputPath, 'utf8')

  const webconfig = parseInsertTable(sqlText, 'pmw_webconfig')
  const infoclass = parseInsertTable(sqlText, 'pmw_infoclass')
  const info = parseInsertTable(sqlText, 'pmw_info')
  const infolist = parseInsertTable(sqlText, 'pmw_infolist')
  const infoimg = parseInsertTable(sqlText, 'pmw_infoimg')

  const configByName = Object.fromEntries(webconfig.map((x) => [x.varname, x.varvalue]))
  const infoByClassId = Object.fromEntries(info.map((x) => [String(x.classid), x]))

  const aboutFromInfo1 = infoByClassId['1']?.content
  const aboutFromInfo4 = infoByClassId['4']?.content
  const aboutText = toSnippet(aboutFromInfo1 || aboutFromInfo4 || '网站资料更新中', 140)

  const contactSummaryRaw = stripHtml(infoByClassId['10']?.content || infoByClassId['6']?.content || '')
  const contactSummary = contactSummaryRaw || '电话：0467-6111666，手机：13555464689，支持全天候预约。'

  const hotline = '0467-6111666'
  const siteName = String(configByName.cfg_webname || '鸡西锁王开锁服务部')
  const address = pickSiteAddress(contactSummaryRaw, String(configByName.cfg_copyright || ''))

  const publishedNews = infolist.filter(isPublished)
  const publishedProducts = infoimg.filter(isPublished)

  const newsList = publishedNews
    .map((x) => ({
      id: Number(x.id),
      cid: Number(x.classid),
      title: String(x.title || '').trim(),
      summary: toSnippet(x.description || x.content || x.title, 56),
      content: stripHtml(x.content || x.description || x.title),
      date: x.posttime ? new Date(Number(x.posttime) * 1000).toISOString().slice(0, 10) : '2013-01-01',
      hits: Number(x.hits || 0),
    }))
    .filter((x) => x.title)
    .sort((a, b) => b.id - a.id)

  const productList = publishedProducts
    .map((x) => {
      const cover = String(x.picurl || '').trim() || '/images/about_img.jpg'
      const gallery = asArray(x.picarr)
      return {
        id: Number(x.id),
        cid: Number(x.classid),
        title: String(x.title || '').trim(),
        summary: toSnippet(x.description || x.content || x.title, 48),
        cover,
        gallery: gallery.length ? gallery : [cover],
        content: stripHtml(x.content || x.description || x.title),
      }
    })
    .filter((x) => x.title)
    .sort((a, b) => b.id - a.id)

  const banners = publishedProducts
    .filter((x) => Number(x.classid) === 9)
    .slice(0, 5)
    .map((x) => ({
      title: String(x.title || '').trim() || '首页横幅',
      subtitle: toSnippet(x.description || x.content || '鸡西锁王开锁服务部', 30),
    }))

  const quickNotices = newsList
    .filter((x) => x.cid === 8)
    .slice(0, 4)
    .map((x) => x.title)

  const categories = infoclass
    .filter((x) => String(x.checkinfo) === 'true')
    .filter((x) => Number(x.id) === 2 || Number(x.id) === 11 || Number(x.id) === 15 || Number(x.id) === 3 || Number(x.id) === 5)
    .map((x) => ({
      id: Number(x.id),
      name: String(x.classname || '').trim(),
    }))

  const payload = {
    contentMeta: {
      source: sourceTag,
      generatedAt: new Date().toISOString(),
      sqlFile: path.basename(inputPath),
      recordCounts: {
        news: Math.min(newsList.length, 120),
        products: Math.min(productList.length, 200),
        banners: banners.length > 0 ? banners.length : 2,
      },
    },
    siteInfo: {
      name: siteName,
      hotline,
      mobile: '13555464689',
      address,
    },
    quickNotices:
      quickNotices.length > 0
        ? quickNotices
        : ['24小时上门服务，节假日正常接单', '防盗门锁芯升级，支持超B级方案', '指纹锁安装与售后维护一体化'],
    banners:
      banners.length > 0
        ? banners
        : [
            { title: '专业开锁与锁具服务', subtitle: '急您所急，24小时到达' },
            { title: '指纹锁与智能门锁安装', subtitle: '安全升级，体验更便捷' },
          ],
    categories: categories.length > 0 ? categories : [{ id: 2, name: '产品展示' }],
    newsList: newsList.slice(0, 120),
    productList: productList.slice(0, 200),
    aboutText,
    contactSummary,
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf8')

  console.log(`Generated content JSON: ${outputPath}`)
  console.log(`Source tag: ${sourceTag}`)
  console.log(`News items: ${payload.newsList.length}`)
  console.log(`Product items: ${payload.productList.length}`)
  console.log(`Banners: ${payload.banners.length}`)
}

main()
