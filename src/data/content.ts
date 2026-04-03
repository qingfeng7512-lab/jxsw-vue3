import type { ContentPayload, NewsItem, ProductItem } from '../types/content'

export const siteInfo = {
  name: '鸡西锁王开锁服务部',
  hotline: '0467-6111666',
  mobile: '13555464689',
  address: '鸡西市鸡冠区沿河北路花园35号楼212',
}

export const quickNotices = [
  '24小时上门服务，节假日正常接单',
  '防盗门锁芯升级，支持超B级方案',
  '指纹锁安装与售后维护一体化',
]

export const banners = [
  {
    title: '专业开锁与锁具服务',
    subtitle: '急您所急，24小时到达',
  },
  {
    title: '指纹锁与智能门锁安装',
    subtitle: '安全升级，体验更便捷',
  },
]

export const categories = [
  { id: 2, name: '产品展示' },
  { id: 11, name: '服务项目' },
  { id: 15, name: '指纹锁' },
  { id: 3, name: '锁具常识' },
  { id: 5, name: '行业新闻' },
]

export const newsList: NewsItem[] = [
  {
    id: 2,
    cid: 3,
    title: '如何购锁具才能防撬防盗',
    summary: '选锁芯、看结构、查材质是家庭防盗的关键步骤。',
    content:
      '锁具建议选择结构合理、材质稳定的锁芯。普通家庭建议定期检查锁芯磨损，避免长期使用导致防护下降。',
    date: '2013-04-22',
    hits: 1461,
  },
  {
    id: 3,
    cid: 3,
    title: '防盗门是家庭第一扇门',
    summary: '防盗门不仅看门体，也要关注锁芯与安装细节。',
    content:
      '防盗门真正的防护力来自门体、锁体和安装工艺三者协同。建议在升级门锁时同步检查门框和铰链。',
    date: '2013-04-22',
    hits: 1609,
  },
  {
    id: 8,
    cid: 8,
    title: '热烈庆祝网站开通',
    summary: '服务信息上线，支持快速咨询与预约。',
    content:
      '网站开通后，客户可更快获取服务范围、上门时段与联系方式，提高沟通效率。',
    date: '2013-04-22',
    hits: 2015,
  },
  {
    id: 9,
    cid: 5,
    title: '年关防盗意识提醒',
    summary: '门窗、气窗、阳台是高风险位置，需要重点防护。',
    content:
      '建议检查门锁状态，必要时更换高防护等级锁芯，夜间加强入户区域照明与可视化监控。',
    date: '2013-11-27',
    hits: 1127,
  },
]

export const productList: ProductItem[] = [
  {
    id: 104,
    cid: 11,
    title: '卷帘门安装维护',
    summary: '专业安装、订做、维修车库门与卷帘门。',
    cover: '/uploads/image/20150916/1442399116.jpg',
    gallery: ['/uploads/image/20150916/1442399116.jpg'],
    content: '提供现场勘测、五金更换、轨道调平与遥控器匹配服务。',
  },
  {
    id: 106,
    cid: 15,
    title: '指纹锁安装调试',
    summary: '支持主流指纹锁型号上门安装与售后维护。',
    cover: '/uploads/image/20220428/1651132816.jpg',
    gallery: ['/uploads/image/20220428/1651132816.jpg'],
    content: '安装后可完成指纹录入、临时密码设置与防撬报警联调。',
  },
  {
    id: 110,
    cid: 2,
    title: '防盗门锁芯升级',
    summary: '老旧锁芯更换，提升家庭入户安全等级。',
    cover: '/uploads/image/20230218/1676709849.jpg',
    gallery: ['/uploads/image/20230218/1676709849.jpg'],
    content: '根据门体结构选择适配锁芯方案，兼顾防护性能与使用体验。',
  },
]

export const aboutText =
  '鸡西锁王开锁服务部专注开锁、换锁、修锁及智能锁安装，严格遵守规范流程，提供稳定可靠的本地化服务。'

export const contactSummary = '电话：0467-6111666，手机：13555464689，支持全天候预约。'

export const fallbackContent: ContentPayload = {
  contentMeta: {
    source: 'fallback',
    generatedAt: '2026-03-30T00:00:00.000Z',
    sqlFile: 'N/A',
    recordCounts: {
      news: newsList.length,
      products: productList.length,
      banners: banners.length,
    },
  },
  siteInfo,
  quickNotices,
  banners,
  categories,
  newsList,
  productList,
  aboutText,
  contactSummary,
}
