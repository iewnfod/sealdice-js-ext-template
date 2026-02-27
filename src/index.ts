import { sample } from "lodash-es";
import moment from "moment-timezone";
import pkg from "../package.json";

const extName = "吃了么";
const author = "Iewnfod";
const version = pkg.version;

const foodByTime = {
  breakfast: ["包子", "油条", "豆浆", "粥", "馒头", "煎饼果子", "肠粉", "三明治", "麦片", "牛奶", "鸡蛋", "面包"],
  lunch: ["炒饭", "面条", "饺子", "麻辣烫", "米线", "火锅", "烧烤", "汉堡", "披萨", "寿司", "咖喱", "煲仔饭", "盖浇饭", "炒面"],
  dinner: ["火锅", "烧烤", "麻辣香锅", "铁板烧", "烤肉", "炸鸡", "牛排", "意面", "沙拉", "日式料理", "韩式烤肉", "泰国菜", "烤鱼"],
  nightSnack: ["烧烤", "炸鸡", "麻辣烫", "小龙虾", "泡面", "薯片", "串串", "啤酒", "奶茶", "蛋糕", "水果", "关东煮"],
  other: ["汉堡", "披萨", "三明治", "炒饭", "面条", "饺子", "粥", "包子", "麻辣拌", "米线"] // 下午茶等其他时间
};

const allFood = Object.values(foodByTime).flat();

function getTimePeriod(hour: number) {
  if (hour >= 5 && hour < 10) return 'breakfast';
  if (hour >= 10 && hour < 14) return 'lunch';
  if (hour >= 17 && hour < 21) return 'dinner';
  if (hour >= 21 || hour < 5) return 'nightSnack';
  return 'other'; // 14-17点下午茶等
}

const periodNames: Record<string, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
  nightSnack: "夜宵",
  other: "不知道什么"
};

function main() {
  // 注册扩展
  let ext = seal.ext.find(extName);
  if (!ext) {
    ext = seal.ext.new(extName, author, version);
    seal.ext.register(ext);
  }

  // 编写指令
  const eatWhatCmd = seal.ext.newCmdItemInfo();
  eatWhatCmd.name = 'eat_what';
  eatWhatCmd.help = [
    '使用 .eat_what [日期时间] [时区] 获取随机食物推荐。',
    '示例:',
    '.eat_what                             # 当前时间（默认时区 Asia/Shanghai）',
    '.eat_what 2025-01-01-12:30            # 指定日期时间（默认时区）',
    '.eat_what 2025-01-01-22:30 America/New_York  # 指定日期时间和时区',
    '.eat_what help                         # 显示帮助'
  ].join("\n");

  eatWhatCmd.solve = (ctx, msg, cmdArgs) => {
    let arg1 = cmdArgs.getArgN(1);
    let arg2 = cmdArgs.getArgN(2);

    switch (arg1) {
      case 'help': {
        const ret = seal.ext.newCmdExecuteResult(true);
        ret.showHelp = true;
        return ret;
      }
      default: {
        let tz = arg2 || 'Asia/Shanghai';
        let targetMoment = moment.tz(tz);
        if (arg1) {
          const parsedMoment = moment.tz(arg1, tz);
          if (parsedMoment.isValid()) {
            targetMoment = parsedMoment;
          }
        }
        const timePeriod = getTimePeriod(targetMoment.hour());
        const foodList = foodByTime[timePeriod] || allFood;
        const chosenFood = sample(foodList);

        let reply = [];
        if (arg1) {
          reply.push(`${periodNames[timePeriod]}时间推荐你吃：${chosenFood}！`);
        } else {
          reply.push(`现在是${periodNames[timePeriod]}时间，推荐你吃：${chosenFood}！`);
        }
        reply.push(`时间: ${targetMoment.format('YYYY-MM-DD HH:mm')}; 时区：${tz}`);
        seal.replyToSender(ctx, msg, reply.join("\n"));
        return seal.ext.newCmdExecuteResult(true);
      }
    }
  }

  // 注册命令
  ext.cmdMap['eat_what'] = eatWhatCmd;
}

main();
