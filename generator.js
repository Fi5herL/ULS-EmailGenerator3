'use strict';

// ════════════════════════════════════════════════════════════
// Template Definitions
// ════════════════════════════════════════════════════════════

const INACTIVE_TEMPLATES = [
  {
    id: 'notice',
    name: 'Notice Inactive Letter',
    titleTemplate: 'Project Inactive Letter\u2013Project #PjNum#/\u95dc\u65bc\u0055\u004c\u9805\u76ee#PjNum#\u66ab\u505c\u901a\u77e5\u66f8',
    contentTemplate:
      '\u5c0a\u656c\u7684\u5ba2\u6236\uff1a\n\n\u611f\u8b1d\u60a8\u53ca\u8cb4\u516c\u53f8\u5c0d\u0055\u004c\u670d\u52d9\u7684\u4fe1\u4efb\u8207\u652f\u6301\u3002\n\n\u95dc\u65bc\u8cb4\u516c\u53f8xxx\u5e74xx\u6708\u63d0\u4ea4\u7684\u0055\u004c\u8a8d\u8b49\u9805\u76ee\uff0c\u8a8d\u8b49\u9805\u76ee\u7de8\u865f \u0023\u0050\u006a\u004e\u0075\u006d\u0023 \uff0c\u670d\u52d9\u8a02\u55ae\u7de8\u865f \u0023\u004f\u0064\u0072\u004e\u0075\u006d\u0023 \uff0c\u8a8d\u8b49\u7533\u8acb\u63cf\u8ff0 \u0023\u0050\u006a\u0053\u0063\u006f\u0070\u0065\u0023\uff0c\u6211\u5011\u4e0d\u5f97\u4e0d\u66f8\u9762\u901a\u77e5\u60a8\u53ca\u8cb4\u516c\u53f8\uff0c\u7531\u65bc\u672a\u63d0\u4f9b\u4e0b\u8ff0\u4fe1\u606f\u8a72\u9805\u76ee\u5df2\u4e0d\u80fd\u6b63\u5e38\u9032\u884c\u7522\u54c1\u8a8d\u8b49\u5be9\u6838\u3002\u5373\u65e5\u8d77\uff0c\u9805\u76ee\u9032\u5ea6\u8b8a\u66f4\u70ba\u66ab\u505c\u72c0\u614b\u3002\n\n\u70ba\u4e86\u7e7c\u7e8c\u63a8\u9032\u9805\u76ee\u9032\u7a0b\uff0c\u6211\u5011\u9700\u8981\u8cb4\u516c\u53f8\u76e1\u5feb\u63d0\u4f9b\u5982\u4e0b\u4fe1\u606f\n#Project Hold Reason#\n\n\u8acb\u77e5\u6089\uff0c\u5728\u0055\u004c\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u5982\u4e0a\u4fe1\u606f\u5f8c\uff0c\u60a8\u7684\u9805\u76ee\u65b9\u53ef\u91cd\u65b0\u555f\u52d5\u3002\u4efb\u4f55\u4e0d\u660e\u78ba\u4e4b\u8655\uff0c\u6b61\u8fce\u60a8\u96a8\u6642\u8207\u6211\u5011\u806f\u7e6b\uff0c\u6211\u5011\u4e5f\u5c07\u8207\u8cb4\u516c\u53f8\u4fdd\u6301\u7a4d\u6975\u7684\u4e92\u52d5\u4ee5\u76e1\u5feb\u91cd\u555f\u60a8\u7684\u8a8d\u8b49\u9805\u76ee\u3002\n\n\u9806\u795d\n\u5546\u7944\n\nProject Handler /Email:\nEngineer Manager /Email:'
  },
  {
    id: 'inactive1',
    name: 'Inactive Letter 1',
    titleTemplate: 'The 1st project inactive follow up letter\u2013Project #PjNum#/\u7b2c\u4e00\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8',
    contentTemplate:
      '\u5c0a\u656c\u7684\u5ba2\u6236\uff1a\n\n\u611f\u8b1d\u60a8\u53ca\u8cb4\u516c\u53f8\u5c0d\u0055\u004c\u670d\u52d9\u7684\u4fe1\u4efb\u8207\u652f\u6301\u3002\n\n\u95dc\u65bc\u8cb4\u516c\u53f8xxx\u5e74xx\u6708\u63d0\u4ea4\u7684\u0055\u004c\u8a8d\u8b49\u9805\u76ee\uff0c\u8a8d\u8b49\u9805\u76ee\u7de8\u865f#PjNum#\uff0c\u670d\u52d9\u8a02\u55ae\u7de8\u865f#OdrNum#\uff0c\u8a8d\u8b49\u7533\u8acb\u63cf\u8ff0#PjScope#\uff0c\u6211\u5011\u4e0d\u5f97\u4e0d\u66f8\u9762\u901a\u77e5\u60a8\u53ca\u8cb4\u516c\u53f8\uff0c\u7531\u65bc\u672a\u63d0\u4f9b\u4e0b\u8ff0\u4fe1\u606f\u8a72\u9805\u76ee\u5df2\u4e0d\u80fd\u6b63\u5e38\u9032\u884c\u7522\u54c1\u8a8d\u8b49\u5be9\u6838\u3002\u5373\u65e5\u8d77\uff0c\u9805\u76ee\u9032\u5ea6\u8b8a\u66f4\u70ba\u66ab\u505c\u72c0\u614b\u3002\n\n\u70ba\u4e86\u7e7c\u7e8c\u63a8\u9032\u9805\u76ee\u9032\u7a0b\uff0c\u6211\u5011\u9700\u8981\u8cb4\u516c\u53f8\u76e1\u5feb\u63d0\u4f9b\u5982\u4e0b\u4fe1\u606f\n#Project Hold Reason#\n\n\u5230\u76ee\u524d\u70ba\u6b62\uff0c\u6211\u5011\u5c1a\u672a\u5f9e\u8cb4\u516c\u53f8\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u4e0a\u8ff0\u4fe1\u606f\uff0c\u9805\u76ee\u4ecd\u8655\u65bc\u66ab\u505c\u72c0\u614b\u3002\n\n\u8acb\u77e5\u6089\uff0c\u5728\u0055\u004c\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u5982\u4e0a\u4fe1\u606f\u5f8c\uff0c\u60a8\u7684\u9805\u76ee\u65b9\u53ef\u91cd\u65b0\u555f\u52d5\u3002\u4efb\u4f55\u4e0d\u660e\u78ba\u4e4b\u8655\uff0c\u6b61\u8fce\u60a8\u96a8\u6642\u8207\u6211\u5011\u806f\u7e6b\uff0c\u6211\u5011\u4e5f\u5c07\u8207\u8cb4\u516c\u53f8\u4fdd\u6301\u7a4d\u6975\u7684\u4e92\u52d5\u4ee5\u76e1\u5feb\u91cd\u555f\u60a8\u7684\u8a8d\u8b49\u9805\u76ee\u3002\n\n\u9806\u795d\n\u5546\u7944\n\nProject Handler /Email:'
  },
  {
    id: 'inactive2',
    name: 'Inactive Letter 2',
    titleTemplate: 'The 2nd project inactive follow up letter\u2013Project #PjNum#/\u7b2c\u4e8c\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8',
    contentTemplate:
      '\u5c0a\u656c\u7684\u5ba2\u6236\uff1a\n\n\u611f\u8b1d\u60a8\u53ca\u8cb4\u516c\u53f8\u5c0d\u0055\u004c\u670d\u52d9\u7684\u4fe1\u4efb\u8207\u652f\u6301\u3002\n\n\u95dc\u65bc\u8cb4\u516c\u53f8xxx\u5e74xx\u6708\u63d0\u4ea4\u7684\u0055\u004c\u8a8d\u8b49\u9805\u76ee\uff0c\u8a8d\u8b49\u9805\u76ee\u7de8\u865f#PjNum#\uff0c\u670d\u52d9\u8a02\u55ae\u7de8\u865f#OdrNum#\uff0c\u8a8d\u8b49\u7533\u8acb\u63cf\u8ff0#PjScope#\uff0c\u6211\u5011\u4e0d\u5f97\u4e0d\u66f8\u9762\u901a\u77e5\u60a8\u53ca\u8cb4\u516c\u53f8\uff0c\u7531\u65bc\u672a\u63d0\u4f9b\u4e0b\u8ff0\u4fe1\u606f\u8a72\u9805\u76ee\u5df2\u4e0d\u80fd\u6b63\u5e38\u9032\u884c\u7522\u54c1\u8a8d\u8b49\u5be9\u6838\u3002\u5373\u65e5\u8d77\uff0c\u9805\u76ee\u9032\u5ea6\u8b8a\u66f4\u70ba\u66ab\u505c\u72c0\u614b\u3002\n\n\u70ba\u4e86\u7e7c\u7e8c\u63a8\u9032\u9805\u76ee\u9032\u7a0b\uff0c\u6211\u5011\u9700\u8981\u8cb4\u516c\u53f8\u76e1\u5feb\u63d0\u4f9b\u5982\u4e0b\u4fe1\u606f\n#Project Hold Reason#\n\n\u4e00\u500b\u6708\u524d\uff0c\u6211\u5011\u767c\u51fa\u7b2c\u4e00\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8\uff0c\u4f46\u5230\u76ee\u524d\u70ba\u6b62\uff0c\u6211\u5011\u4ecd\u672a\u5f9e\u8cb4\u516c\u53f8\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u4e0a\u8ff0\u4fe1\u606f\uff0c\u9805\u76ee\u4ecd\u8655\u65bc\u66ab\u505c\u72c0\u614b\u3002\n\n\u8acb\u77e5\u6089\uff0c\u5728\u0055\u004c\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u5982\u4e0a\u4fe1\u606f\u5f8c\uff0c\u60a8\u7684\u9805\u76ee\u65b9\u53ef\u91cd\u65b0\u555f\u52d5\u3002\u4efb\u4f55\u4e0d\u660e\u78ba\u4e4b\u8655\uff0c\u6b61\u8fce\u60a8\u96a8\u6642\u8207\u6211\u5011\u806f\u7e6b\uff0c\u6211\u5011\u4e5f\u5c07\u8207\u8cb4\u516c\u53f8\u4fdd\u6301\u7a4d\u6975\u7684\u4e92\u52d5\u4ee5\u76e1\u5feb\u91cd\u555f\u60a8\u7684\u8a8d\u8b49\u9805\u76ee\u3002\n\n\u9806\u795d\n\u5546\u7944\n\nProject Handler /Email:'
  },
  {
    id: 'inactive3',
    name: 'Inactive Letter 3',
    titleTemplate: 'The 3rd project inactive follow up letter\u2013Project #PjNum#/\u7b2c\u4e09\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8',
    contentTemplate:
      '\u5c0a\u656c\u7684\u5ba2\u6236\uff1a\n\n\u611f\u8b1d\u60a8\u53ca\u8cb4\u516c\u53f8\u5c0d\u0055\u004c\u670d\u52d9\u7684\u4fe1\u4efb\u8207\u652f\u6301\u3002\n\n\u95dc\u65bc\u8cb4\u516c\u53f8xxx\u5e74xx\u6708\u63d0\u4ea4\u7684\u0055\u004c\u8a8d\u8b49\u9805\u76ee\uff0c\u8a8d\u8b49\u9805\u76ee\u7de8\u865f#PjNum#\uff0c\u670d\u52d9\u8a02\u55ae\u7de8\u865f#OdrNum#\uff0c\u8a8d\u8b49\u7533\u8acb\u63cf\u8ff0#PjScope#\uff0c\u6211\u5011\u4e0d\u5f97\u4e0d\u66f8\u9762\u901a\u77e5\u60a8\u53ca\u8cb4\u516c\u53f8\uff0c\u7531\u65bc\u672a\u63d0\u4f9b\u4e0b\u8ff0\u4fe1\u606f\u8a72\u9805\u76ee\u5df2\u4e0d\u80fd\u6b63\u5e38\u9032\u884c\u7522\u54c1\u8a8d\u8b49\u5be9\u6838\u3002\u5373\u65e5\u8d77\uff0c\u9805\u76ee\u9032\u5ea6\u8b8a\u66f4\u70ba\u66ab\u505c\u72c0\u614b\u3002\n\n\u70ba\u4e86\u7e7c\u7e8c\u63a8\u9032\u9805\u76ee\u9032\u7a0b\uff0c\u6211\u5011\u9700\u8981\u8cb4\u516c\u53f8\u76e1\u5feb\u63d0\u4f9b\u5982\u4e0b\u4fe1\u606f\n#Project Hold Reason#\n\n\u4e8c\u500b\u6708\u524d\uff0c\u6211\u5011\u767c\u51fa\u7b2c\u4e00\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8\uff0c\u4e26\u4e14\u5728\u4e00\u500b\u6708\u524d\uff0c\u5411\u8cb4\u53f8\u767c\u51fa\u7b2c\u4e8c\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8\uff0c\u4f46\u662f\u5230\u76ee\u524d\u70ba\u6b62\uff0c\u6211\u5011\u4ecd\u672a\u5f9e\u8cb4\u516c\u53f8\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u4e0a\u8ff0\u4fe1\u606f\uff0c\u9805\u76ee\u4f9d\u820a\u8655\u65bc\u66ab\u505c\u72c0\u614b\u3002\n\n\u8acb\u77e5\u6089\uff0c\u5728\u0055\u004c\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u5982\u4e0a\u4fe1\u606f\u5f8c\uff0c\u60a8\u7684\u9805\u76ee\u65b9\u53ef\u91cd\u65b0\u555f\u52d5\u3002\u4efb\u4f55\u4e0d\u660e\u78ba\u4e4b\u8655\uff0c\u6b61\u8fce\u60a8\u96a8\u6642\u8207\u6211\u5011\u806f\u7e6b\uff0c\u6211\u5011\u4e5f\u5c07\u8207\u8cb4\u516c\u53f8\u4fdd\u6301\u7a4d\u6975\u7684\u4e92\u52d5\u4ee5\u76e1\u5feb\u91cd\u555f\u60a8\u7684\u8a8d\u8b49\u9805\u76ee\u3002\n\n\u9806\u795d\n\u5546\u7944\n\nProject Handler /Email:\nField Sales /Email:'
  },
  {
    id: 'final',
    name: 'Inactive Letter Final',
    titleTemplate: 'The final notice before project close by letter \u2013 Project #PjNum#/\u9805\u76ee\u7d42\u6b62\u524d\u6700\u5f8c\u63d0\u9192',
    contentTemplate:
      '\u5c0a\u656c\u7684\u5ba2\u6236\uff1a\n\u611f\u8b1d\u60a8\u53ca\u8cb4\u516c\u53f8\u5c0d\u0055\u004c\u670d\u52d9\u7684\u4fe1\u4efb\u8207\u652f\u6301\u3002\n\u95dc\u65bc\u8cb4\u516c\u53f8xxx\u5e74xx\u6708\u63d0\u4ea4\u7684\u0055\u004c\u8a8d\u8b49\u9805\u76ee\uff0c\u8a8d\u8b49\u9805\u76ee\u7de8\u865f#PjNum#\uff0c\u670d\u52d9\u8a02\u55ae\u7de8\u865f\uff1a \u0023\u004f\u0064\u0072\u004e\u0075\u006d\u0023, \u8a8d\u8b49\u7533\u8acb\u63cf\u8ff0 #PjScope#\u3002\u7d04\u56db\u500b\u6708\u524d\uff0c\u6211\u5011\u66fe\u66f8\u9762\u901a\u77e5\u60a8\u53ca\u8cb4\u516c\u53f8\uff0c\u7531\u65bc\u672a\u63d0\u4f9b\u4e0b\u8ff0\u4fe1\u606f\u8a72\u9805\u76ee\u5df2\u4e0d\u80fd\u6b63\u5e38\u9032\u884c\u7522\u54c1\u8a8d\u8b49\u5be9\u6838\u3002\u9805\u76ee\u9032\u5ea6\u8b8a\u66f4\u70ba\u66ab\u505c\u72c0\u614b\u3002\n\u70ba\u4e86\u7e7c\u7e8c\u63a8\u9032\u9805\u76ee\u9032\u7a0b\uff0c\u6211\u5011\u9700\u8981\u8cb4\u516c\u53f8\u76e1\u5feb\u63d0\u4f9b\u5982\u4e0b\u4fe1\u606f\uff0c\u6216\u5c31\u8a72\u7b49\u4fe1\u606f\u548c\u6750\u6599\u7684\u63d0\u4ea4\u63d0\u51fa\u660e\u78ba\u7684\u6642\u9593\u8868\u3002\n#Project Hold Reason#\n\n\u7531\u65bc\u672a\u80fd\u6536\u5230\u6709\u6548\u53cd\u994b\uff0c\u7d04\u4e09\u500b\u6708\u524d\uff0c\u6211\u5011\u767c\u51fa\u7b2c\u4e00\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8\uff0c\u4e26\u4e14\u5728\u96a8\u5f8c\u4e8c\u500b\u6708\uff0c\u63a5\u9023\u5411\u8cb4\u53f8\u767c\u51fa\u7b2c\u4e8c\u6b21\u4ee5\u53ca\u7b2c\u4e09\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8\u3002\u4f46\u662f\u5230\u76ee\u524d\u70ba\u6b62\uff0c\u6211\u5011\u4ecd\u672a\u5f9e\u8cb4\u516c\u53f8\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u4e0a\u8ff0\u4fe1\u606f\uff0c\u9805\u76ee\u59cb\u7d42\u8655\u65bc\u66ab\u505c\u72c0\u614b\u3002\n\n\u6839\u64da\u904e\u53bb\u56db\u500b\u6708\u7684\u9805\u76ee\u9032\u5c55\u72c0\u6cc1\uff0c\u6211\u5011\u5728\u6b64\u6700\u5f8c\u4e00\u6b21\u5411\u60a8\u767c\u51fa\u9805\u76ee\u63d0\u9192\u51fd\uff0c\u8acb\u60a8\u52d9\u5fc5\u5f15\u8d77\u91cd\u8996\uff0c\u5982\u679c\u8a72\u9805\u76ee\u5728\u672a\u4f86\u5169\u9031\u5167\uff0c\u4e5f\u5c31\u662f#DeadlineDate#\u524d\u60a8\u4ecd\u4e0d\u80fd\u63d0\u4f9b\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u4e0a\u8ff0\u5fc5\u8981\u4fe1\u606f/\u6a23\u54c1\uff0c\u6211\u5011\u4e0d\u5f97\u4e0d\u9057\u61be\u7684\u901a\u77e5\u60a8\uff0c\u6211\u5011\u5c07\u7d42\u6b62\u8cb4\u516c\u53f8\u300c#OdrNum#\u300d\u865f\u670d\u52d9\u8a02\u55ae\u53ca\u5176\u9805\u4e0b\u4e4b#PjNum#\u8a8d\u8b49\u9805\u76ee\u3002\u9805\u76ee\u7d42\u6b62\u5f8c\uff0c\u6211\u5011\u5c07\u5c31\u6211\u53f8\u5df2\u7d93\u63d0\u4f9b\u7684\u670d\u52d9\u5411\u60a8\u6536\u53d6\u76f8\u61c9\u7684\u8cbb\u7528\uff1b\u9805\u76ee\u63a1\u7528\u9810\u4ed8\u6b3e\u65b9\u5f0f\u652f\u4ed8\u7684\uff0c\u6211\u5011\u5c07\u5728\u6263\u9664\u5fc5\u8981\u8cbb\u7528\u5f8c\uff0c\u9000\u9084\u60a8\u7684\u5269\u9918\u6b3e\u9805\u3002\u5982\u4ee5\u4e0a\u670d\u52d9\u9700\u6c42\u5728\u672a\u4f86\u9700\u8981\u518d\u6b21\u555f\u52d5\uff0c\u60a8\u53ef\u4ee5\u5411\u6211\u5011\u7d22\u53d6\u4e00\u4efd\u65b0\u7684\u6b63\u5f0f\u5831\u50f9\uff08\u5831\u50f9\u6709\u6548\u671f\u70ba\u4e09\u500b\u6708\uff09\u3002\u6211\u5011\u5c07\u91cd\u65b0\u6838\u5b9a\u8cb4\u516c\u53f8\u7684\u670d\u52d9\u9700\u6c42\uff0c\u4e26\u5411\u60a8\u767c\u51fa\u65b0\u7684\u5831\u50f9\u3002\n\n\u9806\u795d\n\u5546\u7944\n\nField Sales /Email:       Project Handler /Email:\nSales Manager /Email:       Engineer Manager /Email:'
  }
];

