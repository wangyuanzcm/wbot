import dayjs from 'dayjs'
export const getAllTokens = (list) => {
   const tokens = new Set();
   const dates = {}
   for (let i = 0; i < list.length; i++) {
      tokens.add(list[i].token);
      const timeString = list[i]['时间'];
      let timeStamp = dayjs(timeString).valueOf();
      if (!dates[timeStamp]) {
         dates[timeStamp] = {}
      }
      dates[timeStamp][list[i].token] = list[i]
   }
   return { tokens: [...tokens], dates }
}

export const getSerisData = (tokens,dates) => {
  return tokens.map(item=>{
      return {
          name: item,
          type: 'line',
          stack: 'Total',
          data:Object.keys(dates).map(date =>{
            const data = dates[date][item];
            if(data&&data['总金额']){
               return Number(data['总金额'].replace('$',''))
            }
            return 0;
          })
      }
  })
}