export default {

      /*
       * 时间戳转成日期时间格式
       * @params time 传入时间戳，必需
       * @params rules 转换规则，返回格式配置，默认返回date格式
       */
      formatDate(time, rules) {
          if (!time) {
              return;
          }
          var result = "";
          if (typeof time === "string" || typeof time === "number") {
              time = new Date(time * 1000);
              var   year = time.getFullYear();
              var   month = time.getMonth()+1;
              if(month < 10){
                month = "0"+ month;
              }
              var   date = time.getDate();
              if(date < 10){
                date = "0"+ date;
              }
              var   hour = time.getHours();
              var   minute = time.getMinutes();
              var   second = time.getSeconds();

              if (rules) {
                  switch (rules) {
                      case 'datetime':
                          result = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
                          break;
                      case 'date':
                          result = year + '-' + month + '-' + date;
                          break;
                      case 'noYear':
                            result = month + '.' + date;
                            break;
                  }
              } else {
                  result = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
              }
          }
          return result;
      },
      /**
       * 深拷贝方法
       * @params {Object} source 需要拷贝的对象
       * @return {Object} target 拷贝完成的新对象
       */
      copy: function _copy(source) {
          var target = {};
          for (var key in source) {
              if (source.hasOwnProperty(key)) {
                  if (typeof source[key] === "object") {
                      if (source[key] === null) {
                          target[key] = null;
                      } else if ({}.toString.call(source[key]).slice(8, -1).toLowerCase() === "array") {
                          target[key] = source[key].slice(0);
                      } else {
                          target[key] = _copy(source[key]);
                      }
                  } else {
                      target[key] = source[key];
                  }
              }
          }
          return target;
      },
}
