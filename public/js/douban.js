const API_URL = 'https://www.1217.com',
  Q = require('../core/Q.js');

if (!Object.assign) {
  Object.assign = require('../core/object-assign')
}

function preProcessData(datas) {
  datas.data = [{ question_id: 1, answer_: 16, question_: "你喜欢美女吗？", option_type: '0', option_a: '喜欢', option_b: '不喜欢',media_type: 0, media_content: 'media_content', media_width: 100, media_height:100}];
  datas.data = datas.data.map(function (data) {
    var list = {}, order = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], answer = [];
    switch (data.option_type) {//解析题目类型
      case '0':
        list.type = '判断';
        break;
      case '1':
        list.type = '单选';
        break;
      case '2':
        list.type = '多选';
        break;
    };

    if (data.answer_ >= 128) {//解析答案
      answer.push('d');
      data.answer_ = data.answer_ - 128;
    }

    if (data.answer_ >= 64) {//解析答案
      answer.push('c');
      data.answer_ = data.answer_ - 64;
    }

    if (data.answer_ >= 32) {//解析答案
      answer.push('b');
      data.answer_ = data.answer_ - 32;
    }

    if (data.answer_ == 16) {//解析答案
      answer.push('a');
    }
    list.success = 334;//正确题数
    list.error = 24;//错误题数
    list.page = 358;//当前页码
    list.total = 1000;//总页码
    list.isStore = false;//是否收藏
    list.tip = data.question_;//试题详解
    list.isShowTip = false;//是否显示提示
    list.media_type = data.media_type;//媒体类型0：无资源，1：图片，2：视屏
    list.media_url = data.media_content;//媒体链接
    list.media_width = data.media_width;//媒体宽度
    list.media_height = data.media_height;//媒体高度
    list.id = data.question_id;//题号
    list.content = data.question_;//问题正文
    list.options = [];
    //修正答案
    order.every(function (v, i) {
      var arr = {};
      if (!!data['option_' + v] && data['option_' + v] !== "null") {
        arr.tip = v.toUpperCase();
        arr.correct = answer.indexOf(v) >= 0 ? 1 : 0;
        arr.content = data['option_' + v];
        list.options.push(arr);
        return true;
      } else {
        return false;
      }
    })
    return list;
  })
  return datas;
}

function preProcessInitData(data) {
  data = {
    data: [{
      option_type: '0',
      question_: 'dafdafa',
      media_type: '0',
      media_url: '',
      media_width: 100,
      media_height: 100,
      question_id: 1,
      status: 0,
    }]
  }
  var list = {};
  list.status =
    data.status;
  list.msg = data.msg;
  list.data = [];
  list.error = 0;
  list.success = 0;
  data.data.forEach(function (v, i) {
    var a = {};
    a.id = v.question_id;//题目ID
    a.isAnswer = v.is_answer; //题目状态 0:未做，1：正确，2：错误
    a.isStore = v.is_store || false; //题目是否收藏
    if (v.is_answer == 1) {//对题
      list.success++;
    } else if (v.is_answer == 2) {//错题
      list.error++;
    }
    list.data.push(a);
  });
  return list;
}

function fetchApi(url, params) {
  return Q.Promise(function (resolve, reject, notify) {
    //mockup data
    //获取问题详情
    if (url.endsWith("getQuestion")) {
      return resolve({ username: "dafdafa" });
    }
    //获取问题初始化信息
    if (url.endsWith("getQuestionID")) {
      return resolve({ username: "dafdafa" });
    }

  });
}

module.exports = {
  find(url, params) {
    return fetchApi(url, params)
      .then(res => preProcessData(res));
  },
  initialize(url, params) {
    params = Object.assign({
      subject: 'kemu1',//科目类别 科1:kemu1,科目4:kemu3
      url: 'mnks',//题目分类
      city: '杭州',//城市汉字名
      chapterID: '1'      //章节ID
    }, params);
    return fetchApi(url, params)
      .then(res => preProcessInitData(res));
  }
}
