(function () {
    'use strict';

    var keyword_undefined = void 0, keyword_null = null;
    var Sheets = GC.Spread.Sheets;
    var designer = Sheets.Designer;

    var FormatDialog = (function (_super) {
        designer.extends(FormatDialog, _super);

        function FormatDialog() {
            _super.call(this, designer.util.resolveHtmlPath('../formatDialog', 'formatDialog.html'), '.format-dialog');
            FormatDialog._currentID++;
        }

        var cultureNameToIdMap = {
            "zh-cn": "804",
            "ja-jp": "411"
        };

        FormatDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.formatDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            if (self._setFormatDirectly || self._setFormatDirectly === undefined) {
                                self._ok();
                            } else {
                                var args;
                                if (self._defaultBorderType) {
                                    args = self._cacheStyle.result();
                                } else {
                                    args = self._returnFormat();
                                }
                                $(self).trigger("okClicked", args);//
                                self._refreshSlicerData();
                            }
                            self.close();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.cancel();
                            self.close();
                        }
                    }
                ]
            };
        };

        FormatDialog.prototype._refreshSlicerData = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var row = sheet.getActiveRowIndex(),
                col = sheet.getActiveColumnIndex();
            var table = sheet.tables.find(row, col);
            if (table) {
                var slicerData = table.getSlicerData();
                slicerData && slicerData.refresh();
            }
        };

        FormatDialog.prototype._ok = function () {
            var self = this;
            var styleInfo = self._cacheStyle.result();
            var fontInfo = {
                fontFamily: self._fontFamily,
                fontSize: self._fontSize,
                fontStyle: self._fontStyle,
                fontWeight: self._fontWeight
            };
            var borderInfo;
            if (self._borderColor !== undefined || self._lineStyle !== undefined) {
                borderInfo = {
                    orignalBorder: self._orignalBorder,
                    borderType: self._getBorderType()
                };
            }
            var mergeInfo = {
                merged: self._merged
            };
            designer.actions.doAction('baseDialogCommand', designer.wrapper.spread, {
                value: {
                    styleInfo: styleInfo,
                    fontInfo: fontInfo,
                    borderInfo: borderInfo,
                    mergeInfo: mergeInfo
                },
                execute: designer.spreadActions.dialogAction.formatDialogApplySetting
            });
            self._updateCustomFormatter();
        };

        FormatDialog.prototype._beforeOpen = function (args) {
            var index = 0;
            args = args || [];
            if (args !== undefined && args.length > 0) {
                designer.util.assert(typeof args[0] === 'string');
                index = FormatDialog.getTabIndexById(args[0]);
            }
            if (args[1] !== undefined) {
                this._element.find('.font-picker').fontpicker('option', 'customFontStyle', args[1]);
            }
            if (args[2] !== undefined) {
                this._cacheStyle = new designer.StyleShadowObject(args[2]);
            } else {
                this._cacheStyle = new designer.SpreadStyleShadowObject(designer.wrapper.spread);
            }
            if (args[3]) {
                this._fillBorderPanel(true, args[4]);
                var borderType = {
                    borderTop: this._cacheStyle['borderTop'](),
                    borderBottom: this._cacheStyle['borderBottom'](),
                    borderRight: this._cacheStyle['borderRight'](),
                    borderLeft: this._cacheStyle['borderLeft'](),
                    borderVertical: this._cacheStyle['borderVertical'](),
                    borderHorizontal: this._cacheStyle['borderHorizontal'](),
                    diagonalUp: this._cacheStyle['diagonalUp'](),
                    diagonalDown: this._cacheStyle['diagonalDown']()
                };
                this._updateBorderPanel(borderType);
                this._defaultBorderType = true;
            } else {
                this._fillBorderPanel(false);
                var type = this._getSelectionsBorderType();
                if (type) {
                    this._updateBorderPanel(type);
                }
                this._defaultBorderType = false;
            }

            this._element.find('.main-tab').tabs('option', 'active', index);

            this._updateComboBoxValue('.input-horizontal-align', this._cacheStyle['hAlign']());
            this._updateComboBoxValue('.input-vertical-align', this._cacheStyle['vAlign']());
            if (this._cacheStyle['textIndent']() !== designer.BaseMetaObject.indeterminateValue) {
                this._element.find('.input-indent').spinner('value', this._cacheStyle['textIndent']());
            } else {
                this._element.find('.input-indent').spinner('value', '');
            }

            this._updateCheckBoxValue('.input-wrap', this._cacheStyle['wordWrap']());
            this._updateCheckBoxValue('.input-shrink', this._cacheStyle['shrinkToFit']());
            this._updateCheckBoxValue('.input-vertical-text', this._cacheStyle['isVerticalText']());
            this._merged = this._getMerged();
            this._updateCheckBoxValue('.input-merge', this._merged);
            this._updateFontPickerValue(this._cacheStyle['font'](), this._cacheStyle['foreColor'](), this._cacheStyle['textDecoration']());
            this._updateCheckBoxValue('.cell-protection', this._cacheStyle['locked']());
            this._updateColorSpan('.show-color-span', this._cacheStyle['backColor']());

            if (args[2] !== undefined) {
                this._updateNumberPanel(this._cacheStyle['formatter']());
            } else {
                this._updateNumberPanelSpreadObject(this._cacheStyle['formatter'](), designer.wrapper.spread);
            }

            if (this.selectTabOptions !== undefined) {
                this.selectTab(this.selectTabOptions);
            }

            if (!this.selectTabOptions || this.selectTabOptions.padding) {
                var font = this._cacheStyle['font']();
                var fontObj;
                if (font && (typeof font === "string")) {
                    fontObj = designer.util.parseFont(font);
                    this._fontFamily = fontObj.fontFamily;
                    this._fontSize = fontObj.fontSize.replace(/(pt|px)$/, '');
                    this._fontStyle = fontObj.fontStyle;
                    this._fontWeight = fontObj.fontWeight;
                }

                //clear preview spread
                this._paddingPreviewSpread.getActiveSheet().setStyle(0, 0, null);
                this._labelFont = keyword_undefined;
                this._labelFontSize = keyword_undefined;
                this._labelFontStyle = keyword_undefined;
                this._labelFontWeight = keyword_undefined;
                //update preview
                var padding = this._cacheStyle['cellPadding']();
                var paddingArray = designer.util.parsePadding(padding);
                this._element.find('.label-top-padding').spinner('value', parseInt(paddingArray[0]) || 0);
                this._element.find('.label-right-padding').spinner('value', parseInt(paddingArray[1]) || 0);
                this._element.find('.label-bottom-padding').spinner('value', parseInt(paddingArray[2]) || 0);
                this._element.find('.label-left-padding').spinner('value', parseInt(paddingArray[3]) || 0);
                this._updatePaddingPreview('top-padding', parseInt(paddingArray[0]) || 0);
                this._updatePaddingPreview('right-padding', parseInt(paddingArray[1]) || 0);
                this._updatePaddingPreview('bottom-padding', parseInt(paddingArray[2]) || 0);
                this._updatePaddingPreview('left-padding', parseInt(paddingArray[3]) || 0);
                // label text
                var labelText = this._cacheStyle['watermark']();
                if (labelText === designer.BaseMetaObject.undefinedValue || labelText === designer.BaseMetaObject.indeterminateValue) {
                    labelText = "";
                }
                this._updateInputValue('.label-text-input', labelText);
                this._updateLabelText(labelText);

                var labelOptions = this._cacheStyle['labelOptions']() || {};
                //label alignment
                var align = labelOptions.alignment;
                this._updateLabelAlignment(align || 0 /*topLeft*/);

                //label color
                this._updateLabelColor(labelOptions.foreColor || 'grey');

                //label font
                this._updateLabelFont(labelOptions.font || font || designer.res.defaultFont);
                var labelFont = labelOptions.font;
                if (labelFont && (typeof labelFont === "string")) {
                    fontObj = designer.util.parseFont(labelFont);
                    this._labelFont = fontObj.fontFamily;
                    this._labelFontSize = fontObj.fontSize.replace(/(pt|px)$/, '');
                    this._labelFontStyle = fontObj.fontStyle;
                    this._labelFontWeight = fontObj.fontWeight;
                }
                var defaultFont = designer.util.getFromCache("defaultFont", function () {
                    return designer.util.parseFont(designer.res.defaultFont);
                });
                var actualLabelFont = this._labelFont || this._fontFamily || defaultFont.fontFamily;
                if (actualLabelFont.match(/^["'].*["']$/)) {
                    actualLabelFont = actualLabelFont.substring(1, actualLabelFont.length - 1);
                }
                this._updateComboBoxValue('.label-font-family', actualLabelFont);
                this._updateComboBoxValue('.label-font-size', this._labelFontSize || this._fontSize || defaultFont.fontSize.replace(/(pt|px)$/, ''));
                // label fontWeight
                var labelFontWeight = this._labelFontWeight || this._fontWeight || 'normal';
                if (labelFontWeight === 'normal') {
                    this._element.find('.label-font-weight').val(false).removeClass('button-active');
                } else if (labelFontWeight === 'bold') {
                    this._element.find('.label-font-weight').val(true).addClass('button-active');
                }
                //label fontStyle
                var labelFontStyle = this._labelFontStyle || this._fontStyle || 'normal';
                if (labelFontStyle === 'normal') {
                    this._element.find('.label-font-style').val(false).removeClass('button-active');
                } else if (labelFontStyle === 'italic') {
                    this._element.find('.label-font-style').val(true).addClass('button-active');
                }
                // label visibility
                var visibility = labelOptions.visibility;
                this._updateLabelVisibility(visibility !== undefined ? visibility : 2);
                var labelVisibility = ['visible', 'hidden', 'auto'];
                this._updateComboBoxValue('.label-visibility', labelVisibility[visibility] || 'auto');

                // label margin
                var margin = labelOptions.margin;
                var marginArray = designer.util.parsePadding(margin);
                this._element.find('.label-top-margin').spinner('value', parseInt(marginArray[0]) || 0);
                this._element.find('.label-right-margin').spinner('value', parseInt(marginArray[1]) || 0);
                this._element.find('.label-bottom-margin').spinner('value', parseInt(marginArray[2]) || 0);
                this._element.find('.label-left-margin').spinner('value', parseInt(marginArray[3]) || 0);
                this._updatePaddingPreview('top-margin', parseInt(marginArray[0]) || 0);
                this._updatePaddingPreview('right-margin', parseInt(marginArray[1]) || 0);
                this._updatePaddingPreview('bottom-margin', parseInt(marginArray[2]) || 0);
                this._updatePaddingPreview('left-margin', parseInt(marginArray[3]) || 0);
            }
        };

        FormatDialog.prototype._init = function () {
            var self = this;
            this._formatNumberSpread = new GC.Spread.Sheets.Workbook(this._element.find(".sample-spread")[0]);
            this._defaultBorderType = false;
            this._addFormats = [];
            this._defaultTime = "3/14/2001 13:30:00";
            this._borderColor = "Text 1";
            this._lineStyle = 1 /* thin */;
            this._moreColorDialog = new designer.ColorDailog();
            this._moreColorDialog._create();
            this._genBorderButtonID();
            this._element.find('button').button();
            this._element.find('.tabs').tabs();
            this._element.find('.small-border-icon').button();
            this._element.find('.big-border-icon').button();
            this._element.find('.input-indent').spinner({
                min: 0,
                max: 10000,
                //step: 1,
                change: function () {
                    self._cacheStyle['textIndent']($(this).spinner('value'));
                },
                spin: function () {
                }
            });
            this._element.find('.font-picker').fontpicker({
                changed: function (e, args) {
                    switch (args.name) {
                        case 'family':
                            self._fontFamily = args.value;
                            break;
                        case 'style':
                            self._fontStyle = args.value;
                            break;
                        case 'size':
                            self._fontSize = args.value;
                            break;
                        case 'weight':
                            self._fontWeight = args.value;
                            break;
                        case 'color':
                            var color = args.value;
                            if (!color) {
                                self._cacheStyle['foreColor'](color);
                            } else if (color.name) {
                                self._cacheStyle['foreColor'](color.name);
                            } else {
                                self._cacheStyle['foreColor'](color.color);
                            }
                            break;
                        case 'underline':
                            self._underline = args.value;
                            break;
                        case 'doubleUnderline':
                            self._doubleUnderline = args.value;
                            break;
                        case 'strikethrough':
                            self._strikethrough = args.value;
                            break;
                    }
                    var decoration = 0;
                    if (self._underline) {
                        decoration |= 1 /* Underline */;
                    } else if (self._doubleUnderline) {
                        decoration |= 8 /* Double Underline */;
                    }
                    if (self._strikethrough) {
                        decoration |= 2 /* LineThrough */;
                    }
                    self._cacheStyle['textDecoration'](decoration);

                    if (!self._fontFamily && !self._fontStyle && !self._fontSize && !self._fontWeight) {
                        self._cacheStyle['font']('');
                    } else {
                        var family, style, size, weight;
                        family = self._fontFamily ? self._fontFamily : 'Arial';
                        style = self._fontStyle ? self._fontStyle : 'normal';
                        size = self._fontSize ? self._fontSize + 'pt' : '10pt';
                        weight = self._fontWeight ? self._fontWeight : 'normal';
                        var font = style + " " + weight + " " + size + " " + family;
                        self._cacheStyle['font'](font);
                    }
                }
            });
            this._element.find(".format-tab-li").click(function () {
                $("button[dialogtobefocused='true']").focus();
            });
            this._element.find('.input-horizontal-align').change(function () {
                var value = self._element.find('.input-horizontal-align').val();
                self._cacheStyle['hAlign'](value);
            });
            this._element.find('.input-vertical-align').change(function () {
                var value = self._element.find('.input-vertical-align').val();
                self._cacheStyle['vAlign'](value);
            });
            this._element.find('.input-indent').change(function () {
                var value = self._element.find('.input-indent').val();
                self._cacheStyle['textIndent'](value);
            });
            this._element.find('.input-wrap').change(function () {
                var value = self._element.find('.input-wrap').prop('checked');
                self._cacheStyle['wordWrap'](value);
            });
            this._element.find('.input-shrink').change(function () {
                var value = self._element.find('.input-shrink').prop('checked');
                self._cacheStyle['shrinkToFit'](value);
            });
            this._element.find('.input-merge').click(function () {
                if (self._merged === true) {
                    self._merged = false;
                } else if (self._merged === false) {
                    self._merged = designer.BaseMetaObject.indeterminateValue;
                } else {
                    self._merged = true;
                }
                self._updateCheckBoxValue('.input-merge', self._merged);
            });
            this._element.find('.input-vertical-text').change(function () {
                var value = self._element.find('.input-vertical-text').prop('checked');
                self._cacheStyle['isVerticalText'](value);
            });
            this._element.find('.cell-protection').change(function () {
                var value = self._element.find('.cell-protection').prop("checked");
                self._cacheStyle['locked'](value);
            });
            this._element.find('.colorPicker').colorpicker({
                valueChanged: function (e, value) {
                    if (value.name) {
                        var colorItem = designer.ColorHelper.parse(value.name, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                        self._element.find(".show-color-span").css("background-color", colorItem.color);
                        self._cacheStyle['backColor'](value.name);
                    } else {
                        self._element.find(".show-color-span").css("background-color", value.color);
                        self._cacheStyle['backColor'](value.color);
                    }
                }
            });

            this._element.find('.border-picker').borderpicker({
                colorChanged: function (e, value) {
                    if (value.name) {
                        self._borderColor = value.name;
                    } else {
                        self._borderColor = value.color;
                    }
                },
                lineStyleChanged: function (e, value) {
                    self._lineStyle = value;
                }
            });
            this._element.find('.border-picker').borderpicker('option', 'colorOptions', {showNoFill: false});
            this._element.find('.more-color-button').click(function () {
                if (self._moreColorDialog === undefined) {
                    self._moreColorDialog = new designer.ColorDailog();
                    self._moreColorDialog._create();
                }
                self._moreColorDialog.value = self._moreColorItem;
                if (self._moreColorItem === "" || self._moreColorItem === undefined) {
                    self._moreColorDialog._updateColor(true, "rgb(0,0,0)");
                } else {
                    self._moreColorDialog._updateColor(true, self._moreColorItem);
                }
                self._moreColorDialog.open();
            });

            $(this._moreColorDialog).on('dialogClose', function (evt, isCloseByOK) {
                if (isCloseByOK) {
                    self._element.find('.colorPicker').colorpicker("option", "selectedItem", this.value);
                    self._element.find('.show-color-span').css("background-color", this.value);
                    self._cacheStyle['backColor'](this.value);
                }
            });

            this._element.find('.no-color-button').click(function () {
                self._element.find('.colorPicker').colorpicker("option", "selectedItem", null);
                self._element.find('.show-color-span').css("background-color", "transparent");
                self._cacheStyle['backColor'](null);
            });

            this._element.find('.no-border-button').click(function () {
                self._element.find('.small-border-icon').prop('checked', false).button('refresh');
                self._setBorderToNone(1, 1);
                self._setBorderToNone(1, 2);
                self._setBorderToNone(2, 1);
                self._setBorderToNone(2, 2);
            });
            this._element.find('.outside-border-button').click(function () {
                self._element.find('.top-line-input').prop('checked', true).button('refresh');
                self._element.find('.top-line-input').trigger('change');
                self._element.find('.bottom-line-input').prop('checked', true).button('refresh');
                self._element.find('.bottom-line-input').trigger('change');
                self._element.find('.left-line-input').prop('checked', true).button('refresh');
                self._element.find('.left-line-input').trigger('change');
                self._element.find('.right-line-input').prop('checked', true).button('refresh');
                self._element.find('.right-line-input').trigger('change');
            });
            this._element.find('.inside-border-button').click(function () {
                self._element.find('.horizontal-inner-line-input').prop('checked', true).button('refresh');
                self._element.find('.horizontal-inner-line-input').trigger('change');
                self._element.find('.vertical-inner-line-input').prop('checked', true).button('refresh');
                self._element.find('.vertical-inner-line-input').trigger('change');
            });
            this._element.find('.top-line-input').change(function () {
                var value = self._element.find('.top-line-input').prop('checked');
                var sheet = self._borderSpread.getActiveSheet();
                var style = sheet.getActualStyle(1, 1);

                if (value) {
                    sheet.getCell(1, 1).borderTop(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(1, 2).borderTop(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    self._cacheStyle['borderTop'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                } else {
                    var colorItem = designer.ColorHelper.parse(self._borderColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    if (colorItem.color !== style.borderTop.color || style.borderTop.style !== self._lineStyle) {
                        sheet.getCell(1, 1).borderTop(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(1, 2).borderTop(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        self._element.find('.top-line-input').prop('checked', true).button('refresh');
                        self._cacheStyle['borderTop'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    } else {
                        sheet.getCell(1, 1).borderTop(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(1, 2).borderTop(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        self._cacheStyle['borderTop'](new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                    }
                }
            });
            this._element.find('.bottom-line-input').change(function () {
                var value = self._element.find('.bottom-line-input').prop('checked');
                var sheet = self._borderSpread.getActiveSheet();
                var style = sheet.getActualStyle(2, 1);
                if (value) {
                    sheet.getCell(2, 1).borderBottom(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(2, 2).borderBottom(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    self._cacheStyle['borderBottom'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                } else {
                    var colorItem = designer.ColorHelper.parse(self._borderColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    if (colorItem.color !== style.borderBottom.color || style.borderBottom.style !== self._lineStyle) {
                        sheet.getCell(2, 1).borderBottom(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(2, 2).borderBottom(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        self._element.find('.bottom-line-input').prop('checked', true).button('refresh');
                        self._cacheStyle['borderBottom'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    } else {
                        sheet.getCell(2, 1).borderBottom(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(2, 2).borderBottom(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        self._cacheStyle['borderBottom'](new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                    }
                }
            });
            this._element.find('.left-line-input').change(function () {
                var value = self._element.find('.left-line-input').prop('checked');
                var sheet = self._borderSpread.getActiveSheet();
                var style = sheet.getActualStyle(1, 1);
                if (value) {
                    sheet.getCell(1, 1).borderLeft(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(2, 1).borderLeft(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    self._cacheStyle['borderLeft'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                } else {
                    var colorItem = designer.ColorHelper.parse(self._borderColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    if (colorItem.color !== style.borderLeft.color || style.borderLeft.style !== self._lineStyle) {
                        sheet.getCell(1, 1).borderLeft(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(2, 1).borderLeft(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        self._element.find('.left-line-input').prop('checked', true).button('refresh');
                        self._cacheStyle['borderLeft'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    } else {
                        sheet.getCell(1, 1).borderLeft(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(2, 1).borderLeft(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        self._cacheStyle['borderLeft'](new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                    }
                }
            });
            this._element.find('.right-line-input').change(function () {
                var value = self._element.find('.right-line-input').prop('checked');
                var sheet = self._borderSpread.getActiveSheet();
                var style = sheet.getActualStyle(1, 2);
                if (value) {
                    sheet.getCell(1, 2).borderRight(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(2, 2).borderRight(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    self._cacheStyle['borderRight'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                } else {
                    var colorItem = designer.ColorHelper.parse(self._borderColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    if (colorItem.color !== style.borderRight.color || style.borderRight.style !== self._lineStyle) {
                        sheet.getCell(1, 2).borderRight(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(2, 2).borderRight(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        self._element.find('.right-line-input').prop('checked', true).button('refresh');
                        self._cacheStyle['borderRight'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    } else {
                        sheet.getCell(1, 2).borderRight(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(2, 2).borderRight(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        self._cacheStyle['borderRight'](new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                    }
                }
            });
            this._element.find('.horizontal-inner-line-input').change(function () {
                var value = self._element.find('.horizontal-inner-line-input').prop('checked');
                var sheet = self._borderSpread.getActiveSheet();
                var style = sheet.getActualStyle(1, 1);
                if (value) {
                    sheet.getCell(1, 1).borderBottom(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(1, 2).borderBottom(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    self._cacheStyle['borderHorizontal'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                } else {
                    var colorItem = designer.ColorHelper.parse(self._borderColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    if (colorItem.color !== style.borderBottom.color || style.borderBottom.style !== self._lineStyle) {
                        sheet.getCell(1, 1).borderBottom(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(1, 2).borderBottom(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        self._element.find('.horizontal-inner-line-input').prop('checked', true).button('refresh');
                        self._cacheStyle['borderHorizontal'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    } else {
                        sheet.getCell(1, 1).borderBottom(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(1, 2).borderBottom(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        self._cacheStyle['borderHorizontal'](new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                    }
                }
            });
            this._element.find('.vertical-inner-line-input').change(function () {
                var value = self._element.find('.vertical-inner-line-input').prop('checked');
                var sheet = self._borderSpread.getActiveSheet();
                var style = sheet.getActualStyle(1, 1);
                if (value) {
                    sheet.getCell(1, 1).borderRight(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(2, 1).borderRight(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    self._cacheStyle['borderVertical'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                } else {
                    var colorItem = designer.ColorHelper.parse(self._borderColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    if (colorItem.color !== style.borderRight.color || style.borderRight.style !== self._lineStyle) {
                        sheet.getCell(1, 1).borderRight(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(2, 1).borderRight(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        self._element.find('.vertical-inner-line-input').prop('checked', true).button('refresh');
                        self._cacheStyle['borderVertical'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    } else {
                        sheet.getCell(1, 1).borderRight(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(2, 1).borderRight(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        self._cacheStyle['borderVertical'](new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                    }
                }
            });
            this._element.find('.diagonal-up-line-input').change(function () {
                var value = self._element.find('.diagonal-up-line-input').prop('checked');
                var sheet = self._borderSpread.getActiveSheet();
                var style = sheet.getActualStyle(1, 1);
                if (value) {
                    sheet.getCell(1, 1).diagonalUp(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(2, 1).diagonalUp(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(1, 2).diagonalUp(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(2, 2).diagonalUp(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    self._cacheStyle['diagonalUp'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                } else {
                    var colorItem = designer.ColorHelper.parse(self._borderColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    if (colorItem.color !== style.diagonalUp.color || style.diagonalUp.style !== self._lineStyle) {
                        sheet.getCell(1, 1).diagonalUp(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(2, 1).diagonalUp(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(1, 2).diagonalUp(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(2, 2).diagonalUp(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        self._element.find('.diagonal-up-line-input').prop('checked', true).button('refresh');
                        self._cacheStyle['diagonalUp'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    } else {
                        sheet.getCell(1, 1).diagonalUp(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(2, 1).diagonalUp(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(1, 2).diagonalUp(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(2, 2).diagonalUp(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        self._cacheStyle['diagonalUp'](new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                    }
                }
            });
            this._element.find('.diagonal-down-line-input').change(function () {
                var value = self._element.find('.diagonal-down-line-input').prop('checked');
                var sheet = self._borderSpread.getActiveSheet();
                var style = sheet.getActualStyle(1, 1);
                if (value) {
                    sheet.getCell(1, 1).diagonalDown(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(2, 1).diagonalDown(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(1, 2).diagonalDown(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    sheet.getCell(2, 2).diagonalDown(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    self._cacheStyle['diagonalDown'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                } else {
                    var colorItem = designer.ColorHelper.parse(self._borderColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    if (colorItem.color !== style.diagonalDown.color || style.diagonalDown.style !== self._lineStyle) {
                        sheet.getCell(1, 1).diagonalDown(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(2, 1).diagonalDown(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(1, 2).diagonalDown(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        sheet.getCell(2, 2).diagonalDown(new Sheets.LineBorder(self._borderColor, self._lineStyle));
                        self._element.find('.diagonal-down-line-input').prop('checked', true).button('refresh');
                        self._cacheStyle['diagonalDown'](new Sheets.LineBorder(self._borderColor, self._lineStyle));
                    } else {
                        sheet.getCell(1, 1).diagonalDown(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(2, 1).diagonalDown(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(1, 2).diagonalDown(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        sheet.getCell(2, 2).diagonalDown(new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                        self._cacheStyle['diagonalDown'](new Sheets.LineBorder(self._borderColor, 0 /* empty */));
                    }
                }
            });

            this._element.find('.border-line-panel').click(function (evt) {
                evt = evt || window.event;
                var targetElement = evt.target || evt.srcElement;
                var cornerWidth = self._element.find('.corner').width();
                var cornerHeight = self._element.find('.corner').height();
                var divHeight = $(targetElement).height();
                var divWidth = $(targetElement).width();
                var moveWidth = cornerWidth;
                var moveHeight = cornerHeight;
                var spread = self._borderSpread;
                var sheet = spread.getActiveSheet();
                var spans = sheet.getSpans();
                var offX = evt.offsetX || evt.clientX - $(targetElement).offset().left;
                var offY = evt.offsetY || evt.clientY - $(targetElement).offset().top;
                var cellWidth = divWidth, cellHeight = divHeight;
                var isInnerLineClick = false;

                if (spans.length === 0) {
                    if (Math.abs(divWidth / 2 - offX) < moveWidth && offY > moveWidth && (divHeight - offY) > moveHeight) {
                        self._clickBorderFrame('.vertical-inner-line-input');
                        isInnerLineClick = true;
                    } else if (Math.abs(divHeight / 2 - offY) < moveHeight && offX > moveWidth && (divWidth - offX) > moveWidth) {
                        self._clickBorderFrame('.horizontal-inner-line-input');
                        isInnerLineClick = true;
                    }
                    cellWidth = divWidth / 2;
                    cellHeight = divHeight / 2;
                } else if (spans.length === 2) {
                    if (spans[0].rowCount > 1) {
                        if (Math.abs(divWidth / 2 - offX) < moveWidth) {
                            self._clickBorderFrame('.vertical-inner-line-input');
                            isInnerLineClick = true;
                        }
                        cellWidth = divWidth / 2;
                    } else {
                        if (Math.abs(divHeight / 2 - offY) < moveHeight) {
                            self._clickBorderFrame('.horizontal-inner-line-input');
                            isInnerLineClick = true;
                        }
                        cellHeight = divHeight / 2;
                    }
                }

                if (!isInnerLineClick) {
                    var isDiagonalDownMin = self._isDiagonalDownMin(cellWidth, cellHeight, offX, offY);
                    if (offX >= 0 && offX <= moveWidth && offY >= cornerHeight && offY <= (divHeight - cornerHeight)) {
                        self._clickBorderFrame('.left-line-input');
                    } else if ((divWidth - offX) >= 0 && (divWidth - offX) <= moveWidth && offY >= cornerHeight && offY <= (divHeight - cornerHeight)) {
                        self._clickBorderFrame('.right-line-input');
                    } else if (offY >= 0 && offY <= moveHeight && offX >= cornerWidth && offX <= (divWidth - cornerWidth)) {
                        self._clickBorderFrame('.top-line-input');
                    } else if ((divHeight - offY) >= 0 && (divHeight - offY) <= moveHeight && offX >= cornerWidth && offX <= (divWidth - cornerWidth)) {
                        self._clickBorderFrame('.bottom-line-input');
                    } else if (isDiagonalDownMin) {
                        self._clickBorderFrame('.diagonal-down-line-input');
                    } else {
                        self._clickBorderFrame('.diagonal-up-line-input');
                    }
                }
            });

            this._element.find('.colorPicker').colorpicker('option', 'showThemeColorTitle', false);
            this._element.find('.colorPicker').colorpicker('option', 'showStandardColorTitle', false);
            this._element.find('.colorPicker').colorpicker('option', 'showOutline', false);
            this._element.find('.colorPicker').colorpicker('option', 'showNoFill', false);
            this._element.find('.colorPicker').colorpicker('option', 'showMoreColors', false);
            this._element.find('.colorPicker').colorpicker('option', 'themeColors', designer.wrapper.getThemeColors());
            this._element.find('.border-picker').borderpicker('option', 'colorOptions', {themeColors: designer.wrapper.getThemeColors()});

            this._initNumberPicker();
            this._element.find('.tab-border-li').click(function () {
                setTimeout(function () {
                    self._borderSpread.refresh();
                }, 0);
            });
            this._initPaddingTab();
        };
        FormatDialog.prototype._isDiagonalDownMin = function (width, height, x, y) {
            var partWidth = width / 2;
            var partHegight = height / 2;
            if (x > width) {
                x = x - width;
            }
            if (y > height) {
                y = y - height;
            }
            return (x < partWidth && y < partHegight) || (x > partWidth && y > partHegight);
        };

        FormatDialog.prototype._refreshSlicerData = function () {
            var spread = designer.wrapper.spread;
            var sheet = spread.getActiveSheet();
            var row = sheet.getActiveRowIndex();
            var col = sheet.getActiveColumnIndex();
            var table = sheet.tables.find(row, col);
            if (table) {
                var slicerData = table.getSlicerData();
                slicerData && slicerData.refresh();
            }
        };

        FormatDialog.prototype._genBorderButtonID = function () {
            this._element.find('.top-line-input').attr('id', 'top-line-border-' + FormatDialog._currentID);
            this._element.find('.top-line').attr('for', 'top-line-border-' + FormatDialog._currentID);

            this._element.find('.horizontal-inner-line-input').attr('id', 'horizontal-inner-line-border-' + FormatDialog._currentID);
            this._element.find('.horizontal-inner-line').attr('for', 'horizontal-inner-line-border-' + FormatDialog._currentID);

            this._element.find('.bottom-line-input').attr('id', 'bottom-line-border-' + FormatDialog._currentID);
            this._element.find('.bottom-line').attr('for', 'bottom-line-border-' + FormatDialog._currentID);

            this._element.find('.diagonal-up-line-input').attr('id', 'diagonal-up-line-border-' + FormatDialog._currentID);
            this._element.find('.diagonal-up-line').attr('for', 'diagonal-up-line-border-' + FormatDialog._currentID);
            this._element.find('.left-line-input').attr('id', 'left-line-border-' + FormatDialog._currentID);
            this._element.find('.left-line').attr('for', 'left-line-border-' + FormatDialog._currentID);

            this._element.find('.vertical-inner-line-input').attr('id', 'vertical-inner-line-border-' + FormatDialog._currentID);
            this._element.find('.vertical-inner-line').attr('for', 'vertical-inner-line-border-' + FormatDialog._currentID);

            this._element.find('.right-line-input').attr('id', 'right-line-border-' + FormatDialog._currentID);
            this._element.find('.right-line').attr('for', 'right-line-border-' + FormatDialog._currentID);
            this._element.find('.diagonal-down-line-input').attr('id', 'diagonal-down-line-border-' + FormatDialog._currentID);
            this._element.find('.diagonal-down-line').attr('for', 'diagonal-down-line-border-' + FormatDialog._currentID);
        };

        FormatDialog.getTabIndexById = function (id) {
            switch (id) {
                case 'number':
                    return 0;
                case 'alignment':
                    return 1;
                case 'font':
                    return 2;
                case 'border':
                    return 3;
                case 'fill':
                    return 4;
                case 'protected':
                    return 5;
            }
            return 0;
        };

        FormatDialog.prototype.cancel = function () {
        };

        FormatDialog.prototype._returnFormat = function () {
            var style = this._cacheStyle.result();
            var borderType = this._getBorderType();
            return {
                formatter: style.formatter,
                backColor: style.backColor,
                foreColor: style.foreColor,
                hAlign: style.hAlign,
                vAlign: style.vAlign,
                textIndent: style.textIndent,
                wordWrap: style.wordWrap,
                shrinkToFit: style.shrinkToFit,
                isVerticalText: style.isVerticalText,
                font: style.font,
                locked: style.locked,
                borderTop: borderType.topLineBorder,
                borderBottom: borderType.bottomLineBorder,
                borderLeft: borderType.leftLineBorder,
                borderRight: borderType.rightLineBorder,
                borderInnerVertical: borderType.innerVerticalLineBorder,
                borderInnerHorizontal: borderType.innerHorizontalLineBorder,
                textDecoration: style.textDecoration
            };
        };

        FormatDialog.prototype._updateCheckBoxValue = function (selector, value) {
            var $element = this._element.find(selector);
            if (value === true) {
                $element.prop('indeterminate', false);
                $element.prop('checked', true);
            } else if (value === false) {
                $element.prop('indeterminate', false);
                $element.prop('checked', false);
            } else {
                $element.prop('indeterminate', true);
                $element.prop('checked', false);
            }
        };
        FormatDialog.prototype._updateComboBoxValue = function (selector, value) {
            var $element = this._element.find(selector);
            if (value !== designer.BaseMetaObject.indeterminateValue) {
                $element.val(value);
            } else {
                $element.val(null);
            }
        };
        FormatDialog.prototype._updateFontPickerValue = function (font, color, line) {
            var $element = this._element.find('.font-picker');

            if (font && font !== designer.BaseMetaObject.indeterminateValue && font !== designer.BaseMetaObject.undefinedValue) {
                var f = designer.util.parseFont(font);
                var families = f.fontFamily.split(',');
                if (families.length > 1) {
                    $element.fontpicker('family', families[0]);
                } else {
                    $element.fontpicker('family', f.fontFamily);
                }
                $element.fontpicker('style', f.fontStyle);

                // remove unit.
                // jquery css('font') can transform 'pt' to 'px'
                if (f.fontSize.indexOf('pt') !== -1) {
                    $element.fontpicker('size', f.fontSize.substring(0, f.fontSize.length - 2));
                } else if (f.fontSize.indexOf('px') !== -1) {
                    var fontSize = this._element.find('.gcui-fontpicker-preview').get(0).style.fontSize;
                    $element.fontpicker('size', fontSize.substring(0, fontSize.length - 2));
                } else {
                    $element.fontpicker('size', f.fontSize);
                }
                $element.fontpicker('weight', f.fontWeight);
            } else {
                var defaultFont = designer.util.getFromCache("defaultFont", function () {
                    return designer.util.parseFont(designer.res.defaultFont);
                });
                $element.fontpicker('family', defaultFont.fontFamily);
                $element.fontpicker('style', defaultFont.fontStyle);
                $element.fontpicker('size', defaultFont.fontSize.replace(/(pt|px)$/, ''));
                $element.fontpicker('weight', defaultFont.fontWeight);
            }

            this._fontFamily = keyword_undefined;
            this._fontStyle = keyword_undefined;
            this._fontSize = keyword_undefined;
            this._fontWeight = keyword_undefined;

            if (color !== designer.BaseMetaObject.indeterminateValue && color !== designer.BaseMetaObject.undefinedValue) {
                $element.fontpicker('color', designer.ColorHelper.parse(color, designer.wrapper.spread.getActiveSheet().currentTheme().colors()));
            } else {
                $element.fontpicker('color', null);
            }
            $element.fontpicker('colorOption', 'themeColors', designer.wrapper.getThemeColors());

            if (line & 1 /* Underline */) {
                $element.fontpicker('underline', true);
                this._underline = true;
                $element.fontpicker('doubleUnderline', false);
                this._doubleUnderline = false;
            } else if (line & 8 /*Double Underline */) {
                $element.fontpicker('underline', false);
                this._underline = false;
                $element.fontpicker('doubleUnderline', true);
                this._doubleUnderline = true;
            } else {
                $element.fontpicker('underline', false);
                this._underline = false;
                $element.fontpicker('doubleUnderline', false);
                this._doubleUnderline = false;
            }
            if (line & 2 /* LineThrough */) {
                $element.fontpicker('strikethrough', true);
                this._strikethrough = true;
            } else {
                $element.fontpicker('strikethrough', false);
                this._strikethrough = false;
            }
        };

        FormatDialog.prototype._updateColorSpan = function (selector, value) {
            var $element = this._element.find(selector);
            if (value === designer.BaseMetaObject.indeterminateValue || value === designer.BaseMetaObject.undefinedValue || value === undefined || value === null) {
                $element.css("background-color", "");
                this._element.find('.colorPicker').colorpicker('option', 'selectedItem', null);
                this._moreColorItem = "rgb(0,0,0)";
            } else {
                var colorItem = designer.ColorHelper.parse(value, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                this._element.find('.colorPicker').colorpicker('option', 'selectedItem', colorItem);
                $element.css("background-color", colorItem.color);
                this._moreColorItem = colorItem.color;
            }
        };

        FormatDialog.prototype._updateInputValue = function (selector, value) {
            var $element = this._element.find(selector);
            $element.val(value || '');
        };

        FormatDialog.prototype._createBorderFrame = function (isDefaultStyle, needInsideBorder) {
            var self = this;
            var horizontalDouble = false;
            var verticalDouble = false;
            this._borderSpread = new GC.Spread.Sheets.Workbook(this._element.find(".border-sheet")[0]);
            this._borderSpread.options.showHorizontalScrollbar = false;
            this._borderSpread.options.showVerticalScrollbar = false;
            this._borderSpread.options.tabStripVisible = false;
            this._borderSpread.options.allowUserResize = false;
            var sheet = this._borderSpread.getActiveSheet();
            $(designer.util.getCanvas(this._borderSpread)).unbind("gcmousewheel.gcSheet");
            sheet.currentTheme(designer.wrapper.spread.getActiveSheet().currentTheme());
            sheet.options.gridline = {showVerticalGridline: false, showHorizontalGridline: false};
            sheet.options.colHeaderVisible = false;
            sheet.options.rowHeaderVisible = false;
            sheet.options.allowUserDragDrop = false;
            sheet.options.allowUserDragFill = false;
            sheet.options.selectionBackColor = "transparent";
            sheet.options.selectionBorderColor = "transparent";
            sheet.options.isProtected = true;
            sheet.setColumnCount(4);
            sheet.setRowCount(4);
            sheet.setValue(1, 1, designer.res.formatDialog.sampleText);
            sheet.setValue(1, 2, designer.res.formatDialog.sampleText);
            sheet.setValue(2, 1, designer.res.formatDialog.sampleText);
            sheet.setValue(2, 2, designer.res.formatDialog.sampleText);
            var i;
            for (i = 1; i < 3; i++) {
                for (var j = 1; j < 3; j++) {
                    sheet.getCell(i, j).vAlign(1 /* center */);
                    sheet.getCell(i, j).hAlign(1 /* center */);
                }
            }
            sheet.setRowHeight(0, 2);
            sheet.setRowHeight(1, 33);
            sheet.setRowHeight(2, 34);
            sheet.setRowHeight(3, 1);
            sheet.setColumnWidth(0, 2);
            sheet.setColumnWidth(1, 77);
            sheet.setColumnWidth(2, 78);
            sheet.setColumnWidth(3, 1);

            this._element.find('.diagonal-up-line-input').button("enable");
            this._element.find('.diagonal-down-line-input').button("enable");
            if (isDefaultStyle) {
                if (needInsideBorder) {
                    this._element.find('.horizontal-middle').show();
                    this._element.find('.vertical-middle').show();
                    this._element.find('.vertical-inner-line-input').button("enable");
                    this._element.find('.horizontal-inner-line-input').button("enable");
                    this._element.find('.inside-border-button').button("enable");
                } else {
                    sheet.addSpan(1, 1, 2, 2);
                    this._element.find('.horizontal-middle').hide();
                    this._element.find('.vertical-middle').hide();
                    this._element.find('.vertical-inner-line-input').button("disable");
                    this._element.find('.horizontal-inner-line-input').button("disable");
                    this._element.find('.inside-border-button').button("disable");
                }
            } else {
                var selections = designer.wrapper.spread.getActiveSheet().getSelections();
                var isMerged = this._getMerged();
                for (i = 0; i < selections.length; i++) {
                    if (selections[i].rowCount > 1) {
                        verticalDouble = true;
                    }
                    if (selections[i].colCount > 1) {
                        horizontalDouble = true;
                    }
                }
                if (isMerged === true) {
                    verticalDouble = false;
                    horizontalDouble = false;
                }
                if (!horizontalDouble && verticalDouble) {
                    sheet.addSpan(1, 1, 1, 2);
                    sheet.addSpan(2, 1, 1, 2);
                    this._element.find('.vertical-middle').hide();
                    this._element.find('.horizontal-middle').show();
                    this._element.find('.vertical-inner-line-input').button("disable");
                    this._element.find('.horizontal-inner-line-input').button("enable");
                    this._element.find('.inside-border-button').button("enable");
                } else if (horizontalDouble && !verticalDouble) {
                    sheet.addSpan(1, 1, 2, 1);
                    sheet.addSpan(1, 2, 2, 1);
                    this._element.find('.vertical-middle').show();
                    this._element.find('.horizontal-middle').hide();
                    this._element.find('.horizontal-inner-line-input').button("disable");
                    this._element.find('.vertical-inner-line-input').button("enable");
                    this._element.find('.inside-border-button').button("enable");
                } else if (!horizontalDouble && !verticalDouble) {  /* NOSONAR: S2589, Boolean expressions should not be gratuitous */
                    sheet.addSpan(1, 1, 2, 2);
                    this._element.find('.horizontal-middle').hide();
                    this._element.find('.vertical-middle').hide();
                    this._element.find('.vertical-inner-line-input').button("disable");
                    this._element.find('.horizontal-inner-line-input').button("disable");
                    this._element.find('.inside-border-button').button("disable");
                } else {
                    this._element.find('.horizontal-middle').show();
                    this._element.find('.vertical-middle').show();
                    this._element.find('.vertical-inner-line-input').button("enable");
                    this._element.find('.horizontal-inner-line-input').button("enable");
                    this._element.find('.inside-border-button').button("enable");
                }
            }
            setTimeout(function () {
                self._borderSpread.refresh();
            }, 0);
        };
        FormatDialog.prototype._destorySheet = function () {
            var spreadDiv = this._element.find(".border-sheet");
            if (spreadDiv.attr("gcuielement") === "gcSpread") {
                this._borderSpread.destroy();
                this._element.find(".border-sheet").html("");
            }
        };
        FormatDialog.prototype._fillBorderPanel = function (isDefaultStyle, needInsideBorder) {
            if (typeof this._borderSpread != "undefined") {
                this._destorySheet();
            }
            this._createBorderFrame(isDefaultStyle, needInsideBorder);
        };

        FormatDialog.prototype._getBorderType = function () {
            var top = this._element.find('.top-line-input').prop('checked');
            var right = this._element.find('.right-line-input').prop('checked');
            var bottom = this._element.find('.bottom-line-input').prop('checked');
            var left = this._element.find('.left-line-input').prop('checked');
            var innerHorizontal = this._element.find('.horizontal-inner-line-input').prop('checked');
            var innerVertical = this._element.find('.vertical-inner-line-input').prop('checked');
            var diagonalUp = this._element.find('.diagonal-up-line-input').prop('checked');
            var diagonalDown = this._element.find('.diagonal-down-line-input').prop('checked');
            var style1 = this._borderSpread.getActiveSheet().getStyle(1, 1);
            var style2 = this._borderSpread.getActiveSheet().getStyle(2, 2);
            var topLineBorder;
            var bottomLineBorder;
            var rightLineBorder;
            var leftLineBorder;
            var innerHorizontalLineBorder;
            var innerVerticalLineBorder;
            var diagonalUpBorder;
            var diagonalDownBorder;
            if (top) {
                topLineBorder = new Sheets.LineBorder(style1.borderTop.color, style1.borderTop.style);
            }
            if (bottom) {
                bottomLineBorder = new Sheets.LineBorder(style2.borderBottom.color, style2.borderBottom.style);
            }
            if (right) {
                rightLineBorder = new Sheets.LineBorder(style2.borderRight.color, style2.borderRight.style);
            }
            if (left) {
                leftLineBorder = new Sheets.LineBorder(style1.borderLeft.color, style1.borderLeft.style);
            }
            if (innerHorizontal) {
                innerHorizontalLineBorder = new Sheets.LineBorder(style1.borderBottom.color, style1.borderBottom.style);
            }
            if (innerVertical) {
                innerVerticalLineBorder = new Sheets.LineBorder(style1.borderRight.color, style1.borderRight.style);
            }
            if (diagonalUp) {
                diagonalUpBorder = new Sheets.LineBorder(style1.diagonalUp.color, style1.diagonalUp.style);
            }
            if (diagonalDown) {
                diagonalDownBorder = new Sheets.LineBorder(style1.diagonalDown.color, style1.diagonalDown.style);
            }
            return {
                topLineBorder: topLineBorder,
                bottomLineBorder: bottomLineBorder,
                rightLineBorder: rightLineBorder,
                leftLineBorder: leftLineBorder,
                innerHorizontalLineBorder: innerHorizontalLineBorder,
                innerVerticalLineBorder: innerVerticalLineBorder,
                diagonalUpBorder: diagonalUpBorder,
                diagonalDownBorder: diagonalDownBorder
            };
            //border need to be cached in style, but it can't be set by setStyle, just set by setBorder.
        };

        FormatDialog.prototype._clickBorderFrame = function (selector) {
            var $element = this._element.find(selector);
            var value = $element.prop('checked');
            value = !value;
            $element.prop('checked', value).button('refresh');
            $element.trigger('change');
        };
        FormatDialog.prototype._setBorderToNone = function (rowIndex, colIndex) {
            var sheet = this._borderSpread.getActiveSheet();
            sheet.getCell(rowIndex, colIndex).borderTop(new Sheets.LineBorder(this._borderColor, 0 /* empty */));
            sheet.getCell(rowIndex, colIndex).borderBottom(new Sheets.LineBorder(this._borderColor, 0 /* empty */));
            sheet.getCell(rowIndex, colIndex).borderLeft(new Sheets.LineBorder(this._borderColor, 0 /* empty */));
            sheet.getCell(rowIndex, colIndex).borderRight(new Sheets.LineBorder(this._borderColor, 0 /* empty */));
            sheet.getCell(rowIndex, colIndex).diagonalUp(new Sheets.LineBorder(this._borderColor, 0 /* empty */));
            sheet.getCell(rowIndex, colIndex).diagonalDown(new Sheets.LineBorder(this._borderColor, 0 /* empty */));

            this._cacheStyle['borderTop'](undefined);
            this._cacheStyle['borderLeft'](undefined);
            this._cacheStyle['borderRight'](undefined);
            this._cacheStyle['borderBottom'](undefined);
            this._cacheStyle['diagonalUp'](undefined);
            this._cacheStyle['diagonalDown'](undefined);
        };
        FormatDialog.prototype._getSelectionsBorderType = function () {
            var spread = designer.wrapper.spread;
            var sheet = spread.getActiveSheet();
            var selections = sheet.getSelections();
            var length = selections.length;
            if (length === 0) {
                return null;
            }
            var rowIndex = selections[0].row === -1 ? 0 : selections[0].row;
            var colIndex = selections[0].col === -1 ? 0 : selections[0].col;
            var firstStyle = sheet.getStyle(rowIndex, colIndex);
            var lastCellRowIndex = rowIndex + selections[0].rowCount - 1;
            var lastCellColIndex = colIndex + selections[0].colCount - 1;
            var lastStyle = sheet.getStyle(lastCellRowIndex, lastCellColIndex);

            var borderTop;
            var borderBottom;
            var borderLeft;
            var borderRight;
            var borderHorizontal;
            var borderVertical;
            var diagonalUp;
            var diagonalDown;
            var existInnerHorizontal = false;
            var existInnerVertical = false;
            var style, row, col;

            if (firstStyle) {
                borderTop = firstStyle.borderTop;
                borderLeft = firstStyle.borderLeft;
                diagonalUp = firstStyle.diagonalUp;
                diagonalDown = firstStyle.diagonalDown;
            }
            if (lastStyle) {
                borderBottom = lastStyle.borderBottom;
                borderRight = lastStyle.borderRight;
            }

            for (var i = 0; i < length; i++) {
                rowIndex = selections[i].row === -1 ? 0 : selections[i].row;
                colIndex = selections[i].col === -1 ? 0 : selections[i].col;

                if (selections[i].rowCount > 1 && !existInnerHorizontal) {
                    style = sheet.getStyle(rowIndex, colIndex);
                    if (style) {
                        borderHorizontal = style.borderBottom;
                    }
                    existInnerHorizontal = true;
                }
                if (selections[i].colCount > 1 && !existInnerVertical) {
                    style = sheet.getStyle(rowIndex, colIndex);
                    if (style) {
                        borderVertical = style.borderRight;
                    }
                    existInnerVertical = true;
                }
                for (col = 0; col < selections[i].colCount; col++) {
                    style = sheet.getStyle(rowIndex, colIndex + col);
                    if (!style || !borderTop) {
                        borderTop = keyword_undefined;
                        break;
                    } else {
                        if (style.borderTop === undefined || style.borderTop === keyword_null || style.borderTop.color !== borderTop.color || style.borderTop.style !== borderTop.style) {
                            borderTop = keyword_undefined;
                            break;
                        }
                    }
                }
                for (row = 0; row < selections[i].rowCount; row++) {
                    style = sheet.getStyle(rowIndex + row, colIndex);
                    if (!style || !borderLeft) {
                        borderLeft = keyword_undefined;
                        break;
                    } else {
                        if (style.borderLeft === undefined || style.borderLeft === keyword_null || style.borderLeft.color !== borderLeft.color || style.borderLeft.style !== borderLeft.style) {
                            borderLeft = keyword_undefined;
                            break;
                        }
                    }
                }

                for (col = 0; col < selections[i].colCount; col++) {
                    style = sheet.getStyle(rowIndex + selections[i].rowCount - 1, colIndex + col);
                    if (!style || !borderBottom) {
                        borderBottom = keyword_undefined;
                        break;
                    } else {
                        if (style.borderBottom === undefined || style.borderBottom === keyword_null || style.borderBottom.color !== borderBottom.color || style.borderBottom.style !== borderBottom.style) {
                            borderBottom = keyword_undefined;
                            break;
                        }
                    }
                }

                for (row = 0; row < selections[i].rowCount; row++) {
                    style = sheet.getStyle(rowIndex + row, colIndex + selections[i].colCount - 1);
                    if (!style || !borderRight) {
                        borderRight = keyword_undefined;
                        break;
                    } else {
                        if (style.borderRight === undefined || style.borderRight === keyword_null || style.borderRight.color !== borderRight.color || style.borderRight.style !== borderRight.style) {
                            borderRight = keyword_undefined;
                            break;
                        }
                    }
                }
                for (row = 0; row < selections[i].rowCount; row++) {
                    for (col = 0; col < selections[i].colCount; col++) {
                        style = sheet.getStyle(rowIndex + row, colIndex + col);
                        if (!style || !diagonalUp) {
                            diagonalUp = keyword_undefined;
                            break;
                        } else {
                            if (style.diagonalUp === undefined || style.diagonalUp === keyword_null || style.diagonalUp.color !== diagonalUp.color || style.diagonalUp.style !== diagonalUp.style) {
                                diagonalUp = keyword_undefined;
                                break;
                            }
                        }
                    }
                }
                for (row = 0; row < selections[i].rowCount; row++) {
                    for (col = 0; col < selections[i].colCount; col++) {
                        style = sheet.getStyle(rowIndex + row, colIndex + col);
                        if (!style || !diagonalDown) {
                            diagonalDown = keyword_undefined;
                            break;
                        } else {
                            if (style.diagonalDown === undefined || style.diagonalDown === keyword_null || style.diagonalDown.color !== diagonalDown.color || style.diagonalDown.style !== diagonalDown.style) {
                                diagonalDown = keyword_undefined;
                                break;
                            }
                        }
                    }
                }

                if (existInnerHorizontal) {
                    for (row = 0; row < selections[i].rowCount - 1; row++) {
                        for (col = 0; col < selections[i].colCount; col++) {
                            style = sheet.getStyle(rowIndex + row, colIndex + col);
                            if (!style || !borderHorizontal) {
                                borderHorizontal = keyword_undefined;
                                break;
                            } else {
                                if (style.borderBottom === undefined || style.borderBottom === keyword_null || style.borderBottom.color !== borderHorizontal.color || style.borderBottom.style !== borderHorizontal.style) {
                                    borderHorizontal = keyword_undefined;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (existInnerVertical) {
                    for (row = 0; row < selections[i].rowCount; row++) {
                        for (col = 0; col < selections[i].colCount - 1; col++) {
                            style = sheet.getStyle(rowIndex + row, colIndex + col);
                            if (!style || !borderVertical) {
                                borderVertical = keyword_undefined;
                                break;
                            } else {
                                if (style.borderRight === undefined || style.borderRight === keyword_null || style.borderRight.color !== borderVertical.color || style.borderRight.style !== borderVertical.style) {
                                    borderVertical = keyword_undefined;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            return {
                borderTop: borderTop,
                borderBottom: borderBottom,
                borderLeft: borderLeft,
                borderRight: borderRight,
                borderVertical: borderVertical,
                borderHorizontal: borderHorizontal,
                diagonalUpBorder: diagonalUp,
                diagonalDownBorder: diagonalDown
            };
        };
        FormatDialog.prototype._updateBorderPanel = function (borderType) {
            var _this = this;
            _this._orignalBorder = borderType;
            var existInnerHorizontal = false;
            var existInnerVertical = false;
            var borderColorItem;
            if (borderType.borderTop) {
                this._borderColor = borderType.borderTop.color;
                this._lineStyle = borderType.borderTop.style;
                this._element.find('.top-line-input').prop('checked', true).button('refresh');
                this._element.find('.top-line-input').trigger('change');
            } else {
                this._element.find('.top-line-input').prop('checked', false).button('refresh');
            }
            if (borderType.borderBottom) {
                this._borderColor = borderType.borderBottom.color;
                this._lineStyle = borderType.borderBottom.style;
                this._element.find('.bottom-line-input').prop('checked', true).button('refresh');
                this._element.find('.bottom-line-input').trigger('change');
            } else {
                this._element.find('.bottom-line-input').prop('checked', false).button('refresh');
            }
            if (borderType.borderLeft) {
                this._borderColor = borderType.borderLeft.color;
                this._lineStyle = borderType.borderLeft.style;
                this._element.find('.left-line-input').prop('checked', true).button('refresh');
                this._element.find('.left-line-input').trigger('change');
            } else {
                this._element.find('.left-line-input').prop('checked', false).button('refresh');
            }
            if (borderType.borderRight) {
                this._borderColor = borderType.borderRight.color;
                this._lineStyle = borderType.borderRight.style;
                this._element.find('.right-line-input').prop('checked', true).button('refresh');
                this._element.find('.right-line-input').trigger('change');
            } else {
                this._element.find('.right-line-input').prop('checked', false).button('refresh');
            }
            if (borderType.borderHorizontal) {
                existInnerHorizontal = true;
                this._borderColor = borderType.borderHorizontal.color;
                this._lineStyle = borderType.borderHorizontal.style;
                this._element.find('.horizontal-inner-line-input').prop('checked', true).button('refresh');
                this._element.find('.horizontal-inner-line-input').trigger('change');
            } else {
                this._element.find('.horizontal-inner-line-input').prop('checked', false).button('refresh');
            }
            if (borderType.borderVertical) {
                existInnerVertical = true;
                this._borderColor = borderType.borderVertical.color;
                this._lineStyle = borderType.borderVertical.style;
                this._element.find('.vertical-inner-line-input').prop('checked', true).button('refresh');
                this._element.find('.vertical-inner-line-input').trigger('change');
            } else {
                this._element.find('.vertical-inner-line-input').prop('checked', false).button('refresh');
            }
            if (borderType.diagonalUpBorder) {
                this._borderColor = borderType.diagonalUpBorder.color;
                this._lineStyle = borderType.diagonalUpBorder.style;
                this._element.find('.diagonal-up-line-input').prop('checked', true).button('refresh');
                this._element.find('.diagonal-up-line-input').trigger('change');
            } else {
                this._element.find('.diagonal-up-line-input').prop('checked', false).button('refresh');
            }
            if (borderType.diagonalDownBorder) {
                this._borderColor = borderType.diagonalDownBorder.color;
                this._lineStyle = borderType.diagonalDownBorder.style;
                this._element.find('.diagonal-down-line-input').prop('checked', true).button('refresh');
                this._element.find('.diagonal-down-line-input').trigger('change');
            } else {
                this._element.find('.diagonal-down-line-input').prop('checked', false).button('refresh');
            }
            if (!borderType.borderTop || !borderType.borderBottom || !borderType.borderLeft || !borderType.borderRight || (existInnerHorizontal && !borderType.borderHorizontal) || (existInnerVertical && !borderType.borderVertical)) {
                this._lineStyle = 1 /* "thin" */;
                this._borderColor = "Text 1";
                borderColorItem = designer.ColorHelper.parse("Text 1", designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                this._element.find('.border-picker').borderpicker('option', 'borderColor', borderColorItem);
                this._element.find('.border-picker').borderpicker('option', 'lineStyle', 1 /* thin */);
            } else {
                var topBorderColor = borderType.borderTop.color;
                var topBorderLineStyle = borderType.borderTop.style;
                if (topBorderColor === borderType.borderBottom.color && (existInnerVertical ? topBorderColor === borderType.borderVertical.color : true) && (existInnerHorizontal ? topBorderColor === borderType.borderHorizontal.color : true) && topBorderColor === borderType.borderLeft.color && topBorderColor === borderType.borderRight.color) {
                    borderColorItem = designer.ColorHelper.parse(topBorderColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    this._element.find('.border-picker').borderpicker('option', 'borderColor', borderColorItem);
                    this._borderColor = topBorderColor;
                } else {
                    this._borderColor = "Text 1";
                    borderColorItem = designer.ColorHelper.parse("Text 1", designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    this._element.find('.border-picker').borderpicker('option', 'borderColor', borderColorItem);
                }
                if (topBorderLineStyle === borderType.borderBottom.style && (existInnerVertical ? topBorderLineStyle === borderType.borderVertical.style : true) && (existInnerHorizontal ? topBorderLineStyle === borderType.borderHorizontal.style : true) && topBorderLineStyle === borderType.borderLeft.style && topBorderLineStyle === borderType.borderRight.style) {
                    this._element.find('.border-picker').borderpicker('option', 'lineStyle', topBorderLineStyle);
                    this._lineStyle = topBorderLineStyle;
                } else {
                    this._lineStyle = 1 /* "thin" */;
                    this._element.find('.border-picker').borderpicker('option', 'lineStyle', 1 /* thin */);
                }
            }

            setTimeout(function () {
                _this._borderSpread.refresh();
            }, 0);
        };

        FormatDialog.prototype._getMerged = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var spans;
            if (ranges.length === 1) {
                spans = sheet.getSpans(ranges[0]);
                if (spans.length === 1 && spans[0].row === ranges[0].row && spans[0].rowCount === ranges[0].rowCount && spans[0].col === ranges[0].col && spans[0].colCount === ranges[0].colCount) {
                    return true;
                } else if (spans.length > 0) {
                    return designer.BaseMetaObject.indeterminateValue;
                } else {
                    return false;
                }
            }
            for (var i = 0; i < ranges.length; i++) {
                spans = sheet.getSpans(ranges[i]);
                if (spans.length > 0) {
                    return designer.BaseMetaObject.indeterminateValue;
                }
            }
            return false;
        };
        FormatDialog.prototype.setFormatDirectly = function (isDirect) {
            this._setFormatDirectly = isDirect;
        };

        //#region Generate HTML DOM Object
        FormatDialog.prototype._getDecimalInput = function (className, idName, categoryClass) {
            var decimalPlacesDiv = $('<div></div>').addClass("gcui-numberpicker hidden " + categoryClass);
            $('<label></label>').attr('for', idName).css({
                "vertical-align": "middle",
                "margin-right": "5px"
            }).text(designer.res.formatNumberPickerSetting.decimalPlaces).appendTo(decimalPlacesDiv);
            $('<input>').attr({
                'id': idName,
                'value': '2'
            }).addClass(className + " format-decimal-input").appendTo(decimalPlacesDiv);

            return decimalPlacesDiv;
        };

        //1000 separator
        FormatDialog.prototype._getSeparatorCheckbox = function (className, idName, categoryClass) {
            var separatorDiv = $('<div></div>').addClass("gcui-numberpicker hidden " + categoryClass);
            $('<input>').attr({
                'id': idName,
                'type': 'checkbox'
            }).addClass(className).appendTo(separatorDiv);
            $('<label></label>').attr('for', idName).text(designer.res.formatNumberPickerSetting.separator).appendTo(separatorDiv);
            return separatorDiv;
        };
        FormatDialog.prototype._getSymbolSelect = function (items, className, categoryClass) {
            var container = $("<div></div>").addClass("gcui-numberpicker hidden " + categoryClass);
            $('<label><label>').css({
                "margin-right": "5px"
            }).text(designer.res.formatNumberPickerSetting.symbol).appendTo(container);
            var dropDown = $('<select></select>').attr('size', 1).addClass(className);
            for (var i = 0; i < items.length; i++) {
                dropDown.append($('<option></option>').text(items[i][0]));
            }
            container.append(dropDown);
            return container;
        };
        FormatDialog.prototype._getTypeSelect = function (items, labelText, categoryName, categoryClass) {
            var specialClass = categoryName + "-container";
            var container = $("<div></div>").addClass("gcui-numberpicker hidden " + categoryClass + " " + specialClass);
            var defaultTypeLabelClass = "format-number-label";
            var labelDiv = $('<div></div>').addClass(defaultTypeLabelClass);
            $('<label></label>').text(labelText).appendTo(labelDiv);

            var groupSelect = $('<select></select>').attr({
                'name': categoryName + '-list',
                'size': 6
            }).addClass(categoryName + '-select');

            if (Array.isArray(items)) {
                for (var i = 0; i < items.length; i++) {
                    groupSelect.append($('<option></option>').val(items[i]).text(items[i]));
                }
            } else {
                for (var name in items) {
                    if (name.indexOf('red') !== -1) {
                        groupSelect.append($('<option></option>').css('color', 'red').val(name).text(items[name]));
                    } else {
                        groupSelect.append($('<option></option>').val(name).text(items[name]));
                    }
                }
            }
            groupSelect.get(0).selectedIndex = 0;
            var customInput;
            if (categoryName === "custom-type") {
                customInput = $('<input></input>').addClass('custom-type-input');
                container.append(labelDiv).append(customInput).append(groupSelect);
            } else {
                container.append(labelDiv).append(groupSelect);
            }
            return container;
        };
        FormatDialog.prototype._getParagraph = function (content, categoryName) {
            var categoryClass = "spread-format-" + categoryName;
            return $('<p></p>').text(content).addClass("gcui-numberpicker hidden " + categoryClass);
        };
        FormatDialog.prototype._getCultureSelect = function (items, labelText, categoryName, categoryClass, selectGroup) {
            var specialClass = categoryName + "-container";
            var container = $("<div></div>").addClass("gcui-numberpicker hidden " + categoryClass + " " + specialClass);
            var defaultTypeLabelClass = "format-number-label";
            var labelDiv = $('<div></div>').addClass(defaultTypeLabelClass);
            $('<label></label>').text(labelText).appendTo(labelDiv);
            var groupSelect = $('<select></select>').addClass(categoryName + '-select' + " " + selectGroup);
            for (var name in items) { /* NOSONAR: Forin*/
                groupSelect.append($('<option></option>').val(name).text(items[name]));
            }
            groupSelect.get(0).selectedIndex = 0;
            container.append(labelDiv).append(groupSelect);
            return container;
        };

        //#endregion
        FormatDialog.prototype._initNumberPicker = function () {
            this._createGeneralSetting();
            this._createNumberSetting();
            this._createAccountingSetting();
            this._createCurrencySetting();
            this._createDateSetting();
            this._createTimeSetting();
            this._createPercentageSetting();
            this._createFractionSetting();
            this._createScientificSetting();
            this._createTextSetting();
            this._createSpecialSetting();
            this._createCustomSetting();

            var self = this;

            function changeNumberPanel(e) {
                self._element.find(".gcui-numberpicker").addClass("hidden");
                var categoryName = self._element.find(".category-select option:selected").val();
                var categoryClass = "spread-format-" + categoryName;
                self._element.find(".gcui-numberpicker").each(function (index, element) {
                    if ($(element).hasClass(categoryClass)) {
                        $(element).removeClass("hidden");
                    }
                });
                self._numberCategoryChanged(e, categoryName);
            }

            var categorySelect = this._element.find(".category-select");
            categorySelect.bind("click", changeNumberPanel);
            categorySelect.bind("mousemove", function (e) {
                return false;
            });
            categorySelect.bind("change", changeNumberPanel);
        };

        FormatDialog.prototype._numberCategoryChanged = function (e, value) {
            if (value === 'general') {
                this._refreshGeneralSample();
            } else if (value === 'numbers') {
                var selectIndex = this._element.find('.negative-number-select').get(0).selectedIndex;
                this._refreshNumberSample(selectIndex);
                this._refreshNumberList();
            } else if (value === 'accounting') {
                this._refreshAccountingSample();
            } else if (value === 'currency') {
                this._refreshCurrencySample();
                this._refreshCurrencyNumberList();
            } else if (value === 'date') {
                this._refreshDateSample();
            } else if (value === 'time') {
                this._refreshTimeSample();
            } else if (value === 'percentage') {
                this._refreshPercentageSample();
            } else if (value === 'fraction') {
                this._refreshFractionSample();
            } else if (value === 'scientific') {
                this._refreshScientificSample();
            } else if (value === 'text') {
                this._refreshTextSample();
            } else if (value === 'special') {
                this._refreshSpecialSample();
            } else if (value === 'custom') {
                this._refreshCustomInput();
                this._refreshCustomSample();
            }

            this._updateCustomFormatter();
            this._updateCustomDeleteButton();
        };

        FormatDialog.prototype._createCurrencySetting = function () {
            var self = this;
            var decimalPlaces = this._getDecimalInput('currency-decimal-places-input', 'currency-decimal-places', "spread-format-currency");
            var symbol = this._getSymbolSelect(designer.res.accountingSymbol, 'currency-symbol-dropdown', "spread-format-currency");
            var para = this._getParagraph(designer.res.formatNumberComments.currencyComments, "currency");
            var typeSelect = this._getTypeSelect(designer.res.currencyNegativeNumbers, designer.res.formatNumberPickerSetting.negativeNumber, "currency-type", "spread-format-currency");

            this._element.find('.tab-number-setting').append(decimalPlaces).append(symbol);
            this._element.find(".tab-number-comments").append(para);
            this._element.find('.tab-number-setting').append(typeSelect);
            this._element.find('.currency-symbol-dropdown').get(0).selectedIndex = 1;

            this._element.find('.currency-type-select').change(function () {
                self._refreshCurrencySample();
            });
            this._element.find('.currency-symbol-dropdown').change(function () {
                self._refreshCurrencySample();
                self._refreshCurrencyNumberList();
            });
            this._element.find('.currency-decimal-places-input').spinner({
                min: 0,
                max: 16,
                change: function () {
                    var decimalPlace = self._element.find(".currency-decimal-places-input").val();
                    self._element.find('.format-decimal-input').val(decimalPlace);
                    self._refreshCurrencySample();
                    self._refreshCurrencyNumberList();
                },
                spin: function () {
                    var decimalPlace = arguments[1].value;
                    self._element.find('.format-decimal-input').val(decimalPlace);
                    self._refreshCurrencySample();
                    self._refreshCurrencyNumberList();
                }
            });
        };

        FormatDialog.prototype._createDateSetting = function () {
            var self = this;
            var dates = [];
            var allEngFormats = designer.res.dateFormats;
            for (var i = 0; i < allEngFormats.length; i++) {
                dates.push(this._getTextBySpread(this._defaultTime, allEngFormats[i]));
            }
            var typeSelect = this._getTypeSelect(dates, designer.res.formatNumberPickerSetting.type, "date-type", "spread-format-date");
            var para = this._getParagraph(designer.res.formatNumberComments.dateComments, "date");
            var localeCulture = this._getCultureSelect(designer.res.localeType, designer.res.formatNumberPickerSetting.locale, "date-type-locale", "spread-format-date", "type-locale-select");
            var calendar = this._getCultureSelect(designer.res.calendarType, designer.res.formatNumberPickerSetting.calendar, "date-type-calendar", "spread-format-date-calendar");

            this._element.find('.tab-number-setting').append(typeSelect).append(localeCulture).append(calendar);
            this._element.find(".tab-number-comments").append(para);

            this._element.find('.date-type-select').change(function () {
                self._refreshDateSample();
            });
            this._element.find('.date-type-locale-select').change(function () {
                //sync other locale select, such as time and special.
                var value = self._element.find('.date-type-locale-select').find('option:selected').val();
                self._element.find(".type-locale-select").val(value);
                self._updateDateType();
                self._refreshDateSample();

                //rebind type-select event.
                self._element.find('.date-type-select').change(function () {
                    self._refreshDateSample();
                });
            });
            this._element.find('.date-type-calendar-select').change(function () {
                self._updateDateType();
                self._refreshDateSample();

                //rebind type-select event.
                self._element.find('.date-type-select').change(function () {
                    self._refreshDateSample();
                });
            });
        };

        FormatDialog.prototype._updateDateType = function () {
            var dates = [];
            var locale = this._element.find('.date-type-locale-select').find('option:selected').val();
            var i;
            switch (locale) {
                case "ja_jp":
                    this._element.find('.spread-format-date-calendar').removeClass("hidden");
                    var calendar = this._element.find('.date-type-calendar-select').find('option:selected').val();
                    if (calendar === "western") {
                        var allJapanFormats = designer.res.japanWesternDateFormat;
                        for (i = 0; i < allJapanFormats.length; i++) {
                            dates.push(this._getTextBySpread(this._defaultTime, allJapanFormats[i]));
                        }
                    } else if (calendar === "JER") {
                        var JERFormats = designer.res.japanEmperorReignDateFormat;
                        for (i = 0; i < JERFormats.length; i++) {
                            dates.push(this._getTextBySpread(this._defaultTime, JERFormats[i]));
                        }
                    }
                    break;
                case "en_us":
                    this._element.find('.spread-format-date-calendar').addClass("hidden");
                    var allEnglishFormats = designer.res.dateFormats;
                    for (i = 0; i < allEnglishFormats.length; i++) {
                        dates.push(this._getTextBySpread(this._defaultTime, allEnglishFormats[i]));
                    }
                    break;
            }
            if (dates.length === 0) {
                return;
            }
            this._element.find(".date-type-container").remove();
            var localeTypeSelect = this._getTypeSelect(dates, designer.res.formatNumberPickerSetting.type, "date-type", "spread-format-date");
            localeTypeSelect.insertBefore(this._element.find(".date-type-locale-container"));
            localeTypeSelect.removeClass("hidden");
        };

        FormatDialog.prototype._createCustomSetting = function () {
            var self = this;

            var typeSelect = this._getTypeSelect(designer.res.customFormats, designer.res.formatNumberPickerSetting.type, "custom-type", "spread-format-custom");
            var para = this._getParagraph(designer.res.formatNumberComments.customComments, "custom");
            var customDiv = $('<div></div>').addClass('custom-type-div custom-class gcui-numberpicker hidden spread-format-custom');
            var customButton = $('<button></button>').addClass('custom-type-button custom-class');
            $('<span></span>').text(designer.res.formatNumberPickerSetting.deleted).appendTo(customButton);
            customDiv.append(customButton);

            this._element.find('.tab-number-setting').append(typeSelect).append(customDiv);
            this._element.find(".tab-number-comments").append(para);

            this._element.find('.custom-type-select').change(function () {
                var format = self._element.find('.custom-type-select').find('option:selected').text();
                self._element.find('.custom-type-input').val(format);
                self._refreshCustomSample();
                self._updateCustomDeleteButton();
            });
            this._element.find('.custom-type-input').bind("input propertychange", function () {
                self._refreshCustomSample();
                self._updateCustomDeleteButton();
            });
            this._element.find('.custom-type-button').click(function () {
                self._updateCustomFormatter(false);
                self._currentFormat = keyword_undefined;
                self._element.find('.custom-type-input').val('');
                self._element.find('.sample-display').text(self._getTextBySpread(self._originalText, ''));
            });
        };

        FormatDialog.prototype._updateCustomDeleteButton = function () {
            var allFormats = designer.res.customFormats;
            var format = this._element.find('.custom-type-input').val();

            if ($.inArray(format, this._addFormats) >= 0 || $.inArray(format, allFormats) < 0) {
                this._element.find('.custom-type-button').attr('disabled', false);
                return;
            }
            this._element.find('.custom-type-button').attr('disabled', true);
        };

        FormatDialog.prototype._updateCustomFormatter = function (increase) {
            var format = this._element.find('.custom-type-input').val();
            if (increase === undefined) {
                increase = true;
            }
            if (format) {
                var allFormats = designer.res.customFormats;
                if (increase) {
                    if ($.inArray(format, allFormats) >= 0) {
                        return;
                    }
                    if ($.inArray(format, this._addFormats) < 0) {
                        this._addFormats.push(format);
                        $.merge(designer.res.customFormats, [format]);
                    }
                } else {
                    if ($.inArray(format, allFormats) < 0) {
                        return;
                    }
                    var posAll = $.inArray(format, allFormats);
                    var posAdd = $.inArray(format, this._addFormats);
                    if (posAll >= 0 && posAdd >= 0) {
                        this._addFormats.splice(posAdd, 1);
                        allFormats.splice(posAll, 1);
                    }
                }
                var groupSelect = this._element.find('.custom-type-select');
                groupSelect.empty();
                for (var i = 0; i < allFormats.length; i++) {
                    groupSelect.append($('<option></option>').val(allFormats[i]).text(allFormats[i]));
                }
            }
        };

        FormatDialog.prototype._createTimeSetting = function () {
            var self = this;
            var times = [];
            var allFormats = designer.res.timeFormats;
            for (var i = 0; i < allFormats.length; i++) {
                times.push(this._getTextBySpread(this._defaultTime, allFormats[i]));
            }
            var typeSelect = this._getTypeSelect(times, designer.res.formatNumberPickerSetting.type, "time-type", "spread-format-time");
            var para = this._getParagraph(designer.res.formatNumberComments.timeComments, "time");
            var localeCulture = this._getCultureSelect(designer.res.localeType, designer.res.formatNumberPickerSetting.locale, "time-type-locale", "spread-format-time", "type-locale-select");

            this._element.find('.tab-number-setting').append(typeSelect).append(localeCulture);
            this._element.find(".tab-number-comments").append(para);

            this._element.find('.time-type-select').change(function () {
                self._refreshTimeSample();
            });
            this._element.find('.time-type-locale-select').change(function () {
                var value = self._element.find('.time-type-locale-select').find('option:selected').val();
                self._element.find('.type-locale-select').val(value);
                self._updateTimeType();
                self._refreshTimeSample();

                //rebind event
                self._element.find('.time-type-select').change(function () {
                    self._refreshTimeSample();
                });
            });
        };

        FormatDialog.prototype._updateTimeType = function () {
            var times = [];
            var locale = this._element.find('.time-type-locale-select').find('option:selected').val();
            var i;
            switch (locale) {
                case "ja_jp":
                    var allJapanFormats = designer.res.japanTimeFormats;
                    for (i = 0; i < allJapanFormats.length; i++) {
                        times.push(this._getTextBySpread(this._defaultTime, allJapanFormats[i]));
                    }
                    break;
                case "en_us":
                    var allEnglishFormats = designer.res.timeFormats;
                    for (i = 0; i < allEnglishFormats.length; i++) {
                        times.push(this._getTextBySpread(this._defaultTime, allEnglishFormats[i]));
                    }
                    break;
            }
            if (times.length === 0) {
                return;
            }
            this._element.find(".time-type-container").remove();
            var localeTypeSelect = this._getTypeSelect(times, designer.res.formatNumberPickerSetting.type, "time-type", "spread-format-time");
            localeTypeSelect.insertBefore(this._element.find(".time-type-locale-container"));
            localeTypeSelect.removeClass("hidden");
        };

        FormatDialog.prototype._createPercentageSetting = function () {
            var self = this;
            var decimalPlaces = this._getDecimalInput('percentage-decimal-places-input', 'percentage-decimal-places', "spread-format-percentage");
            var para = this._getParagraph(designer.res.formatNumberComments.percentageComments, "percentage");

            this._element.find(".tab-number-comments").append(para);
            this._element.find('.tab-number-setting').append(decimalPlaces);

            this._element.find('.percentage-decimal-places-input').spinner({
                min: 0,
                max: 16,
                change: function () {
                    var decimalPlace = self._element.find(".percentage-decimal-places-input").val();
                    self._element.find('.format-decimal-input').val(decimalPlace);
                    self._refreshPercentageSample();
                },
                spin: function () {
                    var decimalPlace = arguments[1].value;
                    self._element.find('.format-decimal-input').val(decimalPlace);
                    self._refreshPercentageSample();
                }
            });
        };

        FormatDialog.prototype._createScientificSetting = function () {
            var self = this;
            var decimalPlaces = this._getDecimalInput("scientific-decimal-places-input", "scientific-decimal-places", "spread-format-scientific");
            this._element.find('.tab-number-setting').append(decimalPlaces);

            this._element.find('.scientific-decimal-places-input').spinner({
                min: 0,
                max: 16,
                change: function () {
                    var decimalPlace = self._element.find(".scientific-decimal-places-input").val();
                    self._element.find('.format-decimal-input').val(decimalPlace);
                    self._refreshScientificSample();
                },
                spin: function () {
                    var decimalPlace = arguments[1].value;
                    self._element.find('.format-decimal-input').val(decimalPlace);
                    self._refreshScientificSample();
                }
            });
        };

        FormatDialog.prototype._createFractionSetting = function () {
            var self = this;
            var typeSelect = this._getTypeSelect(designer.res.fractionType, designer.res.formatNumberPickerSetting.type, "fraction-type", "spread-format-fraction");
            this._element.find('.tab-number-setting').append(typeSelect);

            this._element.find('.fraction-type-select').change(function () {
                self._refreshFractionSample();
            });
        };

        FormatDialog.prototype._createSpecialSetting = function () {
            var self = this;
            var typeSelect = this._getTypeSelect(designer.res.specialType, designer.res.formatNumberPickerSetting.type, "special-type", "spread-format-special");
            var para = this._getParagraph(designer.res.formatNumberComments.specialComments, "special");
            var localeCulture = this._getCultureSelect(designer.res.localeType, designer.res.formatNumberPickerSetting.locale, "special-type-locale", "spread-format-special", "special-locale-select");

            this._element.find('.tab-number-setting').append(typeSelect).append(localeCulture);
            this._element.find(".tab-number-comments").append(para);

            this._element.find('.special-type-select').change(function () {
                self._refreshSpecialSample();
            });
            this._element.find('.special-type-locale-select').change(function () {
                var value = self._element.find('.special-type-locale-select').find('option:selected').val();
                self._element.find('.type-locale-select').val(value);
                self._updateSpecialType();
                self._refreshSpecialSample();

                //rebind event
                self._element.find('.special-type-select').change(function () {
                    self._refreshSpecialSample();
                });
            });
        };

        FormatDialog.prototype._updateSpecialType = function () {
            var types = designer.res.specialType;
            var locale = this._element.find('.special-type-locale-select').find('option:selected').val();
            switch (locale) {
                case "ja_jp":
                    types = designer.res.specialJapanType;
                    break;
                case "en_us":
                    types = designer.res.specialType;
                    break;
            }
            if (types.length === 0) {
                return;
            }
            this._element.find(".special-type-container").remove();
            var localeTypeSelect = this._getTypeSelect(types, designer.res.formatNumberPickerSetting.type, "special-type", "spread-format-special");
            localeTypeSelect.insertBefore(this._element.find(".special-type-locale-container"));
            localeTypeSelect.removeClass("hidden");
        };

        FormatDialog.prototype._createAccountingSetting = function () {
            var self = this;
            var decimalPlaces = this._getDecimalInput('accounting-decimal-places-input', 'accounting-decimal-places', "spread-format-accounting");
            var symbol = this._getSymbolSelect(designer.res.accountingSymbol, 'accounting-symbol-dropdown', "spread-format-accounting");
            var para = this._getParagraph(designer.res.formatNumberComments.accountingComments, "accounting");

            this._element.find('.tab-number-setting').append(decimalPlaces).append(symbol);
            this._element.find(".tab-number-comments").append(para);
            this._element.find('.accounting-symbol-dropdown').get(0).selectedIndex = 1;

            this._element.find('.accounting-symbol-dropdown').change(function () {
                self._refreshAccountingSample();
            });
            this._element.find('.accounting-decimal-places-input').spinner({
                min: 0,
                max: 16,
                change: function () {
                    var decimalPlace = self._element.find(".accounting-decimal-places-input").val();
                    self._element.find('.format-decimal-input').val(decimalPlace);
                    self._refreshAccountingSample();
                },
                spin: function () {
                    var decimalPlace = arguments[1].value;
                    self._element.find('.format-decimal-input').val(decimalPlace);
                    self._refreshAccountingSample();
                }
            });
        };

        FormatDialog.prototype._defaultFormatSetting = function () {
            this._element.find('.category-select').val('general').trigger('change');
            this._element.find('.category-select').get(0).selectedIndex = -1;
            this._element.find('.format-decimal-input').val(2);
            this._element.find('.currency-symbol-dropdown').get(0).selectedIndex = 1;
            this._element.find('.accounting-symbol-dropdown').get(0).selectedIndex = 1;
            this._element.find('.currency-type-select').get(0).selectedIndex = 0;
            this._currentFormat = keyword_undefined;
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._createGeneralSetting = function () {
            var para = this._getParagraph(designer.res.formatNumberComments.generalComments, "general");
            this._element.find(".tab-number-setting").append(para);
        };

        FormatDialog.prototype._createTextSetting = function () {
            var para = this._getParagraph(designer.res.formatNumberComments.textComments, "text");
            this._element.find(".tab-number-setting").append(para);
        };

        FormatDialog.prototype._createNumberSetting = function () {
            var self = this;

            var decimalPlaces = this._getDecimalInput('decimal-places-input', 'decimal-places', "spread-format-numbers");
            var separator = this._getSeparatorCheckbox('separator-input', 'thousand-separator', "spread-format-numbers");
            var typeSelect = this._getTypeSelect(designer.res.negativeNumbers, designer.res.formatNumberPickerSetting.negativeNumber, "negative-number", "spread-format-numbers");
            var para = this._getParagraph(designer.res.formatNumberComments.numberComments, "numbers");

            this._element.find('.tab-number-setting').append(decimalPlaces).append(separator);
            this._element.find('.tab-number-setting').append(typeSelect);
            this._element.find(".tab-number-comments").append(para);

            this._element.find('.negative-number-select').change(function () {
                var selectIndex = this.selectedIndex;
                self._refreshNumberSample(selectIndex);
            });
            this._element.find('.separator-input').change(function () {
                self._refreshNumberList();
                var selectIndex = self._element.find('.negative-number-select').get(0).selectedIndex;
                self._refreshNumberSample(selectIndex);
            });
            this._element.find('.decimal-places-input').spinner({
                min: 0,
                max: 16,
                change: function () {
                    var decimalPlace = self._element.find(".decimal-places-input").val();
                    self._element.find('.format-decimal-input').val(decimalPlace);
                    self._refreshNumberList();
                    var selectIndex = self._element.find('.negative-number-select').get(0).selectedIndex;
                    self._refreshNumberSample(selectIndex);
                },
                spin: function () {
                    var decimalPlace = arguments[1].value;
                    self._element.find('.format-decimal-input').val(decimalPlace);
                    self._refreshNumberList();
                    var selectIndex = self._element.find('.negative-number-select').get(0).selectedIndex;
                    self._refreshNumberSample(selectIndex);
                }
            });
        };

        FormatDialog.prototype._refreshGeneralSample = function () {
            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, designer.res.generalFormat));
            this._currentFormat = "General";
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._refreshTextSample = function () {
            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, designer.res.textFormats[0]));
            this._currentFormat = '@';
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._refreshAccountingSample = function () {
            var selectIndex = this._element.find('.accounting-symbol-dropdown').get(0).selectedIndex;
            var decimalPlace = this._element.find('.accounting-decimal-places-input').val();
            var format = this._getAccountingFormat(decimalPlace, selectIndex);
            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, format));
            this._currentFormat = format;
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._refreshNumberList = function () {
            var isChecked = this._element.find('.separator-input').prop('checked');
            var groupItems = designer.res.negativeNumbers;
            var numberValue = '1234.10';
            var decimalPlace = parseInt(this._element.find('.decimal-places-input').val());

            if (decimalPlace > 0) {
                var decimalPart = "";
                for (var i = 0; i < decimalPlace; i++) {
                    decimalPart = (i % 10).toString() + decimalPart.substring(0);
                }
                numberValue = numberValue.substring(0, numberValue.indexOf('.') + 1) + decimalPart;
            } else {
                numberValue = numberValue.substring(0, numberValue.indexOf('.'));
            }
            if (isChecked) {
                var index = numberValue.indexOf('1');
                numberValue = numberValue.substring(0, index + 1) + ',' + numberValue.substring(index + 1);
            }

            for (var name in groupItems) { /* NOSONAR: Forin*/
                var result = numberValue;
                var item = groupItems[name];
                if (item.indexOf('-') !== -1) {
                    result = '-' + result;
                }
                if (item.indexOf(')') !== -1) {
                    result = '(' + result + ')';
                }
                this._element.find('.negative-number-select').find("option[value='" + name + "']").text(result);
            }
        };

        FormatDialog.prototype._refreshCurrencyNumberList = function () {
            var decimalPlace = parseInt(this._element.find('.currency-decimal-places-input').val());
            var groupItems = designer.res.currencyNegativeNumbers;
            var numberValue = '1,234.10';
            var symbolSelectIndex = this._element.find('.currency-symbol-dropdown').get(0).selectedIndex;
            if (decimalPlace > 0) {
                var decimalPart = "";
                for (var i = 0; i < decimalPlace; i++) {
                    decimalPart = (i % 10).toString() + decimalPart.substring(0);
                }
                numberValue = numberValue.substring(0, numberValue.indexOf('.') + 1) + decimalPart;
            } else {
                numberValue = numberValue.substring(0, numberValue.indexOf('.'));
            }

            var symbol = designer.res.accountingSymbol[symbolSelectIndex][1];
            if (symbol === designer.res.accountingSymbol[0][0]) {
                symbol = "";
            }
            var isFirstNegative = true;
            for (var name in groupItems) { /* NOSONAR: Forin*/
                var result = numberValue;
                var item = groupItems[name];
                if (item.indexOf('-') !== -1 && isFirstNegative) {
                    result = '-' + symbol + result;
                    isFirstNegative = false;
                } else if (item.indexOf('-') !== -1) {
                    result = symbol + '-' + result;
                } else {
                    result = symbol + result;
                }
                this._element.find('.currency-type-select').find("option[value='" + name + "']").text(result);
            }
        };

        FormatDialog.prototype._refreshNumberSample = function (selectIndex) {
            var useSeparator = this._element.find('.separator-input').prop('checked');
            var decimalPlace = parseInt(this._element.find('.decimal-places-input').val());
            var format = this._getNumberFormatter(selectIndex, decimalPlace, useSeparator);
            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, format));
            this._currentFormat = format;
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._refreshCustomSample = function () {
            var format = this._element.find('.custom-type-input').val();
            if (this._isMatch(format)) {
                this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, format));
                this._currentFormat = format;
                this._cacheStyle['formatter'](this._currentFormat);
            }
        };

        FormatDialog.prototype._isMatch = function (format) {
            var arr = [];
            for (var i = 0; i < format.length; i++) {
                if (format[i] === '[') {
                    arr.push(i);
                }
                if (format[i] === ']') {
                    if (arr.length === 0) {
                        return false;
                    }
                    arr.pop();
                }
            }
            if (arr.length === 0) {
                return true;
            }
            return false;
        };

        FormatDialog.prototype._refreshCustomInput = function () {
            if (this._currentFormat) {
                this._element.find('.custom-type-input').val(this._currentFormat);
            } else {
                var format = this._element.find('.custom-type-select').find('option:selected').text();
                this._element.find('.custom-type-input').val(format);
            }
        };

        FormatDialog.prototype._refreshFractionSample = function () {
            var allFormats = designer.res.fractionFormats;
            var selectIndex = this._element.find('.fraction-type-select').get(0).selectedIndex;
            var format = allFormats[selectIndex];
            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, format));
            this._currentFormat = format;
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._refreshSpecialSample = function () {
            var allFormats = designer.res.specialFormats;
            var selectIndex = this._element.find('.special-type-select').get(0).selectedIndex;
            var localeName = this._element.find('.special-type-locale-select').find('option:selected').val();
            switch (localeName) {
                case "ja_jp":
                    allFormats = designer.res.specialJapanFormats;
                    break;
                case "en_us":
                    allFormats = designer.res.specialFormats;
                    break;
            }
            var format = allFormats[selectIndex];
            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, format));
            this._currentFormat = format;
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._refreshScientificSample = function () {
            var format;
            var decimalPlace = this._element.find('.scientific-decimal-places-input').val();
            var decimalPart = "";
            if (decimalPlace > 0) {
                for (var i = 0; i < decimalPlace; i++) {
                    decimalPart += '0';
                }
                format = '0.' + decimalPart + 'E+00';
            } else {
                format = '0E+00';
            }
            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, format));
            this._currentFormat = format;
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._refreshPercentageSample = function () {
            var decimalPlace = this._element.find('.percentage-decimal-places-input').val();
            var decimalPart = "";
            var format;
            if (decimalPlace > 0) {
                for (var i = 0; i < decimalPlace; i++) {
                    decimalPart += '0';
                }
                format = '0.' + decimalPart + '%';
            } else {
                format = '0%';
            }

            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, format));
            this._currentFormat = format;
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._refreshTimeSample = function () {
            var selectIndex = this._element.find('.time-type-select').get(0).selectedIndex;
            var allFormats = designer.res.timeFormats;
            var localeName = this._element.find('.time-type-locale-select').find('option:selected').val();
            switch (localeName) {
                case "ja_jp":
                    allFormats = designer.res.japanTimeFormats;
                    break;
                case "en_us":
                    allFormats = designer.res.timeFormats;
                    break;
            }
            var format = allFormats[selectIndex];
            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, format));
            this._currentFormat = format;
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._refreshDateSample = function () {
            var selectIndex = this._element.find('.date-type-select').get(0).selectedIndex;
            var allFormats = designer.res.dateFormats;
            var localeName = this._element.find('.date-type-locale-select').find('option:selected').val();
            switch (localeName) {
                case "ja_jp":
                    this._element.find('.spread-format-date-calendar').removeClass("hidden");
                    var calendarName = this._element.find('.date-type-calendar-select').find('option:selected').val();
                    if (calendarName === "western") {
                        allFormats = designer.res.japanWesternDateFormat;
                    } else if (calendarName === "JER") {
                        allFormats = designer.res.japanEmperorReignDateFormat;
                    }
                    break;
                case "en_us":
                    this._element.find('.spread-format-date-calendar').addClass("hidden");
                    allFormats = designer.res.dateFormats;
                    break;
            }
            var format = allFormats[selectIndex];
            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, format));
            this._currentFormat = format;
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._refreshCurrencySample = function () {
            var decimalPlace = this._element.find('.currency-decimal-places-input').val();
            var selectIndex = this._element.find('.currency-type-select').get(0).selectedIndex;
            var format = this._getCurrencyFormat(selectIndex, decimalPlace);
            this._element.find('.sample-display').text(this._getTextBySpread(this._originalText, format));
            this._currentFormat = format;
            this._cacheStyle['formatter'](this._currentFormat);
        };

        FormatDialog.prototype._getTextBySpread = function (value, format) {
            var sheet = this._formatNumberSpread.getActiveSheet();
            sheet.setFormatter(0, 0, format);
            sheet.setValue(0, 0, value);
            return sheet.getText(0, 0);
        };

        FormatDialog.prototype._getCurrencyFormat = function (currencyIndex, decimalPlace) {
            var symbolCode;
            var symbolStr;
            if (currencyIndex === -1) {
                currencyIndex = 0;
            }
            var format = designer.res.currencyFormats[currencyIndex];
            var i;
            if (decimalPlace > 0) {
                var decimalDigits = "";
                for (i = 0; i < decimalPlace; i++) {
                    decimalDigits += '0';
                }
                format = format.replace(/#0/g, '#0.' + decimalDigits);
            }
            var splitsFormats = format.split(';');
            var symbols = designer.res.accountingSymbol;
            var selectIndex = this._element.find('.currency-symbol-dropdown').get(0).selectedIndex;
            symbolCode = symbols[selectIndex][1];
            var cultureName = symbols[selectIndex][2];
            var cultureId = cultureNameToIdMap[cultureName && cultureName.toLowerCase()] || cultureName;
            var formatPiece, redIndex, charLength, temp;
            if (symbolCode === null) {
                return format;
            } else if (symbolCode === "$") {
                format = "";
                symbolStr = "$";
                for (i = 0; i < splitsFormats.length; i++) {
                    formatPiece = splitsFormats[i];
                    redIndex = formatPiece.indexOf('[Red]');
                    charLength = 5;
                    if (redIndex !== -1) {
                        temp = formatPiece.substring(0, redIndex + charLength) + symbolStr + formatPiece.substring(redIndex + charLength);
                        format = format + temp + ";";
                    } else {
                        format = format + symbolStr + formatPiece + ";";
                    }
                }
            } else {
                format = "";
                for (i = 0; i < splitsFormats.length; i++) {
                    formatPiece = splitsFormats[i];
                    redIndex = formatPiece.indexOf('[Red]');
                    charLength = 5;
                    if (redIndex !== -1) {
                        temp = formatPiece.substring(0, redIndex + charLength) + '[$' + symbolCode + '-' + cultureId + ']' + formatPiece.substring(redIndex + charLength);
                        format = format + temp + ";";
                    } else {
                        format = format + '[$' + symbolCode + '-' + cultureId + ']' + formatPiece + ";";
                    }
                }
            }

            if (format !== "" && format.charAt(format.length - 1) === ";") {
                format = format.substring(0, format.length - 1);
            }
            return format;
        };

        FormatDialog.prototype._getAccountingFormat = function (decimalPlace, selectIndex) {
            var symbols = designer.res.accountingSymbol;
            var format = designer.res.accountingFormats[0];
            var symbolCode = symbols[selectIndex][1];
            var cultureName = symbols[selectIndex][2];
            var symbolStr;
            var cultureId = cultureNameToIdMap[cultureName && cultureName.toLowerCase()] || cultureName;
            if (decimalPlace > 0) {
                var decimalDigits = "";
                for (var i = 0; i < decimalPlace; i++) {
                    decimalDigits += '0';
                }
                format = format.replace(/#0/g, "#0." + decimalDigits);
            }
            var splitsFormats = format.split(';');
            var formatPiect0, formatPiect1, formatPiect2, formatPiect3;
            if (symbolCode === null) {
                return format;
            } else if (symbolCode === "$") {
                symbolStr = " " + "$";
                formatPiect0 = splitsFormats[0].replace(/_\(\*/g, symbolStr + "*");
                formatPiect0 = formatPiect0.replace(/_\)/g, " ");

                formatPiect1 = splitsFormats[1].replace(/_\(\*/g, symbolStr + "*");
                formatPiect1 = formatPiect1.replace(/\(/g, "");
                formatPiect1 = formatPiect1.replace(/\)/g, " ");

                formatPiect2 = splitsFormats[2].replace(/_\(\*/, symbolStr + "*");
                formatPiect2 = formatPiect2.replace(/_\)/g, " ");

                formatPiect3 = splitsFormats[3].replace(/_\(/g, " ");
                formatPiect3 = formatPiect3.replace(/_\)/g, " ");

                format = formatPiect0 + ";" + formatPiect1 + ";" + formatPiect2 + ";" + formatPiect3;
            } else {
                formatPiect0 = splitsFormats[0].replace(/_\(\*/g, "_-[$" + symbolCode + "-" + cultureId + "]*");
                formatPiect0 = formatPiect0.replace(/_\)/, "_-");

                formatPiect1 = splitsFormats[1].replace(/_\(\*/g, "-[$" + symbolCode + "-" + cultureId + "]*");
                formatPiect1 = formatPiect1.replace(/\(/g, "");
                formatPiect1 = formatPiect1.replace(/\)/g, "_-");

                formatPiect2 = splitsFormats[2].replace(/_\(\*/g, "_-[$" + symbolCode + "-" + cultureId + "]*");
                formatPiect2 = formatPiect2.replace(/_\)/g, "_-");

                formatPiect3 = splitsFormats[3].replace(/_\(/g, "_-");
                formatPiect3 = formatPiect3.replace(/_\)/g, "_-");

                format = formatPiect0 + ";" + formatPiect1 + ";" + formatPiect2 + ";" + formatPiect3;
            }
            return format;
        };

        FormatDialog.prototype._getNumberFormatter = function (selectIndex, decimalPlace, useSeparator) {
            var numberFormats = designer.res.numberFormats;
            var numberFormatCount = numberFormats.length / 2;
            var format = numberFormats[selectIndex];
            if (useSeparator) {
                format = numberFormats[selectIndex + numberFormatCount];
            }
            if (decimalPlace > 0) {
                var decimalDigits = "";
                for (var i = 0; i < decimalPlace; i++) {
                    decimalDigits += '0';
                }
                format = format.replace(/0/g, '0.' + decimalDigits);
            }
            return format;
        };

        //get the format from spread object
        FormatDialog.prototype._updateNumberPanelSpreadObject = function (format, spread) {
            var sheet = spread.getActiveSheet();
            var selections = sheet.getSelections();
            var length = selections.length;
            if (length === 0) {
                return;
            }
            var row = selections[0].row === -1 ? 0 : selections[0].row;
            var col = selections[0].col === -1 ? 0 : selections[0].col;
            var currentValue = sheet.getValue(row, col);
            if (currentValue === null || currentValue === undefined) {
                currentValue = "";
            }
            for (var i = 0; i < length; i++) {
                row = selections[i].row === -1 ? 0 : selections[i].row;
                col = selections[i].col === -1 ? 0 : selections[i].col;
                if (format === undefined) {
                    if (currentValue === "") {
                        break;
                    }
                } else if (format !== sheet.getFormatter(row, col)) {
                    format = keyword_undefined;
                }
            }

            var dateFormat = this._getSelectionDateFormat();
            if (dateFormat && !this._isDateFormat(format)) {
                format = dateFormat;
            }

            this._originalText = currentValue;
            this._currentFormat = format;

            if (format !== undefined) {
                this._element.find('.sample-display').text(this._getTextBySpread(currentValue, format));
                this._parseFormat(format);
            } else {
                this._defaultFormatSetting();
            }
        };

        //get the format directly.
        FormatDialog.prototype._updateNumberPanel = function (format) {
            this._currentFormat = format;
            if (format !== undefined) {
                this._parseFormat(format);
            } else {
                this._defaultFormatSetting();
            }
        };

        FormatDialog.prototype._parseFormat = function (format) {
            var decimalPlace = 0;
            var useSeparator = false;
            var dateFormats = designer.res.dateFormats;
            var dateJapanWestFormats = designer.res.japanWesternDateFormat;
            var dateJapanJERFormats = designer.res.japanEmperorReignDateFormat;
            var timeFormats = designer.res.timeFormats;
            var timeJapanFormats = designer.res.japanTimeFormats;
            var specialFormats = designer.res.specialFormats;
            var specialJapanFormats = designer.res.specialJapanFormats;
            var numberFormats = designer.res.numberFormats;
            var currencyFormats = designer.res.currencyFormats;
            var accountingFormats = designer.res.accountingFormats;
            var percentageFormats = designer.res.percentageFormats;
            var scientificFormats = designer.res.scientificFormats;
            var fractionFormats = designer.res.fractionFormats;
            var customFormats = designer.res.customFormats;
            var i;

            this._element.find('.custom-type-input').val(format);

            var dateFormat = this._isDateFormat(format);
            if (dateFormat) {
                this._element.find('.category-select').val('date').trigger('change');
                var dateIndex = $.inArray(dateFormat, dateFormats);
                if (dateIndex >= 0) {
                    this._element.find('.date-type-locale-select').val("en_us").trigger('change');
                    this._element.find('.date-type-select').get(0).selectedIndex = dateIndex;
                    this._element.find('.date-type-select').trigger("change");
                    return;
                } else if ((dateIndex = $.inArray(dateFormat, dateJapanWestFormats)) >= 0) {
                    this._element.find('.date-type-locale-select').val("ja_jp").trigger('change');
                    this._element.find('.date-type-calendar-select').val("western").trigger('change');
                    this._element.find('.date-type-select').get(0).selectedIndex = dateIndex;
                    this._element.find('.date-type-select').trigger("change");
                    return;
                } else if ((dateIndex = $.inArray(dateFormat, dateJapanJERFormats)) >= 0) {
                    this._element.find('.date-type-locale-select').val("ja_jp").trigger('change');
                    this._element.find('.date-type-calendar-select').val("JER").trigger('change');
                    this._element.find('.date-type-select').get(0).selectedIndex = dateIndex;
                    this._element.find('.date-type-select').trigger("change");
                    return;
                }
            }

            var timeIndex = $.inArray(format, timeFormats);
            if (timeIndex >= 0) {
                this._element.find('.category-select').val('time').trigger('change');
                this._element.find('.time-type-locale-select').val('en_us').trigger('change');
                this._element.find('.time-type-select').get(0).selectedIndex = timeIndex;
                this._element.find('.time-type-select').trigger("change");
                return;
            } else {
                timeIndex = $.inArray(format, timeJapanFormats);
                if (timeIndex >= 0) {
                    this._element.find('.category-select').val('time').trigger('change');
                    this._element.find('.time-type-locale-select').val('ja_jp').trigger('change');
                    this._element.find('.time-type-select').get(0).selectedIndex = timeIndex;
                    this._element.find('.time-type-select').trigger("change");
                    return;
                }
            }

            var specialIndex = $.inArray(format, specialFormats);
            if (specialIndex >= 0) {
                this._element.find('.category-select').val('special').trigger('change');
                this._element.find('.special-type-locale-select').val('en_us').trigger('change');
                this._element.find('.special-type-select').get(0).selectedIndex = specialIndex;
                this._element.find('.special-type-select').trigger("change");
                return;
            } else {
                specialIndex = $.inArray(format, specialJapanFormats);
                if (specialIndex >= 0) {
                    this._element.find('.category-select').val('special').trigger('change');
                    this._element.find('.special-type-locale-select').val('ja_jp').trigger('change');
                    this._element.find('.special-type-select').get(0).selectedIndex = specialIndex;
                    this._element.find('.special-type-select').trigger("change");
                    return;
                }
            }

            for (i = 0; i < fractionFormats.length; i++) {
                if (format === fractionFormats[i]) {
                    this._element.find('.category-select').val('fraction').trigger('change');
                    this._element.find('.fraction-type-select').get(0).selectedIndex = i;
                    this._element.find('.fraction-type-select').trigger("change");
                    return;
                }
            }

            if (format === "General") {
                this._element.find('.category-select').val('general').trigger('change');
                return;
            }
            if (format === "@") {
                this._element.find('.category-select').val('text').trigger('change');
                return;
            }
            if (format.indexOf('.') !== -1) {
                var n = format.indexOf('.');
                for (i = n + 1; i < format.length; i++) {
                    if (format.substring(i, i + 1) === '0') {
                        decimalPlace++;
                    } else {
                        break;
                    }
                }
                this._element.find(".format-decimal-input").val(decimalPlace);
            }

            var replaceStr = format.substring(format.indexOf('.'), format.indexOf('.') + decimalPlace + 1);
            var tempFormat = format.replace(new RegExp(replaceStr, 'g'), "");
            for (i = 0; i < numberFormats.length; i++) {
                if (tempFormat === numberFormats[i]) {
                    this._element.find('.category-select').val('numbers').trigger('change');
                    this._element.find('.negative-number-select').get(0).selectedIndex = (i % 4);
                    this._element.find('.negative-number-select').trigger("change");
                    if (format.indexOf('#,') !== -1) {
                        useSeparator = true;
                        this._element.find('.separator-input').prop("checked", useSeparator);
                    }
                    return;
                }
            }
            if (format.indexOf('$') !== -1) {
                tempFormat = tempFormat.replace(/\$/g, "");
            }
            var tempCurrencyFormat = tempFormat.replace(/\[¥-804]|\[¥-411]/g, "");
            for (i = 0; i < currencyFormats.length; i++) {
                if (tempCurrencyFormat === currencyFormats[i]) {
                    var selectedIndex;
                    this._element.find('.category-select').val('currency').trigger('change');
                    this._element.find('.currency-type-select').get(0).selectedIndex = (i % 4);
                    this._element.find('.currency-type-select').trigger("change");
                    if (tempFormat.indexOf('¥-804') >= 0) {
                        selectedIndex = 2;
                    } else if (tempFormat.indexOf('¥-411') >= 0) {
                        selectedIndex = 3;
                    } else {
                        selectedIndex = 1;
                    }
                    this._element.find('.currency-symbol-dropdown').get(0).selectedIndex = selectedIndex;
                    return;
                }
            }
            var accountingFormatsLength = accountingFormats.length;
            for (var j = 0; j < accountingFormatsLength; j++) {
                if (format === accountingFormats[j]) {
                    this._element.find('.category-select').val('accounting').trigger('change');
                    this._element.find('.accounting-symbol-dropdown').get(0).selectedIndex = (j % accountingFormatsLength) - 1;
                    return;
                }
            }
            if (tempFormat === scientificFormats[0]) {
                this._element.find('.category-select').val('scientific').trigger('change');
                return;
            }
            if (tempFormat === percentageFormats[0]) {
                this._element.find('.category-select').val('percentage').trigger('change');
                return;
            }

            var customIndex = $.inArray(format, customFormats);
            if (customIndex >= 0) {
                this._element.find('.category-select').val('custom').trigger('change');
                this._element.find('.custom-type-select').get(0).selectedIndex = customIndex;
                this._element.find('.custom-type-select').trigger("change");

            } else {
                this._element.find('.category-select').val('custom').trigger('change');
            }
        };

        FormatDialog.prototype.selectTab = function (options) {
            if (options.numbers) {
                this._element.find(".tab-number-li").css("display", "block");
            } else {
                this._element.find(".tab-number-li").css("display", "none");
            }
            if (options.alignment) {
                this._element.find(".tab-alignment-li").css("display", "block");
            } else {
                this._element.find(".tab-alignment-li").css("display", "none");
            }
            if (options.font) {
                this._element.find(".tab-font-li").css("display", "block");
            } else {
                this._element.find(".tab-font-li").css("display", "none");
            }
            if (options.border) {
                this._element.find(".tab-border-li").css("display", "block");
            } else {
                this._element.find(".tab-border-li").css("display", "none");
            }
            if (options.fill) {
                this._element.find(".tab-fill-li").css("display", "block");
            } else {
                this._element.find(".tab-fill-li").css("display", "none");
            }
            if (options.protection) {
                this._element.find(".tab-protection-li").css("display", "block");
            } else {
                this._element.find(".tab-protection-li").css("display", "none");
            }
            if (options.padding) {
                this._element.find(".tab-cellLabel-li").css("display", "block");
            } else {
                this._element.find(".tab-cellLabel-li").css("display", "none");
            }
        };

        FormatDialog.prototype._updateRibbonFormat = function () {
            designer.ribbon.updateCellStyle();
            designer.ribbon.updateMerge();
            designer.ribbon.updateFormat();
        };

        FormatDialog.prototype._getSelectionDateFormat = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var format;
            var ranges = sheet.getSelections();
            if (!ranges || ranges.length === 0) {
                return null;
            }
            var row = ranges[0].row === -1 ? 0 : ranges[0].row;
            var col = ranges[0].col === -1 ? 0 : ranges[0].col;
            if (sheet.getValue(row, col) instanceof Date) {
                format = this._getDateFormat(sheet.getValue(row, col), row, col);
            } else {
                return null;
            }

            for (var k = 0; k < ranges.length; k++) {
                var selection = ranges[k];
                row = selection.row === -1 ? 0 : selection.row;
                col = selection.col === -1 ? 0 : selection.col;
                var rowCount = selection.rowCount;
                var colCount = selection.colCount;
                for (var i = row; i < row + rowCount; i++) {
                    for (var j = col; j < col + colCount; j++) {
                        var value = sheet.getValue(i, j);
                        if (!(value instanceof Date && this._getDateFormat(sheet.getValue(i, j), i, j) === format)) {
                            return null;
                        }
                    }
                }
            }
            return format;
        };

        FormatDialog.prototype._getDateFormat = function (value, row, col) {
            var allFormats = designer.res.dateFormats;
            var dateJapanWestFormats = designer.res.japanWesternDateFormat;
            var dateJapanJERFormats = designer.res.japanEmperorReignDateFormat;
            var sheet = designer.wrapper.spread.getActiveSheet();
            var text = sheet.getText(row, col);
            var i;
            for (i = 0; i < allFormats.length; i++) {
                if (this._getTextBySpread(value, allFormats[i]) === text) {
                    return allFormats[i];
                }
            }
            for (i = 0; i < dateJapanWestFormats.length; i++) {
                if (this._getTextBySpread(value, dateJapanWestFormats[i]) === text) {
                    return dateJapanWestFormats[i];
                }
            }
            for (i = 0; i < dateJapanJERFormats.length; i++) {
                if (this._getTextBySpread(value, dateJapanJERFormats[i]) === text) {
                    return dateJapanJERFormats[i];
                }
            }
        };

        FormatDialog.prototype._isDateFormat = function (format) {
            if (format === null || format === undefined) {
                return false;
            }
            var allDateFormats = designer.res.dateFormats;
            var dateJapanWestFormats = designer.res.japanWesternDateFormat;
            var dateJapanJERFormats = designer.res.japanEmperorReignDateFormat;
            var text, i, standardResult, result;
            text = '1992';
            if (format.indexOf('G') !== -1 || format.indexOf('g') !== -1 || format.indexOf('e') !== -1) {
                return format;
            }
            for (i = 0; i < allDateFormats.length; i++) {
                standardResult = this._getTextBySpread(text, allDateFormats[i]);
                result = this._getTextBySpread(text, format);
                if (standardResult === result && allDateFormats[i].indexOf(format) !== -1) {
                    return allDateFormats[i];
                }
            }
            for (i = 0; i < dateJapanWestFormats.length; i++) {
                standardResult = this._getTextBySpread(text, dateJapanWestFormats[i]);
                result = this._getTextBySpread(text, format);
                if (standardResult === result && dateJapanWestFormats[i].indexOf(format) !== -1) {
                    return dateJapanWestFormats[i];
                }
            }
            for (i = 0; i < dateJapanJERFormats.length; i++) {
                standardResult = this._getTextBySpread(text, dateJapanJERFormats[i]);
                result = this._getTextBySpread(text, format);
                if (standardResult === result && dateJapanJERFormats[i].indexOf(format) !== -1) {
                    return dateJapanJERFormats[i];
                }
            }
            return false;
        };

        FormatDialog.prototype._updatePaddingPreview = function (position, value) {
            if (!position) {
                return;
            }
            var index;
            if (position.indexOf('top') !== -1) {
                index = 0;
            } else if (position.indexOf('right') !== -1) {
                index = 1;
            } else if (position.indexOf('bottom') !== -1) {
                index = 2;
            } else if (position.indexOf('left') !== -1) {
                index = 3;
            }
            var sheet = this._paddingPreviewSpread.getActiveSheet();
            var style = sheet.getStyle(0, 0);
            if (!style) {
                style = new GC.Spread.Sheets.Style();
            }
            if (position.indexOf('padding') !== -1) {
                var paddingArray = designer.util.parsePadding(style.cellPadding);
                paddingArray[index] = value;
                style.cellPadding = paddingArray.join(' ');
                sheet.setStyle(0, 0, style);
                this._cacheStyle['cellPadding'](paddingArray.join(' '));
            } else if (position.indexOf('margin') !== -1) {
                var labelOptions = style.labelOptions || {};
                var marginArray = designer.util.parsePadding(labelOptions.margin);
                marginArray[index] = value;
                var labelMargin = marginArray.join(' ');
                this._updateLabelOptions('margin', labelMargin);
            }
        };
        FormatDialog.prototype._initPaddingTab = function () {
            var self = this;
            //cell padding &label margin input numeric
            self._element.find('.numeric').spinner({
                min: 0,
                max: 99,
                stop: function () {
                    self._updatePaddingPreview($(this).data('name'), $(this).spinner('value'));
                },
                change: function () {
                    self._updatePaddingPreview($(this).data('name'), $(this).spinner('value'));
                }
            });
            //label font
            var fontFamilyContainer = self._element.find('.label-font-family');
            var fontFamilies = designer.res.fontPicker.fontFamilies;
            for (var font in fontFamilies) {
                if (fontFamilies.hasOwnProperty(font)) {
                    var fontName = fontFamilies[font];
                    $('<option></option>').text(fontName).val(fontName).appendTo(fontFamilyContainer);
                }
            }
            //label font size
            var fontSizeContainer = self._element.find('.label-font-size');
            var fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 26, 28, 36, 48, 72];
            fontSizes.forEach(function (size) {
                $('<option></option>').text(size).val(size).appendTo(fontSizeContainer);
            });
            //label visibility
            var visibilityContainer = self._element.find('.label-visibility');
            var visibility = designer.res.formatDialog.labelVisibility;
            for (var item in visibility) {
                if (visibility.hasOwnProperty(item)) {
                    $('<option></option>').text(visibility[item]).val(item).appendTo(visibilityContainer);
                }
            }
            //preview
            self._createPaddingPreview();

            //label color picker
            self._createLabelColorPicker();
            //bind event
            self._element.find('.label-font-color').click(function () {
                self._labelPopup.gcuipopup("show");
            });
            self._element.find('.label-text-input').keyup(function () {
                self._updateLabelText($(this).val());
            });
            self._element.find('.label-alignment-button').click(function () {
                self._updateLabelAlignment(GC.Spread.Sheets.LabelAlignment[$(this).data('name')]);
            });
            self._element.find('.label-font-family').change(function () {
                self._labelFont = $(this).val();
                self._updateLabelFont();
            });
            self._element.find('.label-font-size').change(function () {
                // ribbon font size will use 'pt' as unit
                self._labelFontSize = $(this).val() + 'pt';
                self._updateLabelFont();
            });
            self._element.find('.label-font-weight').click(function () {
                $(this).val(!$(this).val());
                self._labelFontWeight = $(this).val() ? 'bold' : 'normal';
                if ($(this).val()) {
                    $(this).addClass('button-active');
                } else {
                    $(this).removeClass('button-active');
                }
                self._updateLabelFont();
            });
            self._element.find('.label-font-style').click(function () {
                $(this).val(!$(this).val());
                self._labelFontStyle = $(this).val() ? 'italic' : 'normal';
                if ($(this).val()) {
                    $(this).addClass('button-active');
                } else {
                    $(this).removeClass('button-active');
                }
                self._updateLabelFont();
            });
            self._element.find('.label-visibility').change(function () {
                self._updateLabelVisibility(GC.Spread.Sheets.LabelVisibility[$(this).val()]);
            });
        };
        FormatDialog.prototype._updateLabelText = function (text) {
            var sheet = this._paddingPreviewSpread.getActiveSheet();
            var style = sheet.getStyle(0, 0);
            if (!style) {
                style = new GC.Spread.Sheets.Style();
            }
            style.watermark = text;
            sheet.setStyle(0, 0, style);
            this._cacheStyle['watermark'](text);
        };
        FormatDialog.prototype._updateLabelAlignment = function (align) {
            this._updateLabelOptions('alignment', align);
            this._updateLabelAlignmentButtonState(align);
        };
        FormatDialog.prototype._updateLabelAlignmentButtonState = function (align) {
            this._element.find('.label-alignment-button').removeClass('button-active');
            var alignmentButtons = this._element.find('.label-alignment-button');
            alignmentButtons.each(function (index, button) {
                if (GC.Spread.Sheets.LabelAlignment[$(button).data('name')] === align) {
                    $(button).addClass('button-active');
                }
            });
        };
        FormatDialog.prototype._updateLabelFont = function (font) {
            if (font) {
                this._updateLabelOptions('font', font);
                return;
            }
            var fontElement = $('<span></span>');
            //var defaultFont = 'normal normal 11pt Calibri';
            fontElement.css('font', 'normal normal 11pt Calibri');
            fontElement.css('font-weight', this._labelFontWeight || 'normal');
            fontElement.css('font-style', this._labelFontStyle || 'normal');
            fontElement.css('font-size', this._labelFontSize || '11pt');
            fontElement.css('font-family', this._labelFont || 'Calibri');
            this._updateLabelOptions('font', fontElement.css('font'));
        };
        FormatDialog.prototype._updateLabelColor = function (value) {
            this._updateLabelOptions('foreColor', value || 'grey');
        };
        FormatDialog.prototype._updateLabelVisibility = function (visibility) {
            this._updateLabelOptions('visibility', visibility);
        };
        FormatDialog.prototype._updateLabelOptions = function (property, value) {
            var sheet = this._paddingPreviewSpread.getActiveSheet();
            var style = sheet.getStyle(0, 0);
            if (!style) {
                style = new GC.Spread.Sheets.Style();
            }
            if (!style.labelOptions) {
                style.labelOptions = {};
            }
            style.labelOptions[property] = value;
            sheet.setStyle(0, 0, style);
            this._cacheStyle['labelOptions'](style.labelOptions);
        };
        FormatDialog.prototype._createLabelColorPicker = function () {
            var self = this;
            $("#label-color-picker").colorpicker({
                valueChanged: function (e, value) {
                    self._updateLabelColor(value.color);
                },
                choosedColor: function (e, value) {
                    self._labelPopup.gcuipopup("hide");
                },
                openColorDialog: function () {
                    self._labelPopup.gcuipopup("hide");
                }
            });
            self._labelPopup = $("#label-color-popup").gcuipopup({
                autoHide: true,
                position: {
                    of: self._element.find('.label-font-color'),
                    my: 'right top',
                    at: 'right bottom'
                },
                showing: function (e, args) {
                    $("#label-color-picker").colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
                }
            });
        };
        FormatDialog.prototype._createPaddingPreview = function () {
            var previewContainer = this._element.find('.preview-spread-container');
            var paddingPreviewSpread = new GC.Spread.Sheets.Workbook(previewContainer[0]);
            var sheet = paddingPreviewSpread.getActiveSheet();
            sheet.suspendPaint();
            paddingPreviewSpread.options.showHorizontalScrollbar = false;
            paddingPreviewSpread.options.showVerticalScrollbar = false;
            paddingPreviewSpread.options.tabStripVisible = false;
            paddingPreviewSpread.options.allowUserResize = false;
            paddingPreviewSpread.options.allowUserDragDrop = false;
            paddingPreviewSpread.options.allowUserDragFill = false;
            paddingPreviewSpread.options.allowUserZoom = false;
            $(designer.util.getCanvas(paddingPreviewSpread)).unbind("gcmousewheel.gcSheet");
            sheet.options.colHeaderVisible = false;
            sheet.options.rowHeaderVisible = false;
            sheet.options.selectionBackColor = "transparent";
            sheet.options.selectionBorderColor = "transparent";
            sheet.options.gridline = {showVerticalGridline: false, showHorizontalGridline: false};
            sheet.options.isProtected = true;
            sheet.setColumnCount(1);
            sheet.setRowCount(1);
            var columnWidth = previewContainer.width();
            var rowHeight = previewContainer.height();
            sheet.setColumnWidth(0, columnWidth);
            sheet.setRowHeight(0, rowHeight);
            sheet.setValue(0, 0, designer.res.formatDialog.paddingPreviewText);
            sheet.resumePaint();
            this._paddingPreviewSpread = paddingPreviewSpread;
        };
        FormatDialog.myRes = designer.res.formatDialog;

        FormatDialog._currentID = 0;
        return FormatDialog;
    })(designer.BaseDialog);
    designer.FormatDialog = FormatDialog;
})();