const CLOSE_LETTER_TEMPLATE = {
  id: 'close',
  name: 'Close Letter',
  titleTemplate: 'Close Letter for Project No {pjNum}',
  contentTemplate:
    'Dear {clientName},\n\nIt was a pleasure to meet with you on MM/DD, {pjScope} is carried out.\nPlease also agree to use this letter as the basis for closing the project of {pjNum}.\n\nThank you.\n\nBR,\n{projectHandlerEmail}'
};

const NOA_TEMPLATE = {
  id: 'noa',
  name: 'NOA Follow-up',
  titleTemplate: 'NOA Letter for {pjNum}',
  contentTemplate:
    "Dear {clientName},\n\nCongratulations! UL's investigation of your product has been completed and the products were determined to comply with the applicable requirements.\n\nThe attached is a Notice of Authorization for your reference.\n\nIf there is any other way in which I can help, do not hesitate to contact me.\n\n{projectHandlerEmail}"
};

const TRAVEL_TEMPLATE = {
  id: 'travel',
  name: 'Travel Approval',
  titleTemplate: 'Travel Approval for pj.{pjNum} - {dates} - From {from} to {to}',
  contentTemplate:
    'Dear Manager,\n\nI would like to apply for a business trip. Details:\n\nReason:\n{tripReason}\n\nDates:\n{dateLines}\n\nLocations/Legs:\nFrom: {from}. To: {to}\n\nCharge & Account Allocation:\n- {chargeType}\n\nPlease approve.\n\nThank you!\n{projectHandlerEmail}'
};

