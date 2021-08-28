const Jieba = require("js-jieba");
const { JiebaDict, HMMModel, UserDict, IDF, StopWords } = require("js-jieba/dist/dict.zh-cn")

let jieba;
function getJieba() {
  if (!jieba) {
    jieba = Jieba(
      Buffer.from(JiebaDict),
      Buffer.from(HMMModel),
      Buffer.from(UserDict),
      Buffer.from(IDF),
      Buffer.from(StopWords),
    );
  }

  return jieba;
}

module.exports = {
  getJieba,
};