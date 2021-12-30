(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var chartHelper = designer.util.chartHelper;
    var keyword_undefined = void 0;
    var ColorHelper = designer.ColorHelper;

    function _buildRadioDataName(name) {
        var cssContent = name.split(' ');
        if (cssContent.length > 0) {
            name = cssContent[0].toLocaleLowerCase();
            for (var i = 1; i < cssContent.length; i++) {
                name = name + ' ' + cssContent[i].toLocaleLowerCase();
            }
        }
        return name;
    }

    function _buildPanelContentCss(title) {
        var cssContent = title.split('And');
        var css = '';
        if (cssContent.length > 0) {
            css = cssContent[0].toLocaleLowerCase();
            for (var i = 1; i < cssContent.length; i++) {
                css = css + '-' + cssContent[i].toLocaleLowerCase();
            }
        }
        return css;
    }

    function closeSlidePanel() {
        var sliderPanel = $(".slider-panel");
        sliderPanel.sliderpanel("close", "panel2");
    }

    function _isEmptyObject(obj) {
        return obj ? (typeof obj === 'object') && (Object.keys(obj).length === 0) : true;
    }


    var defaultColor = 'rgba(91,155,213,1)';

    var chartDescription = {
        'baseChart': {
            series: {
                fillAndLine: { Line: ['fill', 'border'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            chartArea: {
                fillAndLine: { Line: ['fill'] },
                sizeAndProperties: { Size: ['size'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            chartTitle: {
                textFill: { Text: ['textFill', 'font', 'textElement'] }
            },
            legend: {
                legendPosition: { Legend: ['position'] }
            },
            dataLabels: {
                textFill: { Text: ['textFill'] }
            },
            primaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick'] },
            },
            primaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick'] },
            },
            primaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick'] }
            },
            secondaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick'] }
            },
            secondaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            }
        },
        'columnClustered': {},
        'columnStacked': {},
        'columnStacked100': {},
        'line': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'lineStacked': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
        },
        'lineStacked100': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            chartArea: {
                fillAndLine: { Line: ['fill'] },
                sizeAndProperties: { Size: ['size'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            chartTitle: {
                textFill: { Text: ['textFill', 'font', 'textElement'] }
            },
            legend: {
                legendPosition: { Legend: ['position'] }
            },
            dataLabels: {
                textFill: { Text: ['textFill'] }
            },
            primaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick'] },
            },
            primaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick'] },
            },
            primaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick'] },
            },
            secondaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick'] },
            },
            secondaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            }
        },
        'lineMarkers': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            chartArea: {
                fillAndLine: { Line: ['fill'] },
                sizeAndProperties: { Size: ['size'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            chartTitle: {
                textFill: { Text: ['textFill', 'font', 'textElement'] }
            },
            legend: {
                legendPosition: { Legend: ['position'] }
            },
            dataLabels: {
                textFill: { Text: ['textFill'] }
            },
            primaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick'] },
            },
            primaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick'] },
            },
            primaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick'] },
            },
            secondaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick'] },
            },
            secondaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            }
        },
        'lineMarkersStacked': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            chartArea: {
                fillAndLine: { Line: ['fill'] },
                sizeAndProperties: { Size: ['size'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            chartTitle: {
                textFill: { Text: ['textFill', 'font', 'textElement'] }
            },
            legend: {
                legendPosition: { Legend: ['position'] }
            },
            dataLabels: {
                textFill: { Text: ['textFill'] }
            },
            primaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick'] },
            },
            primaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick'] },
            },
            primaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick'] },
            },
            secondaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick'] },
            },
            secondaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            }
        },
        'lineMarkersStacked100': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            chartArea: {
                fillAndLine: { Line: ['fill'] },
                sizeAndProperties: { Size: ['size'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            chartTitle: {
                textFill: { Text: ['textFill', 'font', 'textElement'] }
            },
            legend: {
                legendPosition: { Legend: ['position'] }
            },
            dataLabels: {
                textFill: { Text: ['textFill'] }
            },
            primaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick'] },
            },
            primaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick'] },
            },
            primaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick'] },
            },
            secondaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick'] },
            },
            secondaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            }
        },
        'pie': {
            series: {
                fillAndLine: { Line: ['fillPie', 'border'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
        },
        'doughnut': {
            series: {
                fillAndLine: { Line: ['fillPie', 'border'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'barClustered': {},
        'barStacked': {},
        'barStacked100': {},
        'area': {},
        'areaStacked': {},
        'areaStacked100': {},
        'xyScatter': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'xyScatterSmooth': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'xyScatterSmoothNoMarkers': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'xyScatterLines': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'xyScatterLinesNoMarkers': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'bubble': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'combo': {},
        'stockHLC': {},
        'stockOHLC': {},
        'stockVHLC': {},
        'stockVOHLC': {}
    };

    function getSpecialColorWithSeries(oneSeries, seriesCount, seriesIndex, isPie) {
        var chart = getActiveChart();
        var color = oneSeries.backColor;
        if (oneSeries && seriesCount && seriesIndex !== null) {
            if (isPie === true) {
                var pieColorIsAuto = judgePieColorIsAuto(oneSeries.backColor);
                if (pieColorIsAuto) {
                    color = designer.res.chartSliderPanel.automatic;
                }
            } else {
                color = judgeChartColorIsAuto(oneSeries.backColor, seriesCount, seriesIndex, chart);
            }
        }
        return color ? { text: color, color: oneSeries.backColor } : oneSeries.backColor;
    }

    function getActiveChart() {
        var sheet = designer.wrapper.spread.getActiveSheet();
        var activeChart = null;
        sheet.charts.all().forEach(function (chart) {
            if (chart.isSelected()) {
                activeChart = chart;
            }
        });
        return activeChart;
    }

    function judgePieColorIsAuto(colorString) {
        var colorArray = chartHelper.getPieColorArray(colorString);
        for (var i = 1; i < colorArray.length; i++) {
            if (colorArray[i] !== colorArray[i - 1]) {
                return true;
            }
        }
        return false;
    }

    function judgeChartColorIsAuto(color, count, index, activeChart) {
        if (color === null || color === undefined) {
            return color;
        } else {
            var themeColors = designer.chartTemplates.chartColors.colorful.colors[0].items;
            if (activeChart && activeChart.colorAndStyle && activeChart.colorAndStyle.color && activeChart.colorAndStyle.color.group && activeChart.colorAndStyle.color.index) {
                var themeColoOptions = activeChart.colorAndStyle.color;
                var group = themeColoOptions.group;
                var colorOptionIndex = themeColoOptions.index;
                themeColors = designer.chartTemplates.chartColors[group].colors[colorOptionIndex].items;
            }
            var themeColor = chartHelper.generateColor(themeColors, count, index);
            var colorArray = color.split(' ');
            if (colorArray[colorArray.length - 1] === '0') {
                colorArray.pop();
                color = colorArray.join(' ');
            }
            if (themeColor === color) {
                return designer.res.chartSliderPanel.automatic;
            }
        }
    }

    function getSeriesData(chart, outDataObj, category) {
        var seriesCollection = chart.series(), seriesCount = seriesCollection.Count,
            chartType = chartHelper.getChartTypeString(chart.chartType());
        if (chartType === 'stockHLC' || chartType === 'stockOHLC' || chartType === 'stockVHLC' || chartType === 'stockVOHLC') {
            return;
        }
        var seriesOfchart;
        if (chartType === 'pie' || chartType === 'doughnut') {
            seriesCount = 1;
        }
        var getProperty = {
            'fill': getFill,
            'fillPie': getFillPie,
            'border': getBorder,
            'seriesOptions': getSeriesOptions,
            'line': getLine
        };
        for (var index = 0; index < seriesCount; index++) {
            var dataObj = outDataObj['series' + ' ' + category[index]] = {};
            var series = seriesCollection.get(index);
            if (series.chartType === 1 || series.chartType === 33 || series.chartType === 34 || series.chartType === 35 || series.chartType === 36) {
                series.border.width = null;
            }
            chartType = chartHelper.getChartTypeString(series.chartType);
            seriesOfchart = chartDescription[chartType]['series'] || chartDescription['baseChart']['series'];
            for (var i in seriesOfchart) {
                dataObj[i] = { type: i };
                var data = dataObj[i];
                for (var j in seriesOfchart[i]) { /* NOSONAR: Forin*/
                    var editors = [];
                    seriesOfchart[i][j].forEach(function (k) {
                        var editor = getProperty[k](series, index, seriesCount);
                        editors.push(editor);
                    });
                    var content = {};
                    content[j] = editors;
                    data['content'] = [];
                    data['content'].push(content);
                }
            }
        }

        function getFillPie(series1, seriesIndex, count) {
            var color = getSpecialColorWithSeries(series1, count, seriesIndex, true);
            return {
                name: designer.res.chartSliderPanel.fill,
                data: { backColor: color },
                type: 'fill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill,
                    automaticColorText: designer.res.chartSliderPanel.automatic
                }
            };
        }

        function getFill(series1, seriesIndex, count) {
            var color = getSpecialColorWithSeries(series1, count, seriesIndex, false);
            return {
                name: designer.res.chartSliderPanel.fill,
                data: { backColor: color },
                type: 'fill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill,
                    automaticColorText: designer.res.chartSliderPanel.automatic
                }
            };
        }

        function getBorder(series1) {
            return {
                name: designer.res.chartSliderPanel.border,
                data: { borderWidth: series1.border.width, borderColor: series1.border.color || 'rgba(0, 0, 0, 0)' },
                type: 'border',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }

        function getSeriesOptions(series1) {
            return {
                name: designer.res.chartSliderPanel.seriesOptions,
                data: { axisGroup: series1.axisGroup },
                type: 'series',
                resources: {
                    primaryAxisText: designer.res.chartSliderPanel.primaryAxis,
                    secondaryAxisText: designer.res.chartSliderPanel.secondaryAxis
                }
            };
        }

        function getLine(series1, seriesIndex, count) {
            var themeColors = designer.chartTemplates.chartColors.colorful.colors[0].items;
            var themeColor = chartHelper.generateColor(themeColors, count, seriesIndex);
            series1.border.color = series1.border.color || themeColor;
            return {
                name: designer.res.chartSliderPanel.line,
                data: { borderWidth: series1.border.width, borderColor: series1.border.color || 'rgba(0,0,0,0)' },
                type: 'line',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }
    }

    function getLegendData(chart, outDataObj) {
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartLegendOptions = chartDescription[chartType]['legend'] || chartDescription['baseChart']['legend'];
        var getProperty = { 'position': getPosition };
        if (chartType === 'stockHLC' || chartType === 'stockOHLC' || chartType === 'stockVHLC' || chartType === 'stockVOHLC') {
            return;
        }
        var dataObj = outDataObj['legend'] = {};
        var legend = chart.legend();

        for (var i in chartLegendOptions) {
            dataObj[i] = { type: i };
            var data = dataObj[i];
            for (var j in chartLegendOptions[i]) { /* NOSONAR: Forin*/
                var editors = [];
                chartLegendOptions[i][j].forEach(function (k) {
                    var editor = getProperty[k](legend);
                    editors.push(editor);
                });
                var content = {};
                content[j] = editors;
                data['content'] = [];
                data['content'].push(content);
            }
        }

        function getPosition(legend1) {
            return {
                name: designer.res.chartSliderPanel.legendPosition,
                data: { position: legend1.position },
                type: 'legend',
                resources: {
                    topText: designer.res.chartSliderPanel.top,
                    bottomText: designer.res.chartSliderPanel.bottom,
                    leftText: designer.res.chartSliderPanel.left,
                    rightText: designer.res.chartSliderPanel.right
                }
            };
        }
    }

    function getLabelData(chart, outDataObj) {
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartTitleOptions = chartDescription[chartType]['dataLabels'] || chartDescription['baseChart']['dataLabels'];
        var getProperty = { 'textFill': getTextFill };
        var dataLabels = chart.dataLabels();
        if (_isEmptyObject(dataLabels) || (dataLabels.showValue === false && dataLabels.showSeriesName === false && dataLabels.showCategoryName === false)) {
            return;
        }
        var dataObj = outDataObj['dataLabels'] = {};

        for (var i in chartTitleOptions) {
            dataObj[i] = { type: i };
            var data = dataObj[i];
            for (var j in chartTitleOptions[i]) { /* NOSONAR: Forin*/
                var editors = [];
                chartTitleOptions[i][j].forEach(function (k) {
                    var editor = getProperty[k](dataLabels);
                    editors.push(editor);
                });
                var content = {};
                content[j] = editors;
                data['content'] = [];
                data['content'].push(content);
            }
        }
        function getTextFill(dataLabels1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { color: dataLabels1.color },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }
    }

    function getChartTitleData(chart, outDataObj) {
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartTitleOptions = chartDescription[chartType]['chartTitle'] || chartDescription['baseChart']['chartTitle'];
        var getProperty = { 'textFill': getTextFill, 'font': getFontOptions, 'textElement': getTextElement };

        var chartTitle = chart.title();
        if (_isEmptyObject(chartTitle)) {
            return;
        }
        var dataObj = outDataObj['chartTitle'] = {};

        for (var i in chartTitleOptions) {
            dataObj[i] = { type: i };
            var data = dataObj[i];
            for (var j in chartTitleOptions[i]) { /* NOSONAR: Forin*/
                var editors = [];
                chartTitleOptions[i][j].forEach(function (k) {
                    var editor = getProperty[k](chartTitle);
                    editors.push(editor);
                });
                var content = {};
                content[j] = editors;
                data['content'] = [];
                data['content'].push(content);
            }
        }

        function getTextFill(chartTitle1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { color: chartTitle1.color },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }

        function getFontOptions(chartTitle1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { fontFamily: chartTitle1.fontFamily, fontSize: chartTitle1.fontSize },
                type: 'font',
                resources: {
                    fontFamily: designer.res.chartSliderPanel.fontFamily,
                    fontSize: designer.res.chartSliderPanel.fontSize
                }
            };
        }

        function getTextElement(chartTitle1) {
            return {
                name: designer.res.chartSliderPanel.textEditor,
                data: { text: chartTitle1.text },
                type: 'textElement',
                resources: { textElement: designer.res.chartSliderPanel.text }
            };
        }
    }

    function getChartAreaData(chart, outDataObj) {
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartAreaOptions = chartDescription[chartType]['chartArea'] || chartDescription['baseChart']['chartArea'];
        var getProperty = {
            'fill': getFill,
            'size': getSize,
            'textFill': getTextFill,
            'font': getFontOptions
        };

        var dataObj = outDataObj['chartArea'] = {};
        var chartArea = chart.chartArea();

        for (var i in chartAreaOptions) {
            dataObj[i] = { type: i };
            var data = dataObj[i];
            for (var j in chartAreaOptions[i]) { /* NOSONAR: Forin*/
                var editors = [];
                chartAreaOptions[i][j].forEach(function (k) {
                    var editor = getProperty[k](k === 'size' ? chart : chartArea);
                    editors.push(editor);
                });
                var content = {};
                content[j] = editors;
                data['content'] = [];
                data['content'].push(content);
            }
        }

        function getFill(chartArea1) {
            return {
                name: designer.res.chartSliderPanel.fill,
                data: { backColor: chartArea1.backColor },
                type: 'fill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }

        function getSize(chart1) {
            return {
                name: designer.res.chartSliderPanel.size,
                data: { xOffset: chart1.x(), yOffset: chart1.y(), width: chart1.width(), height: chart1.height() },
                type: 'size',
                resources: {
                    widthText: designer.res.chartSliderPanel.width,
                    heightText: designer.res.chartSliderPanel.height
                }
            };
        }

        function getTextFill(chartArea1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { color: chartArea1.color },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }

        function getFontOptions(chartArea1) {
            return {
                name: designer.res.chartSliderPanel.font,
                data: { fontFamily: chartArea1.fontFamily || 'Calibri', fontSize: chartArea1.fontSize || '10' },
                type: 'font',
                resources: {
                    fontFamily: designer.res.chartSliderPanel.fontFamily,
                    fontSize: designer.res.chartSliderPanel.fontSize
                }
            };
        }
    }

    function getAxisData(chart, outDataObj) {
        var axes = chart.axes();
        if (_isEmptyObject(axes)) {
            return;
        }
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartAxisOptions;
        var getProperty = {
            'line': getLine,
            'textFill': getTextFill,
            'font': getFontOptions,
            'tick': getTickPosition,
            'axisCategory': getAxisCategoryOptions,
            'axisValue': getAxisValueOptions,
            'titleTextFill': getTitleTextFill,
            'titleFont': getTitleFontOptions,
            'titleTextElement': getTitleTextElement,
            'majorLine': getMajorGridLine,
            'minorLine': getMinorGridLine
        };
        for (var index in axes) {
            if (axes[index].visible === true) {
                chartAxisOptions = chartDescription[chartType][index] || chartDescription['baseChart'][index];
                if (axes[index]['lineStyle']['width'] !== 0 && axes[index]['lineStyle']['color'] !== 'rgba(0, 0, 0, 0)') {
                    getData(chartAxisOptions, index);
                }
                if (axes[index]['title']['text'] !== '') {
                    chartAxisOptions = chartDescription[chartType][index + 'Title'] || chartDescription['baseChart'][index + 'Title'];
                    getData(chartAxisOptions, index + 'Title');
                }
                if (axes[index]['majorGridLine']['visible'] === true) {
                    chartAxisOptions = chartDescription[chartType][index + 'MajorGridLine'] || chartDescription['baseChart'][index + 'MajorGridLine'];
                    getData(chartAxisOptions, index + 'MajorGridLine');
                }
                if (axes[index]['minorGridLine']['visible'] === true) {
                    chartAxisOptions = chartDescription[chartType][index + 'MinorGridLine'] || chartDescription['baseChart'][index + 'MinorGridLine'];
                    getData(chartAxisOptions, index + 'MinorGridLine');
                }
            }
        }
        function getData(chartAxisOptions1, name) {
            var dataObj = outDataObj[name] = {};
            var axis = axes[index];
            for (var i in chartAxisOptions1) {
                dataObj[i] = { type: i };
                var data = dataObj[i];
                for (var j in chartAxisOptions1[i]) { /* NOSONAR: Forin*/
                    var editors = [];
                    chartAxisOptions1[i][j].forEach(function (k) {
                        var editor = getProperty[k](axis);
                        editors.push(editor);
                    });
                    var content = {};
                    content[j] = editors;
                    data['content'] = [];
                    data['content'].push(content);
                }
            }
        }

        function getMajorGridLine(axes1) {
            return {
                name: designer.res.chartSliderPanel.line,
                data: { majorGridLineWidth: axes1.majorGridLine.width, majorGridLineColor: axes1.majorGridLine.color },
                type: 'line',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }

        function getMinorGridLine(axes1) {
            return {
                name: designer.res.chartSliderPanel.line,
                data: { minorGridLineWidth: axes1.minorGridLine.width, minorGridLineColor: axes1.minorGridLine.color },
                type: 'line',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }

        function getTitleFontOptions(axes1) {
            return {
                name: designer.res.chartSliderPanel.font,
                data: { fontFamilyTitle: axes1.title.fontFamily, fontSizeTitle: axes1.title.fontSize },
                type: 'font',
                resources: {
                    fontFamily: designer.res.chartSliderPanel.fontFamily,
                    fontSize: designer.res.chartSliderPanel.fontSize
                }
            };
        }

        function getTitleTextFill(axes1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { colorTitle: axes1.title.color },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }

        function getTitleTextElement(axes1) {
            return {
                name: designer.res.chartSliderPanel.textEditor,
                data: { textTitle: axes1.title.text },
                type: 'textElement',
                resources: { textElement: designer.res.chartSliderPanel.text }
            };
        }

        function getTextFill(axes1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { color: axes1.style.color },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }

        function getFontOptions(axes1) {
            return {
                name: designer.res.chartSliderPanel.font,
                data: { fontFamily: axes1.style.fontFamily, fontSize: axes1.style.fontSize },
                type: 'font',
                resources: {
                    fontFamily: designer.res.chartSliderPanel.fontFamily,
                    fontSize: designer.res.chartSliderPanel.fontSize
                }
            };
        }

        function getLine(axes1) {
            return {
                name: designer.res.chartSliderPanel.line,
                data: { borderWidth: axes1.lineStyle.width, borderColor: axes1.lineStyle.color },
                type: 'line',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }

        function getTickPosition(axes1) {
            return {
                name: designer.res.chartSliderPanel.tickMarks,
                data: { majorTickPosition: axes1.majorTickPosition, minorTickPosition: axes1.minorTickPosition },
                type: 'tick',
                resources: {
                    majorText: designer.res.chartSliderPanel.majorType,
                    minorText: designer.res.chartSliderPanel.minorType
                }
            };
        }

        function getAxisCategoryOptions(axes1) {
            if (axes1.categoryType === 3) {
                return {
                    name: designer.res.chartSliderPanel.axisOptions,
                    data: {
                        majorUnit: axes1.majorUnit,
                        minorUnit: axes1.minorUnit,
                        maxValue: axes1.max,
                        minValue: axes1.min
                    },
                    type: 'axisValue',
                    resources: {
                        majorUnitText: designer.res.chartSliderPanel.unitsMajor,
                        minorUnitText: designer.res.chartSliderPanel.unitsMinor,
                        maxValueText: designer.res.chartSliderPanel.maximum,
                        minValueText: designer.res.chartSliderPanel.minimum
                    }
                };
            }
            return {
                name: designer.res.chartSliderPanel.axisOptions,
                data: {
                    categoryType: axes1.categoryType,
                    maxValue: axes1.categoryType === 2 ? (axes1.max && axes1.max.toLocaleDateString()) : axes1.max,
                    minValue: axes1.categoryType === 2 ? (axes1.min && axes1.min.toLocaleDateString()) : axes1.min
                },
                type: 'axisCategory',
                resources: {
                    textText: designer.res.chartSliderPanel.textAxis,
                    dateText: designer.res.chartSliderPanel.dateAxis,
                    maxValueText: designer.res.chartSliderPanel.maximum,
                    minValueText: designer.res.chartSliderPanel.minimum
                }
            };
        }

        function getAxisValueOptions(axes1) {
            return {
                name: designer.res.chartSliderPanel.axisOptions,
                data: {
                    majorUnit: axes1.majorUnit,
                    minorUnit: axes1.minorUnit,
                    maxValue: axes1.max,
                    minValue: axes1.min
                },
                type: 'axisValue',
                resources: {
                    majorUnitText: designer.res.chartSliderPanel.unitsMajor,
                    minorUnitText: designer.res.chartSliderPanel.unitsMinor,
                    maxValueText: designer.res.chartSliderPanel.maximum,
                    minValueText: designer.res.chartSliderPanel.minimum
                }
            };
        }
    }

    //#region sliderPanel DataManager
    function SliderPanelDataManager() {

    }

    SliderPanelDataManager.prototype.setCurrentChart = function (chart) {
        this._chart = chart;
    };

    SliderPanelDataManager.prototype.setAllData = function (data) {
        this._data = data;
    };
    SliderPanelDataManager.prototype.setSelectedElement = function (element) {
        this._selectedElement = element.chartElement;
        this._selectedItem = element.selectedItem;
    };
    SliderPanelDataManager.prototype.setChartCategories = function (categories) {
        this._categories = categories;
    };
    SliderPanelDataManager.prototype.getHeaderData = function () {
        var selectedElement = this._selectedElement;
        switch (selectedElement) {
            case "series":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.dataSeries };
            case "axis":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.axis };
            case "legend":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.legend };
            case "label":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.dataLable };
            case "chartTitle":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.chartTitle };
            case "plotArea":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.plotArea };
            case "chartArea":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.chartArea };
            default:
                return { title: designer.res.chart.formatChartArea };
        }
    };
    SliderPanelDataManager.prototype.updateData = function (namePath, dataPath, pathName, value) {
        var selectedElement = this._selectedElement;
        var tempSelectedForAxis = this._tempSelectedForAxis;
        var categories = this._categories;
        var datas = this._data;
        var data = datas[this._selectedItem || selectedElement];
        var names = pathName.split('.');
        var self = this;
        var spread = designer.wrapper.spread;
        var chart = self._chart;
        var result, option, property;
        var loop, newData, j, names1, names2;
        switch (selectedElement) {
            case "series":
                var seriesText = this._selectedItem.slice(('series ').length, this._selectedItem.length);
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i] + '' === seriesText) {
                        var tempResult;
                        if (chart) {
                            property = names[names.length - 1];
                            option = chart.series().get(i);
                            if (property === 'borderColor') {
                                option.border.color = value;
                            } else if (property === 'borderWidth') {
                                option.border.width = value;
                            } else {
                                if (value === designer.res.chartSliderPanel.automatic) {
                                    var group = (chart.colorAndStyle && chart.colorAndStyle.color) && (chart.colorAndStyle && chart.colorAndStyle.color)['group'];
                                    var index = (chart.colorAndStyle && chart.colorAndStyle.color) && (chart.colorAndStyle && chart.colorAndStyle.color)['index'];
                                    designer.actions.doAction('changeChartSeriesColor', designer.wrapper.spread, {
                                        group: group,
                                        index: index,
                                        type: property,
                                        ignoreEvent: true
                                    }, chart);
                                    tempResult = { text: designer.res.chartSliderPanel.automatic };
                                } else if ((chartHelper.getChartTypeString(chart.chartType()) === 'pie' || chartHelper.getChartTypeString(chart.chartType()) === 'doughnut') && property === 'backColor') {
                                    var pieBackColor = chartHelper.getPieColorArray(option[property]);
                                    loop = 1;
                                    option[property] = value;
                                    while (loop < pieBackColor.length) {
                                        option[property] += ',' + value;
                                        loop++;
                                    }
                                } else {
                                    option[property] = value;
                                }
                            }
                            if (value !== designer.res.chartSliderPanel.automatic) {
                                designer.actions.doAction("updateChartSeries", spread, {
                                    chart: chart, element: {
                                        index: i,
                                        value: option
                                    }
                                });
                            }
                            newData = chart.series().get(i);
                            names1 = namePath.split('.');
                            for (j = 0; j < names1.length; j++) {
                                data = data[names1[j]];
                            }
                            names2 = dataPath;
                            for (j = 0; j < names2.length;) {
                                data = data[names2[j]][names2[j + 1]];
                                j += 2;
                            }
                            for (j = 0; j < names.length - 1; j++) {
                                data = data[names[j]];
                            }
                            if (property === 'borderColor') {
                                value = newData.border.color;
                            } else if (property === 'borderWidth') {
                                value = newData.border.width;
                            } else {
                                value = newData[property];
                            }
                            result = data[property] = value;
                        }
                        if (tempResult) {
                            tempResult['color'] = result;
                            return tempResult;
                        }
                        return result;
                    }
                }
                break;
            case "axis":
                if (chart) {
                    property = names[names.length - 1];
                    var axesType = tempSelectedForAxis || (selectedElement && self._selectedItem);
                    option = chart.axes()[axesType];
                    if (property === 'fontSize') {
                        option.style.fontSize = value;
                    } else if (property === 'fontFamily') {
                        option.style.fontFamily = value;
                    } else if (property === 'color') {
                        option.style.color = value;
                    } else if (property === 'borderColor') {
                        option.lineStyle.color = value;
                    } else if (property === 'borderWidth') {
                        option.lineStyle.width = value;
                    } else if (property === 'colorTitle') {
                        option.title.color = value;
                    } else if (property === 'fontSizeTitle') {
                        option.title.fontSize = value;
                    } else if (property === 'fontFamilyTitle') {
                        option.title.fontFamily = value;
                    } else if (property === 'textTitle') {
                        option.title.text = value;
                    } else if (property === 'majorGridLineColor') {
                        option.majorGridLine.color = value;
                    } else if (property === 'minorGridLineColor') {
                        option.minorGridLine.color = value;
                    } else if (property === 'majorGridLineWidth') {
                        option.majorGridLine.width = value;
                    } else if (property === 'minorGridLineWidth') {
                        option.minorGridLine.width = value;
                    } else {
                        if (option.categoryType === 2 && (property === 'max' || property === 'min')) {
                            if (value === null || value === keyword_undefined) {
                                value = (value && new Date(value).getTime());
                            } else {
                                value = (value && new Date(value).getTime()) || (option[property] && new Date(option[property]).getTime());
                            }
                        } else if (!option.categoryType || (option.categoryType === 3 && (property === 'max' || property === 'min'))) {
                            value = value && Number(value);
                        }
                        option[property] = value;
                    }
                    var obj = {};
                    obj[axesType] = option;
                    designer.actions.doAction("changeChartFormatProperty", spread, { chart: chart, element: { axes: obj } });
                    newData = chart.axes()[tempSelectedForAxis || (selectedElement && self._selectedItem)];
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    if (property === 'fontSize') {
                        value = newData.style.fontSize;
                    } else if (property === 'fontFamily') {
                        value = newData.style.fontFamily;
                    } else if (property === 'color') {
                        value = newData.style.color;
                    } else if (property === 'borderColor') {
                        value = newData.lineStyle.color;
                    } else if (property === 'borderWidth') {
                        value = newData.lineStyle.width;
                    } else if (property === 'colorTitle') {
                        value = newData.title.color;
                    } else if (property === 'fontSizeTitle') {
                        value = newData.title.fontSize;
                    } else if (property === 'fontFamilyTitle') {
                        value = newData.title.fontFamily;
                    } else if (property === 'textTitle') {
                        value = newData.title.text;
                    } else if (property === 'majorGridLineColor') {
                        value = newData.majorGridLine.color;
                    } else if (property === 'minorGridLineColor') {
                        value = newData.minorGridLine.color;
                    } else if (property === 'majorGridLineWidth') {
                        value = newData.majorGridLine.width;
                    } else if (property === 'minorGridLineWidth') {
                        value = newData.minorGridLine.width;
                    } else if (property === 'categoryType') {
                        value = { categoryType: newData.categoryType, minValue: newData.minValue, maxValue: newData.maxValue };
                    } else {
                        if (option.categoryType === 2 && (property === 'max' || property === 'min')) {
                            value = newData[property] && newData[property].toLocaleDateString();
                        } else {
                            value = newData[property];
                        }
                    }
                    result = data[property] = value;
                }
                return result;
            case "legend":
                if (chart) {
                    var legendPositionMap = {};
                    legendPositionMap[designer.res.chartSliderPanel.top] = 1;
                    legendPositionMap[designer.res.chartSliderPanel.right] = 2;
                    legendPositionMap[designer.res.chartSliderPanel.left] = 3;
                    legendPositionMap[designer.res.chartSliderPanel.bottom] = 4;
                    property = names[names.length - 1];
                    option = chart.legend();
                    option[property] = legendPositionMap[value];
                    designer.actions.doAction("changeChartFormatProperty", spread, { chart: chart, element: { legend: option } });
                    newData = chart.legend();
                    value = newData[property];
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    result = data[property] = value;
                }
                return result;
            case "dataLabels":
                if (chart) {
                    property = names[names.length - 1];
                    option = chart.dataLabels();
                    option[property] = value;
                    designer.actions.doAction("changeChartFormatProperty", spread, { chart: chart, element: { dataLabels: option } });
                    newData = chart.dataLabels();
                    value = newData[property];
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    result = data[property] = value;
                }
                return result;
            case "chartTitle":
                if (chart) {
                    property = names[names.length - 1];
                    option = chart.title();
                    if (!option) {
                        option = { text: '' };
                    }
                    option[property] = value;
                    designer.actions.doAction("changeChartFormatProperty", spread, { chart: chart, element: { title: option } });
                    newData = chart.title();
                    if (!newData) {
                        newData = { text: '' };
                    }
                    value = newData[property];
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    result = data[property] = value;
                }
                return result;
            case "plotArea":
                break;
            case "chartArea":
                if (chart) {
                    if (namePath === 'sizeAndProperties') {
                        option = {
                            name: [chart.name()],
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0
                        };
                        property = names[names.length - 1];
                        option[property] = property === 'width' ? Number(value) - chart.width() : Number(value) - chart.height();
                        designer.actions.doAction("updateChartSize", spread, option);
                        var newOption = {
                            name: [chart.name()],
                            x: chart.x(),
                            y: chart.y(),
                            width: chart.width(),
                            height: chart.height()
                        };
                        value = newOption[property];
                    } else {
                        property = names[names.length - 1];
                        option = {};
                        option[property] = value;
                        designer.actions.doAction("changeChartFormatProperty", spread, {
                            chart: chart,
                            element: { chartArea: option }
                        });
                        newData = chart.chartArea();
                        value = newData[property];
                        if (property === 'color') {
                            for (loop in datas) {
                                if (datas[loop]['textFill']) {
                                    datas[loop]['textFill']['content'][0]['Text'][0]['data']['color'] = value;
                                }
                            }
                        }
                    }
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    result = data[property] = value;
                }
                return result;
            default:
                return null;
        }
    };
    SliderPanelDataManager.prototype.getDatas = function () {
        var datas = [];
        var selectedData = this._data[this._selectedItem || this._selectedElement];
        this.syncSelectedElement();

        for (var i in selectedData) { /* NOSONAR: Forin*/
            var data = { name: selectedData[i].type, properties: [] };
            for (var j in selectedData[i]) {
                if (j !== 'type') {
                    selectedData[i][j].forEach(function (elementData) {
                        var property = {};
                        for (var k in elementData) {
                            property['aggregate'] = k;
                            var editors = property['editors'] = [];
                            elementData[k].forEach(function (subElementData) {
                                editors.push({
                                    name: subElementData.name,
                                    data: subElementData.data,
                                    type: subElementData.type,
                                    resources: subElementData.resources
                                });
                            });
                        }
                        data.properties.push(property);
                    });
                }
            }
            datas.push(data);
        }

        return datas;
    };
    SliderPanelDataManager.prototype.getElements = function () {
        var data = this._data;
        var selectedItem = this._selectedItem;
        var selectedElement = this._selectedElement;
        var element = designer.res.chart.selectedOption[selectedElement] || designer.res.chart.selectedOption[selectedItem];
        var selectedCollection = { currentElement: { element: element, item: selectedItem || selectedElement } };
        selectedCollection.elements = [];
        for (var i in data) {
            if (i.split(' ')[0] !== 'series') {
                var text = designer.res.chart.selectedText[i];
                if (chartHelper.isBarGroup(this._chart)) {
                    text = designer.res.chart.selectedBarChartText[i] || text;
                }
                selectedCollection.elements.push({
                    element: designer.res.chart.selectedOption[i],
                    text: text,
                    selectedElement: i
                });
            } else {
                var seriesName = i.split(' ');
                seriesName.shift();
                selectedCollection.elements.push({
                    element: designer.res.chart.selectedOption['series'],
                    text: designer.res.chart.selectedText['series'] + ' ' + seriesName.join(' '),
                    selectedElement: i
                });
            }
        }
        return selectedCollection;
    };
    SliderPanelDataManager.prototype.syncSelectedElement = function () {
        this._tempSelectedForAxis = void 0;
        if (this._selectedItem.split(' ')[0] === 'series') {
            this._selectedElement = 'series';
        } else if (this._selectedItem === 'primaryCategory' || this._selectedItem === 'primaryValue' || this._selectedItem === 'secondaryCategory' || this._selectedItem === 'secondaryValue') {
            this._selectedElement = 'axis';
        } else if (this._selectedItem === 'primaryCategoryTitle' || this._selectedItem === 'primaryCategoryMajorGridLine' || this._selectedItem === 'primaryCategoryMinorGridLine') {
            this._selectedElement = 'axis';
            this._tempSelectedForAxis = 'primaryCategory';
        } else if (this._selectedItem === 'secondaryCategoryTitle' || this._selectedItem === 'secondaryCategoryMajorGridLine' || this._selectedItem === 'secondaryCategoryMinorGridLine') {
            this._selectedElement = 'axis';
            this._tempSelectedForAxis = 'secondaryCategory';
        } else if (this._selectedItem === 'secondaryValueTitle' || this._selectedItem === 'secondaryValueMajorGridLine' || this._selectedItem === 'secondaryValueMinorGridLine') {
            this._selectedElement = 'axis';
            this._tempSelectedForAxis = 'secondaryValue';
        } else if (this._selectedItem === 'primaryValueTitle' || this._selectedItem === 'primaryValueMajorGridLine' || this._selectedItem === 'primaryValueMinorGridLine') {
            this._selectedElement = 'axis';
            this._tempSelectedForAxis = 'primaryValue';
        } else {
            this._selectedElement = this._selectedItem;
        }
    };


    //#endregion sliderPanel DataManager
    function PropertyTabHeader(container, headers, tabChangedCallback) {
        var self = this;
        this.tabChanged = tabChangedCallback;
        var categoryGroup = $('<div></div>').addClass('panel-content-header');
        headers.forEach(function (header) {
            categoryGroup.append(self.addTabHeader(header.name/*, header.icon*/));
        });
        this.activePropertyTabHeader = $(categoryGroup.children()[0]);
        this.activePropertyTabHeader.children().remove();
        this.activePropertyTabHeader.append($('<span></span>').addClass('selected-' + _buildPanelContentCss(this.activePropertyTabHeader.attr('title'))).addClass('format-chart-panel'));
        this.propertyTabHeaders = categoryGroup;
        container.append(categoryGroup);
    }

    PropertyTabHeader.prototype.addTabHeader = function (name/*, icon*/) {
        var self = this;
        var categorySpan = $('<span></span>').addClass(_buildPanelContentCss(name)).addClass('format-chart-panel');
        var div = $('<div></div>').append(categorySpan).attr('title', name).addClass('format-chart-panel-background');
        div.click(function (event) {
            self.tabChanged($(event.currentTarget).attr('title'));
        });
        return div;
    };

    var editorTypeMapping = {
        fill: FillColorEditor,
        border: BorderEditor,
        series: SeriesEditor,
        line: LineEditor,
        size: SizeEditor,
        textFill: TextFillEditor,
        legend: LegendPositionEditor,
        font: FontEditor,
        tick: TickEditor,
        axisValue: AxisValueEditor,
        axisCategory: AxisCategoryEditor,
        textElement: TextElementEditor,
    };

    function PropertyTabPanel(datas, owner) { // [{name:"fillAndLine", icon:'', properties:[{name: 'Fill', data: "red", type: "fillEditor"}, {name: 'Border', data: {}, type: 'border'}]}]}, {name:"seriesOptions", icon: '', properties: [{name: "seriesOptions", data: primary, type: 'seriesOptions']
        var self = this;
        this.owner = owner;
        this.propertyHeaderData = [];
        this.propertyGroupPanels = [];
        var tabPanel = $('<div></div>');
        for (var i = 0; i < datas.length; i++) {
            this.propertyHeaderData.push({ name: datas[i].name/*, icon: datas[i].icon*/ });
        }
        this.propertyHeaderPanel = new PropertyTabHeader(tabPanel, this.propertyHeaderData, function (name) {
            self.activeTabChanged(name);
        });

        for (var j = 0; j < datas.length; j++) {
            var groupPanel = new PropertyGroupPanels(datas[j].name, datas[j].properties, function (namePath, dataPath, propertyName, value) {
                return self.activePanelValueChanged(namePath, dataPath, propertyName, value);
            });
            tabPanel.append(groupPanel);
            this.propertyGroupPanels.push({ name: datas[j].name, propertyGroupPanel: groupPanel });
        }
        this.activePropertyGroupPanel = this.propertyGroupPanels[0].propertyGroupPanel;
        this.showPropertyGroupPanel(this.activePropertyGroupPanel);
        return tabPanel;
    }

    PropertyTabPanel.prototype.activePanelValueChanged = function (namePath, dataPath, propertyName, value) {
        return this.owner.updateData(namePath, dataPath, propertyName, value);
    };

    PropertyTabPanel.prototype.activeTabChanged = function (name) {
        for (var i = 0; i < this.propertyGroupPanels.length; i++) {
            if (this.propertyGroupPanels[i].name === name) {
                this.hidePropertyGroupPanel(this.activePropertyGroupPanel);
                this.activePropertyGroupPanel = this.propertyGroupPanels[i].propertyGroupPanel;
                this.showPropertyGroupPanel(this.activePropertyGroupPanel, name);
            }
        }
    };
    PropertyTabPanel.prototype.hidePropertyGroupPanel = function (oldPropertyGroupPanel) {
        oldPropertyGroupPanel.hide();
        this.propertyHeaderPanel.activePropertyTabHeader.children().remove();
        this.propertyHeaderPanel.activePropertyTabHeader.append($('<span></span>').addClass(_buildPanelContentCss(this.propertyHeaderPanel.activePropertyTabHeader.attr('title'))).addClass('format-chart-panel'));
    };
    PropertyTabPanel.prototype.showPropertyGroupPanel = function (newPropertyGroupPanel, name) {
        newPropertyGroupPanel.show();
        var headerElements = this.propertyHeaderPanel.propertyTabHeaders.children();
        for (var i = 0; i < headerElements.length; i++) {
            if ($(headerElements[i]).attr("title") === name) {
                this.propertyHeaderPanel.activePropertyTabHeader = $(headerElements[i]);
                this.propertyHeaderPanel.activePropertyTabHeader.children().remove();
                this.propertyHeaderPanel.activePropertyTabHeader.append($('<span></span>').addClass('selected-' + _buildPanelContentCss(this.propertyHeaderPanel.activePropertyTabHeader.attr('title'))).addClass('format-chart-panel'));
            }
        }
    };

    function PropertyGroupPanels(name, properties, changedValueCallback) { //[{name: 'Fill', data: "red", type: "color", noColorText: "No Fill", solidColorText: "Solid Fill"}, {name: 'Border', data: {}, type: 'border', noColorText: "No Line", solidColorText: "Solid Line"}]
        if (properties.length > 1) {
            // var div = $('<div></div>').hide();
            // for(var i = 0; i < properties.length; i++) {
            //     div.append(new PropertyGroupHeader());
            // }
        }

        this.changedValue = changedValueCallback;
        var self = this;
        self.name = name;
        // self.aggregate = aggregate
        var div = $('<div></div>').hide();
        var j = 0;
        while (j < properties.length) {
            for (var i = 0; i < properties[j].editors.length; i++) {
                div.append(new PropertyGroupContainer(properties[j].editors[i], properties[j].aggregate, j, i, function (dataPath, propertyName, value) {
                    return self.groupContainerValueChanged(dataPath, propertyName, value);
                }));
            }
            j++;
        }
        return div;
    }

    PropertyGroupPanels.prototype.groupContainerValueChanged = function (dataPath, propertyName, value) {
        return this.changedValue(this.name, dataPath, propertyName, value);
    };

    function PropertyGroupContainer(property, aggregate, contentIndex, index, changedValueCallback) {
        var self = this;
        self.aggregate = aggregate;
        self.contentIndex = contentIndex;
        self.index = index;
        this.changedValue = changedValueCallback;
        var div = $('<div></div>');
        var editorTitle = new PropertyEditorTitle(property.name, function (name) {
            self.updateEditorContainer(name);
        });
        div.append(editorTitle);
        this.editorContainer = new PropertyEditorContainer(property, function (propertyName, value) {
            return self.editorContainerValueChanged(propertyName, value);
        });
        div.append(this.editorContainer);
        return div;
    }

    PropertyGroupContainer.prototype.editorContainerValueChanged = function (propertyName, value) {
        return this.changedValue(['content', this.contentIndex, this.aggregate, this.index], propertyName, value);
    };

    PropertyGroupContainer.prototype.updateEditorContainer = function (name) {
        name === 'extend' ? this.editorContainer.hide() : this.editorContainer.show();
    };

    function PropertyEditorTitle(name, changedEditorStatusCallback) {
        this.changedEditorStatus = changedEditorStatusCallback;
        return this.addEditorTitle(name);
    }

    PropertyEditorTitle.prototype.addEditorTitle = function (name) {
        var self = this;
        var label = $("<label>").text(name).css({
            font: "Bold 12pt Calibri"
        });
        self.triangleExtend = $("<div><div").css({
            width: "0",
            height: "0",
            "margin-right": "6px",
            "margin-bottom": "3px",
            "border-right": "8px solid rgba(0, 0, 0, 0.8)",
            "border-top": "8px solid transparent",
            display: "inline-block"
        }).attr('name', 'extend').click(function (event) {
            self.triangleCollapse.show();
            $(this).hide();
            var name1 = $(event.target).attr('name');
            self.changedEditorStatus(name1);
        });
        self.triangleCollapse = $("<div><div").css({
            width: "0",
            height: "0",
            "margin-right": "6px",
            "border-top": "5px solid transparent",
            "border-left": "8px solid rgba(0, 0, 0, 0.8)",
            "border-bottom": "5px solid transparent",
            display: "inline-block"
        }).attr('name', 'collapse').hide().click(function (event) {
            self.triangleExtend.show();
            $(this).hide();
            var name1 = $(event.target).attr('name');
            self.changedEditorStatus(name1);
        });
        return $('<p></p>').css({ margin: "2px 0px 0px 15px" }).append(self.triangleExtend).append(self.triangleCollapse).append(label);
    };
    PropertyEditorTitle.prototype.changedEditorStatus = function (name) {
        this.changedEditorStatus(name);
    };

    function PropertyEditorContainer(property, changedValueCallback) {
        var self = this;
        this.changedValue = changedValueCallback;
        var ul = $('<ul></ul>').css('padding-left', '30px');
        var EditorType = editorTypeMapping[property.type];
        this.editorType = new EditorType(ul, property.data, property.name, property.resources, function (propertyName, value) {
            return self.editorValueChanged(propertyName, value);
        });
        return ul;
    }

    PropertyEditorContainer.prototype.editorValueChanged = function (propertyName, value) {
        return this.changedValue('data' + '.' + propertyName, value);
    };

    function TextElementEditor(container, data, name, resources, textChangedCallback) {
        this.textChanged = textChangedCallback;
        var self = this;
        this.textEditor = new InputTextEditor(container, resources.textElement, function (text) {
            var result = self.textChanged(data.textTitle ? 'textTitle' : 'text', text);
            if (result) {
                self.updateUI(result);
            }
        });
        this.updateUI(data.textTitle || data.text);
    }

    TextElementEditor.prototype.updateUI = function (text) {
        this.textEditor.text = text;
        this.textEditor.updateValue();
    };

    function AxisCategoryEditor(container, data, name, resources, categoryTypeChangedCallback) {
        this.categoryTypeChanged = categoryTypeChangedCallback;
        var self = this;
        this.textText = resources.textText;
        this.dateText = resources.dateText;

        this.radiogroup = new RadioGroup(container, [this.textText, this.dateText], name, function (element) {
            return self.radioGroupSelectionChanged(element);
        });

        this.settingValueEditor = new AxisValueEditor(container, { maxValue: data.maxValue, minValue: data.minValue }, name, { maxValueText: resources.maxValueText, minValueText: resources.minValueText }, function (property, value) {
            return self.categoryTypeChanged(property, value);
        });
        this.updateUI(data);
    }

    AxisCategoryEditor.prototype.radioGroupSelectionChanged = function (value) {
        var result = this.categoryTypeChanged('categoryType', value.toLocaleLowerCase() === this.textText.toLocaleLowerCase() ? 1 : 2);
        if (result) {
            this.updateUI(result);
        }
    };

    AxisCategoryEditor.prototype.updateUI = function (data) {
        if (data.categoryType) {
            this.updateRadiogroup(data.categoryType);
        }
        this.updateSettingValueEditor(data);
    };

    AxisCategoryEditor.prototype.updateRadiogroup = function (categoryType) {
        var selectedItem;
        if (categoryType === 1) {
            selectedItem = this.textText;
        } else {
            selectedItem = this.dateText;
        }
        this.radiogroup.setSelectedItem(selectedItem);
    };

    AxisCategoryEditor.prototype.updateSettingValueEditor = function (data) {
        if (data.categoryType !== 1) {
            this.settingValueEditor.showEditor();
        } else {
            this.settingValueEditor.hideEditor();
        }
    };

    function AxisValueEditor(container, data, name, resources, valueChangedCallback) {
        this.valueChanged = valueChangedCallback;
        var self = this;
        var isShowAuto = true;
        if (resources.majorUnitText || resources.minorUnitText) {
            this.majorUnitEditor = new InputTextEditor(container, resources.majorUnitText, function (num) {
                if (num !== null && num !== undefined) {
                    num = Number(num);
                }
                var majorNum = self.valueChanged('majorUnit', num);
                self.updateMajorUI(majorNum);
            }, isShowAuto);
            this.minorUnitEditor = new InputTextEditor(container, resources.minorUnitText, function (num) {
                if (num !== null && num !== undefined) {
                    num = Number(num);
                }
                var minorNum = self.valueChanged('minorUnit', num);
                self.updateMinorUI(minorNum);
            }, isShowAuto);
            this.updateMajorUI(data.majorUnit);
            this.updateMinorUI(data.minorUnit);
        }
        this.maxValueEditor = new InputTextEditor(container, resources.maxValueText, function (num) {
            var majorNum = self.valueChanged('max', num);
            self.updateMaxUI(majorNum);
        }, isShowAuto);
        this.minValueEditor = new InputTextEditor(container, resources.minValueText, function (num) {
            var minorNum = self.valueChanged('min', num);
            self.updateMinUI(minorNum);
        }, isShowAuto);
        this.updateMaxUI(data.maxValue);
        this.updateMinUI(data.minValue);
    }

    AxisValueEditor.prototype.updateMajorUI = function (value) {
        this.majorUnitEditor.text = value;
        this.majorUnitEditor.updateValue();
    };

    AxisValueEditor.prototype.updateMinorUI = function (value) {
        this.minorUnitEditor.text = value;
        this.minorUnitEditor.updateValue();
    };

    AxisValueEditor.prototype.updateMaxUI = function (value) {
        this.maxValueEditor.text = value;
        this.maxValueEditor.updateValue();
    };

    AxisValueEditor.prototype.updateMinUI = function (value) {
        this.minValueEditor.text = value;
        this.minValueEditor.updateValue();
    };

    AxisValueEditor.prototype.showEditor = function () {
        this.minValueEditor.domInput.show();
        this.maxValueEditor.domInput.show();
    };

    AxisValueEditor.prototype.hideEditor = function () {
        this.minValueEditor.domInput.hide();
        this.maxValueEditor.domInput.hide();
    };

    function TickEditor(container, data, name, resources, tickChangedCallback) {
        this.changedTickOption = tickChangedCallback;
        var self = this;
        this.majorText = resources.majorText;
        this.minorText = resources.minorText;
        var tickCollection1 = [
            designer.res.chartSliderPanel.tick.cross,
            designer.res.chartSliderPanel.tick.inside,
            designer.res.chartSliderPanel.tick.none,
            designer.res.chartSliderPanel.tick.outSide
        ];
        var tickCollection2 = {};
        tickCollection2[designer.res.chartSliderPanel.tick.cross] = 0;
        tickCollection2[designer.res.chartSliderPanel.tick.inside] = 1;
        tickCollection2[designer.res.chartSliderPanel.tick.none] = 2;
        tickCollection2[designer.res.chartSliderPanel.tick.outSide] = 3;
        this.tickCollection1 = tickCollection1;

        this.dropEditor1 = new DropEditor(container, tickCollection1[data.majorTickPosition], 'majorTickPosition', this.majorText, tickCollection1, function (value) {
            return self.tickCollection1[self.changedTickOption('majorTickPosition', tickCollection2[value])];
        });

        this.dropEditor2 = new DropEditor(container, tickCollection1[data.minorTickPosition], 'minorTickPosition', this.minorText, tickCollection1, function (value) {
            return self.tickCollection1[self.changedTickOption('minorTickPosition', tickCollection2[value])];
        });
    }

    var fontFamiliesText = designer.res.ribbon.fontFamilies;
    var fontFamilyCollection = [
        fontFamiliesText.ff1.name,
        fontFamiliesText.ff2.name,
        fontFamiliesText.ff3.name,
        fontFamiliesText.ff4.name,
        fontFamiliesText.ff5.name,
        fontFamiliesText.ff6.name,
        fontFamiliesText.ff7.name,
        fontFamiliesText.ff8.name,
        fontFamiliesText.ff9.name,
        fontFamiliesText.ff10.name,
        fontFamiliesText.ff11.name,
        fontFamiliesText.ff12.name,
        fontFamiliesText.ff13.name,
        fontFamiliesText.ff14.name,
        fontFamiliesText.ff15.name,
        fontFamiliesText.ff16.name,
        fontFamiliesText.ff17.name,
        fontFamiliesText.ff18.name,
        fontFamiliesText.ff19.name,
        fontFamiliesText.ff20.name,
        fontFamiliesText.ff21.name,
        fontFamiliesText.ff22.name,
        fontFamiliesText.ff23.name
    ];
    var fontSizeCollection = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 26, 28, 36, 48, 72];

    function FontEditor(container, data, name, resources, fontChangedCallback) {
        this.changedFontOption = fontChangedCallback;
        var self = this;
        this.fontFamily = resources.fontFamily;
        this.fontSize = resources.fontSize;
        var fontSize = Math.round(Number(data.fontSize) * 3 / 4) || Math.round(Number(data.fontSizeTitle) * 3 / 4);
        this.dropEditor1 = new DropEditor(container, fontSize, 'fontSize', this.fontSize, fontSizeCollection, function (value) {
            return self.changedFontOption(data.fontSize ? 'fontSize' : 'fontSizeTitle', value * 4 / 3) * 3 / 4;
        });
        this.dropEditor2 = new DropEditor(container, data.fontFamily || data.fontFamilyTitle, 'fontFamily', this.fontFamily, fontFamilyCollection, function (value) {
            return self.changedFontOption(data.fontFamily ? 'fontFamily' : 'fontFamilyTitle', value);
        });
    }

    function DropEditor(container, data, name, text, collection, listChangedCallback) {
        var self = this;
        self.listChanged = listChangedCallback;

        var li = $('<li></li>').css({
            'margin': '4px 1px',
            "list-style-type": 'none',
            "line-height": "28px"
        }).append($('<lable></lable>').css({ 'margin-left': '6px' }).text(text));
        this.defauleItem = this._createDefaultElement(name);
        li.append(this.defauleItem).appendTo(container);
        this.itemsList = new ItemsList(collection, name, function (element) {
            self.changedValue(element);
        });
        li.append(this.itemsList);
        this.updateUI(data);
    }

    DropEditor.prototype._createDefaultElement = function (name) {
        var self = this;
        var button = $('<button></button>').addClass('ui-button ui-widget ui-state-default ui-button-text-icon-secondary ui-corner-left').addClass('chart-format-panel-drop-default-button-' + name);
        var span1 = $('<span></span>').addClass('panel-button-text').addClass('chart-format-panel-drop-default-span-' + name);
        var span2 = $('<span></span>').addClass('ui-button-icon-secondary ui-icon ui-icon-triangle-1-s');
        button.append(span1).append(span2);
        button.click(function () {
            if (!self.itemsList) {
                return;
            }
            self.itemsList.gcuipopup("show", {
                of: $(this),
                my: 'left+' + '0' + ' top+' + '22',
                at: 'left top'
            });
        });
        return button;
    };

    DropEditor.prototype.changedValue = function (value) {
        var result = this.listChanged(value);
        if (result) {
            this.updateUI(result);
        }
    };

    DropEditor.prototype.updateUI = function (value) {
        $('span:first', this.defauleItem).text(value);
    };

    function ItemsList(items, name, updateSelectedElementCallback) {
        var self = this;
        self.updateSelectedElement = updateSelectedElementCallback;
        self.selectedElementListDom = self.addItems(items, name);
        return self.selectedElementListDom;
    }

    ItemsList.prototype.addItems = function (items, name) {
        var self = this;
        var ul = $('<ul></ul>').css({
            background: "white",
            "z-index": "10",
            "padding-left": "0px"
        });
        items.forEach(function (item) {
            var li = $('<li></li>').attr('name', item).append($('<label></label>').text(item).css({ "margin-left": "2px" })).css({
                "list-style-type": 'none',
                "line-height": "25px"
            });
            li.click(function (event) {
                var name1 = $(event.currentTarget).attr('name');
                self.changedSelectedElement(name1);
            }).mouseenter(function () {
                $(this).css("background", "#DBDBDB");
            }).mouseleave(function () {
                $(this).css("background", "white");
            });
            ul.append(li);
        });
        var dropListPopup = $('<div></div>').addClass('chart-format-panel-drop-list-common chart-format-panel-drop-list-' + name).append(ul);
        dropListPopup.gcuipopup({
            autoHide: true
        });
        return dropListPopup;
    };

    ItemsList.prototype.changedSelectedElement = function (name) {
        this.updateSelectedElement(name);
        this.selectedElementListDom.hide();
    };

    function LegendPositionEditor(container, data, name, resources, legendPositionChangedCallbck) {
        this.changedPosition = legendPositionChangedCallbck;
        var self = this;
        this.topText = resources.topText;
        this.bottomText = resources.bottomText;
        this.leftText = resources.leftText;
        this.rightText = resources.rightText;
        this.radiogroup = new RadioGroup(container, [this.topText, this.bottomText, this.leftText, this.rightText], name, function (element) {
            self.radioGroupSelectionChanged(element);
        });
        this.updateUI(data.position);
    }

    LegendPositionEditor.prototype.radioGroupSelectionChanged = function (value) {
        var result = this.changedPosition('position', value);
        if (result) {
            this.updateUI(result);
        }
    };

    LegendPositionEditor.prototype.updateUI = function (position) {
        var selectedItems = [, this.topText, this.rightText, this.leftText, this.bottomText];
        this.radiogroup.setSelectedItem(selectedItems[position]);
    };

    function TextFillEditor(container, data, name, resources, textColorChangedCallback) {
        this.colorChanged = textColorChangedCallback;
        var self = this;
        this.colorEditor = new ColorEditor(container, data.color || data.colorTitle, name, {
            noColorText: resources.noColorText,
            solidColorText: resources.solidColorText,
        }, function (color) {
            return self.colorChanged(data.color ? 'color' : 'colorTitle', color);
        });
    }

    function SizeEditor(container, data, name, resources, sizeChangeCallback) {
        var self = this;
        self.sizeChanged = sizeChangeCallback;
        this.widthEditor = new InputNumberEditor(container, resources.widthText, /*{min: 0, max: 3, type: int}, data.borderWidth, */function (width) {
            if (self.sizeChanged('width', width)) {
                self.updateWidthUI(data.width);
            }
        });

        this.heightEditor = new InputNumberEditor(container, resources.heightText, /*{min: 0, max: 3, type: int}, data.borderWidth, */function (height) {
            if (self.sizeChanged('height', height)) {
                self.updateHeightUI(data.height);
            }
        });
        self.updateWidthUI(data.width);
        self.updateHeightUI(data.height);
        designer.wrapper.spread.getActiveSheet().bind(GC.Spread.Sheets.Events.FloatingObjectChanged, function (e, info) {
            var width = info.floatingObject.width();
            var height = info.floatingObject.height();
            if (data.width !== width || data.height !== height) {
                self.updateWidthUI(width);
                self.updateHeightUI(height);
            }
        });
    }

    SizeEditor.prototype.updateWidthUI = function (value) {
        this.widthEditor.value = value;
        this.widthEditor.updateValue();
    };
    SizeEditor.prototype.updateHeightUI = function (value) {
        this.heightEditor.value = value;
        this.heightEditor.updateValue();
    };

    function LineEditor(container, data, name, resources, borderChangedCallback) {
        BorderEditor.call(this, container, data, name, resources, borderChangedCallback);
    }

    LineEditor.prototype = BorderEditor.prototype;
    LineEditor.prototype.constructor = BorderEditor;

    function SeriesEditor(container, data, name, resources, seriesOptionsChangedCallback) {
        var self = this;
        self.seriesOptionsChanged = seriesOptionsChangedCallback;
        this.primaryAxisText = resources.primaryAxisText;
        this.secondaryAxisText = resources.secondaryAxisText;
        this.radiogroup = new RadioGroup(container, [this.primaryAxisText, this.secondaryAxisText], name, function (element) {
            self.radioGroupSelectionChanged(element);
        });
        this.updateUI(data.axisGroup);
    }

    SeriesEditor.prototype.radioGroupSelectionChanged = function (value) {
        var result = this.seriesOptionsChanged('axisGroup', value.toLocaleLowerCase() === designer.res.chartSliderPanel.secondaryAxis.toLocaleLowerCase() ? 1 : 0);
        if (result === 0 || result === 1) {
            this.updateUI(result);
        }
    };
    SeriesEditor.prototype.updateUI = function (axis) {
        var selectedItem = axis ? this.secondaryAxisText : this.primaryAxisText;
        this.radiogroup.setSelectedItem(selectedItem);
    };

    function FillColorEditor(container, data, name, resources, colorChangedCallback) {
        this.colorChanged = colorChangedCallback;
        var self = this;
        this.colorEditor = new ColorEditor(container, data.backColor, name, {
            noColorText: resources.noColorText,
            solidColorText: resources.solidColorText,
            automaticColorText: resources.automaticColorText
        }, function (color) {
            return self.colorChanged('backColor', color);
        });
    }

    function ColorEditor(container, color, name, resources, changedValueCallback) {
        this.changedValue = changedValueCallback;
        var self = this;
        this.noColorText = resources.noColorText;
        this.solidColorText = resources.solidColorText;
        this.automaticColorText = resources.automaticColorText;
        this.radiogroup = new RadioGroup(container, [this.noColorText, this.solidColorText, this.automaticColorText], name, function (element) {
            return self.radioGroupSelectionChanged(element);
        });
        this.colorpicker = new ColorPicker(container, function (value) {
            self.colorPicked(value);
        });
        this.updateUI(color);
    }

    ColorEditor.prototype.radioGroupSelectionChanged = function (selectedItem) {
        var result;
        if (selectedItem === (this.noColorText && this.noColorText.toLocaleLowerCase())) {
            result = this.changedValue('rgba(0,0,0,0)');
            if (result) {
                this.updateUI(result);
            }
        } else if (selectedItem === (this.automaticColorText && this.automaticColorText.toLocaleLowerCase())) {
            result = this.changedValue(designer.res.chartSliderPanel.automatic);
            if (result) {
                this.updateUI(result);
            }
        } else {
            result = this.changedValue(this.colorpicker.color);
            if (result) {
                this.updateUI(result);
            }
        }
    };
    ColorEditor.prototype.colorPicked = function (color) {
        var result = this.changedValue(color);
        if (result) {
            this.updateUI(result);
        }
    };
    ColorEditor.prototype.updateUI = function (color) {
        if (color) {
            this.updateRadiogroup(color.text || color.color || color);
        } else {
            this.updateRadiogroup(keyword_undefined);
        }
        if (color) {
            this.updateColorPicker(color.color || color);
        } else {
            this.updateColorPicker(keyword_undefined);
        }

    };
    ColorEditor.prototype.updateRadiogroup = function (color) {
        var selectedItem;
        if (color.toLocaleLowerCase() === designer.res.chartSliderPanel.automatic.toLocaleLowerCase()) {
            selectedItem = this.automaticColorText;
        } else {
            var convertColor = colorIsNotEqual(color);
            var judgeColorString = color;
            var judgeConvertColorString = convertColor;
            while (judgeColorString.indexOf(' ') !== -1) {
                judgeColorString = judgeColorString.replace(' ', '');
            }
            while (judgeConvertColorString.indexOf(' ') !== -1) {
                judgeConvertColorString = judgeConvertColorString.replace(' ', '');
            }
            if (judgeConvertColorString === true) {
                selectedItem = this.automaticColorText;
            } else if (!color || color === 'rgba(0,0,0,0)' || judgeConvertColorString === 'rgba(0,0,0,0)') {
                selectedItem = this.noColorText;
            } else {
                selectedItem = this.solidColorText;
            }
        }
        this.radiogroup.setSelectedItem(selectedItem);
    };
    function colorIsNotEqual(color) {
        var colorArray = chartHelper.getPieColorArray(color);
        var color1 = ColorHelper.parse(colorArray[0], designer.wrapper.spread.getActiveSheet().currentTheme()).color;

        if (colorArray.length > 1) {
            var colorNext, colorPreview;
            for (var i = 1; i < colorArray.length - 1; i++) {
                colorNext = ColorHelper.parse(colorArray[i], designer.wrapper.spread.getActiveSheet().currentTheme()).color;
                colorPreview = ColorHelper.parse(colorArray[i - 1], designer.wrapper.spread.getActiveSheet().currentTheme()).color;
                if (colorNext !== colorPreview) {
                    return true;
                }
            }
            colorNext = ColorHelper.parse(colorArray[colorArray.length - 1], designer.wrapper.spread.getActiveSheet().currentTheme()).color;
            colorPreview = ColorHelper.parse(colorArray[colorArray.length - 2], designer.wrapper.spread.getActiveSheet().currentTheme()).color;
            if (colorNext !== colorPreview) {
                return true;
            }
            return color1;
        }
        return color1;
    }

    ColorEditor.prototype.updateColorPicker = function (color) {
        var convertColor = colorIsNotEqual(color);
        var judgeColorString = color;
        var judgeConvertColorString = convertColor;
        while (judgeColorString.indexOf(' ') !== -1) {
            judgeColorString = judgeColorString.replace(' ', '');
        }
        while (judgeConvertColorString !== true && judgeConvertColorString.indexOf(' ') !== -1) {
            judgeConvertColorString = judgeConvertColorString.replace(' ', '');
        }
        if (judgeColorString && judgeColorString !== 'rgba(0,0,0,0)' && judgeConvertColorString !== true && judgeConvertColorString !== 'rgba(0,0,0,0)') {
            this.colorpicker.showColorPicker();
            this.colorpicker.color = convertColor || color;
            this.colorpicker.updateColor();
        } else {
            this.colorpicker.hideColorPicker();
        }
    };
    function BorderEditor(container, data, name, resources, borderChangedCallback) {
        this.borderChanged = borderChangedCallback;
        var self = this;
        this.colorEditor = new ColorEditor(container, data.majorGridLineColor || data.minorGridLineColor || data.borderColor, name, {
            noColorText: resources.noColorText,
            solidColorText: resources.solidColorText,
            automaticColorText: resources.automaticColorText
        }, function (color) {
            var colorStr = data.minorGridLineColor ? 'minorGridLineColor' : 'borderColor';
            return self.borderChanged(data.majorGridLineColor ? 'majorGridLineColor' : colorStr, color);
        });
        if ((data.borderWidth === null || data.borderWidth === keyword_undefined) && !data.majorGridLineWidth && !data.minorGridLineWidth) {
            return;
        }
        this.widthEditor = new InputNumberEditor(container, resources.widthText, /*{min: 0, max: 3, type: int}, data.borderWidth, */function (width) {
            var widthStr = data.minorGridLineWidth ? 'minorGridLineWidth' : 'borderWidth';
            var result = self.borderChanged(data.majorGridLineWidth ? 'majorGridLineWidth' : widthStr, width);
            if (result) {
                self.updateUI(result);
            }
        });
        this.updateUI(data.majorGridLineWidth || data.minorGridLineWidth || data.borderWidth);
    }

    BorderEditor.prototype.updateUI = function (width) {
        this.widthEditor.value = width;
        this.widthEditor.updateValue();
    };
    function InputNumberEditor(container, title, valueChangedCallback) {
        this.valueChanged = valueChangedCallback;
        this.domInput = this.addInputNumberEditor(title);
        container.append(this.domInput);
    }

    InputNumberEditor.prototype.addInputNumberEditor = function (title) {
        var self = this;
        this.value = 0;

        var span = $('<span></span>').addClass('ui-spinner ui-widget ui-widget-content ui-corner-all').css({
            "width": "85px",
            "float": "right",
            "margin-right": "3px",
            "height": "23px"
        });
        var input = $('<input />', { type: 'input' }).addClass('label-top-padding numeric column1 ui-spinner-input').css({
            "position": "absolute",
            "left": "1px",
            "top": "1px"
        }).change(function (event) {
            self.valueChanged(Number($(event.target).val()));
        });
        var aTop = $('<a />').addClass('ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only').append($('<div></div>').css({
            width: "0",
            height: "0",
            "margin-left": "-1px",
            "margin-bottom": "3px",
            "border-left": "4px solid transparent",
            "border-right": "4px solid transparent",
            "border-bottom": "6px solid rgba(0, 0, 0, 0.4)",
            display: "inline-block"
        })).click(function (event) {
            var value = Number($(input).val());
            value = value + 1;
            $(input).val(value);
            self.valueChanged(value);
        });

        var aBottom = $('<a />').addClass('ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only').append($('<div></div>').css({
            width: "0",
            height: "0",
            "margin-left": "-1px",
            "margin-top": "3px",
            "border-width": "6px 4px 6px",
            "border-style": "solid",
            "border-color": "rgba(0, 0, 0, 0.4) transparent transparent",
            display: "inline-block"
        })).click(function (event) {
            var value = Number($(input).val());
            value = (value - 1) < 0 ? 0 : (value - 1);
            $(input).val(value);
            self.valueChanged(value);
        });
        span.append(input).append(aTop).append(aBottom);

        var label = $('<label></label>').css({ "margin-left": "6px" }).text(title);
        return $('<li></li>').append(label).append(span).css({
            "margin": "1px",
            "list-style-type": "none",
            "line-height": "25px"
        });
    };

    InputNumberEditor.prototype.updateValue = function () {
        $('input', this.domInput).val(this.value);
    };

    function InputTextEditor(container, title, valueChangedCallback, isShowAuto) {
        this.valueChanged = valueChangedCallback;
        this.isShowAuto = isShowAuto || false;
        this.domInput = this.addInputTextEditor(title);
        container.append(this.domInput);
    }

    InputTextEditor.prototype.addInputTextEditor = function (title) {
        var self = this;
        this.text = '';
        var input;
        if (this.isShowAuto) {
            this.autoDescLabel = $('<div></div>').addClass('input-auto-desc').text('Auto');
            this.resetBtn = $('<div></div>').addClass('input-reset-btn').text('Reset').click(function () {
                self.valueChanged(null);
            });
            input = $('<input />', { type: 'input' }).addClass('input-number-editor-auto').change(function (event) {
                self.valueChanged($(event.target).val());
            });
        } else {
            input = $('<input />', { type: 'input' }).addClass('input-number-editor').change(function (event) {
                self.valueChanged($(event.target).val());
            });
        }
        var label = $('<label></label>').css({ "margin-left": "6px", "float": "left", "width": "70px" }).text(title);
        return $('<li></li>').append(label).append(input).append(this.resetBtn).append(this.autoDescLabel).css({
            "margin": "1px",
            "list-style-type": "none",
            "line-height": "28px",
            "height": "28px"
        });
    };

    InputTextEditor.prototype.updateValue = function () {
        if (this.isShowAuto) {
            if (this.text === undefined || this.text === null) {
                this.resetBtn.css({ "display": "none" });
                this.autoDescLabel.css({ "display": "inline-block" });
            } else {
                this.autoDescLabel.css({ "display": "none" });
                this.resetBtn.css({ "display": "inline-block" });
            }
        }
        $('input', this.domInput).val(this.text);
    };

    function RadioGroup(container, items, name, radioGroupSelectedItemCallback) {
        var self = this;
        self.updateRaidoSelectedItem = radioGroupSelectedItemCallback;
        self.domRadio = container;
        items.forEach(function (item) {
            if (item) {
                container.append(self.addRadioItem(name, item));
            }
        });
    }

    RadioGroup.prototype.addRadioItem = function (name, title) {
        var self = this;
        var radioItem = _createRadioItem(name, title);
        $(radioItem.children()[0]).click(function (event) {
            self.updateRaidoSelectedItem($(event.currentTarget).data('name'));
        });
        return radioItem;
    };

    RadioGroup.prototype.setSelectedItem = function (selectedElement) {
        var dataName = selectedElement.toLocaleLowerCase();
        $("[data-name='" + dataName + "']", this.domRadio).prop('checked', true);
    };

    function _createRadioItem(name, title) {
        var radio = $('<input />', {
            type: 'radio',
            name: name
        }).attr('data-name', _buildRadioDataName(title)).attr('id', _buildRadioDataName(title));
        var label = $('<label></label>').text(title).attr('for', _buildRadioDataName(title));

        var span = $('<span></span>').append(radio).append(label).attr('data-name', _buildRadioDataName(title)).attr('id', _buildRadioDataName(title));
        return $('<li></li>').append(span).css({
            "list-style-type": "none",
            "line-height": "25px"
        });
    }

    function ColorPicker(container, colorChangedCallback) {
        this.colorChanged = colorChangedCallback;
        this.domColor = this.createColorElement();
        container.append(this.domColor);
    }

    ColorPicker.prototype.createColorElement = function (name) {
        var self = this;
        self.color = defaultColor || 'transparent';

        var container = $('<div></div>').css({
            "width": "143px",
            "margin": "3px",
            "float": "right",
            "display": "inline-block"
        });
        var content = $('<span></span>').appendTo(container);
        $('<span></span>').addClass('color-picker-span').appendTo(content);
        var popup = $('<div></div>').appendTo(container);
        if (!self._colorPicker) {
            self._colorPicker = $('<div></div>').addClass('forecolor-picker').colorpicker({
                valueChanged: function (es, value) {
                    self.colorChanged(value.name || value.color);
                },
                choosedColor: function (es, value) {
                    container.comboframe('close');
                },
                openColorDialog: function (es, value) {
                    container.comboframe('close');
                },
                showNoFill: false,
                themeColors: designer.wrapper.getThemeColors()
            }).appendTo(popup);
        }
        popup.gcuipopup({
            autoHide: true,
            showing: function (e, args) {
                var colorPicker = self._colorPicker;
                colorPicker.colorpicker("option", "value", self.color);
                colorPicker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            }
        });

        container.comboframe().click(function () {
            container.comboframe('open');
        });
        var label = $('<label></label>').css({ "margin-left": "6px" }).text(designer.res.chartSliderPanel.color);
        return $('<li></li>').append(label).append(container).addClass('format-chart-panel-color').hide();
    };

    ColorPicker.prototype.colorChanged = function (e, value) {
        this.colorChanged(e.target, value); //color
    };

    ColorPicker.prototype.showColorPicker = function () {
        this.domColor.show();
    };

    ColorPicker.prototype.hideColorPicker = function () {
        this.domColor.hide();
    };

    ColorPicker.prototype.updateColor = function () {
        $('.color-picker-span', this.domColor).css({ 'background-color': this.color });
    };

    function InitSelectedElementEditor(elements, updateSelectedElementCallback) {
        this.updateSelectedElement = updateSelectedElementCallback;
        this.selectedElementListDom = this.createSlectedElementEditor(elements);
        return this.selectedElementListDom;
    }

    InitSelectedElementEditor.prototype.createSlectedElementEditor = function (elements) {
        var self = this;
        var ul = $('<ul></ul>').addClass('chart-selected-element');

        var ulpopup = $('<div>').addClass("select-element-popup").append(ul);
        ulpopup.gcuipopup({
            autoHide: true
        });

        elements.elements.forEach(function (ele) {
            var li = $('<li></li>').attr('data-name', ele.selectedElement).append($('<label></label>').text(ele.text).css({ "margin-left": "2px" })).css({
                "list-style-type": 'none',
                "line-height": "25px",
                "text-overflow": "ellipsis",
                "white-space": "nowrap",
                "overflow": "hidden",
                "width": "220px"
            });

            var color = 'white';
            li.click(function (event) {
                var name = $(event.currentTarget).attr('data-name');
                self.changedSlectedElement(name);
            }).mouseenter(function () {
                color = $(this).css('background-color');
                $(this).css("background", "#cfeadb");
            }).mouseleave(function () {
                $(this).css("background", color);
                var nodes = this.parentElement.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i] !== this && $('<div></div>').css('background', color).css('background-color') === $(nodes[i]).css('background-color') && color !== 'rgba(0, 0, 0, 0)') {
                        $(nodes[i]).css('background', 'white');
                    }
                }
            });
            ul.append(li);
        });
        return ulpopup;
    };

    InitSelectedElementEditor.prototype.changedSlectedElement = function (selectedElement) {
        this.updateSelectedElement(selectedElement);
        this.selectedElementListDom.hide();
    };

    function InitSelectedChartElement(elements, updateSelectedChartElementCallback) {
        var self = this;
        this.selectedElementsText = [];
        this.updateSelectedChartElement = updateSelectedChartElementCallback;
        this.selectedElement = this.createSelectedChartElement(elements);
        elements.elements.forEach(function (ele) {
            self.selectedElementsText.push({ key: ele.selectedElement, text: ele.element });
        });
        return this.selectedElement;
    }

    InitSelectedChartElement.prototype.createSelectedChartElement = function (elements) {
        var self = this;
        self.elements = elements;
        var triangle = $("<div><div").addClass('triangle-chart-selected-element').attr('name', 'triangle-chart').click(function (event) {

            if (event.target === event.currentTarget) {
                if (!($(event.target).children()[0])) {
                    return;
                }
                var element = self.selectedItem || self.elements.currentElement.item;
                if (self.element === element) {
                    self.element = keyword_undefined;

                } else {
                    var nodes = $('.select-element-popup', $(event.target)).children()[0].children;
                    for (var i = 0; i < nodes.length; i++) {
                        $(nodes[i]).css("background", 'white');
                    }
                    $("[data-name='" + element + "']", $(event.target.children[0])).css("background", "#92d3af");
                    $('.select-element-popup', $(event.target)).gcuipopup("show", {
                        of: $(".this-class"),
                        my: 'left+' + '6' + ' top+' + '22',
                        at: 'left top'
                    });
                    self.element = element;
                }
            }
        });

        triangle.append(new InitSelectedElementEditor(elements, function (selectedElement) {
            self.selectedItem = selectedElement;
            self.changedSelectedChartElement(selectedElement);
        }));

        return $('<div></div>').css({
            "color": "rgba(0, 0, 0, 0.7)",
            "height": '25px'
        }).append($("<div>").addClass('this-class').css({
            padding: "2px 15px"
        }).append($("<label>").text(elements.currentElement.element).css({
            "font-weight": "bold",
            "font-size": "10pt"
        })).append(triangle));
    };
    InitSelectedChartElement.prototype.changedSelectedChartElement = function (selectedElement) {
        var elements = this.selectedElementsText;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].key === selectedElement) {
                this.updateSelectedChartElementText(elements[i].text);
                break;
            }
        }
        this.updateSelectedChartElement(selectedElement);
    };
    InitSelectedChartElement.prototype.updateSelectedChartElementText = function (text) {
        $('label:first', this.selectedElement).text(text);
    };

    function initSliderPanelHeader(sliderPanelContainer, dataManager) {
        var sliderPanelHeader = $("<div>").css({
            "color": "rgba(0, 0, 0, 0.8)",
            "height": "40px"
        }).appendTo(sliderPanelContainer);
        var title = dataManager.getHeaderData().title;
        sliderPanelHeader.children().remove();
        var mainHeader = $("<div>").css({
            padding: "0px 10px",
            "padding-top": "10px"
        }).appendTo(sliderPanelHeader);
        $("<label>").text(title).css({
            "font-size": "17pt",
            "font-weight": "lighter",
            color: "#08892c"
        }).appendTo(mainHeader);
        $("<span>").addClass('slider-panel-close-button').appendTo(mainHeader).click(closeSlidePanel);
    }

    function initSliderPanelContent(sliderPanelContainer, dataManager) {
        var sliderPanelContent = $("<div>").css({
            "width": "100%",
            "position": "absolute",
            "top": "40px",
            "bottom": "0"
        }).addClass("slider-panel-content").appendTo(sliderPanelContainer);
        return new ChartPanelContainer(sliderPanelContent, dataManager); // NOSONAR
    }

    function ChartPanelContainer(container, dataManager) {
        var self = this;
        this.owner = dataManager;
        this.container = container;
        this.container.append(new InitSelectedChartElement(this.owner.getElements(), function (selectedElement) {
            self.updateChartPanelTab(selectedElement);
        }));
        this.initChartPanelContent();
    }

    ChartPanelContainer.prototype.initChartPanelContent = function () {
        var datas = this.owner.getDatas();
        this.chartPanelContentDom = new PropertyTabPanel(datas, this.owner);
        this.container.append(this.chartPanelContentDom);
    };
    ChartPanelContainer.prototype.updateChartPanelTab = function (selectedElement) {
        this.owner._selectedItem = selectedElement;
        this.chartPanelContentDom.remove();
        this.initChartPanelContent();
    };

    function updateSliderPanelUI(sliderPanel, dataManager) {
        sliderPanel.sliderpanel();
        var sliderPanelContainer = sliderPanel.sliderpanel("getContainer", "panel2");
        sliderPanelContainer.children().remove();

        initSliderPanelHeader(sliderPanelContainer, dataManager);
        initSliderPanelContent(sliderPanelContainer, dataManager);
    }

    var sliderPanelDataManager;

    function showSliderPanel(chart, sliderPanel, chartData) {
        sliderPanelDataManager.setCurrentChart(chart);
        sliderPanelDataManager.setAllData(chartData.data);
        sliderPanelDataManager.setSelectedElement(chartData.selectedElement);
        sliderPanelDataManager.setChartCategories(chartData.categories);

        updateSliderPanelUI(sliderPanel, sliderPanelDataManager);
    }

    function makeChartData(chart, selectedElement, categories) {
        var chartDataObject = {
            chart: chart,
            selectedElement: selectedElement,
            data: {},
            categories: categories
        };
        getSeriesData(chart, chartDataObject.data, categories);
        // getPlotAreaData(chart, chartDataObject.data);
        getLegendData(chart, chartDataObject.data);
        getLabelData(chart, chartDataObject.data);
        getChartTitleData(chart, chartDataObject.data);
        getChartAreaData(chart, chartDataObject.data);
        getAxisData(chart, chartDataObject.data);
        return chartDataObject;
    }

    function initChartSliderPanel(chart, chartElement, selectedItem, category) {
        var sliderPanel = $(".slider-panel");

        sliderPanelDataManager = new SliderPanelDataManager();

        updateSliderPanel(chart, chartElement, selectedItem, category || chartHelper.getChartSeriesNames(chart), sliderPanel);

        sliderPanel.sliderpanel("open", "panel2");
    }

    function refreshSliderPanel(chart) {
        var sliderPanel = $(".slider-panel");
        if (!sliderPanelDataManager || !(sliderPanel.is(':visible'))) {
            return;
        }
        var chartData = makeChartData(chart, {
            chartElement: sliderPanelDataManager._selectedElement,
            selectedItem: sliderPanelDataManager._selectedItem
        }, sliderPanelDataManager._categories);

        updateSelectedElement(chartData);
        showSliderPanel(chart, sliderPanel, chartData);
    }

    function updateSelectedElement(chartData) {
        for (var i in chartData.data) {
            if (i.toString() === chartData.selectedElement.selectedItem) {
                return;
            }
        }
        chartData.selectedElement.selectedItem = 'chartArea';
        chartData.selectedElement.chartElement = 'chartArea'; // if seletectedItem exist, it's is display, if not, will select ''
    }

    function updateSliderPanel(chart, chartElement, selectedItem, category, sliderPanel) {
        var chartData = makeChartData(chart, {
            chartElement: chartElement,
            selectedItem: selectedItem
        }, category);

        updateSelectedElement(chartData);

        showSliderPanel(chart, sliderPanel, chartData);
    }

    designer.chartSliderPanel = {
        initChartSliderPanel: initChartSliderPanel,
        refreshSliderPanel: refreshSliderPanel,
    };
})();
