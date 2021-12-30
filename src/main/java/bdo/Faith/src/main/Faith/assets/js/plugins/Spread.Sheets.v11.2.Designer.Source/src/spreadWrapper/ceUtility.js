(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var CEUtility = (function () {
        function CEUtility() {

        }

        function prepareCalcService() {
            if (!CEUtility.calcService) {
                CEUtility.calcService = designer.wrapper.spread.getCalcService();
            }
        }

        CEUtility.unparse = function (source, expr, row, col) {
            prepareCalcService();
            return CEUtility.calcService.unparse(source, expr, row, col);
        };

        CEUtility.parse = function (source, formula, row, col, ignoreError, forceA1) {
            prepareCalcService();
            return CEUtility.calcService.parse(source, formula, row, col, ignoreError, forceA1);
        };

        CEUtility.parseRangeToExpString = function (range, isAbsolute, baseRow, baseCol, referenceStyle) {
            var Calc = GC.Spread.Sheets.CalcEngine;
            var referenceRelative = Calc.RangeReferenceRelative.allRelative;
            if (isAbsolute) {
                referenceRelative = Calc.RangeReferenceRelative.allAbsolute;
            }
            return Calc.rangeToFormula(range, baseRow||0, baseCol||0, referenceRelative, referenceStyle);
        };

        CEUtility.parseExpStringToRanges = function (expString, sheet) {
            var Calc = GC.Spread.Sheets.CalcEngine;
            var ranges = [];
            var exps = expString.split(",");
            try {
                for (var i = 0; i < exps.length; i++) {
                    var range = Calc.formulaToRange(sheet, exps[i]);
                    if (range) {
                        ranges.push(range);
                    }
                }
            } catch (e) {
                return null;
            }
            return ranges;
        };

        CEUtility.parseExternalRangeToString = function (externalRange, baseRow, baseCol, referenceStyle) {
            var str = "";
            if (externalRange.range) {
                str += CEUtility.parseRangeToExpString(externalRange.range, false, baseRow, baseCol, referenceStyle);
            }
            return str;
        };

        CEUtility.parseStringToExternalRanges = function (expString, sheet) {
            var Calc = GC.Spread.Sheets.CalcEngine;
            var results = [];
            var exps = expString.split(",");
            try {
                for (var i = 0; i < exps.length; i++) {
                    var range = Calc.formulaToRange(sheet, exps[i]);
                    results.push({ range: range });
                }
            } catch (e) {
                return null;
            }
            return results;
        };
        return CEUtility;
    })();
    designer.CEUtility = CEUtility;

})();