const fs = require("fs").promises;
const { existsSync, mkdirSync } = require("fs");
const path = require("path");
// const compress_images = require("compress-images");
const { getJieba } = require("./text-rank");

// const IMAGE_FOLDER = "images";
// const TMP_IMAGE_FOLDER = "tmp-images";

/** 对消息进行处理 */
// async function processMessageData(data) {
//   if (data.typeStr === "image") { // 图片进行压缩
//     try {
//       const regex = /^data:.+\/(.+);base64,(.*)$/;
//       const [, ext, imageData] = data.data.match(regex);
//       const buffer = Buffer.from(imageData, "base64");
  
//       const destFolder = path.join(process.cwd(), IMAGE_FOLDER, data.creator);
//       if (!existsSync(destFolder)) {
//         mkdirSync(destFolder, { recursive: true });
//       }
//       const destFile = path.join(destFolder, `${data.id}.${ext}`);
//       await fs.writeFile(destFile, buffer);
  
//       const tmpFolder = path.join(process.cwd(), TMP_IMAGE_FOLDER, data.creator);
//       if (!existsSync(tmpFolder)) {
//         mkdirSync(tmpFolder, { recursive: true });
//       }
//       const res = await new Promise((resolve, reject) => {
//         compress_images(destFile, tmpFolder + "/",
//           { compress_force: true, statistic: true, autoupdate: true },
//           false,
//           { jpg: { engine: 'webp', command: false } },
//           { png: { engine: 'webp', command: false } },
//           { svg: { engine: false, command: false } },
//           { gif: { engine: false, command: false } },
//           async (err, completed) => {
//             try {
//               const tmpFile = path.join(tmpFolder, `${data.id}.webp`);
//               if (completed && existsSync(tmpFile)) {
//                 const fileData = await fs.readFile(tmpFile, { encoding: "base64" });
//                 resolve(`data:image/${ext};base64,${fileData}`);
//               } else {
//                 reject(Error("压缩图片出错" + err.message))
//               }
//             } catch (err) {
//               reject(err)
//             }
//           }
//         );
//       });

//       if (res) {
//         data.data = res;
//       }
//     } catch (err) {
//       console.error(err.message);
//     }
//   }

//   return data;
// }

const jieba = getJieba();
/** 提取关键词 */
async function extractKeywords(text) {
  try {
    const res = jieba.extract(text, 1);
    console.log("关键字", res);

    return res.map((value) => value.word);
  } catch (err) {
    console.error("获取关键字失败", err.message);
    return [];
  }
}

const recommand = new Map();
/** 初始化推荐字典 */
async function initRecommand() {
  try {
    const data = await fs.readFile(
      path.join(process.cwd(), "src/recommand.txt"),
      { encoding: "utf8" }
    );
    const lines = data.split("\n");
    lines.forEach((line) => {
      const [key, value] = line.split(" ");
      recommand.set(key, value);
    });
  } catch (err) {
    console.error("加载推荐字典失败", err.message);
  }
}
initRecommand();

/** 根据文本内容推荐答复 */
async function getRecommandText(text = "") {
  const keywords = await extractKeywords(text.toLowerCase());
  if (!keywords.length) {
    return;
  }

  if (!recommand.size) {
    await initRecommand();
  }

  return recommand.get(keywords[0]);
}

module.exports = {
  // processMessageData,
  getRecommandText,
};