// All templates keyed by id
const ALL_TEMPLATES = {};
[...INACTIVE_TEMPLATES, CLOSE_LETTER_TEMPLATE, NOA_TEMPLATE, TRAVEL_TEMPLATE].forEach(t => {
  ALL_TEMPLATES[t.id] = t;
});

// ════════════════════════════════════════════════════════════
// Known Field Definitions
// ════════════════════════════════════════════════════════════

const KNOWN_FIELDS = [
  { id: 'projectNumber',       label: 'Project Number' },
  { id: 'orderNumber',         label: 'Order Number' },
  { id: 'projectName',         label: 'Project Name' },
  { id: 'projectScope',        label: 'Project Scope' },
  { id: 'holdReason',          label: 'Project Hold Reason' },
  { id: 'dateBooked',          label: 'Date Booked (M/D/YYYY)' },
  { id: 'clientName',          label: 'Client Name' },
  { id: 'clientEmail',         label: 'Client Email' },
  { id: 'projectHandlerEmail', label: 'Project Handler Email' },
  { id: 'deadlineDate',        label: 'Deadline Date (M/D/YYYY, optional)' },
  { id: '_ignore',             label: '— Ignore this column —' }
];

// ════════════════════════════════════════════════════════════
// Application State
// ════════════════════════════════════════════════════════════

