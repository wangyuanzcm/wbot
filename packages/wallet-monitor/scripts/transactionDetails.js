// 解析交易记录的详细信息
var axios = require('axios');
var cheerio = require('cheerio');

const transfromHtml = (from,to,data)=>{

  const $ = cheerio.load(data);
  // 选择要删除的子元素
  const $pToDelete = $('.table-responsive');
  // 删除子元素
  $pToDelete.remove();
  // 获取交易详情
  const transDetail = $("#wrapperContent")[1].children.map((li)=>{
      return $(li).text()
  })

  // 当前的token总数
  const content = $('#ContentPlaceHolder1_maintable .row.align-items-center');
  let keyMaps = content.map((i, row) => {
      const leftKey = $($(row).children()[0]).text();
      const rightKey = $($(row).children()[1]).text();
      const key = String(leftKey).trim().replaceAll(":","").replaceAll(" ","");
      const val = String(rightKey).trim().replaceAll("\n","").replaceAll(" ","");
      return {
          [key]:val
      }
  }).toArray().reduce((a, b) => ({ ...a, ...b }), {});
  // console.log(keyMaps, 'tabContent');
  const  FromAddress = keyMaps.From;
  // 根据当前查询的主钱包来获取具体的交易数据
  const transData = transDetail.reduce((a,i)=>{
    const text = i.split('From')[1].trim();
    const [From, ToText] = text.split('To');
    const [To, ForText] = ToText.split('For');
    if(FromAddress.indexOf(From.trim())>-1){
      a.takeOut =  ForText.trim()
      a.From =  From.trim()
      return a;
    }else if(FromAddress.indexOf(To.trim())>-1){
      a.takeIn =  ForText.trim()
      a.From =  To.trim()
      return a;

    }else{
      a.tokenTrans.push(ForText.trim())
      a.walletTrans.push([From.trim(),To.trim()]);
      return a;
    }
  },{
    tokenTrans:[],
    walletTrans:[]
  })
  return {...keyMaps,...transData}

}
module.exports = transfromHtml;
