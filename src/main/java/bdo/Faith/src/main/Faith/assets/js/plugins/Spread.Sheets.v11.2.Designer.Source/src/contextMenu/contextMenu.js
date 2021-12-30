(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var chartHelper = designer.util.chartHelper;
    var contextMenu = {};

    var SEPARATOR = "separator", MENUITEM_NAME_PREFIX = "designer.", ICON_CLASS_PREFIX = "gc-spread-",
        SPREAD_NAME_PREFIX = "gc.spread.", SPREAD_COMMAND_PREFIX = "gc.spread.contextMenu.";
    var REMOVE_SLICER = "removeSlicer", TOGGLE_COMMENT = "toggleComment", DELETE_COMMENT = "deleteComment",
        EDIT_COMMENT = "editComment",
        UNHIDE_SHEET = "unhideSheet", HIDE_SHEET = "hideSheet", UNHIDE_ROWS = 'unhideRows',
        UNHIDE_COLS = "unhideColumns", SORT_ASCEND = "sortAscend",
        SORT_DESCEND = "sortDescend", SORT = "sort", FILTER = "filter", INSERT_COMMENT = "insertComment",
        DELETE_SHEET = "deleteSheet",
        INSERT_SHEET = "insertSheet", CLEAR_CONTENT = "clearContents", PASTE = "paste", PASTE_OPTIONS = "pasteOptions",
        PASTE_FORMATTING = "pasteFormatting", PASTE_VALUES = "pasteValues", PASTE_FORMULA = "pasteFormula",
        PASTE_ALL = "pasteAll", CUT = "cut", COPY = "copy",
        GROUP_HEADER = "groupHeader", PROTECT_SHEET = "protectSheet", CUSTOM_SORT = 'customSort',
        FORMAT_CELLS = 'formatCells', DEFINE_NAME = 'defineName', CELL_TAG = 'cellTag', ROW_HEIGHT = 'rowHeight',
        COL_WIDTH = 'columnWidth',
        /* ZQF START*/
        CELL_TYPE = 'cellType', CUSTOM_LABEL = 'customLabel',
        /*CUSTOM_LINKS = 'customLinks',*/
        MUTUAL_INDEX = 'mutualIndex',
        LEFT_TAG = 'leftTag', RIGHT_TAG = 'rightTag',
        NOTE_FEATURE = 'noteFeature',
        CASHFLOW_FEATURE = 'cashFlowFeature',
        CUSTOM_CLEAR = 'customClear',
        /* ZQF END*/
        SHEET_TAG = 'sheetTag', ROW_TAG = 'rowTag', COL_TAG = 'colTag', HIDE_ROWS = "hideRows",
        HIDE_COLUMNS = "hideColumns", TAB_COLOR = "tabColor", SHOW_TAB_COLOR = "showTabColor",
        FORMAT_COMMENT = "formatComment", SLICER_CUT = 'slicerCut', SLICER_COPY = 'slicerCopy',
        SLICER_PASTE_OPTIONS = 'slicerPasteOptions', SLICER_PASTE = 'slicerPaste',
        SLICER_SORT_ASCEND = 'slicerSortAscend',
        SLICER_SORT_DESCEND = 'slicerSortDescend', SLICER_PROPERTY = 'slicerProperty', SLICER_SETTING = 'slicerSetting',
        INSERT_COLUMNS = 'insertColumns', INSERT_ROWS = 'insertRows',
        DELETE_COLUMNS = 'deleteColumns', DELETE_ROWS = 'deleteRows', INSERT_DIALOG = 'insert_dialog',
        DELETE_DIALOG = 'delete_dialog', COLUMN_HEADERS = "columnHeaders", ROW_HEADERS = 'rowHeaders',
        CHANGE_CHART_TYPE_DIALOG = 'changeChartTypeDialog', SELECT_CHART_DATA_DIALOG = 'selectChartDataDialog',
        FORMAT_CHART = 'formatChart', MOVE_CHART_DIALOG = 'moveChartDialog',
        FLOATING_OBJECT_CUT = 'floatingObjectCut', FLOATING_OBJECT_COPY = 'floatingObjectCopy',
        RESET_CHART_COLOR = 'resetChartColor';

    var VIEWPORT = "viewport", COLHEADER = "colHeader", ROWHEADER = "rowHeader", CORNER = 'corner', SLICER = "slicer",
        SHEETTAB = "sheetTab", CHART = 'chart';

    function isNullOrUndefined(value) {
        return value === undefined || value === null;
    }

    function iteratorMenuDataByName(menuData, name, callback) {
        var menuDataCount = menuData.length, menuItemDataIndex = 0;
        for (; menuItemDataIndex < menuDataCount; menuItemDataIndex++) {
            if (isNullOrUndefined(menuData[menuItemDataIndex])) {
                continue;
            }
            if (name === menuData[menuItemDataIndex].name) {
                callback(menuData, menuItemDataIndex);
                return;
            }
            if (menuData[menuItemDataIndex].subMenu) {
                iteratorMenuDataByName(menuData[menuItemDataIndex].subMenu, name, callback);
            }
        }
    }

    function containsLockedCellsInSelection(sheet, row, column, rowCount, columnCount) {
        row = row < 0 ? 0 : row;
        column = column < 0 ? 0 : column;
        for (var i = row; i < row + rowCount; i++) {
            for (var j = column; j < column + columnCount; j++) {
                if (sheet.getCell(i, j).locked()) {
                    return true;
                }
            }
        }
    }
    function containLockedCellsInSelections(sheet) {
        var selections = sheet.getSelections();
        var containLockedCellInSelections = false;
        for (var i = 0; i < selections.length; i++) {
            if (containsLockedCellsInSelection(sheet, selections[i].row, selections[i].col, selections[i].rowCount, selections[i].colCount)) {
                containLockedCellInSelections = true;
            }
        }
        return containLockedCellInSelections;
    }
    function isFullRow(sheet) {
        var selections = sheet.getSelections();
        for (var i = 0; i < selections.length; i++) {
            if (selections[i].col !== -1) {
                return false;
            }
        }
        return true;
    }
    function isFullCol(sheet) {
        var selections = sheet.getSelections();
        for (var i = 0; i < selections.length; i++) {
            if (selections[i].row !== -1) {
                return false;
            }
        }
        return true;
    }
    function initContextMenu() {
        var spread = designer.wrapper.spread;

        function DesignerContextMenu() {
        }

        DesignerContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu();
        DesignerContextMenu.prototype.onOpenMenu = function (menuData, itemsDataForShown, hitInfo, workbook) {
            var self = this;
            if (hitInfo.tabStripHitInfo) {
                var sheets = workbook.sheets;
                for (var i = 0; i < sheets.length; i++) {
                    if (!sheets[i].visible()) {
                        iteratorMenuDataByName(itemsDataForShown, MENUITEM_NAME_PREFIX + UNHIDE_SHEET, function (menuItemsArray, menuItemIndex) {
                            menuItemsArray[menuItemIndex].disable = false;
                        });
                        return;
                    }
                }
                iteratorMenuDataByName(itemsDataForShown, MENUITEM_NAME_PREFIX + UNHIDE_SHEET, function (menuItemsArray, menuItemIndex) {
                    menuItemsArray[menuItemIndex].disable = true;
                });
            } else {
                var sheet = workbook.getActiveSheet();
                var row = sheet.getActiveRowIndex();
                var col = sheet.getActiveColumnIndex();
                var comment = sheet.comments.get(row, col);
                if (!comment) {
                    iteratorMenuDataByName(itemsDataForShown, MENUITEM_NAME_PREFIX + FORMAT_COMMENT, function (menuItemsArray, menuItemIndex) {
                        menuItemsArray.splice(menuItemIndex, 1);
                    });
                }
            }
            var workSheetHitInfo = hitInfo.worksheetHitInfo;
            if (workSheetHitInfo) {
                var chart = workSheetHitInfo.floatingObjectHitInfo && workSheetHitInfo.floatingObjectHitInfo.floatingObject;
                if (chart instanceof GC.Spread.Sheets.Charts.Chart) {
                    var chartHitInfo = chart.hitTest(hitInfo.x, hitInfo.y);
                    if (chartHitInfo) {
                        var chartElementType = chartHelper.chartElementType;
                        iteratorMenuDataByName(itemsDataForShown, MENUITEM_NAME_PREFIX + FORMAT_CHART, function (menuItemsArray, menuItemIndex) {
                            menuItemsArray[menuItemIndex].text = designer.res.contextMenu.formatChart[chartElementType[chartHitInfo.elementType]];
                            menuItemsArray[menuItemIndex].options = chartHitInfo;
                        });
                    }
                }
            }
            self.checkAvailableByCurrentSelections(itemsDataForShown, workbook);
            self.checkAvailableByProtectionSettings(itemsDataForShown, workbook);
            self.trimNullObject(itemsDataForShown);
            self.trimSeparatorLine(itemsDataForShown);
        };

        DesignerContextMenu.prototype.checkAvailableByCurrentSelections = function (itemsDataForShown, workbook) {
            var self = this;
            var sheet = workbook.getActiveSheet();
            for (var i = 0; i < itemsDataForShown.length; i++) {
                if (!itemsDataForShown[i]) {
                    continue;
                }
                switch (itemsDataForShown[i].name) {
                    case MENUITEM_NAME_PREFIX + INSERT_ROWS:
                    case MENUITEM_NAME_PREFIX + DELETE_ROWS:
                        if (!isFullRow(sheet)) {
                            itemsDataForShown[i].disable = true;
                        }
                        break;
                    case MENUITEM_NAME_PREFIX + INSERT_COLUMNS:
                    case MENUITEM_NAME_PREFIX + DELETE_COLUMNS:
                        if (!isFullCol(sheet)) {
                            itemsDataForShown[i].disable = true;
                        }
                        break;
                    default:
                        break;
                }
                if (itemsDataForShown[i] && itemsDataForShown[i].subMenu) {
                    self.checkAvailableByCurrentSelections(itemsDataForShown[i].subMenu, spread);
                }
            }
        };

        DesignerContextMenu.prototype.checkAvailableByProtectionSettings = function (itemsDataForShown, workbook) {
            var self = this;
            var sheet = workbook.getActiveSheet(), isProtected = sheet.options.isProtected,
                protectionOptions = sheet.options.protectionOptions;
            if (!isProtected) {
                return;
            }
            if (protectionOptions) {
                for (var i = 0; i < itemsDataForShown.length; i++) {
                    if (!itemsDataForShown[i]) {
                        continue;
                    }
                    switch (itemsDataForShown[i].name) {
	                    /* ZQF START*/
                        case MENUITEM_NAME_PREFIX + CASHFLOW_FEATURE:
                        case MENUITEM_NAME_PREFIX + NOTE_FEATURE:
	                    case MENUITEM_NAME_PREFIX + CELL_TYPE:
	                    /*case MENUITEM_NAME_PREFIX + CUSTOM_LINKS:*/
	                    case MENUITEM_NAME_PREFIX + MUTUAL_INDEX:
	                    case MENUITEM_NAME_PREFIX + CUSTOM_LABEL:
	                    case MENUITEM_NAME_PREFIX + CUSTOM_CLEAR:
	                    /* ZQF END*/
                        case MENUITEM_NAME_PREFIX + FLOATING_OBJECT_CUT:
                        case MENUITEM_NAME_PREFIX + FLOATING_OBJECT_COPY:
                        case MENUITEM_NAME_PREFIX + RESET_CHART_COLOR:
                        case MENUITEM_NAME_PREFIX + CHANGE_CHART_TYPE_DIALOG:
                        case MENUITEM_NAME_PREFIX + SELECT_CHART_DATA_DIALOG:
                        case MENUITEM_NAME_PREFIX + MOVE_CHART_DIALOG:
                        case MENUITEM_NAME_PREFIX + FORMAT_CHART:
                        case MENUITEM_NAME_PREFIX + SLICER_CUT:
                        case MENUITEM_NAME_PREFIX + SLICER_COPY:
                        case MENUITEM_NAME_PREFIX + SLICER_PASTE:
                        case MENUITEM_NAME_PREFIX + SLICER_SORT_ASCEND:
                        case MENUITEM_NAME_PREFIX + SLICER_SORT_DESCEND:
                        case MENUITEM_NAME_PREFIX + REMOVE_SLICER:
                        case MENUITEM_NAME_PREFIX + SLICER_PROPERTY:
                        case MENUITEM_NAME_PREFIX + SLICER_SETTING:
                            if (!protectionOptions.allowEditObjects) {
                                itemsDataForShown.splice(0, itemsDataForShown.length);
                            }
                            break;
                        case MENUITEM_NAME_PREFIX + FORMAT_COMMENT:
                            if (!protectionOptions.allowEditObjects) {
                                itemsDataForShown[i] = null;
                            }
                            break;
                        case MENUITEM_NAME_PREFIX + ROW_HEIGHT:
                            if (!protectionOptions.allowResizeRows) {
                                itemsDataForShown[i].disable = true;
                            }
                            break;
                        case MENUITEM_NAME_PREFIX + COL_WIDTH:
                            if (!protectionOptions.allowResizeColumns) {
                                itemsDataForShown[i].disable = true;
                            }
                            break;
                        case MENUITEM_NAME_PREFIX + INSERT_DIALOG:
                        case MENUITEM_NAME_PREFIX + DELETE_DIALOG:
                        case MENUITEM_NAME_PREFIX + FORMAT_CELLS:
                        case MENUITEM_NAME_PREFIX + DEFINE_NAME:
                        case MENUITEM_NAME_PREFIX + CELL_TAG:
                        case MENUITEM_NAME_PREFIX + ROW_TAG:
                        case MENUITEM_NAME_PREFIX + COL_TAG:
                        case MENUITEM_NAME_PREFIX + HIDE_ROWS:
                        case MENUITEM_NAME_PREFIX + UNHIDE_ROWS:
                        case MENUITEM_NAME_PREFIX + HIDE_COLUMNS:
                        case MENUITEM_NAME_PREFIX + UNHIDE_COLS:
                        case MENUITEM_NAME_PREFIX + COLUMN_HEADERS:
                        case MENUITEM_NAME_PREFIX + ROW_HEADERS:
                            itemsDataForShown[i].disable = true;
                            break;
                        case MENUITEM_NAME_PREFIX + INSERT_ROWS:
                            if (!protectionOptions.allowInsertRows) {
                                itemsDataForShown[i].disable = true;
                            }
                            break;
                        case MENUITEM_NAME_PREFIX + INSERT_COLUMNS:
                            if (!protectionOptions.allowInsertColumns) {
                                itemsDataForShown[i].disable = true;
                            }
                            break;
                        case MENUITEM_NAME_PREFIX + DELETE_COLUMNS:
                            if (!protectionOptions.allowDeleteColumns) {
                                itemsDataForShown[i].disable = true;
                            }
                            break;
                        case MENUITEM_NAME_PREFIX + DELETE_ROWS:
                            if (!protectionOptions.allowDeleteRows) {
                                itemsDataForShown[i].disable = true;
                            }
                            break;
                        case MENUITEM_NAME_PREFIX + FILTER:
                            if (!protectionOptions.allowFilter) {
                                itemsDataForShown[i].disable = true;
                            }
                            break;
                        case MENUITEM_NAME_PREFIX + SORT_ASCEND:
                        case MENUITEM_NAME_PREFIX + SORT_DESCEND:
                        case MENUITEM_NAME_PREFIX + CUSTOM_SORT:
                            if (!protectionOptions.allowSort
                                || containLockedCellsInSelections(sheet)) {
                                itemsDataForShown[i].disable = true;
                            }
                            break;
                        default:
                            break;
                    }
                    if (itemsDataForShown[i] && itemsDataForShown[i].subMenu) {
                        self.checkAvailableByProtectionSettings(itemsDataForShown[i].subMenu, workbook);
                    }
                }
            }
        };

        DesignerContextMenu.prototype.trimNullObject = function (itemsData) {
            var self = this;
            var i, itemsCount = itemsData.length;
            for (i = itemsCount - 1; i > 0; i--) {
                if (!itemsData[i]) {
                    itemsData.splice(i, 1);
                } else if (itemsData[i].subMenu) {
                    self.trimNullObject(itemsData[i].subMenu);
                }
            }
            return itemsData;
        };

        DesignerContextMenu.prototype.trimSeparatorLine = function (itemsData) {
            var itemsDataForShown = [];
            var i, itemsCount = itemsData.length;
            for (i = 0; i < itemsCount; i++) {
                if (itemsData[i] && itemsData[i].type === SEPARATOR && itemsData[i + 1] && itemsData[i + 1].type === SEPARATOR) {
                    continue;
                }
                itemsDataForShown.push(itemsData[i]);
            }
            itemsCount = itemsDataForShown.length;
            var start = 0, end = 0, calcStart = true, calcEnd = true;
            for (i = 0; i < itemsCount; i++) {
                if (calcStart && itemsDataForShown[i].type === SEPARATOR) {
                    start++;
                } else {
                    calcStart = false;
                }
                if (calcEnd && itemsDataForShown[itemsCount - 1 - i].type === SEPARATOR) {
                    end++;
                } else {
                    calcEnd = false;
                }
                if (!calcStart && !calcEnd) {
                    break;
                }
            }
            itemsDataForShown.splice(itemsCount - end, end);
            itemsDataForShown.splice(0, start);
            itemsData.splice(0, itemsData.length);
            for (i = 0; i < itemsDataForShown.length; i++) {
                itemsData.push(itemsDataForShown[i]);
            }
            return itemsData;
        };

        spread.contextMenu = new DesignerContextMenu();
        var contextMenuRes = designer.res.contextMenu;
        spread.contextMenu.menuData = [
            /* ZQF START*/
            {
                text: contextMenuRes.cellType,
                name: MENUITEM_NAME_PREFIX + CELL_TYPE,
                command: MENUITEM_NAME_PREFIX + CELL_TYPE,
                iconClass: ICON_CLASS_PREFIX + CELL_TYPE,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            /*{
                text: contextMenuRes.customLinks,
                name: MENUITEM_NAME_PREFIX + CUSTOM_LINKS,
                command: MENUITEM_NAME_PREFIX + CUSTOM_LINKS,
                iconClass: ICON_CLASS_PREFIX + CUSTOM_LINKS,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },*/
            {
                text: contextMenuRes.mutualIndex,
                name: MENUITEM_NAME_PREFIX + MUTUAL_INDEX,
                command: MENUITEM_NAME_PREFIX + MUTUAL_INDEX,
                iconClass: ICON_CLASS_PREFIX + MUTUAL_INDEX,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                text: contextMenuRes.customLabel,
                name: MENUITEM_NAME_PREFIX + CUSTOM_LABEL,
                command: MENUITEM_NAME_PREFIX + CUSTOM_LABEL,
                iconClass: ICON_CLASS_PREFIX + CUSTOM_LABEL,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            
            {
                text: contextMenuRes.leftTag,
                name: MENUITEM_NAME_PREFIX + LEFT_TAG,
                command: MENUITEM_NAME_PREFIX + LEFT_TAG,
                iconClass: ICON_CLASS_PREFIX + LEFT_TAG,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                text: contextMenuRes.rightTag,
                name: MENUITEM_NAME_PREFIX + RIGHT_TAG,
                command: MENUITEM_NAME_PREFIX + RIGHT_TAG,
                iconClass: ICON_CLASS_PREFIX + RIGHT_TAG,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                text: contextMenuRes.noteFeature,
                name: MENUITEM_NAME_PREFIX + NOTE_FEATURE,
                command: MENUITEM_NAME_PREFIX + NOTE_FEATURE,
                iconClass: ICON_CLASS_PREFIX + NOTE_FEATURE,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                text: contextMenuRes.cashFlowFeature,
                name: MENUITEM_NAME_PREFIX + CASHFLOW_FEATURE,
                command: MENUITEM_NAME_PREFIX + CASHFLOW_FEATURE,
                iconClass: ICON_CLASS_PREFIX + CASHFLOW_FEATURE,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            { "type": SEPARATOR },
            {
                text: contextMenuRes.customClear,
                name: MENUITEM_NAME_PREFIX + CUSTOM_CLEAR,
                command: MENUITEM_NAME_PREFIX + CUSTOM_CLEAR,
                iconClass: ICON_CLASS_PREFIX + CUSTOM_CLEAR,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            { "type": SEPARATOR },
            /* ZQF END*/
            {
                text: contextMenuRes.cut,
                name: MENUITEM_NAME_PREFIX + CUT,
                command: MENUITEM_NAME_PREFIX + CUT,
                iconClass: ICON_CLASS_PREFIX + CUT,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                name: MENUITEM_NAME_PREFIX + COPY,
                text: contextMenuRes.copy,
                command: MENUITEM_NAME_PREFIX + COPY,
                iconClass: ICON_CLASS_PREFIX + COPY,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                text: contextMenuRes.paste,
                name: MENUITEM_NAME_PREFIX + PASTE,
                iconClass: ICON_CLASS_PREFIX + PASTE_OPTIONS,
                type: GROUP_HEADER,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                command: MENUITEM_NAME_PREFIX + PASTE_ALL,
                name: MENUITEM_NAME_PREFIX + PASTE_ALL,
                iconClass: ICON_CLASS_PREFIX + PASTE_ALL,
                group: MENUITEM_NAME_PREFIX + PASTE,
                text: contextMenuRes.pasteAll,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                command: MENUITEM_NAME_PREFIX + PASTE_FORMULA,
                name: MENUITEM_NAME_PREFIX + PASTE_FORMULA,
                iconClass: ICON_CLASS_PREFIX + PASTE_FORMULA,
                group: MENUITEM_NAME_PREFIX + PASTE,
                text: contextMenuRes.pasteFormula,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                command: MENUITEM_NAME_PREFIX + PASTE_VALUES,
                name: MENUITEM_NAME_PREFIX + PASTE_VALUES,
                iconClass: ICON_CLASS_PREFIX + PASTE_VALUES,
                group: MENUITEM_NAME_PREFIX + PASTE,
                text: contextMenuRes.pasteValue,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                command: MENUITEM_NAME_PREFIX + PASTE_FORMATTING,
                name: MENUITEM_NAME_PREFIX + PASTE_FORMATTING,
                iconClass: ICON_CLASS_PREFIX + PASTE_FORMATTING,
                group: MENUITEM_NAME_PREFIX + PASTE,
                text: contextMenuRes.pasteFormatting,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                text: contextMenuRes.cut,
                name: MENUITEM_NAME_PREFIX + FLOATING_OBJECT_CUT,
                command: MENUITEM_NAME_PREFIX + FLOATING_OBJECT_CUT,
                iconClass: ICON_CLASS_PREFIX + CUT,
                workArea: CHART
            },
            {
                name: MENUITEM_NAME_PREFIX + FLOATING_OBJECT_COPY,
                text: contextMenuRes.copy,
                command: MENUITEM_NAME_PREFIX + FLOATING_OBJECT_COPY,
                iconClass: ICON_CLASS_PREFIX + COPY,
                workArea: CHART
            },
            { "type": SEPARATOR },
            {
                text: contextMenuRes.resetChartColor,
                name: MENUITEM_NAME_PREFIX + RESET_CHART_COLOR,
                iconClass: ICON_CLASS_PREFIX + RESET_CHART_COLOR,
                command: MENUITEM_NAME_PREFIX + RESET_CHART_COLOR,
                workArea: CHART
            },
            {
                text: contextMenuRes.changeChartType,
                name: MENUITEM_NAME_PREFIX + CHANGE_CHART_TYPE_DIALOG,
                iconClass: ICON_CLASS_PREFIX + CHANGE_CHART_TYPE_DIALOG,
                command: MENUITEM_NAME_PREFIX + CHANGE_CHART_TYPE_DIALOG,
                workArea: CHART
            },
            {
                text: contextMenuRes.selectData,
                name: MENUITEM_NAME_PREFIX + SELECT_CHART_DATA_DIALOG,
                iconClass: ICON_CLASS_PREFIX + SELECT_CHART_DATA_DIALOG,
                command: MENUITEM_NAME_PREFIX + SELECT_CHART_DATA_DIALOG,
                workArea: CHART
            },
            {
                text: contextMenuRes.moveChart,
                name: MENUITEM_NAME_PREFIX + MOVE_CHART_DIALOG,
                iconClass: ICON_CLASS_PREFIX + MOVE_CHART_DIALOG,
                command: MENUITEM_NAME_PREFIX + MOVE_CHART_DIALOG,
                workArea: CHART
            },
            {
                text: contextMenuRes.formatChart.chartArea,
                name: MENUITEM_NAME_PREFIX + FORMAT_CHART,
                iconClass: ICON_CLASS_PREFIX + FORMAT_CHART,
                command: MENUITEM_NAME_PREFIX + FORMAT_CHART,
                workArea: CHART
            },
            { "type": SEPARATOR },
            {
                text: contextMenuRes.insertDialog,
                name: MENUITEM_NAME_PREFIX + INSERT_DIALOG,
                command: MENUITEM_NAME_PREFIX + INSERT_DIALOG,
                workArea: VIEWPORT + CORNER
            },
            {
                text: contextMenuRes.deleteDialog,
                name: MENUITEM_NAME_PREFIX + DELETE_DIALOG,
                command: MENUITEM_NAME_PREFIX + DELETE_DIALOG,
                workArea: VIEWPORT + CORNER
            },
            {
                text: contextMenuRes.insert,
                name: MENUITEM_NAME_PREFIX + INSERT_COLUMNS,
                command: SPREAD_COMMAND_PREFIX + INSERT_COLUMNS,
                workArea: COLHEADER
            },
            {
                text: contextMenuRes.delete,
                name: MENUITEM_NAME_PREFIX + DELETE_COLUMNS,
                command: SPREAD_COMMAND_PREFIX + DELETE_COLUMNS,
                workArea: COLHEADER
            },
            {
                text: contextMenuRes.insert,
                name: MENUITEM_NAME_PREFIX + INSERT_ROWS,
                command: SPREAD_COMMAND_PREFIX + INSERT_ROWS,
                workArea: ROWHEADER
            },
            {
                text: contextMenuRes.delete,
                name: MENUITEM_NAME_PREFIX + DELETE_ROWS,
                command: SPREAD_COMMAND_PREFIX + DELETE_ROWS,
                workArea: ROWHEADER
            },
            {
                text: contextMenuRes.clearcontents,
                command: SPREAD_COMMAND_PREFIX + CLEAR_CONTENT,
                name: MENUITEM_NAME_PREFIX + CLEAR_CONTENT,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            { "type": SEPARATOR },
            {
                text: contextMenuRes.insert,
                name: MENUITEM_NAME_PREFIX + INSERT_SHEET,
                command: SPREAD_COMMAND_PREFIX + INSERT_SHEET,
                workArea: SHEETTAB
            },
            {
                text: contextMenuRes.delete,
                name: MENUITEM_NAME_PREFIX + DELETE_SHEET,
                command: SPREAD_COMMAND_PREFIX + DELETE_SHEET,
                workArea: SHEETTAB
            },
            {
                text: contextMenuRes.protectsheet,
                name: MENUITEM_NAME_PREFIX + PROTECT_SHEET,
                command: MENUITEM_NAME_PREFIX + PROTECT_SHEET,
                iconClass: ICON_CLASS_PREFIX + PROTECT_SHEET,
                workArea: SHEETTAB
            },
            { "type": SEPARATOR },
            {
                text: contextMenuRes.filter,
                name: MENUITEM_NAME_PREFIX + FILTER,
                command: SPREAD_COMMAND_PREFIX + FILTER,
                workArea: VIEWPORT + CORNER
            },
            {
                text: contextMenuRes.sort,
                name: MENUITEM_NAME_PREFIX + SORT,
                subMenu: [
                    {
                        text: contextMenuRes.sortAToZ,
                        name: MENUITEM_NAME_PREFIX + SORT_ASCEND,
                        command: SPREAD_COMMAND_PREFIX + SORT_ASCEND,
                        iconClass: ICON_CLASS_PREFIX + SORT_ASCEND
                    },
                    {
                        text: contextMenuRes.sortZToA,
                        name: MENUITEM_NAME_PREFIX + SORT_DESCEND,
                        command: SPREAD_COMMAND_PREFIX + SORT_DESCEND,
                        iconClass: ICON_CLASS_PREFIX + SORT_DESCEND
                    },
                    {
                        text: contextMenuRes.customSort,
                        name: MENUITEM_NAME_PREFIX + CUSTOM_SORT,
                        command: MENUITEM_NAME_PREFIX + CUSTOM_SORT,
                        iconClass: ICON_CLASS_PREFIX + CUSTOM_SORT
                    }
                ],
                workArea: VIEWPORT + CORNER
            },
            { "type": SEPARATOR },
            {
                text: contextMenuRes.insertComment,
                name: SPREAD_NAME_PREFIX + INSERT_COMMENT,
                command: SPREAD_COMMAND_PREFIX + INSERT_COMMENT,
                iconClass: ICON_CLASS_PREFIX + INSERT_COMMENT,
                workArea: VIEWPORT + CORNER
            },
            {
                text: contextMenuRes.editComment,
                name: SPREAD_NAME_PREFIX + EDIT_COMMENT,
                command: SPREAD_COMMAND_PREFIX + EDIT_COMMENT,
                iconClass: ICON_CLASS_PREFIX + EDIT_COMMENT,
                workArea: VIEWPORT + CORNER
            },
            {
                text: contextMenuRes.deleteComment,
                name: SPREAD_NAME_PREFIX + DELETE_COMMENT,
                command: SPREAD_COMMAND_PREFIX + DELETE_COMMENT,
                iconClass: ICON_CLASS_PREFIX + DELETE_COMMENT,
                workArea: VIEWPORT + CORNER
            },
            {
                text: contextMenuRes.unHideComment,
                name: SPREAD_NAME_PREFIX + TOGGLE_COMMENT,
                command: SPREAD_COMMAND_PREFIX + TOGGLE_COMMENT,
                workArea: VIEWPORT + CORNER
            },
            {
                text: contextMenuRes.formatComment,
                name: MENUITEM_NAME_PREFIX + FORMAT_COMMENT,
                command: MENUITEM_NAME_PREFIX + FORMAT_COMMENT,
                iconClass: ICON_CLASS_PREFIX + FORMAT_COMMENT,
                workArea: VIEWPORT + CORNER
            },
            { "type": SEPARATOR },
            {
                text: contextMenuRes.formatCells,
                name: MENUITEM_NAME_PREFIX + FORMAT_CELLS,
                command: MENUITEM_NAME_PREFIX + FORMAT_CELLS,
                iconClass: ICON_CLASS_PREFIX + FORMAT_CELLS,
                workArea: VIEWPORT + COLHEADER + ROWHEADER + CORNER
            },
            {
                text: contextMenuRes.defineName,
                name: MENUITEM_NAME_PREFIX + DEFINE_NAME,
                command: MENUITEM_NAME_PREFIX + DEFINE_NAME,
                workArea: VIEWPORT + CORNER
            },
            {
                text: contextMenuRes.tag,
                name: MENUITEM_NAME_PREFIX + CELL_TAG,
                command: MENUITEM_NAME_PREFIX + CELL_TAG,
                workArea: VIEWPORT + CORNER
            },
            {
                text: contextMenuRes.tag,
                name: MENUITEM_NAME_PREFIX + ROW_TAG,
                command: MENUITEM_NAME_PREFIX + ROW_TAG,
                workArea: ROWHEADER
            },
            {
                text: contextMenuRes.tag,
                name: MENUITEM_NAME_PREFIX + COL_TAG,
                command: MENUITEM_NAME_PREFIX + COL_TAG,
                workArea: COLHEADER
            },
            {
                text: contextMenuRes.rowHeight,
                name: MENUITEM_NAME_PREFIX + ROW_HEIGHT,
                command: MENUITEM_NAME_PREFIX + ROW_HEIGHT,
                workArea: ROWHEADER
            },
            {
                text: contextMenuRes.columnWidth,
                name: MENUITEM_NAME_PREFIX + COL_WIDTH,
                command: MENUITEM_NAME_PREFIX + COL_WIDTH,
                workArea: COLHEADER
            },
            {
                text: contextMenuRes.hide,
                name: MENUITEM_NAME_PREFIX + HIDE_ROWS,
                command: SPREAD_COMMAND_PREFIX + HIDE_ROWS,
                workArea: ROWHEADER
            },
            {
                text: contextMenuRes.hide,
                name: MENUITEM_NAME_PREFIX + HIDE_COLUMNS,
                command: SPREAD_COMMAND_PREFIX + HIDE_COLUMNS,
                workArea: COLHEADER
            },
            {
                text: contextMenuRes.unhide,
                name: MENUITEM_NAME_PREFIX + UNHIDE_COLS,
                command: SPREAD_COMMAND_PREFIX + UNHIDE_COLS,
                workArea: COLHEADER
            },
            {
                text: contextMenuRes.unhide,
                name: MENUITEM_NAME_PREFIX + UNHIDE_ROWS,
                command: SPREAD_COMMAND_PREFIX + UNHIDE_ROWS,
                workArea: ROWHEADER
            },
            {
                text: contextMenuRes.headers,
                name: MENUITEM_NAME_PREFIX + COLUMN_HEADERS,
                command: MENUITEM_NAME_PREFIX + COLUMN_HEADERS,
                workArea: COLHEADER
            },
            {
                text: contextMenuRes.headers,
                name: MENUITEM_NAME_PREFIX + ROW_HEADERS,
                command: MENUITEM_NAME_PREFIX + ROW_HEADERS,
                workArea: ROWHEADER
            },
            { "type": SEPARATOR },
            {
                text: contextMenuRes.sheetTabColor,
                name: MENUITEM_NAME_PREFIX + SHOW_TAB_COLOR,
                subMenu: [{
                    name: MENUITEM_NAME_PREFIX + TAB_COLOR,
                    command: MENUITEM_NAME_PREFIX + TAB_COLOR
                }],
                workArea: SHEETTAB
            },
            {
                text: contextMenuRes.hide,
                name: MENUITEM_NAME_PREFIX + HIDE_SHEET,
                command: SPREAD_COMMAND_PREFIX + HIDE_SHEET,
                workArea: SHEETTAB
            },
            {
                text: contextMenuRes.unhide,
                name: MENUITEM_NAME_PREFIX + UNHIDE_SHEET,
                command: SPREAD_COMMAND_PREFIX + UNHIDE_SHEET,
                workArea: SHEETTAB
            },
            {
                text: contextMenuRes.tag,
                name: MENUITEM_NAME_PREFIX + SHEET_TAG,
                command: MENUITEM_NAME_PREFIX + SHEET_TAG,
                workArea: SHEETTAB
            },
            { "type": SEPARATOR },
            {
                text: contextMenuRes.cut,
                name: MENUITEM_NAME_PREFIX + SLICER_CUT,
                iconClass: ICON_CLASS_PREFIX + CUT,
                command: SPREAD_COMMAND_PREFIX + CUT,
                workArea: SLICER
            },
            {
                text: contextMenuRes.copy,
                name: MENUITEM_NAME_PREFIX + SLICER_COPY,
                iconClass: ICON_CLASS_PREFIX + COPY,
                command: SPREAD_COMMAND_PREFIX + COPY,
                workArea: SLICER
            },
            {
                text: contextMenuRes.paste,
                name: MENUITEM_NAME_PREFIX + SLICER_PASTE_OPTIONS,
                iconClass: ICON_CLASS_PREFIX + PASTE_OPTIONS,
                type: GROUP_HEADER,
                workArea: SLICER
            },
            {
                command: SPREAD_COMMAND_PREFIX + PASTE_ALL,
                name: MENUITEM_NAME_PREFIX + SLICER_PASTE,
                iconClass: ICON_CLASS_PREFIX + PASTE_ALL,
                group: MENUITEM_NAME_PREFIX + SLICER_PASTE_OPTIONS,
                text: contextMenuRes.pasteAll,
                workArea: SLICER
            },
            {
                text: contextMenuRes.sortAToZ,
                name: MENUITEM_NAME_PREFIX + SLICER_SORT_ASCEND,
                iconClass: ICON_CLASS_PREFIX + SORT_ASCEND,
                command: SPREAD_COMMAND_PREFIX + SLICER_SORT_ASCEND,
                workArea: SLICER
            },
            {
                text: contextMenuRes.sortZToA,
                name: MENUITEM_NAME_PREFIX + SLICER_SORT_DESCEND,
                iconClass: ICON_CLASS_PREFIX + SORT_DESCEND,
                command: SPREAD_COMMAND_PREFIX + SLICER_SORT_DESCEND,
                workArea: SLICER
            },
            {
                text: contextMenuRes.remove,
                name: MENUITEM_NAME_PREFIX + REMOVE_SLICER,
                command: SPREAD_COMMAND_PREFIX + REMOVE_SLICER,
                workArea: SLICER
            },
            {
                text: contextMenuRes.slicerProperty,
                name: MENUITEM_NAME_PREFIX + SLICER_PROPERTY,
                command: MENUITEM_NAME_PREFIX + SLICER_PROPERTY,
                iconClass: ICON_CLASS_PREFIX + SLICER_PROPERTY,
                workArea: SLICER
            },
            {
                text: contextMenuRes.slicerSetting,
                name: MENUITEM_NAME_PREFIX + SLICER_SETTING,
                command: MENUITEM_NAME_PREFIX + SLICER_SETTING,
                iconClass: ICON_CLASS_PREFIX + SLICER_SETTING,
                workArea: SLICER
            }
        ];

        /* ZQF START*/
        if(window.parent.location.search.substr(1).split('&')[0].split('=')[1] === 'openDgNoteInfo'){
            spread.contextMenu.menuData.splice(0, 2);
            spread.contextMenu.menuData.splice(4, 1);
        }else if(window.parent.location.search.substr(1).split('&')[0].split('=')[1] === 'reportApproval'){
            spread.contextMenu.menuData.splice(0, 8);
        }else if(window.parent.location.search.substr(1).split('&')[0].split('=')[1] === 'openQYXJFile'){
            spread.contextMenu.menuData.splice(0, 6);
        }else{
            spread.contextMenu.menuData.splice(5, 2);
        }
        /* ZQF END*/

        function DesignerMenuView() {
        }

        DesignerMenuView.prototype = new GC.Spread.Sheets.ContextMenu.MenuView();
        DesignerMenuView.prototype.createMenuItemElement = function (menuItemData) {
            var self = this;
            var menuItemView;
            if (menuItemData.name === MENUITEM_NAME_PREFIX + TAB_COLOR) {
                var supMenuItemContainer = GC.Spread.Sheets.ContextMenu.MenuView.prototype.createMenuItemElement.call(self, menuItemData);
                supMenuItemContainer.empty();
                $(supMenuItemContainer[0]).colorpicker(
                    {
                        valueChanged: function (e, value) {
                            if (!value.isSetColorDirectly) {
                                $(supMenuItemContainer[0]).data("selectedColor", value);
                            } else {
                                designer.actions.doAction("setSheetTabColor", designer.wrapper.spread, value.color);
                            }
                        }
                    }
                );
                $(supMenuItemContainer[0]).colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
                supMenuItemContainer.css({ "margin": "0", "padding": "0" });
                supMenuItemContainer.css("background", "white");
                return supMenuItemContainer;
            } else if (menuItemData.name === MENUITEM_NAME_PREFIX + PROTECT_SHEET) {
                var activeSheet = designer.wrapper.spread.getActiveSheet();
                if (activeSheet.options.isProtected) {
                    menuItemData.text = contextMenuRes.unprotectsheet;
                } else {
                    menuItemData.text = contextMenuRes.protectsheet;
                }
                menuItemView = GC.Spread.Sheets.ContextMenu.MenuView.prototype.createMenuItemElement.call(self, menuItemData);
                return menuItemView;
            } else {
                menuItemView = GC.Spread.Sheets.ContextMenu.MenuView.prototype.createMenuItemElement.call(self, menuItemData);
                return menuItemView;
            }
        };
        DesignerMenuView.prototype.getCommandOptions = function (menuItemData, host, event) {
            if (menuItemData.name === MENUITEM_NAME_PREFIX + TAB_COLOR) {
                return {
                    value: $(host).children().data("selectedColor")
                };
            } else if (menuItemData.name === MENUITEM_NAME_PREFIX + FORMAT_CHART) {
                return menuItemData.options;
            }
        };
        spread.contextMenu.menuView = new DesignerMenuView();
        designer.spreadActions.initDesignerCommands(spread.commandManager());
    }

    contextMenu.initContextMenu = initContextMenu;

    //endregion
    //#region Loader.Ready
    designer.loader.ready(function () {
        if (!designer.wrapper.spread.notWorking) {
            initContextMenu();
        }
    });
    designer.contextMenu = contextMenu;
})();