let parsedRows = [];        // array of string arrays (first = headers)
let dataRows = [];          // rows after header
let columnHeaders = [];     // detected or generated column labels
let columnMapping = {};     // colIndex → fieldId
let selectedRowIdx = -1;
let activeTemplateId = null;

// ════════════════════════════════════════════════════════════
// Utility: Date / ROC calendar
// ════════════════════════════════════════════════════════════

function toROCYearMonth(dateStr) {
  if (!dateStr) return 'xxx\u5e74xx\u6708';
  const parts = String(dateStr).trim().split('/');
  if (parts.length < 3) return dateStr;
  const month = parseInt(parts[0], 10);
  const year  = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month)) return dateStr;
  return '\u4e2d\u83ef\u6c11\u570b' + (year - 1911) + '\u5e74' + month + '\u6708';
}

function toROCDateFull(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return '\u4e2d\u83ef\u6c11\u570b' + (y - 1911) + '\u5e74' + m + '\u6708' + d + '\u65e5';
}

function calcDeadlineDate(deadlineDateStr) {
  if (deadlineDateStr) {
    const parts = String(deadlineDateStr).trim().split('/');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
      if (!isNaN(d.getTime())) return toROCDateFull(d);
    }
    return deadlineDateStr;
  }
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return toROCDateFull(d);
}

