# 关于new Date() 类型的计算

```code
const utils = {
    timeFormat(ms) {
        const diff = ((ms) / 60000).toFixed(2);
        const [minute, second] = diff.split('.');
        if (Number(minute) > 0) {
            const hour = (minute / 60).toFixed(2);
            if (hour >= 1) {
                const [h, m] = hour.split('.');
                return `${h}小时${m}分钟${second}秒`;
            }
            if (minute / 60) { return `${minute}分钟${second}秒`; }
        }
        return `${diff}秒`;
    },
    timeDiff(start, stop) {
        if (start && stop) {
            return this.timeFormat(new Date(stop).getTime() - new Date(start).getTime());
        }
        return 0;
    },
}
utils.timeDiff('2023-07-12 11:24:40', '2023-07-12 11:26:18'); // 	1分钟63秒
```