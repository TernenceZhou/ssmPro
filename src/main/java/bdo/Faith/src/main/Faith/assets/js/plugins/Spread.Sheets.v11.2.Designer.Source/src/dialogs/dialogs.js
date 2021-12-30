(function () {
    'use strict';

    var keyword_undefined = void 0;
    var Sheets = GC.Spread.Sheets;
    var designer = Sheets.Designer;

    (function (MessageBoxIcon) {
        MessageBoxIcon[MessageBoxIcon["none"] = 0] = "none"; /* NOSONAR: AssignmentWithinCondition */
        MessageBoxIcon[MessageBoxIcon["info"] = 1] = "info"; /* NOSONAR: AssignmentWithinCondition */
        MessageBoxIcon[MessageBoxIcon["warning"] = 2] = "warning"; /* NOSONAR: AssignmentWithinCondition */
        MessageBoxIcon[MessageBoxIcon["error"] = 3] = "error"; /* NOSONAR: AssignmentWithinCondition */
        MessageBoxIcon[MessageBoxIcon["question"] = 4] = "question"; /* NOSONAR: AssignmentWithinCondition */
        designer.MessageBoxIcon = MessageBoxIcon;
    })(designer.MessageBoxIcon || ({}));
    (function (MessageBoxButtons) {
        MessageBoxButtons[MessageBoxButtons["ok"] = 0] = "ok"; /* NOSONAR: AssignmentWithinCondition */
        MessageBoxButtons[MessageBoxButtons["okCancel"] = 1] = "okCancel"; /* NOSONAR: AssignmentWithinCondition */
        MessageBoxButtons[MessageBoxButtons["yesNoCancel"] = 2] = "yesNoCancel"; /* NOSONAR: AssignmentWithinCondition */
        designer.MessageBoxButtons = MessageBoxButtons;
    })(designer.MessageBoxButtons || ({}));
    (function (MessageBoxResult) {
        MessageBoxResult[MessageBoxResult["none"] = 0] = "none"; /* NOSONAR: AssignmentWithinCondition */
        MessageBoxResult[MessageBoxResult["ok"] = 1] = "ok"; /* NOSONAR: AssignmentWithinCondition */
        MessageBoxResult[MessageBoxResult["yes"] = 2] = "yes"; /* NOSONAR: AssignmentWithinCondition */
        MessageBoxResult[MessageBoxResult["no"] = 3] = "no"; /* NOSONAR: AssignmentWithinCondition */
        MessageBoxResult[MessageBoxResult["cancel"] = 4] = "cancel"; /* NOSONAR: AssignmentWithinCondition */
        designer.MessageBoxResult = MessageBoxResult;
    })(designer.MessageBoxResult || ({}));

    var Helper = (function () {
        function Helper() {
        }

        Helper._getTransparentColorString = function () {
            var temp = $("<span></span>");
            temp.css("background-color", "rgba(0,0,0,0)");
            return temp.css("background-color");
        };
        Helper.loadXML = function (xmlFile) {
            var xmlDoc;
            $.ajax({
                url: xmlFile,
                async: false,
                type: 'GET',
                dataType: 'xml',
                success: function (data) {
                    xmlDoc = data;
                }
            });
            return xmlDoc;
        };
        return Helper;
    })();

    var MessageBox = (function () {
        function MessageBox() {
        }

        MessageBox._button = function (text, result, callback) {
            return {
                text: text,
                click: function (e) {
                    MessageBox._closeByButton = true;
                    MessageBox._element.dialog('close', e);
                    if (callback !== undefined) {
                        callback(e, result);
                    }
                }
            };
        };

        MessageBox.show = function (text, title, icon, buttons, callback) {
            if (icon === undefined) {
                icon = 0 /* none */;
            }
            if (buttons === undefined) {
                buttons = 0 /* ok */;
            }

            var textlines = text.split("\n");

            if (MessageBox._element === undefined) {
                MessageBox._element = $('<div></div>').addClass('message-box');

                $('<span></span>').addClass('message-box-icon').appendTo(MessageBox._element);
                $('<div></div>').addClass('message-box-text-container').appendTo(MessageBox._element);
                $('<div></div>').addClass('clear-float').appendTo(MessageBox._element);
                MessageBox._element.dialog({
                    modal: true,
                    autoSize: true,
                    autoOpen: false,
                    resizable: false,
                    // width: 'auto',
                    minWidth: 330,
                    close: function (e) {
                        if (!MessageBox._closeByButton && callback) {
                            callback(e, 0 /* none */);
                        }
                        MessageBox._closeByButton = false;
                    }
                });
            } else {
                // Ensure it is top level.
                MessageBox._element.dialog('destroy');
                MessageBox._element.dialog({
                    modal: true,
                    autoSize: true,
                    autoOpen: false,
                    resizable: false,
                    // width: 'auto',
                    minWidth: 330,
                    close: function (e) {
                        if (!MessageBox._closeByButton && callback) {
                            callback(e, 0 /* none */);
                        }
                        MessageBox._closeByButton = false;
                    }
                });
            }

            var $element = MessageBox._element;
            var $icon = $element.find('.message-box-icon');
            $icon.attr('class', 'message-box-icon');
            $icon.addClass('message-box-icon-' + designer.MessageBoxIcon[icon]);

            var $textContainer = $element.find('.message-box-text-container');
            $textContainer.empty();
            for (var i = 0; i < textlines.length; i++) {
                var textspan = $('<span></span>').addClass('message-box-text');
                textspan.text(textlines[i]);
                textspan.appendTo($textContainer);
            }

            $element.dialog('option', 'title', title);

            var okButton = MessageBox._button(designer.res.ok, 1 /* ok */, callback),
                cancelButton = MessageBox._button(designer.res.cancel, 4 /* cancel */, callback),
                yesButton = MessageBox._button(designer.res.yes, 2 /* yes */, callback),
                noButton = MessageBox._button(designer.res.no, 3 /* no */, callback);
            switch (buttons) {
                case 0 /* ok */
                    :
                    $element.dialog('option', 'buttons', [
                        okButton
                    ]);
                    break;
                case 1 /* okCancel */
                    :
                    $element.dialog('option', 'buttons', [
                        okButton,
                        cancelButton
                    ]);
                    break;
                case 2 /* yesNoCancel */
                    :
                    $element.dialog('option', 'buttons', [
                        yesButton,
                        noButton,
                        cancelButton
                    ]);
                    break;
            }
            $element.dialog('open');
            setTimeout(function () {
                return $element.parent().find(".ui-dialog-titlebar").trigger("mousedown");
            }, 100);
        };
        return MessageBox;
    })();
    designer.MessageBox = MessageBox;

    var dialogHtmlPath = designer.util.resolveHtmlPath('../dialogs', 'dialogs.html');
    var RowHeightDialog = (function (_super) {
        designer.extends(RowHeightDialog, _super);
        function RowHeightDialog() {
            _super.call(this, (dialogHtmlPath), '.row-height-dialog');
        }

        RowHeightDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                modal: true,
                title: designer.res.rowHeightDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var txt = self._element.find('[name=row-height]').val();
                            if (txt.match(/^[0-9\.]*$/)) {
                                var sucess = self._validateValue(txt);
                                if (sucess) {
                                    var value = parseInt(txt);
                                    designer.actions.doAction('setRowsHeight', designer.wrapper.spread, value);
                                    self.close();
                                    designer.wrapper.setFocusToSpread();
                                }
                            } else {
                                MessageBox.show(designer.res.rowHeightDialog.exception, designer.res.title, 2 /* warning */);
                            }
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        RowHeightDialog.prototype._beforeOpen = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var height = sheet.getRowHeight(sheet.getActiveRowIndex());
            this._element.find('[name=row-height]').val(height);
        };
        RowHeightDialog.prototype._validateValue = function (txt) {
            var result = true;
            if (parseFloat(txt) > 9999999 || parseFloat(txt) < 0) {
                MessageBox.show(designer.res.rowHeightDialog.exception2, designer.res.title, 2 /* warning */);
                result = false;
            }
            return result;
        };
        return RowHeightDialog;
    })(designer.BaseDialog);
    designer.RowHeightDialog = RowHeightDialog;

    var ColumnWidthDialog = (function (_super) {
        designer.extends(ColumnWidthDialog, _super);
        function ColumnWidthDialog() {
            _super.call(this, (dialogHtmlPath), '.column-width-dialog');
        }

        ColumnWidthDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                modal: true,
                title: designer.res.columnWidthDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var txt = self._element.find('[name=column-width]').val();
                            if (txt.match(/^[0-9\.]*$/)) {
                                var sucess = self._validateValue(txt);
                                if (sucess) {
                                    var value = parseInt(txt);
                                    designer.actions.doAction('setColumnsWidth', designer.wrapper.spread, value);
                                    self.close();
                                    designer.wrapper.setFocusToSpread();
                                }
                            } else {
                                MessageBox.show(designer.res.columnWidthDialog.exception, designer.res.title, 2 /* warning */);
                            }
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        ColumnWidthDialog.prototype._beforeOpen = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var height = sheet.getColumnWidth(sheet.getActiveColumnIndex());
            this._element.find('[name=column-width]').val(height);
        };
        ColumnWidthDialog.prototype._validateValue = function (txt) {
            var result = true;
            if (parseFloat(txt) > 9999999 || parseFloat(txt) < 0) {
                MessageBox.show(designer.res.columnWidthDialog.exception2, designer.res.title, 2 /* warning */);
                result = false;
            }
            return result;
        };
        return ColumnWidthDialog;
    })(designer.BaseDialog);
    designer.ColumnWidthDialog = ColumnWidthDialog;

    var FontPickerDialog = (function (_super) {
        designer.extends(FontPickerDialog, _super);
        function FontPickerDialog() {
            _super.call(this, (dialogHtmlPath), '.font-dialog');
        }

        FontPickerDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 475,
                autoOpen: false,
                resizable: false,
                modal: true,
                title: designer.res.fontPickerDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._raiseClose(event, self._composeFont());
                            self.close();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                        }
                    }
                ]
            };
        };

        FontPickerDialog.prototype._init = function () {
            var self = this;
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
                    }
                },
                isColorVisible: false
            });
        };
        FontPickerDialog.prototype._composeFont = function () {
            var font;
            if (this._fontFamily === undefined && this._fontStyle === undefined && this._fontSize === undefined && this._fontWeight === undefined) {
                font = "";
            } else {
                if (this._fontStyle) {
                    font = this._fontStyle;
                } else {
                    font = "normal";
                }
                if (this._fontWeight) {
                    font += " " + this._fontWeight;
                } else {
                    font += " " + "normal";
                }
                if (this._fontSize) {
                    font += " " + this._fontSize + "pt";
                } else {
                    font += " " + designer.res.defaultFont.split(" ")[0];
                }
                if (this._fontFamily) {
                    font += " " + this._fontFamily;
                } else {
                    font += " " + designer.res.defaultFont.split(" ")[1];
                }
            }
            return font;
        };
        FontPickerDialog.prototype._beforeOpen = function (args) {
            if (args[0] !== undefined && args[0] !== null && args[0] !== "") {
                var font = designer.util.parseFont(args[0]);
                this._element.find('.font-picker').fontpicker('family', font.fontFamily);
                this._element.find('.font-picker').fontpicker('style', font.fontStyle);
                this._element.find('.font-picker').fontpicker('size', parseFloat(font.fontSize).toString());
                this._element.find('.font-picker').fontpicker('weight', font.fontWeight);
            } else {
                this._element.find('.font-picker').fontpicker('family', '');
                this._element.find('.font-picker').fontpicker('style', '');
                this._element.find('.font-picker').fontpicker('size', '');
                this._element.find('.font-picker').fontpicker('weight', '');
                this._fontFamily = keyword_undefined;
                this._fontStyle = keyword_undefined;
                this._fontSize = keyword_undefined;
                this._fontWeight = keyword_undefined;
            }
        };
        FontPickerDialog.prototype._raiseClose = function (evt, value) {
            $(this).trigger('dialogClose', value);
        };
        return FontPickerDialog;
    })(designer.BaseDialog);
    designer.FontPickerDialog = FontPickerDialog;

    var StandardColumnWidthDialog = (function (_super) {
        designer.extends(StandardColumnWidthDialog, _super);
        function StandardColumnWidthDialog() {
            _super.call(this, (dialogHtmlPath), '.standard-width-dialog');
        }

        StandardColumnWidthDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                modal: true,
                title: designer.res.standardWidthDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var txt = self._element.find('[name=standard-column-width]').val();
                            if (txt.match(/^[0-9\.]*$/)) {
                                var sucess = self._validateValue(txt);
                                if (sucess) {
                                    var value = parseInt(txt);
                                    designer.actions.doAction('defaultColumnWidth', designer.wrapper.spread, value);
                                    self.close();
                                    designer.wrapper.setFocusToSpread();
                                }
                            } else {
                                MessageBox.show(designer.res.standardWidthDialog.exception, designer.res.title, 2 /* warning */);
                            }
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };
        StandardColumnWidthDialog.prototype._beforeOpen = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var height = sheet.defaults.colWidth;
            this._element.find('[name=standard-column-width]').val(height);
        };
        StandardColumnWidthDialog.prototype._validateValue = function (txt) {
            var result = true;
            if (parseFloat(txt) > 9999999 || parseFloat(txt) < 0) {
                MessageBox.show(designer.res.columnWidthDialog.exception2, designer.res.title, 2 /* warning */);
                result = false;
            }
            return result;
        };
        return StandardColumnWidthDialog;
    })(designer.BaseDialog);
    designer.StandardColumnWidthDialog = StandardColumnWidthDialog;

    var StandardRowHeightDialog = (function (_super) {
        designer.extends(StandardRowHeightDialog, _super);
        function StandardRowHeightDialog() {
            _super.call(this, (dialogHtmlPath), '.standard-height-dialog');
        }

        StandardRowHeightDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                modal: true,
                title: designer.res.standardHeightDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var txt = self._element.find('[name=standard-row-height]').val();
                            if (txt.match(/^[0-9\.]*$/)) {
                                var sucess = self._validateValue(txt);
                                if (sucess) {
                                    var value = parseInt(txt);
                                    designer.actions.doAction('defaultRowHeight', designer.wrapper.spread, value);
                                    self.close();
                                    designer.wrapper.setFocusToSpread();
                                }
                            } else {
                                MessageBox.show(designer.res.standardHeightDialog.exception, designer.res.title, 2 /* warning */);
                            }
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        StandardRowHeightDialog.prototype._beforeOpen = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var height = sheet.defaults.rowHeight;
            this._element.find('[name=standard-row-height]').val(height);
        };
        StandardRowHeightDialog.prototype._validateValue = function (txt) {
            var result = true;
            if (parseFloat(txt) > 9999999 || parseFloat(txt) < 0) {
                MessageBox.show(designer.res.rowHeightDialog.exception2, designer.res.title, 2 /* warning */);
                result = false;
            }
            return result;
        };
        return StandardRowHeightDialog;
    })(designer.BaseDialog);
    designer.StandardRowHeightDialog = StandardRowHeightDialog;

    var InsertCellsDialog = (function (_super) {
        designer.extends(InsertCellsDialog, _super);
        function InsertCellsDialog() {
            _super.call(this, (dialogHtmlPath), '.insert-cells-dialog');
        }

        InsertCellsDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                width: 'auto',
                modal: true,
                title: designer.res.insertCellsDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var value = self._element.find("input[name='insert-type']:checked").val();
                            if (value === "shiftcellsright") {
                                designer.actions.doAction("insertRightCells", designer.wrapper.spread);
                            } else if (value === "shiftcellsdown") {
                                designer.actions.doAction("insertDownCells", designer.wrapper.spread);
                            } else if (value === "entirerow") {
                                designer.actions.doAction("insertRows", designer.wrapper.spread);
                            } else if (value === "entirecolumn") {
                                designer.actions.doAction("insertColumns", designer.wrapper.spread);
                            }

                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        InsertCellsDialog.prototype._beforeOpen = function () {
            this._element.find("input[type='radio']").prop("checked", false);
            this._element.find(".default-radio").prop("checked", true).attr("autofocus", true);
        };
        return InsertCellsDialog;
    })(designer.BaseDialog);
    designer.InsertCellsDialog = InsertCellsDialog;

    var DeleteCellsDialog = (function (_super) {
        designer.extends(DeleteCellsDialog, _super);
        function DeleteCellsDialog() {
            _super.call(this, (dialogHtmlPath), '.delete-cells-dialog');
        }

        DeleteCellsDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                width: 'auto',
                modal: true,
                title: designer.res.deleteCellsDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var value = self._element.find("input[name='delete-type']:checked").val();
                            if (value === "shiftcellsleft") {
                                designer.actions.doAction("deleteLeftCells", designer.wrapper.spread);
                            } else if (value === "shiftcellsup") {
                                designer.actions.doAction("deleteUpCells", designer.wrapper.spread);
                            } else if (value === "entirerow") {
                                designer.actions.doAction("deleteRows", designer.wrapper.spread);
                            } else if (value === "entirecolumn") {
                                designer.actions.doAction("deleteColumns", designer.wrapper.spread);
                            }

                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        DeleteCellsDialog.prototype._beforeOpen = function () {
            this._element.find("input[type='radio']").prop("checked", false);
            this._element.find(".default-radio").prop("checked", true).attr("autofocus", true);
        };
        return DeleteCellsDialog;
    })(designer.BaseDialog);
    designer.DeleteCellsDialog = DeleteCellsDialog;

    var GroupDialog = (function (_super) {
        designer.extends(GroupDialog, _super);
        function GroupDialog() {
            _super.call(this, (dialogHtmlPath), '.group-dialog');
        }

        GroupDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                width: 'auto',
                modal: true,
                title: designer.res.groupDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var value = self._element.find("input[name='group-type']:checked").val();
                            if (value === "rows") {
                                designer.actions.doAction("groupRows", designer.wrapper.spread);
                            } else if (value === "columns") {
                                designer.actions.doAction("groupColumns", designer.wrapper.spread);
                            }

                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        GroupDialog.prototype._beforeOpen = function () {
            this._element.find("input[type='radio']").prop("checked", false);
            this._element.find(".default-radio").prop("checked", true).attr("autofocus", true);
        };
        return GroupDialog;
    })(designer.BaseDialog);
    designer.GroupDialog = GroupDialog;

    var UnGroupDialog = (function (_super) {
        designer.extends(UnGroupDialog, _super);
        function UnGroupDialog() {
            _super.call(this, (dialogHtmlPath), '.ungroup-dialog');
        }

        UnGroupDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                width: 'auto',
                modal: true,
                title: designer.res.ungroupDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var value = self._element.find("input[name='group-type']:checked").val();
                            if (value === "rows") {
                                designer.actions.doAction("ungroupRows", designer.wrapper.spread);
                            } else if (value === "columns") {
                                designer.actions.doAction("ungroupColumns", designer.wrapper.spread);
                            }

                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        UnGroupDialog.prototype._beforeOpen = function () {
            this._element.find("input[type='radio']").prop("checked", false);
            this._element.find(".default-radio").prop("checked", true).attr("autofocus", true);
        };
        return UnGroupDialog;
    })(designer.BaseDialog);
    designer.UnGroupDialog = UnGroupDialog;


    //Helper classes
    var SearchInformation = (function () {
        function SearchInformation() {
        }

        SearchInformation.SearchInformation = function (withinWorksheet1, searchString1, searchFlags1, searchOrder1, searchFoundFlags1) {
            this.WithinWorksheet = withinWorksheet1;
            this.SearchString = searchString1;
            this.SearchFlags = searchFlags1;
            this.SearchOrder = searchOrder1;
            this.SearchFoundFlags = searchFoundFlags1;
        };
        return SearchInformation;
    })();
    designer.SearchInformation = SearchInformation;

    var FindResultInformation = (function () {
        function FindResultInformation(workbookName, worksheetName, cellName, value, formula) {
            this._workBookName = workbookName;
            this._workSheetName = worksheetName;
            this._cellName = cellName;
            this._value = value;
            this._formula = formula;
        }

        return FindResultInformation;
    })();
    designer.FindResultInformation = FindResultInformation;

    //#region FindDialog
    var FindDialog = (function (_super) {
        designer.extends(FindDialog, _super);
        function FindDialog() {
            _super.call(this, (dialogHtmlPath), '.find-dialog');
        }

        FindDialog.prototype._initOptions = function () {
            return {
                resizable: false,
                width: 'auto',
                modal: true,
                title: designer.res.findDialog.title
            };
        };

        FindDialog.prototype._initGrid = function () {
            var _this = this;
            var selectionChanged = function (e, args) {
                if (_this._findCells !== undefined) {
                    var rowIndex = args.addedCells._list[0]._ri;
                    var cell = _this._findCells[rowIndex];
                    var sheet = designer.wrapper.spread.getSheetFromName(cell.sheet.name());
                    designer.wrapper.spread.setActiveSheetIndex(designer.wrapper.spread.sheets.indexOf(sheet));
                    designer.wrapper.spread.getActiveSheet().setActiveCell(cell.row, cell.col);
                    designer.wrapper.spread.getActiveSheet().showCell(cell.row, cell.col, 3 /* nearest */, 3 /* nearest */);
                }
            };

            this._element.find(".findall-grid").gcuigrid({
                scrollMode: "auto",
                allowColMoving: false,
                allowColSizing: true,
                //data: _data,
                staticColumnIndex: -1,
                staticRowIndex: -1,
                columns: [
                    { headerText: "Book", dataType: "string" },
                    { headerText: "Sheet", dataType: "string" },
                    { headerText: "Cell", dataType: "string" },
                    { headerText: "Value", dataType: "string" },
                    { headerText: "Formula", dataType: "string" }
                ],
                selectionChanged: selectionChanged
            });
        };

        FindDialog.prototype._FindAllFrame = function (results) {
            var _data = this._getData(results);
            this._element.find(".findall-grid-container").addClass("show");
            this._element.find(".findall-grid").addClass("show");
            this._element.find(".findall-grid").gcuigrid({ data: _data });
            this._element.find(".findall-description-label").addClass("show").text(_data.length.toString() + " cell(s) found");
        };

        FindDialog.prototype._getData = function (results) {
            var data = [];
            for (var i = 0; i < results.length; i++) {
                data.push({
                    Book: results[i]._workBookName,
                    Sheet: results[i]._workSheetName,
                    Cell: results[i]._cellName,
                    Value: results[i]._value,
                    Formula: results[i]._formula
                });
            }
            return data;
        };

        FindDialog.prototype._init = function () {
            var _this = this;
            this._findWhat = this._element.find(".findwhat-input")[0];
            this._within = this._element.find("select[name='within']")[0];
            this._search = this._element.find("select[name='search']")[0];
            this._lookIn = this._element.find("select[name='lookin']")[0];
            this._matchCase = this._element.find(".matchcase-editor");
            this._matchExactly = this._element.find(".matchexactly-editor");
            this._useWildCards = this._element.find(".usewildcards-editor");
            this._option = this._element.find("button[name='option']");

            this._element.find(".findall-button").button();
            this._element.find(".findnext-button").button();
            this._element.find(".close-button").button();
            this._option.button();

            this._initGrid();

            this._option.click(function () {
                _this._element.find(".column1,.column2,.column3,.column4").toggleClass('column-hidden');
                _this._element.find(".row2,.row3").toggleClass('row-hidden');

                _this._switchOptionExt();
                _this._option[0].children[0].textContent = designer.res.findDialog.option + _this._optionExtend;
            });

            this._element.find(".findall-button").click(function () {
                var results;
                _this._getSearchInformation();

                if (SearchInformation == null || SearchInformation.SearchString === undefined) {
                    return;
                }

                if (_this._within.selectedIndex === 0) {
                    results = _this._findAll(designer.wrapper.spread.getActiveSheet());
                } else {
                    results = _this._findAll();
                }

                if (results.length > 0) {
                    _this._FindAllFrame(results);
                } else {
                    _this._element.find(".findall-grid").gcuigrid("option", "data", []);
                    MessageBox.show(designer.res.findDialog.exception, designer.res.title, 2 /* warning */);
                    _this._element.find(".findall-description-label").addClass("show").text("0cell(s) found");
                }
            });
            this._element.find(".findnext-button").click(function () {
                _this._getSearchInformation();

                if (SearchInformation == null || SearchInformation.SearchString === undefined) {
                    return;
                }
                var successful = _this._findNext();
                if (successful !== true) {
                    MessageBox.show(designer.res.findDialog.exception, designer.res.title, 2 /* warning */);
                }
            });
            this._element.find(".close-button").click(function () {
                _this.close();
                designer.wrapper.setFocusToSpread();
            });
        };

        FindDialog.prototype._switchOptionExt = function () {
            if (this._optionExtend === ">>") {
                this._optionExtend = "<<";
            } else {
                this._optionExtend = ">>";
            }
        };

        FindDialog.prototype._beforeOpen = function () {
            SearchInformation.SearchInformation(undefined, undefined, undefined, undefined, undefined);
            this._findWithInCurrentSelections = false;

            this._activeSheetIndex = designer.wrapper.spread.getActiveSheetIndex();
            this._activeCellRowIndex = designer.wrapper.spread.getActiveSheet().getActiveRowIndex();
            this._activeCellColumnIndex = designer.wrapper.spread.getActiveSheet().getActiveColumnIndex();

            if (this._optionExtend === "<<") {
                this._element.find(".column1,.column2,.column3,.column4").addClass('column-hidden');
                this._element.find(".row2,.row3").addClass('row-hidden');
                this._switchOptionExt();
            }
            this._optionExtend = ">>";
            this._option[0].children[0].textContent = designer.res.findDialog.option + this._optionExtend;

            //Restore to default value.
            this._findWhat.value = "";
            this._within.selectedIndex = 0;
            this._search.selectedIndex = 0;
            this._lookIn.selectedIndex = 0;
            this._matchCase.removeAttr("checked");
            this._matchExactly.removeAttr("checked");
            this._useWildCards.removeAttr("checked");
            this._element.find(".findall-grid-container").removeClass("show");

            this._element.find(".findall-description-label").removeClass("show");
        };

        //Find Next
        FindDialog.prototype._findNext = function () {
            if (SearchInformation.SearchString === "") {
                this._findRowIndex = -1;
                this._findColumnIndex = -1;
                this._findSheetIndex = -1;
                return true;
            }

            var success = false;
            if (this._findWithInCurrentSelections) {
                if (!this._isBlockRangeContains()) {
                    this._findRowIndex = -1;
                    this._findColumnIndex = -1;
                    this._findSheetIndex = -1;

                    return false;
                }

                if (designer.wrapper.spread.getActiveSheet().getSelections().length === 1) {
                    success = this._findNextWithinCurrentSelection();
                } else {
                    success = this._findNextWithinCurrentSelections();
                }

                this._findSheetIndex = designer.wrapper.spread.getActiveSheetIndex();
            } else {
                if (SearchInformation.WithinWorksheet) {
                    if (!this._isWorksheetContains(designer.wrapper.spread.getActiveSheet())) {
                        this._findRowIndex = -1;
                        this._findColumnIndex = -1;
                        this._findSheetIndex = -1;

                        return false;
                    }

                    success = this._findNextWithinWorksheet(designer.wrapper.spread.getActiveSheet());
                    if (success) {
                        this._activeCellColumnIndex = this._findColumnIndex;
                        this._activeCellRowIndex = this._findRowIndex;
                        designer.wrapper.spread.getActiveSheet().addSelection(this._findRowIndex, this._findColumnIndex, 1, 1);
                        designer.wrapper.spread.getActiveSheet().setActiveCell(this._findRowIndex, this._findColumnIndex);
                        designer.wrapper.spread.getActiveSheet().showCell(this._findRowIndex, this._findColumnIndex, 3 /* nearest */, 3 /* nearest */);
                    }
                    this._findSheetIndex = designer.wrapper.spread.getActiveSheetIndex();
                } else {
                    success = this._findNextWithinWorksheets();
                }
            }

            return success;
        };

        FindDialog.prototype._isWorksheetContains = function (worksheet) {
            var findRow, findColumn;
            var searchCondition = new Sheets.Search.SearchCondition();
            searchCondition.searchString = SearchInformation.SearchString;
            searchCondition.searchFlags = SearchInformation.SearchFlags | 8 /* BlockRange */;
            searchCondition.searchOrder = SearchInformation.SearchOrder;
            searchCondition.searchTarget = SearchInformation.SearchFoundFlags;
            searchCondition.sheetArea = 3 /* viewport */;
            var result = worksheet.search(searchCondition);

            findRow = result.foundRowIndex;
            findColumn = result.foundColumnIndex;
            if (findRow !== -1 && findColumn !== -1) {
                return true;
            }

            return false;
        };

        FindDialog.prototype._isBlockRangeContains = function () {
            var selections = designer.wrapper.spread.getActiveSheet().getSelections();

            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                var startRow = selection.row;
                var startColumn = selection.col;
                var endRow = selection.row + selection.rowCount - 1;
                var endColumn = selection.col + selection.colCount - 1;

                var findRow, findColumn;
                var searchCondition = new Sheets.Search.SearchCondition();
                searchCondition.searchString = SearchInformation.SearchString;
                searchCondition.searchFlags = SearchInformation.SearchFlags | 8 /* BlockRange */;
                searchCondition.searchOrder = SearchInformation.SearchOrder;
                searchCondition.searchTarget = SearchInformation.SearchFoundFlags;
                searchCondition.sheetArea = 3 /* viewport */;
                searchCondition.rowStart = startRow;
                searchCondition.columnStart = startColumn;
                searchCondition.rowEnd = endRow;
                searchCondition.columnEnd = endColumn;

                var result = designer.wrapper.spread.getActiveSheet().search(searchCondition);

                findRow = result.foundRowIndex;
                findColumn = result.foundColumnIndex;

                if (findRow !== -1 && findColumn !== -1) {
                    return true;
                }
            }

            return false;
        };

        FindDialog.prototype._getSearchInformation = function () {
            var searchString1 = this._findWhat.value;
            if (searchString1 === "") {
                return null;
            }

            var withinWorksheet1;
            var searchFlags1 = 0;
            var searchOrder1;
            var searchFoundFlags1;

            //show all options
            if (this._optionExtend === "<<") {
                //Set value of withinWorksheet1 param
                if (this._within.selectedIndex === 0) {
                    withinWorksheet1 = true;
                } else {
                    withinWorksheet1 = false;
                }

                //Set value of searchFlags1 param
                if (this._matchCase.prop("checked") !== true) {
                    searchFlags1 |= 1 /* IgnoreCase */;
                }
                if (this._matchExactly.prop("checked") === true) {
                    searchFlags1 |= 2 /* ExactMatch */;
                }
                if (this._useWildCards.prop("checked") === true) {
                    searchFlags1 |= 4 /* UseWildCards */;
                }

                //Set value of searchOrder1 param
                if (this._search.selectedIndex === 0) {
                    searchOrder1 = 0 /* ZOrder */;
                } else {
                    searchOrder1 = 1 /* NOrder */;
                }

                //Set value of searchFoundFlags1 param
                if (this._lookIn.selectedIndex === 0) {
                    searchFoundFlags1 = 1 /* CellText */;
                } else if (this._lookIn.selectedIndex === 1) {
                    searchFoundFlags1 = 8 /* CellFormula */;
                    searchString1 = searchString1.charAt(0) === "=" ? searchString1.substr(1, searchString1.length) : searchString1;
                }
            } else {
                withinWorksheet1 = true;
                searchFlags1 = 1 /* IgnoreCase */;
                searchOrder1 = 0 /* ZOrder */;
                searchFoundFlags1 = 1 /* CellText */;
            }
            return SearchInformation.SearchInformation(withinWorksheet1, searchString1, searchFlags1, searchOrder1, searchFoundFlags1);
        };

        FindDialog.prototype._getRowStartColumnStart = function (searchOrder, cellRange) {
            if (!cellRange) {
                return;
            }
            var firstRow = cellRange.row;
            var firstColumn = cellRange.col;
            var lastRow = cellRange.row + cellRange.rowCount - 1;
            var lastColummn = cellRange.col + cellRange.colCount - 1;

            // by rows
            if (searchOrder === 0 /* ZOrder */) {
                if (this._activeCellColumnIndex === -1 && this._activeCellRowIndex === -1) {
                    this._rowStart = 0;
                    this._columnStart = 0;
                } else if (this._activeCellColumnIndex < lastColummn) {
                    this._rowStart = this._activeCellRowIndex;
                    this._columnStart = this._activeCellColumnIndex + 1; //to do
                } else if (this._activeCellColumnIndex === lastColummn) {
                    this._rowStart = this._activeCellRowIndex + 1;
                    this._columnStart = 0;
                } else {
                    this._rowStart = firstRow;
                    this._columnStart = firstColumn;
                }
            } else {
                if (this._activeCellColumnIndex === -1 && this._activeCellRowIndex === -1) {
                    this._rowStart = 0;
                    this._columnStart = 0;
                } else if (this._activeCellRowIndex < lastRow) {
                    this._rowStart = this._activeCellRowIndex + 1;
                    this._columnStart = this._activeCellColumnIndex;
                } else if (this._activeCellRowIndex === lastRow) {
                    this._rowStart = 0;
                    this._columnStart = this._activeCellColumnIndex + 1;
                } else {
                    this._rowStart = firstRow;
                    this._columnStart = firstColumn;
                }
            }
        };

        FindDialog.prototype._getFindWorksheetList = function () {
            var worksheetList = [];

            var startFindSheetIndex = this._activeSheetIndex;
            for (var i = startFindSheetIndex; i < designer.wrapper.spread.getSheetCount(); i++) {
                worksheetList.push(designer.wrapper.spread.sheets[i]);
            }

            for (var j = 0; j < startFindSheetIndex; j++) {
                worksheetList.push(designer.wrapper.spread.sheets[j]);
            }

            return worksheetList;
        };

        FindDialog.prototype._findWithSelection = function (selection) {
            if (!selection) {
                return false;
            }
            var startRow, startColumn;
            this._getRowStartColumnStart(SearchInformation.SearchOrder, selection);

            var endRow = selection.row + selection.rowCount - 1;
            var endColumn = selection.col + selection.colCount - 1;

            var searchCondition = new Sheets.Search.SearchCondition();
            searchCondition.searchString = SearchInformation.SearchString;
            searchCondition.searchFlags = SearchInformation.SearchFlags;
            searchCondition.searchOrder = SearchInformation.SearchOrder;
            searchCondition.searchTarget = SearchInformation.SearchFoundFlags;
            searchCondition.sheetArea = 3 /* viewport */;
            searchCondition.rowStart = startRow;
            searchCondition.columnStart = startColumn;
            searchCondition.rowEnd = endRow;
            searchCondition.columnEnd = endColumn;
            var result = designer.wrapper.spread.getActiveSheet().search(searchCondition);
            this._findRowIndex = result.foundRowIndex;
            this._findColumnIndex = result.foundColumnIndex;

            return !!(this._findRowIndex !== -1 && this._findColumnIndex !== -1);
        };

        FindDialog.prototype._findWithinWorksheet = function (worksheet) {
            this._getRowStartColumnStart(SearchInformation.SearchOrder, new Sheets.Range(0, 0, worksheet.getRowCount(), worksheet.getColumnCount()));

            var endRow = worksheet.getRowCount() - 1;
            var endColumn = worksheet.getColumnCount() - 1;

            var searchCondition = new Sheets.Search.SearchCondition();
            searchCondition.searchString = SearchInformation.SearchString;
            searchCondition.searchFlags = SearchInformation.SearchFlags;
            searchCondition.searchOrder = SearchInformation.SearchOrder;
            searchCondition.searchTarget = SearchInformation.SearchFoundFlags;
            searchCondition.sheetArea = 3 /* viewport */;
            searchCondition.rowStart = this._rowStart;
            searchCondition.columnStart = this._columnStart;
            searchCondition.rowEnd = endRow;
            searchCondition.columnEnd = endColumn;
            var result = worksheet.search(searchCondition);
            this._findRowIndex = result.foundRowIndex;
            this._findColumnIndex = result.foundColumnIndex;

            return this._findRowIndex !== -1 && this._findColumnIndex !== -1;
        };

        FindDialog.prototype._findNextWithinCurrentSelection = function () {
            this._findRowIndex = -1;
            this._findColumnIndex = -1;


            var selection = designer.wrapper.spread.getActiveSheet().getSelections()[0];
            if (!selection) {
                return false;
            }

            var success = this._findWithSelection(selection);
            if (success) {
                // 如果搜索成功，但不在selection区域中的话，需要向前移动一行或一列，然后递归使用搜索继续寻找
                if (!this._contains(selection, this._findRowIndex, this._findColumnIndex)) {
                    if (SearchInformation.SearchOrder === 0 /* ZOrder */) {
                        this._activeCellRowIndex++;
                        this._activeCellColumnIndex = selection.col - 1;
                    } else {
                        this._activeCellColumnIndex++;
                        this._activeCellRowIndex = selection.row - 1;
                    }

                    return this._findNextWithinCurrentSelection();
                }

                //　如果搜索成功，并且搜索结果在选择区域中，则结束退出
                this._activeCellRowIndex = this._findRowIndex;
                this._activeCellColumnIndex = this._findColumnIndex;

                designer.wrapper.spread.getActiveSheet().setActiveCell(this._findRowIndex, this._findColumnIndex);
                designer.wrapper.spread.getActiveSheet().showCell(this._findRowIndex, this._findColumnIndex, 3 /* nearest */, 3 /* nearest */);

                return true;
            } else {
                if (SearchInformation.SearchOrder === 0 /* ZOrder */) {
                    this._activeCellRowIndex = selection.row;
                    this._activeCellColumnIndex = selection.col - 1;
                } else {
                    this._activeCellRowIndex = selection.row - 1;
                    this._activeCellColumnIndex = selection.col;
                }

                return this._findNextWithinCurrentSelection();
            }
        };

        FindDialog.prototype._findNextWithinCurrentSelections = function () {
            this._findRowIndex = -1;
            this._findColumnIndex = -1;

            var selection = this._mergedSelections;
            if (!selection) {
                return false;
            }
            var selection1 = new Sheets.Range(selection.row, selection.col, selection.rowCount, selection.colCount);
            var success = this._findWithSelection(selection1);

            if (success) {
                if (!this._selectionsContains(this._findRowIndex, this._findColumnIndex)) {
                    if (SearchInformation.SearchOrder === 0 /* ZOrder */) {
                        this._activeCellRowIndex++;
                        this._activeCellColumnIndex = selection.col;
                    } else {
                        this._activeCellColumnIndex++;
                        this._activeCellRowIndex = selection.row;
                    }

                    return this._findNextWithinCurrentSelections();
                }

                this._activeCellRowIndex = this._findRowIndex;
                this._activeCellColumnIndex = this._findColumnIndex;
                designer.wrapper.spread.getActiveSheet().setActiveCell(this._findRowIndex, this._findColumnIndex);
                designer.wrapper.spread.getActiveSheet().showCell(this._findRowIndex, this._findColumnIndex, 3 /* nearest */, 3 /* nearest */);
                return true;
            } else {
                if (SearchInformation.SearchOrder === 0 /* ZOrder */) {
                    this._activeCellRowIndex = selection.row;
                    this._activeCellColumnIndex = selection.col - 1;
                } else {
                    this._activeCellRowIndex = selection.row - 1;
                    this._activeCellColumnIndex = selection.col;
                }

                return this._findNextWithinCurrentSelections();
            }
        };

        FindDialog.prototype._findNextWithinWorksheet = function (worksheet) {
            this._findRowIndex = -1;
            this._findColumnIndex = -1;

            var success = this._findWithinWorksheet(worksheet);

            if (success) {
                this._activeCellRowIndex = this._findRowIndex;
                this._activeCellColumnIndex = this._findColumnIndex;

                designer.wrapper.spread.getActiveSheet().addSelection(this._findRowIndex, this._findColumnIndex, 1, 1);
                designer.wrapper.spread.getActiveSheet().showCell(this._findRowIndex, this._findColumnIndex, 3 /* nearest */, 3 /* nearest */);

                return true;
            } else {
                this._activeCellRowIndex = -1;
                this._activeCellColumnIndex = -1;

                return this._findWithinWorksheet(worksheet);
            }
        };

        FindDialog.prototype._findNextWithinWorksheets = function () {
            var worksheetList = this._getFindWorksheetList();

            this._findRowIndex = -1;
            this._findColumnIndex = -1;
            this._findSheetIndex = -1;

            for (var i = 0; i < worksheetList.length; i++) {
                var worksheet = worksheetList[i];

                var sheetIndex = designer.wrapper.spread.sheets.indexOf(worksheet);

                if (sheetIndex !== designer.wrapper.spread.getActiveSheetIndex()) {
                    this._activeCellRowIndex = -1;
                    this._activeCellColumnIndex = -1;
                }

                var success = this._findWithinWorksheet(worksheet);

                if (success) {
                    this._findSheetIndex = sheetIndex;
                    break;
                }
            }

            if (this._findSheetIndex !== -1) {
                this._activeSheetIndex = this._findSheetIndex;
                this._activeCellRowIndex = this._findRowIndex;
                this._activeCellColumnIndex = this._findColumnIndex;

                designer.wrapper.spread.setActiveSheetIndex(this._findSheetIndex);
                designer.wrapper.spread.getActiveSheet().setActiveCell(this._findRowIndex, this._findColumnIndex);
                designer.wrapper.spread.getActiveSheet().showCell(this._findRowIndex, this._findColumnIndex, 3 /* nearest */, 3 /* nearest */);

                return true;
            } else {
                return false;
            }
        };
        FindDialog.prototype._contains = function (selection, row, column) {
            if (!selection) {
                return false;
            }
            if (row >= selection.row && row <= (selection.row + selection.rowCount) && column >= selection.col && column <= (selection.col + selection.colCount)) {
                return true;
            }
            return false;
        };
        FindDialog.prototype._selectionsContains = function (row, column) {
            var selections = designer.wrapper.spread.getActiveSheet().getSelections();

            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];

                if (this._contains(selection, row, column)) {
                    return true;
                }
            }

            return false;
        };

        //FindAll
        FindDialog.prototype._findAll = function (worksheet) {
            this._findCells = [];
            var results;
            if (worksheet === undefined) {
                results = this._actualFindAllByBook(designer.wrapper.spread);
            } else {
                results = this._actualFindAllBySheet(worksheet);
            }
            return results;
        };

        FindDialog.prototype._actualFindAllBySheet = function (worksheet) {
            var result = [];

            var startRow = 0;
            var startColumn = 0;
            var endRow = worksheet.getRowCount() - 1;
            var endColumn = worksheet.getColumnCount() - 1;

            var findRow = -1, findColumn = -1;

            var searchCondition = new Sheets.Search.SearchCondition();
            searchCondition.searchString = SearchInformation.SearchString;
            searchCondition.searchFlags = SearchInformation.SearchFlags;
            searchCondition.searchOrder = SearchInformation.SearchOrder;
            searchCondition.searchTarget = SearchInformation.SearchFoundFlags;
            searchCondition.sheetArea = 3 /* viewport */;
            searchCondition.rowStart = startRow;
            searchCondition.columnStart = startColumn;
            searchCondition.rowEnd = endRow;
            searchCondition.columnEnd = endColumn;
            var res = worksheet.search(searchCondition);

            findRow = res.foundRowIndex;
            findColumn = res.foundColumnIndex;

            while (findRow !== -1 && findColumn !== -1) {
                var cell = worksheet.getCell(findRow, findColumn);

                var workbookName = (designer.wrapper.spread.name === "" || designer.wrapper.spread.name === null) ? "Default" : designer.wrapper.spread.name;
                var A1 = Sheets.CalcEngine.rangeToFormula(cell, 0, 0, Sheets.CalcEngine.RangeReferenceRelative.allAbsolute);
                var f = new FindResultInformation(workbookName, worksheet.name(), A1, cell.text(), cell.formula());
                result.push(f);
                this._findCells.push(cell);
                if (SearchInformation.SearchOrder === 0 /* ZOrder */) {
                    startRow = findRow;
                    startColumn = findColumn + 1;
                    if (startColumn >= worksheet.getColumnCount() && startRow < worksheet.getRowCount()) {
                        startRow = findRow + 1;
                        startColumn = 0;
                    }
                } else {
                    startRow = findRow + 1;
                    startColumn = findColumn;
                    if (startRow >= worksheet.getRowCount() && startColumn < worksheet.getColumnCount()) {
                        startRow = 0;
                        startColumn = findColumn + 1;
                    }
                }
                searchCondition = new Sheets.Search.SearchCondition();
                searchCondition.searchString = SearchInformation.SearchString;
                searchCondition.searchFlags = SearchInformation.SearchFlags;
                searchCondition.searchOrder = SearchInformation.SearchOrder;
                searchCondition.searchTarget = SearchInformation.SearchFoundFlags;
                searchCondition.sheetArea = 3 /* viewport */;
                searchCondition.rowStart = startRow;
                searchCondition.columnStart = startColumn;
                searchCondition.rowEnd = endRow;
                searchCondition.columnEnd = endColumn;
                res = worksheet.search(searchCondition);

                findRow = res.foundRowIndex;
                findColumn = res.foundColumnIndex;
            }
            return result;
        };

        FindDialog.prototype._actualFindAllByBook = function (workbook) {
            var result = [];

            var startRow = 0;
            var startColumn = 0;
            var findRow = -1, findColumn = -1, findSheet = -1;

            var searchCondition = new Sheets.Search.SearchCondition();
            searchCondition.startSheetIndex = 0;
            searchCondition.endSheetIndex = workbook.getSheetCount() - 1;
            searchCondition.searchString = SearchInformation.SearchString;
            searchCondition.searchFlags = SearchInformation.SearchFlags;
            searchCondition.searchOrder = SearchInformation.SearchOrder;
            searchCondition.searchTarget = SearchInformation.SearchFoundFlags;
            searchCondition.sheetArea = 3 /* viewport */;
            var res = workbook.search(searchCondition);

            findRow = res.foundRowIndex;
            findColumn = res.foundColumnIndex;
            findSheet = res.foundSheetIndex;

            while (findRow !== -1 && findColumn !== -1 || (findSheet <= (workbook.getSheetCount() - 1) && findSheet !== -1)) {
                searchCondition = new Sheets.Search.SearchCondition();
                if (findRow !== -1 && findColumn !== -1) {
                    var cell = workbook.sheets[findSheet].getCell(findRow, findColumn);

                    var workbookName = (designer.wrapper.spread.name === "" || designer.wrapper.spread.name === null) ? "Default" : designer.wrapper.spread.name;
                    var A1 = Sheets.CalcEngine.rangeToFormula(cell, 0, 0, Sheets.CalcEngine.RangeReferenceRelative.allAbsolute);
                    var f = new FindResultInformation(workbookName, workbook.sheets[findSheet].name(), A1, cell.text(), cell.formula());
                    result.push(f);
                    this._findCells.push(cell);

                    if (SearchInformation.SearchOrder === 0 /* ZOrder */) {
                        startRow = findRow;
                        startColumn = findColumn + 1;
                        if (startColumn >= workbook.sheets[findSheet].getColumnCount() && startRow < workbook.sheets[findSheet].getRowCount()) {
                            startRow = findRow + 1;
                            startColumn = 0;
                        }
                    } else {
                        startRow = findRow + 1;
                        startColumn = findColumn;
                        if (startRow >= workbook.sheets[findSheet].getRowCount() && startColumn < workbook.sheets[findSheet].getColumnCount()) {
                            startRow = 0;
                            startColumn = findColumn + 1;
                        }
                    }
                    searchCondition.rowStart = startRow;
                    searchCondition.columnStart = startColumn;
                } else {
                    searchCondition.rowStart = 0;
                    searchCondition.columnStart = 0;
                    searchCondition.rowEnd = workbook.sheets[findSheet].getRowCount() - 1;
                    searchCondition.columnEnd = workbook.sheets[findSheet].getColumnCount() - 1;
                }
                searchCondition.searchString = SearchInformation.SearchString;
                searchCondition.searchFlags = SearchInformation.SearchFlags;
                searchCondition.searchOrder = SearchInformation.SearchOrder;
                searchCondition.searchTarget = SearchInformation.SearchFoundFlags;
                searchCondition.sheetArea = 3 /* viewport */;
                searchCondition.startSheetIndex = findSheet;
                searchCondition.endSheetIndex = findSheet;
                searchCondition.sheetArea = 3 /* viewport */;
                res = workbook.search(searchCondition);

                findRow = res.foundRowIndex;
                findColumn = res.foundColumnIndex;
                if (res.foundSheetIndex !== -1) {
                    findSheet = res.foundSheetIndex;
                } else {
                    findSheet++;
                }
            }
            return result;
        };
        return FindDialog;
    })(designer.BaseDialog);
    designer.FindDialog = FindDialog;

    //#endregion
    var GoToDialog = (function (_super) {
        designer.extends(GoToDialog, _super);
        function GoToDialog() {
            _super.call(this, (dialogHtmlPath), '.goto-dialog');
        }

        GoToDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                width: 'auto',
                modal: true,
                title: designer.res.gotoDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var txt = self._element.find('.goto-value-input').val();
                            var success = self._goto(txt);
                            if (success === true) {
                                self.close();
                            } else {
                                MessageBox.show(designer.res.gotoDialog.exception, designer.res.title, 3 /* error */);
                            }
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        GoToDialog.prototype._init = function () {
            var _this = this;
            this._element.find(".goto-list").change(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;

                _this._element.find(".goto-value-input").prop("value", ele.value);
            });
        };

        GoToDialog.prototype._beforeOpen = function () {
            var options = this._element.find(".goto-list")[0].options;
            this._element.find(".goto-list").empty();
            this._element.find(".goto-value-input").prop("value", "");
            var k = 0, i, j;
            var names;
            for (i = 0; i < designer.wrapper.spread.sheets.length; i++) {
                names = designer.wrapper.spread.sheets[i].getCustomNames();
                if (names !== undefined) {
                    for (j = 0; j < names.length; j++) {
                        options[k++] = new Option(names[j].getName());
                    }
                }
            }

            names = designer.wrapper.spread.getCustomNames();
            if (names !== undefined) {
                for (j = 0; j < names.length; j++) {
                    options[k++] = new Option(names[j].getName());
                }
            }
        };

        GoToDialog.prototype._goto = function (cellString) {
            var exp;
            var index = -1;
            var gotoRange;
            if (cellString === undefined || cellString === "") {
                return false;
            }
            var options = this._element.find(".goto-list")[0].options;
            var isCustomName = false;
            var i;
            for (i = 0; i < options.length; i++) {
                if (cellString === options[i].textContent) {
                    isCustomName = true;
                    break;
                }
            }
            if (isCustomName) {
                var nameInfo = designer.wrapper.spread.getCustomName(cellString);
                for (i = 0; i < designer.wrapper.spread.sheets.length; i++) {
                    if (!nameInfo) {
                        nameInfo = designer.wrapper.spread.sheets[i].getCustomName(cellString);
                    }
                    if (nameInfo) {
                        index = i;
                        break;
                    }
                }
                exp = nameInfo.getExpression();
            } else {
                var sheet = designer.wrapper.spread.getActiveSheet();
                exp = GC.Spread.Sheets.CalcEngine.formulaToExpression(sheet, cellString);
            }
            this._gotoSheet = null;
            gotoRange = this._getGotoRange(exp);
            if (this._gotoSheet != null) {
                for (i = 0; i < designer.wrapper.spread.sheets.length; i++) {
                    if (designer.wrapper.spread.sheets[i].name() === this._gotoSheet.name()) {
                        index = i;
                        break;
                    }
                }
            } else {
                return false;
            }
            if (index !== -1) {
                designer.wrapper.spread.setActiveSheetIndex(index);
            }
            designer.wrapper.spread.getActiveSheet().clearSelection();
            designer.wrapper.spread.getActiveSheet().setSelection(gotoRange.row, gotoRange.col, gotoRange.rowCount, gotoRange.colCount);
            designer.wrapper.spread.getActiveSheet().showCell(gotoRange.row, gotoRange.col, 3 /* neares */, 3 /* neares */);
            return true;
        };

        GoToDialog.prototype._getGotoRange = function (reference) {
            var _currentSheet = designer.wrapper.spread.getActiveSheet();
            this._gotoSheet = reference.source ? reference.source.getSheet() : _currentSheet;
            return reference.getRange(0, 0);
        };

        return GoToDialog;
    })(designer.BaseDialog);
    designer.GoToDialog = GoToDialog;

    //error list to implement filter "Name with errors";
    var ErrorList = {};

    ['#NULL!', '#DIV/0!', '#VALUE!', '#REF!', '#NAME?', '#N/A', '#NUM!'].forEach(function (s) {
        ErrorList[s] = true;
    });

    var NewNameDialog = (function (_super) {
        designer.extends(NewNameDialog, _super);
        function NewNameDialog(parentDialog) {
            _super.call(this, (dialogHtmlPath), '.new-name-dialog');
            if (parentDialog !== undefined) {
                this._nameManagerDialog = parentDialog;
            }
        }

        NewNameDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                autoOpen: false,
                width: 'auto',
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._closeDialog();
                            self.close();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                        }
                    }
                ]
            };
        };
        NewNameDialog.prototype._init = function () {
            var self = this;
            self._element.find('.rangeSelectButton').click(function () {
                if (!self._referToRangeSelect) {
                    self._referToRangeSelect = new designer.RangeSelectDialog(self, { absoluteReference: true });
                }
                var rangeSelectTitle = self._element.dialog('option', 'title') + '-' + designer.res.newNameDialog.referTo;
                self.hide();
                self._referToRangeSelect.open(rangeSelectTitle, self._setReferToFromRangeSelect, self._element.find('.referTo').val(), ['.referTo']);
            });
        };
        NewNameDialog.prototype._afterClose = function () {
            if (this._nameManagerDialog !== undefined) {
                this._nameManagerDialog.open();
            }
        };
        NewNameDialog.prototype._setReferToFromRangeSelect = function (selector, formula) {
            this._element.find(selector).val(formula);
        };
        NewNameDialog.prototype._validateSheetName = function (sheetName) {
            var useR1C1 = designer.wrapper.spread.options.referenceStyle;

            if (!designer.util.isValidateSheetName(sheetName, useR1C1, false)) {
                if (designer.util.isValidateSheetName(sheetName, useR1C1, true)) {
                    return "'" + sheetName + "'";
                }
                return null;
            }
            return sheetName;
        };
        NewNameDialog.prototype._beforeOpen = function (args) {
            var _this = this;
            _this._openArgsCache = args;
            var _name = this._element.find(".name-input");
            var _scope = this._element.find(".scope-select");
            var _referTo = this._element.find(".referTo");
            var _comment = this._element.find(".comment-input");
            var _scopeOptions = _scope[0].options;
            var i;
            _scope.empty();
            _scopeOptions.add(new Option(designer.res.newNameDialog.scope.workbook));
            for (i = 0; i < designer.wrapper.spread.sheets.length; i++) {
                _scopeOptions.add(new Option(designer.wrapper.spread.sheets[i].name()));
            }
            if (args[0] === "new") {
                $(".scope-select").removeAttr("disabled");
                this._element.dialog('option', 'title', designer.res.newNameDialog.titleNew);
                this._element.dialog('option', 'modal', true);
                _name.prop("value", "");
                _scope.prop("selectedIndex", 0);
                var ranges = designer.wrapper.spread.sheets[designer.wrapper.spread.getActiveSheetIndex()].getSelections();
                var formulas = "=";
                for (i = 0; i < ranges.length; i++) {
                    var range = ranges[i];
                    var formula;
                    formula = Sheets.CalcEngine.rangeToFormula(range, 0, 0, Sheets.CalcEngine.RangeReferenceRelative.allAbsolute);
                    formula = this._validateSheetName(designer.wrapper.spread.getActiveSheet().name()) + "!" + formula;
                    formulas += formula + ",";
                }
                formulas = formulas.slice(0, formulas.length - 1);
                _referTo.prop("value", formulas);
                _comment.prop("value", "");
            } else if (args[0] === "edit") {
                $(".scope-select").attr("disabled", "disabled");
                this.selectedItem = args[1];
                this._element.dialog('option', 'title', designer.res.newNameDialog.titleEdit);
                this._element.dialog('option', 'modal', true);
                _name.prop("value", this.selectedItem.name);
                _referTo.prop("value", this.selectedItem.refersTo);
                for (i = 0; i < _scopeOptions.length; i++) {
                    if (_scopeOptions[i].innerText === this.selectedItem.scope) {
                        $(_scopeOptions[i]).prop("selected", true);
                    }
                }
                _comment.prop("value", this.selectedItem.comment);
            }
        };
        NewNameDialog.prototype._closeDialog = function () {
            var self = this;
            var args = self._openArgsCache;
            var _scope = self._element.find(".scope-select");
            var _name = self._element.find(".name-input");
            var _comment = this._element.find(".comment-input");
            var _referTo = this._element.find(".referTo");
            var inWorkbook = _scope[0].selectedIndex === 0;
            var sheetIndex = _scope[0].selectedIndex - 1;
            if (_name.val() === "") {
                //Name is null.
                MessageBox.show(designer.res.nameManagerDialog.exception1, designer.res.title, 2 /* warning */, 0 /* ok */);
            } else {
                if ((self.selectedItem !== undefined && self.selectedItem !== null) || args[0] === "new") {
                    //Name already exsit.
                    var originName;
                    if (self.selectedItem !== undefined && self.selectedItem !== null) {
                        originName = self.selectedItem.name;
                    }
                    if (!(args[0] === "edit" && _name.val() === originName)) {
                        var nameInfo;
                        if (inWorkbook) {
                            nameInfo = designer.wrapper.spread.getCustomName(_name.val());
                        } else {
                            nameInfo = designer.wrapper.spread.sheets[sheetIndex].getCustomName(_name.val());
                        }
                        if (nameInfo !== null && nameInfo !== undefined) {
                            MessageBox.show(designer.res.nameManagerDialog.exception2, designer.res.title, 2 /* warning */, 0 /* ok */);
                            return;
                        }
                    }
                    if (designer.util.isValidateName(_name.val())) {
                        //Delete old name.

                        var activeSheet = designer.wrapper.spread.getActiveSheet();
                        var value = {
                            arg: args[0],
                            scope: self.selectedItem ? self.selectedItem.scope : undefined,
                            name: self.selectedItem ? self.selectedItem.name : undefined,
                            commentValue: _comment.val(),
                            nameValue: _name.val(),
                            referToValue: _referTo.val(),
                            sheetIndex: sheetIndex,
                            inWorkbook: inWorkbook,
                            activeRowIndex: activeSheet.getActiveRowIndex(),
                            activeColumnIndex: activeSheet.getActiveColumnIndex()
                        };
                        designer.actions.doAction('baseDialogCommand', designer.wrapper.spread, {
                            value: value,
                            execute: designer.spreadActions.dialogAction.newNameDialoagApplySetting
                        });
                        self.close();
                    } else {
                        MessageBox.show(designer.res.newNameDialog.wrongName, designer.res.title, 3 /* error */);
                    }
                }
            }
        };

        return NewNameDialog;
    })(designer.BaseDialog);
    designer.NewNameDialog = NewNameDialog;

    var NameManagerDialog = (function (_super) {
        designer.extends(NameManagerDialog, _super);
        function NameManagerDialog() {
            _super.call(this, (dialogHtmlPath), '.name-manager-dialog');
        }

        NameManagerDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                height: 550,
                width: 640,
                minWidth: 640,
                maxWidth: 640,
                minHeight: 550,
                maxHeight: 550,
                modal: true,
                title: designer.res.nameManagerDialog.title,
                buttons: [
                    {
                        text: designer.res.close,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };
        NameManagerDialog.prototype._beforeOpen = function () {
            var _this = this;
            var _editButton = this._element.find(".edit-button");
            var _deleteButton = this._element.find(".delete-button");
            var _nameGrid = this._element.find(".names-grid");

            this._updateFilter();
            _nameGrid.gcuigrid('option', 'data', this._getData());
            if (this._allnames.length > 0) {
                $(_editButton).button("enable");
                $(_deleteButton).button("enable");
            } else {
                $(_editButton).button("disable");
                $(_deleteButton).button("disable");
            }
            setTimeout(function () {
                _nameGrid.gcuigrid("doRefresh", _this._getData());
            }, 0);
        };
        NameManagerDialog.prototype._init = function () {
            var _this = this;
            var _nameGrid = this._element.find(".names-grid");
            var _editButton = this._element.find(".edit-button");
            var _deleteButton = this._element.find(".delete-button");
            var _filter = this._element.find(".filter-select");
            var selectionChanged = function (e, args) {
                _this._selectedNameIndex = args.addedCells._list[0]._ri;
            };
            var columnResized = function (e, args) {  /* NOSONAR: UnusedFunctionArgument*/
                var scrollPanel = _this._element.find(".gcui-gcuigrid-scroller");
                var superPanel = _this._element.find(".gcui-superpanel-statecontainer");
                var isShowHorScrollBar = parseInt(superPanel.css("width")) >= 605 ? true : false;
                var height = parseInt(superPanel.css("height"));
                if (isShowHorScrollBar) {
                    scrollPanel.css("height", (height + 18) + "px");
                    superPanel.css("height", (height + 18) + "px");
                } else {
                    _nameGrid.gcuigrid("doRefresh");
                }
            };
            _nameGrid.gcuigrid({
                scrollMode: "horizontal",
                allowColMoving: false,
                allowColSizing: true,
                height: "auto",
                columns: [
                    {
                        headerText: designer.res.nameManagerDialog.nameColumn,
                        dataType: "string",
                        width: 120,
                        ensurePxWidth: true
                    },
                    {
                        headerText: designer.res.nameManagerDialog.valueColumn,
                        dataType: "string",
                        width: 122,
                        ensurePxWidth: true
                    },
                    {
                        headerText: designer.res.nameManagerDialog.refersToColumn,
                        dataType: "string",
                        width: 120,
                        ensurePxWidth: true
                    },
                    {
                        headerText: designer.res.nameManagerDialog.scopeColumn,
                        dataType: "string",
                        width: 120,
                        ensurePxWidth: true
                    },
                    {
                        headerText: designer.res.nameManagerDialog.commentColumn,
                        dataType: "string",
                        width: 120,
                        ensurePxWidth: true
                    }
                ],
                selectionChanged: selectionChanged,
                columnResized: columnResized
            });

            var self = this;

            var options = this._element.find(".filter-select")[0].options;
            options.add(new Option(designer.res.nameManagerDialog.filterWith.clearFilter));
            options.add(new Option(designer.res.nameManagerDialog.filterWith.nameScopedToWorkbook));
            options.add(new Option(designer.res.nameManagerDialog.filterWith.nameScopedToWorksheet));
            options.add(new Option(designer.res.nameManagerDialog.filterWith.nameWithErrors));
            options.add(new Option(designer.res.nameManagerDialog.filterWith.nameWithoutErrors));
            this._element.find(".new-button").button();
            _editButton.button();
            _deleteButton.button();

            this._newNameDialog = new NewNameDialog(this);
            this._element.find(".new-button").click(function () {
                _this.close();
                _this._newNameDialog.open("new", undefined);
            });
            _editButton.click(function () {
                _this.close();
                _this._newNameDialog.open("edit", _this._allnames[_this._selectedNameIndex]);
            });
            _deleteButton.click(function () {
                MessageBox.show(designer.util.format(designer.res.nameManagerDialog.deleteAlert, _this._allnames[_this._selectedNameIndex].name), "Spread Designer", 2 /* warning */, 1 /* okCancel */, function (evt, result) {
                    if (result === 1 /* ok */) {
                        if (_this._allnames[_this._selectedNameIndex].scope === "Workbook") {
                            designer.wrapper.spread.removeCustomName(_this._allnames[_this._selectedNameIndex].name);
                        } else {
                            var index;
                            for (var i = 0; i < designer.wrapper.spread.sheets.length; i++) {
                                if (designer.wrapper.spread.sheets[i].name() === _this._allnames[_this._selectedNameIndex].scope) {
                                    index = i;
                                    break;
                                }
                            }
                            designer.wrapper.spread.sheets[index].removeCustomName(_this._allnames[_this._selectedNameIndex].name);
                        }

                        _this._updateFilter();
                        _nameGrid.gcuigrid('option', 'data', _this._getData());
                        if (_this._allnames.length === 0) {
                            $(_editButton).button("disable");
                            $(_deleteButton).button("disable");
                        }
                    }
                });
            });
            _filter.change(function () {
                _nameGrid = self._element.find(".names-grid");
                _this._updateFilter();
                _nameGrid.gcuigrid("option", "data", _this._getData());
                if (_this._allnames.length === 0) {
                    $(_editButton).button("disable");
                    $(_deleteButton).button("disable");
                } else {
                    $(_editButton).button("enable");
                    $(_deleteButton).button("enable");
                }
            });
        };
        NameManagerDialog.prototype._getData = function () {
            var data = [];
            for (var i = 0; i < this._allnames.length; i++) {
                var nameProperty = {
                    "Name": this._allnames[i].name,
                    "Value": this._allnames[i].value,
                    "Refers To": this._allnames[i].refersTo,
                    "Scope": this._allnames[i].scope
                };
                var comment = this._allnames[i].comment;
                if (comment) {
                    nameProperty.Comment = comment.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                }
                data.push(nameProperty);
            }
            this._data = new designer.gcui.data.ArrayDataView(data);
            return this._data;
        };
        NameManagerDialog.prototype._parseValues = function (e) {
            var sheet;
            var col;
            var row;
            var colCount;
            var rowCount;
            var values;
            var result = "";
            if (e.type === GC.Spread.CalcEngine.ExpressionType.operator) {
                result = "{...}";
            } else {
                if (e.source instanceof GC.Spread.CalcEngine.ErrorSource) {
                    return "{...}";
                }
                sheet = e.source ? e.source.getSheet() : designer.wrapper.spread.getActiveSheet();
                col = e.column;
                row = e.row;
                if (e.endColumn) {
                    colCount = e.endColumn - col + 1;
                } else {
                    colCount = 1;
                }
                if (e.endRow) {
                    rowCount = e.endRow - row + 1;
                } else {
                    rowCount = 1;
                }
                if (col < 0) {
                    col = 0;
                    colCount = sheet.getColumnCount();
                }
                if (row < 0) {
                    row = 0;
                    rowCount = sheet.getRowCount();
                }

                // if it is a cellExpression
                if (!e.endRow) {
                    result = sheet.getValue(row, col);
                    if (result !== null) {
                        result = result.toString();
                    }
                } else {
                    values = sheet.getArray(row, col, rowCount, colCount);
                    var tooLong = false;
                    for (var i = 0; i < values.length; i++) {
                        for (var m = 0; m < values[i].length; m++) {
                            if (values[i][m] === null) {
                                result += '""' + ",";
                            } else {
                                result += '"' + values[i][m].toString() + '"' + ",";
                            }
                        }
                        result = result.substring(0, result.length - 1);
                        result = result + ";";
                        if (result.length > 50) {
                            tooLong = true;
                            break;
                        }
                    }
                    result = result.substring(0, result.length - 1);

                    result = "{" + result + (tooLong ? "..." : "}");
                }
            }

            return result;
        };
        NameManagerDialog.prototype._hasErrorValue = function (expression) {
            if (!expression.getRange) {
                return false;
            }
            var sheet = designer.wrapper.spread.getActiveSheet();
            var range = expression.getRange(0, 0);
            var row = range.row;
            var col = range.col;
            var endRow = range.row + range.rowCount;
            var endCol = range.col + range.colCount;
            for (var r = row; r < endRow; r++) {
                for (var c = col; c < endCol; c++) {
                    //For performance, should not use getText, it will invoke format process which is meanless here.
                    if (sheet.getValue(r, c) instanceof GC.Spread.CalcEngine.CalcError) {
                        return true;
                    }
                }
            }
            return false;
        };
        NameManagerDialog.prototype._updateFilter = function () {
            var _filter = this._element.find(".filter-select");

            //Fill name grid.
            var names;
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            this._allnames = [];
            var errorNames = [];
            var noErrorNames = [];
            var j = 0, formula, values;
            if (_filter.val() !== designer.res.nameManagerDialog.filterWith.nameScopedToWorksheet) {
                names = designer.wrapper.spread.getCustomNames();
                if (names !== undefined) {
                    for (j; j < names.length; j++) {
                        formula = this._unparse(null, names[j].getExpression(), activeSheet.getActiveRowIndex(), activeSheet.getActiveColumnIndex());
                        values = this._parseValues(names[j].getExpression());
                        this._allnames.push({
                            name: names[j].getName(),
                            refersTo: formula,
                            scope: "Workbook",
                            value: values,
                            comment: names[j].getComment()
                        });
                        if (this._hasErrorValue(names[j].getExpression())) {
                            errorNames.push(this._allnames[this._allnames.length - 1]);
                        } else {
                            noErrorNames.push(this._allnames[this._allnames.length - 1]);
                        }
                    }
                }
            }
            if (_filter.val() !== designer.res.nameManagerDialog.filterWith.nameScopedToWorkbook) {
                for (var i = 0; i < designer.wrapper.spread.sheets.length; i++) {
                    names = designer.wrapper.spread.sheets[i].getCustomNames();
                    if (names !== undefined) {
                        for (j = 0; j < names.length; j++) {
                            formula = this._unparse(null, names[j].getExpression(), activeSheet.getActiveRowIndex(), activeSheet.getActiveColumnIndex());
                            values = this._parseValues(names[j].getExpression());
                            this._allnames.push({
                                name: names[j].getName(),
                                refersTo: formula,
                                scope: designer.wrapper.spread.sheets[i].name(),
                                value: values,
                                comment: names[j].getComment()
                            });
                            if (this._hasErrorValue(names[j].getExpression())) {
                                errorNames.push(this._allnames[this._allnames.length - 1]);
                            } else {
                                noErrorNames.push(this._allnames[this._allnames.length - 1]);
                            }
                        }
                    }
                }
            }
            if (_filter.val() === designer.res.nameManagerDialog.filterWith.nameWithoutErrors) {
                this._allnames = noErrorNames;
            }
            if (_filter.val() === designer.res.nameManagerDialog.filterWith.nameWithErrors) {
                this._allnames = errorNames;
            }
        };
        return NameManagerDialog;
    })(designer.BaseDialog);
    designer.NameManagerDialog = NameManagerDialog;

    var TagDialog = (function (_super) {
        designer.extends(TagDialog, _super);
        function TagDialog(parentDialog) {  // NOSONAR  noUseArguments
            _super.call(this, (dialogHtmlPath), '.tag-dialog');
        }

        TagDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                autoOpen: false,
                width: 'auto',
                modal: true,
                preventDefaultOkButton: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
                            self.close();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                        }
                    }
                ]
            };
        };

        TagDialog.prototype._beforeOpen = function (args) {
            var self = this;
            var sheet = designer.wrapper.spread.getActiveSheet();
            var tag = "";
            var selection = sheet.getSelections()[0];
            switch (args[0]) {
                case "sheet":
                    this._element.dialog('option', 'title', designer.res.tagDialog.sheetTagTitle);
                    tag = sheet.tag() || "";
                    break;
                case "cell":
                    this._element.dialog('option', 'title', designer.res.tagDialog.cellTagTitle);
                    if (selection) {
                        tag = sheet.getRange(selection.row, selection.col, selection.rowCount, selection.colCount).tag() || "";
                    }
                    break;
                case "row":
                    this._element.dialog('option', 'title', designer.res.tagDialog.rowTagTitle);
                    if (selection) {
                        tag = sheet.getTag(selection.row, selection.col) || "";
                    }
                    break;
                case "column":
                    this._element.dialog('option', 'title', designer.res.tagDialog.columnTagTitle);
                    if (selection) {
                        tag = sheet.getTag(selection.row, selection.col) || "";
                    }
                    break;
            }
            this._element.dialog('option', 'open', function () {
                self._element.find('.tag-input').focus();
            });
            this._element.find('.tag-input').val(tag);
        };
        TagDialog.prototype._applySetting = function () {
            switch (this._openArgs[0]) {
                case "sheet":
                    designer.actions.doAction('setTag', designer.wrapper.spread, [this._element.find('.tag-input').val(), "sheet"]);
                    break;
                case "cell":
                    designer.actions.doAction('setTag', designer.wrapper.spread, [this._element.find('.tag-input').val(), "cell"]);
                    break;
                case "row":
                    designer.actions.doAction('setTag', designer.wrapper.spread, [this._element.find('.tag-input').val(), "row"]);
                    break;
                case "column":
                    designer.actions.doAction('setTag', designer.wrapper.spread, [this._element.find('.tag-input').val(), "column"]);
                    break;
            }
        };
        return TagDialog;
    })(designer.BaseDialog);
    designer.TagDialog = TagDialog;

    var databaseNames = [
        "DAVERAGE",
        "DCOUNT",
        "DCOUNTA",
        "DGET",
        "DMAX",
        "DMIN",
        "DPRODUCT",
        "DSTDEV",
        "DSTDEVP",
        "DSUM",
        "DVAR",
        "DVARP"];

    var dateAndTimeNames = [
        "DATE",
        "DATEDIF",
        "DATEVALUE",
        "DAY",
        "DAYS360",
        "EDATE",
        "EOMONTH",
        "HOUR",
        "MINUTE",
        "MONTH",
        "NETWORKDAYS",
        "NOW",
        "SECOND",
        "TIME",
        "TIMEVALUE",
        "TODAY",
        "WEEKDAY",
        "WEEKNUM",
        "WORKDAY",
        "YEAR",
        "YEARFRAC"];

    var engineeringNames = [
        "BESSELI",
        "BESSELJ",
        "BESSELK",
        "BESSELY",
        "BIN2DEC",
        "BIN2HEX",
        "BIN2OCT",
        "COMPLEX",
        "CONVERT",
        "DEC2BIN",
        "DEC2HEX",
        "DEC2OCT",
        "DELTA",
        "ERF",
        "ERFC",
        "GESTEP",
        "HEX2BIN",
        "HEX2DEC",
        "HEX2OCT",
        "IMABS",
        "IMAGINARY",
        "IMARGUMENT",
        "IMCONJUGATE",
        "IMCOS",
        "IMDIV",
        "IMEXP",
        "IMLN",
        "IMLOG10",
        "IMLOG2",
        "IMPOWER",
        "IMPRODUCT",
        "IMREAL",
        "IMSIN",
        "IMSQRT",
        "IMSUB",
        "IMSUM",
        "OCT2BIN",
        "OCT2DEC",
        "OCT2HEX"];

    var financialNames = [
        "ACCRINT",
        "ACCRINTM",
        "AMORDEGRC",
        "AMORLINC",
        "COUPDAYBS",
        "COUPDAYS",
        "COUPDAYSNC",
        "COUPNCD",
        "COUPNUM",
        "COUPPCD",
        "CUMIPMT",
        "CUMPRINC",
        "DB",
        "DDB",
        "DISC",
        "DOLLARDE",
        "DOLLARFR",
        "DURATION",
        "EFFECT",
        "FV",
        "FVSCHEDULE",
        "INTRATE",
        "IPMT",
        "IRR",
        "ISPMT",
        "MDURATION",
        "MIRR",
        "NOMINAL",
        "NPER",
        "NPV",
        "ODDFPRICE",
        "ODDFYIELD",
        "ODDLPRICE",
        "ODDLYIELD",
        "EURO",
        "EUROCONVERT",
        "PMT",
        "PPMT",
        "PRICE",
        "PRICEDISC",
        "PRICEMAT",
        "PV",
        "RATE",
        "RECEIVED",
        "SLN",
        "SYD",
        "TBILLEQ",
        "TBILLPRICE",
        "TBILLYIELD",
        "VDB",
        "XIRR",
        "XNPV",
        "YIELD",
        "YIELDDISC",
        "YIELDMAT"];

    var informationNames = [
        "ERROR.TYPE",
        "ISBLANK",
        "ISERR",
        "ISERROR",
        "ISEVEN",
        "ISLOGICAL",
        "ISNA",
        "ISNONTEXT",
        "ISNUMBER",
        "ISODD",
        "ISREF",
        "ISTEXT",
        "N",
        "NA",
        "TYPE"];

    var logicalNames = [
        "AND",
        "FALSE",
        "IF",
        "IFERROR",
        "NOT",
        "OR",
        "TRUE"];

    var lookupAndReferenceNames = [
        "ADDRESS",
        "CHOOSE",
        "COLUMN",
        "COLUMNS",
        "HLOOKUP",
        "INDEX",
        "LOOKUP",
        "MATCH",
        "OFFSET",
        "ROW",
        "ROWS",
        "TRANSPOSE",
        "VLOOKUP"];

    var mathAndTrigonometryNames = [
        "ABS",
        "ACOS",
        "ACOSH",
        "ASIN",
        "ASINH",
        "ATAN",
        "ATAN2",
        "ATANH",
        "CEILING",
        "COMBIN",
        "COS",
        "COSH",
        "DEGREES",
        "EVEN",
        "EXP",
        "FACT",
        "FACTDOUBLE",
        "FLOOR",
        "GCD",
        "INT",
        "LCM",
        "LN",
        "LOG",
        "LOG10",
        "MDETERM",
        "MINVERSE",
        "MMULT",
        "MOD",
        "MROUND",
        "MULTINOMIAL",
        "ODD",
        "PI",
        "POWER",
        "PRODUCT",
        "QUOTIENT",
        "RADIANS",
        "RAND",
        "RANDBETWEEN",
        "ROMAN",
        "ROUND",
        "ROUNDDOWN",
        "ROUNDUP",
        "SERIESSUM",
        "SIGN",
        "SIN",
        "SINH",
        "SQRT",
        "SQRTPI",
        "SUBTOTAL",
        "SUM",
        "SUMIF",
        "SUMIFS",
        "SUMPRODUCT",
        "SUMSQ",
        "SUMX2MY2",
        "SUMX2PY2",
        "SUMXMY2",
        "TAN",
        "TANH",
        "TRUNC"];

    var statisticalNames = [
        "AVEDEV",
        "AVERAGE",
        "AVERAGEA",
        "AVERAGEIF",
        "AVERAGEIFS",
        "BETADIST",
        "BETAINV",
        "BINOMDIST",
        "CHIDIST",
        "CHIINV",
        "CHITEST",
        "CONFIDENCE",
        "CORREL",
        "COUNT",
        "COUNTA",
        "COUNTBLANK",
        "COUNTIF",
        "COUNTIFS",
        "COVAR",
        "CRITBINOM",
        "DEVSQ",
        "EXPONDIST",
        "FDIST",
        "FINV",
        "FISHER",
        "FISHERINV",
        "FORECAST",
        "FREQUENCY",
        "FTEST",
        "GAMMADIST",
        "GAMMAINV",
        "GAMMALN",
        "GEOMEAN",
        "GROWTH",
        "HARMEAN",
        "HYPGEOMDIST",
        "INTERCEPT",
        "KURT",
        "LARGE",
        "LINEST",
        "LOGEST",
        "LOGINV",
        "LOGNORMDIST",
        "MAX",
        "MAXA",
        "MEDIAN",
        "MIN",
        "MINA",
        "MODE",
        "NEGBINOMDIST",
        "NORMDIST",
        "NORMINV",
        "NORMSDIST",
        "NORMSINV",
        "PEARSON",
        "PERCENTILE",
        "PERCENTRANK",
        "PERMUT",
        "POISSON",
        "PROB",
        "QUARTILE",
        "RANK",
        "RSQ",
        "SKEW",
        "SLOPE",
        "SMALL",
        "STANDARDIZE",
        "STDEV",
        "STDEVA",
        "STDEVP",
        "STDEVPA",
        "STEYX",
        "TDIST",
        "TINV",
        "TREND",
        "TRIMMEAN",
        "TTEST",
        "VAR",
        "VARA",
        "VARP",
        "VARPA",
        "WEIBULL",
        "ZTEST"];

    var textNames = [
        "CHAR",
        "CLEAN",
        "CODE",
        "CONCATENATE",
        "DOLLAR",
        "EXACT",
        "FIND",
        "FIXED",
        "LEFT",
        "LEN",
        "LOWER",
        "MID",
        "PROPER",
        "REPLACE",
        "REPT",
        "RIGHT",
        "SEARCH",
        "SUBSTITUTE",
        "T",
        "TEXT",
        "TRIM",
        "UPPER",
        "VALUE"];

    var allNames = [].concat(databaseNames, dateAndTimeNames, engineeringNames, financialNames, informationNames, logicalNames, lookupAndReferenceNames, mathAndTrigonometryNames, statisticalNames, textNames);

    var InsertFunctionDialog = (function (_super) {
        designer.extends(InsertFunctionDialog, _super);
        function InsertFunctionDialog() {
            _super.call(this, (dialogHtmlPath), '.insert-function-dialog');
        }

        InsertFunctionDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                width: "470px",
                modal: true,
                title: designer.res.insertFunctionDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var txt = self._element.find(".formula").val();
                            var fill = $("#formulaBarText");
                            if (txt.substring(0, 1) !== "=") {
                                txt = "=" + txt;
                            }
                            fill.text(txt);
                            var sheet = designer.wrapper.spread.getActiveSheet();
                            var value = {
                                txt: txt,
                                activeRowIndex: sheet.getActiveRowIndex(),
                                activeColumnIndex: sheet.getActiveColumnIndex()
                            };
                            designer.actions.doAction('baseDialogCommand', designer.wrapper.spread, {
                                value: value,
                                execute: designer.spreadActions.dialogAction.insertFunctionDiaplogApplySetting
                            });
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        InsertFunctionDialog.prototype._init = function () {
            var _this = this;
            this._functionCategory = designer.res.insertFunctionDialog.functionCategorys.split(",");
            allNames.sort();

            var list = this._element.find(".function-list-select");
            var listOptions = list[0].options;
            var formula = this._element.find(".formula");

            var category = this._element.find(".function-category-select");
            var categoryOptions = category[0].options;
            category.empty();
            var i;
            for (i = 0; i < this._functionCategory.length; i++) {
                categoryOptions.add(new Option(this._functionCategory[i]));
            }

            list.change(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;
                var param;
                var description;
                var fun = GC.Spread.CalcEngine.Functions.findGlobalFunction(ele.value);
                if (fun) {
                    var funDes = fun.description();
                    description = funDes.description;
                    param = funDes.parameters.map(function (item) { return item.name }).join(',');
                }
                _this._element.find(".function-name").text(ele.value + "(" + param + ")");
                _this._element.find(".function-description").text(description);
            });
            list.dblclick(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;

                if (formula.prop("value") === "") {
                    formula.prop("value", ele.value + "()");
                    formula.attr("caretIndex", formula.prop("value").length - 1);
                    _this._element.find(".formula").focus();
                    formula[0].selectionStart = parseInt(formula.attr("caretIndex"));
                    formula[0].selectionEnd = parseInt(formula.attr("caretIndex"));
                } else {
                    var text = formula.prop("value");
                    var caretIndex = parseInt(formula.attr("caretIndex"));
                    text = text.substring(0, caretIndex) + ele.value + "()" + text.substring(caretIndex, text.length);
                    formula.prop("value", text);
                    formula.attr("caretIndex", caretIndex + ele.value.length + 1);
                    _this._element.find(".formula").focus();
                    formula[0].selectionStart = parseInt(formula.attr("caretIndex"));
                    formula[0].selectionEnd = parseInt(formula.attr("caretIndex"));
                }
            });

            var getCaret = function () {
                var caretIndex = formula[0].selectionStart;
                formula.attr("caretIndex", caretIndex);
            };
            formula.select(getCaret);
            formula.click(getCaret);
            formula.keyup(getCaret);

            category.change(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;
                list.empty();

                if (ele.value === _this._functionCategory[0]) {
                    for (i = 0; i < allNames.length; i++) {
                        listOptions.add(new Option(allNames[i]));
                    }
                } else if (ele.value === _this._functionCategory[1]) {
                    for (i = 0; i < databaseNames.length; i++) {
                        listOptions.add(new Option(databaseNames[i]));
                    }
                } else if (ele.value === _this._functionCategory[2]) {
                    for (i = 0; i < dateAndTimeNames.length; i++) {
                        listOptions.add(new Option(dateAndTimeNames[i]));
                    }
                } else if (ele.value === _this._functionCategory[3]) {
                    for (i = 0; i < engineeringNames.length; i++) {
                        listOptions.add(new Option(engineeringNames[i]));
                    }
                } else if (ele.value === _this._functionCategory[4]) {
                    for (i = 0; i < financialNames.length; i++) {
                        listOptions.add(new Option(financialNames[i]));
                    }
                } else if (ele.value === _this._functionCategory[5]) {
                    for (i = 0; i < informationNames.length; i++) {
                        listOptions.add(new Option(informationNames[i]));
                    }
                } else if (ele.value === _this._functionCategory[6]) {
                    for (i = 0; i < logicalNames.length; i++) {
                        listOptions.add(new Option(logicalNames[i]));
                    }
                } else if (ele.value === _this._functionCategory[7]) {
                    for (i = 0; i < lookupAndReferenceNames.length; i++) {
                        listOptions.add(new Option(lookupAndReferenceNames[i]));
                    }
                } else if (ele.value === _this._functionCategory[8]) {
                    for (i = 0; i < mathAndTrigonometryNames.length; i++) {
                        listOptions.add(new Option(mathAndTrigonometryNames[i]));
                    }
                } else if (ele.value === _this._functionCategory[9]) {
                    for (i = 0; i < statisticalNames.length; i++) {
                        listOptions.add(new Option(statisticalNames[i]));
                    }
                } else if (ele.value === _this._functionCategory[10]) {
                    for (i = 0; i < textNames.length; i++) {
                        listOptions.add(new Option(textNames[i]));
                    }
                }
                $(listOptions[0]).prop("selected", true);
                list.trigger("change");
            });
        };

        InsertFunctionDialog.prototype._beforeOpen = function () {
            var fill = $("#formulaBarText");
            var fillText = fill.text();
            var selectionStart = fill[0].selectionStart;
            var _text;
            var _index;
            if (fillText !== undefined) {
                if (fillText.substring(0, 1) === "=") {
                    _text = fillText.substring(1, fillText.length);
                    _index = selectionStart - 1;
                } else {
                    _index = selectionStart;
                }
            }
            var list = this._element.find(".function-list-select");
            var listOptions = list[0].options;
            list.empty();
            for (var i = 0; i < allNames.length; i++) {
                listOptions.add(new Option(allNames[i]));
            }

            this._element.find(".function-category-select").prop("selectedIndex", 0);
            this._element.find(".function-list-select").prop("selectedIndex", 0);
            this._element.find(".function-list-select").trigger("change");

            //Set Active Cell's formula to formula input.
            var activeRowIndex = designer.wrapper.spread.getActiveSheet().getActiveRowIndex();
            var activeColIndex = designer.wrapper.spread.getActiveSheet().getActiveColumnIndex();
            var text = designer.wrapper.spread.getActiveSheet().getCell(activeRowIndex, activeColIndex).formula();
            var formula = this._element.find(".formula");
            if (_text !== undefined) {
                formula.prop("value", _text);
                formula.attr("caretIndex", _index);
                formula[0].selectionStart = _index;
                formula[0].selectionEnd = _index;
            } else if (text !== undefined && text !== null) {
                formula.prop("value", text);
                formula.attr("caretIndex", text.length);
                formula[0].selectionStart = parseInt(formula.attr("caretIndex"));
                formula[0].selectionEnd = parseInt(formula.attr("caretIndex"));
            } else {
                formula.prop("value", "");
                formula.attr("caretIndex", 0);
            }
        };
        return InsertFunctionDialog;
    })(designer.BaseDialog);
    designer.InsertFunctionDialog = InsertFunctionDialog;

    var ButtonCellTypeDialog = (function (_super) {
        designer.extends(ButtonCellTypeDialog, _super);
        function ButtonCellTypeDialog() {
            _super.call(this, (dialogHtmlPath), '.button-celltype-dialog');
        }

        ButtonCellTypeDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                modal: true,
                title: designer.res.buttonCellTypeDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var marginLeft = self._element.find(".margin-left");
                            var marginTop = self._element.find(".margin-top");
                            var marginRight = self._element.find(".margin-right");
                            var marginBottom = self._element.find(".margin-bottom");
                            var buttonText = self._element.find(".button-text");
                            var colorSpan = self._element.find(".color-span");

                            var type = new Sheets.CellTypes.Button();
                            if (marginLeft.val() !== "") {
                                type.marginLeft(parseFloat(marginLeft.val()));
                            }
                            if (marginTop.val() !== "") {
                                type.marginTop(parseFloat(marginTop.val()));
                            }
                            if (marginRight.val() !== "") {
                                type.marginRight(parseFloat(marginRight.val()));
                            }
                            if (marginBottom.val() !== "") {
                                type.marginBottom(parseFloat(marginBottom.val()));
                            }
                            if (buttonText.val() !== "") {
                                type.text(buttonText.val());
                            }
                            if (colorSpan.css("background-color") !== Helper._getTransparentColorString()) {
                                type.buttonBackColor(colorSpan.css("background-color"));
                            }

                            designer.actions.doAction('setCellType', designer.wrapper.spread, type);
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };
        ButtonCellTypeDialog.prototype._init = function () {
            var self = this;

            $(".button-backcolor-color-picker").colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('.color-span').css('background-color', "");
                    } else {
                        self._element.find('.color-span').css('background-color', value.color);
                    }
                },
                choosedColor: function (e, value) {
                    self._element.find('.color-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {
                    self._element.find('.color-frame').comboframe('close');
                }
            });
            this._element.find(".color-frame").comboframe();
        };
        ButtonCellTypeDialog.prototype._beforeOpen = function () {
            var marginLeft = this._element.find(".margin-left");
            var marginTop = this._element.find(".margin-top");
            var marginRight = this._element.find(".margin-right");
            var marginBottom = this._element.find(".margin-bottom");
            var buttonText = this._element.find(".button-text");
            var colorSpan = this._element.find(".color-span");
            var colorPicker = $(".button-backcolor-color-picker");

            $(".button-backcolor-color-picker").colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            var row = designer.wrapper.spread.getActiveSheet().getActiveRowIndex();
            var col = designer.wrapper.spread.getActiveSheet().getActiveColumnIndex();
            var activeCell = designer.wrapper.spread.getActiveSheet().getCell(row, col);
            var currentCellType = activeCell.cellType();
            var _btnCellType;
            if (currentCellType instanceof Sheets.CellTypes.Button) {
                _btnCellType = currentCellType;
            } else {
                _btnCellType = new Sheets.CellTypes.Button();
            }
            marginLeft.val(_btnCellType._marginLeft);
            marginTop.val(_btnCellType._marginTop);
            marginRight.val(_btnCellType._marginRight);
            marginBottom.val(_btnCellType._marginBottom);
            buttonText.val(_btnCellType._text);
            if (_btnCellType._buttonBackColor) {
                var colorItem = designer.ColorHelper.parse(_btnCellType._buttonBackColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                colorPicker.colorpicker('option', 'selectedItem', colorItem);
                colorSpan.css("background-color", colorItem.color);
            } else {
                colorPicker.colorpicker('option', 'selectedItem', null);
                colorSpan.css("background-color", "transparent");
            }
        };
        return ButtonCellTypeDialog;
    })(designer.BaseDialog);
    designer.ButtonCellTypeDialog = ButtonCellTypeDialog;

    var CheckBoxCellTypeDialog = (function (_super) {
        designer.extends(CheckBoxCellTypeDialog, _super);
        function CheckBoxCellTypeDialog() {
            _super.call(this, (dialogHtmlPath), '.checkbox-celltype-dialog');
        }

        CheckBoxCellTypeDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                modal: true,
                title: designer.res.checkBoxCellTypeDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var textTrue = self._element.find(".text-true");
                            var textIndeterminate = self._element.find(".text-indeterminate");
                            var textFalse = self._element.find(".text-false");
                            var textAlign = self._element.find(".text-align");
                            var caption = self._element.find(".caption");
                            var isThreeState = self._element.find(".isThreeState");

                            var type = new Sheets.CellTypes.CheckBox();
                            if (textTrue.val() !== "") {
                                type.textTrue(textTrue.val());
                            }
                            if (textIndeterminate.val() !== "") {
                                type.textIndeterminate(textIndeterminate.val());
                            }
                            if (textFalse.val() !== "") {
                                type.textFalse(textFalse.val());
                            }
                            if (caption.val() !== "") {
                                type.caption(caption.val());
                            }

                            type.textAlign(parseInt(textAlign.val()));
                            type.isThreeState(isThreeState.prop("checked"));

                            designer.actions.doAction('setCellType', designer.wrapper.spread, type);

                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        CheckBoxCellTypeDialog.prototype._init = function () {
            var textAlign = this._element.find(".text-align");
            var options = textAlign[0].options;
            options.add(new Option(designer.res.checkBoxCellTypeDialog.checkBoxTextAlign.top, "0"));
            options.add(new Option(designer.res.checkBoxCellTypeDialog.checkBoxTextAlign.bottom, "1"));
            options.add(new Option(designer.res.checkBoxCellTypeDialog.checkBoxTextAlign.left, "2"));
            options.add(new Option(designer.res.checkBoxCellTypeDialog.checkBoxTextAlign.right, "3"));
        };
        CheckBoxCellTypeDialog.prototype._beforeOpen = function () {
            var textTrue = this._element.find(".text-true");
            var textIndeterminate = this._element.find(".text-indeterminate");
            var textFalse = this._element.find(".text-false");
            var textAlign = this._element.find(".text-align");
            var options = textAlign[0].options;
            var caption = this._element.find(".caption");
            var isThreeState = this._element.find(".isThreeState");

            var row = designer.wrapper.spread.getActiveSheet().getActiveRowIndex();
            var col = designer.wrapper.spread.getActiveSheet().getActiveColumnIndex();
            var activeCell = designer.wrapper.spread.getActiveSheet().getCell(row, col);
            var currentCellType = activeCell.cellType();
            var _cellType;
            if (currentCellType instanceof Sheets.CellTypes.CheckBox) {
                _cellType = currentCellType;
            } else {
                _cellType = new Sheets.CellTypes.CheckBox();
            }

            textTrue.val(_cellType.textTrue());
            textIndeterminate.val(_cellType.textIndeterminate());
            textFalse.val(_cellType.textFalse());
            caption.val(_cellType.caption());
            $(options[parseInt(_cellType.textAlign())]).prop("selected", true);

            textAlign.prop("selected", _cellType.textAlign());
            isThreeState.prop("checked", _cellType.isThreeState());
        };
        return CheckBoxCellTypeDialog;
    })(designer.BaseDialog);
    designer.CheckBoxCellTypeDialog = CheckBoxCellTypeDialog;

    var ComboBoxCellTypeDialog = (function (_super) {
        designer.extends(ComboBoxCellTypeDialog, _super);
        function ComboBoxCellTypeDialog() {
            _super.call(this, (dialogHtmlPath), '.combobox-celltype-dialog');
        }

        ComboBoxCellTypeDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                width: 'auto',
                modal: true,
                title: designer.res.comboBoxCellTypeDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            //Save last setting before close.
                            var text = self._element.find(".text");
                            var value = self._element.find(".value");
                            if (self.selectedIndex !== -1 && self.selectedIndex < self.items.length) {
                                self.items[self.selectedIndex] = { text: text.val(), value: value.val() };
                            }

                            var editorValueType = self._element.find(".editor-valuetype");

                            var type = new Sheets.CellTypes.ComboBox();
                            type.editorValueType(parseInt(editorValueType.val()));
                            var isEditable = self._element.find("#combox-editable");
                            type.editable(isEditable.prop("checked"));
                            var itemsHeight = self._element.find(".combo-item-height");
                            var heights = parseFloat(itemsHeight.val());
                            if (!isNaN(heights)) {
                                type.itemHeight(heights);
                            }
                            if (self.items !== null && self.items !== undefined) {
                                type.items(self.items);
                            }

                            designer.actions.doAction('setCellType', designer.wrapper.spread, type);
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        ComboBoxCellTypeDialog.prototype._init = function () {
            var _this = this;
            this.selectedIndex = -1;
            var editorValueType = this._element.find(".editor-valuetype");
            var options = editorValueType[0].options;
            options.add(new Option(designer.res.comboBoxCellTypeDialog.editorValueType.text, "0"));
            options.add(new Option(designer.res.comboBoxCellTypeDialog.editorValueType.index, "1"));
            options.add(new Option(designer.res.comboBoxCellTypeDialog.editorValueType.value, "2"));
            var items = this._element.find(".items");
            var itemsOptions = items[0].options;
            var text = this._element.find(".text");
            var value = this._element.find(".value");

            var addBtn = this._element.find(".add-button");
            var removeBtn = this._element.find(".remove-button");
            addBtn.button();
            removeBtn.button();
            addBtn.click(function () {
                itemsOptions[itemsOptions.length] = new Option("ListItem" + itemsOptions.length.toString());
                if (_this.items === null) {
                    _this.items = [];
                }
                _this.items.push({ text: "", value: "" });
                text.removeAttr("disabled");
                value.removeAttr("disabled");
                items.trigger("change", { selectMoveTo: _this.items.length - 1, action: "add" });
            });
            removeBtn.click(function () {
                itemsOptions.remove(_this.selectedIndex);
                _this.items.splice(_this.selectedIndex, 1);
                var select;
                if (_this.items.length > _this.selectedIndex) {
                    select = _this.selectedIndex;
                } else if (_this.items.length > 0) {
                    select = _this.selectedIndex - 1;
                } else {
                    select = -1;
                    text.val("");
                    value.val("");
                    text.attr("disabled", true);
                    value.attr("disabled", true);
                }
                items.trigger("change", { selectMoveTo: select, action: "remove" });
            });
            items.change(function (evt, args) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;

                //Add or switch selected item need save data of item.
                if ((args === undefined || args.action === "add") && (_this.selectedIndex !== -1 && _this.selectedIndex < _this.items.length)) {
                    _this.items[_this.selectedIndex] = { text: text.val(), value: value.val() };
                }

                //Load data of item.
                if (args === undefined) {
                    var index = ele.value.substring(8);
                    _this.selectedIndex = parseInt(index);
                } else {
                    _this.selectedIndex = args.selectMoveTo;
                }
                if (_this.selectedIndex !== -1) {
                    $(itemsOptions[_this.selectedIndex]).prop("selected", true);
                    text.val(_this.items[_this.selectedIndex].text);
                    value.val(_this.items[_this.selectedIndex].value);
                }
            });
        };
        ComboBoxCellTypeDialog.prototype._beforeOpen = function () {
            var editorValueType = this._element.find(".editor-valuetype");
            var options = editorValueType[0].options;
            var items = this._element.find(".items");
            var itemsOptions = items[0].options;
            var text = this._element.find(".text");
            var value = this._element.find(".value");
            var itemHeight = this._element.find(".combo-item-height");
            var isEditable = this._element.find("#combox-editable");

            var row = designer.wrapper.spread.getActiveSheet().getActiveRowIndex();
            var col = designer.wrapper.spread.getActiveSheet().getActiveColumnIndex();
            var activeCell = designer.wrapper.spread.getActiveSheet().getCell(row, col);
            var currentCellType = activeCell.cellType();

            var _cellType;
            if (currentCellType instanceof Sheets.CellTypes.ComboBox) {
                _cellType = currentCellType;
            } else {
                _cellType = new Sheets.CellTypes.ComboBox();
            }
            itemHeight.val(_cellType.itemHeight());
            isEditable.prop("checked", _cellType.editable());
            $(options[parseInt(_cellType.editorValueType())]).prop("selected", true);
            this.items = _cellType.items();
            items.empty();
            if (this.items !== null && this.items !== undefined && this.items.length !== 0) {
                for (var i = 0; i < this.items.length; i++) {
                    itemsOptions[itemsOptions.length] = new Option("ListItem" + itemsOptions.length.toString());
                }
                text.removeAttr("disabled");
                value.removeAttr("disabled");
                $(itemsOptions[0]).prop("selected", true);
                text.val(this.items[0].text);
                value.val(this.items[0].value);
                this.selectedIndex = 0;
            } else {
                text.val("");
                value.val("");
                text.attr("disabled", true);
                value.attr("disabled", true);
            }
        };
        return ComboBoxCellTypeDialog;
    })(designer.BaseDialog);
    designer.ComboBoxCellTypeDialog = ComboBoxCellTypeDialog;

    var HyperLinkCellTypeDialog = (function (_super) {
        designer.extends(HyperLinkCellTypeDialog, _super);
        function HyperLinkCellTypeDialog() {
            _super.call(this, (dialogHtmlPath), '.hyperLink-celltype-dialog');
        }

        HyperLinkCellTypeDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                modal: true,
                title: designer.res.hyperLinkCellTypeDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var text = self._element.find(".text");
                            var linkToolTip = self._element.find(".linktooltip");
                            var linkColorSpan = self._element.find(".link-color-span");
                            var visitedLinkColorSpan = self._element.find(".visitedlink-color-span");
                            var type = new Sheets.CellTypes.HyperLink();
                            if (text.val() !== "") {
                                type.text(text.val());
                            }
                            if (linkToolTip.val() !== "") {
                                type.linkToolTip(linkToolTip.val());
                            }
                            if (linkColorSpan.css("background-color") !== Helper._getTransparentColorString()) {
                                type.linkColor(linkColorSpan.css("background-color"));
                            }
                            if (visitedLinkColorSpan.css("background-color") !== Helper._getTransparentColorString()) {
                                type.visitedLinkColor(visitedLinkColorSpan.css("background-color"));
                            }
                            designer.actions.doAction('setCellType', designer.wrapper.spread, type);
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        HyperLinkCellTypeDialog.prototype._init = function () {
            var self = this;

            $(".link-color-picker").colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('.link-color-span').css('background-color', "");
                    } else {
                        self._element.find('.link-color-span').css('background-color', value.color);
                    }
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.link-color-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.link-color-frame').comboframe('close');
                }
            });
            this._element.find(".link-color-frame").comboframe();
            $(".visitedlink-color-picker").colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('.visitedlink-color-span').css('background-color', "");
                    } else {
                        self._element.find('.visitedlink-color-span').css('background-color', value.color);
                    }
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.visitedlink-color-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.visitedlink-color-frame').comboframe('close');
                }
            });
            this._element.find(".visitedlink-color-frame").comboframe();
        };
        HyperLinkCellTypeDialog.prototype._beforeOpen = function () {
            var text = this._element.find(".text");
            var linktooltip = this._element.find(".linktooltip");
            var linkColorSpan = this._element.find(".link-color-span");
            var linkColorPicker = $(".link-color-picker");
            var visitedLinkColorSpan = this._element.find(".visitedlink-color-span");
            var visitedLinkColorPicker = $(".visitedlink-color-picker");

            linkColorPicker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            visitedLinkColorPicker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            var row = designer.wrapper.spread.getActiveSheet().getActiveRowIndex();
            var col = designer.wrapper.spread.getActiveSheet().getActiveColumnIndex();
            var activeCell = designer.wrapper.spread.getActiveSheet().getCell(row, col);
            var currentCellType = activeCell.cellType();
            var _cellType, colorItem;
            if (currentCellType instanceof Sheets.CellTypes.HyperLink) {
                _cellType = currentCellType;
            } else {
                _cellType = new Sheets.CellTypes.HyperLink();
            }

            linktooltip.val(_cellType._linkToolTip);
            text.val(_cellType._text);
            if (_cellType._linkColor) {
                colorItem = designer.ColorHelper.parse(_cellType._linkColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                linkColorPicker.colorpicker('option', 'selectedItem', colorItem);
                linkColorSpan.css("background-color", colorItem.color);
            } else {
                linkColorPicker.colorpicker('option', 'selectedItem', null);
                linkColorSpan.css("background-color", "transparent");
            }
            if (_cellType._visitedLinkColor) {
                colorItem = designer.ColorHelper.parse(_cellType._visitedLinkColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                visitedLinkColorPicker.colorpicker('option', 'selectedItem', colorItem);
                visitedLinkColorSpan.css("background-color", colorItem.color);
            } else {
                visitedLinkColorPicker.colorpicker('option', 'selectedItem', null);
                visitedLinkColorSpan.css("background-color", "transparent");
            }
        };
        return HyperLinkCellTypeDialog;
    })(designer.BaseDialog);
    designer.HyperLinkCellTypeDialog = HyperLinkCellTypeDialog;

    var HeaderCellsDialog = (function (_super) {
        designer.extends(HeaderCellsDialog, _super);
        function HeaderCellsDialog() {
            _super.call(this, (dialogHtmlPath), '.header-cells-dialog');
        }

        // borderLineStyle number to string
        var _borderLineStyle = {
            0: "empty",
            1: "thin",
            2: "medium",
            3: "dashed",
            4: "dotted",
            5: "thick",
            6: "double",
            7: "hair",
            8: "mediumDashed",
            9: "dashDot",
            10: "mediumDashDot",
            11: "dashDotDot",
            12: "mediumDashDotDot",
            13: "slantedDashDot"
        };


        HeaderCellsDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 740,
                height: 720,
                resizable: false,
                modal: true,
                title: designer.res.headerCellsDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._saveChanges(self._sheetArea);
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        function updateSpreadSetting(spread) {
            spread.sheets[0].selectionPolicy(1 /* Range */);
            spread.options.tabStripVisible = false;
            spread.options.allowContextMenu = false;
        }

        HeaderCellsDialog.prototype._init = function () {
            this._hasError = false;
            this._element.find(".font-popup").button();
            this._settingTab = this._element.find(".header-tab").tabs();
            this._rowSpread = new Sheets.Workbook(this._element.find("#rowHeaderTab")[0], { sheetCount: 1 });
            this._colSpread = new Sheets.Workbook(this._element.find("#columnHeaderTab")[0], { sheetCount: 1 });
            var rowSpread = this._rowSpread;
            rowSpread.options.allowContextMenu = false;
            var colSpread = this._colSpread;
            colSpread.options.allowContextMenu = false;
            updateSpreadSetting(rowSpread);
            updateSpreadSetting(colSpread);
            var hAlign = this._element.find(".hAlign");
            var vAlign = this._element.find(".vAlign");
            for (var align in Sheets.HorizontalAlign) {
                if (Sheets.HorizontalAlign.hasOwnProperty(align)) {
                    hAlign.append($('<option></option>').val(align).text(designer.res.headerCellsDialog[align]));
                }
            }
            for (align in Sheets.VerticalAlign) {
                if (Sheets.VerticalAlign.hasOwnProperty(align)) {
                    vAlign.append($('<option></option>').val(align).text(designer.res.headerCellsDialog[align]));
                }
            }
            this._addEvents(rowSpread, colSpread);
            this._element.find(".backColor-colorframe").comboframe();
            this._element.find(".foreColor-colorframe").comboframe();
            this._element.find(".borderBottom-borderframe").comboframe();
            this._element.find(".borderLeft-borderframe").comboframe();
            this._element.find(".borderRight-borderframe").comboframe();
            this._element.find(".borderTop-borderframe").comboframe();
            this._element.find(".diagonalUp-borderframe").comboframe();
            this._element.find(".diagonalDown-borderframe").comboframe();
            var borderBottomPicker = $(".borderBottom-borderpicker");
            var borderLeftPicker = $(".borderLeft-borderpicker");
            var borderRightPicker = $(".borderRight-borderpicker");
            var borderTopPicker = $(".borderTop-borderpicker");
            var diagonalUpPicker = $(".diagonalUp-borderpicker");
            var diagonalDownPicker = $(".diagonalDown-borderpicker");
            borderBottomPicker.borderpicker('option', 'colorOptions', {
                showMoreColors: false,
                showNoFill: false
            });
            borderLeftPicker.borderpicker('option', 'colorOptions', {
                showMoreColors: false,
                showNoFill: false
            });
            borderRightPicker.borderpicker('option', 'colorOptions', {
                showMoreColors: false,
                showNoFill: false
            });
            borderTopPicker.borderpicker('option', 'colorOptions', {
                showMoreColors: false,
                showNoFill: false
            });
            diagonalUpPicker.borderpicker('option', 'colorOptions', {
                showMoreColors: false,
                showNoFill: false
            });
            diagonalDownPicker.borderpicker('option', 'colorOptions', {
                showMoreColors: false,
                showNoFill: false
            });

        };

        HeaderCellsDialog.prototype._beforeOpen = function (args) {
            var self = this;
            if (!this._initialized) {
                // If initialize ribbon in _init method, the ko binding will lost. So, I delay it to first time
                // the _beforeOpen occure. This time, ko binding was applied.
                this._initialized = true;
                this._element.find(".button-set").gcuiribbon({
                    click: function (e, cmd) {
                        var dab, i;
                        var sheet = self._currentSpread.getActiveSheet();
                        switch (cmd.commandName) {
                            case "merge":
                                designer.actions.doAction("mergeCells", self._currentSpread);
                                break;
                            case "unmerge":
                                designer.actions.doAction("unmergeCells", self._currentSpread);
                                break;
                            case "insertrows":
                                designer.actions.doAction("insertRows", self._currentSpread);
                                break;
                            case "addrows":
                                dab = new designer.spreadActions.InsertAndDeleteBase(self._currentSpread, {
                                    sheetName: sheet.sheetName,
                                    selections: sheet.getSelections()
                                });
                                var sortedRows = dab.getSortedRowSelections();
                                for (i = 0; i < sortedRows.length; i++) {
                                    self._currentSpread.sheets[0].addRows(self._currentSpread.sheets[0].getRowCount(), sortedRows[i].rowCount);
                                }
                                break;
                            case "deleterows":
                                designer.actions.doAction("deleteRows", self._currentSpread);
                                break;
                            case "insertcolumns":
                                designer.actions.doAction("insertColumns", self._currentSpread);
                                break;
                            case "addcolumns":
                                dab = new designer.spreadActions.InsertAndDeleteBase(self._currentSpread, {
                                    sheetName: sheet.sheetName,
                                    selections: sheet.getSelections()
                                });
                                var sortedColumns = dab.getSortedColumnSelections();
                                for (i = 0; i < sortedColumns.length; i++) {
                                    self._currentSpread.sheets[0].addColumns(self._currentSpread.sheets[0].getColumnCount(), sortedColumns[i].colCount);
                                }
                                break;
                            case "deletecolumns":
                                designer.actions.doAction("deleteColumns", self._currentSpread);
                                break;
                            case "clear":
                                designer.actions.doAction("clearAll", self._currentSpread);
                                break;
                        }
                    }
                });
            }

            //Following code is to aviod the bug of ribbon.
            this._element.find(".gcui-ribbon-list").removeClass("gcui-gcuitabs-hide");

            var _tabIndex;
            var rowSpread = this._rowSpread, colSpread = this._colSpread;
            switch (args[0]) {
                case "row":
                    _tabIndex = 0;
                    this._currentSpread = rowSpread;
                    this._sheetArea = 2 /* rowHeader */;
                    this._setActiveCell("row");
                    designer.util.triggerSheetEvent(rowSpread.sheets[0], Sheets.Events.SelectionChanged);

                    setTimeout(function () {
                        rowSpread.refresh();
                    }, 0);
                    break;
                case "col":
                    _tabIndex = 1;
                    this._currentSpread = colSpread;
                    this._sheetArea = 1 /* colHeader */;
                    this._setActiveCell("col");
                    designer.util.triggerSheetEvent(colSpread.sheets[0], Sheets.Events.SelectionChanged);
                    setTimeout(function () {
                        colSpread.refresh();
                    }, 0);
                    break;
            }
            this._switchLayout(args[0]);
            this._settingTab.tabs("option", "active", _tabIndex);

            this._synColRowCount(rowSpread, colSpread);
            this._loadToSheet(1 /* colHeader */, colSpread);
            this._loadToSheet(2 /* rowHeader */, rowSpread);
            this._setActiveCell(args[0]);
            this._synToPropertyGrid("cell");

            var backColorPicker = $(".backColor-colorpicker");
            var foreColorPicker = $(".foreColor-colorpicker");
            backColorPicker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            foreColorPicker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
        };

        HeaderCellsDialog.prototype._synColRowCount = function (rowSpread, colSpread, isSaveChange) {
            if (isSaveChange) {
                var rowColumnCount1 = rowSpread.sheets[0].getColumnCount(3 /* viewport */);
                var colColumnCount1 = colSpread.sheets[0].getColumnCount(3 /* viewport */);
                var rowRowCount1 = rowSpread.sheets[0].getRowCount(3 /* viewport */);
                var colRowCount1 = colSpread.sheets[0].getRowCount(3 /* viewport */);
                designer.wrapper.spread.getActiveSheet().setColumnCount(rowColumnCount1, 2 /* rowHeader */);
                designer.wrapper.spread.getActiveSheet().setRowCount(rowRowCount1, 2 /* rowHeader */);
                designer.wrapper.spread.getActiveSheet().setColumnCount(colColumnCount1, 1 /* colHeader */);
                designer.wrapper.spread.getActiveSheet().setRowCount(colRowCount1, 1 /* colHeader */);
            } else {
                var rowColumnCount = designer.wrapper.spread.getActiveSheet().getColumnCount(2 /* rowHeader */);
                var colColumnCount = designer.wrapper.spread.getActiveSheet().getColumnCount(1 /* colHeader */);
                var rowRowCount = designer.wrapper.spread.getActiveSheet().getRowCount(2 /* rowHeader */);
                var colRowCount = designer.wrapper.spread.getActiveSheet().getRowCount(1 /* colHeader */);
                rowSpread.sheets[0].setColumnCount(rowColumnCount);
                rowSpread.sheets[0].setRowCount(rowRowCount);
                colSpread.sheets[0].setColumnCount(colColumnCount);
                colSpread.sheets[0].setRowCount(colRowCount);
            }
        };

        HeaderCellsDialog.prototype._setActiveCell = function (args) {
            var row = 0;
            var col = 0;
            switch (args) {
                case "row":
                    row = designer.wrapper.spread.getActiveSheet().getActiveRowIndex();
                    break;
                case "col":
                    col = designer.wrapper.spread.getActiveSheet().getActiveColumnIndex();
                    break;
            }
            this._currentSpread.sheets[0].setActiveCell(row, col);
        };

        HeaderCellsDialog.prototype._synToPropertyGrid = function (tabType) {
            var sheet = this._currentSpread.sheets[0];
            var colIndex = sheet.getActiveColumnIndex();
            var rowIndex = sheet.getActiveRowIndex();
            var value = sheet.getValue(rowIndex, colIndex, 3 /* viewport */);
            var colWidth = sheet.getColumnWidth(colIndex, 3 /* viewport */);
            var rowHeight = sheet.getRowHeight(rowIndex, 3 /* viewport */);
            var colVisible = sheet.getColumnVisible(colIndex, 3 /* viewport */);
            var rowVisible = sheet.getRowVisible(rowIndex, 3 /* viewport */);
            var colResizable = sheet.getColumnResizable(colIndex, 3 /* viewport */);
            var rowResizable = sheet.getRowResizable(rowIndex, 3 /* viewport */);

            var height = this._element.find(".height");
            var valueEle = this._element.find(".value");
            var visible = this._element.find(".visible");
            var width = this._element.find(".width");
            var resizable = this._element.find(".resizable");

            height.val(rowHeight);
            if (value !== null) {
                valueEle.val(value.toString());
            } else {
                valueEle.val("");
            }
            width.val(colWidth);
            var style;
            switch (tabType) {
                case "row":
                    resizable.prop("checked", rowResizable);
                    visible.prop("checked", rowVisible);
                    style = sheet.getStyle(rowIndex, -1, 3 /* viewport */);
                    break;
                case "col":
                    resizable.prop("checked", colResizable);
                    visible.prop("checked", colVisible);
                    style = sheet.getStyle(-1, colIndex, 3 /* viewport */);
                    break;
                case "cell":
                    style = sheet.getStyle(rowIndex, colIndex, 3 /* viewport */);
                    break;
                case "sheet":
                    style = sheet.getStyle(-1, -1, 3 /* viewport */);
                    break;
            }
            var backColorSpan = this._element.find('.backColor-colorspan');
            var backColorPicker = $(".backColor-colorpicker");
            var foreColorSpan = this._element.find(".foreColor-colorspan");
            var foreColorPicker = $(".foreColor-colorpicker");

            var borderBottomSpan = this._element.find('.borderBottom-borderspan');
            var borderLeftSpan = this._element.find(".borderLeft-borderspan");
            var borderRightSpan = this._element.find('.borderRight-borderspan');
            var borderTopSpan = this._element.find(".borderTop-borderspan");
            var diagonalUpSpan = this._element.find(".diagonalUp-borderspan");
            var diagonalDownSpan = this._element.find(".diagonalDown-borderspan");

            var font = this._element.find(".font");
            var formatter = this._element.find(".formatter");
            var hAlign = this._element.find(".hAlign");
            var locked = this._element.find(".locked");
            var verticalText = this._element.find(".verticalText");
            var shrinkToFit = this._element.find(".shrinkToFit");
            var textIndent = this._element.find(".textIndent");
            var vAlign = this._element.find(".vAlign");
            var wordWrap = this._element.find(".wordWrap");
            var hAlignOptions = hAlign[0].options;
            var vAlignOptions = vAlign[0].options;
            var colorItem, lb, border;
            if (style !== null && style !== undefined) {
                if (style.backColor !== undefined) {
                    colorItem = designer.ColorHelper.parse(style.backColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    backColorPicker.colorpicker('option', 'selectedItem', colorItem);
                    backColorSpan.css("background-color", colorItem.color);
                } else {
                    backColorPicker.colorpicker('option', 'selectedItem', null);
                    backColorSpan.css("background-color", "transparent");
                }
                if (style.foreColor !== undefined) {
                    colorItem = designer.ColorHelper.parse(style.foreColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
                    foreColorPicker.colorpicker('option', 'selectedItem', colorItem);
                    foreColorSpan.css("background-color", colorItem.color);
                } else {
                    foreColorPicker.colorpicker('option', 'selectedItem', null);
                    foreColorSpan.css("background-color", "transparent");
                }
                if (style.borderBottom !== undefined) {
                    lb = style.borderBottom;
                    border = "";
                    if (lb.color !== undefined && lb.color !== null) {
                        border = lb.color;
                    }
                    if (lb.style !== undefined && lb.style !== null) {
                        border += ";" + _borderLineStyle[lb.style];
                    }
                    borderBottomSpan.val(border);
                } else {
                    borderBottomSpan.val("");
                }
                if (style.borderLeft !== undefined) {
                    lb = style.borderLeft;
                    border = "";
                    if (lb.color !== undefined && lb.color !== null) {
                        border = lb.color;
                    }
                    if (lb.style !== undefined && lb.style !== null) {
                        border += ";" + _borderLineStyle[lb.style];
                    }
                    borderLeftSpan.val(border);
                } else {
                    borderLeftSpan.val("");
                }
                if (style.borderRight !== undefined) {
                    lb = style.borderRight;
                    border = "";
                    if (lb.color !== undefined && lb.color !== null) {
                        border = lb.color;
                    }
                    if (lb.style !== undefined && lb.style !== null) {
                        border += ";" + _borderLineStyle[lb.style];
                    }
                    borderRightSpan.val(border);
                } else {
                    borderRightSpan.val("");
                }
                if (style.borderTop !== undefined) {
                    lb = style.borderTop;
                    border = "";
                    if (lb.color !== undefined && lb.color !== null) {
                        border = lb.color;
                    }
                    if (lb.style !== undefined && lb.style !== null) {
                        border += ";" + _borderLineStyle[lb.style];
                    }
                    borderTopSpan.val(border);
                } else {
                    borderTopSpan.val("");
                }
                if (style.diagonalUp !== undefined) {
                    lb = style.diagonalUp;
                    border = "";
                    if (lb.color !== undefined && lb.color !== null) {
                        border = lb.color;
                    }
                    if (lb.style !== undefined && lb.style !== null) {
                        border += ";" + _borderLineStyle[lb.style];
                    }
                    diagonalUpSpan.val(border);
                } else {
                    diagonalUpSpan.val("");
                }
                if (style.diagonalDown !== undefined) {
                    lb = style.diagonalDown;
                    border = "";
                    if (lb.color !== undefined && lb.color !== null) {
                        border = lb.color;
                    }
                    if (lb.style !== undefined && lb.style !== null) {
                        border += ";" + _borderLineStyle[lb.style];
                    }
                    diagonalDownSpan.val(border);
                } else {
                    diagonalDownSpan.val("");
                }
                if (style.font !== undefined) {
                    font.val(style.font);
                } else {
                    font.val("");
                }
                if (style.formatter !== undefined) {
                    formatter.val(style.formatter);
                } else {
                    formatter.val("");
                }
                if (style.textIndent !== undefined) {
                    textIndent.val(style.textIndent);
                } else {
                    textIndent.val("");
                }
                if (style.locked !== undefined) {
                    locked.prop("checked", style.locked);
                } else {
                    locked.prop("checked", true);
                }
                if (style.wordWrap !== undefined) {
                    wordWrap.prop("checked", style.wordWrap);
                } else {
                    wordWrap.prop("checked", false);
                }
                if (style.shrinkToFit !== undefined) {
                    shrinkToFit.prop("checked", style.shrinkToFit);
                } else {
                    shrinkToFit.prop("checked", false);
                }
                if (style.isVerticalText !== undefined) {
                    verticalText.prop("checked", style.isVerticalText);
                } else {
                    verticalText.prop("checked", false);
                }
                if (style.hAlign !== undefined) {
                    $(hAlignOptions[parseInt(style.hAlign)]).prop("selected", true);
                } else {
                    $(hAlignOptions[3]).prop("selected", true);
                }
                if (style.vAlign !== undefined) {
                    $(vAlignOptions[parseInt(style.vAlign)]).prop("selected", true);
                } else {
                    $(vAlignOptions[1]).prop("selected", true);
                }
            } else {
                backColorPicker.colorpicker('option', 'selectedItem', null);
                backColorSpan.css("background-color", "transparent");
                foreColorPicker.colorpicker('option', 'selectedItem', null);
                foreColorSpan.css("background-color", "transparent");

                borderBottomSpan.val("");
                borderLeftSpan.val("");
                borderRightSpan.val("");
                borderTopSpan.val("");
                diagonalUpSpan.val("");
                diagonalDownSpan.val("");
                font.val("");
                formatter.val("");
                textIndent.val("");

                locked.prop("checked", true);
                wordWrap.prop("checked", false);
                shrinkToFit.prop("checked", false);
                verticalText.prop("checked", false);
                $(hAlignOptions[3]).prop("selected", true);
                $(vAlignOptions[1]).prop("selected", true);
            }
        };

        HeaderCellsDialog.prototype._loadToSheet = function (sheetArea, s) {
            var targetSpread;
            if (s) {
                targetSpread = s;
            } else {
                targetSpread = this._currentSpread;
            }
            targetSpread.suspendPaint();
            try {
                var sourceSheet = designer.wrapper.spread.getActiveSheet();
                var targetSheet = targetSpread.sheets[0];
                var i;
                for (i = 0; i < targetSheet.getRowCount(); i++) {
                    for (var j = 0; j < targetSheet.getColumnCount(); j++) {
                        this._copyCell(sourceSheet, targetSheet, i, j, sheetArea, 3 /* viewport */);
                    }
                }

                for (i = 0; i < targetSheet.getColumnCount(); i++) {
                    this._copyCell(sourceSheet, targetSheet, -1, i, sheetArea, 3 /* viewport */);
                }

                for (i = 0; i < targetSheet.getRowCount(); i++) {
                    this._copyCell(sourceSheet, targetSheet, i, -1, sheetArea, 3 /* viewport */);
                }

                //Load all sheets.
                this._copyCell(sourceSheet, targetSheet, -1, -1, sheetArea, 3 /* viewport */);

                this._copySheet(sourceSheet, targetSheet, sheetArea, 3 /* viewport */);
            } catch (e) {
                targetSpread.resumePaint();
            }
            targetSpread.resumePaint();
        };

        HeaderCellsDialog.prototype._saveChanges = function (sheetArea) {  /* NOSONAR: UnusedFunctionArgument */
            if (this._hasError) {
                MessageBox.show(designer.res.headerCellsDialog.exception, designer.res.title, 3 /* error */, 0 /* ok */);
                return;
            }
            designer.wrapper.spread.suspendPaint();
            try {
                var rowSheet = this._rowSpread.sheets[0], colSheet = this._colSpread.sheets[0];
                var rowSheetTemp = new GC.Spread.Sheets.Worksheet('rowSheetTemp');
                rowSheetTemp.fromJSON(rowSheet.toJSON());
                var colSheetTemp = new GC.Spread.Sheets.Worksheet('colSheetTemp');
                colSheetTemp.fromJSON(colSheet.toJSON());
                var options = {
                    rowSheet: rowSheetTemp,
                    colSheet: colSheetTemp
                };
                designer.actions.doAction('baseDialogCommand', designer.wrapper.spread, {
                    value: options,
                    execute: designer.spreadActions.dialogAction.headerCellsApplySetting
                    //Set all sheets.
                });
            } catch (e) {
                designer.wrapper.spread.resumePaint();
            }

            designer.wrapper.spread.resumePaint();

            this.close();
        };

        HeaderCellsDialog.prototype._copyCell = function (sourceSheet, targetSheet, row, col, sourceArea, targetArea) {
            var style = sourceSheet.getStyle(row, col, sourceArea);

            targetSheet.setStyle(row, col, style, targetArea);

            var value = sourceSheet.getValue(row, col, sourceArea);
            var targetValue = targetSheet.getValue(row, col, targetArea);
            if (value !== targetValue) {
                targetSheet.setValue(row, col, value, targetArea);
            }
            var columnWidth = sourceSheet.getColumnWidth(col, sourceArea);
            if (columnWidth !== undefined && columnWidth >= 0) {
                targetSheet.setColumnWidth(col, columnWidth, targetArea);
            }
            var rowHeight = sourceSheet.getRowHeight(row, sourceArea);
            if (rowHeight !== undefined && rowHeight >= 0) {
                targetSheet.setRowHeight(row, rowHeight, targetArea);
            }
            var columnVisible = sourceSheet.getColumnVisible(col, sourceArea);
            targetSheet.setColumnVisible(col, columnVisible, targetArea);
            var rowVisible = sourceSheet.getRowVisible(row, sourceArea);
            targetSheet.setRowVisible(row, rowVisible, targetArea);
            var columnResizable = sourceSheet.getColumnResizable(col, sourceArea);
            targetSheet.setColumnResizable(col, columnResizable, targetArea);
            var rowResizable = sourceSheet.getRowResizable(row, sourceArea);
            targetSheet.setRowResizable(row, rowResizable, targetArea);
        };

        HeaderCellsDialog.prototype._copySheet = function (sourceSheet, targetSheet, sourceArea, targetArea) {
            //Load ribbon bar setting.
            //MergeInfo.
            var spans = targetSheet.getSpans(undefined, targetArea);
            for (var i = 0; i < spans.length; i++) {
                targetSheet.removeSpan(spans[i].row, spans[i].col, targetArea);
            }

            spans = sourceSheet.getSpans(undefined, sourceArea);
            if (spans.length !== 0) {
                for (i = 0; i < spans.length; i++) {
                    targetSheet.addSpan(spans[i].row, spans[i].col, spans[i].rowCount, spans[i].colCount, targetArea);
                }
            }
        };
        HeaderCellsDialog.prototype._switchLayout = function (tabType) {
            //switch tab.
            var container = this._element.find(".property-grid-container");
            var grid = this._element.find(".property-grid");
            var tab = this._element.find(".header-tab");
            switch (tabType) {
                case "row":
                    tab.addClass("rowheader-sheet");
                    tab.removeClass("columnheader-sheet");
                    grid.addClass("rowheader-porpertygird");
                    grid.removeClass("columnheader-porpertygird");
                    container.removeClass("columnheader-property-grid-container");
                    break;
                case "col":
                    tab.addClass("columnheader-sheet");
                    tab.removeClass("rowheader-sheet");
                    grid.addClass("columnheader-porpertygird");
                    grid.removeClass("rowheader-porpertygird");
                    container.addClass("columnheader-property-grid-container");
                    break;
            }
        };
        HeaderCellsDialog.prototype._setBorders = function (type) {
            var s = new Sheets.Style();
            var border, color, linestyle;
            switch (type) {
                case "bottom":
                    border = $('.borderBottom-borderspan').val();
                    break;
                case "top":
                    border = $('.borderTop-borderspan').val();
                    break;
                case "left":
                    border = $('.borderLeft-borderspan').val();
                    break;
                case "right":
                    border = $('.borderRight-borderspan').val();
                    break;
                case "diagonalUp":
                    border = $('.diagonalUp-borderspan').val();
                    break;
                case "diagonalDown":
                    border = $('.diagonalDown-borderspan').val();
                    break;
            }
            if (border) {
                color = border.split(";")[0];
                linestyle = border.split(";")[1];
            }
            switch (type) {
                case "bottom":
                    s.borderBottom = new Sheets.LineBorder(color, Sheets.LineStyle[linestyle]);
                    break;
                case "top":
                    s.borderTop = new Sheets.LineBorder(color, Sheets.LineStyle[linestyle]);
                    break;
                case "left":
                    s.borderLeft = new Sheets.LineBorder(color, Sheets.LineStyle[linestyle]);
                    break;
                case "right":
                    s.borderRight = new Sheets.LineBorder(color, Sheets.LineStyle[linestyle]);
                    break;
                case "diagonalUp":
                    s.diagonalUp = new Sheets.LineBorder(color, Sheets.LineStyle[linestyle]);
                    break;
                case "diagonalDown":
                    s.diagonalDown = new Sheets.LineBorder(color, Sheets.LineStyle[linestyle]);
                    break;
            }

            designer.actions.doAction('setStyle', this._currentSpread, s);
        };
        HeaderCellsDialog.prototype._addEvents = function (rowSpread, colSpread) {  /* NOSONAR: S138 LargeFunction */
            var _this = this;
            var backColorPicker = $(".backColor-colorpicker");
            var foreColorPicker = $(".foreColor-colorpicker");
            var borderBottomSpan = this._element.find('.borderBottom-borderspan');
            var borderBottomPicker = $(".borderBottom-borderpicker");
            var borderLeftSpan = this._element.find(".borderLeft-borderspan");
            var borderLeftPicker = $(".borderLeft-borderpicker");
            var borderRightSpan = this._element.find('.borderRight-borderspan');
            var borderRightPicker = $(".borderRight-borderpicker");
            var borderTopSpan = this._element.find(".borderTop-borderspan");
            var borderTopPicker = $(".borderTop-borderpicker");
            var diagonalUpSpan = this._element.find(".diagonalUp-borderspan");
            var diagonalUpPicker = $(".diagonalUp-borderpicker");
            var diagonalDownSpan = this._element.find(".diagonalDown-borderspan");
            var diagonalDownPicker = $(".diagonalDown-borderpicker");
            var font = this._element.find(".font");
            var formatter = this._element.find(".formatter");
            var hAlign = this._element.find(".hAlign");
            var locked = this._element.find(".locked");
            var shrinkToFit = this._element.find(".shrinkToFit");
            var verticalText = this._element.find(".verticalText");
            var textIndent = this._element.find(".textIndent");
            var vAlign = this._element.find(".vAlign");
            var wordWrap = this._element.find(".wordWrap");
            var height = this._element.find(".height");
            var valueEle = this._element.find(".value");
            var visible = this._element.find(".visible");
            var width = this._element.find(".width");
            var resizable = this._element.find(".resizable");

            var self = this;
            backColorPicker.colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('.backColor-colorspan').css('background-color', "");
                        designer.actions.doAction('setBackColor', self._currentSpread, undefined);
                    } else {
                        self._element.find('.backColor-colorspan').css('background-color', value.color);
                        var s = new Sheets.Style();
                        s.backColor = value.color;
                        designer.actions.doAction('setStyle', self._currentSpread, s);
                    }
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.backColor-colorframe').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.backColor-colorframe').comboframe('close');
                }
            });
            foreColorPicker.colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('.foreColor-colorspan').css('background-color', "");
                        designer.actions.doAction('setForeColor', self._currentSpread, undefined);
                    } else {
                        self._element.find('.foreColor-colorspan').css('background-color', value.color);
                        var s = new Sheets.Style();
                        s.foreColor = value.color;
                        designer.actions.doAction('setStyle', self._currentSpread, s);
                    }
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.foreColor-colorframe').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.foreColor-colorframe').comboframe('close');
                }
            });

            borderBottomPicker.borderpicker({
                colorChanged: function (e, value) {
                    borderBottomSpan.val(value.color + ";" + _borderLineStyle[borderBottomPicker.borderpicker("option", "lineStyle")]);
                    self._setBorders("bottom");
                },
                lineStyleChanged: function (e, value) {
                    borderBottomSpan.val(borderBottomPicker.borderpicker("option", "borderColor").color + ";" + _borderLineStyle[value]);
                    self._setBorders("bottom");
                }
            });
            borderLeftPicker.borderpicker({
                colorChanged: function (e, value) {
                    borderLeftSpan.val(value.color + ";" + _borderLineStyle[borderLeftPicker.borderpicker("option", "lineStyle")]);
                    self._setBorders("left");
                },
                lineStyleChanged: function (e, value) {
                    borderLeftSpan.val(borderLeftPicker.borderpicker("option", "borderColor").color + ";" + _borderLineStyle[value]);
                    self._setBorders("left");
                }
            });
            borderRightPicker.borderpicker({
                colorChanged: function (e, value) {
                    borderRightSpan.val(value.color + ";" + _borderLineStyle[borderRightPicker.borderpicker("option", "lineStyle")]);
                    self._setBorders("right");
                },
                lineStyleChanged: function (e, value) {
                    borderRightSpan.val(borderRightPicker.borderpicker("option", "borderColor").color + ";" + _borderLineStyle[value]);
                    self._setBorders("right");
                }
            });
            borderTopPicker.borderpicker({
                colorChanged: function (e, value) {
                    borderTopSpan.val(value.color + ";" + _borderLineStyle[borderTopPicker.borderpicker("option", "lineStyle")]);
                    self._setBorders("top");
                },
                lineStyleChanged: function (e, value) {
                    borderTopSpan.val(borderTopPicker.borderpicker("option", "borderColor").color + ";" + _borderLineStyle[value]);
                    self._setBorders("top");
                }
            });
            diagonalUpPicker.borderpicker({
                colorChanged: function (e, value) {
                    diagonalUpSpan.val(value.color + ";" + _borderLineStyle[diagonalUpPicker.borderpicker("option", "lineStyle")]);
                    self._setBorders("diagonalUp");
                },
                lineStyleChanged: function (e, value) {
                    diagonalUpSpan.val(diagonalUpPicker.borderpicker("option", "borderColor").color + ";" + _borderLineStyle[value]);
                    self._setBorders("diagonalUp");
                }
            });
            diagonalDownPicker.borderpicker({
                colorChanged: function (e, value) {
                    diagonalDownSpan.val(value.color + ";" + _borderLineStyle[diagonalDownPicker.borderpicker("option", "lineStyle")]);
                    self._setBorders("diagonalDown");
                },
                lineStyleChanged: function (e, value) {
                    diagonalDownSpan.val(diagonalDownPicker.borderpicker("option", "borderColor").color + ";" + _borderLineStyle[value]);
                    self._setBorders("diagonalDown");
                }
            });
            formatter.change(function () {
                designer.actions.doAction('setFormatter', _this._currentSpread, formatter.val());
            });
            height.change(function () {
                height.removeClass("ui-state-error");
                _this._hasError = false;
                if ($.isNumeric(height.val()) && parseInt(height.val()) >= 0 && parseInt(height.val()) === parseFloat(height.val())) {
                    designer.actions.doAction('setRowsHeight', _this._currentSpread, parseInt(height.val()));
                } else {
                    height.addClass("ui-state-error");
                    _this._hasError = true;
                }
            });

            resizable.change(function () {
                var sel = designer.spreadActions.getSelectionType(_this._currentSpread);

                switch (sel) {
                    case 2 /* OnlyColumn */
                        :
                        designer.spreadActions.DesignerActionBase.prototype.execInSelectionsForCol(self._currentSpread.sheets[0], function (sheet, col) {
                            self._currentSpread.sheets[0].setColumnResizable(col, resizable.prop("checked"), 1 /* colHeader */);
                        });
                        break;
                    case 1 /* OnlyRow */
                        :
                        designer.spreadActions.DesignerActionBase.prototype.execInSelectionsForRow(self._currentSpread.sheets[0], function (sheet, row) {
                            self._currentSpread.sheets[0].setRowResizable(row, resizable.prop("checked"), 2 /* rowHeader */);
                        });
                        break;
                }
            });
            valueEle.change(function (evt) {  /* NOSONAR: UnusedFunctionArgument */
                var value = valueEle.val();
                var sheet = self._currentSpread.sheets[0];
                self._currentSpread.suspendPaint();

                try {
                    designer.spreadActions.DesignerActionBase.prototype.execInSelections(sheet, "", function (sheet2, row, col) {
                        sheet2.getCell(row, col).text(value);
                    });
                } catch (e) {
                    self._currentSpread.resumePaint();
                }

                self._currentSpread.resumePaint();
            });
            visible.change(function () {
                var sel = designer.spreadActions.getSelectionType(_this._currentSpread);

                var action;
                switch (sel) {
                    case 2 /* OnlyColumn */
                        :
                        action = visible.prop("checked") === true ? "unHideColumns" : "hideColumns";
                        break;
                    case 1 /* OnlyRow */
                        :
                        action = visible.prop("checked") === true ? "unHideRows" : "hideRows";
                        break;
                }
                designer.actions.doAction(action, _this._currentSpread, visible.val());
            });
            width.change(function () {
                width.removeClass("ui-state-error");
                _this._hasError = false;
                if ($.isNumeric(width.val()) && parseInt(width.val()) >= 0 && parseInt(width.val()) === parseFloat(width.val())) {
                    designer.actions.doAction('setColumnsWidth', _this._currentSpread, parseInt(width.val()));
                } else {
                    width.addClass("ui-state-error");
                    _this._hasError = true;
                }
            });

            var setStyle = function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var s = new Sheets.Style();
                switch (srcElement.id) {
                    case "hAlign":
                        s.hAlign = parseInt(Sheets.HorizontalAlign[hAlign.val()]);
                        break;
                    case "locked":
                        s.locked = locked.prop("checked");
                        break;
                    case "shrinkToFit":
                        s.shrinkToFit = shrinkToFit.prop("checked");
                        break;
                    case "verticalText":
                        s.isVerticalText = verticalText.prop("checked");
                        break;
                    case "textIndent":
                        textIndent.removeClass("ui-state-error");
                        _this._hasError = false;
                        if ($.isNumeric(textIndent.val()) && parseInt(textIndent.val()) >= 0 && parseInt(textIndent.val()) === parseFloat(textIndent.val())) {
                            s.textIndent = parseInt(textIndent.val());
                        } else if (textIndent.val() === "") {
                            s.textIndent = keyword_undefined;
                        } else {
                            textIndent.addClass("ui-state-error");
                            _this._hasError = true;
                        }
                        break;
                    case "vAlign":
                        s.vAlign = parseInt(Sheets.VerticalAlign[vAlign.val()]);
                        break;
                    case "wordWrap":
                        s.wordWrap = wordWrap.prop("checked");
                        break;
                    case "font":
                        s.font = font.val();
                        break;
                }
                designer.actions.doAction('setStyle', _this._currentSpread, s);
            };
            hAlign.change(setStyle);
            locked.change(setStyle);
            shrinkToFit.change(setStyle);
            verticalText.change(setStyle);
            textIndent.change(setStyle);
            vAlign.change(setStyle);
            wordWrap.change(setStyle);
            font.change(setStyle);

            var sheetSelectionChanged = function (evt, data) {  /* NOSONAR: UnusedFunctionArgument */
                var sel = designer.spreadActions.getSelectionType(_this._currentSpread);

                switch (sel) {
                    case 2 /* OnlyColumn */
                        :
                        _this._element.find(".resizable-row").removeClass("hidden");
                        _this._element.find(".visible-row").removeClass("hidden");
                        _this._element.find(".width-row").removeClass("hidden");
                        _this._element.find(".resizable-row").addClass("visible");
                        _this._element.find(".visible-row").addClass("visible");
                        _this._element.find(".width-row").addClass("visible");
                        _this._element.find(".height-row").removeClass("visible");
                        _this._element.find(".value-row").removeClass("visible");
                        _this._element.find(".height-row").addClass("hidden");
                        _this._element.find(".value-row").addClass("hidden");
                        _this._synToPropertyGrid("col");
                        break;
                    case 1 /* OnlyRow */
                        :
                        _this._element.find(".resizable-row").removeClass("hidden");
                        _this._element.find(".visible-row").removeClass("hidden");
                        _this._element.find(".width-row").removeClass("visible");
                        _this._element.find(".resizable-row").addClass("visible");
                        _this._element.find(".visible-row").addClass("visible");
                        _this._element.find(".width-row").addClass("hidden");
                        _this._element.find(".height-row").removeClass("hidden");
                        _this._element.find(".value-row").removeClass("visible");
                        _this._element.find(".height-row").addClass("visible");
                        _this._element.find(".value-row").addClass("hidden");
                        _this._synToPropertyGrid("row");
                        break;
                    case 3 /* OnlyCells */
                        :
                        _this._element.find(".resizable-row").removeClass("visible");
                        _this._element.find(".visible-row").removeClass("visible");
                        _this._element.find(".width-row").removeClass("visible");
                        _this._element.find(".resizable-row").addClass("hidden");
                        _this._element.find(".visible-row").addClass("hidden");
                        _this._element.find(".width-row").addClass("hidden");
                        _this._element.find(".height-row").removeClass("visible");
                        _this._element.find(".value-row").removeClass("hidden");
                        _this._element.find(".height-row").addClass("hidden");
                        _this._element.find(".value-row").addClass("visible");
                        _this._synToPropertyGrid("cell");
                        break;
                    default:
                        _this._element.find(".resizable-row").removeClass("visible");
                        _this._element.find(".visible-row").removeClass("visible");
                        _this._element.find(".width-row").removeClass("visible");
                        _this._element.find(".resizable-row").addClass("hidden");
                        _this._element.find(".visible-row").addClass("hidden");
                        _this._element.find(".width-row").addClass("hidden");
                        _this._element.find(".height-row").removeClass("visible");
                        _this._element.find(".value-row").removeClass("visible");
                        _this._element.find(".height-row").addClass("hidden");
                        _this._element.find(".value-row").addClass("hidden");
                        _this._synToPropertyGrid("sheet");
                        break;
                }
                height.removeClass("ui-state-error");
                width.removeClass("ui-state-error");
                textIndent.removeClass("ui-state-error");
                _this._hasError = false;
            };
            rowSpread.sheets[0].bind(Sheets.Events.SelectionChanged, sheetSelectionChanged);
            colSpread.sheets[0].bind(Sheets.Events.SelectionChanged, sheetSelectionChanged);
            var tabActive = function (event, ui) {
                if (ui.newPanel[0].id === "columnHeaderTab") {
                    _this._currentSpread = colSpread;
                    _this._sheetArea = 1 /* colHeader */;
                    _this._switchLayout("col");
                    //refresh style
                    sheetSelectionChanged();
                    setTimeout(function () {
                        colSpread.refresh();
                    }, 0);

                } else if (ui.newPanel[0].id === "rowHeaderTab") {
                    _this._currentSpread = rowSpread;
                    _this._sheetArea = 2 /* rowHeader */;
                    _this._switchLayout("row");
                    //refresh style
                    sheetSelectionChanged();
                    setTimeout(function () {
                        rowSpread.refresh();
                    }, 0);

                }
            };
            this._settingTab.on("tabsactivate", tabActive);

            this._element.find(".property-grid").click(function (evt) {
                $(_this._element.find(".property-grid").children()[0].children).removeClass("ui-state-focus");
                var srcElement = evt.target || evt.srcElement;
                $(srcElement).parents("tr").addClass("ui-state-focus");
            });
            if (this._fontDialog === undefined) {
                var fontDialog = new FontPickerDialog();
                this._element.find(".font-popup").click(function () {
                    fontDialog.open(font.val());
                });
                $(fontDialog).on('dialogClose', function (evt, value) {
                    font.val(value);
                    font.trigger('change');
                });
            }
            $(document).mousedown(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var pickers = $(".gcui-borderpicker-color-picker");
                var clickOnColorPicker = false;
                for (var i = 0; i < pickers.length; i++) {
                    if (pickers[i].contains(srcElement)) {
                        clickOnColorPicker = true;
                        break;
                    }
                }
                if (!clickOnColorPicker) {
                    if (!($(".borderBottom-borderpicker")[0].contains(srcElement))) {
                        _this._element.find('.borderBottom-borderframe').comboframe('close');
                    }
                    if (!($(".borderLeft-borderpicker")[0].contains(srcElement))) {
                        _this._element.find('.borderLeft-borderframe').comboframe('close');
                    }
                    if (!($(".borderRight-borderpicker")[0].contains(srcElement))) {
                        _this._element.find('.borderRight-borderframe').comboframe('close');
                    }
                    if (!($(".borderTop-borderpicker")[0].contains(srcElement))) {
                        _this._element.find('.borderTop-borderframe').comboframe('close');
                    }
                    if (!($(".diagonalUp-borderpicker")[0].contains(srcElement))) {
                        _this._element.find('.diagonalUp-borderframe').comboframe('close');
                    }
                    if (!($(".diagonalDown-borderpicker")[0].contains(srcElement))) {
                        _this._element.find('.diagonalDown-borderframe').comboframe('close');
                    }
                    $('.gcui-borderpicker-color').comboframe('close');
                }
            });
            designer.wrapper.spread.bind(Sheets.Events.ActiveSheetChanged, function () {
                var $rowHeaderTab = _this._element.find("#rowHeaderTab");
                var $columnHeaderTab = _this._element.find("#columnHeaderTab");

                rowSpread.destroy();
                $rowHeaderTab.empty();
                colSpread.destroy();
                $columnHeaderTab.empty();

                _this._rowSpread = rowSpread = new Sheets.Workbook($rowHeaderTab[0], { sheetCount: 1 });
                _this._colSpread = colSpread = new Sheets.Workbook($columnHeaderTab[0], { sheetCount: 1 });
                updateSpreadSetting(rowSpread);
                updateSpreadSetting(colSpread);

                rowSpread.sheets[0].bind(Sheets.Events.SelectionChanged, sheetSelectionChanged);
                colSpread.sheets[0].bind(Sheets.Events.SelectionChanged, sheetSelectionChanged);
            });
        };
        return HeaderCellsDialog;
    })(designer.BaseDialog);
    designer.HeaderCellsDialog = HeaderCellsDialog;

    var RuleFormatHelper = (function () {
        function RuleFormatHelper() {
        }

        RuleFormatHelper._getStyle = function (selectedIndex, _style) {
            var style = new Sheets.Style();
            switch (selectedIndex) {
                case 0:
                    //Light Red Fill with Dark Red Text
                    style.backColor = "#FFB6C1";
                    style.foreColor = "#8B0000";
                    break;
                case 1:
                    //Yellow Fill with Dark Yellow Text
                    style.backColor = "#F0E68C";
                    style.foreColor = "#BDB76B";
                    break;
                case 2:
                    //Green Fill with Dark Green Text
                    style.backColor = "#90EE90";
                    style.foreColor = "#006400";
                    break;
                case 3:
                    //Light Red Fill
                    style.backColor = "#FFB6C1";
                    break;
                case 4:
                    //Red Text
                    style.foreColor = "#8B0000";
                    break;
                case 5:
                    //Red Border
                    style.borderBottom = new Sheets.LineBorder("#8B0000", 1 /* thin */);
                    style.borderLeft = new Sheets.LineBorder("#8B0000", 1 /* thin */);
                    style.borderTop = new Sheets.LineBorder("#8B0000", 1 /* thin */);
                    style.borderRight = new Sheets.LineBorder("#8B0000", 1 /* thin */);
                    break;
                case 6:
                    //Custom Format
                    style = _style;
                    if (_style.font !== "" && _style.font !== undefined) {
                        var sheet = designer.wrapper.spread.getActiveSheet();
                        var col = sheet.getActiveColumnIndex();
                        var row = sheet.getActiveRowIndex();
                        var s = sheet.getActualStyle(row, col, 3 /* viewport */);

                        var fontElement = $("<span></span>");
                        if (s.font !== undefined) {
                            var fontStyle;
                            if (_style.font !== "") {
                                fontElement.css("font", _style.font);
                                fontStyle = fontElement.css("font-style");
                            }
                            fontElement.css("font", s.font);
                            if (fontStyle) {
                                fontElement.css("font-style", fontStyle);
                            }
                        } else if (_style.font !== "") {
                            fontElement.css("font", _style.font + designer.res.defaultFont);
                        }
                        style.font = fontElement.css("font");
                    }
                    break;
            }
            return style;
        };
        RuleFormatHelper._setLinearGradient = function (control, color1, color2, color3) {
            if (color3 === undefined) {
                control.css("background-image", "linear-gradient(to right, " + color1 + ", " + color2 + ")");
                control.css("background-image", "-o-linear-gradient(to right, " + color1 + ", " + color2 + ")");
                control.css("background-image", "-moz-linear-gradient(to right, " + color1 + ", " + color2 + ")");
                control.css("background-image", "-webkit-linear-gradient(to right, " + color1 + ", " + color2 + ")");
                control.css("background-image", "-ms-linear-gradient(to right, " + color1 + ", " + color2 + ")");
                control.css("background-image", "-webkit-gradient(linear, left top, right top, color-stop(0, " + color1 + "),  color-stop(1, " + color2 + "))");
            } else {
                control.css("background-image", "linear-gradient(to right, " + color1 + ", " + color2 + ", " + color3 + ")");
                control.css("background-image", "-o-linear-gradient(to right, " + color1 + ", " + color2 + ", " + color3 + ")");
                control.css("background-image", "-moz-linear-gradient(to right, " + color1 + ", " + color2 + ", " + color3 + ")");
                control.css("background-image", "-webkit-linear-gradient(to right, " + color1 + ", " + color2 + ", " + color3 + ")");
                control.css("background-image", "-ms-linear-gradient(to right, " + color1 + ", " + color2 + ", " + color3 + ")");
                control.css("background-image", "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color3 + "),  color-stop(50%, " + color2 + "))");
            }
        };
        RuleFormatHelper._drawPreviewControl = function (control, style) {
            if (style === undefined || style === null) {
                control.text(designer.res.conditionalFormatting.newFormattingRule.preview.noFormat);
                control.css("background-color", "");
                control.css("color", "black");
                control.css("font-style", "normal");
                control.css("text-decoration", "none");
            } else {
                control.text(designer.res.conditionalFormatting.newFormattingRule.preview.hasFormat);
                var bc = RuleFormatHelper._convertThemeColor(style.backColor);
                if (bc === undefined) {
                    bc = style.backColor;
                }
                if (bc === null) {
                    bc = "";
                }
                control.css("background-color", bc);
                var fc = RuleFormatHelper._convertThemeColor(style.foreColor);
                if (fc === undefined) {
                    fc = style.foreColor;
                }
                control.css("color", fc);
                if (style.font !== undefined && style.font !== "") {
                    var font = designer.util.parseFont(style.font);
                    control.css("font-style", font.fontStyle);
                }
                if (style.textDecoration) {
                    var decoration = designer.util.toCSSTextDecoration(style.textDecoration);
                    control.css("text-decoration", decoration);
                }
            }
        };
        RuleFormatHelper._convertThemeColor = function (colorName) {
            var themeColor = designer.wrapper.spread.getActiveSheet().currentTheme().colors();

            return themeColor.getColor(colorName);
        };
        RuleFormatHelper._getformulaRuleType = function (loadRule) {
            var type;
            var index;
            var style;
            var formulaRule = loadRule;
            var sheet = designer.wrapper.spread.getActiveSheet();
            style = formulaRule.style();
            var expression = GC.Spread.Sheets.CalcEngine.formulaToExpression(sheet, formulaRule.formula());
            if (expression.type === GC.Spread.CalcEngine.ExpressionType.function) {
                var functinExp = expression;
                var name = functinExp.functionName;
                if (name === "ISBLANK") {
                    type = 1 /* formatContain */;
                    index = 3;
                } else if (name === "ISERROR") {
                    type = 1 /* formatContain */;
                    index = 5;
                } else if (name === "NOT" && functinExp.args.length === 1) {
                    var subExp = functinExp.args[0];
                    var subName = subExp.getFunctionName();
                    if (subName === "ISBLANK") {
                        type = 1 /* formatContain */;
                        index = 4;
                    } else if (subName === "ISERROR") {
                        type = 1 /* formatContain */;
                        index = 6;
                    }
                }
            }
            if (type === undefined) {
                type = 5 /* useFormula */;
            }
            return { ruleType: type, selectorIndex: index, style: style, formula: formulaRule.formula() };
        };
        RuleFormatHelper.parseValue = function (value) {
            if (!isNaN(value) && isFinite(value)) {
                return parseFloat(value);
            } else {
                return value;
            }
        };

        RuleFormatHelper._drawIconSetPreview = function (element, iconSetType, additionalIconStyle, isReverseIconOrder) {
            switch (iconSetType) {
                case 15 /* FiveArrowsColored */
                    :
                    RuleFormatHelper._buildIconSet(element, ["up-arrow-green", "right-up-arrow-yellow", "right-arrow-yellow", "right-down-arrow-yellow", "down-arrow-red"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 16 /* FiveArrowsGray */
                    :
                    RuleFormatHelper._buildIconSet(element, ["up-arrow-gray", "right-up-arrow-gray", "right-arrow-gray", "right-down-arrow-gray", "down-arrow-gray"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 19 /* FiveBoxes */
                    :
                    RuleFormatHelper._buildIconSet(element, ["box-4", "box-3", "box-2", "box-1", "box-0"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 18 /* FiveQuarters */
                    :
                    RuleFormatHelper._buildIconSet(element, ["quarters-4", "quarters-3", "quarters-2", "quarters-1", "quarters-0"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 17 /* FiveRatings */
                    :
                    RuleFormatHelper._buildIconSet(element, ["rating-4", "rating-3", "rating-2", "rating-1", "rating-0"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 10 /* FourArrowsColored */
                    :
                    RuleFormatHelper._buildIconSet(element, ["up-arrow-green", "right-up-arrow-yellow", "right-down-arrow-yellow", "down-arrow-red"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 11 /* FourArrowsGray */
                    :
                    RuleFormatHelper._buildIconSet(element, ["up-arrow-gray", "right-up-arrow-gray", "right-down-arrow-gray", "down-arrow-gray"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 13 /* FourRatings */
                    :
                    RuleFormatHelper._buildIconSet(element, ["rating-3", "rating-2", "rating-1", "rating-0"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 12 /* FourRedToBlack */
                    :
                    RuleFormatHelper._buildIconSet(element, ["ball-red", "ball-pink", "ball-gray", "ball-black"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 14 /* FourTrafficLights */
                    :
                    RuleFormatHelper._buildIconSet(element, ["traffic-light-green", "traffic-light-yellow", "traffic-light-red", "traffic-light-black"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 0 /* ThreeArrowsColored */
                    :
                    RuleFormatHelper._buildIconSet(element, ["up-arrow-green", "right-arrow-yellow", "down-arrow-red"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 1 /* ThreeArrowsGray */
                    :
                    RuleFormatHelper._buildIconSet(element, ["up-arrow-gray", "right-arrow-gray", "down-arrow-gray"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 4 /* ThreeFlags */
                    :
                    RuleFormatHelper._buildIconSet(element, ["flag-green", "flag-yellow", "flag-red"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 7 /* ThreeSigns */
                    :
                    RuleFormatHelper._buildIconSet(element, ["traffic-light-green", "up-triangle-yellow", "down-rhombus-red"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 3 /* ThreeStars */
                    :
                    RuleFormatHelper._buildIconSet(element, ["star-solid", "star-half", "star-hollow"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 8 /* ThreeSymbolsCircled */
                    :
                    RuleFormatHelper._buildIconSet(element, ["check-circled-green", "notice-circled-yellow", "close-circled-red"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 9 /* ThreeSymbolsUncircled */
                    :
                    RuleFormatHelper._buildIconSet(element, ["check-uncircled-green", "notice-uncircled-yellow", "close-uncircled-red"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 6 /* ThreeTrafficLightsRimmed */
                    :
                    RuleFormatHelper._buildIconSet(element, ["traffic-light-rimmed-green", "traffic-light-rimmed-yellow", "traffic-light-rimmed-red"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 5 /* ThreeTrafficLightsUnrimmed */
                    :
                    RuleFormatHelper._buildIconSet(element, ["traffic-light-green", "traffic-light-yellow", "traffic-light-red"], additionalIconStyle, isReverseIconOrder);
                    break;
                case 2 /* ThreeTriangles */
                    :
                    RuleFormatHelper._buildIconSet(element, ["up-triangle-green", "minus-yellow", "down-triangle-red"], additionalIconStyle, isReverseIconOrder);
                    break;
                default:
            }
        };

        RuleFormatHelper._drawCustomIconSetPreview = function (element, icons, additionalIconStyle) {
            var classNames = [];
            for (var i = icons.length - 1; i >= 0; i--) {
                classNames.push(RuleFormatHelper._getIconClass(icons[i]));
            }
            RuleFormatHelper._buildIconSet(element, classNames, additionalIconStyle);
        };
        RuleFormatHelper._buildIconSet = function (element, iconClassNames, additionalIconStyle, isReverseIconOrder) {
            if (isReverseIconOrder) {
                iconClassNames.reverse();
            }
            for (var i = 0; i < iconClassNames.length; i++) {
                var span = $("<span>").addClass("iconSetsIcons").addClass(iconClassNames[i].toString());
                if (additionalIconStyle) {
                    span.css(additionalIconStyle);
                }
                element.append(span);
            }
        };
        RuleFormatHelper._getIconClass = function (iconInfo) {
            var iconsToClassNameMap = [
                ["down-arrow-red", "right-arrow-yellow", "up-arrow-green"],
                ["down-arrow-gray", "right-arrow-gray", "up-arrow-gray"],
                ["down-triangle-red", "minus-yellow", "up-triangle-green"],
                ["star-hollow", "star-half", "star-solid"],
                ["flag-red", "flag-yellow", "flag-green"],
                ["traffic-light-red", "traffic-light-yellow", "traffic-light-green"],
                ["traffic-light-rimmed-red", "traffic-light-rimmed-yellow", "traffic-light-rimmed-green"],
                ["down-rhombus-red", "up-triangle-yellow", "traffic-light-green"],
                ["close-circled-red", "notice-circled-yellow", "check-circled-green"],
                ["close-uncircled-red", "notice-uncircled-yellow", "check-uncircled-green"],
                ["down-arrow-red", "right-down-arrow-yellow", "right-up-arrow-yellow", "up-arrow-green"],
                ["down-arrow-gray", "right-down-arrow-gray", "right-up-arrow-gray", "up-arrow-gray"],
                ["ball-black", "ball-gray", "ball-pink", "ball-red"],
                ["rating-0", "rating-1", "rating-2", "rating-3"],
                ["traffic-light-black", "traffic-light-red", "traffic-light-yellow", "traffic-light-green"],
                ["down-arrow-red", "right-down-arrow-yellow", "right-arrow-yellow", "right-up-arrow-yellow", "up-arrow-green"],
                ["down-arrow-gray", "right-down-arrow-gray", "right-arrow-gray", "right-up-arrow-gray", "up-arrow-gray"],
                ["rating-0", "rating-1", "rating-2", "rating-3", "rating-4"],
                ["quarters-0", "quarters-1", "quarters-2", "quarters-3", "quarters-4"],
                ["box-0", "box-1", "box-2", "box-3", "box-4"],
                ["no-cell-icon"]];
            return iconsToClassNameMap[iconInfo.iconSetType][iconInfo.iconIndex];
        };
        return RuleFormatHelper;
    })();
    designer.RuleFormatHelper = RuleFormatHelper;

    (function (OpenType) {
        //CellValueRuleFormatDialog
        OpenType[OpenType["greaterThan"] = 0] = "greaterThan"; /* NOSONAR: AssignmentWithinCondition */
        OpenType[OpenType["lessThan"] = 1] = "lessThan"; /* NOSONAR: AssignmentWithinCondition */
        OpenType[OpenType["between"] = 2] = "between"; /* NOSONAR: AssignmentWithinCondition */
        OpenType[OpenType["equalTo"] = 3] = "equalTo"; /* NOSONAR: AssignmentWithinCondition */

        //Top10RuleFormatDialog 
        OpenType[OpenType["top"] = 4] = "top"; /* NOSONAR: AssignmentWithinCondition */
        OpenType[OpenType["bottom"] = 5] = "bottom"; /* NOSONAR: AssignmentWithinCondition */

        //AverageRuleFormatDialog
        OpenType[OpenType["above"] = 6] = "above"; /* NOSONAR: AssignmentWithinCondition */
        OpenType[OpenType["below"] = 7] = "below"; /* NOSONAR: AssignmentWithinCondition */
        designer.OpenType = OpenType;
    })(designer.OpenType || ({}));

    var CellValueRuleFormatDialog = (function (_super) {
        designer.extends(CellValueRuleFormatDialog, _super);
        function CellValueRuleFormatDialog() {
            _super.call(this, (dialogHtmlPath), '.cellValueRuleFormat-dialog');
        }

        CellValueRuleFormatDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                resizable: false,
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var sucess = self._validateValue();
                            if (sucess) {
                                self._addRule();
                                self.close();
                                designer.wrapper.setFocusToSpread();
                            }
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        CellValueRuleFormatDialog.prototype._init = function () {
            var _this = this;
            if (this.formatCellDialog === undefined) {
                this.formatCellDialog = new designer.FormatDialog();
            }
            this._element.find(".withStyle").change(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;

                if (ele.value === designer.res.conditionalFormatting.withStyle.customFormat) {
                    _this.formatCellDialog.selectTabOptions = {
                        numbers: true,
                        font: true,
                        border: true,
                        fill: true
                    };
                    _this.formatCellDialog.setFormatDirectly(false);
                    _this.formatCellDialog.open('font', {
                        family: 'disabled',
                        size: 'disabled',
                        weight: 'disabled'
                    }, _this._style, true);
                }
            });
            $(this.formatCellDialog).on('okClicked', function (evt, args) {
                _this._style = args;
            });
            _this._addRangeSelectEvent();
        };
        CellValueRuleFormatDialog.prototype._addRangeSelectEvent = function () {
            var _this = this;
            _this._element.find('.rangeSelectButton').click(function () {
                if (!_this._rangeSelectDialog) {
                    _this._rangeSelectDialog = new designer.RangeSelectDialog(_this, {
                        absoluteReference: true,
                        needSheetName: false
                    });
                }
                if ($(this).attr('disabled') === 'disabled') {
                    return;
                }
                var title = _this._element.dialog('option', 'title'), callback = _this._setValueFromRangeSelect,
                    existFormula;
                _this.hide();
                switch ($(this).data('name')) {
                    case "textBox-cell1":
                        existFormula = _this._element.find('.textBox-cell1').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.textBox-cell1']);
                        break;
                    case "textBox-cell2":
                        existFormula = _this._element.find('.textBox-cell2').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.textBox-cell2']);
                        break;
                    default:
                        _this.show();
                }
            });
        };
        CellValueRuleFormatDialog.prototype._setValueFromRangeSelect = function (selector, value) {
            this._element.find(selector).val(value);
            this._element.find(selector).change();
        };
        CellValueRuleFormatDialog.prototype._beforeOpen = function (args) {
            var type = args[0];
            this._style = keyword_undefined;
            this._openType = type;
            var title;
            var des;
            switch (type) {
                case 2 /* between */
                    :
                    title = designer.res.conditionalFormatting.between.title;
                    des = designer.res.conditionalFormatting.between.description;
                    this._switchDisplay(true);
                    break;
                case 3 /* equalTo */
                    :
                    title = designer.res.conditionalFormatting.equalTo.title;
                    des = designer.res.conditionalFormatting.equalTo.description;
                    this._switchDisplay(false);
                    break;
                case 0 /* greaterThan */
                    :
                    title = designer.res.conditionalFormatting.greaterThan.title;
                    des = designer.res.conditionalFormatting.greaterThan.description;
                    this._switchDisplay(false);
                    break;
                case 1 /* lessThan */
                    :
                    title = designer.res.conditionalFormatting.lessThan.title;
                    des = designer.res.conditionalFormatting.lessThan.description;
                    this._switchDisplay(false);
                    break;
            }
            this._element.dialog('option', 'title', title);
            this._element.find(".description").text(des);
            this._initCellValuesInput();
            $(this._element.find(".withStyle").children()[0]).prop("selected", true);
        };
        CellValueRuleFormatDialog.prototype._switchDisplay = function (isVisible) {
            var control1 = this._element.find(".label-and");
            var control2 = this._element.find(".textBox-cell2-container");
            if (isVisible) {
                control1.removeClass("hidden");
                control2.show();
            } else {
                control1.addClass("hidden");
                control2.hide();
            }
        };
        CellValueRuleFormatDialog.prototype._getStyle = function () {
            var selectedIndex = parseInt(this._element.find(".withStyle").prop("selectedIndex"));
            return RuleFormatHelper._getStyle(selectedIndex, this._style);
        };
        CellValueRuleFormatDialog.prototype._addRule = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();

            var value1 = this._getOneValueOrReference(this._element, 1);
            var value2 = this._getOneValueOrReference(this._element, 2);
            var style = this._getStyle();
            var rule;
            var operator;

            switch (this._openType) {
                case 2 /* between */
                    :
                    operator = 6;
                    break;
                case 3 /* equalTo */
                    :
                    operator = 0;
                    break;
                case 0 /* greaterThan */
                    :
                    operator = 2;
                    break;
                case 1 /* lessThan */
                    :
                    operator = 4;
                    break;
            }
            rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(1 /* CellValueRule */, ranges, style, operator, value1, value2);
            designer.actions.doAction("addRule", designer.wrapper.spread, rule);
        };
        CellValueRuleFormatDialog.prototype._initCellValuesInput = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var control1 = this._element.find(".textBox-cell1");
            var control2 = this._element.find(".textBox-cell2");

            var expr = designer.util.createStatisticalExpression("AVERAGE", ranges);

            var average = GC.Spread.Sheets.CalcEngine.evaluateExpression(sheet, expr, 0, 0);

            if (average instanceof GC.Spread.CalcEngine.CalcError) {
                average = 0;
            }

            if (this._openType === 2 /* between */) {
                var expr1 = designer.util.createStatisticalExpression("MIN", ranges);

                var min = GC.Spread.Sheets.CalcEngine.evaluateExpression(sheet, expr1, 0, 0);
                var value1 = average - min;
                var value2 = average + min;

                control1.val(value1);
                control2.val(value2);
            } else {
                control1.val(average);
            }
        };
        CellValueRuleFormatDialog.prototype._validateValue = function () {
            var value1 = this._element.find(".textBox-cell1").val();
            var value2 = this._element.find(".textBox-cell2").val();
            var result = true;
            switch (this._openType) {
                case 2 /* between */
                    :
                    if (value1 === "" || value2 === "") {
                        MessageBox.show(designer.res.conditionalFormatting.exceptions.e1, designer.res.title, 2 /* warning */);
                        result = false;
                    }
                    break;
                case 3 /* equalTo */
                    :
                case 0 /* greaterThan */
                    :
                case 1 /* lessThan */
                    :
                    if (value1 === "") {
                        MessageBox.show(designer.res.conditionalFormatting.exceptions.e1, designer.res.title, 2 /* warning */);
                        result = false;
                    }
                    break;
            }
            return result;
        };
        return CellValueRuleFormatDialog;
    })(designer.BaseDialog);
    designer.CellValueRuleFormatDialog = CellValueRuleFormatDialog;

    var TextRuleFormatDialog = (function (_super) {
        designer.extends(TextRuleFormatDialog, _super);
        function TextRuleFormatDialog() {
            _super.call(this, (dialogHtmlPath), '.textRuleFormat-dialog');
        }

        TextRuleFormatDialog.prototype._initOptions = function () {
            var self = this;
            return {
                title: designer.res.conditionalFormatting.textThatCotains.title,
                width: 'auto',
                resizable: false,
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var sucess = self._validateValue();
                            if (sucess) {
                                self._addRule();
                                self.close();
                                designer.wrapper.setFocusToSpread();
                            }
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        TextRuleFormatDialog.prototype._init = function () {
            var _this = this;
            if (this.formatCellDialog === undefined) {
                this.formatCellDialog = new designer.FormatDialog();
            }
            this._element.find(".withStyle").change(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;

                if (ele.value === designer.res.conditionalFormatting.withStyle.customFormat) {
                    _this.formatCellDialog.selectTabOptions = {
                        numbers: true,
                        font: true,
                        border: true,
                        fill: true
                    };
                    _this.formatCellDialog.setFormatDirectly(false);
                    _this.formatCellDialog.open('font', {
                        family: 'disabled',
                        size: 'disabled',
                        weight: 'disabled'
                    }, _this._style, true);
                }
            });
            $(this.formatCellDialog).on('okClicked', function (evt, args) {
                _this._style = args;
            });
            _this._addRangeSelectEvent();
        };
        TextRuleFormatDialog.prototype._addRangeSelectEvent = function () {
            var _this = this;
            _this._element.find('.rangeSelectButton').click(function () {
                if (!_this._rangeSelectDialog) {
                    _this._rangeSelectDialog = new designer.RangeSelectDialog(_this, {
                        absoluteReference: true,
                        needSheetName: false
                    });
                }
                if ($(this).attr('disabled') === 'disabled') {
                    return;
                }
                var title = _this._element.dialog('option', 'title'), callback = _this._setValueFromRangeSelect,
                    existFormula;
                _this.hide();
                existFormula = _this._element.find('.textBox-cell1').val();
                _this._rangeSelectDialog.open(title, callback, existFormula, ['.textBox-cell1']);
            });
        };
        TextRuleFormatDialog.prototype._setValueFromRangeSelect = function (selector, value) {
            this._element.find(selector).val(value);
            this._element.find(selector).change();
        };
        TextRuleFormatDialog.prototype._beforeOpen = function () {
            this._style = keyword_undefined;
            this._initCellValuesInput();
            $(this._element.find(".withStyle").children()[0]).prop("selected", true);
        };
        TextRuleFormatDialog.prototype._getStyle = function () {
            var selectedIndex = parseInt(this._element.find(".withStyle").prop("selectedIndex"));
            return RuleFormatHelper._getStyle(selectedIndex, this._style);
        };
        TextRuleFormatDialog.prototype._addRule = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var value1 = this._getOneValueOrReference(this._element, 1);
            var style = this._getStyle();

            var rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(2 /* SpecificTextRule */, ranges, style, 0, null, null, value1);
            designer.actions.doAction("addRule", designer.wrapper.spread, rule);
        };
        TextRuleFormatDialog.prototype._initCellValuesInput = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var col = sheet.getActiveColumnIndex();
            var row = sheet.getActiveRowIndex();
            var cell = sheet.getCell(row, col);

            var control1 = this._element.find(".textBox-cell1");
            control1.val(cell.text());
        };
        TextRuleFormatDialog.prototype._validateValue = function () {
            var value1 = this._element.find(".textBox-cell1").val();
            var result = true;
            if (value1 === "") {
                MessageBox.show(designer.res.conditionalFormatting.exceptions.e2, designer.res.title, 2 /* warning */);
                result = false;
            }
            return result;
        };
        return TextRuleFormatDialog;
    })(designer.BaseDialog);
    designer.TextRuleFormatDialog = TextRuleFormatDialog;

    var DateOccurringFormatDialog = (function (_super) {
        designer.extends(DateOccurringFormatDialog, _super);
        function DateOccurringFormatDialog() {
            _super.call(this, (dialogHtmlPath), '.dateOccurringFormat-dialog');
        }

        DateOccurringFormatDialog.prototype._initOptions = function () {
            var self = this;
            return {
                title: designer.res.conditionalFormatting.dateOccurringFormat.title,
                width: 'auto',
                resizable: false,
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._addRule();
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        DateOccurringFormatDialog.prototype._init = function () {
            var _this = this;
            if (this.formatCellDialog === undefined) {
                this.formatCellDialog = new designer.FormatDialog();
            }
            this._element.find(".withStyle").change(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;

                if (ele.value === designer.res.conditionalFormatting.withStyle.customFormat) {
                    _this.formatCellDialog.selectTabOptions = {
                        numbers: true,
                        font: true,
                        border: true,
                        fill: true
                    };
                    _this.formatCellDialog.setFormatDirectly(false);
                    _this.formatCellDialog.open('font', {
                        family: 'disabled',
                        size: 'disabled',
                        weight: 'disabled'
                    }, _this._style, true);
                }
            });
            $(this.formatCellDialog).on('okClicked', function (evt, args) {
                _this._style = args;
            });
        };
        DateOccurringFormatDialog.prototype._beforeOpen = function () {
            this._style = keyword_undefined;
            $(this._element.find(".date").children()[0]).prop("selected", true);
            $(this._element.find(".withStyle").children()[0]).prop("selected", true);
        };
        DateOccurringFormatDialog.prototype._getStyle = function () {
            var selectedIndex = parseInt(this._element.find(".withStyle").prop("selectedIndex"));
            return RuleFormatHelper._getStyle(selectedIndex, this._style);
        };
        DateOccurringFormatDialog.prototype._addRule = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var style = this._getStyle();
            var selectedIndex = parseInt(this._element.find(".date").prop("selectedIndex"));
            var dateOccurringType;
            switch (selectedIndex) {
                case 0:
                    dateOccurringType = 1 /* Yesterday */;
                    break;
                case 1:
                    dateOccurringType = 0 /* Today */;
                    break;
                case 2:
                    dateOccurringType = 2 /* Tomorrow */;
                    break;
                case 3:
                    dateOccurringType = 3 /* Last7Days */;
                    break;
                case 4:
                    dateOccurringType = 8 /* LastWeek */;
                    break;
                case 5:
                    dateOccurringType = 7 /* ThisWeek */;
                    break;
                case 6:
                    dateOccurringType = 9 /* NextWeek */;
                    break;
                case 7:
                    dateOccurringType = 5 /* LastMonth */;
                    break;
                case 8:
                    dateOccurringType = 4 /* ThisMonth */;
                    break;
                case 9:
                    dateOccurringType = 6 /* NextMonth */;
                    break;
            }

            var rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(4 /* DateOccurringRule */, ranges, style, null, null, null, null, null, dateOccurringType);
            designer.actions.doAction("addRule", designer.wrapper.spread, rule);
        };
        return DateOccurringFormatDialog;
    })(designer.BaseDialog);
    designer.DateOccurringFormatDialog = DateOccurringFormatDialog;

    var DuplicateValuesFormatDialog = (function (_super) {
        designer.extends(DuplicateValuesFormatDialog, _super);
        function DuplicateValuesFormatDialog() {
            _super.call(this, (dialogHtmlPath), '.duplicateValuesFormat-dialog');
        }

        DuplicateValuesFormatDialog.prototype._initOptions = function () {
            var self = this;
            return {
                title: designer.res.conditionalFormatting.duplicateValuesFormat.title,
                width: 'auto',
                resizable: false,
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._addRule();
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        DuplicateValuesFormatDialog.prototype._init = function () {
            var _this = this;
            if (this.formatCellDialog === undefined) {
                this.formatCellDialog = new designer.FormatDialog();
            }
            this._element.find(".withStyle").change(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;

                if (ele.value === designer.res.conditionalFormatting.withStyle.customFormat) {
                    _this.formatCellDialog.selectTabOptions = {
                        numbers: true,
                        font: true,
                        border: true,
                        fill: true
                    };
                    _this.formatCellDialog.setFormatDirectly(false);
                    _this.formatCellDialog.open('font', {
                        family: 'disabled',
                        size: 'disabled',
                        weight: 'disabled'
                    }, _this._style, true);
                }
            });
            $(this.formatCellDialog).on('okClicked', function (evt, args) {
                _this._style = args;
            });
        };
        DuplicateValuesFormatDialog.prototype._beforeOpen = function () {
            this._style = keyword_undefined;
            $(this._element.find(".type").children()[0]).prop("selected", true);
            $(this._element.find(".withStyle").children()[0]).prop("selected", true);
        };
        DuplicateValuesFormatDialog.prototype._getStyle = function () {
            var selectedIndex = parseInt(this._element.find(".withStyle").prop("selectedIndex"));
            return RuleFormatHelper._getStyle(selectedIndex, this._style);
        };
        DuplicateValuesFormatDialog.prototype._addRule = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var style = this._getStyle();
            var selectedIndex = parseInt(this._element.find(".type").prop("selectedIndex"));
            var rule;
            switch (selectedIndex) {
                case 0:
                    rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(7 /* duplicateRule */, ranges, style);
                    break;
                case 1:
                    rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(6 /* uniqueRule */, ranges, style);
                    break;
            }
            designer.actions.doAction("addRule", designer.wrapper.spread, rule);
        };
        return DuplicateValuesFormatDialog;
    })(designer.BaseDialog);
    designer.DuplicateValuesFormatDialog = DuplicateValuesFormatDialog;

    var Top10RuleFormatDialog = (function (_super) {
        designer.extends(Top10RuleFormatDialog, _super);
        function Top10RuleFormatDialog() {
            _super.call(this, (dialogHtmlPath), '.top10RuleFormat-dialog');
        }

        Top10RuleFormatDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                resizable: false,
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var sucess = self._validateValue();
                            if (sucess) {
                                self._addRule();
                                self.close();
                                designer.wrapper.setFocusToSpread();
                            }
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        Top10RuleFormatDialog.prototype._init = function () {
            var _this = this;
            if (this.formatCellDialog === undefined) {
                this.formatCellDialog = new designer.FormatDialog();
            }
            this._element.find(".withStyle").change(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;

                if (ele.value === designer.res.conditionalFormatting.withStyle.customFormat) {
                    _this.formatCellDialog.selectTabOptions = {
                        numbers: true,
                        font: true,
                        border: true,
                        fill: true
                    };
                    _this.formatCellDialog.setFormatDirectly(false);
                    _this.formatCellDialog.open('font', {
                        family: 'disabled',
                        size: 'disabled',
                        weight: 'disabled'
                    }, _this._style, true);
                }
            });
            $(this.formatCellDialog).on('okClicked', function (evt, args) {
                _this._style = args;
            });
        };
        Top10RuleFormatDialog.prototype._beforeOpen = function (args) {
            var type = args[0];
            this._style = keyword_undefined;
            this._openType = type;
            var title;
            var des;
            switch (type) {
                case 4 /* top */
                    :
                    title = designer.res.conditionalFormatting.top10items.title;
                    des = designer.res.conditionalFormatting.top10items.description;
                    break;
                case 5 /* bottom */
                    :
                    title = designer.res.conditionalFormatting.bottom10items.title;
                    des = designer.res.conditionalFormatting.bottom10items.description;
                    break;
            }
            this._element.dialog('option', 'title', title);
            this._element.find(".description").text(des);

            var itemCounts = this._element.find(".itemCounts");
            itemCounts.spinner({
                min: 1,
                max: 1000
            });
            itemCounts.val(10);
            $(this._element.find(".withStyle").children()[0]).prop("selected", true);
        };
        Top10RuleFormatDialog.prototype._getStyle = function () {
            var selectedIndex = parseInt(this._element.find(".withStyle").prop("selectedIndex"));
            return RuleFormatHelper._getStyle(selectedIndex, this._style);
        };
        Top10RuleFormatDialog.prototype._addRule = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var style = this._getStyle();
            var value = this._element.find(".itemCounts").val();
            var type;
            switch (this._openType) {
                case 4 /* top */
                    :
                    type = 0;
                    break;
                case 5 /* bottom */
                    :
                    type = 1;
                    break;
            }
            var rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(5/* Top10Rule */, ranges, style, null, null, null, null, null, type, value);
            designer.actions.doAction("addRule", designer.wrapper.spread, rule);
        };
        Top10RuleFormatDialog.prototype._validateValue = function () {
            var value1 = parseInt(this._element.find(".itemCounts").val());
            var result = true;
            if (isNaN(value1) || value1 > 1000 || value1 < 1) {
                MessageBox.show(designer.res.conditionalFormatting.exceptions.e3, designer.res.title, 2 /* warning */);
                result = false;
            }
            return result;
        };
        return Top10RuleFormatDialog;
    })(designer.BaseDialog);
    designer.Top10RuleFormatDialog = Top10RuleFormatDialog;

    var AverageRuleFormatDialog = (function (_super) {
        designer.extends(AverageRuleFormatDialog, _super);
        function AverageRuleFormatDialog() {
            _super.call(this, (dialogHtmlPath), '.averageRuleFormat-dialog');
        }

        AverageRuleFormatDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                resizable: false,
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._addRule();
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        AverageRuleFormatDialog.prototype._init = function () {
            var _this = this;
            if (this.formatCellDialog === undefined) {
                this.formatCellDialog = new designer.FormatDialog();
            }
            this._element.find(".withStyle").change(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var ele = srcElement;

                if (ele.value === designer.res.conditionalFormatting.withStyle.customFormat) {
                    _this.formatCellDialog.selectTabOptions = {
                        numbers: true,
                        font: true,
                        border: true,
                        fill: true
                    };
                    _this.formatCellDialog.setFormatDirectly(false);
                    _this.formatCellDialog.open('font', {
                        family: 'disabled',
                        size: 'disabled',
                        weight: 'disabled'
                    }, _this._style, true);
                }
            });
            $(this.formatCellDialog).on('okClicked', function (evt, args) {
                _this._style = args;
            });
        };
        AverageRuleFormatDialog.prototype._beforeOpen = function (args) {
            var type = args[0];
            this._style = keyword_undefined;
            this._openType = type;
            var title;
            var des;
            switch (type) {
                case 6 /* above */
                    :
                    title = designer.res.conditionalFormatting.aboveAverage.title;
                    des = designer.res.conditionalFormatting.aboveAverage.description;
                    break;
                case 7 /* below */
                    :
                    title = designer.res.conditionalFormatting.belowAverage.title;
                    des = designer.res.conditionalFormatting.belowAverage.description;
                    break;
            }
            this._element.dialog('option', 'title', title);
            this._element.find(".description").text(des);

            $(this._element.find(".withStyle").children()[0]).prop("selected", true);
        };
        AverageRuleFormatDialog.prototype._getStyle = function () {
            var selectedIndex = parseInt(this._element.find(".withStyle").prop("selectedIndex"));
            return RuleFormatHelper._getStyle(selectedIndex, this._style);
        };
        AverageRuleFormatDialog.prototype._addRule = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var style = this._getStyle();
            var type;
            switch (this._openType) {
                case 6 /* above */
                    :
                    type = 0;
                    break;
                case 7 /* below */
                    :
                    type = 1;
                    break;
            }
            var rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(8 /* AverageRule */, ranges, style, null, null, null, null, null, type);
            designer.actions.doAction("addRule", designer.wrapper.spread, rule);
        };
        return AverageRuleFormatDialog;
    })(designer.BaseDialog);
    designer.AverageRuleFormatDialog = AverageRuleFormatDialog;

    (function (RuleType) {
        RuleType[RuleType["formatOnValue"] = 0] = "formatOnValue"; /* NOSONAR: AssignmentWithinCondition */
        RuleType[RuleType["formatContain"] = 1] = "formatContain"; /* NOSONAR: AssignmentWithinCondition */
        RuleType[RuleType["formatRankedValue"] = 2] = "formatRankedValue"; /* NOSONAR: AssignmentWithinCondition */
        RuleType[RuleType["formatAbove"] = 3] = "formatAbove"; /* NOSONAR: AssignmentWithinCondition */
        RuleType[RuleType["formatUnique"] = 4] = "formatUnique"; /* NOSONAR: AssignmentWithinCondition */
        RuleType[RuleType["useFormula"] = 5] = "useFormula"; /* NOSONAR: AssignmentWithinCondition */
        designer.RuleType = RuleType;
    })(designer.RuleType || ({}));
    (function (FormatStyle) {
        FormatStyle[FormatStyle["color2"] = 0] = "color2"; /* NOSONAR: AssignmentWithinCondition */
        FormatStyle[FormatStyle["color3"] = 1] = "color3"; /* NOSONAR: AssignmentWithinCondition */
        FormatStyle[FormatStyle["dataBar"] = 2] = "dataBar"; /* NOSONAR: AssignmentWithinCondition */
        FormatStyle[FormatStyle["iconSets"] = 3] = "iconSets"; /* NOSONAR: AssignmentWithinCondition */
        designer.FormatStyle = FormatStyle;
    })(designer.FormatStyle || ({}));

    var NegativeValueandAxisDialog = (function (_super) {
        designer.extends(NegativeValueandAxisDialog, _super);
        function NegativeValueandAxisDialog() {
            _super.call(this, (dialogHtmlPath), '.negativeValueAndAxisSettings-dialog');
        }

        NegativeValueandAxisDialog.prototype._initOptions = function () {
            var self = this;
            return {
                title: designer.res.conditionalFormatting.newFormattingRule.formatOnValue.dataBar.negativeDialog.title,
                width: 'auto',
                resizable: false,
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.close();
                            self._raiseClose(event, self._returnData());
                            self.destroy();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            self._raiseClose(event, null);
                            self.destroy();
                        }
                    }
                ],
                beforeClose: function (event, ui) {   /* NOSONAR: UnusedFunctionArgument */
                    if (event.currentTarget) {
                        self._raiseClose(event, null);
                        self.destroy();
                    }
                }
            };
        };

        NegativeValueandAxisDialog.prototype.destroy = function () {
            var fillColorPicker = $(".fillcolor-picker");
            var borderColorPicker = $(".bordercolor-picker");
            var axisColorPicker = $(".axiscolor-picker");
            if (fillColorPicker.length > 0 && fillColorPicker.children().length > 0) {
                fillColorPicker.colorpicker('destroy');
            }
            if (borderColorPicker.length > 0 && borderColorPicker.children().length > 0) {
                borderColorPicker.colorpicker('destroy');
            }
            if (axisColorPicker.length > 0 && axisColorPicker.children().length > 0) {
                axisColorPicker.colorpicker('destroy');
            }
            fillColorPicker.remove();
            borderColorPicker.remove();
            axisColorPicker.remove();
            _super.prototype.destroy.call(this);
        };
        NegativeValueandAxisDialog.prototype._raiseClose = function (evt, value) {
            $(this).trigger('dialogClose', value);
        };
        NegativeValueandAxisDialog.prototype._init = function () {
            var _this = this;
            var self = this;
            $(".fillcolor-picker").colorpicker({
                valueChanged: function (e, value) {
                    var color;
                    if (value.color === undefined) {
                        color = "red";
                    } else {
                        color = value.color;
                    }
                    self._element.find('.fillcolor-span').css('background-color', color);
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.fillcolor-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.fillcolor-frame').comboframe('close');
                }
            });
            this._element.find(".fillcolor-frame").comboframe();
            $(".fillcolor-picker").colorpicker('option', 'value', "red");
            this._element.find('.fillcolor-span').css('background-color', "red");

            $(".bordercolor-picker").colorpicker({
                valueChanged: function (e, value) {
                    var color;
                    if (value.color === undefined) {
                        color = "black";
                    } else {
                        color = value.color;
                    }
                    self._element.find('.bordercolor-span').css('background-color', color);
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.bordercolor-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.bordercolor-frame').comboframe('close');
                }
            });
            this._element.find(".bordercolor-frame").comboframe();
            $(".bordercolor-picker").colorpicker('option', 'value', "black");
            this._element.find('.bordercolor-span').css('background-color', "black");

            $(".axiscolor-picker").colorpicker({
                valueChanged: function (e, value) {
                    var color;
                    if (value.color === undefined) {
                        color = "black";
                    } else {
                        color = value.color;
                    }
                    self._element.find('.axiscolor-span').css('background-color', color);
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.axiscolor-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.axiscolor-frame').comboframe('close');
                }
            });
            this._element.find(".axiscolor-frame").comboframe();
            $(".axiscolor-picker").colorpicker('option', 'value', "black");
            this._element.find('.axiscolor-span').css('background-color', "black");

            this._element.find(".default-radio").prop("checked", true).attr("autofocus", true);

            this._element.find("input[name = 'axis-positon']").change(function () {
                if (_this._element.find("input[name = 'axis-positon']:checked").val() === "none") {
                    _this._element.find(".axiscolor-frame button").attr("disabled", "disabled");
                } else {
                    _this._element.find(".axiscolor-frame button").removeAttr("disabled");
                }
            });
        };
        NegativeValueandAxisDialog.prototype._beforeOpen = function (args) {
            var borderIndex = args[0], data = args[1];
            var borderColorContainer = this._element.find(".borderColor");
            if (borderIndex === 0) {
                //No Border
                borderColorContainer.attr("disabled", "disabled");
            } else {
                //Solid Border
                borderColorContainer.removeAttr("disabled");
            }
            if (data) {
                this._loadData(data);
            }
        };
        NegativeValueandAxisDialog.prototype._loadData = function (data) {
            this._element.find('.fillcolor-span').css('background-color', data.negativeFillColor);
            this._element.find('.bordercolor-span').css('background-color', data.negativeBorderColor);
            this._element.find('.axiscolor-span').css('background-color', data.axisColor);

            if (data.useNegativeFillColor) {
                this._element.find(".default-radio").prop("checked", true);
                this._element.find("#fill-color-editor1").prop("checked", true);
            } else {
                this._element.find("#fill-color-editor2").prop("checked", true);
            }

            if (data.useNegativeBorderColor) {
                this._element.find("#border-color-editor1").prop("checked", true);
            } else {
                this._element.find("#border-color-editor2").prop("checked", true);
            }

            if (data.axisPosition === 0 /* Automatic */) {
                this._element.find("#axis-positon-editor1").prop("checked", true);
            } else if (data.axisPosition === 1 /* CellMidPoint */) {
                this._element.find("#axis-positon-editor2").prop("checked", true);
            } else {
                this._element.find("#axis-positon-editor3").prop("checked", true);
            }
        };
        NegativeValueandAxisDialog.prototype._returnData = function () {
            var negativeBorderColor;
            var negativeFillColor;
            var useNegativeBorderColor;
            var useNegativeFillColor;
            var axisColor;
            var axisPosition;

            negativeFillColor = this._element.find('.fillcolor-span').css('background-color');
            negativeBorderColor = this._element.find('.bordercolor-span').css('background-color');
            axisColor = this._element.find('.axiscolor-span').css('background-color');

            var fill = this._element.find("input[name = 'fill-color']:checked").val();
            if (fill === "fillColor") {
                useNegativeFillColor = true;
            } else {
                useNegativeFillColor = false;
            }
            var border = this._element.find("input[name = 'border-color']:checked").val();
            if (border === "borderColor") {
                useNegativeBorderColor = true;
            } else {
                useNegativeBorderColor = false;
            }
            var position = this._element.find("input[name = 'axis-positon']:checked").val();
            if (position === "auto") {
                axisPosition = 0 /* Automatic */;
            } else if (position === "cell") {
                axisPosition = 1 /* CellMidPoint */;
            } else {
                axisPosition = 2 /* None */;
            }
            return {
                negativeBorderColor: negativeBorderColor,
                negativeFillColor: negativeFillColor,
                useNegativeBorderColor: useNegativeBorderColor,
                useNegativeFillColor: useNegativeFillColor,
                axisColor: axisColor,
                axisPosition: axisPosition
            };
        };
        return NegativeValueandAxisDialog;
    })(designer.BaseDialog);
    designer.NegativeValueandAxisDialog = NegativeValueandAxisDialog;

    function iconNameToIconSetType(iconName) {
        var iconSetType;
        switch (iconName) {
            case "3-arrows-icon-set":
                iconSetType = 0 /* ThreeArrowsColored */;
                break;
            case "3-arrows-gray-icon-set":
                iconSetType = 1 /* ThreeArrowsGray */;
                break;
            case "3-triangles-icon-set":
                iconSetType = 2 /* ThreeTriangles */;
                break;
            case "3-traffic-lights-unrimmed-icon-set":
                iconSetType = 5 /* ThreeTrafficLightsUnrimmed */;
                break;
            case "3-traffic-lights-rimmed-icon-set":
                iconSetType = 6 /* ThreeTrafficLightsRimmed */;
                break;
            case "3-signs-icon-set":
                iconSetType = 7 /* ThreeSigns */;
                break;
            case "3-symbols-circled-icon-set":
                iconSetType = 8 /* ThreeSymbolsCircled */;
                break;
            case "3-symbols-uncircled-icon-set":
                iconSetType = 9 /* ThreeSymbolsUncircled */;
                break;
            case "3-flags-icon-set":
                iconSetType = 4 /* ThreeFlags */;
                break;
            case "3-stars-icon-set":
                iconSetType = 3 /* ThreeStars */;
                break;
            case "4-arrows-gray-icon-set":
                iconSetType = 11 /* FourArrowsGray */;
                break;
            case "4-arrows-icon-set":
                iconSetType = 10 /* FourArrowsColored */;
                break;
            case "4-traffic-lights-icon-set":
                iconSetType = 14 /* FourTrafficLights */;
                break;
            case "red-to-black-icon-set":
                iconSetType = 12 /* FourRedToBlack */;
                break;
            case "4-ratings-icon-set":
                iconSetType = 13 /* FourRatings */;
                break;
            case "5-arrows-gray-icon-set":
                iconSetType = 16 /* FiveArrowsGray */;
                break;
            case "5-arrows-icon-set":
                iconSetType = 15 /* FiveArrowsColored */;
                break;
            case "5-quarters-icon-set":
                iconSetType = 18 /* FiveQuarters */;
                break;
            case "5-ratings-icon-set":
                iconSetType = 17 /* FiveRatings */;
                break;
            case "5-boxes-icon-set":
                iconSetType = 19 /* FiveBoxes */;
                break;
            case "noIcons":
                iconSetType = 20 /* No Cell Icon */;
                break;
        }
        return iconSetType;
    }
    function checkIsCustomIconSet(iconSetType, icons) {
        var isSameIconSetType = true, isAscend = true, isDescend = true;
        var i;
        for (i = 0; i < icons.length; i++) {
            if (icons[i].iconSetType !== iconSetType) {
                isSameIconSetType = false;
                break;
            }
        }
        for (i = 0; i < icons.length; i++) {
            if (icons[i].iconIndex !== i) {
                isAscend = false;
                break;
            }
        }
        for (i = 0; i < icons.length; i++) {
            if (icons[i].iconIndex !== icons.length - 1 - i) {
                isDescend = false;
                break;
            }
        }
        if (!isSameIconSetType || !(isAscend || isDescend)) {
            return true;
        }
        return false;
    }
    var NewFormattingRuleDialog = (function (_super) {
        designer.extends(NewFormattingRuleDialog, _super);
        function NewFormattingRuleDialog() {
            _super.call(this, (dialogHtmlPath), '.newFormattingRule-dialog');
        }

        NewFormattingRuleDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                height: 'auto',
                resizable: false,
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var sucess = self._validateValue();
                            if (sucess) {
                                self._addRule();
                                designer.actions.isFileModified = true; //remind user add new rule.
                                self.close();
                                if (!self._notApplySetting) {
                                    designer.wrapper.setFocusToSpread();
                                }
                                if (self._ranges) {
                                    self._rule.ranges(self._ranges);
                                }
                                self._raiseClose(event, { rule: self._rule, isCloseByOK: true });
                                self.destroy();
                            }
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            if (!self._notApplySetting) {
                                designer.wrapper.setFocusToSpread();
                            }
                            if (self._ranges) {
                                self._rule.ranges(self._ranges);
                            }
                            self._raiseClose(event, { rule: self._rule, isCloseByOK: false });
                            self.destroy();
                        }
                    }
                ],
                beforeClose: function (event, ui) {  /* NOSONAR: UnusedFunctionArgument */
                    if (event.currentTarget) {
                        if (self._ranges) {
                            self._rule.ranges(self._ranges);
                        }
                        self._raiseClose(event, { rule: self._rule, isCloseByOK: false });
                        self.destroy();
                    }
                }
            };
        };

        NewFormattingRuleDialog.prototype.destroy = function () {
            var minColorPicker = $(".min-color-picker");
            var maxColorPicker = $(".max-color-picker");
            var midColorPicker = $(".mid-color-picker");
            var barColorPicker1 = $(".barcolor1-picker");
            var barColorPicker2 = $(".barcolor2-picker");
            if (minColorPicker.length > 0 && minColorPicker.children().length > 0) {
                minColorPicker.colorpicker('destroy');
            }
            if (maxColorPicker.length > 0 && maxColorPicker.children().length > 0) {
                maxColorPicker.colorpicker('destroy');
            }
            if (midColorPicker.length > 0 && midColorPicker.children().length > 0) {
                midColorPicker.colorpicker('destroy');
            }
            if (barColorPicker1.length > 0 && barColorPicker1.children().length > 0) {
                barColorPicker1.colorpicker('destroy');
            }
            if (barColorPicker2.length > 0 && barColorPicker2.children().length > 0) {
                barColorPicker2.colorpicker('destroy');
            }
            minColorPicker.remove();
            maxColorPicker.remove();
            midColorPicker.remove();
            barColorPicker1.remove();
            barColorPicker2.remove();
            // detach range select


            $("#icon-sets-popup-dialog").remove();
            $(".icons-popup-dialog").remove();
            this._isCustomIconSetIconStyle(false);
            _super.prototype.destroy.call(this);
        };
        NewFormattingRuleDialog.prototype._init = function () {
            var _this = this;
            var ruleType = this._element.find(".ruleType");
            ruleType.change(function () {
                var selectedIndex = parseInt(ruleType.prop("selectedIndex"));
                _this._switchVisible(selectedIndex);
                _this._showSperatorLine(selectedIndex);
                if (_this._isEdit) {
                    _this._parseRule(_this._rule);
                }
            });
            this._notApplySetting = false;
            this._addEvents();
        };
        NewFormattingRuleDialog.prototype._beforeOpen = function (args) {
            var type = args[0], isNew = args[1], formatStyle = args[2], notApplySetting = args[3], loadRule = args[4],
                operator = args[5];
            this._style = keyword_undefined;

            //attach range select

            this._negativeDialogData = keyword_undefined;
            this._switchVisible(type, formatStyle, operator);
            this._showSperatorLine(type);
            if (isNew) {
                this._element.dialog('option', 'title', designer.res.conditionalFormatting.newFormattingRule.title);
            } else {
                this._element.dialog('option', 'title', designer.res.conditionalFormatting.newFormattingRule.title2);
                this._parseRule(loadRule);
                this._isEdit = true;
            }
            this._notApplySetting = notApplySetting;
        };
        NewFormattingRuleDialog.prototype._setValueFromRangeSelect = function (selector, value) {
            this._element.find(selector).val(value);
            this._element.find(selector).change();
        };

        NewFormattingRuleDialog.prototype._addRangeSelectEvent = function () {
            var _this = this;
            _this._element.find('.rangeSelectButton').click(function () {
                if (!_this._rangeSelectDialog) {
                    _this._rangeSelectDialog = new designer.RangeSelectDialog(_this, {
                        absoluteReference: true,
                        needSheetName: false
                    });
                }
                if ($(this).attr('disabled') === 'disabled') {
                    return;
                }
                var title = _this._element.dialog('option', 'title'), callback = _this._setValueFromRangeSelect,
                    existFormula;
                _this.hide();
                switch ($(this).data('name')) {
                    case "minValue":
                        existFormula = _this._element.find('.minValue').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.minValue']);
                        break;
                    case "midValue":
                        existFormula = _this._element.find('.midValue').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.midValue']);
                        break;
                    case "maxValue":
                        existFormula = _this._element.find('.maxValue').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.maxValue']);
                        break;
                    case "minValue2":
                        existFormula = _this._element.find('.minValue2').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.minValue2']);
                        break;
                    case "maxValue2":
                        existFormula = _this._element.find('.maxValue2').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.maxValue2']);
                        break;
                    case "value1":
                        existFormula = _this._element.find('.value1').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.value1']);
                        break;
                    case "value2":
                        existFormula = _this._element.find('.value2').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.value2']);
                        break;
                    case "value3":
                        existFormula = _this._element.find('.value3').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.value3']);
                        break;
                    case "value4":
                        existFormula = _this._element.find('.value4').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.value4']);
                        break;
                    case "textBox-cell1":
                        existFormula = _this._element.find('.textBox-cell1').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.textBox-cell1']);
                        break;
                    case "textBox-cell2":
                        existFormula = _this._element.find('.textBox-cell2').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.textBox-cell2']);
                        break;
                    case "formula-input":
                        existFormula = _this._element.find('.formula-input').val();
                        _this._rangeSelectDialog.open(title, callback, existFormula, ['.formula-input']);
                        break;
                    default:
                        _this.show();
                }
            });
        };
        NewFormattingRuleDialog.prototype._addEvents = function () {  /* NOSONAR: S138 LargeFunction */
            var _this = this;
            var self = this;

            //range select
            self._addRangeSelectEvent();

            //Color23
            var formatStyleSelector = this._element.find(".formatStyle");
            formatStyleSelector.change(function () {
                var selectedIndex = parseInt(formatStyleSelector.prop("selectedIndex"));
                _this._formatOnValue_switchVisible(selectedIndex);
                if (selectedIndex === 0 || selectedIndex === 1) {
                    _this._colorOfColor23Changed();
                }
            });

            var minSelector = this._element.find(".minSelector");
            minSelector.change(function () {
                var selectedIndex = parseInt(minSelector.prop("selectedIndex"));
                var minValue = _this._element.find(".minValue");
                var minValueButton = _this._element.find('.minValueButton');
                switch (selectedIndex) {
                    case 0:
                        minValue.val("(" + minSelector.val() + ")");
                        minValue.attr("disabled", "disabled");
                        minValueButton.attr("disabled", "disabled");
                        break;
                    case 1:
                    case 2:
                        minValue.val(0);
                        minValue.removeAttr("disabled");
                        minValueButton.removeAttr("disabled");
                        break;
                    case 3:
                        minValue.val("");
                        minValue.removeAttr("disabled");
                        minValueButton.removeAttr("disabled");
                        break;
                    case 4:
                        minValue.val(10);
                        minValue.removeAttr("disabled");
                        minValueButton.removeAttr("disabled");
                        break;
                }
            });

            var maxSelector = this._element.find(".maxSelector");
            maxSelector.change(function () {
                var selectedIndex = parseInt(maxSelector.prop("selectedIndex"));
                var maxValue = _this._element.find(".maxValue");
                var maxValueButton = _this._element.find(".maxValueButton");
                switch (selectedIndex) {
                    case 0:
                        maxValue.val("(" + maxSelector.val() + ")");
                        maxValue.attr("disabled", "disabled");
                        maxValueButton.attr("disabled", "disabled");
                        break;
                    case 1:
                        maxValue.val(0);
                        maxValue.removeAttr("disabled");
                        maxValueButton.removeAttr("disabled");
                        break;
                    case 2:
                        maxValue.val(100);
                        maxValue.removeAttr("disabled");
                        maxValueButton.removeAttr("disabled");
                        break;
                    case 3:
                        maxValue.val("");
                        maxValue.removeAttr("disabled");
                        maxValueButton.removeAttr("disabled");
                        break;
                    case 4:
                        maxValue.val(90);
                        maxValue.removeAttr("disabled");
                        maxValueButton.removeAttr("disabled");
                        break;
                }
            });

            var midSelector = this._element.find(".midSelector");
            midSelector.change(function () {
                var selectedIndex = parseInt(midSelector.prop("selectedIndex"));
                var midValue = _this._element.find(".midValue");
                switch (selectedIndex) {
                    case 0:
                        midValue.val(0);
                        break;
                    case 1:
                        midValue.val(50);
                        break;
                    case 2:
                        midValue.val("");
                        break;
                    case 3:
                        midValue.val(50);
                        break;
                }
            });

            //Data Bar
            var minSelector2 = this._element.find(".minSelector2");
            minSelector2.change(function () {
                var selectedIndex = parseInt(minSelector2.prop("selectedIndex"));
                var minValue = _this._element.find(".minValue2");
                var minValueButton = _this._element.find(".minValue2Button");
                switch (selectedIndex) {
                    case 0:
                    case 5:
                        minValue.val("(" + minSelector2.val() + ")");
                        minValue.attr("disabled", "disabled");
                        minValueButton.attr("disabled", "disabled");
                        break;
                    case 1:
                    case 2:
                        minValue.val(0);
                        minValue.removeAttr("disabled");
                        minValueButton.removeAttr("disabled");
                        break;
                    case 3:
                        minValue.val("");
                        minValue.removeAttr("disabled");
                        minValueButton.removeAttr("disabled");
                        break;
                    case 4:
                        minValue.val(10);
                        minValue.removeAttr("disabled");
                        minValueButton.removeAttr("disabled");
                        break;
                }
            });

            var maxSelector2 = this._element.find(".maxSelector2");
            maxSelector2.change(function () {
                var selectedIndex = parseInt(maxSelector2.prop("selectedIndex"));
                var maxValue = _this._element.find(".maxValue2");
                var maxValueButton = _this._element.find(".maxValue2Button");
                switch (selectedIndex) {
                    case 0:
                    case 5:
                        maxValue.val("(" + maxSelector2.val() + ")");
                        maxValue.attr("disabled", "disabled");
                        maxValueButton.attr("disabled", "disabled");
                        break;
                    case 1:
                        maxValue.val(0);
                        maxValue.removeAttr("disabled");
                        maxValueButton.removeAttr("disabled");
                        break;
                    case 2:
                        maxValue.val(100);
                        maxValue.removeAttr("disabled");
                        maxValueButton.removeAttr("disabled");
                        break;
                    case 3:
                        maxValue.val("");
                        maxValue.removeAttr("disabled");
                        maxValueButton.removeAttr("disabled");
                        break;
                    case 4:
                        maxValue.val(90);
                        maxValue.removeAttr("disabled");
                        maxValueButton.removeAttr("disabled");
                        break;
                }
            });

            var fillSelector = this._element.find(".fillSelector");
            fillSelector.change(function () {
                self._dataBarAppChanged();
            });

            var borderSelector = this._element.find(".borderSelector");
            borderSelector.change(function () {
                self._dataBarAppChanged();
                if (borderSelector.prop("selectedIndex") === 0) {
                    _this._element.find(".barcolor2-frame button").attr("disabled", "disabled");
                } else {
                    _this._element.find(".barcolor2-frame button").removeAttr("disabled");
                }
            });

            var barDirectionSelector = this._element.find(".barDirectionSelector");
            barDirectionSelector.change(function () {
                self._dataBarAppChanged();
            });

            //Icon Sets
            var value1 = this._element.find(".value1");
            value1.change(function () {
                self._formatOnValue_iconSets_updatedesctiptions(value1.val());
            });

            var value2 = this._element.find(".value2");
            value2.change(function () {
                self._formatOnValue_iconSets_updatedesctiptions(undefined, value2.val());
            });

            var value3 = this._element.find(".value3");
            value3.change(function () {
                self._formatOnValue_iconSets_updatedesctiptions(undefined, undefined, value3.val());
            });

            var value4 = this._element.find(".value4");
            value4.change(function () {
                self._formatOnValue_iconSets_updatedesctiptions(undefined, undefined, undefined, value4.val());
            });

            var reverseIconOrder = this._element.find(".reverseIconOrder");
            reverseIconOrder.change(function (evt) {  /* NOSONAR: UnusedFunctionArgument */
                var temp = [];
                for (var i = 0; i < _this._speratoriconStyleImages.length; i++) {
                    temp.push(_this._speratoriconStyleImages[i].toString());
                }
                var newImages = temp.reverse();
                _this._icons.reverse();
                _this._formatOnValue_iconSets_updateIcons(undefined, newImages);
            });

            $("#icon-sets-popup-dialog button").on("mouseenter", function (e) {
                var el = e.currentTarget;
                var hoverElement = $(el).children("span.icon-button-container");
                $(hoverElement).addClass("ui-state-hover");
            });

            $("#icon-sets-popup-dialog button").on("mouseleave", function (e) {
                var el = e.currentTarget;
                var hoverElement = $(el).children("span.icon-button-container");
                $(hoverElement).removeClass("ui-state-hover");
            });

            $("#icon-sets-popup-dialog button").on("click", function (e) {
                self._element.find('.iconStyle-frame').comboframe('close');

                var newImages = [];
                var needRemoveClassNames;
                var el = e.currentTarget;
                self._iconNames = el.name;
                var spans = el.childNodes[1].children;
                for (var i = 0; i < spans.length; i++) {
                    var classNames = spans[i].className;
                    needRemoveClassNames = "iconSetsIcons horizontal-icon-set-item ";
                    var imageClassName = classNames.substring(needRemoveClassNames.length, classNames.length);
                    newImages.push(imageClassName);
                }
                self._icons = [];
                self._isCustomIconSet = false;
                self._isCustomIconSetIconStyle(false);
                if (reverseIconOrder.prop("checked")) {
                    var temp = [];
                    for (i = 0; i < newImages.length; i++) {
                        temp.push(newImages[i].toString());
                    }
                    var newImages2 = temp.reverse();
                    for (i = 0; i < newImages.length; i++) {
                        self._icons.push({
                            iconSetType: iconNameToIconSetType(el.name),
                            iconIndex: i
                        });
                    }
                    self._formatOnValue_iconSets_updateIcons(newImages, newImages2);
                } else {
                    for (i = newImages.length - 1; i >= 0; i--) {
                        self._icons.push({
                            iconSetType: iconNameToIconSetType(el.name),
                            iconIndex: i
                        });
                    }
                    self._formatOnValue_iconSets_updateIcons(newImages, newImages);
                }
                self._formatOnValue_IconSets_switchVisible(newImages.length);
                self._formatOnValue_iconSets_updateValues(el.name);
            });

            $(".icons-popup-dialog .icon-wrapper").on("mouseenter", function (e) {
                var el = e.currentTarget;
                $(el).addClass("ui-state-hover");
            });
            $(".icons-popup-dialog .icon-wrapper").on("mouseleave", function (e) {
                var el = e.currentTarget;
                $(el).removeClass("ui-state-hover");
            });
            $(".icons-popup-dialog span").on("click", function (e) {
                var currentComboFrame = self._element.find('.icon-frame.ui-state-active');
                if (currentComboFrame.length !== 1) {
                    return;
                }
                var iconIndex = self._element.find('.icon-frame').index(currentComboFrame);
                currentComboFrame.comboframe('close');
                var currentComboFrameContent = $(currentComboFrame).children()[0];
                var targetSpan = $(currentComboFrameContent).children()[0];
                var destSpan = $(e.currentTarget).hasClass("iconSetsIcons") ? e.currentTarget : $(e.currentTarget).children()[0];
                var destSpanClassNames = destSpan.className;
                var needRemoveClassNamesForDestSpan = "iconSetsIcons ";
                var imageClassName = destSpanClassNames.substring(needRemoveClassNamesForDestSpan.length, destSpanClassNames.length);
                var iconTextSpan = $(targetSpan).next("span");
                if (imageClassName === "no-cell-icon") {
                    iconTextSpan.text(designer.res.conditionalFormatting.newFormattingRule.formatOnValue.iconSets.noCellIcon);
                } else {
                    iconTextSpan.text("");
                }
                var staticClassNamesForTargetSpan = 'iconX iconSetsIcons ';
                var targetSpanClassNames = targetSpan.className;
                var currentImageClassName = targetSpanClassNames.substring(staticClassNamesForTargetSpan.length, targetSpanClassNames.length);
                if (currentImageClassName === imageClassName) {
                    return;
                }
                var needRemainClassNamesForTargetSpan = targetSpan.className.match(/icon\d+/g);
                $(targetSpan).removeClass();
                $(targetSpan).addClass(needRemainClassNamesForTargetSpan[0]);
                $(targetSpan).addClass(needRemoveClassNamesForDestSpan);
                $(targetSpan).addClass(imageClassName);
                var iconInfo = destSpan.getAttribute("name");
                self._speratoriconStyleImages[iconIndex] = imageClassName;
                iconInfo = iconInfo.split(",");
                self._icons[iconIndex] = {
                    iconSetType: iconNameToIconSetType(iconInfo[0]),
                    iconIndex: parseInt(iconInfo[1])
                };
                self._isCustomIconSet = true;
                self._isCustomIconSetIconStyle(true);
            });
            var value1Selector = this._element.find(".value1Selector");
            value1Selector.change(function () {
                self._formatOnValue_iconSets_updateValues(self._iconNames, 1);
            });

            var value2Selector = this._element.find(".value2Selector");
            value2Selector.change(function () {
                self._formatOnValue_iconSets_updateValues(self._iconNames, 2);
            });

            var value3Selector = this._element.find(".value3Selector");
            value3Selector.change(function () {
                self._formatOnValue_iconSets_updateValues(self._iconNames, 3);
            });

            var value4Selector = this._element.find(".value4Selector");
            value4Selector.change(function () {
                self._formatOnValue_iconSets_updateValues(self._iconNames, 4);
            });

            var operator1 = this._element.find(".operator1");
            operator1.change(function () {
                self._formatOnValue_iconSets_updatedesctiptions(value1.val());
            });

            var operator2 = this._element.find(".operator2");
            operator2.change(function () {
                self._formatOnValue_iconSets_updatedesctiptions(undefined, value2.val());
            });

            var operator3 = this._element.find(".operator3");
            operator3.change(function () {
                self._formatOnValue_iconSets_updatedesctiptions(undefined, undefined, value3.val());
            });

            var operator4 = this._element.find(".operator4");
            operator4.change(function () {
                self._formatOnValue_iconSets_updatedesctiptions(undefined, undefined, undefined, value4.val());
            });

            //formatContain
            var ruleType = this._element.find(".formatContain-type");
            var operator = this._element.find(".operator");
            ruleType.change(function () {
                var selectedIndex = parseInt(ruleType.prop("selectedIndex"));
                _this._formatContain_switchOperator(selectedIndex);
                _this._formatContain_switchVisible(selectedIndex);
                operator.trigger("change");
            });

            operator.change(function (evt) {  /* NOSONAR: UnusedFunctionArgument */
                var selectedIndex = parseInt(ruleType.prop("selectedIndex"));
                if (selectedIndex === 0) {
                    _this._formatContain_switchVisible_CellValue(operator.prop("selectedIndex"));
                }
            });

            //Preview
            var formatBtn = this._element.find(".format-button");
            formatBtn.click(function () {
                _this.formatCellDialog.selectTabOptions = {
                    numbers: true,
                    font: true,
                    border: true,
                    fill: true
                };
                _this.formatCellDialog.setFormatDirectly(false);
                _this.formatCellDialog.open('font', {
                    family: 'disabled',
                    size: 'disabled',
                    weight: 'disabled'
                }, _this._style, true);
            });
        };
        NewFormattingRuleDialog.prototype._showSperatorLine = function (selectedIndex) {
            var line = ".format-rule-sperator-line";
            if (selectedIndex === 0) {
                this._element.find(line).css("display", "none");
            } else {
                this._element.find(line).css("display", "block");
            }
        };
        NewFormattingRuleDialog.prototype._raiseClose = function (evt, value) {
            $(this).trigger('dialogClose', value);
        };
        NewFormattingRuleDialog.prototype._parseRule = function (loadRule) {  /* NOSONAR: S138 LargeFunction */
            this._ranges = loadRule.ranges();
            this._rule = loadRule;
            var index, index2, type, minSelector, maxSelector, ruleType, comparisonOperator, value1, value2;
            var min, minValue, minColor, max, maxValue, maxColor;
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var activeRow = activeSheet.getActiveRowIndex();
            var activeColumn = activeSheet.getActiveColumnIndex();
            if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.twoScaleRule) {
                var twoScaleRule = loadRule;
                min = twoScaleRule.minType();
                minValue = twoScaleRule.minValue();
                minColor = twoScaleRule.minColor();
                max = twoScaleRule.maxType();
                maxValue = twoScaleRule.maxValue();
                maxColor = twoScaleRule.maxColor();

                //Read Value
                minSelector = this._element.find(".minSelector");
                index = this._getIndexofScaleValueType(min);
                minSelector.prop("selectedIndex", index);
                minSelector.trigger("change");

                maxSelector = this._element.find(".maxSelector");
                index2 = this._getIndexofScaleValueType(max);
                maxSelector.prop("selectedIndex", index2);
                maxSelector.trigger("change");

                $(".min-color-picker").colorpicker('option', 'value', minColor);
                this._element.find('.min-color-span').css('background-color', minColor);
                $(".max-color-picker").colorpicker('option', 'value', maxColor);
                this._element.find('.max-color-span').css('background-color', maxColor);
                if (index !== 0) {
                    this._element.find(".minValue").val(minValue);
                }
                if (index2 !== 0) {
                    this._element.find(".maxValue").val(maxValue);
                }
                //Appearance changes.
                this._colorOfColor23Changed();
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.threeScaleRule) {
                var threeScaleRule = loadRule;
                var mid, midValue, midColor;
                min = threeScaleRule.minType();
                minValue = threeScaleRule.minValue();
                minColor = threeScaleRule.minColor();
                max = threeScaleRule.maxType();
                maxValue = threeScaleRule.maxValue();
                maxColor = threeScaleRule.maxColor();
                mid = threeScaleRule.midType();
                midValue = threeScaleRule.midValue();
                midColor = threeScaleRule.midColor();

                //Read Value
                minSelector = this._element.find(".minSelector");
                index = this._getIndexofScaleValueType(min);
                minSelector.prop("selectedIndex", index);
                minSelector.trigger("change");

                maxSelector = this._element.find(".maxSelector");
                index2 = this._getIndexofScaleValueType(max);
                maxSelector.prop("selectedIndex", index2);
                maxSelector.trigger("change");

                var midSelector = this._element.find(".midSelector");
                var index3 = this._getIndexofScaleValueType(mid) - 1;
                midSelector.prop("selectedIndex", index3);
                midSelector.trigger("change");

                $(".min-color-picker").colorpicker('option', 'value', minColor);
                this._element.find('.min-color-span').css('background-color', minColor);
                $(".max-color-picker").colorpicker('option', 'value', maxColor);
                this._element.find('.max-color-span').css('background-color', maxColor);
                $(".mid-color-picker").colorpicker('option', 'value', midColor);
                this._element.find('.mid-color-span').css('background-color', midColor);
                if (index !== 0) {
                    this._element.find(".minValue").val(minValue);
                }
                if (index2 !== 0) {
                    this._element.find(".maxValue").val(maxValue);
                }
                this._element.find(".midValue").val(midValue);

                //Appearance changes.
                this._colorOfColor23Changed();
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.dataBarRule) {
                var dataBarRule = loadRule;
                var minType, maxType, fillColor, showBarOnly, isGradient, borderColor, showBorder, barDirection,
                    negativeBorderColor, negativeFillColor, useNegativeBorderColor, useNegativeFillColor, axisColor,
                    axisPosition;
                minType = dataBarRule.minType();
                minValue = dataBarRule.minValue();
                maxType = dataBarRule.maxType();
                maxValue = dataBarRule.maxValue();
                fillColor = dataBarRule.color();
                borderColor = dataBarRule.borderColor();
                showBarOnly = dataBarRule.showBarOnly();
                isGradient = dataBarRule.gradient();
                showBorder = dataBarRule.showBorder();
                barDirection = dataBarRule.dataBarDirection();
                negativeBorderColor = dataBarRule.negativeBorderColor();
                negativeFillColor = dataBarRule.negativeFillColor();
                useNegativeBorderColor = dataBarRule.useNegativeBorderColor();
                useNegativeFillColor = dataBarRule.useNegativeFillColor();
                axisColor = dataBarRule.axisColor();
                axisPosition = dataBarRule.axisPosition();

                var minSelector2 = this._element.find(".minSelector2");
                index = this._getIndexofScaleValueType(minType);
                minSelector2.prop("selectedIndex", index);
                minSelector2.trigger("change");

                var maxSelector2 = this._element.find(".maxSelector2");
                index2 = this._getIndexofScaleValueType(maxType);
                maxSelector2.prop("selectedIndex", index2);
                maxSelector2.trigger("change");

                this._element.find(".minValue2").val(minValue);
                this._element.find(".maxValue2").val(maxValue);
                $(".barcolor1-picker").colorpicker('option', 'value', fillColor);
                $(".barcolor2-picker").colorpicker('option', 'value', borderColor);
                this._element.find('.barcolor1-span').css('background-color', fillColor);
                this._element.find('.barcolor2-span').css('background-color', borderColor);
                this._element.find('.showBarOnly').prop("checked", showBarOnly);
                var fillSelector = this._element.find(".fillSelector");
                fillSelector.prop("selectedIndex", isGradient === true ? 1 : 0);
                fillSelector.trigger("change");
                var borderSelector = this._element.find(".borderSelector");
                borderSelector.prop("selectedIndex", showBorder === true ? 1 : 0);
                borderSelector.trigger("change");
                this._element.find(".barDirectionSelector").prop("selectedIndex", barDirection === 0 /* LeftToRight */ ? 0 : 1);

                this._negativeDialogData = {
                    negativeBorderColor: negativeBorderColor,
                    negativeFillColor: negativeFillColor,
                    useNegativeBorderColor: useNegativeBorderColor,
                    useNegativeFillColor: useNegativeFillColor,
                    axisColor: axisColor,
                    axisPosition: axisPosition
                };

                //Appearance changes.
                this._dataBarAppChanged();
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.iconSetRule) {
                var iconSetRule = loadRule;
                var iconSetType, showIconOnly, reverseIconOrder, iconCriteria;
                iconSetType = iconSetRule.iconSetType();
                showIconOnly = iconSetRule.showIconOnly();
                reverseIconOrder = iconSetRule.reverseIconOrder();
                iconCriteria = iconSetRule.iconCriteria();

                var iconNames;
                switch (iconSetType) {
                    case 0 /* ThreeArrowsColored */
                        :
                        iconNames = "3-arrows-icon-set";
                        break;
                    case 1 /* ThreeArrowsGray */
                        :
                        iconNames = "3-arrows-gray-icon-set";
                        break;
                    case 2 /* ThreeTriangles */
                        :
                        iconNames = "3-triangles-icon-set";
                        break;
                    case 5 /* ThreeTrafficLightsUnrimmed */
                        :
                        iconNames = "3-traffic-lights-unrimmed-icon-set";
                        break;
                    case 6 /* ThreeTrafficLightsRimmed */
                        :
                        iconNames = "3-traffic-lights-rimmed-icon-set";
                        break;
                    case 7 /* ThreeSigns */
                        :
                        iconNames = "3-signs-icon-set";
                        break;
                    case 8 /* ThreeSymbolsCircled */
                        :
                        iconNames = "3-symbols-circled-icon-set";
                        break;
                    case 9 /* ThreeSymbolsUncircled */
                        :
                        iconNames = "3-symbols-uncircled-icon-set";
                        break;
                    case 4 /* ThreeFlags */
                        :
                        iconNames = "3-flags-icon-set";
                        break;
                    case 3 /* ThreeStars */
                        :
                        iconNames = "3-stars-icon-set";
                        break;
                    case 11 /* FourArrowsGray */
                        :
                        iconNames = "4-arrows-gray-icon-set";
                        break;
                    case 10 /* FourArrowsColored */
                        :
                        iconNames = "4-arrows-icon-set";
                        break;
                    case 14 /* FourTrafficLights */
                        :
                        iconNames = "4-traffic-lights-icon-set";
                        break;
                    case 12 /* FourRedToBlack */
                        :
                        iconNames = "red-to-black-icon-set";
                        break;
                    case 13 /* FourRatings */
                        :
                        iconNames = "4-ratings-icon-set";
                        break;
                    case 16 /* FiveArrowsGray */
                        :
                        iconNames = "5-arrows-gray-icon-set";
                        break;
                    case 15 /* FiveArrowsColored */
                        :
                        iconNames = "5-arrows-icon-set";
                        break;
                    case 18 /* FiveQuarters */
                        :
                        iconNames = "5-quarters-icon-set";
                        break;
                    case 17 /* FiveRatings */
                        :
                        iconNames = "5-ratings-icon-set";
                        break;
                    case 19 /* FiveBoxes */
                        :
                        iconNames = "5-boxes-icon-set";
                        break;
                }
                this._formatOnValue_iconSets_updateValues(iconNames);

                this._element.find(".showIconOnly").prop("checked", showIconOnly);
                this._element.find(".reverseIconOrder").prop("checked", reverseIconOrder);
                this._element.find(".operator1").prop("selectedIndex", this._getIsGreaterThanOrEqualTo(iconCriteria[iconCriteria.length - 1]) === true ? 0 : 1);
                this._element.find(".operator2").prop("selectedIndex", this._getIsGreaterThanOrEqualTo(iconCriteria[iconCriteria.length - 2]) === true ? 0 : 1);
                this._element.find(".value1Selector").prop("selectedIndex", this._getIndexofIconValueType(iconCriteria[iconCriteria.length - 1]));
                this._element.find(".value2Selector").prop("selectedIndex", this._getIndexofIconValueType(iconCriteria[iconCriteria.length - 2]));
                var value11 = this._element.find(".value1");
                value11.val(this._getIconValue(iconCriteria[iconCriteria.length - 1]));
                var value22 = this._element.find(".value2");
                value22.val(this._getIconValue(iconCriteria[iconCriteria.length - 2]));
                if (iconCriteria.length >= 3) {
                    this._element.find(".operator3").prop("selectedIndex", this._getIsGreaterThanOrEqualTo(iconCriteria[iconCriteria.length - 3]) === true ? 0 : 1);
                    this._element.find(".value3Selector").prop("selectedIndex", this._getIndexofIconValueType(iconCriteria[iconCriteria.length - 3]));
                    var value33 = this._element.find(".value3");
                    value33.val(this._getIconValue(iconCriteria[iconCriteria.length - 3]));
                }
                if (iconCriteria.length >= 4) {
                    this._element.find(".operator4").prop("selectedIndex", this._getIsGreaterThanOrEqualTo(iconCriteria[iconCriteria.length - 4]) === true ? 0 : 1);
                    this._element.find(".value4Selector").prop("selectedIndex", this._getIndexofIconValueType(iconCriteria[iconCriteria.length - 4]));
                    var value44 = this._element.find(".value4");
                    value44.val(this._getIconValue(iconCriteria[iconCriteria.length - 4]));
                }

                var tempDiv = $("<div></div>");
                RuleFormatHelper._drawIconSetPreview(tempDiv, iconSetType);
                tempDiv.children().removeClass("iconSetsIcons");

                var newImages = [], newSeparatorImages = [];
                for (var i = 0; i < tempDiv.children().length; i++) {
                    newImages.push(tempDiv.children()[i].className);
                }
                this._icons = iconSetRule.icons();
                if (this._icons) {
                    this._icons = iconSetRule.icons().concat();
                    this._icons.reverse();
                    for (i = 0; i < tempDiv.children().length; i++) {
                        newSeparatorImages.push(RuleFormatHelper._getIconClass(this._icons[i]));
                    }
                } else {
                    this._icons = [];
                    newSeparatorImages = newImages;
                }
                this._isCustomIconSet = iconSetRule._isCustomIconSet || checkIsCustomIconSet(iconSetType, this._icons);
                this._isCustomIconSetIconStyle(this._isCustomIconSet);
                if (reverseIconOrder) {
                    this._icons.reverse();
                    newSeparatorImages.reverse();
                }
                this._formatOnValue_iconSets_updateIcons(newImages, newSeparatorImages);
                this._formatOnValue_IconSets_switchVisible(iconCriteria.length + 1);

                this._formatOnValue_iconSets_updatedesctiptions(value11.val(), value22.val(), value33 === undefined ? undefined : value33.val(), value44 === undefined ? undefined : value44.val());
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.cellValueRule) {
                var cellValueRule = loadRule;
                comparisonOperator = cellValueRule.operator();
                value1 = cellValueRule.value1(activeRow, activeColumn);
                value2 = cellValueRule.value2(activeRow, activeColumn);
                this._style = cellValueRule.style();

                ruleType = this._element.find(".formatContain-type");
                ruleType.prop("selectedIndex", 0);
                ruleType.trigger("change");

                switch (comparisonOperator) {
                    case 6 /* Between */
                        :
                        index = 0;
                        break;
                    case 7 /* NotBetween */
                        :
                        index = 1;
                        break;
                    case 0 /* EqualsTo */
                        :
                        index = 2;
                        break;
                    case 1 /* NotEqualsTo */
                        :
                        index = 3;
                        break;
                    case 2 /* GreaterThan */
                        :
                        index = 4;
                        break;
                    case 4 /* LessThan */
                        :
                        index = 5;
                        break;
                    case 3 /* GreaterThanOrEqualsTo */
                        :
                        index = 6;
                        break;
                    case 5 /* LessThanOrEqualsTo */
                        :
                        index = 7;
                        break;
                }
                this._element.find(".operator").prop("selectedIndex", index);
                this._element.find(".operator").trigger("change");

                this._element.find(".textBox-cell1").val(value1);
                this._element.find(".textBox-cell2").val(value2);

                this._drawPreviewControl();
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.specificTextRule) {
                var specificTextRule = loadRule;
                comparisonOperator = specificTextRule.operator();
                value1 = specificTextRule.text();
                this._style = specificTextRule.style();

                ruleType = this._element.find(".formatContain-type");
                ruleType.prop("selectedIndex", 1);
                ruleType.trigger("change");

                switch (comparisonOperator) {
                    case 0 /* Contains */
                        :
                        index = 0;
                        break;
                    case 1 /* DoesNotContain */
                        :
                        index = 1;
                        break;
                    case 2 /* BeginsWith */
                        :
                        index = 2;
                        break;
                    case 3 /* EndsWith */
                        :
                        index = 3;
                        break;
                }
                this._element.find(".operator").prop("selectedIndex", index);
                this._element.find(".operator").trigger("change");

                this._element.find(".textBox-cell1").val(value1);

                this._drawPreviewControl();
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.dateOccurringRule) {
                var dateOccurringRule = loadRule;
                var dateOccurringType;
                dateOccurringType = dateOccurringRule.type();
                this._style = dateOccurringRule.style();

                ruleType = this._element.find(".formatContain-type");
                ruleType.prop("selectedIndex", 2);
                ruleType.trigger("change");

                switch (dateOccurringType) {
                    case 1 /* Yesterday */
                        :
                        index = 0;
                        break;
                    case 0 /* Today */
                        :
                        index = 1;
                        break;
                    case 2 /* Tomorrow */
                        :
                        index = 2;
                        break;
                    case 3 /* Last7Days */
                        :
                        index = 3;
                        break;
                    case 8 /* LastWeek */
                        :
                        index = 4;
                        break;
                    case 7 /* ThisWeek */
                        :
                        index = 5;
                        break;
                    case 9 /* NextWeek */
                        :
                        index = 6;
                        break;
                    case 5 /* LastMonth */
                        :
                        index = 7;
                        break;
                    case 4 /* ThisMonth */
                        :
                        index = 8;
                        break;
                    case 6 /* NextMonth */
                        :
                        index = 9;
                        break;
                }
                this._element.find(".operator").prop("selectedIndex", index);
                this._element.find(".operator").trigger("change");

                this._drawPreviewControl();
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.top10Rule) {
                var top10Rule = loadRule;
                var rank;
                type = top10Rule.type();
                rank = top10Rule.rank();
                this._style = top10Rule.style();

                this._element.find(".formatRankedValue-type").prop("selectedIndex", type === 0 /* Top */ ? 0 : 1);
                this._element.find(".formatRankedValue-type").trigger("change");
                this._element.find(".itemCounts").val(rank);

                this._drawPreviewControl();
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.averageRule) {
                var averageRule = loadRule;
                type = averageRule.type();
                this._style = averageRule.style();

                switch (type) {
                    case 0 /* Above */
                        :
                        index = 0;
                        break;
                    case 1 /* Below */
                        :
                        index = 1;
                        break;
                    case 2 /* EqualOrAbove */
                        :
                        index = 2;
                        break;
                    case 3 /* EqualOrBelow */
                        :
                        index = 3;
                        break;
                    case 4 /* Above1StdDev */
                        :
                        index = 4;
                        break;
                    case 5 /* Below1StdDev */
                        :
                        index = 5;
                        break;
                    case 6 /* Above2StdDev */
                        :
                        index = 6;
                        break;
                    case 7 /* Below2StdDev */
                        :
                        index = 7;
                        break;
                    case 8 /* Above3StdDev */
                        :
                        index = 8;
                        break;
                    case 9 /* Below3StdDev */
                        :
                        index = 9;
                        break;
                }
                this._element.find(".formatAbove-type").prop("selectedIndex", index);
                this._element.find(".formatAbove-type").trigger("change");

                this._drawPreviewControl();
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.duplicateRule) {
                var duplicateRule = loadRule;
                this._style = duplicateRule.style();

                this._element.find(".formatUnique-type").prop("selectedIndex", 0);

                this._drawPreviewControl();
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.uniqueRule) {
                var uniqueRule = loadRule;
                this._style = uniqueRule.style();

                this._element.find(".formatUnique-type").prop("selectedIndex", 1);
                this._drawPreviewControl();
            } else if (loadRule.ruleType() === Sheets.ConditionalFormatting.RuleType.formulaRule) {
                var data = loadRule;
                index = data.selectorIndex;
                this._style = data.style();
                if (data.ruleType() === 1 /* formatContain */) {
                    this._element.find(".formatContain-type").prop("selectedIndex", index);
                    this._element.find(".formatContain-type").trigger("change");
                } else if (data.ruleType() === 3 /* useFormula */) {
                    var formula = data.formula();
                    this._element.find(".formula-input").val(formula);
                }
                this._drawPreviewControl();
            }
        };
        NewFormattingRuleDialog.prototype._getIndexofScaleValueType = function (type) {
            var index;
            switch (type) {
                case 2 /* HighestValue */
                    :
                case 1 /* LowestValue */
                    :
                    index = 0;
                    break;
                case 0 /* Number */
                    :
                    index = 1;
                    break;
                case 3 /* Percent */
                    :
                    index = 2;
                    break;
                case 6 /* Formula */
                    :
                    index = 3;
                    break;
                case 4 /* Percentile */
                    :
                    index = 4;
                    break;
                case 5 /* Automin */
                    :
                case 7 /* Automax */
                    :
                    index = 5;
                    break;
            }
            return index;
        };
        NewFormattingRuleDialog.prototype._getIconCriterionProperty = function (iconCriterion, prop) {
            return iconCriterion[prop];
        };
        NewFormattingRuleDialog.prototype._getIsGreaterThanOrEqualTo = function (iconCriterion) {
            return this._getIconCriterionProperty(iconCriterion, "isGreaterThanOrEqualTo");
        };
        NewFormattingRuleDialog.prototype._getIconValue = function (iconCriterion) {
            return this._getIconCriterionProperty(iconCriterion, "iconValue");
        };
        NewFormattingRuleDialog.prototype._getIndexofIconValueType = function (iconCriterion) {
            var type = this._getIconCriterionProperty(iconCriterion, "iconValueType");
            var index;
            switch (type) {
                case 1 /* Number */
                    :
                    index = 0;
                    break;
                case 4 /* Percent */
                    :
                    index = 1;
                    break;
                case 7 /* Formula */
                    :
                    index = 2;
                    break;
                case 5 /* Percentile */
                    :
                    index = 3;
                    break;
            }
            return index;
        };
        NewFormattingRuleDialog.prototype._getIconValueTypeofIndex = function (index) {
            var type;
            switch (index) {
                case 0:
                    type = 1 /* Number */;
                    break;
                case 1:
                    type = 4 /* Percent */;
                    break;
                case 2:
                    type = 7 /* Formula */;
                    break;
                case 3:
                    type = 5 /* Percentile */;
                    break;
            }
            return type;
        };
        NewFormattingRuleDialog.prototype._validateValue = function () {
            var index = parseInt(this._element.find(".ruleType").prop("selectedIndex"));
            switch (index) {
                case 0:
                    break;
                case 1:
                    var formatContainType = parseInt(this._element.find(".formatContain-type").prop("selectedIndex"));
                    var operator = this._element.find(".operator").prop("selectedIndex");
                    var cell1 = this._element.find(".textBox-cell1");
                    var cell2 = this._element.find(".textBox-cell2");
                    switch (formatContainType) {
                        case 0:
                            if (operator === 0 || operator === 1) {
                                if (cell1.val() === "" || cell2.val() === "") {
                                    MessageBox.show(designer.res.conditionalFormatting.exceptions.e4, designer.res.title, 2 /* warning */);
                                    return false;
                                }
                            } else {
                                if (cell1.val() === "") {
                                    MessageBox.show(designer.res.conditionalFormatting.exceptions.e4, designer.res.title, 2 /* warning */);
                                    return false;
                                }
                            }
                            break;
                        case 1:
                            if (cell1.val() === "") {
                                MessageBox.show(designer.res.conditionalFormatting.exceptions.e4, designer.res.title, 2 /* warning */);
                                return false;
                            }
                            break;
                    }
                    break;
                case 2:
                    var value1 = parseInt(this._element.find(".itemCounts").val());
                    var result = true;
                    if (isNaN(value1) || value1 > 1000 || value1 < 1) {
                        MessageBox.show(designer.res.conditionalFormatting.exceptions.e3, designer.res.title, 2 /* warning */);
                        result = false;
                    }
                    return result;
                case 5:
                    var formula = this._element.find(".formula-input").val();
                    var sheet = designer.wrapper.spread.getActiveSheet();
                    var expression = GC.Spread.Sheets.CalcEngine.formulaToExpression(sheet, formula);
                    if (!(expression.type === GC.Spread.CalcEngine.ExpressionType.function) && !(expression.type === GC.Spread.CalcEngine.ExpressionType.reference) && !(expression.type === GC.Spread.CalcEngine.ExpressionType.operator)) {
                        MessageBox.show(designer.res.conditionalFormatting.exceptions.e5, designer.res.title, 2 /* warning */);
                        return false;
                    }
                    break;
            }
            return true;
        };
        NewFormattingRuleDialog.prototype._addRule = function () {
            var index = parseInt(this._element.find(".ruleType").prop("selectedIndex"));
            switch (index) {
                case 0:
                    var formatStyle = parseInt(this._element.find(".formatStyle").prop("selectedIndex"));
                    switch (formatStyle) {
                        case 0:
                            this._addRuleOfColorScale(false);
                            break;
                        case 1:
                            this._addRuleOfColorScale(true);
                            break;
                        case 2:
                            this._addRuleOfDataBar();
                            break;
                        case 3:
                            this._addRuleOfIconSets();
                            break;
                    }
                    break;
                case 1:
                    var formatContainType = parseInt(this._element.find(".formatContain-type").prop("selectedIndex"));
                    switch (formatContainType) {
                        case 0:
                            this._addRuleOfCellValue();
                            break;
                        case 1:
                            this._addRuleOfText();
                            break;
                        case 2:
                            this._addRuleOfDatesOccuring();
                            break;
                        default:
                            this._addRuleOfFormulaRule(formatContainType);
                            break;
                    }
                    break;
                case 2:
                    this._addRuleOfformatRankedValue();
                    break;
                case 3:
                    this._addRuleOfformatAbove();
                    break;
                case 4:
                    this._addRuleOfformatUnique();
                    break;
                case 5:
                    this._addRuleOfuseFormula();
                    break;
            }

            // Fixed bug 152190 (Cells with conditional formatting applied always remain locked even on unlocking), delete new rule' style.locked if present
            var rule = this._rule;
            if (rule && rule.style() && rule.style().locked !== undefined) {
                delete rule.style().locked;
            }
        };
        NewFormattingRuleDialog.prototype._switchVisible = function (type, formatStyle, operator) {
            var formatOnValue = this._element.find(".formatOnValue");
            var formatContain = this._element.find(".formatContain");
            var formatRankedValue = this._element.find(".formatRankedValue");
            var formatAbove = this._element.find(".formatAbove");
            var formatUnique = this._element.find(".formatUnique");
            var useFormula = this._element.find(".useFormula");
            var ruleType = this._element.find(".ruleType");

            var preview = this._element.find(".preview");
            switch (type) {
                case 0 /* formatOnValue */
                    :
                    formatOnValue.removeClass("hidden");
                    formatContain.addClass("hidden");
                    formatRankedValue.addClass("hidden");
                    formatAbove.addClass("hidden");
                    formatUnique.addClass("hidden");
                    useFormula.addClass("hidden");
                    preview.addClass("hidden");
                    this._initformatOnValue(formatStyle);
                    ruleType.prop("selectedIndex", 0);
                    break;
                case 1 /* formatContain */
                    :
                    formatOnValue.addClass("hidden");
                    formatContain.removeClass("hidden");
                    formatRankedValue.addClass("hidden");
                    formatAbove.addClass("hidden");
                    formatUnique.addClass("hidden");
                    useFormula.addClass("hidden");
                    preview.removeClass("hidden");
                    this._initformatContain(operator);
                    this._initPreview();
                    ruleType.prop("selectedIndex", 1);
                    break;
                case 2 /* formatRankedValue */
                    :
                    formatOnValue.addClass("hidden");
                    formatContain.addClass("hidden");
                    formatRankedValue.removeClass("hidden");
                    formatAbove.addClass("hidden");
                    formatUnique.addClass("hidden");
                    useFormula.addClass("hidden");
                    preview.removeClass("hidden");
                    this._initformatRankedValue();
                    this._initPreview();
                    ruleType.prop("selectedIndex", 2);
                    break;
                case 3 /* formatAbove */
                    :
                    formatOnValue.addClass("hidden");
                    formatContain.addClass("hidden");
                    formatRankedValue.addClass("hidden");
                    formatAbove.removeClass("hidden");
                    formatUnique.addClass("hidden");
                    useFormula.addClass("hidden");
                    preview.removeClass("hidden");
                    this._initformatAbove();
                    this._initPreview();
                    ruleType.prop("selectedIndex", 3);
                    break;
                case 4 /* formatUnique */
                    :
                    formatOnValue.addClass("hidden");
                    formatContain.addClass("hidden");
                    formatRankedValue.addClass("hidden");
                    formatAbove.addClass("hidden");
                    formatUnique.removeClass("hidden");
                    useFormula.addClass("hidden");
                    preview.removeClass("hidden");
                    this._initformatUnique();
                    this._initPreview();
                    ruleType.prop("selectedIndex", 4);
                    break;
                case 5 /* useFormula */
                    :
                    formatOnValue.addClass("hidden");
                    formatContain.addClass("hidden");
                    formatRankedValue.addClass("hidden");
                    formatAbove.addClass("hidden");
                    formatUnique.addClass("hidden");
                    useFormula.removeClass("hidden");
                    preview.removeClass("hidden");
                    this._inituseFormula();
                    this._initPreview();
                    ruleType.prop("selectedIndex", 5);
                    break;
            }
        };
        NewFormattingRuleDialog.prototype._colorOfColor23Changed = function () {
            var mincolor = this._element.find('.min-color-span').css('background-color');
            var midcolor = this._element.find('.mid-color-span').css('background-color');
            var maxcolor = this._element.find('.max-color-span').css('background-color');
            if (this._formatStyle === 0) {
                this._formatOnValue_previewColor23(mincolor, maxcolor);
            } else {
                this._formatOnValue_previewColor23(mincolor, midcolor, maxcolor);
            }
        };
        NewFormattingRuleDialog.prototype._dataBarAppChanged = function () {
            var color1 = this._element.find('.barcolor1-span').css('background-color');
            var color2 = this._element.find('.barcolor2-span').css('background-color');
            var fillSelector = this._element.find(".fillSelector").prop("selectedIndex");
            var borderSelector = this._element.find(".borderSelector").prop("selectedIndex");
            var barDirectionSelector = this._element.find(".barDirectionSelector").prop("selectedIndex");
            var previewContainer = this._element.find(".previewContainer-dataBar");

            var startColor = color1;
            var endColor;
            var borderColor;

            if (fillSelector === 1) {
                endColor = "white";
            }
            if (borderSelector === 1) {
                borderColor = color2;
            }
            if (barDirectionSelector === 1) {
                var color = startColor;
                startColor = endColor;
                endColor = color;
                previewContainer.attr("align", "right");
            } else {
                previewContainer.attr("align", "left");
            }
            this._formatRankedValue_previewDataBar(startColor, endColor, borderColor);
        };
        NewFormattingRuleDialog.prototype._initformatOnValue = function (formatStyle) {
            var _this = this;
            var self = this;

            //Color23
            $(".min-color-picker").colorpicker({
                valueChanged: function (e, value) {
                    var color;
                    if (value.color === undefined) {
                        color = "red";
                    } else {
                        color = value.color;
                    }
                    self._element.find('.min-color-span').css('background-color', color);
                    self._colorOfColor23Changed();
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.min-color-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.min-color-frame').comboframe('close');
                }
            });
            this._element.find(".min-color-frame").comboframe();
            $(".min-color-picker").colorpicker('option', 'value', "red");
            this._element.find('.min-color-span').css('background-color', "red");

            $(".mid-color-picker").colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('.mid-color-span').css('background-color', "yellow");
                    } else {
                        self._element.find('.mid-color-span').css('background-color', value.color);
                    }
                    self._colorOfColor23Changed();
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.mid-color-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.mid-color-frame').comboframe('close');
                }
            });
            this._element.find(".mid-color-frame").comboframe();
            $(".mid-color-picker").colorpicker('option', 'value', "yellow");
            this._element.find('.mid-color-span').css('background-color', "yellow");

            $(".max-color-picker").colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('.max-color-span').css('background-color', "green");
                    } else {
                        self._element.find('.max-color-span').css('background-color', value.color);
                    }
                    self._colorOfColor23Changed();
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.max-color-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.max-color-frame').comboframe('close');
                }
            });
            this._element.find(".max-color-frame").comboframe();
            $(".max-color-picker").colorpicker('option', 'value', "green");
            this._element.find('.max-color-span').css('background-color', "green");

            var formatStyleSelector = this._element.find(".formatStyle");
            if (formatStyle) {
                switch (formatStyle) {
                    case 0 /* color2 */
                        :
                        formatStyleSelector.prop("selectedIndex", 0);
                        break;
                    case 1 /* color3 */
                        :
                        formatStyleSelector.prop("selectedIndex", 1);
                        break;
                    case 2 /* dataBar */
                        :
                        formatStyleSelector.prop("selectedIndex", 2);
                        break;
                    case 3 /* iconSets */
                        :
                        formatStyleSelector.prop("selectedIndex", 3);
                        break;
                }
            } else {
                formatStyleSelector.prop("selectedIndex", 0);
            }
            formatStyleSelector.trigger("change");

            var minSelector = this._element.find(".minSelector");
            minSelector.prop("selectedIndex", 0);
            minSelector.trigger("change");

            var maxSelector = this._element.find(".maxSelector");
            maxSelector.prop("selectedIndex", 0);
            maxSelector.trigger("change");

            var midSelector = this._element.find(".midSelector");
            midSelector.prop("selectedIndex", 3);
            midSelector.trigger("change");

            //Data Bar
            var showBarOnly = this._element.find(".showBarOnly");
            showBarOnly.prop("checked", false);

            var minSelector2 = this._element.find(".minSelector2");
            var orignalminSelector2 = minSelector2.prop("selectedIndex");
            minSelector2.prop("selectedIndex", 5);
            if (orignalminSelector2 !== minSelector2.prop("selectedIndex")) {
                minSelector2.trigger("change");
            }

            var maxSelector2 = this._element.find(".maxSelector2");
            var orignalmaxSelector2 = maxSelector2.prop("selectedIndex");
            maxSelector2.prop("selectedIndex", 5);
            if (orignalmaxSelector2 !== maxSelector2.prop("selectedIndex")) {
                maxSelector2.trigger("change");
            }

            $(".barcolor1-picker").colorpicker({
                valueChanged: function (e, value) {
                    var color;
                    if (value.color === undefined) {
                        color = "rgb(99,142,198)";
                    } else {
                        color = value.color;
                    }
                    self._element.find('.barcolor1-span').css('background-color', color);
                    self._dataBarAppChanged();
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.barcolor1-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.barcolor1-frame').comboframe('close');
                }
            });
            this._element.find(".barcolor1-frame").comboframe();
            $(".barcolor1-picker").colorpicker('option', 'value', "rgb(99,142,198)");
            this._element.find('.barcolor1-span').css('background-color', "rgb(99,142,198)");

            $(".barcolor2-picker").colorpicker({
                valueChanged: function (e, value) {
                    var color;
                    if (value.color === undefined) {
                        color = "black";
                    } else {
                        color = value.color;
                    }
                    self._element.find('.barcolor2-span').css('background-color', color);
                    self._dataBarAppChanged();
                },
                choosedColor: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.barcolor2-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.barcolor2-frame').comboframe('close');
                }
            });
            this._element.find(".barcolor2-frame").comboframe();
            $(".barcolor2-picker").colorpicker('option', 'value', "black");
            this._element.find('.barcolor2-span').css('background-color', "black");

            var fillSelector = this._element.find(".fillSelector");
            var orignalfillSelector = fillSelector.prop("selectedIndex");
            fillSelector.prop("selectedIndex", 0);
            if (orignalfillSelector !== fillSelector.prop("selectedIndex")) {
                fillSelector.trigger("change");
            }

            var borderSelector = this._element.find(".borderSelector");
            var orignalborderSelector = borderSelector.prop("selectedIndex");
            borderSelector.prop("selectedIndex", 0);
            if (orignalborderSelector !== borderSelector.prop("selectedIndex")) {
                borderSelector.trigger("change");
            }

            var barDirectionSelector = this._element.find(".barDirectionSelector");
            var orignalbarDirectionSelector = barDirectionSelector.prop("selectedIndex");
            barDirectionSelector.prop("selectedIndex", 0);
            if (orignalbarDirectionSelector !== barDirectionSelector.prop("selectedIndex")) {
                barDirectionSelector.trigger("change");
            }

            var negativeBtn = this._element.find(".negativeBtn");
            negativeBtn.button();
            negativeBtn.click(function () {
                var selectedIndex = borderSelector.prop("selectedIndex");
                if (!_this.negativeDialog) {
                    _this.negativeDialog = new NegativeValueandAxisDialog();
                }
                $(_this.negativeDialog).on('dialogClose', function (evt, data) {
                    if (data) {
                        self._negativeDialogData = data;
                    }
                    self.negativeDialog = null;
                });
                _this.negativeDialog.open(selectedIndex, _this._negativeDialogData);
            });

            this._dataBarAppChanged();

            //Icon Sets
            if (this._spaniconStyleImages === undefined) {
                this._spaniconStyleImages = [];
            }
            if (this._speratoriconStyleImages === undefined) {
                this._speratoriconStyleImages = [];
            }
            if (this._icons === undefined) {
                this._icons = [];
                this._isCustomIconSet = false;
            }
            var reverseIconOrder = this._element.find(".reverseIconOrder");
            if (reverseIconOrder.prop("checked") !== false) {
                reverseIconOrder.prop("checked", false);
                reverseIconOrder.trigger("change");
            }
            var showIconOnly = this._element.find(".showIconOnly");
            if (showIconOnly.prop("checked") !== false) {
                showIconOnly.prop("checked", false);
            }

            var icon1 = this._element.find(".iconStyleIcon1-span");
            var iconSetsPopup = $("#icon-sets-popup-dialog");
            var submenu = iconSetsPopup.find("ul");
            iconSetsPopup.gcuipopup({
                autoHide: true,
                position: { of: icon1, my: 'left top', at: 'right top' },
                collision: "fit fit",
                showing: function (e, args) {  /* NOSONAR: UnusedFunctionArgument */
                    submenu.removeClass("hidden");
                },
                hidden: function (e, args) {  /* NOSONAR: UnusedFunctionArgument */
                    self._element.find('.iconStyle-frame').comboframe('close');
                }
            });
            this._element.find(".iconStyle-frame").comboframe();

            this._element.find(".icon-frame").comboframe();
            var newImages = ["up-arrow-green", "right-arrow-yellow", "down-arrow-red"];
            this._iconNames = "3-arrows-icon-set";
            this._icons = [];
            for (var i = 0; i < 3; i++) {
                this._icons.push({
                    iconSetType: iconNameToIconSetType("3-arrows-icon-set"),
                    iconIndex: 2 - i
                });
            }
            this._formatOnValue_iconSets_updateIcons(newImages, newImages);
            this._formatOnValue_IconSets_switchVisible(3);


            var value1Selector = this._element.find(".value1Selector");
            if (value1Selector.prop("selectedIndex") !== 1) {
                value1Selector.prop("selectedIndex", 1);
                value1Selector.trigger("change");
            }

            var value2Selector = this._element.find(".value2Selector");
            if (value2Selector.prop("selectedIndex") !== 1) {
                value2Selector.prop("selectedIndex", 1);
                value2Selector.trigger("change");
            }

            var value3Selector = this._element.find(".value3Selector");
            if (value3Selector.prop("selectedIndex") !== 1) {
                value3Selector.prop("selectedIndex", 1);
                value3Selector.trigger("change");
            }

            var value4Selector = this._element.find(".value4Selector");
            if (value4Selector.prop("selectedIndex") !== 1) {
                value4Selector.prop("selectedIndex", 1);
                value4Selector.trigger("change");
            }

            self._formatOnValue_iconSets_updateValues("3-arrows-icon-set");

            var operator1 = this._element.find(".operator1");
            if (operator1.prop("selectedIndex") !== 0) {
                operator1.prop("selectedIndex", 0);
                operator1.trigger("change");
            }

            var operator2 = this._element.find(".operator2");
            if (operator2.prop("selectedIndex") !== 0) {
                operator2.prop("selectedIndex", 0);
                operator2.trigger("change");
            }

            var operator3 = this._element.find(".operator3");
            if (operator3.prop("selectedIndex") !== 0) {
                operator3.prop("selectedIndex", 0);
                operator3.trigger("change");
            }

            var operator4 = this._element.find(".operator4");
            if (operator4.prop("selectedIndex") !== 0) {
                operator4.prop("selectedIndex", 0);
                operator4.trigger("change");
            }
        };
        NewFormattingRuleDialog.prototype._dataBarAppChanged = function () {
            var color1 = this._element.find('.barcolor1-span').css('background-color');
            var color2 = this._element.find('.barcolor2-span').css('background-color');
            var fillSelector = this._element.find(".fillSelector").prop("selectedIndex");
            var borderSelector = this._element.find(".borderSelector").prop("selectedIndex");
            var barDirectionSelector = this._element.find(".barDirectionSelector").prop("selectedIndex");
            var previewContainer = this._element.find(".previewContainer-dataBar");
            var startColor = color1;
            var endColor;
            var borderColor;
            if (fillSelector === 1) {
                endColor = "white";
            }
            if (borderSelector === 1) {
                borderColor = color2;
            }
            if (barDirectionSelector === 1) {
                var color = startColor;
                startColor = endColor;
                endColor = color;
                previewContainer.attr("align", "right");
            } else {
                previewContainer.attr("align", "left");
            }
            this._formatRankedValue_previewDataBar(startColor, endColor, borderColor);
        };
        NewFormattingRuleDialog.prototype._isCustomIconSetIconStyle = function (isCustomIconSet) {
            if (isCustomIconSet) {
                $(".iconStyleIcon").hide();
                $(".iconStyle-frame .custom-iconset").remove();
                $(".iconStyle-frame .icon-button-container").append($("<span></span>").addClass("custom-iconset").text(designer.res.conditionalFormatting.newFormattingRule.formatOnValue.iconSets.customIconSet));
            } else {
                $(".iconStyleIcon").show();
                $(".iconStyle-frame .custom-iconset").remove();
            }
        };
        NewFormattingRuleDialog.prototype._formatOnValue_iconSets_updateValues = function (name, index) {
            this._iconNames = name;
            var index1 = this._element.find(".value1Selector").prop("selectedIndex");
            var index2 = this._element.find(".value2Selector").prop("selectedIndex");
            var index3 = this._element.find(".value3Selector").prop("selectedIndex");
            var index4 = this._element.find(".value4Selector").prop("selectedIndex");

            var inputValue1;
            var inputValue2;
            var inputValue3;
            var inputValue4;
            switch (name) {
                case "3-arrows-icon-set":
                case "3-arrows-gray-icon-set":
                case "3-triangles-icon-set":
                case "3-traffic-lights-unrimmed-icon-set":
                case "3-traffic-lights-rimmed-icon-set":
                case "3-signs-icon-set":
                case "3-symbols-circled-icon-set":
                case "3-symbols-uncircled-icon-set":
                case "3-flags-icon-set":
                case "3-stars-icon-set":
                    switch (index1) {
                        case 0:
                            inputValue1 = 0;
                            break;
                        case 1:
                        case 3:
                            inputValue1 = 67;
                            break;
                        case 2:
                            inputValue1 = "";
                            break;
                    }
                    switch (index2) {
                        case 0:
                            inputValue2 = 0;
                            break;
                        case 1:
                        case 3:
                            inputValue2 = 33;
                            break;
                        case 2:
                            inputValue2 = "";
                            break;
                    }
                    break;
                case "4-arrows-gray-icon-set":
                case "4-arrows-icon-set":
                case "4-traffic-lights-icon-set":
                case "red-to-black-icon-set":
                case "4-ratings-icon-set":
                    switch (index1) {
                        case 0:
                            inputValue1 = 0;
                            break;
                        case 1:
                        case 3:
                            inputValue1 = 75;
                            break;
                        case 2:
                            inputValue1 = "";
                            break;
                    }
                    switch (index2) {
                        case 0:
                            inputValue2 = 0;
                            break;
                        case 1:
                        case 3:
                            inputValue2 = 50;
                            break;
                        case 2:
                            inputValue2 = "";
                            break;
                    }
                    switch (index3) {
                        case 0:
                            inputValue3 = 0;
                            break;
                        case 1:
                        case 3:
                            inputValue3 = 25;
                            break;
                        case 2:
                            inputValue3 = "";
                            break;
                    }
                    break;
                case "5-arrows-gray-icon-set":
                case "5-arrows-icon-set":
                case "5-quarters-icon-set":
                case "5-ratings-icon-set":
                case "5-boxes-icon-set":
                    switch (index1) {
                        case 0:
                            inputValue1 = 0;
                            break;
                        case 1:
                        case 3:
                            inputValue1 = 80;
                            break;
                        case 2:
                            inputValue1 = "";
                            break;
                    }
                    switch (index2) {
                        case 0:
                            inputValue2 = 0;
                            break;
                        case 1:
                        case 3:
                            inputValue2 = 60;
                            break;
                        case 2:
                            inputValue2 = "";
                            break;
                    }
                    switch (index3) {
                        case 0:
                            inputValue3 = 0;
                            break;
                        case 1:
                        case 3:
                            inputValue3 = 40;
                            break;
                        case 2:
                            inputValue3 = "";
                            break;
                    }
                    switch (index4) {
                        case 0:
                            inputValue4 = 0;
                            break;
                        case 1:
                        case 3:
                            inputValue4 = 20;
                            break;
                        case 2:
                            inputValue4 = "";
                            break;
                    }
                    break;
            }

            var value1 = this._element.find(".value1");
            var value2 = this._element.find(".value2");
            var value3 = this._element.find(".value3");
            var value4 = this._element.find(".value4");
            if (index !== undefined) {
                switch (index) {
                    case 1:
                        value1.val(inputValue1);
                        break;
                    case 2:
                        value2.val(inputValue2);
                        break;
                    case 3:
                        value3.val(inputValue3);
                        break;
                    case 4:
                        value4.val(inputValue4);
                        break;
                }
            } else {
                value1.val(inputValue1);
                value2.val(inputValue2);
                value3.val(inputValue3);
                value4.val(inputValue4);
            }
            this._formatOnValue_iconSets_updatedesctiptions(value1.val(), value2.val(), value3.val(), value4.val());
        };
        NewFormattingRuleDialog.prototype._formatOnValue_iconSets_updatedesctiptions = function (value1, value2, value3, value4) {
            var row4 = this._element.find(".iconSet-dataRow4");
            var row5 = this._element.find(".iconSet-dataRow5");
            var isrow4Visible;
            if (row4.hasClass("hidden")) {
                isrow4Visible = false;
            } else {
                isrow4Visible = true;
            }
            var isrow5Visible;
            if (row5.hasClass("hidden")) {
                isrow5Visible = false;
            } else {
                isrow5Visible = true;
            }

            var des2_iconSet = this._element.find(".des2_iconSet");
            var des3_iconSet = this._element.find(".des3_iconSet");
            var des4_iconSet = this._element.find(".des4_iconSet");
            var des5_iconSet = this._element.find(".des5_iconSet");
            var operator1 = "";
            var operator1Index = this._element.find(".operator1").prop("selectedIndex");
            if (operator1Index === 1) {
                operator1 = " = ";
            }
            var operator2 = "";
            var operator2Index = this._element.find(".operator2").prop("selectedIndex");
            if (operator2Index === 1) {
                operator2 = " = ";
            }
            var operator3 = "";
            var operator3Index = this._element.find(".operator3").prop("selectedIndex");
            if (operator3Index === 1) {
                operator3 = " = ";
            }
            var operator4 = "";
            var operator4Index = this._element.find(".operator4").prop("selectedIndex");
            if (operator4Index === 1) {
                operator4 = " = ";
            }

            var index1 = this._element.find(".value1Selector").prop("selectedIndex");
            var index2 = this._element.find(".value2Selector").prop("selectedIndex");
            var index3 = this._element.find(".value3Selector").prop("selectedIndex");
            var index4 = this._element.find(".value4Selector").prop("selectedIndex");
            var connectText1 = (index1 === 2 || (value1 && value1.indexOf('=') === 0)) ? "Formula" : value1;
            var connectText2 = (index2 === 2 || (value2 && value2.indexOf('=') === 0)) ? "Formula" : value2;
            var connectText3 = (index3 === 2 || (value3 && value3.indexOf('=') === 0)) ? "Formula" : value3;
            var connectText4 = (index4 === 2 || (value4 && value4.indexOf('=') === 0)) ? "Formula" : value4;

            if (connectText1) {
                des2_iconSet.text(designer.res.conditionalFormatting.newFormattingRule.formatOnValue.iconSets.description2 + operator1 + connectText1 + " " + designer.res.conditionalFormatting.common.and);
            }
            if (connectText2) {
                if (isrow4Visible) {
                    des3_iconSet.text(designer.res.conditionalFormatting.newFormattingRule.formatOnValue.iconSets.description2 + operator2 + connectText2 + " " + designer.res.conditionalFormatting.common.and);
                } else {
                    des3_iconSet.text(designer.res.conditionalFormatting.newFormattingRule.formatOnValue.iconSets.description2 + operator2 + connectText2);
                }
            }
            if (isrow5Visible) {
                if (connectText3) {
                    des4_iconSet.text(designer.res.conditionalFormatting.newFormattingRule.formatOnValue.iconSets.description2 + operator3 + connectText3 + " " + designer.res.conditionalFormatting.common.and);
                }
                if (connectText4) {
                    des5_iconSet.text(designer.res.conditionalFormatting.newFormattingRule.formatOnValue.iconSets.description2 + operator4 + connectText4);
                }
            } else {
                if (connectText3) {
                    des4_iconSet.text(designer.res.conditionalFormatting.newFormattingRule.formatOnValue.iconSets.description2 + operator3 + connectText3);
                }
            }
        };
        NewFormattingRuleDialog.prototype._formatOnValue_iconSets_updateIcons = function (newspanImages, newsperatorImages) {
            var icon1 = this._element.find('.icon1');
            var icon2 = this._element.find('.icon2');
            var icon3 = this._element.find('.icon3');
            var icon4 = this._element.find('.icon4');
            var icon5 = this._element.find('.icon5');
            var spans = this._element.find('.iconStyleIcon');
            var icons = [icon1, icon2, icon3, icon4, icon5];
            var i;
            if (newspanImages) {
                spans.removeClass();
                spans.addClass("iconStyleIcon").addClass("horizontal-icon-set-item");
                for (i = 0; i < newspanImages.length; i++) {
                    $(spans[i]).addClass(newspanImages[i]).addClass('iconSetsIcons');
                }

                this._spaniconStyleImages = newspanImages;
            }
            if (newsperatorImages) {
                for (i = 0; i < this._speratoriconStyleImages.length; i++) {
                    icons[i].removeClass(this._speratoriconStyleImages[i]);
                }
                for (i = 0; i < newsperatorImages.length; i++) {
                    icons[i].addClass(newsperatorImages[i]);
                    if (i >= 3) {
                        icons[i].addClass('iconSetsIcons');
                    }
                    if (newsperatorImages[i] === "no-cell-icon") {
                        $(icons[i]).next("span").text(designer.res.conditionalFormatting.newFormattingRule.formatOnValue.iconSets.noCellIcon);
                    } else {
                        $(icons[i]).next("span").text("");
                    }
                }
                this._speratoriconStyleImages = newsperatorImages;
                for (i = newsperatorImages.length; i < 5; i++) {
                    switch (i) {
                        case 3:
                            icon4.removeClass('iconSetsIcons');
                            break;
                        case 4:
                            icon5.removeClass('iconSetsIcons');
                            break;
                    }
                }
            }
        };
        NewFormattingRuleDialog.prototype._formatOnValue_previewColor23 = function (color1, color2, color3) {
            var preview = this._element.find(".previewOfColor23");
            RuleFormatHelper._setLinearGradient(preview, color1, color2, color3);
        };
        NewFormattingRuleDialog.prototype._formatOnValue_switchVisible = function (index) {
            this._formatStyle = index;
            var color23 = this._element.find(".color23");
            var color3 = this._element.find(".color3");
            var dataBar = this._element.find(".dataBar");
            var iconSets = this._element.find(".iconSets");
            switch (index) {
                case 0:
                    color23.removeClass("hidden");
                    dataBar.addClass("hidden");
                    iconSets.addClass("hidden");
                    color3.addClass("hidden");
                    this._formatOnValue_previewColor23("red", "green");
                    break;
                case 1:
                    color23.removeClass("hidden");
                    dataBar.addClass("hidden");
                    iconSets.addClass("hidden");
                    color3.removeClass("hidden");
                    this._formatOnValue_previewColor23("red", "yellow", "green");
                    break;
                case 2:
                    color23.addClass("hidden");
                    dataBar.removeClass("hidden");
                    iconSets.addClass("hidden");
                    break;
                case 3:
                    color23.addClass("hidden");
                    dataBar.addClass("hidden");
                    iconSets.removeClass("hidden");
                    break;
            }
        };
        NewFormattingRuleDialog.prototype._formatOnValue_IconSets_switchVisible = function (index) {
            var row4 = this._element.find(".iconSet-dataRow4");
            var row5 = this._element.find(".iconSet-dataRow5");
            var row3_lastparts = this._element.find(".row3-mayHiddenParts");
            var row4_lastparts = this._element.find(".row4-mayHiddenParts");
            if (index <= 3) {
                row4.addClass("hidden");
                row5.addClass("hidden");
                row3_lastparts.addClass("hidden");
                row4_lastparts.addClass("hidden");
            } else if (index <= 4) {
                row4.removeClass("hidden");
                row5.addClass("hidden");
                row3_lastparts.removeClass("hidden");
                row4_lastparts.addClass("hidden");
            } else {
                row4.removeClass("hidden");
                row5.removeClass("hidden");
                row3_lastparts.removeClass("hidden");
                row4_lastparts.removeClass("hidden");
            }
        };
        NewFormattingRuleDialog.prototype._initformatContain = function (oper) {
            var ruleType = this._element.find(".formatContain-type");

            ruleType.prop("selectedIndex", 0);
            ruleType.trigger("change");

            var operator = this._element.find(".operator");
            if (oper) {
                operator.prop("selectedIndex", oper);
            } else {
                operator.prop("selectedIndex", 0);
            }
            operator.trigger("change");

            var cell1 = this._element.find(".textBox-cell1");
            cell1.val("");
            var cell2 = this._element.find(".textBox-cell2");
            cell2.val("");
        };
        NewFormattingRuleDialog.prototype._formatContain_switchOperator = function (index) {
            var operator = this._element.find(".operator");
            var options = operator[0].options;
            operator.empty();
            switch (index) {
                case 0:
                    options[0] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_cellValue.between);
                    options[1] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_cellValue.notBetween);
                    options[2] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_cellValue.equalTo);
                    options[3] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_cellValue.notEqualTo);
                    options[4] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_cellValue.greaterThan);
                    options[5] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_cellValue.lessThan);
                    options[6] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_cellValue.greaterThanOrEqu);
                    options[7] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_cellValue.lessThanOrEqu);
                    break;
                case 1:
                    options[0] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_specificText.containing);
                    options[1] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_specificText.notContaining);
                    options[2] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_specificText.beginningWith);
                    options[3] = new Option(designer.res.conditionalFormatting.newFormattingRule.formatContain.operator_specificText.endingWith);
                    break;
                case 2:
                    options[0] = new Option(designer.res.conditionalFormatting.dateOccurringFormat.date.yesterday);
                    options[1] = new Option(designer.res.conditionalFormatting.dateOccurringFormat.date.today);
                    options[2] = new Option(designer.res.conditionalFormatting.dateOccurringFormat.date.tomorrow);
                    options[3] = new Option(designer.res.conditionalFormatting.dateOccurringFormat.date.last7days);
                    options[4] = new Option(designer.res.conditionalFormatting.dateOccurringFormat.date.lastweek);
                    options[5] = new Option(designer.res.conditionalFormatting.dateOccurringFormat.date.thisweek);
                    options[6] = new Option(designer.res.conditionalFormatting.dateOccurringFormat.date.nextweek);
                    options[7] = new Option(designer.res.conditionalFormatting.dateOccurringFormat.date.lastmonth);
                    options[8] = new Option(designer.res.conditionalFormatting.dateOccurringFormat.date.thismonth);
                    options[9] = new Option(designer.res.conditionalFormatting.dateOccurringFormat.date.nextmonth);
                    break;
            }
        };
        NewFormattingRuleDialog.prototype._formatContain_switchVisible = function (index) {
            var operator = this._element.find(".operator");
            var cell1Container = this._element.find(".textBox-cell1-container");
            var labelAnd = this._element.find(".label-and");
            var cell2Container = this._element.find(".textBox-cell2-container");
            switch (index) {
                case 0:
                case 1:
                    operator.removeClass("hidden");
                    cell1Container.show();
                    labelAnd.addClass("hidden");
                    cell2Container.hide();
                    break;
                case 2:
                    operator.removeClass("hidden");
                    cell1Container.hide();
                    labelAnd.addClass("hidden");
                    cell2Container.hide();
                    break;
                case 3:
                case 4:
                case 5:
                case 6:
                    operator.addClass("hidden");
                    cell1Container.hide();
                    labelAnd.addClass("hidden");
                    cell2Container.hide();
                    break;
            }
        };
        NewFormattingRuleDialog.prototype._formatContain_switchVisible_CellValue = function (index) {
            var cell1Container = this._element.find(".textBox-cell1-container");
            var labelAnd = this._element.find(".label-and");
            var cell2Container = this._element.find(".textBox-cell2-container");

            switch (index) {
                case 0:
                case 1:
                    cell1Container.show();
                    labelAnd.removeClass("hidden");
                    cell2Container.show();
                    break;
                default:
                    cell1Container.show();
                    labelAnd.addClass("hidden");
                    cell2Container.hide();
                    break;
            }
        };
        NewFormattingRuleDialog.prototype._initformatRankedValue = function () {
            var rankedValueType = this._element.find(".formatRankedValue-type");
            rankedValueType.prop("selectedIndex", 0);

            var itemCounts = this._element.find(".itemCounts");
            itemCounts.spinner({
                min: 1,
                max: 1000
            });
            itemCounts.val(10);
        };
        NewFormattingRuleDialog.prototype._formatRankedValue_previewDataBar = function (startColor, endColor, borderColor) {
            var preview = this._element.find(".previewOfDatabar");
            if (endColor) {
                RuleFormatHelper._setLinearGradient(preview, startColor, endColor);
            } else {
                preview.css("background", startColor);
            }
            if (borderColor) {
                preview.css("border", "1px solid " + borderColor);
            } else {
                preview.css("border-width", "0px");
            }
        };
        NewFormattingRuleDialog.prototype._initformatAbove = function () {
            var type = this._element.find(".formatAbove-type");
            type.prop("selectedIndex", 0);
        };
        NewFormattingRuleDialog.prototype._initformatUnique = function () {
            var type = this._element.find(".formatUnique-type");
            type.prop("selectedIndex", 0);
        };
        NewFormattingRuleDialog.prototype._inituseFormula = function () {
            var input = this._element.find(".formula-input");
            input.val("");
        };
        NewFormattingRuleDialog.prototype._initPreview = function () {
            var _this = this;
            var formatBtn = this._element.find(".format-button");
            formatBtn.button();
            if (this.formatCellDialog === undefined) {
                this.formatCellDialog = new designer.FormatDialog();
                $(this.formatCellDialog).on('okClicked', function (evt, args) {
                    _this._style = args;
                    if (args.font !== "" && args.font !== undefined) {
                        var sheet = designer.wrapper.spread.getActiveSheet();
                        var col = sheet.getActiveColumnIndex();
                        var row = sheet.getActiveRowIndex();
                        var style = sheet.getActualStyle(row, col, 3 /* viewport */);

                        var fontElement = $("<span></span>");
                        if (style.font !== undefined) {
                            var fontStyle;
                            if (_this._style.font !== "") {
                                fontElement.css("font", _this._style.font);
                                fontStyle = fontElement.css("font-style");
                            }
                            fontElement.css("font", style.font);
                            if (fontStyle) {
                                fontElement.css("font-style", fontStyle);
                            }
                        } else if (args.font !== "") {
                            fontElement.css("font", args.font + designer.res.defaultFont);
                        }
                        _this._style.font = fontElement.css("font");
                    }
                    _this._drawPreviewControl();
                });
            }
            this._style = keyword_undefined;
            this._drawPreviewControl();
        };
        NewFormattingRuleDialog.prototype._drawPreviewControl = function () {
            var previewInnerSpan = this._element.find(".preview-common");
            RuleFormatHelper._drawPreviewControl(previewInnerSpan, this._style);
        };

        //formatOnValue
        NewFormattingRuleDialog.prototype._addRuleOfColorScale = function (isThreeColorScale) {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();

            var min;
            var minSelector = this._element.find(".minSelector");
            var selectedIndex = parseInt(minSelector.prop("selectedIndex"));
            switch (selectedIndex) {
                case 0:
                    min = 1 /* LowestValue */;
                    break;
                case 1:
                    min = 0 /* Number */;
                    break;
                case 2:
                    min = 3 /* Percent */;
                    break;
                case 3:
                    min = 6 /* Formula */;
                    break;
                case 4:
                    min = 4 /* Percentile */;
                    break;
            }

            var max;
            var maxSelector = this._element.find(".maxSelector");
            selectedIndex = parseInt(maxSelector.prop("selectedIndex"));
            switch (selectedIndex) {
                case 0:
                    max = 2 /* HighestValue */;
                    break;
                case 1:
                    max = 0 /* Number */;
                    break;
                case 2:
                    max = 3 /* Percent */;
                    break;
                case 3:
                    max = 6 /* Formula */;
                    break;
                case 4:
                    max = 4 /* Percentile */;
                    break;
            }

            var minValue = min === 1 ? null : this._element.find(".minValue").val();
            var maxValue = max === 2 ? null : this._element.find(".maxValue").val();
            var minColor = this._element.find('.min-color-span').css('background-color');
            var maxColor = this._element.find('.max-color-span').css('background-color');

            if (isThreeColorScale) {
                var mid;
                var midSelector = this._element.find(".midSelector");
                selectedIndex = parseInt(midSelector.prop("selectedIndex"));
                switch (selectedIndex) {
                    case 0:
                        mid = 0 /* Number */;
                        break;
                    case 1:
                        mid = 3 /* Percent */;
                        break;
                    case 2:
                        mid = 6 /* Formula */;
                        break;
                    case 3:
                        mid = 4 /* Percentile */;
                        break;
                }

                var midValue = this._element.find(".midValue").val();
                var midColor = this._element.find('.mid-color-span').css('background-color');
                var rule2 = new Sheets.ConditionalFormatting.ScaleRule(11 /* ThreeScaleRule */, min, minValue, minColor, mid, midValue, midColor, max, maxValue, maxColor, ranges);


                if (!this._notApplySetting) {
                    designer.actions.doAction("addRule", designer.wrapper.spread, rule2);
                } else {
                    this._rule = rule2;
                }
            } else {
                var rule1 = new Sheets.ConditionalFormatting.ScaleRule(10 /* TwoScaleRule */, min, minValue, minColor, null, null, null, max, maxValue, maxColor, ranges);

                if (!this._notApplySetting) {
                    designer.actions.doAction("addRule", designer.wrapper.spread, rule1);
                } else {
                    this._rule = rule1;
                }
            }
        };
        NewFormattingRuleDialog.prototype._addRuleOfDataBar = function () {
            designer.wrapper.spread.suspendPaint();
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();

            var minType;
            var minSelector2 = this._element.find(".minSelector2");
            var selectedIndex = parseInt(minSelector2.prop("selectedIndex"));
            switch (selectedIndex) {
                case 0:
                    minType = 1 /* LowestValue */;
                    break;
                case 1:
                    minType = 0 /* Number */;
                    break;
                case 2:
                    minType = 3 /* Percent */;
                    break;
                case 3:
                    minType = 6 /* Formula */;
                    break;
                case 4:
                    minType = 4 /* Percentile */;
                    break;
                case 5:
                    minType = 5 /* Automin */;
                    break;
            }

            var maxType;
            var maxSelector2 = this._element.find(".maxSelector2");
            selectedIndex = parseInt(maxSelector2.prop("selectedIndex"));
            switch (selectedIndex) {
                case 0:
                    maxType = 2 /* HighestValue */;
                    break;
                case 1:
                    maxType = 0 /* Number */;
                    break;
                case 2:
                    maxType = 3 /* Percent */;
                    break;
                case 3:
                    maxType = 6 /* Formula */;
                    break;
                case 4:
                    maxType = 4 /* Percentile */;
                    break;
                case 5:
                    maxType = 7 /* Automax */;
                    break;
            }

            var minValue2 = this._element.find(".minValue2").val();
            var maxValue2 = this._element.find(".maxValue2").val();

            var fillColor = this._element.find('.barcolor1-span').css('background-color');
            var borderColor = this._element.find('.barcolor2-span').css('background-color');
            var showBarOnly = this._element.find('.showBarOnly').prop("checked");

            var isGradient = (this._element.find(".fillSelector").prop("selectedIndex") === 0 ? false : true);
            var showBorder = (this._element.find(".borderSelector").prop("selectedIndex") === 0 ? false : true);
            var barDirection = (this._element.find(".barDirectionSelector").prop("selectedIndex") === 0 ? 0 /* LeftToRight */ : 1 /* RightToLeft */);

            var rule;
            rule = new GC.Spread.Sheets.ConditionalFormatting.DataBarRule(minType, RuleFormatHelper.parseValue(minValue2), maxType, RuleFormatHelper.parseValue(maxValue2), fillColor, ranges);
            rule.showBarOnly(showBarOnly);
            rule.gradient(isGradient);
            rule.borderColor(borderColor);
            rule.showBorder(showBorder);
            rule.dataBarDirection(barDirection);

            if (this._negativeDialogData) {
                rule.negativeBorderColor(this._negativeDialogData.negativeBorderColor);
                rule.negativeFillColor(this._negativeDialogData.negativeFillColor);
                rule.useNegativeBorderColor(this._negativeDialogData.useNegativeBorderColor);
                rule.useNegativeFillColor(this._negativeDialogData.useNegativeFillColor);
                rule.axisColor(this._negativeDialogData.axisColor);
                rule.axisPosition(this._negativeDialogData.axisPosition);
            }

            if (!this._notApplySetting) {
                designer.actions.doAction("addRule", designer.wrapper.spread, rule);
            } else {
                this._rule = rule;
            }
            designer.wrapper.spread.resumePaint();
        };
        NewFormattingRuleDialog.prototype._addRuleOfIconSets = function () {
            designer.wrapper.spread.suspendPaint();
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var rule;

            var iconSetType = iconNameToIconSetType(this._iconNames);

            var showIconOnly = this._element.find(".showIconOnly").prop("checked");
            var reverseIconOrder = this._element.find(".reverseIconOrder").prop("checked");

            var islargerOrEqu1 = (this._element.find(".operator1").prop("selectedIndex") === 0 ? true : false);
            var islargerOrEqu2 = (this._element.find(".operator2").prop("selectedIndex") === 0 ? true : false);
            var islargerOrEqu3 = (this._element.find(".operator3").prop("selectedIndex") === 0 ? true : false);
            var islargerOrEqu4 = (this._element.find(".operator4").prop("selectedIndex") === 0 ? true : false);
            var valueType1_index = parseInt(this._element.find(".value1Selector").prop("selectedIndex"));
            var valueType1 = this._getIconValueTypeofIndex(valueType1_index);

            var valueType2_index = parseInt(this._element.find(".value2Selector").prop("selectedIndex"));
            var valueType2 = this._getIconValueTypeofIndex(valueType2_index);

            var valueType3_index = parseInt(this._element.find(".value3Selector").prop("selectedIndex"));
            var valueType3 = this._getIconValueTypeofIndex(valueType3_index);

            var valueType4_index = parseInt(this._element.find(".value4Selector").prop("selectedIndex"));
            var valueType4 = this._getIconValueTypeofIndex(valueType4_index);

            var value1 = this._element.find(".value1").val();
            var value2 = this._element.find(".value2").val();
            var value3 = this._element.find(".value3").val();
            var value4 = this._element.find(".value4").val();
            var row4 = this._element.find(".iconSet-dataRow4");
            var row5 = this._element.find(".iconSet-dataRow5");

            rule = new Sheets.ConditionalFormatting.IconSetRule(iconSetType, ranges);
            rule.showIconOnly(showIconOnly);
            rule.reverseIconOrder(reverseIconOrder);
            var iconCriteria = rule.iconCriteria();
            if (!row5.hasClass("hidden") && !row4.hasClass("hidden")) {
                if (valueType4 !== 7 /* Formula */) {
                    iconCriteria[0] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu4, valueType4, RuleFormatHelper.parseValue(value4));
                } else {
                    iconCriteria[0] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu4, valueType4, value4);
                }
                if (valueType3 !== 7 /* Formula */) {
                    iconCriteria[1] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu3, valueType3, RuleFormatHelper.parseValue(value3));
                } else {
                    iconCriteria[1] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu3, valueType3, value3);
                }
                if (valueType2 !== 7 /* Formula */) {
                    iconCriteria[2] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu2, valueType2, RuleFormatHelper.parseValue(value2));
                } else {
                    iconCriteria[2] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu2, valueType2, value2);
                }
                if (valueType1 !== 7 /* Formula */) {
                    iconCriteria[3] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu1, valueType1, RuleFormatHelper.parseValue(value1));
                } else {
                    iconCriteria[3] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu1, valueType1, value1);
                }
            } else if (!row4.hasClass("hidden")) {
                if (valueType3 !== 7 /* Formula */) {
                    iconCriteria[0] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu3, valueType3, RuleFormatHelper.parseValue(value3));
                } else {
                    iconCriteria[0] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu3, valueType3, value3);
                }
                if (valueType2 !== 7 /* Formula */) {
                    iconCriteria[1] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu2, valueType2, RuleFormatHelper.parseValue(value2));
                } else {
                    iconCriteria[1] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu2, valueType2, value2);
                }
                if (valueType1 !== 7 /* Formula */) {
                    iconCriteria[2] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu1, valueType1, RuleFormatHelper.parseValue(value1));
                } else {
                    iconCriteria[2] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu1, valueType1, value1);
                }
            } else {
                if (valueType2 !== 7 /* Formula */) {
                    iconCriteria[0] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu2, valueType2, RuleFormatHelper.parseValue(value2));
                } else {
                    iconCriteria[0] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu2, valueType2, value2);
                }
                if (valueType1 !== 7 /* Formula */) {
                    iconCriteria[1] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu1, valueType1, RuleFormatHelper.parseValue(value1));
                } else {
                    iconCriteria[1] = new Sheets.ConditionalFormatting.IconCriterion(islargerOrEqu1, valueType1, value1);
                }
            }

            if (this._isCustomIconSet && this._icons && this._icons.length > 0) {
                rule._isCustomIconSet = true;
                var icons = rule.icons();
                if (!reverseIconOrder) {
                    this._icons.reverse();
                }
                for (var i = 0; i < this._icons.length; i++) {
                    icons[i] = { iconSetType: this._icons[i].iconSetType, iconIndex: this._icons[i].iconIndex };
                }
            }
            if (!this._notApplySetting) {
                designer.actions.doAction("addRule", designer.wrapper.spread, rule);
            } else {
                this._rule = rule;
            }
            designer.wrapper.spread.resumePaint();
        };

        //formatContain
        NewFormattingRuleDialog.prototype._addRuleOfCellValue = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var rule;

            var operator = this._element.find(".operator");
            var selectedIndex = parseInt(operator.prop("selectedIndex"));
            var comparisonOperator;
            switch (selectedIndex) {
                case 0:
                    comparisonOperator = 6 /* Between */;
                    break;
                case 1:
                    comparisonOperator = 7 /* NotBetween */;
                    break;
                case 2:
                    comparisonOperator = 0 /* EqualsTo */;
                    break;
                case 3:
                    comparisonOperator = 1 /* NotEqualsTo */;
                    break;
                case 4:
                    comparisonOperator = 2 /* GreaterThan */;
                    break;
                case 5:
                    comparisonOperator = 4 /* LessThan */;
                    break;
                case 6:
                    comparisonOperator = 3 /* GreaterThanOrEqualsTo */;
                    break;
                case 7:
                    comparisonOperator = 5 /* LessThanOrEqualsTo */;
                    break;
            }

            var value1 = this._getOneValueOrReference(this._element, 1);
            var value2 = this._getOneValueOrReference(this._element, 2);

            rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(1 /* CellValueRule */, ranges, this._style, comparisonOperator, value1, value2);

            if (!this._notApplySetting) {
                designer.actions.doAction("addRule", designer.wrapper.spread, rule);
            } else {
                this._rule = rule;
            }
        };
        NewFormattingRuleDialog.prototype._addRuleOfText = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var rule;

            var operator = this._element.find(".operator");
            var selectedIndex = parseInt(operator.prop("selectedIndex"));
            var textComparisonOperator;
            switch (selectedIndex) {
                case 0:
                    textComparisonOperator = 0 /* Contains */;
                    break;
                case 1:
                    textComparisonOperator = 1 /* DoesNotContain */;
                    break;
                case 2:
                    textComparisonOperator = 2 /* BeginsWith */;
                    break;
                case 3:
                    textComparisonOperator = 3 /* EndsWith */;
                    break;
            }

            var value1 = this._getOneValueOrReference(this._element, 1);

            rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(2 /* SpecificTextRule */, ranges, this._style, textComparisonOperator, null, null, value1);

            if (!this._notApplySetting) {
                designer.actions.doAction("addRule", designer.wrapper.spread, rule);
            } else {
                this._rule = rule;
            }
        };
        NewFormattingRuleDialog.prototype._addRuleOfDatesOccuring = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();

            var selectedIndex = parseInt(this._element.find(".operator").prop("selectedIndex"));
            var dateOccurringType;
            switch (selectedIndex) {
                case 0:
                    dateOccurringType = 1 /* Yesterday */;
                    break;
                case 1:
                    dateOccurringType = 0 /* Today */;
                    break;
                case 2:
                    dateOccurringType = 2 /* Tomorrow */;
                    break;
                case 3:
                    dateOccurringType = 3 /* Last7Days */;
                    break;
                case 4:
                    dateOccurringType = 8 /* LastWeek */;
                    break;
                case 5:
                    dateOccurringType = 7 /* ThisWeek */;
                    break;
                case 6:
                    dateOccurringType = 9 /* NextWeek */;
                    break;
                case 7:
                    dateOccurringType = 5 /* LastMonth */;
                    break;
                case 8:
                    dateOccurringType = 4 /* ThisMonth */;
                    break;
                case 9:
                    dateOccurringType = 6 /* NextMonth */;
                    break;
            }
            var rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(4 /* DateOccurringRule */, ranges, this._style, null, null, null, null, null, dateOccurringType);

            if (!this._notApplySetting) {
                designer.actions.doAction("addRule", designer.wrapper.spread, rule);
            } else {
                this._rule = rule;
            }
        };
        NewFormattingRuleDialog.prototype._addRuleOfFormulaRule = function (index) {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            if (ranges.length > 1) {
                MessageBox.show(designer.res.conditionalFormatting.exceptions.e6, designer.res.title, 2 /* warning */);
            }
            var range = ranges[0];
            var formula = Sheets.CalcEngine.rangeToFormula(range, 0, 0, Sheets.CalcEngine.RangeReferenceRelative.allAbsolute);

            var formulaString;
            switch (index) {
                case 3:
                    formulaString = "ISBLANK(" + formula + ")";
                    break;
                case 4:
                    formulaString = "NOT(ISBLANK(" + formula + "))";
                    break;
                case 5:
                    formulaString = "ISERROR(" + formula + ")";
                    break;
                case 6:
                    formulaString = "NOT(ISERROR(" + formula + "))";
                    break;
            }

            var rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(3 /* FormulaRule */, ranges, this._style, null, null, null, null, "=" + formulaString);

            if (!this._notApplySetting) {
                designer.actions.doAction("addRule", designer.wrapper.spread, rule);
            } else {
                this._rule = rule;
            }
        };

        //formatRankedValue
        NewFormattingRuleDialog.prototype._addRuleOfformatRankedValue = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();

            var type = (this._element.find(".formatRankedValue-type").prop("selectedIndex") === 0 ? 0 /* Top */ : 1 /* Bottom */);
            var rank = this._element.find(".itemCounts").val();
            var rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(5 /* Top10Rule */, ranges, this._style, null, null, null, null, null, type, rank);

            if (!this._notApplySetting) {
                designer.actions.doAction("addRule", designer.wrapper.spread, rule);
            } else {
                this._rule = rule;
            }
        };

        //formatAbove
        NewFormattingRuleDialog.prototype._addRuleOfformatAbove = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();

            var rule;
            var selectedIndex = parseInt(this._element.find(".formatAbove-type").prop("selectedIndex"));
            var type;
            switch (selectedIndex) {
                case 0:
                    type = 0 /* Above */;
                    break;
                case 1:
                    type = 1 /* Below */;
                    break;
                case 2:
                    type = 2 /* EqualOrAbove */;
                    break;
                case 3:
                    type = 3 /* EqualOrBelow */;
                    break;
                case 4:
                    type = 4 /* Above1StdDev */;
                    break;
                case 5:
                    type = 5 /* Below1StdDev */;
                    break;
                case 6:
                    type = 6 /* Above2StdDev */;
                    break;
                case 7:
                    type = 7 /* Below2StdDev */;
                    break;
                case 8:
                    type = 8 /* Above3StdDev */;
                    break;
                case 9:
                    type = 9 /* Below3StdDev */;
                    break;
            }
            rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(8 /* AverageRule */, ranges, this._style, null, null, null, null, null, type);

            if (!this._notApplySetting) {
                designer.actions.doAction("addRule", designer.wrapper.spread, rule);
            } else {
                this._rule = rule;
            }
        };

        //formatUnique
        NewFormattingRuleDialog.prototype._addRuleOfformatUnique = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();

            var selectedIndex = parseInt(this._element.find(".formatUnique-type").prop("selectedIndex"));
            var rule;
            switch (selectedIndex) {
                case 0:
                    rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(7 /* DuplicateRule */, ranges, this._style);

                    break;
                case 1:
                    rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(6 /* DuplicateRule */, ranges, this._style);

                    break;
            }
            if (!this._notApplySetting) {
                designer.actions.doAction("addRule", designer.wrapper.spread, rule);
            } else {
                this._rule = rule;
            }
        };

        //useFormula
        NewFormattingRuleDialog.prototype._addRuleOfuseFormula = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var ranges = sheet.getSelections();
            var formula = this._element.find(".formula-input").val();
            formula = this._adjustFormula(formula);
            var rule = new GC.Spread.Sheets.ConditionalFormatting.NormalConditionRule(3 /* FormulaRule */, ranges, this._style, null, null, null, null, formula);

            if (!this._notApplySetting) {
                designer.actions.doAction("addRule", designer.wrapper.spread, rule);
            } else {
                this._rule = rule;
            }
        };

        NewFormattingRuleDialog.prototype._evaluateFormula = function (formula) {
            var sheet = designer.wrapper.spread.getActiveSheet();
            return GC.Spread.Sheets.CalcEngine.evaluateFormula(sheet, formula, sheet.getActiveRowIndex(), sheet.getActiveColumnIndex(), false);
        };
        return NewFormattingRuleDialog;
    })(designer.BaseDialog);
    designer.NewFormattingRuleDialog = NewFormattingRuleDialog;

    var FormatRulesManagerDialog = (function (_super) {
        designer.extends(FormatRulesManagerDialog, _super);
        function FormatRulesManagerDialog() {
            _super.call(this, (dialogHtmlPath), '.format-rules-manager-dialog');
        }

        FormatRulesManagerDialog.prototype._initOptions = function () {
            var self = this;
            return {
                title: designer.res.formattingRulesManagerDialog.title,
                width: 'auto',
                resizable: false,
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            designer.actions.isFileModified = true;
                            self._applyRules();
                            designer.wrapper.spread.suspendPaint();
                            self.close();
                        }
                    },
                    {
                        text: designer.res.close,
                        click: function () {
                            self.close();
                        }
                    },
                    {
                        text: designer.res.apply,
                        click: function () {
                            self._applyRules();
                            designer.wrapper.spread.suspendPaint();
                        }
                    }
                ]
            };
        };

        FormatRulesManagerDialog.prototype._applyRules = function () {
            if (this._tempFormats === undefined) {
                return;
            }
            var sheet = designer.wrapper.spread.getActiveSheet();
            var formats = sheet.conditionalFormats;

            try {
                var options = {
                    formats: formats,
                    tempFormats: $.extend(true, {}, this._tempFormats)
                };
                designer.actions.doAction('baseDialogCommand', designer.wrapper.spread, {
                    value: options,
                    execute: designer.spreadActions.dialogAction.managerRulesApplySetting
                });
            } catch (e) {
                designer.wrapper.spread.resumePaint();
                throw e;
            }
            designer.wrapper.spread.resumePaint();
        };

        FormatRulesManagerDialog.prototype._afterClose = function () {
            var formats = designer.wrapper.spread.getActiveSheet().conditionalFormats;
            var tmpRules = formats.getRules().concat();
            formats.clearRule();
            for (var i = 0; i < tmpRules.length; i++) {
                formats.addRule(tmpRules[i]);
            }
            designer.wrapper.spread.resumePaint();

        };

        FormatRulesManagerDialog.prototype._addEventListner = function () {
            var _this = this;
            $("#new-rule").on('click', function () {
                _this._newFormatRule();
                _this.close();
            });
            $("#edit-rule").on('click', function () {
                if ($(".format-rules-grid-body .ui-state-default").length === 0) {
                    return;
                }
                _this._editFormatRule();
                _this.close();
            });

            $("#delete-rule").on('click', function () {
                return _this._deleteFormatRule();
            });

            $("#format-rule-move-up").on('click', function () {
                return _this._sortFormatRules(true);
            });
            $("#format-rule-move-down").on('click', function () {
                return _this._sortFormatRules(false);
            });
        };

        FormatRulesManagerDialog.prototype._newFormatRule = function () {
            var self = this;
            if (!self._newRuleDialog) {
                self._newRuleDialog = new NewFormattingRuleDialog();
                $(self._newRuleDialog).on("dialogClose", function (e, args) {
                    if (args.isCloseByOK) {
                        self._tempFormats.addRule(args.rule);
                    }
                    self._newRuleDialog = null;
                    self.open(true);
                });
            }
            self._newRuleDialog.open(0 /* formatOnValue */, true, 0 /* color2 */, true);
        };

        FormatRulesManagerDialog.prototype._editFormatRule = function () {
            if (this._tempFormats === undefined || this._tempFormats.count() === 0) {
                return;
            }
            var index = $(".format-rules-grid-body .ui-state-default").index();
            var indexInFormats = this._tempFormats.count() - 1 - index;
            var selectedRule = this._tempFormats.getRule(indexInFormats);

            var ruleType, formatStyle;
            if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.cellValueRule) {
                ruleType = 1 /* formatContain */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.specificTextRule) {
                ruleType = 1 /* formatContain */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.dateOccurringRule) {
                ruleType = 1 /* formatContain */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.duplicateRule) {
                ruleType = 4 /* formatUnique */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.uniqueRule) {
                ruleType = 4 /* formatUnique */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.top10Rule) {
                ruleType = 2 /* formatRankedValue */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.averageRule) {
                ruleType = 3 /* formatAbove */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.dataBarRule) {
                ruleType = 0 /* formatOnValue */;
                formatStyle = 2 /* dataBar */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.twoScaleRule) {
                ruleType = 0 /* formatOnValue */;
                formatStyle = 0 /* color2 */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.threeScaleRule) {
                ruleType = 0 /* formatOnValue */;
                formatStyle = 1 /* color3 */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.iconSetRule) {
                ruleType = 0 /* formatOnValue */;
                formatStyle = 3 /* iconSets */;
            } else if (selectedRule.ruleType() === Sheets.ConditionalFormatting.RuleType.formulaRule) {
                ruleType = RuleFormatHelper._getformulaRuleType(selectedRule).ruleType;
            }

            var self = this;
            if (!self._editRuleDialog) {
                self._editRuleDialog = new NewFormattingRuleDialog();
                $(self._editRuleDialog).on("dialogClose", function (e, args) {
                    if (args.isCloseByOK) {
                        var position = self._tempFormats.getRules().indexOf(selectedRule);
                        self._tempFormats.getRules()[position] = args.rule;
                    }
                    self._editRuleDialog = null;
                    self.open(true);
                });
            }
            self._editRuleDialog.open(ruleType, false, formatStyle, true, selectedRule);
        };

        FormatRulesManagerDialog.prototype._deleteFormatRule = function () {
            if (this._tempFormats === undefined || this._tempFormats.count() === 0) {
                return;
            }
            var index = $(".format-rules-grid-body .ui-state-default").index();
            if (index === -1) {
                return;
            }
            var indexInFormats = this._tempFormats.count() - 1 - index;
            this._tempFormats.removeRule(this._tempFormats.getRule(indexInFormats));
            this._updateFormatsGrid();
        };

        FormatRulesManagerDialog.prototype._sortFormatRules = function (isUp) {
            var index = $(".format-rules-grid-body .ui-state-default").index();
            if (index === 0 && isUp || index === this._tempFormats.count() - 1 && !isUp) {
                return;
            }

            var tempSortFormats = $.extend(true, {}, this._tempFormats);
            this._tempFormats.clearRule();
            var indexInFormats = tempSortFormats.count() - 1 - index;
            var i;
            if (isUp) {
                for (i = 0; i < tempSortFormats.count(); i++) {
                    if (i === indexInFormats) {
                        this._tempFormats.addRule(tempSortFormats.getRule(indexInFormats + 1));
                    } else if (i === indexInFormats + 1) {
                        this._tempFormats.addRule(tempSortFormats.getRule(indexInFormats));
                    } else {
                        this._tempFormats.addRule(tempSortFormats.getRule(i));
                    }
                }
            } else {
                for (i = 0; i < tempSortFormats.count(); i++) {
                    if (i === indexInFormats) {
                        this._tempFormats.addRule(tempSortFormats.getRule(indexInFormats - 1));
                    } else if (i === indexInFormats - 1) {
                        this._tempFormats.addRule(tempSortFormats.getRule(indexInFormats));
                    } else {
                        this._tempFormats.addRule(tempSortFormats.getRule(i));
                    }
                }
            }

            this._updateFormatsGrid();

            if (isUp) {
                $(".format-rules-grid-body tr:eq(" + (index - 1) + ")").addClass("ui-state-default");
            } else {
                $(".format-rules-grid-body tr:eq(" + (index + 1) + ")").addClass("ui-state-default");
            }
        };

        FormatRulesManagerDialog.prototype._init = function () {
            this._addEventListner();
        };

        FormatRulesManagerDialog.prototype._beforeOpen = function (args) {
            var isFromSubDialog = args[0];
            designer.wrapper.spread.suspendPaint();
            var sheet = designer.wrapper.spread.getActiveSheet();
            var orignalFormats = sheet.conditionalFormats;
            if (!isFromSubDialog) {
                this._tempFormats = new GC.Spread.Sheets.ConditionalFormatting.ConditionalFormats(sheet);
                this._tempFormats.fromJSON(orignalFormats.toJSON());
                var orignalRules = orignalFormats.getRules();
                var tempRules = this._tempFormats.getRules();
                for (var i = 0; i < orignalRules.length; i++) {
                    tempRules[i]._isCustomIconSet = orignalRules[i]._isCustomIconSet;
                }
            }
            this._updateFormatsGrid();
        };

        FormatRulesManagerDialog.prototype._stringToRange = function (s) {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var expr = GC.Spread.Sheets.CalcEngine.formulaToExpression(sheet, s, 0, 0);
            if (expr.type === GC.Spread.CalcEngine.ExpressionType.reference) {
                return expr.getRange(0, 0);
            }
            return null;
        };


        FormatRulesManagerDialog.prototype._addEventListnerForEachRow = function (row, rule) {
            var _this = this;
            row.on('click', function (e) {  /* NOSONAR: UnusedFunctionArgument */
                $('.format-rules-grid-body tr').removeClass('ui-state-default');
                row.addClass('ui-state-default');
            });

            row.on('dblclick', function (e) {  /* NOSONAR: UnusedFunctionArgument */
                _this._editFormatRule();
                _this.close();
            });
            var updateRange = function (e) {
                var input = e.currentTarget;
                var inputValue = input.value;

                var rangeStrings = inputValue.slice(1).split(',');

                for (var i = 0; i < rule.ranges().length; i++) {
                    rule.ranges().pop();
                }

                for (i = 0; i < rangeStrings.length; i++) {
                    var range = _this._stringToRange(rangeStrings[i]);
                    rule.ranges().unshift(new Sheets.Range(range.row, range.col, range.rowCount, range.colCount));
                }
            };

            var updateStopIfTrue = function (e) {
                var checkbox = e.currentTarget;
                rule.stopIfTrue(checkbox.checked);
            };

            row.find("input[type!=checkbox]").on('change', function (e) {
                return updateRange(e);
            });
            row.find("input[type=checkbox]").on('change', function (e) {
                return updateStopIfTrue(e);
            });
        };

        FormatRulesManagerDialog.prototype._updateFormatsGrid = function () {
            $('.format-rules-grid-body').empty();

            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var activeRow = activeSheet.getActiveRowIndex();
            var activeColumn = activeSheet.getActiveColumnIndex();
            var rules = this._tempFormats.getRules();
            var description;
            for (var i = rules.length - 1; i >= 0; i--) {
                var row = $('<tr>'), colRule = $('<td>'), colFormat = $('<td>'), preview = $('<div>'),
                    colAppliesTo = $('<td>'), inputRange = $('<input>'), colStopIfTrue = $('<td>'), ckStop = $('<input>');

                ckStop.prop('type', 'checkbox');

                var rd = designer.res.formattingRulesManagerDialog.ruleDescriptions;
                if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.cellValueRule) {
                    var value1 = rules[i].value1(activeRow, activeColumn),
                        value2 = rules[i].value2(activeRow, activeColumn);
                    switch (rules[i].operator()) {
                        case 6 /* Between */
                            :
                            description = designer.util.format(rd.valueBetween, value1, value2);
                            break;
                        case 0 /* EqualsTo */
                            :
                            description = designer.util.format(rd.valueEquals, value1);
                            break;
                        case 2 /* GreaterThan */
                            :
                            description = designer.util.format(rd.valueGreateThan, value1);
                            break;
                        case 3 /* GreaterThanOrEqualsTo */
                            :
                            description = designer.util.format(rd.valueGreateThanOrEquals, value1);
                            break;
                        case 4 /* LessThan */
                            :
                            description = designer.util.format(rd.valueLessThan, value1);
                            break;
                        case 5 /* LessThanOrEqualsTo */
                            :
                            description = designer.util.format(rd.valueLessThanOrEquals, value1);
                            break;
                        case 7 /* NotBetween */
                            :
                            description = designer.util.format(rd.valueNotBetween, value1, value2);
                            break;
                        case 1 /* NotEqualsTo */
                            :
                            description = designer.util.format(rd.valueNotEquals, value1);
                            break;
                    }
                    colRule.text(description);
                    preview.text(designer.res.formattingRulesManagerDialog.previewText);
                    RuleFormatHelper._drawPreviewControl(preview, rules[i].style());
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.specificTextRule) {
                    switch (rules[i].operator()) {
                        case 2 /* BeginsWith */
                            :
                            description = designer.util.format(rd.valueBeginsWith, rules[i].text());
                            break;
                        case 0 /* Contains */
                            :
                            description = designer.util.format(rd.valueContains, rules[i].text());
                            break;
                        case 1 /* DoesNotContain */
                            :
                            description = designer.util.format(rd.valueNotContains, rules[i].text());
                            break;
                        case 3 /* EndsWith */
                            :
                            description = designer.util.format(rd.valueEndsWith, rules[i].text());
                            break;
                    }
                    colRule.text(description);
                    preview.text(designer.res.formattingRulesManagerDialog.previewText);
                    RuleFormatHelper._drawPreviewControl(preview, rules[i].style());
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.dateOccurringRule) {
                    switch (rules[i].type()) {
                        case 3 /* Last7Days */
                            :
                            description = rd.last7Days;
                            break;
                        case 5 /* LastMonth */
                            :
                            description = rd.lastMonth;
                            break;
                        case 8 /* LastWeek */
                            :
                            description = rd.lastWeek;
                            break;
                        case 6 /* NextMonth */
                            :
                            description = rd.nextMonth;
                            break;
                        case 9 /* NextWeek */
                            :
                            description = rd.nextWeek;
                            break;
                        case 4 /* ThisMonth */
                            :
                            description = rd.thisMonth;
                            break;
                        case 7 /* ThisWeek */
                            :
                            description = rd.thisWeek;
                            break;
                        case 0 /* Today */
                            :
                            description = rd.today;
                            break;
                        case 2 /* Tomorrow */
                            :
                            description = rd.tomorrow;
                            break;
                        case 1 /* Yesterday */
                            :
                            description = rd.yesterday;
                            break;
                    }
                    colRule.text(description);
                    preview.text(designer.res.formattingRulesManagerDialog.previewText);
                    RuleFormatHelper._drawPreviewControl(preview, rules[i].style());
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.duplicateRule) {
                    colRule.text(rd.duplicateValues);
                    preview.text(designer.res.formattingRulesManagerDialog.previewText);
                    RuleFormatHelper._drawPreviewControl(preview, rules[i].style());
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.uniqueRule) {
                    colRule.text(rd.uniqueValues);
                    preview.text(designer.res.formattingRulesManagerDialog.previewText);
                    RuleFormatHelper._drawPreviewControl(preview, rules[i].style());
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.top10Rule) {
                    switch (rules[i].type()) {
                        case 0 /* Top */
                            :
                            description = designer.util.format(rd.top, rules[i].rank());
                            break;
                        case 1 /* Bottom */
                            :
                            description = designer.util.format(rd.bottom, rules[i].rank());
                            break;
                    }
                    colRule.text(description);
                    preview.text(designer.res.formattingRulesManagerDialog.previewText);
                    RuleFormatHelper._drawPreviewControl(preview, rules[i].style());
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.averageRule) {
                    switch (rules[i].type()) {
                        case 0 /* Above */
                            :
                            description = rd.above;
                            break;
                        case 4 /* Above1StdDev */
                            :
                            description = rd.above1StdDev;
                            break;
                        case 6 /* Above2StdDev */
                            :
                            description = rd.above2StdDev;
                            break;
                        case 8 /* Above3StdDev */
                            :
                            description = rd.above3StdDev;
                            break;
                        case 1 /* Below */
                            :
                            description = rd.below;
                            break;
                        case 5 /* Below1StdDev */
                            :
                            description = rd.below1StdDev;
                            break;
                        case 7 /* Below2StdDev */
                            :
                            description = rd.below2StdDev;
                            break;
                        case 9 /* Below3StdDev */
                            :
                            description = rd.below3StdDev;
                            break;
                        case 2 /* EqualOrAbove */
                            :
                            description = rd.equalOrAbove;
                            break;
                        case 3 /* EqualOrBelow */
                            :
                            description = rd.equalOrBelow;
                            break;
                    }
                    colRule.text(description);
                    preview.text(designer.res.formattingRulesManagerDialog.previewText);
                    RuleFormatHelper._drawPreviewControl(preview, rules[i].style());
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.dataBarRule) {
                    colRule.text(rd.dataBar);
                    if (rules[i].showBorder()) {
                        preview.css("border", "1px solid " + rules[i].borderColor());
                    }
                    if (rules[i].gradient()) {
                        RuleFormatHelper._setLinearGradient(preview, rules[i].color(), "white");
                    } else {
                        preview.css("background-color", rules[i].color());
                    }
                    ckStop.prop('disabled', 'disabled');
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.twoScaleRule) {
                    colRule.text(rd.twoScale);
                    RuleFormatHelper._setLinearGradient(preview, rules[i].minColor(), rules[i].maxColor());
                    ckStop.prop('disabled', 'disabled');
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.threeScaleRule) {
                    colRule.text(rd.threeScale);
                    RuleFormatHelper._setLinearGradient(preview, rules[i].minColor(), rules[i].midColor(), rules[i].maxColor());
                    ckStop.prop('disabled', 'disabled');
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.iconSetRule) {
                    colRule.text(rd.iconSet);
                    if (rules[i].icons()) {
                        var icons = rules[i].icons().concat();
                        if (rules[i].reverseIconOrder()) {
                            icons.reverse();
                        }
                        RuleFormatHelper._drawCustomIconSetPreview(preview, icons, { margin: "2px 0 0 2px" });
                    } else {
                        RuleFormatHelper._drawIconSetPreview(preview, rules[i].iconSetType(), { margin: "2px 0 0 2px" }, rules[i].reverseIconOrder());
                    }
                    ckStop.prop('disabled', 'disabled');
                } else if (rules[i].ruleType() === Sheets.ConditionalFormatting.RuleType.formulaRule) {
                    colRule.text(designer.util.format(rd.formula, rules[i].formula()));
                    RuleFormatHelper._drawPreviewControl(preview, rules[i].style());
                }

                var formulas = "";
                var ranges = rules[i].ranges();
                for (var k = 0; k < ranges.length; k++) {
                    var range = ranges[k];
                    var formula;
                    formula = Sheets.CalcEngine.rangeToFormula(range, 0, 0, Sheets.CalcEngine.RangeReferenceRelative.allAbsolute);
                    formulas += formula + ",";
                }
                inputRange.val('=' + formula);
                colAppliesTo.append(inputRange);
                ckStop.prop('checked', rules[i].stopIfTrue());
                colStopIfTrue.append(ckStop);
                preview.css({ width: '100%', height: '20px' }).appendTo(colFormat);

                colRule.addClass('rule-column');
                colFormat.addClass('format-column');
                colAppliesTo.addClass('applies-to-column');
                colStopIfTrue.addClass('stop-if-true-column');

                row.append([colRule, colFormat, colAppliesTo, colStopIfTrue]);
                row.appendTo($('.format-rules-grid-body'));

                this._addEventListnerForEachRow(row, rules[i]);
            }

        };
        return FormatRulesManagerDialog;
    })(designer.BaseDialog);
    designer.FormatRulesManagerDialog = FormatRulesManagerDialog;
    var PasswordDialog = (function (_super) {
        designer.extends(PasswordDialog, _super);
        function PasswordDialog() {
            _super.call(this, (dialogHtmlPath), '.password-dialog');
        }

        PasswordDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                modal: true,
                title: designer.res.passwordDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var txt = self._element.find('[name=password]').val();
                            if (self._openArgs[2] === undefined) {
                                self._openArgs[2] = {};
                            }
                            self._openArgs[2].password = txt;
                            designer.actions.openOtherFormat.apply(self, self._openArgs);
                            self.close();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ],
                width: 350
            };
        };
        PasswordDialog.prototype._beforeOpen = function () {
            this._element.find('[name=password]').val('');
            this._element.find('#passwordMessage').text(this._openArgs[4]);
        };

        return PasswordDialog;
    })(designer.BaseDialog);
    designer.PasswordDialog = PasswordDialog;

    designer.Helper = Helper;

    var RangeSelectDialog = (function (_super) {
        designer.extends(RangeSelectDialog, _super);

        function RangeSelectDialog(parentDialog, options) {
            _super.call(this, (dialogHtmlPath), '.range-select-dialog');
            this._parentDialog = parentDialog;
            this._rangeSelectOptions = options;
        }

        RangeSelectDialog.prototype._initOptions = function () {
            return {
                resizable: false,
                modal: false,
                width: 460,
                height: 80
            };
        };

        RangeSelectDialog.prototype._init = function () {
            var options = this._rangeSelectOptions || {};
            options.rangeSelectMode = true;
            this._rangeSelect = new GC.Spread.Sheets.FormulaTextBox.FormulaTextBox(this._element.find('#rangeSelect')[0], options);
        };
        RangeSelectDialog.prototype._beforeOpen = function (args) {
            // args : [ title, callback, existValue, [callback arguments]]
            var spread = designer.wrapper.spread;
            // save activeSheet
            this._activeSheetIndex = spread.getActiveSheetIndex();
            this._element.dialog('option', 'title', args[0]);
            this._rangeSelect.workbook(designer.wrapper.spread);
            this._callBack = args[1];
            this._rangeSelect.startSelectMode(args[2]);
            spread.bind('RangeSelectEnding', this, this._processRangeSelectEnding);

            $(document).bind('keydown', this, this._processKeyDown);
        };
        RangeSelectDialog.prototype._processRangeSelectEnding = function (e) {
            var self = e.data;
            self.close();
        };
        RangeSelectDialog.prototype._processKeyDown = function (e) {
            var self = e.data;
            if (e.key === 'Enter') {
                self.close();
            }
        };
        RangeSelectDialog.prototype._afterClose = function () {
            var spread = designer.wrapper.spread;
            spread.unbind('RangeSelectEnding', this._processRangeSelectEnding);
            $(document).unbind('keydown', this._processKeyDown);
            spread.setActiveSheetIndex(this._activeSheetIndex);
            if (this._parentDialog) {
                this._parentDialog.show();
            }
            if (this._callBack) {
                var args = this._openArgs[3] || [];
                var value = this._calNewText(this._rangeSelect.text());
                args.push(value);
                this._callBack.apply(this._parentDialog, args);
            }
            this._rangeSelect.endSelectMode();
            this._rangeSelect.workbook(null);
        };

        RangeSelectDialog.prototype._calNewText = function (text) {
            if (text.length > 1) {
                var firstChar = text.slice(0, 1);
                if (firstChar === '=') {
                    var endPartChar = text.slice(1, text.length);
                    if (isFinite(endPartChar)) {
                        return endPartChar;
                    }
                }
            }
            return text;
        };





        return RangeSelectDialog;
    })(designer.BaseDialog);
    designer.RangeSelectDialog = RangeSelectDialog;

    var SaveAsDialog = (function (_super) {
        __extends(SaveAsDialog, _super);
        function SaveAsDialog() {
            _super.call(this, '../dialogs/dialogs.html', '.save-as-dialog');
        }
        SaveAsDialog.prototype._initOptions = function () {
            var self = this;
            var options = {
                title: designer.res.saveAsDialog.title,
                resizable: false,
                width: 280,
                modal: true,
                close: function () {
                    var callback = self._callback;
                    if (callback) {
                        callback({
                            fileName: self.$saveFileName.val().trim(),
                            cancelled: self._cancelled
                        });
                    }
                },
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var fileName = self.$saveFileName.val().trim();
                            if (fileName) {
                                self._cancelled = false;
                                self.close();
                            }
                            else {
                                self.$saveFileName.focus();
                            }
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self._cancelled = true;
                            self.close();
                        }
                    }
                ]
            };
            return options;
        };

        SaveAsDialog.prototype._beforeOpen = function (args) {
            if (!this.$saveFileName) {
                this.$saveFileName = $("#saveAsFileName");
            }
            this.$saveFileName.val("");
            if (args && args[0]) {
                var option = args[0];
                $("#saveAsFileExtension").text(option.fileExtension);
                this._callback = option.done;
            }
        };
        return SaveAsDialog;
    })(designer.BaseDialog);
    designer.SaveAsDialog = SaveAsDialog;
})();
