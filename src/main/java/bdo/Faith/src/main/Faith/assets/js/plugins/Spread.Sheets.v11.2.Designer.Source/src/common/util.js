(function () {
    'use strict';

    var Sheets = GC.Spread.Sheets;
    var designer = Sheets.Designer;
    var Charts = Sheets.Charts;
    var formulaToRange = Sheets.CalcEngine.formulaToRange;
    var Chart = Charts.Chart;
    var ColorHelper = designer.ColorHelper;

    var keyword_null = null, keyword_undefined = void 0;
    var SLICER_PADDING = 6;
    var SLICER_ITEM_SPACE = 2;

    var util = {};

    //for online use to simulate clipboard
    util.clipboard = {};


    ///////////////////////////////////////////////////////
    // Debuging
    ///////////////////////////////////////////////////////

    function warn(message) {
        console.warn('SpreadDesigner: ', message);
    }

    util.warn = warn;
    function error(message) {
        console.error('SpreadDesigner: ', message);
    }

    util.error = error;
    function assert(c, message) {
        if (!c) {
            throw 'SpreadDeisgner Assertion: ' + message;
        }
    }

    util.assert = assert;

    ///////////////////////////////////////////////////////
    // String helper
    ///////////////////////////////////////////////////////
    function format(s) {
        var args = [];
        var reg;
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        if (args.length === 1 && typeof args[0] === 'object') {
            reg = /{([^{}]+)}/gm;
            return s.replace(reg, function (match, name) {
                return args[0][name];
            });
        } else {
            reg = /{(\d+)}/gm;
            return s.replace(reg, function (match, name) {
                return args[~~name];
            });
        }
    }

    util.format = format;

    ///////////////////////////////////////////////////////
    // sheet.util.canaelDefault event
    ///////////////////////////////////////////////////////
    function cancelDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.cancelBubble = false;
            e.returnValue = false;
        }
    }

    util.cancelDefault = cancelDefault;

    ///////////////////////////////////////////////////////
    // DOM tree access helper
    ///////////////////////////////////////////////////////
    function getCanvas(spread) {
        var host = spread.getHost(), id = host.id;

        if (id) {
            return document.getElementById(id + "vp_vp");
        } else {
            return $(host).find("canvas[id='vp_vp']")[0];
        }
    }

    util.getCanvas = getCanvas;

    function getTabStripCanvas() {
        return document.getElementById(designer.wrapper.spread.getHost().id + "_tabStrip");
    }

    util.getTabStripCanvas = getTabStripCanvas;

    ///////////////////////////////////////////////////////
    // Selection helper
    ///////////////////////////////////////////////////////
    function findSelection(sheet, row, col) {
        if (sheet) {
            var selections = sheet.getSelections();
            if (selections) {
                for (var i = 0, len = selections.length; i < len; i++) {
                    var range = selections[i];
                    if (range.contains(row, col)) {
                        return range;
                    }
                }
            }
        }

        return keyword_null;
    }

    util.findSelection = findSelection;

    ///////////////////////////////////////////////////////
    // Calc & Parser helper
    ///////////////////////////////////////////////////////
    var LatinUnicodeCategory = {
        UppercaseLetter: 0x00,
        LowercaseLetter: 0x01,
        DecimalDigitNumber: 0x08,
        OtherNumber: 0x0a,
        SpaceSeparator: 0x0b,
        Control: 0x0e,
        ConnectorPunctuation: 0x12,
        DashPunctuation: 0x13,
        OpenPunctuation: 0x14,
        ClosePunctuation: 0x15,
        InitialQuotePunctuation: 0x16,
        FinalQuotePunctuation: 0x17,
        OtherPunctuation: 0x18,
        MathSymbol: 0x19,
        currencySymbol: 0x1a,
        ModifierSymbol: 0x1b,
        OtherSymbol: 0x1c
    };
    var categoryForLatin1 = [
        0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe,
        0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe,
        0xb, 0x18, 0x18, 0x18, 0x1a, 0x18, 0x18, 0x18, 0x14, 0x15, 0x18, 0x19, 0x18, 0x13, 0x18, 0x18,
        0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x18, 0x18, 0x19, 0x19, 0x19, 0x18,
        0x18, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
        0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x14, 0x18, 0x15, 0x1b, 0x12,
        0x1b, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1,
        0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x14, 0x19, 0x15, 0x19, 0xe,
        0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe,
        0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe, 0xe,
        0xb, 0x18, 0x1a, 0x1a, 0x1a, 0x1a, 0x1c, 0x1c, 0x1b, 0x1c, 0x1, 0x16, 0x19, 0x13, 0x1c, 0x1b,
        0x1c, 0x19, 0xa, 0xa, 0x1b, 0x1, 0x1c, 0x18, 0x1b, 0xa, 0x1, 0x17, 0xa, 0xa, 0xa, 0x18,
        0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
        0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x19, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x1,
        0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1,
        0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x19, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1
    ];

    function isLatin1(cc) {
        return cc <= 0x00ff;
    }

    function isAscii(cc) {
        return cc <= 0x007f;
    }

    function isDigit(c) {
        var cc = c.charCodeAt(0);
        return cc >= 48 && cc <= 57;
    }

    function isLetter(c) {
        var cc = c.charCodeAt(0);
        if (!isLatin1(cc)) {
            return true;
        }

        // fix bug 92964
        if (!isAscii(cc)) {
            return categoryForLatin1[cc] === LatinUnicodeCategory.UppercaseLetter || categoryForLatin1[cc] === LatinUnicodeCategory.LowercaseLetter;
        }
        cc |= 0x20; // make lowcase

        return (cc >= 96 && cc <= 122);
    }

    function isLetterOrDigit(c) {
        var cc = c.charCodeAt(0);
        if (!isLatin1(cc)) {
            return true;
        }

        // fix bug 92964
        if (!isAscii(cc)) {
            return categoryForLatin1[cc] === LatinUnicodeCategory.UppercaseLetter || categoryForLatin1[cc] === LatinUnicodeCategory.LowercaseLetter;
        }
        if (cc <= 57) {
            return cc >= 48;
        }
        cc |= 0x20; // make lowcase

        return (cc >= 96 && cc <= 122);
    }

    function isSymbol(c) {
        var cc = c.charCodeAt(0);
        if (!isLatin1(cc)) {
            return false;
        }
        return categoryForLatin1[cc] === LatinUnicodeCategory.MathSymbol || categoryForLatin1[cc] === LatinUnicodeCategory.currencySymbol || categoryForLatin1[cc] === LatinUnicodeCategory.ModifierSymbol || categoryForLatin1[cc] === LatinUnicodeCategory.OtherSymbol;
    }

    function isNumber(c) {
        var cc = c.charCodeAt(0);


        // fix bug 92964
        if (!isAscii(cc)) {
            return categoryForLatin1[cc] === LatinUnicodeCategory.DecimalDigitNumber || categoryForLatin1[cc] === LatinUnicodeCategory.OtherNumber;
        }

        // 0-9
        return cc >= 48 && cc <= 57;
    }

    ///////////////////////////////////////////////////////
    // Name validation
    ///////////////////////////////////////////////////////
    function isValidateName(name) {
        if (name === keyword_undefined || name === keyword_null || name === '') {
            return false;
        }
        var nameLength = name.length;
        if (nameLength === 1 && (name === 'R' || name === 'r' || name === 'C' || name === 'c')) { //NOSONAR complexExpression
            return false;
        }
        var currentChar = name.charAt(0);
        if (!(currentChar === '_' || currentChar === '\\' || isLetter(currentChar) || isSymbol(currentChar))) {
            return false;
        }
        for (var i = 1; i < nameLength; i++) {
            currentChar = name.charAt(i);
            if (!(currentChar === '_' || currentChar === '\\' || currentChar === '?' || currentChar === '.' || isLetterOrDigit(currentChar) || isSymbol(currentChar))) { //NOSONAR complexExpression
                return false;
            }
        }
        return true;
    }

    util.isValidateName = isValidateName;

    var operatorInfix = '\\+-*/^&=><: ' + ',';

    function isValidateSheetName(name, isR1C1, containsSpecial) {
        if (name === keyword_undefined || name === keyword_null || name === '') {
            return true;
        }
        if (!containsSpecial && isDigit(name.charAt(0))) {
            return false;
        }
        var isStartWithCellRef = isStartWithCellReference(name, isR1C1);
        if (!containsSpecial && isStartWithCellRef.success && isStartWithCellRef.endIndex === name.length) {
            return false;
        }
        var currentChar;
        for (var i = 0; i < name.length; i++) {
            currentChar = name.charAt(i);
            if (containsSpecial) {
                if (currentChar === '*' || currentChar === ':' || currentChar === '[' || currentChar === ']' || currentChar === '?' || currentChar === '\\' || currentChar === '/') { //NOSONAR complexExpression
                    return false;
                }
            } else if (currentChar === "'" || currentChar === '[' || currentChar === ']' || currentChar === '?' || currentChar === '\\' || currentChar === '%' || currentChar === '"' || operatorInfix.indexOf(currentChar) !== -1) { //NOSONAR complexExpression
                return false;
            }
        }
        return true;
    }

    util.isValidateSheetName = isValidateSheetName;

    function isStartWithCellReference(value, isR1C1) {
        return isR1C1 ? isR1C1CellReferance(value) : isA1CellReferance(value);
    }

    var BAND_INDEX_CONST = -2147483648;
    var maxColumnCount = 16384;
    var maxRowCount = 1048576;
    var LetterPows = [1, 26, 676];

    function isA1CellReferance(value) {
        var bandIndex = BAND_INDEX_CONST;
        var result = {
            startRow: bandIndex,
            startColumn: bandIndex,
            endRow: bandIndex,
            endColumn: bandIndex,
            startRowRelative: true,
            startColumnRelative: true,
            endRowRelative: true,
            endColumnRelative: true,
            success: false,
            endIndex: 0
        };
        value = value.replace(' ', '');
        var length = value.length;
        var read = readOneA1Element(value, 0);
        result.endIndex = read.endIndex;
        if (!read.success || result.endIndex > length) {
            return result;
        }
        var read2;
        if (read.isRow) {
            result.startRow = read.elementIndex;
            result.startRowRelative = read.isRelative;

            // row":"row
            if (value.charAt(result.endIndex) === ':') {
                result.endIndex++;

                // read the second element.
                read2 = readOneA1Element(value, result.endIndex);
                result.endIndex = read2.endIndex;
                if (!read2.success || !read2.isRow) {
                    return result;
                }
                result.endRow = read2.elementIndex;
                result.endRowRelative = read2.isRelative;
                result.success = true;
                return result;
            } else {
                return result;
            }
        } else {
            result.startColumn = read.elementIndex;
            result.startColumnRelative = read.isRelative;

            // row":"row
            if (value.charAt(result.endIndex) === ':') {
                result.endIndex++;

                // read the second element.
                read2 = readOneA1Element(value, result.endIndex);
                result.endIndex = read2.endIndex;
                if (!read2.success || read2.isRow) {
                    return result;
                }
                result.endColumn = read2.elementIndex;
                result.endColumnRelative = read2.isRelative;
                result.success = true;
                return result;
            }
        }

        // cell|area
        if (isNumber(value.charAt(result.endIndex)) || value.charAt(result.endIndex) === '$') {
            // read the second element.
            read2 = readOneA1Element(value, result.endIndex);
            result.endIndex = read2.endIndex;
            if (!read2.success || !read2.isRow) {
                return result;
            }
            result.startRow = read2.elementIndex;
            result.startRowRelative = read2.isRelative;
            var cellEndIndex = result.endIndex;
            if (result.endIndex < length - 1 && value.charAt(result.endIndex) === ':') {
                // A1:'A2'!A3
                if (value.charAt(result.endIndex + 1) === "'") {
                    result.success = true;
                    return result;
                }
                var nextSheetIndex = value.indexOf('!', result.endIndex + 1);
                var nextRangeIndex = value.indexOf(':', result.endIndex + 1);

                // Sheet1!A2:Sheet2!A3
                // Sheet1!A2:Sheet2!A3 : B4
                if (nextSheetIndex !== -1 && (nextRangeIndex === -1 || nextRangeIndex > nextSheetIndex)) {
                    result.success = true;
                    return result;
                }
                result.endIndex++;

                // read the thirdly element
                var read3 = readOneA1Element(value, result.endIndex);
                if (!read3.success || read3.isRow) {
                    result.endIndex = cellEndIndex;
                    result.success = true;
                    return result;
                } else {
                    result.endIndex = read3.endIndex;
                }
                result.endColumn = read3.elementIndex;
                result.endColumnRelative = read3.isRelative;

                // read the fourthly element
                var read4 = readOneA1Element(value, result.endIndex);
                if (!read4.success || !read4.isRow) {
                    result.endIndex = cellEndIndex;
                    result.endColumn = bandIndex;
                    result.success = true;
                    return result;
                } else {
                    result.endIndex = read4.endIndex;
                }
                result.endRow = read4.elementIndex;
                result.endRowRelative = read4.isRelative;
                result.success = true;
                return result;
            } else {
                result.success = true;
                return result;
            }
        } else {
            return result;
        }
    }

    function isR1C1CellReferance(value, baseRow, baseColumn) {
        var bandIndex = BAND_INDEX_CONST;
        var result = {
            startRow: bandIndex,
            startColumn: bandIndex,
            endRow: bandIndex,
            endColumn: bandIndex,
            startRowRelative: true,
            startColumnRelative: true,
            endRowRelative: true,
            endColumnRelative: true,
            success: false,
            endIndex: 0
        };
        value = value.replace(' ', '');
        var length = value.length;
        var read = readOneR1C1Element(value, baseRow, baseColumn, 0);
        result.endIndex = read.endIndex;
        if (!read.success) {
            return result;
        }
        var read2;
        if (read.isRow) {
            result.startRow = read.elementIndex;
            result.startRowRelative = read.isRelative;

            // row only
            if (result.endIndex >= length) {
                result.success = true;
                return result;
            }

            //row":"row
            if (value.charAt(result.endIndex) === ':') {
                result.endIndex++;

                // read the second element.
                read2 = readOneR1C1Element(value, baseRow, baseColumn, result.endIndex);
                result.endIndex = read2.endIndex;
                if (!read2.success || !read2.isRow) {
                    return result;
                }
                result.endRow = read2.elementIndex;
                result.endRowRelative = read2.isRelative;
                result.success = true;
                return result;
            }
        } else {
            result.startColumn = read.elementIndex;
            result.startColumnRelative = read.isRelative;

            // column only
            if (result.endIndex >= length) {
                result.success = true;
                return result;
            }

            // column":"column
            if (value.charAt(result.endIndex) === ':') {
                result.endIndex++;

                // read the second element.
                read2 = readOneR1C1Element(value, baseRow, baseColumn, result.endIndex);
                result.endIndex = read2.endIndex;
                if (!read2.success || read2.isRow) {
                    return result;
                }
                result.endColumn = read2.elementIndex;
                result.endColumnRelative = read2.isRelative;
                result.success = true;
                return result;
            } else {
                return result;
            }
        }

        // cell|area
        if (value.charAt(result.endIndex) === 'C' || value.charAt(result.endIndex) === 'c') {
            // read the second element.
            read2 = readOneR1C1Element(value, baseRow, baseColumn, result.endIndex);
            result.endIndex = read2.endIndex;
            if (!read2.success || read2.isRow) {
                return result;
            }
            result.startColumn = read2.elementIndex;
            result.startColumnRelative = read2.isRelative;
            var cellEndIndex = result.endIndex;
            if (result.endIndex < length - 1 && value.charAt(result.endIndex) === ':') {
                // R1C1:'R1C2'!R1C3
                if (value.charAt(result.endIndex + 1) === "'") {
                    result.success = true;
                    return result;
                }
                var nextSheetIndex = value.indexOf('!', result.endIndex + 1);
                var nextRangeIndex = value.indexOf(':', result.endIndex + 1);

                // Sheet1!R1C1:Sheet2!R1C2
                // Sheet1!R1C1:Sheet2!R1C2:R2C3
                if (nextSheetIndex !== -1 && (nextRangeIndex === -1 || nextRangeIndex > nextSheetIndex)) {
                    result.success = true;
                    return result;
                }
                result.endIndex++;

                // read the thirdly element
                var read3 = readOneR1C1Element(value, baseRow, baseColumn, result.endIndex);
                if (!read3.success || !read3.isRow) {
                    result.endIndex = cellEndIndex;
                    result.success = true;
                    return result;
                } else {
                    result.endIndex = read3.endIndex;
                }
                result.endRow = read3.elementIndex;
                result.endRowRelative = read3.isRelative;

                // read the fourthly element
                var read4 = readOneR1C1Element(value, baseRow, baseColumn, result.endIndex);
                if (!read4.success || read4.isRow) {
                    result.endIndex = cellEndIndex;
                    result.success = true;
                    return result;
                } else {
                    result.endIndex = read4.endIndex;
                }
                result.endColumn = read4.elementIndex;
                result.endColumnRelative = read4.isRelative;
                result.success = true;
                return result;
            } else {
                result.success = true;
                return result;
            }
        } else {
            return result;
        }
    }

    function readOneA1Element(value, startIndex) {
        var bandIndex = BAND_INDEX_CONST;
        var result = {
            endIndex: startIndex,
            elementIndex: bandIndex,
            isRow: true,
            isRelative: true,
            success: false
        };
        var length = value.length;
        if (startIndex >= length) {
            return result;
        }
        if (value.charAt(startIndex) === '$') {
            result.isRelative = false;
            startIndex++;
        }
        if (startIndex >= length) {
            return result;
        }
        var index = startIndex, intValue;
        var currentChar = value.charAt(index);
        if (isNumber(currentChar) && currentChar !== '0') {
            result.isRow = true;
            while (index < length && isNumber(currentChar)) {
                index++;
                if (index < length) {
                    currentChar = value.charAt(index);
                }
            }
            intValue = parseInt(value.substr(startIndex, index - startIndex), 10);
            if (intValue >= 1 && intValue <= maxRowCount) {
                result.elementIndex = intValue - 1;
                result.endIndex = index;
                result.success = true;
                return result;
            }
        } else if (isLetter(currentChar)) {
            result.isRow = false;
            while (index < length && isLetter(currentChar)) {
                index++;
                if (index < length) {
                    currentChar = value.charAt(index);
                }
            }
            var s = value.substr(startIndex, index - startIndex);
            if (s.length > 3) {
                return result;
            }
            s = s.toUpperCase();
            intValue = 0;
            for (var i = s.length - 1; i >= 0; i--) {
                intValue += (s.charCodeAt(i) - 65 + 1) * LetterPows[s.length - i - 1];
            }
            if (intValue <= maxColumnCount) {
                result.elementIndex = intValue - 1;
                result.endIndex = index;
                result.success = true;
                return result;
            }
        }
        return result;
    }

    function readOneR1C1Element(value, baseRow, baseColumn, startIndex) {
        var bandIndex = BAND_INDEX_CONST;
        var result = {
            endIndex: startIndex,
            elementIndex: bandIndex,
            isRow: true,
            isRelative: false,
            success: false
        };
        var length = value.length;
        if (startIndex >= length) {
            return result;
        }
        var index = startIndex;
        var currentChar = value.charAt(index);
        var baseIndex;
        if (currentChar === 'R' || currentChar === 'r') {
            result.isRow = true;
            baseIndex = baseRow;
        } else if (currentChar === 'C' || currentChar === 'c') {
            result.isRow = false;
            baseIndex = baseColumn;
        } else {
            return result;
        }
        startIndex++;
        index++;
        if (startIndex >= length) {
            result.endIndex = startIndex;
            result.elementIndex = baseIndex;
            result.isRelative = true;
            result.success = true;
            return result;
        }
        currentChar = value.charAt(index);
        if (currentChar === '[') {
            startIndex++;
            index++;
            result.isRelative = true;
        }
        if (startIndex >= length) {
            return result;
        }
        var isNegative = false;
        currentChar = value.charAt(index);
        if (result.isRelative && currentChar === '-') {
            startIndex++;
            index++;
            isNegative = true;
        }
        if (startIndex >= length) {
            return result;
        }
        currentChar = value.charAt(index);

        // row or column with number
        if (isNumber(currentChar)) {
            while (index < length && isNumber(currentChar)) {
                index++;
                if (index < length) {
                    currentChar = value.charAt(index);
                }
            }
            var intValue = parseInt(value.substr(startIndex, index - startIndex), 10);
            if (result.isRelative) {
                if (index >= length || value.charAt(index) !== ']') {
                    return result;
                }
                index++;
            }
            if (intValue < (result.isRow ? maxRowCount : maxColumnCount)) {
                if (result.isRelative) {
                    intValue = isNegative ? -intValue : intValue;
                    result.elementIndex = intValue + baseIndex;
                } else {
                    result.elementIndex = intValue - 1;
                }
                result.endIndex = index;
                result.success = true;
                return result;
            }
        } else if (result.isRelative) {
            return result;
        } else {
            result.endIndex = startIndex;
            result.elementIndex = baseIndex;
            result.isRelative = true;
            result.success = true;
            return result;
        }
    }

    ///////////////////////////////////////////////////////
    // Create Expression helper
    ///////////////////////////////////////////////////////
    function createStatisticalExpression(name, parameters) {
        var func = GC.Spread.CalcEngine.Functions.findGlobalFunction(name);
        if (func) {
            var args = [];
            var length = parameters.length;
            for (var i = 0; i < length; i++) {
                var obj = parameters[i];

                if (obj instanceof GC.Spread.Sheets.Range) {
                    args[i] = createRangeExpression(obj.row, obj.col, obj.row + obj.rowCount - 1, obj.col + obj.colCount - 1);
                } else {
                    return keyword_null;
                }
            }
            return createFunctionExpression(func, args);
        }
        return keyword_null;
    }

    function createFunctionExpression(func, args) {
        var expr = new GC.Spread.CalcEngine.Expression(7 /* Function */);
        expr.function = func;
        expr.arguments = args;
        expr.functionName = func.name;
        return expr;
    }

    function createRangeExpression(row, col, endRow, endCol, rowRelative, columnRelative, endRowRelative, endColumnRelative) {
        var expr = new GC.Spread.CalcEngine.Expression(1 /* Reference */), tmp;
        expr.isFullRow = col === BAND_INDEX_CONST;
        expr.isFullColumn = row === BAND_INDEX_CONST;
        if (row > endRow) {
            tmp = row;
            row = endRow;
            endRow = tmp;
            tmp = rowRelative;
            rowRelative = endRowRelative;
            endRowRelative = tmp;
        }
        if (col > endCol) {
            tmp = col;
            col = endCol;
            endCol = tmp;
            tmp = columnRelative;
            columnRelative = endColumnRelative;
            endColumnRelative = tmp;
        }
        expr.row = row;
        expr.column = col;
        expr.endRow = endRow;
        expr.endColumn = endCol;
        expr.rowRelative = rowRelative;
        expr.columnRelative = columnRelative;
        expr.endRowRelative = endRowRelative;
        expr.endColumnRelative = endColumnRelative;

        return expr;
    }


    util.createStatisticalExpression = createStatisticalExpression;

    ///////////////////////////////////////////////////////
    // Event trigger
    ///////////////////////////////////////////////////////
    function triggerSheetEvent(sheet, eventName, data) {
        if (sheet) {
            designer.wrapper.spreadElement.trigger(eventName, data);
        }
    }

    util.triggerSheetEvent = triggerSheetEvent;

    function triggerDesignerEvent(name, data) {
        $(designer).trigger(name, data);
    }

    util.triggerDesignerEvent = triggerDesignerEvent;

    function bindDesignerEvent(name, callback) {
        $(designer).bind(name, callback);
    }

    util.bindDesignerEvent = bindDesignerEvent;

    ///////////////////////////////////////////////////////
    // Async loading
    ///////////////////////////////////////////////////////
    function loadHtml(url, selector, target) {
        var deferred = $.Deferred();
        $.get(url).done(function (data) {
            target.empty();
            target.append($("<div></div>").append($.parseHTML(data)).find(selector));
            deferred.resolve(target);
        }).fail(function (x, textStatus) {
            target.empty();
            target.append($("<div></div>").addClass('error').text('Loading failed with error: ' + textStatus));
            deferred.reject([x, textStatus]);
        });
        return deferred;
    }

    util.loadHtml = loadHtml;

    function loadScript(url) {
        var deferred = $.Deferred();

        if ($('script[src="' + url + '"]').length !== 0) {
            deferred.resolve();
            return;
        }

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.async = true;

        function onScriptLoad() {
            deferred.resolve();
        }

        function onScriptError() {
            deferred.reject();
        }

        //Set up load listener. Test attachEvent first because IE9 has
        //a subtle issue in its addEventListener and script onload firings
        //that do not match the behavior of all other browsers with
        //addEventListener support, which fire the onload event for a
        //script right after the script execution. See:
        //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
        //UNFORTUNATELY Opera implements attachEvent but does not follow the script
        //script execution mode.
        if (script.attachEvent && !(script.attachEvent.toString && script.attachEvent.toString().indexOf('[native code') < 0) && !(typeof opera !== 'undefined' && opera.toString() === '[object Opera]')) { //NOSONAR complexExpression
            script.attachEvent('onreadystatechange', onScriptLoad);
            //It would be great to add an error handler here to catch
            //404s in IE9+. However, onreadystatechange will fire before
            //the error handler, so that does not help. If addEventListener
            //is used, then IE will fire error before load, but we cannot
            //use that pathway given the connect.microsoft.com issue
            //mentioned above about not doing the 'script execute,
            //then fire the script load event listener before execute
            //next script' that other browsers do.
            //Best hope: IE10 fixes the issues,
            //and then destroys all installs of IE 6-9.
            //node.attachEvent('onerror', context.onScriptError);
        } else {
            script.addEventListener('load', onScriptLoad, false);
            script.addEventListener('error', onScriptError, false);
        }
        script.src = url;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(script);

        return deferred;
    }

    util.loadScript = loadScript;

    function loadCss(url) {
        var deferred = $.Deferred();

        if ($('link[href="' + url + '"]').length === 0) {
            var link = $('<link>');
            link.attr('href', url);
            link.attr('type', 'text/css');
            link.attr('rel', 'stylesheet');
            $('head').append(link);
        }

        // For now, we have no solution to get notify when css loading completed.
        deferred.resolve();

        return deferred;
    }

    util.loadCss = loadCss;

    util.resolveHtmlPath = function (directory, filename) {
        if (location.pathname.indexOf('/content/') >= 0) {
            return filename;
        } else {
            return directory + "/" + filename;
        }
    };

    ////////////////////////////////////////////////////////
    // Font parse
    ////////////////////////////////////////////////////////
    function parseFont(font) {
        var fontFamily = null, fontSize = null, fontStyle = "normal", fontWeight = "normal", fontVariant = "normal", lineHeight = "normal";

        var elements = font.split(/\s+/);
        var element;
        while (element = elements.shift()) {
            switch (element) {
                case "normal":
                    break;

                case "italic":
                case "oblique":
                    fontStyle = element;
                    break;

                case "small-caps":
                    fontVariant = element;
                    break;

                case "bold":
                case "bolder":
                case "lighter":
                case "100":
                case "200":
                case "300":
                case "400":
                case "500":
                case "600":
                case "700":
                case "800":
                case "900":
                    fontWeight = element;
                    break;

                default:
                    if (!fontSize) {
                        var parts = element.split("/");
                        fontSize = parts[0];
                        if (fontSize.indexOf("px") !== -1) {
                            fontSize = px2pt(parseFloat(fontSize)) + 'pt';
                        }
                        if (parts.length > 1) {
                            lineHeight = parts[1];
                            if (lineHeight.indexOf("px") !== -1) {
                                lineHeight = px2pt(parseFloat(lineHeight)) + 'pt';
                            }
                        }
                        break;
                    }

                    fontFamily = element;
                    if (elements.length) {
                        fontFamily += " " + elements.join(" ");
                    }

                    return {
                        "fontStyle": fontStyle,
                        "fontVariant": fontVariant,
                        "fontWeight": fontWeight,
                        "fontSize": fontSize,
                        "lineHeight": lineHeight,
                        "fontFamily": fontFamily
                    };
            }
        }

        return {
            "fontStyle": fontStyle,
            "fontVariant": fontVariant,
            "fontWeight": fontWeight,
            "fontSize": fontSize,
            "lineHeight": lineHeight,
            "fontFamily": fontFamily
        };
    }

    util.parseFont = parseFont;

    ////////////////////////////////////////////////////////
    // parse padding
    ////////////////////////////////////////////////////////
    function parsePadding(padding) {
        var retArray = [0, 0, 0, 0];
        if (!padding || (typeof padding !== 'string')) {
            return retArray;
        }
        var offsetArray = padding.split(' ', 4), length = offsetArray.length,
            topOffset, rightOffset;
        if (length === 1) {
            topOffset = offsetArray[0];
            retArray = [topOffset, topOffset, topOffset, topOffset];
        } else if (length === 2) {
            topOffset = offsetArray[0];
            rightOffset = offsetArray[1];
            retArray = [topOffset, rightOffset, topOffset, rightOffset];
        } else if (length === 3) {
            rightOffset = offsetArray[1];
            retArray = [offsetArray[0], rightOffset, offsetArray[2], rightOffset];
        } else if (length === 4) {
            retArray = [offsetArray[0], offsetArray[1], offsetArray[2], offsetArray[3]];
        }
        return retArray;
    }

    util.parsePadding = parsePadding;

    var tempSpan = $("<span></span>");

    function px2pt(pxValue) {
        tempSpan.css({
            "font-size": "96pt",
            "display": "none"
        });
        tempSpan.appendTo($(document.body));
        var tempPx = tempSpan.css("font-size");
        if (tempPx.indexOf("px") !== -1) {
            var tempPxValue = parseFloat(tempPx);
            return Math.round(pxValue * 96 / tempPxValue);
        } else {
            return Math.round(pxValue * 72 / 96);
        }
    }

    util.px2pt = px2pt;

    function getThemeFont(themeFont) {
        var theme = designer.wrapper.spread.getActiveSheet().currentTheme();
        if (theme && themeFont) {
            if (themeFont === "Body") {
                return theme.bodyFont();
            } else if (themeFont === "Headings") {
                return theme.headerFont();
            }
        }
        return null;
    }

    util.getThemeFont = getThemeFont;

    ////////////////////////////////////////////////////////
    // Text Decoration parse
    ////////////////////////////////////////////////////////
    function toCSSTextDecoration(decoration) {
        var result = "";
        if (decoration === 0) {
            return;
        }
        if (decoration & 1 /* Underline */) {
            result += "underline ";
        }
        if (decoration & 2 /* LineThrough */) {
            result += "line-through ";
        }
        if (decoration & 4 /* Overline */) {
            result += "overline ";
        }
        return result;
    }

    util.toCSSTextDecoration = toCSSTextDecoration;

    ////////////////////////////////////////////////////////
    // Formula Sparkline helper
    ////////////////////////////////////////////////////////
    function parseFormulaSparkline(row, col) {
        var sheet = designer.wrapper.spread.getActiveSheet();
        if (!sheet) {
            return null;
        }
        var formula = sheet.getFormula(row, col);
        if (!formula) {
            return null;
        }
        var calcService = sheet.getCalcService();
        try {
            var expr = calcService.parse(null, formula, row, col);
            if (expr.type === GC.Spread.CalcEngine.ExpressionType.function) {
                var fnName = expr.functionName;
                if (fnName && designer.wrapper.spread.getSparklineEx(fnName)) {
                    return expr;
                }
            }
        } catch (ex) {
        }
        return null;
    }

    util.parseFormulaSparkline = parseFormulaSparkline;

    function unParseFormula(expr, row, col) {
        var sheet = designer.wrapper.spread.getActiveSheet();
        if (!sheet) {
            return null;
        }
        var calcService = sheet.getCalcService();
        return calcService.unparse(null, expr, row, col);
    }

    util.unParseFormula = unParseFormula;

    ////////////////////////////////////////////////////////
    // Json Schema Parser
    ////////////////////////////////////////////////////////
    util.DataFieldType = {
        checkbox: "checkbox",
        hyperlink: "hyperlink",
        combox: "combox",
        button: "button",
        text: "text",
        table: "table"
    };
    util.BasicDataType = {
        Array: "array",
        Boolean: "boolean",
        Integer: "integer",
        Number: "number",
        Null: "null",
        Object: "object",
        String: "string"
    };

    //This dictionary shows the relationship between JSON Schema Type and CellType. The First item is the default type.
    util.DefaultTypeDic = {
        "array": util.DataFieldType.table,
        "boolean": util.DataFieldType.checkbox,
        "integer": util.DataFieldType.text,
        "number": util.DataFieldType.text,
        "null": util.DataFieldType.text,
        "object": util.DataFieldType.text,
        "string": util.DataFieldType.text
    };
    util.DefaultDataFieldTypeDic = {
        "checkbox": util.BasicDataType.Boolean,
        "hyperlink": util.BasicDataType.String,
        "combox": util.BasicDataType.String,
        "button": util.BasicDataType.String,
        "text": util.BasicDataType.String,
        "table": util.BasicDataType.Array
    };
    function parseJsonSchema(schema) {
        if (!schema["$schema"]) {
            return null;
        }
        var result = [];
        var cloneSchema = $.extend({}, schema);
        var originalDef = cloneSchema.definitions;

        // solve reference in definitions first
        _resolveRef(originalDef, schema, true);

        // solve general reference
        _resolveRef(cloneSchema, schema, false);

        // get tree node obj
        _convertSchemaToTreeObj(cloneSchema, result);
        return result;
    }

    util.parseJsonSchema = parseJsonSchema;
    var refs = [];

    function _resolveRef(schema, originalSchema, isDefinitions) {
        if (!schema) {
            return;
        }
        var ref = schema["$ref"];
        if (ref && typeof ref === "string") {
            var target, arr, length;
            if (ref.indexOf("#") === 0) {
                arr = ref.split("/");
                length = arr.length;
                var cache = $.extend({}, originalSchema);
                for (var index = 1; index < length; index++) {
                    //"definitions" may exist anywhere
                    if (!cache) {
                        break;
                    }
                    cache = cache[arr[index]];
                }
                if (cache) {
                    target = cache;
                }
            }
            if (target) {
                if (refs.join("/").indexOf(ref) !== -1) {
                    return;
                }
                delete schema["$ref"];
                $.extend(schema, target);
            }
        }
        if (schema["properties"]) {
            refs.push("properties");
            _resolveRef(schema["properties"], originalSchema);
        } else {
            for (var i in schema) {
                if (i === "patternProperties" || i === "allOf" || i === "anyOf" || i === "oneOf" || i === "not") { //NOSONAR complexExpression
                    continue;
                }
                if (schema.hasOwnProperty(i) && typeof schema[i] === "object") {
                    if (isDefinitions) {
                        refs = ["#", "definitions"];
                    }
                    if (refs.indexOf(i) !== -1) {
                        var tempIndex = "#/definitions/" + i;
                        if (refs.join("/").indexOf(tempIndex) !== -1) {
                            return;
                        }
                    }
                    refs.push(i);
                    _resolveRef(schema[i], originalSchema);
                }
            }
        }
    }

    function _convertSchemaToTreeObj(schema, result) {
        if (!schema) {
            return;
        }
        if (!schema.properties && !schema.items && !schema.definitions) {
            //an object or an array
            return;
        }
        var collections = {};
        if (schema.items) {
            collections["items"] = schema.items;
        }
        if (schema.properties) {
            collections["properties"] = schema.properties;
        }
        if (schema.definitions) {
            collections["definitions"] = schema.definitions;
        }
        for (var c in collections) {
            if (collections.hasOwnProperty(c)) {
                var content = collections[c];
                for (var item in content) {
                    if (content.hasOwnProperty(item)) {
                        var child = {};
                        child["name"] = item;
                        if (typeof content[item] === "object") {
                            if (content[item].type) {
                                child["type"] = content[item].type;
                            }
                            if (content[item].dataFieldType) {
                                child["dataFieldType"] = content[item].dataFieldType;
                            }
                            if (content[item]["enum"]) {
                                var enums = content[item]["enum"];
                                child["enum"] = enums;
                                child["children"] = [];
                                var enumLength = enums.length;
                                for (var i = 0; i < enumLength; i++) {
                                    child["children"].push({ "name": enums[i] });
                                }
                            }
                            if (content[item].properties) {
                                child["children"] = [];
                                _convertSchemaToTreeObj(content[item], child["children"]);
                            }
                            if (content[item].items) {
                                child["children"] = [];
                                _convertSchemaToTreeObj(content[item].items, child["children"]);
                            }
                        }
                        result.push(child);
                    }
                }
            }
        }
    }

    function saveJSONSchema(data) {
        //Convert tree data model to JSON Schema model.
        if (data.constructor !== Array.prototype.constructor) {
            return;
        }
        var schema = {};

        //schema header
        schema["$schema"] = "http://json-schema.org/draft-04/schema#";
        schema["properties"] = {};
        schema["type"] = util.BasicDataType.Object;
        _saveJSONSchemaCore(data, schema["properties"]);
        return schema;
    }

    util.saveJSONSchema = saveJSONSchema;
    function _saveJSONSchemaCore(source, dest) {
        var length = source.length;
        if (!length) {
            return;
        }
        for (var i = 0; i < length; i++) {
            var sour = source[i];
            var name = sour.name;

            var type = sour.type;
            var dataFieldType = sour.dataFieldType;
            var children = sour.children;
            var enumArr = sour["enum"];
            if (!name) {
                continue;
            }
            if (!dest[name]) {
                dest[name] = {};
            }
            if (dataFieldType) {
                dest[name]["dataFieldType"] = dataFieldType;
                if (!type) {
                    type = util.DefaultDataFieldTypeDic[dataFieldType];
                }
            }
            if (type) {
                dest[name]["type"] = type;
            } else {
                dest[name]["type"] = util.BasicDataType.String;
            }
            if (enumArr) {
                dest[name]["enum"] = enumArr;
            }
            if (children && !enumArr) {
                if (!type) {
                    dest[name]["type"] = util.BasicDataType.Object;
                }
                if (type === util.BasicDataType.Array) {
                    if (!dest[name]["items"]) {
                        dest[name]["items"] = {};
                    }
                    dest[name]["items"]["type"] = util.BasicDataType.Object;
                    if (!dest[name]["items"]["properties"]) {
                        dest[name]["items"]["properties"] = {};
                    }
                    _saveJSONSchemaCore(children, dest[name]["items"]["properties"]);
                } else {
                    if (!dest[name]["properties"]) {
                        dest[name]["properties"] = {};
                    }
                    _saveJSONSchemaCore(children, dest[name]["properties"]);
                }
            }
        }
    }

    function setStyleToInsertRowsInSpan(sheet, spans, insertRow, count, sheetArea) {
        for (var i = 0, len = spans.length; i < len; i++) {
            var span = spans[i];
            if (insertRow > span.row && insertRow < span.row + span.rowCount) {
                var firstCellStyle = sheet.getStyle(span.row, span.col, sheetArea);
                if (firstCellStyle) {
                    for (var row = insertRow; row < insertRow + count; row++) {
                        for (var col = span.col; col < span.col + span.colCount; col++) {
                            sheet.setStyle(row, col, firstCellStyle, sheetArea);
                        }
                    }
                }
            }
        }
    }

    function setStyleToInsertColumnsInSpan(sheet, spans, insertCol, count, sheetArea) {
        for (var i = 0, len = spans.length; i < len; i++) {
            var span = spans[i];
            if (insertCol > span.col && insertCol < span.col + span.colCount) {
                var firstCellStyle = sheet.getStyle(span.row, span.col, sheetArea);
                if (firstCellStyle) {
                    for (var col = insertCol; col < insertCol + count; col++) {
                        for (var row = span.row; row < span.row + span.rowCount; row++) {
                            sheet.setStyle(row, col, firstCellStyle, sheetArea);
                        }
                    }
                }
            }
        }
    }

    function setSpanStyleWhenInsertRowsColumns(sheet, insertRow, insertColumn, count) {
        if (!sheet) {
            return;
        }
        var viewportSpans = sheet.getSpans(undefined, 3 /* viewport */);
        if (insertRow >= 0) {
            setStyleToInsertRowsInSpan(sheet, viewportSpans, insertRow, count, 3 /* viewport */);
            setStyleToInsertRowsInSpan(sheet, sheet.getSpans(undefined, 2 /* rowHeader */), insertRow, count, 2 /* rowHeader */);
        } else if (insertColumn >= 0) {
            setStyleToInsertColumnsInSpan(sheet, viewportSpans, insertColumn, count, 3 /* viewport */);
            setStyleToInsertColumnsInSpan(sheet, sheet.getSpans(undefined, 1 /* colHeader */), insertColumn, count, 1 /* colHeader */);
        }
    }

    util.setSpanStyleWhenInsertRowsColumns = setSpanStyleWhenInsertRowsColumns;

    ////////////////////////////////////////////////////////
    // Format string to integer
    ////////////////////////////////////////////////////////
    function formatNumber(numberString) {
        if (!$.isNumeric(numberString)) {
            return 0;
        }
        var num = parseFloat(numberString);
        return Math.round(num);
    }

    util.formatNumber = formatNumber;

    ////////////////////////////////////////////////////////
    // Get selected slicers
    ////////////////////////////////////////////////////////
    function getSelectedSlicers(sheet) {
        if (!sheet) {
            return null;
        }
        var slicers = sheet.slicers.all();
        if (!slicers || $.isEmptyObject(slicers)) {
            return null;
        }
        var selectedSlicers = [];
        for (var item in slicers) {
            if (slicers[item].isSelected()) {
                selectedSlicers.push(slicers[item]);
            }
        }
        return selectedSlicers;
    }

    util.getSelectedSlicers = getSelectedSlicers;

    ////////////////////////////////////////////////////////
    // Get slicer item width from slicer width
    ////////////////////////////////////////////////////////
    function getSlicerItemWidth(count, slicerWidth) {
        if (count <= 0) {
            count = 1; //Column count will be converted to 1 if it is set to 0 or negative number.
        }
        var itemWidth = Math.round((slicerWidth - SLICER_PADDING * 2 - (count - 1) * SLICER_ITEM_SPACE) / count);
        if (itemWidth < 0) {
            return 0;
        } else {
            return itemWidth;
        }
    }

    util.getSlicerItemWidth = getSlicerItemWidth;

    ////////////////////////////////////////////////////////
    // Get slicer width from slicer item width
    ////////////////////////////////////////////////////////
    function getSlicerWidthFromItem(count, itemWidth) {
        if (count <= 0) {
            count = 1; //Column count will be converted to 1 if it is set to 0 or negative number.
        }
        return Math.round(itemWidth * count + (count - 1) * SLICER_ITEM_SPACE + SLICER_PADDING * 2);
    }

    util.getSlicerWidthFromItem = getSlicerWidthFromItem;

    ///////////////////////////////////////////////////////////////
    // To judge if any slicer is selected or not in current sheet
    ///////////////////////////////////////////////////////////////
    function isSlicerSelected(sheet) {
        if (!sheet) {
            return false;
        }
        var selectedSlicers = util.getSelectedSlicers(sheet);
        if (!selectedSlicers || selectedSlicers.length === 0) {
            return false;
        }
        return true;
    }

    util.isSlicerSelected = isSlicerSelected;

    function parseColorString(value) {
        return value.substr(4).split(',').map(function (v) {
            return parseInt(v);
        });
    }

    util.parseColorString = parseColorString;

    function getFromCache(property, callback) {
        var cache = designer._cache;
        if (!cache) {
            cache = designer._cache = {};
        }
        var value = cache[property];
        if (!value) {
            value = cache[property] = callback();
        }
        return value;
    }

    util.getFromCache = getFromCache;

    function getThemeColorTint(color) {
        return color.split(' ')[2] || 0;
    }

    function generateNewThemeColor(color, tint) {
        var colorItem = color.split(' ');
        colorItem[2] = tint;
        return colorItem.join(' ');
    }

    var chartHelper = {
        chartTypeDict: {
            "0": {
                chartType: "combo",
                chartGroup: "ComboGroup"
            },
            "1": {
                chartType: "xyScatter",
                chartGroup: "ScatterGroup"
            },
            "2": {
                chartType: "xyScatter",
                chartGroup: "ScatterGroup"
            },
            "3": {
                chartType: "doughnut",
                chartGroup: "PieGroup"
            },
            "8": {
                chartType: "area",
                chartGroup: "AreaGroup"
            },
            "9": {
                chartType: "line",
                chartGroup: "LineGroup"
            },
            "10": {
                chartType: "pie",
                chartGroup: "PieGroup"
            },
            "11": {
                chartType: "bubble",
                chartGroup: "ScatterGroup"
            },
            "12": {
                chartType: "columnClustered",
                chartGroup: "ColumnGroup"
            },
            "13": {
                chartType: "columnStacked",
                chartGroup: "ColumnGroup"
            },
            "14": {
                chartType: "columnStacked100",
                chartGroup: "ColumnGroup"
            },
            "18": {
                chartType: "barClustered",
                chartGroup: "BarGroup"
            },
            "19": {
                chartType: "barStacked",
                chartGroup: "BarGroup"
            },
            "20": {
                chartType: "barStacked100",
                chartGroup: "BarGroup"
            },
            "24": {
                chartType: "lineStacked",
                chartGroup: "LineGroup"
            },
            "25": {
                chartType: "lineStacked100",
                chartGroup: "LineGroup"
            },
            "26": {
                chartType: "lineMarkers",
                chartGroup: "LineGroup"
            },
            "27": {
                chartType: "lineMarkersStacked",
                chartGroup: "LineGroup"
            },
            "28": {
                chartType: "lineMarkersStacked100",
                chartGroup: "LineGroup"
            },
            "33": {
                chartType: "xyScatterSmooth",
                chartGroup: "ScatterGroup"
            },
            "34": {
                chartType: "xyScatterSmoothNoMarkers",
                chartGroup: "ScatterGroup"
            },
            "35": {
                chartType: "xyScatterLines",
                chartGroup: "ScatterGroup"
            },
            "36": {
                chartType: "xyScatterLinesNoMarkers",
                chartGroup: "ScatterGroup"
            },
            "37": {
                chartType: "areaStacked",
                chartGroup: "AreaGroup"
            },
            "38": {
                chartType: "areaStacked100",
                chartGroup: "AreaGroup"
            },
            "49": {
                chartType: "stockHLC",
                chartGroup: "StockGroup"
            },
            "50": {
                chartType: "stockOHLC",
                chartGroup: "StockGroup"
            },
            "51": {
                chartType: "stockVHLC",
                chartGroup: "StockGroup"
            },
            "52": {
                chartType: "stockVOHLC",
                chartGroup: "StockGroup"
            }
        },
        getChartGroupString: function (typeValue) {
            var chartTypeInfo = this.chartTypeDict[typeValue];
            if (chartTypeInfo && chartTypeInfo.chartGroup) {
                return chartTypeInfo.chartGroup;
            }
        },
        getChartTypeString: function (typeValue) {
            var chartTypeInfo = this.chartTypeDict[typeValue];
            if (chartTypeInfo && chartTypeInfo.chartType) {
                return chartTypeInfo.chartType;
            }
        },
        getGradientThemeColor: function (startColor, stopColor, count, index) {
            if (index === 0) {
                return startColor;
            }
            if (index === (count - 1)) {
                return stopColor;
            }
            var startValue = parseFloat(getThemeColorTint(startColor));
            var stopValue = parseFloat(getThemeColorTint(stopColor));
            var gap = (stopValue - startValue) / (count - 1);
            var colorTint = 0;
            if (index !== keyword_undefined) {
                colorTint = startValue + gap * index;
                return generateNewThemeColor(startColor, colorTint);
            }
            var colors = [];
            colors.push(startColor);
            for (index = 1; index < count - 1; index++) {
                colorTint = startValue + gap * index;
                colors.push(generateNewThemeColor(startColor, colorTint));
            }
            colors.push(stopColor);
            return colors;
        },
        getSelectedChart: function (sheet) {
            var chartCollection = sheet.charts;
            var allCharts = chartCollection.all();
            for (var i = 0; i < allCharts.length; i++) {
                var chart = allCharts[i];
                if (chart.isSelected()) {
                    return chart;
                }
            }
        },
        resetChartsFocus: function (sheet) {
            var charts = sheet.charts.all();
            if (charts && charts.length > 0) {
                for (var i = 0; i < charts.length; i++) {
                    charts[i].isSelected(false);
                }
            }
        },
        applyChartSeriesTheme: function (chart, options) {
            var self = this;
            var group = options.group || 'colorful';
            var index = options.index || 0;
            var chartColors = designer.chartTemplates.chartColors;
            var colors = chartColors[group].colors[index].items;
            var seriesCollection = chart.series();
            var allSeries = seriesCollection.get();
            var seriesItemCount = allSeries.length;
            for (var i = 0; i < seriesItemCount; i++) {
                var seriesItem = allSeries[i];
                var color;
                var ChartType = GC.Spread.Sheets.Charts.ChartType;
                if (chart.chartType() === ChartType.pie || chart.chartType() === ChartType.doughnut) {
                    var oldColors = chartHelper.getPieColorArray(seriesItem.backColor);
                    if (oldColors && oldColors.length > 0) {
                        var count = oldColors.length;
                        color = self.generateColor(colors, count).join(',');
                    }
                } else {
                    color = self.generateColor(colors, seriesItemCount, i);
                }
                if (!options.type) {
                    if (seriesItem.backColor) {
                        seriesItem.backColor = color;
                    }
                    if (seriesItem.border) {
                        seriesItem.border.color = color;
                    }
                } else if (options.type === 'backColor' && seriesItem.backColor) {
                    seriesItem.backColor = color;
                } else if (options.type === 'borderColor' && seriesItem.border) {
                    seriesItem.border.color = color;
                }
                seriesCollection.set(i, seriesItem);
            }
        },

        getPieColorArray: function (colorString) {
            return colorString.match(/transparent|rgba\(\d+, *\d+, *\d+, *\d+\.?\d?\)|\w+ \d ?-?\d*/g);
        },

        generateColor: function (colors, colorCount, index) {
            var self = this;
            if (colors instanceof Array) {
                var totalColor = colors.length;
                if (index !== keyword_undefined) {
                    return colors[index % totalColor];
                }
                var returnColors = [];
                for (var i = 0; i < colorCount; i++) {
                    returnColors.push(colors[i % totalColor]);
                }
                return returnColors;
            } else if (colors instanceof Object) {
                return self.getGradientThemeColor(colors.startColor, colors.stopColor, colorCount, index);
            }
        },
        getChartSeriesNames: function (chart) {
            var nameArray = [];
            var seriesArray = chart.series().get();
            for (var i = 0; i < seriesArray.length; i++) {
                var series = seriesArray[i];
                var sheet = chartHelper.getDataSourceSheetBySeries(series);
                if (series.name) {
                    var name = '';
                    if (series.name.substr(0, 1) === '"' && series.name.substr((series.name.length - 1), 1) === '"') {
                        name = series.name;
                    } else {
                        var range = formulaToRange(sheet, series.name);
                        var cell = sheet.getCell(range.row, range.col);
                        name = cell.value();
                    }
                    nameArray.push(name);
                }
            }
            return nameArray;
        },
        getDataSourceSheetBySeries: function (series) {
            var formula;
            if (series.name && series.name.substr(0, 1) !== '"' || series.name.substr((series.name.length - 1), 1) !== '"') {
                formula = series.name;
            } else if (series.yValues) {
                formula = series.yValues;
            } else if (series.xValues) {
                formula = series.xValues;
            }
            return chartHelper.getSheetFromFormula(formula);
        },

        getSheetFromFormula: function (formula) {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var workBook = designer.wrapper.spread;
            var exp = {}, sheet;
            if (formula && formula !== '=') {
                exp = GC.Spread.Sheets.CalcEngine.formulaToExpression(activeSheet, formula);
            }
            if (exp && exp.source) {
                var sheetName = exp.source.getName();
                sheet = workBook.getSheetFromName(sheetName);
            } else {
                sheet = activeSheet;
            }
            return sheet;
        },
        judegeSeriesNameIsFormula: function (seriesName) {
            return seriesName.substr(0, 1) !== '"' || seriesName.substr((seriesName.length - 1), 1) !== '"';
        },
        rangeToFormuls: function (range, sheet) {
            var formula = GC.Spread.Sheets.CalcEngine.rangeToFormula(range);
            if (sheet) {
                //get sheet name
                var sheetName = sheet.name();
                var useR1C1 = designer.wrapper.spread.options.referenceStyle;
                if (!designer.util.isValidateSheetName(sheetName, useR1C1, false) && designer.util.isValidateSheetName(sheetName, useR1C1, true)) {
                    sheetName = "'" + sheetName + "'";
                }
                //add sheet name to formula
                formula = sheetName + '!' + formula;
            }
            return formula;
        },

        getActualChartStyle: function (defaultStyle, chartStyle, colorAndStyle) {
            var styles = JSON.parse(JSON.stringify(chartStyle));
            var actualStyles = [];
            for (var i = 0; i < styles.length; i++) {
                // if series color styles should change,get current sereis colors,then generate real options
                // which setChartStyle action need
                var actualStyle = chartHelper.getMergedChartStyle(defaultStyle, styles[i]);
                actualStyle.colorAndStyle = colorAndStyle;
                actualStyles.push(actualStyle);
            }
            return actualStyles;
        },
        getMergedChartStyle: function (defaultStyle, style) {
            var defaultStyleCopy = JSON.parse(JSON.stringify(defaultStyle));
            if (style) {
                if (style.series) {
                    // style.series may be "transparent" or other special description,can't merge directly,should transform to like this:
                    // defaultStyleCopy.series:[{backColor:"rgba(55,121,32,1)"},{backColor:"rgba(72,221,155,1)"}]
                    // style.series:{backColor:"transparent"}
                    // ==>defaultStyleCopy.series:[{backColor:"rgba(55,121,32,0)"},{backColor:"rgba(72,221,155,0)"}]
                    chartHelper.handleSeriesStyleMerge(defaultStyleCopy, style.series);
                }
                style.series = null;
                // merge style's field to defaultStyleCopy,except style.series
                chartHelper.mergeObject(defaultStyleCopy, style);
            }
            return defaultStyleCopy;
        },
        handleSeriesStyleMerge: function (defaultStyleCopy, seriesStyle) {
            var transparentDict = {
                transparent: "0",
                halfTransparent: "0.5"
            };
            var j;
            var currentSeriesStyles = defaultStyleCopy.series;
            var backColorParts, transparentColor, colorStartChat;
            var theme = designer.wrapper.spread.getActiveSheet().currentTheme();
            for (j = 0; j < currentSeriesStyles.length; j++) {
                var currentBackColor = currentSeriesStyles[j].backColor;
                //for pie chart
                if (currentSeriesStyles[j].chartType === Charts.ChartType.pie ||
                    currentSeriesStyles[j].chartType === Charts.ChartType.doughnut) {
                    colorStartChat = currentBackColor.charAt(0);
                    if (colorStartChat === "a") {
                        currentBackColor = currentBackColor.split(",");
                    } else {
                        currentBackColor = currentBackColor.match(/rgba\(\d+,\d+,\d+,\d+\.?\d?\)|[#\w ]+/g);
                    }
                    if (seriesStyle.backColor === "halfTransparent") {
                        for (var k = 0; k < currentBackColor.length; k++) {
                            if (ColorHelper.isThemeColor(theme, currentBackColor[k])) {
                                currentBackColor[k] = ColorHelper.hexToRgba(ColorHelper.parse(currentBackColor[k], theme).color);
                            }
                            backColorParts = currentBackColor[k].split(",");
                            backColorParts[backColorParts.length - 1] = backColorParts[backColorParts.length - 1].replace("1", "0.5");
                            transparentColor = backColorParts.join(",");
                            currentBackColor[k] = transparentColor;
                        }
                        currentSeriesStyles[j].backColor = currentBackColor.join(",");
                    } else if (seriesStyle.backColor === "rgba(255,255,255,1)") {
                        for (k = 0; k < currentBackColor.length; k++) {
                            currentBackColor[k] = seriesStyle.backColor;
                        }
                        currentSeriesStyles[j].border.color = "rgba(0,0,0,0)";
                        currentSeriesStyles[j].border.width = seriesStyle.border.width;
                    }
                } else {// other chart type
                    if (seriesStyle.border && seriesStyle.border.color === "seriesBackColor") {
                        currentSeriesStyles[j].border.color = currentBackColor;
                        currentSeriesStyles[j].border.width = seriesStyle.border.width;
                    }
                    if (ColorHelper.isThemeColor(theme, currentBackColor)) {
                        currentBackColor = ColorHelper.hexToRgba(ColorHelper.parse(currentBackColor, theme).color);
                    }
                    backColorParts = currentBackColor.split(",");
                    backColorParts[backColorParts.length - 1] = backColorParts[backColorParts.length - 1].replace("1", transparentDict[seriesStyle.backColor] ? transparentDict[seriesStyle.backColor] : "1");
                    transparentColor = backColorParts.join(",");
                    currentSeriesStyles[j].backColor = transparentColor;
                }
            }
        },

        // let object2 cover object1's corresponding property,only basic data type value
        mergeObject: function (object1, object2) {
            for (var prop in object2) {
                if (object2.hasOwnProperty(prop)) {
                    if (typeof object2[prop] === "object") {
                        if (!object1[prop]) {
                            object1[prop] = {};
                        }
                        chartHelper.mergeObject(object1[prop], object2[prop]);
                    } else if (object2[prop] !== null) {
                        object1[prop] = object2[prop];
                    }
                }
            }
        },

        getSeriesWithoutStyle: function (series) {
            var i = 0, count = series.length;
            var seriesWithoutStyle = [];
            for (; i < count; i++) {
                var seriesItemWithoutStyle = {
                    chartType: series[i].chartType,
                    axisGroup: series[i].axisGroup,
                    name: series[i].name,
                    xValues: series[i].xValues,
                    yValues: series[i].yValues,
                    bubbleSizes: series[i].bubbleSizes
                };
                seriesWithoutStyle.push(seriesItemWithoutStyle);
            }
            return seriesWithoutStyle;
        },

        getImageFromChart: function (chart) {
            var base64Image;
            var host = chart.getHost();
            if (host[0]) {
                var canvas = host[0].getElementsByTagName('canvas')[0];
                base64Image = canvas.toDataURL('image/png');
            }
            return base64Image;
        },

        getSeriesColor: function (colorAndStyle, seriesCount, i) {
            var self = this;
            var seriesColor;
            var group = colorAndStyle ? colorAndStyle.color.group : 'colorful';
            var index = colorAndStyle ? colorAndStyle.color.index : 0;
            var chartColors = designer.chartTemplates.chartColors;
            var colors = chartColors[group].colors[index].items;
            seriesColor = self.generateColor(colors, seriesCount, i);
            var theme = designer.wrapper.spread.getActiveSheet().currentTheme();
            if (ColorHelper.isThemeColor(theme, seriesColor)) {
                seriesColor = ColorHelper.hexToRgba(ColorHelper.parse(seriesColor, theme).color);
            }
            return seriesColor;
        },
        axesItemEnum: {
            axesPrimaryHorizontal: 0,
            axesPrimaryVertical: 1,
            axesSecondaryHorizontal: 2,
            axesSecondaryVertical: 3
        },
        isBarGroup: function (chart) {
            var chartType = chart.chartType();
            var isBarType = false;
            var chartGroupe = chartHelper.getChartGroupString(chartType);
            if (chartGroupe === 'BarGroup') {
                isBarType = true;
            }
            if (chartGroupe === 'ComboGroup') {
                var series = chart.series().get();
                for (var i = 0; i < series.length; i++) {
                    var seriesItem = series[i];
                    var seriesGroupe = chartHelper.getChartGroupString(seriesItem.chartType);
                    if (seriesGroupe !== 'BarGroup') {
                        isBarType = false;
                        break;
                    }
                    isBarType = true;
                }
            }
            return isBarType;
        },
        getChartAxesItem: function (chart, item) {
            var isBarType = chartHelper.isBarGroup(chart);
            var axes = chart.axes();
            if (isBarType) {
                switch (item) {
                    case 0:
                        return axes.primaryValue;
                        break;
                    case 1:
                        return axes.primaryCategory;
                        break;
                    case 2:
                        return axes.secondaryValue;
                        break;
                    case 3:
                        return axes.secondaryCategory;
                        break;
                }
            } else {
                switch (item) {
                    case 0:
                        return axes.primaryCategory;
                        break;
                    case 1:
                        return axes.primaryValue;
                        break;
                    case 2:
                        return axes.secondaryCategory;
                        break;
                    case 3:
                        return axes.secondaryValue;
                        break;
                }
            }
        },
        setChartAxesItem: function (chart, item, axesItem) {
            var isBarType = chartHelper.isBarGroup(chart);
            var axes = chart.axes();
            if (isBarType) {
                switch (item) {
                    case 0:
                        axes.primaryValue = axesItem;
                        break;
                    case 1:
                        axes.primaryCategory = axesItem;
                        break;
                    case 2:
                        axes.secondaryValue = axesItem;
                        break;
                    case 3:
                        axes.secondaryCategory = axesItem;
                        break;
                }
            } else {
                switch (item) {
                    case 0:
                        axes.primaryCategory = axesItem;
                        break;
                    case 1:
                        axes.primaryValue = axesItem;
                        break;
                    case 2:
                        axes.secondaryCategory = axesItem;
                        break;
                    case 3:
                        axes.secondaryValue = axesItem;
                        break;
                }
            }
            return axes;
        },

        chartElementType: ['series', 'axis', keyword_undefined, 'legend', 'dataLabels', 'chartTitle', keyword_undefined, 'chartArea'/*plot area no api setting*/, 'chartArea']
    };
    util.chartHelper = chartHelper;

    designer.util = util;
})();
