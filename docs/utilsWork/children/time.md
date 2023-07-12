# 关于new Date() 类型的计算

```code
const utils = {
    timeFormat(mss) {
        const days = parseInt(mss / (1000 * 60 * 60 * 24));
        const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = (mss % (1000 * 60)) / 1000;
        return (days > 0 ? days + '天' : '') + (hours > 0 ? hours + '小时' : '') + minutes + '分钟' + seconds + '秒';
    },
    timeDiff(start, stop) {
        if (start && stop) {
            return this.timeFormat(new Date(stop).getTime() - new Date(start).getTime());
        }
        return 0;
    },
}
utils.timeDiff('2023-07-12 11:24:40', '2023-07-12 11:26:18'); // 	1分钟38秒
```