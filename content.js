/* global chrome */
(function () {
  'use strict';

  // ── Prevent double injection ────────────────────────
  if (document.getElementById('uls-panel')) return;

  // ════════════════════════════════════════════════════
  // Inject styles
  // ════════════════════════════════════════════════════
  (function injectStyles() {
    const style = document.createElement('style');
    style.id = 'uls-panel-styles';
    style.textContent = `
#uls-panel{position:fixed;bottom:20px;right:20px;width:400px;background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.18);z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#333;display:flex;flex-direction:column;max-height:90vh;user-select:none}
#uls-panel.uls-collapsed #uls-panel-body{display:none}
#uls-panel-header{background:#673ab7;color:#fff;padding:8px 10px;border-radius:8px 8px 0 0;display:flex;align-items:center;cursor:pointer;gap:6px;flex-shrink:0}
.uls-panel-title{flex:1;font-weight:700;font-size:13px;letter-spacing:.3px}
.uls-header-btn{background:rgba(255,255,255,.2);color:#fff;border:none;border-radius:3px;width:22px;height:22px;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s}
.uls-header-btn:hover{background:rgba(255,255,255,.35)}
#uls-panel-body{overflow-y:auto;flex:1;padding:8px;display:flex;flex-direction:column;gap:6px}
.uls-section{border:1px solid #e8e8e8;border-radius:5px;overflow:hidden}
.uls-section-title{background:#f5f5f5;padding:5px 8px;font-size:11px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.4px;border-bottom:1px solid #e8e8e8}
.uls-section-body{padding:6px 8px}
.uls-info-grid{display:grid;grid-template-columns:auto 1fr;gap:2px 8px;font-size:11.5px}
.uls-info-label{color:#888;white-space:nowrap;font-weight:500}
.uls-info-value{color:#333;word-break:break-all;font-weight:600}
.uls-btn-row{display:flex;flex-wrap:wrap;gap:4px;padding:4px 0 2px}
.uls-btn{background:#e0e0e0;color:#333;border:none;border-radius:3px;padding:5px 10px;font-size:12px;cursor:pointer;transition:background .12s;white-space:nowrap}
.uls-btn:hover{background:#d0d0d0}
.uls-btn-primary{background:#673ab7!important;color:#fff!important}
.uls-btn-primary:hover{background:#5e35b1!important}
.uls-btn-sm{padding:3px 8px!important;font-size:11px!important}
.uls-btn-link{background:#e8f4fd!important;color:#1565c0!important}
.uls-btn-link:hover{background:#bbdefb!important}
.uls-output-label{font-size:11px;font-weight:600;color:#888;margin-bottom:2px;display:flex;align-items:center;justify-content:space-between}
.uls-copy-hint{font-size:10px;font-weight:400;color:#bbb}
.uls-copy-hint-ok{color:#4caf50}
.uls-textarea{width:100%;border:1px solid #ccc;border-radius:3px;padding:5px;font-size:11.5px;font-family:inherit;resize:vertical;background:#fafafa;color:#333;cursor:pointer;box-sizing:border-box}
.uls-textarea:hover{border-color:#673ab7;background:#fff}
.uls-textarea-copied{border-color:#4caf50!important;background:#f1fff4!important}
.uls-textarea-subject{min-height:40px}
.uls-textarea-body{min-height:120px}
#uls-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483646;display:flex;align-items:center;justify-content:center}
#uls-modal{background:#fff;border-radius:8px;width:460px;max-width:96vw;max-height:88vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.28);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#333}
.uls-modal-header{background:#673ab7;color:#fff;padding:10px 14px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:space-between}
.uls-modal-title{font-weight:700;font-size:14px}
.uls-modal-body{padding:14px;display:flex;flex-direction:column;gap:10px}
.uls-form-group{display:flex;flex-direction:column;gap:3px}
.uls-form-label{font-size:11.5px;font-weight:600;color:#555}
.uls-input{border:1px solid #ccc;border-radius:3px;padding:5px 7px;font-size:12.5px;background:#fafafa;color:#333;font-family:inherit;width:100%;box-sizing:border-box}
.uls-input:focus{outline:none;border-color:#673ab7;background:#fff}
.uls-form-textarea{border:1px solid #ccc;border-radius:3px;padding:5px 7px;font-size:12.5px;font-family:inherit;background:#fafafa;color:#333;width:100%;min-height:60px;resize:vertical;box-sizing:border-box}
.uls-form-textarea:focus{outline:none;border-color:#673ab7;background:#fff}
.uls-date-row-modal{display:flex;gap:6px;align-items:center;margin-bottom:4px}
.uls-date-row-modal .uls-input{flex:1}
.uls-remove-btn{background:#ef9a9a;color:#b71c1c;border:none;border-radius:3px;padding:3px 8px;font-size:14px;cursor:pointer;line-height:1}
.uls-remove-btn:hover{background:#e57373}
.uls-modal-footer{padding:10px 14px;border-top:1px solid #e0e0e0;display:flex;gap:6px;justify-content:flex-end}
`;
    (document.head || document.documentElement).appendChild(style);
  })();

  // ════════════════════════════════════════════════════
  // Email Templates (same as generator.js)
  // ════════════════════════════════════════════════════

  const INACTIVE_TEMPLATES = [
    {
      id: 'notice',
      name: 'Notice',
      titleTemplate: 'Project Inactive Letter\u2013Project #PjNum#/\u95dc\u65bc\u0055\u004c\u9805\u76ee#PjNum#\u66ab\u505c\u901a\u77e5\u66f8',
      contentTemplate: '\u5c0a\u656c\u7684\u5ba2\u6236\uff1a\n\n\u611f\u8b1d\u60a8\u53ca\u8cb4\u516c\u53f8\u5c0d\u0055\u004c\u670d\u52d9\u7684\u4fe1\u4efb\u8207\u652f\u6301\u3002\n\n\u95dc\u65bc\u8cb4\u516c\u53f8xxx\u5e74xx\u6708\u63d0\u4ea4\u7684\u0055\u004c\u8a8d\u8b49\u9805\u76ee\uff0c\u8a8d\u8b49\u9805\u76ee\u7de8\u865f \u0023\u0050\u006a\u004e\u0075\u006d\u0023 \uff0c\u670d\u52d9\u8a02\u55ae\u7de8\u865f \u0023\u004f\u0064\u0072\u004e\u0075\u006d\u0023 \uff0c\u8a8d\u8b49\u7533\u8acb\u63cf\u8ff0 \u0023\u0050\u006a\u0053\u0063\u006f\u0070\u0065\u0023\uff0c\u6211\u5011\u4e0d\u5f97\u4e0d\u66f8\u9762\u901a\u77e5\u60a8\u53ca\u8cb4\u516c\u53f8\uff0c\u7531\u65bc\u672a\u63d0\u4f9b\u4e0b\u8ff0\u4fe1\u606f\u8a72\u9805\u76ee\u5df2\u4e0d\u80fd\u6b63\u5e38\u9032\u884c\u7522\u54c1\u8a8d\u8b49\u5be9\u6838\u3002\u5373\u65e5\u8d77\uff0c\u9805\u76ee\u9032\u5ea6\u8b8a\u66f4\u70ba\u66ab\u505c\u72c0\u614b\u3002\n\n\u70ba\u4e86\u7e7c\u7e8c\u63a8\u9032\u9805\u76ee\u9032\u7a0b\uff0c\u6211\u5011\u9700\u8981\u8cb4\u516c\u53f8\u76e1\u5feb\u63d0\u4f9b\u5982\u4e0b\u4fe1\u606f\n#Project Hold Reason#\n\n\u8acb\u77e5\u6089\uff0c\u5728\u0055\u004c\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u5982\u4e0a\u4fe1\u606f\u5f8c\uff0c\u60a8\u7684\u9805\u76ee\u65b9\u53ef\u91cd\u65b0\u555f\u52d5\u3002\u4efb\u4f55\u4e0d\u660e\u78ba\u4e4b\u8655\uff0c\u6b61\u8fce\u60a8\u96a8\u6642\u8207\u6211\u5011\u806f\u7e6b\uff0c\u6211\u5011\u4e5f\u5c07\u8207\u8cb4\u516c\u53f8\u4fdd\u6301\u7a4d\u6975\u7684\u4e92\u52d5\u4ee5\u76e1\u5feb\u91cd\u555f\u60a8\u7684\u8a8d\u8b49\u9805\u76ee\u3002\n\n\u9806\u795d\n\u5546\u7944\n\nProject Handler /Email:\nEngineer Manager /Email:'
    },
    {
      id: 'inactive1',
      name: 'Inactive 1',
      titleTemplate: 'The 1st project inactive follow up letter\u2013Project #PjNum#/\u7b2c\u4e00\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8',
      contentTemplate: '\u5c0a\u656c\u7684\u5ba2\u6236\uff1a\n\n\u611f\u8b1d\u60a8\u53ca\u8cb4\u516c\u53f8\u5c0d\u0055\u004c\u670d\u52d9\u7684\u4fe1\u4efb\u8207\u652f\u6301\u3002\n\n\u95dc\u65bc\u8cb4\u516c\u53f8xxx\u5e74xx\u6708\u63d0\u4ea4\u7684\u0055\u004c\u8a8d\u8b49\u9805\u76ee\uff0c\u8a8d\u8b49\u9805\u76ee\u7de8\u865f#PjNum#\uff0c\u670d\u52d9\u8a02\u55ae\u7de8\u865f#OdrNum#\uff0c\u8a8d\u8b49\u7533\u8acb\u63cf\u8ff0#PjScope#\uff0c\u6211\u5011\u4e0d\u5f97\u4e0d\u66f8\u9762\u901a\u77e5\u60a8\u53ca\u8cb4\u516c\u53f8\uff0c\u7531\u65bc\u672a\u63d0\u4f9b\u4e0b\u8ff0\u4fe1\u606f\u8a72\u9805\u76ee\u5df2\u4e0d\u80fd\u6b63\u5e38\u9032\u884c\u7522\u54c1\u8a8d\u8b49\u5be9\u6838\u3002\u5373\u65e5\u8d77\uff0c\u9805\u76ee\u9032\u5ea6\u8b8a\u66f4\u70ba\u66ab\u505c\u72c0\u614b\u3002\n\n\u70ba\u4e86\u7e7c\u7e8c\u63a8\u9032\u9805\u76ee\u9032\u7a0b\uff0c\u6211\u5011\u9700\u8981\u8cb4\u516c\u53f8\u76e1\u5feb\u63d0\u4f9b\u5982\u4e0b\u4fe1\u606f\n#Project Hold Reason#\n\n\u5230\u76ee\u524d\u70ba\u6b62\uff0c\u6211\u5011\u5c1a\u672a\u5f9e\u8cb4\u516c\u53f8\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u4e0a\u8ff0\u4fe1\u606f\uff0c\u9805\u76ee\u4ecd\u8655\u65bc\u66ab\u505c\u72c0\u614b\u3002\n\n\u8acb\u77e5\u6089\uff0c\u5728\u0055\u004c\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u5982\u4e0a\u4fe1\u606f\u5f8c\uff0c\u60a8\u7684\u9805\u76ee\u65b9\u53ef\u91cd\u65b0\u555f\u52d5\u3002\u4efb\u4f55\u4e0d\u660e\u78ba\u4e4b\u8655\uff0c\u6b61\u8fce\u60a8\u96a8\u6642\u8207\u6211\u5011\u806f\u7e6b\uff0c\u6211\u5011\u4e5f\u5c07\u8207\u8cb4\u516c\u53f8\u4fdd\u6301\u7a4d\u6975\u7684\u4e92\u52d5\u4ee5\u76e1\u5feb\u91cd\u555f\u60a8\u7684\u8a8d\u8b49\u9805\u76ee\u3002\n\n\u9806\u795d\n\u5546\u7944\n\nProject Handler /Email:'
    },
    {
      id: 'inactive2',
      name: 'Inactive 2',
      titleTemplate: 'The 2nd project inactive follow up letter\u2013Project #PjNum#/\u7b2c\u4e8c\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8',
      contentTemplate: '\u5c0a\u656c\u7684\u5ba2\u6236\uff1a\n\n\u611f\u8b1d\u60a8\u53ca\u8cb4\u516c\u53f8\u5c0d\u0055\u004c\u670d\u52d9\u7684\u4fe1\u4efb\u8207\u652f\u6301\u3002\n\n\u95dc\u65bc\u8cb4\u516c\u53f8xxx\u5e74xx\u6708\u63d0\u4ea4\u7684\u0055\u004c\u8a8d\u8b49\u9805\u76ee\uff0c\u8a8d\u8b49\u9805\u76ee\u7de8\u865f#PjNum#\uff0c\u670d\u52d9\u8a02\u55ae\u7de8\u865f#OdrNum#\uff0c\u8a8d\u8b49\u7533\u8acb\u63cf\u8ff0#PjScope#\uff0c\u6211\u5011\u4e0d\u5f97\u4e0d\u66f8\u9762\u901a\u77e5\u60a8\u53ca\u8cb4\u516c\u53f8\uff0c\u7531\u65bc\u672a\u63d0\u4f9b\u4e0b\u8ff0\u4fe1\u606f\u8a72\u9805\u76ee\u5df2\u4e0d\u80fd\u6b63\u5e38\u9032\u884c\u7522\u54c1\u8a8d\u8b49\u5be9\u6838\u3002\u5373\u65e5\u8d77\uff0c\u9805\u76ee\u9032\u5ea6\u8b8a\u66f4\u70ba\u66ab\u505c\u72c0\u614b\u3002\n\n\u70ba\u4e86\u7e7c\u7e8c\u63a8\u9032\u9805\u76ee\u9032\u7a0b\uff0c\u6211\u5011\u9700\u8981\u8cb4\u516c\u53f8\u76e1\u5feb\u63d0\u4f9b\u5982\u4e0b\u4fe1\u606f\n#Project Hold Reason#\n\n\u4e00\u500b\u6708\u524d\uff0c\u6211\u5011\u767c\u51fa\u7b2c\u4e00\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8\uff0c\u4f46\u5230\u76ee\u524d\u70ba\u6b62\uff0c\u6211\u5011\u4ecd\u672a\u5f9e\u8cb4\u516c\u53f8\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u4e0a\u8ff0\u4fe1\u606f\uff0c\u9805\u76ee\u4ecd\u8655\u65bc\u66ab\u505c\u72c0\u614b\u3002\n\n\u8acb\u77e5\u6089\uff0c\u5728\u0055\u004c\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u5982\u4e0a\u4fe1\u606f\u5f8c\uff0c\u60a8\u7684\u9805\u76ee\u65b9\u53ef\u91cd\u65b0\u555f\u52d5\u3002\u4efb\u4f55\u4e0d\u660e\u78ba\u4e4b\u8655\uff0c\u6b61\u8fce\u60a8\u96a8\u6642\u8207\u6211\u5011\u806f\u7e6b\uff0c\u6211\u5011\u4e5f\u5c07\u8207\u8cb4\u516c\u53f8\u4fdd\u6301\u7a4d\u6975\u7684\u4e92\u52d5\u4ee5\u76e1\u5feb\u91cd\u555f\u60a8\u7684\u8a8d\u8b49\u9805\u76ee\u3002\n\n\u9806\u795d\n\u5546\u7944\n\nProject Handler /Email:'
    },
    {
      id: 'inactive3',
      name: 'Inactive 3',
      titleTemplate: 'The 3rd project inactive follow up letter\u2013Project #PjNum#/\u7b2c\u4e09\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8',
      contentTemplate: '\u5c0a\u656c\u7684\u5ba2\u6236\uff1a\n\n\u611f\u8b1d\u60a8\u53ca\u8cb4\u516c\u53f8\u5c0d\u0055\u004c\u670d\u52d9\u7684\u4fe1\u4efb\u8207\u652f\u6301\u3002\n\n\u95dc\u65bc\u8cb4\u516c\u53f8xxx\u5e74xx\u6708\u63d0\u4ea4\u7684\u0055\u004c\u8a8d\u8b49\u9805\u76ee\uff0c\u8a8d\u8b49\u9805\u76ee\u7de8\u865f#PjNum#\uff0c\u670d\u52d9\u8a02\u55ae\u7de8\u865f#OdrNum#\uff0c\u8a8d\u8b49\u7533\u8acb\u63cf\u8ff0#PjScope#\uff0c\u6211\u5011\u4e0d\u5f97\u4e0d\u66f8\u9762\u901a\u77e5\u60a8\u53ca\u8cb4\u516c\u53f8\uff0c\u7531\u65bc\u672a\u63d0\u4f9b\u4e0b\u8ff0\u4fe1\u606f\u8a72\u9805\u76ee\u5df2\u4e0d\u80fd\u6b63\u5e38\u9032\u884c\u7522\u54c1\u8a8d\u8b49\u5be9\u6838\u3002\u5373\u65e5\u8d77\uff0c\u9805\u76ee\u9032\u5ea6\u8b8a\u66f4\u70ba\u66ab\u505c\u72c0\u614b\u3002\n\n\u70ba\u4e86\u7e7c\u7e8c\u63a8\u9032\u9805\u76ee\u9032\u7a0b\uff0c\u6211\u5011\u9700\u8981\u8cb4\u516c\u53f8\u76e1\u5feb\u63d0\u4f9b\u5982\u4e0b\u4fe1\u606f\n#Project Hold Reason#\n\n\u4e8c\u500b\u6708\u524d\uff0c\u6211\u5011\u767c\u51fa\u7b2c\u4e00\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8\uff0c\u4e26\u4e14\u5728\u4e00\u500b\u6708\u524d\uff0c\u5411\u8cb4\u53f8\u767c\u51fa\u7b2c\u4e8c\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8\uff0c\u4f46\u662f\u5230\u76ee\u524d\u70ba\u6b62\uff0c\u6211\u5011\u4ecd\u672a\u5f9e\u8cb4\u516c\u53f8\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u4e0a\u8ff0\u4fe1\u606f\uff0c\u9805\u76ee\u4f9d\u820a\u8655\u65bc\u66ab\u505c\u72c0\u614b\u3002\n\n\u8acb\u77e5\u6089\uff0c\u5728\u0055\u004c\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u5982\u4e0a\u4fe1\u606f\u5f8c\uff0c\u60a8\u7684\u9805\u76ee\u65b9\u53ef\u91cd\u65b0\u555f\u52d5\u3002\u4efb\u4f55\u4e0d\u660e\u78ba\u4e4b\u8655\uff0c\u6b61\u8fce\u60a8\u96a8\u6642\u8207\u6211\u5011\u806f\u7e6b\uff0c\u6211\u5011\u4e5f\u5c07\u8207\u8cb4\u516c\u53f8\u4fdd\u6301\u7a4d\u6975\u7684\u4e92\u52d5\u4ee5\u76e1\u5feb\u91cd\u555f\u60a8\u7684\u8a8d\u8b49\u9805\u76ee\u3002\n\n\u9806\u795d\n\u5546\u7944\n\nProject Handler /Email:\nField Sales /Email:'
    },
    {
      id: 'final',
      name: 'Final',
      titleTemplate: 'The final notice before project close by letter \u2013 Project #PjNum#/\u9805\u76ee\u7d42\u6b62\u524d\u6700\u5f8c\u63d0\u9192',
      contentTemplate: '\u5c0a\u656c\u7684\u5ba2\u6236\uff1a\n\u611f\u8b1d\u60a8\u53ca\u8cb4\u516c\u53f8\u5c0d\u0055\u004c\u670d\u52d9\u7684\u4fe1\u4efb\u8207\u652f\u6301\u3002\n\u95dc\u65bc\u8cb4\u516c\u53f8xxx\u5e74xx\u6708\u63d0\u4ea4\u7684\u0055\u004c\u8a8d\u8b49\u9805\u76ee\uff0c\u8a8d\u8b49\u9805\u76ee\u7de8\u865f#PjNum#\uff0c\u670d\u52d9\u8a02\u55ae\u7de8\u865f\uff1a \u0023\u004f\u0064\u0072\u004e\u0075\u006d\u0023, \u8a8d\u8b49\u7533\u8acb\u63cf\u8ff0 #PjScope#\u3002\u7d04\u56db\u500b\u6708\u524d\uff0c\u6211\u5011\u66fe\u66f8\u9762\u901a\u77e5\u60a8\u53ca\u8cb4\u516c\u53f8\uff0c\u7531\u65bc\u672a\u63d0\u4f9b\u4e0b\u8ff0\u4fe1\u606f\u8a72\u9805\u76ee\u5df2\u4e0d\u80fd\u6b63\u5e38\u9032\u884c\u7522\u54c1\u8a8d\u8b49\u5be9\u6838\u3002\u9805\u76ee\u9032\u5ea6\u8b8a\u66f4\u70ba\u66ab\u505c\u72c0\u614b\u3002\n\u70ba\u4e86\u7e7c\u7e8c\u63a8\u9032\u9805\u76ee\u9032\u7a0b\uff0c\u6211\u5011\u9700\u8981\u8cb4\u516c\u53f8\u76e1\u5feb\u63d0\u4f9b\u5982\u4e0b\u4fe1\u606f\uff0c\u6216\u5c31\u8a72\u7b49\u4fe1\u606f\u548c\u6750\u6599\u7684\u63d0\u4ea4\u63d0\u51fa\u660e\u78ba\u7684\u6642\u9593\u8868\u3002\n#Project Hold Reason#\n\n\u7531\u65bc\u672a\u80fd\u6536\u5230\u6709\u6548\u53cd\u994b\uff0c\u7d04\u4e09\u500b\u6708\u524d\uff0c\u6211\u5011\u767c\u51fa\u7b2c\u4e00\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8\uff0c\u4e26\u4e14\u5728\u96a8\u5f8c\u4e8c\u500b\u6708\uff0c\u63a5\u9023\u5411\u8cb4\u53f8\u767c\u51fa\u7b2c\u4e8c\u6b21\u4ee5\u53ca\u7b2c\u4e09\u6b21\u9805\u76ee\u66ab\u505c\u8ddf\u9032\u901a\u77e5\u66f8\u3002\u4f46\u662f\u5230\u76ee\u524d\u70ba\u6b62\uff0c\u6211\u5011\u4ecd\u672a\u5f9e\u8cb4\u516c\u53f8\u6536\u5230\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u4e0a\u8ff0\u4fe1\u606f\uff0c\u9805\u76ee\u59cb\u7d42\u8655\u65bc\u66ab\u505c\u72c0\u614b\u3002\n\n\u6839\u64da\u904e\u53bb\u56db\u500b\u6708\u7684\u9805\u76ee\u9032\u5c55\u72c0\u6cc1\uff0c\u6211\u5011\u5728\u6b64\u6700\u5f8c\u4e00\u6b21\u5411\u60a8\u767c\u51fa\u9805\u76ee\u63d0\u9192\u51fd\uff0c\u8acb\u60a8\u52d9\u5fc5\u5f15\u8d77\u91cd\u8996\uff0c\u5982\u679c\u8a72\u9805\u76ee\u5728\u672a\u4f86\u5169\u9031\u5167\uff0c\u4e5f\u5c31\u662f#DeadlineDate#\u524d\u60a8\u4ecd\u4e0d\u80fd\u63d0\u4f9b\u5b8c\u6574\u4e26\u6b63\u78ba\u7684\u4e0a\u8ff0\u5fc5\u8981\u4fe1\u606f/\u6a23\u54c1\uff0c\u6211\u5011\u4e0d\u5f97\u4e0d\u9057\u61be\u7684\u901a\u77e5\u60a8\uff0c\u6211\u5011\u5c07\u7d42\u6b62\u8cb4\u516c\u53f8\u300c#OdrNum#\u300d\u865f\u670d\u52d9\u8a02\u55ae\u53ca\u5176\u9805\u4e0b\u4e4b#PjNum#\u8a8d\u8b49\u9805\u76ee\u3002\u9805\u76ee\u7d42\u6b62\u5f8c\uff0c\u6211\u5011\u5c07\u5c31\u6211\u53f8\u5df2\u7d93\u63d0\u4f9b\u7684\u670d\u52d9\u5411\u60a8\u6536\u53d6\u76f8\u61c9\u7684\u8cbb\u7528\uff1b\u9805\u76ee\u63a1\u7528\u9810\u4ed8\u6b3e\u65b9\u5f0f\u652f\u4ed8\u7684\uff0c\u6211\u5011\u5c07\u5728\u6263\u9664\u5fc5\u8981\u8cbb\u7528\u5f8c\uff0c\u9000\u9084\u60a8\u7684\u5269\u9918\u6b3e\u9805\u3002\u5982\u4ee5\u4e0a\u670d\u52d9\u9700\u6c42\u5728\u672a\u4f86\u9700\u8981\u518d\u6b21\u555f\u52d5\uff0c\u60a8\u53ef\u4ee5\u5411\u6211\u5011\u7d22\u53d6\u4e00\u4efd\u65b0\u7684\u6b63\u5f0f\u5831\u50f9\uff08\u5831\u50f9\u6709\u6548\u671f\u70ba\u4e09\u500b\u6708\uff09\u3002\u6211\u5011\u5c07\u91cd\u65b0\u6838\u5b9a\u8cb4\u516c\u53f8\u7684\u670d\u52d9\u9700\u6c42\uff0c\u4e26\u5411\u60a8\u767c\u51fa\u65b0\u7684\u5831\u50f9\u3002\n\n\u9806\u795d\n\u5546\u7944\n\nField Sales /Email:       Project Handler /Email:\nSales Manager /Email:       Engineer Manager /Email:'
    }
  ];

  const CLOSE_LETTER = {
    id: 'close',
    titleTemplate: 'Close Letter for Project No {pjNum}',
    contentTemplate: "Dear {clientName},\n\nIt was a pleasure to meet with you on MM/DD, {pjScope} is carried out.\nPlease also agree to use this letter as the basis for closing the project of {pjNum}.\n\nThank you.\n\nBR,\n{projectHandlerEmail}"
  };

  const NOA_TEMPLATE = {
    id: 'noa',
    titleTemplate: 'NOA Letter for {pjNum}',
    contentTemplate: "Dear {clientName},\n\nCongratulations! UL's investigation of your product has been completed and the products were determined to comply with the applicable requirements.\n\nThe attached is a Notice of Authorization for your reference.\n\nIf there is any other way in which I can help, do not hesitate to contact me.\n\n{projectHandlerEmail}"
  };

  // ════════════════════════════════════════════════════
  // Date utilities
  // ════════════════════════════════════════════════════

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
    return '\u4e2d\u83ef\u6c11\u570b' + (date.getFullYear() - 1911) + '\u5e74' +
      (date.getMonth() + 1) + '\u6708' + date.getDate() + '\u65e5';
  }

  function deadlineDate() {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return toROCDateFull(d);
  }

  // ════════════════════════════════════════════════════
  // Template substitution
  // ════════════════════════════════════════════════════

  function substitute(template, data) {
    let s = template;
    s = s.replace(/#PjNum#/g,               data.pjNum    || '');
    s = s.replace(/#OdrNum#/g,              data.odrNum   || '');
    s = s.replace(/#PjScope#/g,             data.pjScope  || '');
    s = s.replace(/#Project Hold Reason#/g, data.holdReason || '');
    s = s.replace(/xxx\u5e74xx\u6708/g,     toROCYearMonth(data.dateBooked));
    s = s.replace(/#DeadlineDate#/g,        deadlineDate());
    s = s.replace(/\{pjNum\}/g,             data.pjNum    || '');
    s = s.replace(/\{clientName\}/g,        data.clientName || '');
    s = s.replace(/\{pjScope\}/g,           data.pjScope  || '');
    s = s.replace(/\{projectHandlerEmail\}/g, data.handlerEmail || '');
    return s;
  }

  // ════════════════════════════════════════════════════
  // Page data extraction
  // ════════════════════════════════════════════════════

  function xpathFirst(xpath, ctx) {
    const node = ctx || document;
    const r = document.evaluate(xpath, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return r.singleNodeValue || null;
  }

  function xpathAll(xpath, ctx) {
    const node = ctx || document;
    const r = document.evaluate(xpath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const out = [];
    for (let i = 0; i < r.snapshotLength; i++) out.push(r.snapshotItem(i));
    return out;
  }

  function extractFieldByLabel(label) {
    const xpath = "//div[@class='display-label-row' and normalize-space(.)='" + label +
      "']/following-sibling::div[@class='display-field-row'][1]";
    const node = xpathFirst(xpath);
    return node ? node.textContent.trim() : '';
  }

  function extractProjectName() {
    // Try project-name heading or page <h1>
    const candidates = [
      "//div[contains(@class,'project-name')]",
      "//h1[contains(@class,'page-title')]",
      "//h1",
      "//span[contains(@class,'project-name')]"
    ];
    for (const xp of candidates) {
      const n = xpathFirst(xp);
      if (n && n.textContent.trim()) return n.textContent.trim();
    }
    return document.title ? document.title.split('|')[0].trim() : '';
  }

  function extractOdrNum() {
    const xpath = "//dt[normalize-space(.)='Order Number:']/following-sibling::dd[1]//span";
    const node = xpathFirst(xpath);
    if (node) return node.textContent.trim();
    // Fallback: no span
    const xpath2 = "//dt[normalize-space(.)='Order Number:']/following-sibling::dd[1]";
    const node2 = xpathFirst(xpath2);
    return node2 ? node2.textContent.trim() : '';
  }

  function extractProjectHandlerEmail() {
    const xpath = "//dt[normalize-space(.)='Project Handler:']/following-sibling::dd[1]";
    const node = xpathFirst(xpath);
    if (!node) return '';
    // Get email if it's a link
    const link = node.querySelector('a[href^="mailto:"]');
    if (link) return link.href.replace('mailto:', '').trim();
    return node.textContent.trim();
  }

  function extractClientInfo() {
    // Search .div-product-attribute elements for 'Customer Company Contact'
    const elements = document.querySelectorAll('.div-product-attribute');
    let clientName  = '';
    let clientEmail = '';
    for (const el of elements) {
      const text = el.textContent || '';
      if (text.includes('Customer Company Contact') || text.includes('Customer Contact')) {
        // Try to get name and email from child elements
        const spans = el.querySelectorAll('span');
        for (const s of spans) {
          const t = s.textContent.trim();
          if (!clientName && t && !t.includes('@')) clientName = t;
          if (!clientEmail && t.includes('@')) clientEmail = t;
        }
        if (!clientName) clientName = text.replace('Customer Company Contact', '').replace('Customer Contact', '').trim();
        break;
      }
    }
    // Fallback: check any visible Contact field via XPath
    if (!clientName) {
      const xp = "//dt[normalize-space(.)='Bill-To Customer:']/following-sibling::dd[1]";
      const n = xpathFirst(xp);
      if (n) clientName = n.textContent.trim();
    }
    return { clientName, clientEmail };
  }

  function getPageData() {
    const pjNum       = extractFieldByLabel('Oracle Project Number');
    const pjScope     = extractFieldByLabel('Project Scope');
    const dateBooked  = extractFieldByLabel('Date Booked');
    const holdReason  = extractFieldByLabel('Project Hold Reason');
    const pjName      = extractProjectName();
    const odrNum      = extractOdrNum();
    const handlerEmail = extractProjectHandlerEmail();
    const { clientName, clientEmail } = extractClientInfo();
    return { pjNum, pjScope, dateBooked, holdReason, pjName, odrNum, handlerEmail, clientName, clientEmail };
  }

  // ════════════════════════════════════════════════════
  // Panel state (localStorage)
  // ════════════════════════════════════════════════════

  const LS_KEY = 'uls-panel-state';

  function loadState() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
  }

  function saveState(updates) {
    const s = Object.assign(loadState(), updates);
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
  }

  // ════════════════════════════════════════════════════
  // Build panel DOM
  // ════════════════════════════════════════════════════

  function buildPanel(data) {
    const panel = document.createElement('div');
    panel.id = 'uls-panel';

    // ── Header ──────────────────────────────────────
    const header = document.createElement('div');
    header.id = 'uls-panel-header';
    header.innerHTML =
      '<span class="uls-panel-title">\u26BF\uFE0F ULS Email Generator</span>' +
      '<button class="uls-header-btn" id="uls-collapse-btn" title="Collapse/Expand">\u2212</button>' +
      '<button class="uls-header-btn" id="uls-close-btn" title="Close">\u00D7</button>';
    panel.appendChild(header);

    // ── Body ─────────────────────────────────────────
    const body = document.createElement('div');
    body.id = 'uls-panel-body';

    // Project Info
    body.appendChild(buildSection('Project Info', buildInfoGrid(data)));

    // Inactive Letters
    const inactiveBtns = document.createElement('div');
    inactiveBtns.className = 'uls-btn-row';
    INACTIVE_TEMPLATES.forEach(tpl => {
      const btn = document.createElement('button');
      btn.className = 'uls-btn';
      btn.textContent = tpl.name;
      btn.addEventListener('click', () => generateInactiveLetter(tpl, data, panel));
      inactiveBtns.appendChild(btn);
    });
    body.appendChild(buildSection('Inactive Letters', inactiveBtns));

    // Output area (hidden initially)
    const outputSection = buildOutputSection();
    outputSection.style.display = 'none';
    outputSection.id = 'uls-output-section';
    body.appendChild(outputSection);

    // Letter Links & Forms
    body.appendChild(buildLinksSection(data, panel));

    panel.appendChild(body);
    return panel;
  }

  function buildSection(title, contentNode) {
    const sec = document.createElement('div');
    sec.className = 'uls-section';
    const titleEl = document.createElement('div');
    titleEl.className = 'uls-section-title';
    titleEl.textContent = title;
    sec.appendChild(titleEl);
    const bodyEl = document.createElement('div');
    bodyEl.className = 'uls-section-body';
    if (contentNode instanceof Node) bodyEl.appendChild(contentNode);
    else bodyEl.innerHTML = contentNode;
    sec.appendChild(bodyEl);
    return sec;
  }

  function buildInfoGrid(data) {
    const grid = document.createElement('div');
    grid.className = 'uls-info-grid';
    const rows = [
      ['Project #', data.pjNum   || '(not found)'],
      ['Order #',   data.odrNum  || '(not found)'],
      ['Scope',     (data.pjScope  || '').substring(0, 60) || '(not found)'],
      ['Handler',   data.handlerEmail || '(not found)'],
      ['Client',    data.clientName   || '(not found)']
    ];
    rows.forEach(([label, value]) => {
      const lEl = document.createElement('div');
      lEl.className = 'uls-info-label';
      lEl.textContent = label;
      const vEl = document.createElement('div');
      vEl.className = 'uls-info-value';
      vEl.textContent = value;
      vEl.title = value;
      grid.appendChild(lEl);
      grid.appendChild(vEl);
    });
    return grid;
  }

  function buildOutputSection() {
    const sec = document.createElement('div');
    sec.className = 'uls-section';

    const titleEl = document.createElement('div');
    titleEl.className = 'uls-section-title';
    titleEl.textContent = 'Generated Email';
    sec.appendChild(titleEl);

    const bodyEl = document.createElement('div');
    bodyEl.className = 'uls-section-body';
    bodyEl.style.display = 'flex';
    bodyEl.style.flexDirection = 'column';
    bodyEl.style.gap = '6px';

    // Subject
    const subjLabel = document.createElement('div');
    subjLabel.className = 'uls-output-label';
    subjLabel.innerHTML = '<span>Subject</span><span class="uls-copy-hint">click to copy</span>';
    const subjArea = document.createElement('textarea');
    subjArea.id = 'uls-subj-area';
    subjArea.className = 'uls-textarea uls-textarea-subject';
    subjArea.readOnly = true;
    subjArea.addEventListener('click', () => copyTextarea(subjArea, subjLabel.querySelector('.uls-copy-hint')));

    // Body
    const bodyLabel = document.createElement('div');
    bodyLabel.className = 'uls-output-label';
    bodyLabel.innerHTML = '<span>Body</span><span class="uls-copy-hint">click to copy</span>';
    const bodyArea = document.createElement('textarea');
    bodyArea.id = 'uls-body-area';
    bodyArea.className = 'uls-textarea uls-textarea-body';
    bodyArea.readOnly = true;
    bodyArea.addEventListener('click', () => copyTextarea(bodyArea, bodyLabel.querySelector('.uls-copy-hint')));

    // Action buttons
    const actRow = document.createElement('div');
    actRow.className = 'uls-btn-row';
    const copySubjBtn = mkBtn('Copy Subject', 'uls-btn uls-btn-sm', () => copyTextarea(subjArea, subjLabel.querySelector('.uls-copy-hint')));
    const copyBodyBtn = mkBtn('Copy Body',    'uls-btn uls-btn-sm', () => copyTextarea(bodyArea, bodyLabel.querySelector('.uls-copy-hint')));
    const mailtoBtn   = mkBtn('Open as mailto:', 'uls-btn uls-btn-sm uls-btn-link', () => {
      const subj = subjArea.value;
      const bdy  = bodyArea.value;
      window.open('mailto:?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(bdy), '_blank');
    });
    actRow.appendChild(copySubjBtn);
    actRow.appendChild(copyBodyBtn);
    actRow.appendChild(mailtoBtn);

    bodyEl.appendChild(subjLabel);
    bodyEl.appendChild(subjArea);
    bodyEl.appendChild(bodyLabel);
    bodyEl.appendChild(bodyArea);
    bodyEl.appendChild(actRow);
    sec.appendChild(bodyEl);
    return sec;
  }

  function buildLinksSection(data, panel) {
    const wrap = document.createElement('div');

    // Epic report links row
    const linksRow = document.createElement('div');
    linksRow.className = 'uls-btn-row';
    const epicTypes = [
      { name: 'ECD Letter', type: 'ECD' },
      { name: 'TAT Letter', type: 'TAT' },
      { name: 'NOA Letter', type: 'NOA' },
      { name: 'PI Letter',  type: 'PI' }
    ];
    epicTypes.forEach(({ name, type }) => {
      linksRow.appendChild(mkBtn(name, 'uls-btn uls-btn-link uls-btn-sm', () => {
        const url = 'https://epic.ul.com/Report?type=' + encodeURIComponent(type) +
          '&projectNumber=' + encodeURIComponent(data.pjNum || '');
        window.open(url, '_blank');
      }));
    });

    // Actions row
    const actRow = document.createElement('div');
    actRow.className = 'uls-btn-row';
    actRow.appendChild(mkBtn('Close Letter', 'uls-btn uls-btn-sm', () => generateCloseLetter(data, panel)));
    actRow.appendChild(mkBtn('NOA Follow-up', 'uls-btn uls-btn-sm', () => generateNOA(data, panel)));
    actRow.appendChild(mkBtn('Travel Approval', 'uls-btn uls-btn-primary uls-btn-sm', () => openTravelModal(data, panel)));

    const inner = document.createElement('div');
    inner.appendChild(linksRow);
    inner.appendChild(actRow);

    return buildSection('Letter Links & Forms', inner);
  }

  // ════════════════════════════════════════════════════
  // Generation helpers
  // ════════════════════════════════════════════════════

  function showOutput(title, content, panel) {
    const outSec = panel.querySelector('#uls-output-section');
    const subjArea = panel.querySelector('#uls-subj-area');
    const bodyArea = panel.querySelector('#uls-body-area');
    subjArea.value = title;
    bodyArea.value = content;
    outSec.style.display = '';
    outSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function generateInactiveLetter(tpl, data, panel) {
    const title   = substitute(tpl.titleTemplate, data);
    const content = substitute(tpl.contentTemplate, data);
    showOutput(title, content, panel);
  }

  function generateCloseLetter(data, panel) {
    const title   = substitute(CLOSE_LETTER.titleTemplate, data);
    const content = substitute(CLOSE_LETTER.contentTemplate, data);
    showOutput(title, content, panel);
  }

  function generateNOA(data, panel) {
    const title   = substitute(NOA_TEMPLATE.titleTemplate, data);
    const content = substitute(NOA_TEMPLATE.contentTemplate, data);
    showOutput(title, content, panel);
  }

  function copyTextarea(area, hintEl) {
    const text = area.value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      area.classList.add('uls-textarea-copied');
      if (hintEl) { hintEl.textContent = '\u2713 Copied!'; hintEl.classList.add('uls-copy-hint-ok'); }
      setTimeout(() => {
        area.classList.remove('uls-textarea-copied');
        if (hintEl) { hintEl.textContent = 'click to copy'; hintEl.classList.remove('uls-copy-hint-ok'); }
      }, 2000);
    }).catch(() => {
      area.select();
      document.execCommand('copy');
    });
  }

  // ════════════════════════════════════════════════════
  // Travel Approval Modal
  // ════════════════════════════════════════════════════

  function openTravelModal(data, panel) {
    if (document.getElementById('uls-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'uls-modal-overlay';
    overlay.addEventListener('click', e => { if (e.target === overlay) closeTravelModal(); });

    const modal = document.createElement('div');
    modal.id = 'uls-modal';

    // Header
    const mHeader = document.createElement('div');
    mHeader.className = 'uls-modal-header';
    mHeader.innerHTML = '<span class="uls-modal-title">Travel Approval Request</span>';
    const closeModalBtn = mkBtn('\u00D7', 'uls-header-btn', closeTravelModal);
    mHeader.appendChild(closeModalBtn);
    modal.appendChild(mHeader);

    // Body
    const mBody = document.createElement('div');
    mBody.className = 'uls-modal-body';

    // Trip reason
    mBody.appendChild(buildFormGroup('Trip Reason', 'uls-form-textarea', 'uls-m-reason', 'textarea',
      'e.g. Client factory visit for product testing'));

    // Dates
    const datesGroup = document.createElement('div');
    datesGroup.className = 'uls-form-group';
    const datesLabel = document.createElement('div');
    datesLabel.className = 'uls-form-label';
    datesLabel.textContent = 'Travel Date(s)';
    const datesList = document.createElement('div');
    datesList.id = 'uls-m-dates-list';
    const addDateBtn = mkBtn('+ Add Date', 'uls-btn uls-btn-sm', () => addModalDate(datesList));
    datesGroup.appendChild(datesLabel);
    datesGroup.appendChild(datesList);
    datesGroup.appendChild(addDateBtn);
    mBody.appendChild(datesGroup);
    addModalDate(datesList); // start with one

    // From / To
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';
    rowDiv.style.gap = '10px';
    rowDiv.appendChild(buildFormGroup('From', 'uls-input', 'uls-m-from', 'input', 'e.g. Shanghai'));
    rowDiv.appendChild(buildFormGroup('To', 'uls-input', 'uls-m-to', 'input', 'e.g. Beijing'));
    mBody.appendChild(rowDiv);

    // Charge type
    mBody.appendChild(buildFormGroup('Charge & Account Allocation', 'uls-input', 'uls-m-charge', 'input',
      'e.g. Project UL12345'));

    modal.appendChild(mBody);

    // Footer
    const mFooter = document.createElement('div');
    mFooter.className = 'uls-modal-footer';
    mFooter.appendChild(mkBtn('Cancel', 'uls-btn', closeTravelModal));
    mFooter.appendChild(mkBtn('Generate Email', 'uls-btn uls-btn-primary', () => {
      generateTravelApproval(data, panel);
    }));
    modal.appendChild(mFooter);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function buildFormGroup(label, inputClass, inputId, tag, placeholder) {
    const grp = document.createElement('div');
    grp.className = 'uls-form-group';
    grp.style.flex = '1';
    const lbl = document.createElement('div');
    lbl.className = 'uls-form-label';
    lbl.textContent = label;
    const inp = document.createElement(tag === 'textarea' ? 'textarea' : 'input');
    inp.id = inputId;
    inp.className = inputClass;
    inp.placeholder = placeholder || '';
    if (tag !== 'textarea') inp.type = 'text';
    grp.appendChild(lbl);
    grp.appendChild(inp);
    return grp;
  }

  function addModalDate(list) {
    const row = document.createElement('div');
    row.className = 'uls-date-row-modal';
    const inp = document.createElement('input');
    inp.type = 'date';
    inp.className = 'uls-input';
    const removeBtn = mkBtn('\u00D7', 'uls-remove-btn', () => row.remove());
    row.appendChild(inp);
    row.appendChild(removeBtn);
    list.appendChild(row);
  }

  function closeTravelModal() {
    const ov = document.getElementById('uls-modal-overlay');
    if (ov) ov.remove();
  }

  function generateTravelApproval(data, panel) {
    const reason     = (document.getElementById('uls-m-reason')?.value  || '').trim() || '[trip reason]';
    const fromLoc    = (document.getElementById('uls-m-from')?.value    || '').trim() || '[from]';
    const toLoc      = (document.getElementById('uls-m-to')?.value      || '').trim() || '[to]';
    const chargeType = (document.getElementById('uls-m-charge')?.value  || '').trim() || '[charge type]';
    const dateInputs = document.querySelectorAll('#uls-m-dates-list input[type="date"]');
    const dates      = Array.from(dateInputs).map(i => i.value).filter(Boolean);
    const dateLines  = dates.length ? dates.map(d => '- ' + d).join('\n') : '- [date]';
    const datesStr   = dates.length ? dates.join(', ') : '[dates]';

    const pjNum      = data.pjNum || '';
    const handler    = data.handlerEmail || '';

    const title = ('Travel Approval for pj.' + pjNum + ' - ' + datesStr + ' - From ' + fromLoc + ' to ' + toLoc);
    const content =
      'Dear Manager,\n\nI would like to apply for a business trip. Details:\n\nReason:\n' + reason +
      '\n\nDates:\n' + dateLines +
      '\n\nLocations/Legs:\nFrom: ' + fromLoc + '. To: ' + toLoc +
      '\n\nCharge & Account Allocation:\n- ' + chargeType +
      '\n\nPlease approve.\n\nThank you!\n' + handler;

    closeTravelModal();
    showOutput(title, content, panel);
  }

  // ════════════════════════════════════════════════════
  // Helper: make button
  // ════════════════════════════════════════════════════

  function mkBtn(text, cls, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = cls;
    if (onClick) btn.addEventListener('click', onClick);
    return btn;
  }

  // ════════════════════════════════════════════════════
  // Init
  // ════════════════════════════════════════════════════

  function init() {
    const data  = getPageData();
    const panel = buildPanel(data);

    // Restore collapsed state
    const state = loadState();
    if (state.collapsed) panel.classList.add('uls-collapsed');

    document.body.appendChild(panel);

    // Header click to toggle collapse
    document.getElementById('uls-panel-header').addEventListener('click', e => {
      if (e.target.closest('.uls-header-btn')) return;
      const collapsed = panel.classList.toggle('uls-collapsed');
      document.getElementById('uls-collapse-btn').textContent = collapsed ? '+' : '\u2212';
      saveState({ collapsed });
    });

    // Collapse button
    document.getElementById('uls-collapse-btn').addEventListener('click', e => {
      e.stopPropagation();
      const collapsed = panel.classList.toggle('uls-collapsed');
      e.currentTarget.textContent = collapsed ? '+' : '\u2212';
      saveState({ collapsed });
    });

    // Close button — hides panel, sets closed flag
    document.getElementById('uls-close-btn').addEventListener('click', e => {
      e.stopPropagation();
      panel.remove();
      document.getElementById('uls-panel-styles').remove();
    });
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
