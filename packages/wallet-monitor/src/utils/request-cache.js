function createRequest({ pool = 5, interval = 0, cacheTime = 1000 }) {
    const queue = []; // 请求队列
    const cache = new Map(); // 缓存请求结果
    let running = 0; // 正在运行的请求数

    async function request(promiseFn) {
        const url = promiseFn.toString(); // 将函数转为字符串作为唯一的缓存 key

        // 如果缓存池中存在数据并且未过期，则直接返回缓存数据
        const cachedData = cache.get(url);
        if (cachedData && Date.now() - cachedData.timestamp < cacheTime) {
            return cachedData.response;
        }

        // 如果正在运行的请求数超过最大并发数，则将请求加入队列
        if (running >= pool) {
            return new Promise((resolve, reject) => {
                queue.push({ promiseFn, resolve, reject });
            });
        }

        // 发起新的请求
        running++;

        const response = await promiseFn();
        running--;
        // 更新缓存池
        const timestamp = Date.now();
        cache.set(url, { response, timestamp });

        // 处理队列中的请求
        if (queue.length > 0) {
            const { promiseFn, resolve, reject } = queue.shift();
            setTimeout(() => {
                request(promiseFn).then(resolve).catch(reject);
            }, interval);
        }
        return response;
    }

    return request;
}

// const mockFn = (init) => {
//     return ()=>new Promise((resolve, reject) => {
//         setTimeout(resolve(init), 1000)
//     })
// }
// const request = createRequest({ pool: 1, interval: 30*1000 }); // 最大并发数为3，间隔时间为1秒

// new Array(100).fill(0).map(async (i,index) => {
//     const res = await request(mockFn(index));
//     console.log(res, 'res===')
// })

export default createRequest;