import Mock from 'mockjs';



let all = Mock.mock({
  'items|23': [
    {
      "category": "12323",
      "commissionRate": "1000.00",
      "couponAmount": "1.00",
      "couponUrl": "http://jr.jd.com/coupon/1200.htm",
      "couponsLeft": 88914,
      "hasCoupon": true,
      "image": "https://img.alicdn.com/bao/uploaded/i4/3383106209/TB2keOcpKGSBuNjSspbXXciipXa_!!3383106209-0-item_pic.jpg",
      "itemId": "@id",
      "itemUrl": "https://item.taobao.com/item.htm?id=563727702689",
      "jumpPage": "https://item.taobao.com/item.htm?id=551812857209",
      "priceByCoupon": "8.90",
      "profit": "0.24",
      "shareUrl": "http://www.lazytest.cn/detail.htm?taowords=Imij0DgHYoK&pic=aHR0cHM6Ly9pbWcuYWxpY2RuLmNvbS9iYW8vdXBsb2FkZWQvaTQvMzM4MzEwNjIwOS9UQjJrZU9jcEtHU0J1TmpTc3BiWFhjaWlwWGFfISEzMzgzMTA2MjA5LTAtaXRlbV9waWMuanBn&url=http://of9.cn/yg5ex",
      "soldVolume": 3652,
      "title": "@cword(5,10)",
      "viewPrice": "9.90"
    }
  ],
})

export default {
  'POST /api/rebate/queryRebate.htm': (req, res)=> {
    let {pageNo = 1, pageSize = 10} = req.params;
    pageNo *= 1;
    pageSize *= 1;
    let list = all.items;
    const data = list.slice((pageNo - 1) * pageSize, pageNo * pageSize);
    res.json({code: '000000', desc: "success", totalCount: list.length, pageNo, pageSize, data})
  },
  'POST /api/rebate/queryTitles.htm': (req, res)=> {
    res.json({code: '000000', desc: "success", data: [
        "小包纸巾 便携式 卡通 心相印",
        "小包纸可湿",
        "小包纸巾1包10片",
        "小包纸巾原生态",
        "小包纸巾 便携式 古龙"
      ]})
  },
};