// ════════════════════════════════════════════════════════════
// Utility: Template substitution
// ════════════════════════════════════════════════════════════

function substituteTemplate(template, f) {
  let s = template;
  const pjNum    = f.projectNumber       || '';
  const odrNum   = f.orderNumber         || '';
  const pjScope  = f.projectScope        || '';
  const pjName   = f.projectName         || '';
  const holdR    = f.holdReason          || '';
  const client   = f.clientName          || '';
  const cEmail   = f.clientEmail         || '';
  const handler  = f.projectHandlerEmail || '';
  const rocYM    = toROCYearMonth(f.dateBooked);
  const deadline = calcDeadlineDate(f.deadlineDate || '');

  // Inactive letter placeholders
  s = s.replace(/#PjNum#/g, pjNum);
  s = s.replace(/#OdrNum#/g, odrNum);
  s = s.replace(/#PjScope#/g, pjScope);
  s = s.replace(/#PjName#/g, pjName);
  s = s.replace(/#Project Hold Reason#/g, holdR);
  s = s.replace(/xxx\u5e74xx\u6708/g, rocYM);
  s = s.replace(/#DeadlineDate#/g, deadline);

  // Close / NOA / Travel placeholders
  s = s.replace(/\{pjNum\}/g, pjNum);
  s = s.replace(/\{clientName\}/g, client);
  s = s.replace(/\{clientEmail\}/g, cEmail);
  s = s.replace(/\{pjScope\}/g, pjScope);
  s = s.replace(/\{projectHandlerEmail\}/g, handler);

  return s;
}

// ════════════════════════════════════════════════════════════
// Utility: Parsing
// ════════════════════════════════════════════════════════════

function parseTabSeparated(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const rows = [];
  for (const line of lines) {
    if (line.trim() === '') continue;
    rows.push(line.split('\t'));
  }
  return rows;
}

function looksLikeHeader(cell) {
  const lower = String(cell).toLowerCase().trim();
  const keywords = ['project', 'order', 'scope', 'hold', 'reason', 'date', 'client',
                    'email', 'handler', 'deadline', 'name', 'number', 'booked', 'sales'];
  return keywords.some(k => lower.includes(k));
}

function autoDetectHeaderRow(rows) {
  if (rows.length === 0) return false;
  const first = rows[0];
  const hits = first.filter(c => looksLikeHeader(c)).length;
  return hits >= Math.min(2, first.length);
}

const FIELD_HINTS = {
  projectNumber:       ['oracle project', 'project number', 'project no', 'project#', 'pj num', 'pjnum'],
  orderNumber:         ['order number', 'order no', 'order#', 'odr num', 'odrnum'],
  projectName:         ['project name', 'pj name'],
  projectScope:        ['project scope', 'scope', 'description', 'pjscope'],
  holdReason:          ['hold reason', 'hold', 'reason'],
  dateBooked:          ['date booked', 'booked', 'booking date', 'date'],
  clientName:          ['client name', 'client', 'customer', 'company'],
  clientEmail:         ['client email', 'customer email', 'contact email'],
  projectHandlerEmail: ['handler email', 'project handler', 'handler'],
  deadlineDate:        ['deadline', 'deadline date']
};

function autoMapColumn(header) {
  const h = String(header).toLowerCase().trim();
  for (const [fieldId, hints] of Object.entries(FIELD_HINTS)) {
    if (hints.some(hint => h.includes(hint))) return fieldId;
  }
  return '_ignore';
}

// ════════════════════════════════════════════════════════════
// UI: Step 1 — Parse
// ════════════════════════════════════════════════════════════

function parseData() {
  const raw = document.getElementById('data-input').value.trim();
  if (!raw) {
    setParseStatus('No data entered.', 'warn');
    return;
  }
  const rows = parseTabSeparated(raw);
  if (rows.length === 0) {
    setParseStatus('Could not parse any rows.', 'warn');
    return;
  }

  parsedRows = rows;
  const hasHeaders = autoDetectHeaderRow(rows);

  if (hasHeaders) {
    columnHeaders = rows[0].map(c => c.trim());
    dataRows = rows.slice(1);
  } else {
    columnHeaders = rows[0].map((_, i) => 'Column ' + (i + 1));
    dataRows = rows;
  }

  // Build initial mapping
  columnMapping = {};
  columnHeaders.forEach((h, i) => {
    columnMapping[i] = autoMapColumn(hasHeaders ? h : '');
  });

  setParseStatus(
    (hasHeaders ? 'Headers detected. ' : 'No headers detected — using column numbers. ') +
    dataRows.length + ' data row(s) found.',
    'ok'
  );

  renderColumnMapping();
  renderRowTable();
  show('mapping-section');
  show('step2-card');
  show('step3-card');
}

function setParseStatus(msg, type) {
  const el = document.getElementById('parse-status');
  el.textContent = msg;
  el.style.color = type === 'warn' ? '#e65100' : type === 'ok' ? '#2e7d32' : '#666';
}

// ════════════════════════════════════════════════════════════
// UI: Column Mapping
// ════════════════════════════════════════════════════════════

function renderColumnMapping() {
  const tbody = document.getElementById('mapping-tbody');
  tbody.innerHTML = '';

  const sampleRow = dataRows[0] || [];

  columnHeaders.forEach((header, i) => {
    const tr = document.createElement('tr');

    const sample = (sampleRow[i] || '').substring(0, 40);
    const sel = buildFieldSelect(i, columnMapping[i] || '_ignore');

    tr.innerHTML =
      '<td>' + (i + 1) + '</td>' +
      '<td><strong>' + escHtml(header) + '</strong></td>' +
      '<td>' + escHtml(sample) + '</td>' +
      '<td></td>';

    tr.cells[3].appendChild(sel);
    tbody.appendChild(tr);
  });
}

function buildFieldSelect(colIdx, selectedFieldId) {
  const sel = document.createElement('select');
  sel.dataset.col = colIdx;
  sel.addEventListener('change', () => {
    columnMapping[colIdx] = sel.value;
  });
  for (const f of KNOWN_FIELDS) {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.label;
    if (f.id === selectedFieldId) opt.selected = true;
    sel.appendChild(opt);
  }
  return sel;
}

// ════════════════════════════════════════════════════════════
// UI: Row Table
// ════════════════════════════════════════════════════════════

function renderRowTable() {
  const head = document.getElementById('row-table-head');
  const body = document.getElementById('row-table-body');
  head.innerHTML = '';
  body.innerHTML = '';

  // Build display columns: only mapped (non-ignore) columns
  const displayCols = columnHeaders
    .map((h, i) => ({ idx: i, header: h, fieldId: columnMapping[i] }))
    .filter(c => c.fieldId && c.fieldId !== '_ignore');

  if (displayCols.length === 0) {
    // Fall back to show all
    columnHeaders.forEach((h, i) => displayCols.push({ idx: i, header: h, fieldId: columnMapping[i] }));
  }

  // Header row
  const thIdx = document.createElement('th');
  thIdx.textContent = '#';
  head.appendChild(thIdx);
  displayCols.forEach(c => {
    const th = document.createElement('th');
    const field = KNOWN_FIELDS.find(f => f.id === c.fieldId);
    th.textContent = field ? field.label : c.header;
    head.appendChild(th);
  });

  // Data rows
  dataRows.forEach((row, rowI) => {
    const tr = document.createElement('tr');
    tr.dataset.rowIdx = rowI;
    if (rowI === selectedRowIdx) tr.classList.add('selected');

    const tdIdx = document.createElement('td');
    tdIdx.textContent = rowI + 1;
    tr.appendChild(tdIdx);

    displayCols.forEach(c => {
      const td = document.createElement('td');
      td.textContent = (row[c.idx] || '').substring(0, 50);
      td.title = row[c.idx] || '';
      tr.appendChild(td);
    });

    tr.addEventListener('click', () => selectRow(rowI));
    body.appendChild(tr);
  });
}

function selectRow(idx) {
  selectedRowIdx = idx;
  document.querySelectorAll('#row-table-body tr').forEach(tr => {
    tr.classList.toggle('selected', parseInt(tr.dataset.rowIdx, 10) === idx);
  });
  const infoEl = document.getElementById('selected-row-info');
  const pjNum = getFieldValue(idx, 'projectNumber');
  infoEl.textContent = 'Row ' + (idx + 1) + ' selected' + (pjNum ? ' — Project: ' + pjNum : '');
  show('selected-row-info');
  // Deactivate current template
  document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
  activeTemplateId = null;
  hide('step4-card');
  hide('travel-form-section');
  hide('generate-btn');
}

// ════════════════════════════════════════════════════════════
// UI: Field value extraction
// ════════════════════════════════════════════════════════════

function getFieldValue(rowIdx, fieldId) {
  if (rowIdx < 0 || rowIdx >= dataRows.length) return '';
  const row = dataRows[rowIdx];
  const colIdx = Object.entries(columnMapping).find(([, fId]) => fId === fieldId);
  if (!colIdx) return '';
  return (row[parseInt(colIdx[0], 10)] || '').trim();
}

function getFields(rowIdx) {
  const f = {};
  KNOWN_FIELDS.forEach(field => {
    if (field.id !== '_ignore') f[field.id] = getFieldValue(rowIdx, field.id);
  });
  return f;
}

// ════════════════════════════════════════════════════════════
// UI: Template buttons
// ════════════════════════════════════════════════════════════

function onTemplateBtn(templateId) {
  if (selectedRowIdx < 0) {
    showOutputAlert('Please select a data row first (Step 2).', 'warn');
    show('step4-card');
    return;
  }

  document.querySelectorAll('.template-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tpl === templateId);
  });

  activeTemplateId = templateId;

  if (templateId === 'travel') {
    show('travel-form-section');
    document.getElementById('travel-form-section').classList.add('visible');
    hide('generate-btn');
  } else {
    hide('travel-form-section');
    document.getElementById('travel-form-section').classList.remove('visible');
    show('generate-btn');
  }
}

function generateEmail() {
  if (!activeTemplateId || activeTemplateId === 'travel') return;
  if (selectedRowIdx < 0) {
    showOutputAlert('Please select a data row first.', 'warn');
    return;
  }
  const tpl = ALL_TEMPLATES[activeTemplateId];
  if (!tpl) return;

  const fields = getFields(selectedRowIdx);
  const title   = substituteTemplate(tpl.titleTemplate, fields);
  const content = substituteTemplate(tpl.contentTemplate, fields);

  showOutput(title, content);
}

// ════════════════════════════════════════════════════════════
// UI: Travel Approval
// ════════════════════════════════════════════════════════════

function addTravelDate() {
  const list = document.getElementById('dates-list');
  const row  = document.createElement('div');
  row.className = 'date-row';
  const input = document.createElement('input');
  input.type = 'date';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-remove-date';
  btn.textContent = '×';
  btn.addEventListener('click', () => row.remove());
  row.appendChild(input);
  row.appendChild(btn);
  list.appendChild(row);
}

function generateTravelApproval() {
  if (selectedRowIdx < 0) {
    showOutputAlert('Please select a data row first.', 'warn');
    show('step4-card');
    return;
  }

  const fields     = getFields(selectedRowIdx);
  const tripReason = document.getElementById('trip-reason').value.trim() || '[trip reason]';
  const fromLoc    = document.getElementById('travel-from').value.trim()  || '[from]';
  const toLoc      = document.getElementById('travel-to').value.trim()    || '[to]';
  const chargeType = document.getElementById('charge-type').value.trim()  || '[charge type]';

  const dateInputs = document.querySelectorAll('#dates-list input[type="date"]');
  const dateList   = Array.from(dateInputs).map(inp => inp.value).filter(Boolean);
  const dateLines  = dateList.length ? dateList.map(d => '- ' + d).join('\n') : '- [date]';
  const datesStr   = dateList.length ? dateList.join(', ') : '[dates]';

  const tpl = TRAVEL_TEMPLATE;
  let title   = substituteTemplate(tpl.titleTemplate, fields);
  let content = substituteTemplate(tpl.contentTemplate, fields);

  title   = title.replace(/\{dates\}/g, datesStr).replace(/\{from\}/g, fromLoc).replace(/\{to\}/g, toLoc);
  content = content
    .replace(/\{tripReason\}/g, tripReason)
    .replace(/\{dateLines\}/g, dateLines)
    .replace(/\{from\}/g, fromLoc)
    .replace(/\{to\}/g, toLoc)
    .replace(/\{chargeType\}/g, chargeType);

  showOutput(title, content);
}

// ════════════════════════════════════════════════════════════
// UI: Output display
// ════════════════════════════════════════════════════════════

function showOutput(title, content) {
  document.getElementById('output-title').value = title;
  document.getElementById('output-body').value  = content;
  resetCopyHints();
  show('step4-card');
  document.getElementById('step4-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetCopyHints() {
  document.getElementById('copy-hint-title').textContent = 'Click textarea to copy';
  document.getElementById('copy-hint-title').className = 'copy-hint';
  document.getElementById('copy-hint-body').textContent  = 'Click textarea to copy';
  document.getElementById('copy-hint-body').className = 'copy-hint';
  document.getElementById('output-title').classList.remove('copied');
  document.getElementById('output-body').classList.remove('copied');
}

function copyTextarea(areaId, hintId) {
  const area = document.getElementById(areaId);
  const text = area.value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    area.classList.add('copied');
    const hint = document.getElementById(hintId);
    hint.textContent = '✓ Copied!';
    hint.className = 'copy-hint copy-hint-active';
    setTimeout(() => {
      area.classList.remove('copied');
      hint.textContent = 'Click textarea to copy';
      hint.className = 'copy-hint';
    }, 2000);
  }).catch(err => {
    console.warn('[ULS] Clipboard write failed:', err);
  });
}

function openMailto() {
  const subject = document.getElementById('output-title').value;
  const body    = document.getElementById('output-body').value;
  if (!subject && !body) return;
  const fields = selectedRowIdx >= 0 ? getFields(selectedRowIdx) : {};
  const to = fields.clientEmail || '';
  const link = 'mailto:' + encodeURIComponent(to) +
    '?subject=' + encodeURIComponent(subject) +
    '&body='    + encodeURIComponent(body);
  window.open(link, '_blank');
}

function showOutputAlert(msg, type) {
  const el = document.getElementById('output-alert');
  el.className = 'alert alert-' + (type === 'warn' ? 'warning' : type === 'ok' ? 'success' : 'info');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

// ════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════

function show(id) { document.getElementById(id).classList.remove('hidden'); }
function hide(id) { document.getElementById(id).classList.add('hidden'); }

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ════════════════════════════════════════════════════════════
// Init
// ════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Parse button
  document.getElementById('parse-btn').addEventListener('click', parseData);

  // Clear button
  document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('data-input').value = '';
    document.getElementById('parse-status').textContent = '';
    hide('mapping-section');
    hide('step2-card');
    hide('step3-card');
    hide('step4-card');
    parsedRows = []; dataRows = []; columnHeaders = []; columnMapping = {};
    selectedRowIdx = -1; activeTemplateId = null;
  });

  // Apply mapping button
  document.getElementById('apply-mapping-btn').addEventListener('click', () => {
    renderRowTable();
    show('step2-card');
  });

  // Template buttons
  document.querySelectorAll('.template-btn').forEach(btn => {
    btn.addEventListener('click', () => onTemplateBtn(btn.dataset.tpl));
  });

  // Generate button
  document.getElementById('generate-btn').addEventListener('click', generateEmail);

  // Travel generate button
  document.getElementById('generate-travel-btn').addEventListener('click', generateTravelApproval);

  // Add date button
  document.getElementById('add-date-btn').addEventListener('click', addTravelDate);
  addTravelDate(); // add one default date row

  // Output copy on click
  document.getElementById('output-title').addEventListener('click', () => {
    copyTextarea('output-title', 'copy-hint-title');
  });
  document.getElementById('output-body').addEventListener('click', () => {
    copyTextarea('output-body', 'copy-hint-body');
  });

  // Copy buttons
  document.getElementById('copy-title-btn').addEventListener('click', () => {
    copyTextarea('output-title', 'copy-hint-title');
  });
  document.getElementById('copy-body-btn').addEventListener('click', () => {
    copyTextarea('output-body', 'copy-hint-body');
  });

  // Mailto button
  document.getElementById('mailto-btn').addEventListener('click', openMailto);
});
