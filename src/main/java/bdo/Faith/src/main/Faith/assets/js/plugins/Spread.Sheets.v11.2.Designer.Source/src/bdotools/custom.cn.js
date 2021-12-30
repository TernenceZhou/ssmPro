(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;

    /* ZQF 自定义 START */
    const cellTypeDialog = {
        title: "单向链接",
        items: "链接:",
        itemProperties: "链接属性:",
        cellTitle: "单元格",
        displayText: "要显示的文字:",
        text: "请键入单元格引用:",
        sheetText: "请选择Sheet:",
        fileTitle: "文件",
        paperText: "请选择底稿:",
        clearDgBtn: "重置",
        openDgBtn: "打开底稿",
        refershDgBtn: "刷新",
        attachmentText: "请选择底稿附件:",
        add: "添加",
        remove: "删除",
        clearBtn: "清除"
    };
    designer.res.cellTypeDialog = cellTypeDialog;

    const customLabelDialog = {
        title: "标签",
        cellAlias: "请键入单元格标签名:",
        cellPositionBtn: "单元格位置:"
    };
    designer.res.customLabelDialog = customLabelDialog;

    const mutualIndexDialog = {
        title: "交叉索引",
        leftProperties: "左交叉索引",
        rightProperties: "右交叉索引",
        activeCell: "当前单元格:",
        tbTitle: "TB",
        tbListTitle: "TB科目:",
        tbColumnTitle: "科目项:",
        guideTitle: "导引表",
        guideListTitle: "财务科目:",
        guideColumnTitle: "科目项:",
        dgTitle: "底稿",
        openDg: "打开底稿",
        refreshDg: "刷新",
        dgListTitle: "底稿:",
        dgSheetTitle: "sheet:",
        dgCellTitle: "单元格:",
        noteTitle: "附注",
        openNote: "打开附注",
        refreshNote: "刷新",
        noteListTitle: "附注:",
        noteSheetTitle: "sheet:",
        noteCellTitle: "单元格:",
        
        exchangeBtn: "切换",
        clearBtn: "清除"
    };
    designer.res.mutualIndexDialog = mutualIndexDialog;

    const auditSamplingDialog = {
        title: "抽凭附件链接",
        samplingAttachTitle: "抽凭附件:",
        refreshSamplingAttach: "刷新",
        items: "链接:",
        itemProperties: "链接属性:",
        
        clearBtn: "清除"
    };
    designer.res.auditSamplingDialog = auditSamplingDialog;

    /*const customLinksDialog = {
        title: "双向链接",
        leftProperties: "左链接属性",
        rightProperties: "右链接属性",
        linkTypeCell: "单元格",
        linkTypeFile: "文件",
        displayLabel: "要显示的文字:",
        sheetLabel: "请选择Sheet:",
        cellLabel: "请键入单元格引用:",
        paperLabel: "请选择底稿:",
        attachmentLabel: "请选择底稿附件:",
        clearBtn: "清除"
    };
    designer.res.customLinksDialog = customLinksDialog;*/

    const noteFeatureDialog = {
        title: "附注功能",
        clearBtn: "清除",
        curSheet: "当前sheet:",
        curPosition: "当前位置:",
        dgFile: "底稿:",
        refreshBtn: "重置",
        openDg: "打开底稿",
        refreshDg: "刷新",
        dgSheet: "Sheet:",
        dgRangeStart: "区域起始位置:",
        dgRangeEnd: "区域结束位置:"
    };
    designer.res.noteFeatureDialog = noteFeatureDialog;

    const dgFetchDialog = {
        title: "底稿取值",
        clearBtn: "清除",
        curSheet: "当前sheet:",
        curPosition: "当前位置:",
        dgFile: "底稿:",
        refreshBtn: "重置",
        openDg: "打开底稿",
        refreshDg: "刷新",
        dgSheet: "Sheet:",
        dgRange: "单元格位置:"
    };
    designer.res.dgFetchDialog = dgFetchDialog;

    const cashflowFeatureDialog = {
        title: "现金流量表取值",
        clearBtn: "清除",
        curSheet: "当前sheet:",
        curPosition: "当前位置:",
        reportTitle: "报表",
        reportCode: "报表科目:",
        reportDisp: "报表科目名称:",
        dgTitle: "底稿",
        openDg: "打开底稿",
        refreshDg: "刷新",
        dgListTitle: "底稿:",
        dgSheetTitle: "sheet:",
        dgCellTitle: "单元格:",
        noteTitle: "附注",
        openNote: "打开附注",
        refreshNote: "刷新",
        noteListTitle: "附注:",
        noteSheetTitle: "sheet:",
        noteCellTitle: "单元格:"
    };
    designer.res.cashflowFeatureDialog = cashflowFeatureDialog;
    
    const mergenoteFeatureDialog = {
        title: "合并附注取值",
        clearBtn: "清除",
        curSheet: "当前sheet:",
        curPosition: "当前位置:",
        reportTitle: "报表",
        reportCode: "报表科目:",
        reportDisp: "报表科目名称:",
        dgTitle: "底稿",
        openDg: "打开底稿",
        dgListTitle: "底稿:",
        dgSheetTitle: "sheet:",
        dgCellTitle: "单元格:",
        noteTitle: "附注",
        openNote: "打开附注",
        noteListTitle: "附注:",
        noteSheetTitle: "sheet:",
        noteCellTitle: "单元格:"
    };
    designer.res.mergenoteFeatureDialog = mergenoteFeatureDialog;
    /* ZQF 自定义 START */
})();
