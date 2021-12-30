let config = {
    "ribbon": [
      {
        "id": "home",
        "text": "开始",
        "buttonGroups": [
            // This is custom button ----------------start-------------
            {
                "label":"新设计器",
                "thumbnailClass":"welcome",
                "commandGroup":{
                    "children":[
                        {
                            "direction":"vertical",
                            "commands":[
                                "Welcome"
                            ]
                        }
                        // This is custom button ----------------end-------------
                    ]
                }
            },
          {
            "label": "撤销",
            "thumbnailClass": "ribbon-thumbnail-undoredo",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "commands": [
                    "undo",
                    "redo"
                  ]
                }
              ]
            }
          },
          {
            "label": "剪贴板",
            "thumbnailClass": "ribbon-thumbnail-clipboard",
            "commandGroup": {
              "children": [
                {
                  "commands": [
                    "paste"
                  ]
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "cut",
                    "copy"
                  ]
                }
              ]
            }
          },
          {
            "label": "字体",
            "indicator": "indicatorFonts",
            "thumbnailClass": "ribbon-thumbnail-fonts",
            "commandGroup": {
              "direction": "vertical",
              "children": [
                {
                  "commands": [
                    "fontFamily",
                    "fontSize",
                    "increaseFontsize",
                    "decreaseFontsize"
                  ]
                },
                {
                  "commands": [
                    "fontWeight",
                    "fontItalic",
                    "fontUnderline",
                    "fontDoubleUnderline",
                    "separator",
                    "border",
                    "separator",
                    "backColor",
                    "foreColor"
                  ]
                }
              ]
            }
          },
          {
            "label": "对齐方式",
            "indicator": "indicatorAlignment",
            "thumbnailClass": "ribbon-thumbnail-alignment",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "children": [
                    {
                      "commands": [
                        "topAlign",
                        "middleAlign",
                        "bottomAlign",
                        "separator",
                        "orientationList"
                      ]
                    },
                    {
                      "commands": [
                        "leftAlign",
                        "centerAlign",
                        "rightAlign",
                        "separator",
                        "decreaseIndent",
                        "increaseIndent"
                      ]
                    }
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "direction": "vertical",
                  "children": [
                    {
                      "commands": [
                        "wrapText"
                      ]
                    },
                    {
                      "commands": [
                        "mergeCenter",
                        "alignmentMergeList"
                      ]
                    }
                  ]
                }
              ]
            }
          },
          {
            "label": "数字",
            "indicator": "indicatorNumbers",
            "thumbnailClass": "ribbon-thumbnail-numbers",
            "commandGroup": {
              "direction": "vertical",
              "children": [
                {
                  "commands": [
                    "ribbonNumberFormat"
                  ]
                },
                {
                  "commands": [
                    "formatPercentage",
                    "formatComma",
                    "separator",
                    "increaseDecimal",
                    "decreaseDecimal"
                  ]
                }
              ]
            }
          },
          {
            "label": "单元格类型",
            "thumbnailClass": "ribbon-thumbnail-celltype",
            "commandGroup": {
              "children": [
                {
                  "commands": [
                    "cellType",
                    "cellDropdowns"
                  ]
                }
              ]
            }
          },
          {
            "label": "样式",
            "thumbnailClass": "ribbon-thumbnail-styles",
            "commandGroup": {
              "commands": [
                "conditionFormat",
                "formatTable2",
                "cellStyles",
                "cellStates"
              ]
            }
          },
          {
            "label": "单元格",
            "thumbnailClass": "ribbon-thumbnail-cells",
            "commandGroup": {
              "commands": [
                "cellsInsert",
                "cellsDelete",
                "cellsFormat"
              ]
            }
          },
          {
            "label": "编辑",
            "thumbnailClass": "ribbon-thumbnail-editing",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "children": [
                    {
                      "commands": [
                        "editingAutoSum",
                        "editingAutoSumList"
                      ]
                    },
                    {
                      "commands": [
                        "editingFillDown",
                        "editingFillDownList"
                      ]
                    },
                    {
                      "commands": [
                        "clear",
                        "editingClearAllList"
                      ]
                    }
                  ]
                },
                {
                  "commands": [
                    "editingSortFilter"
                  ]
                },
                {
                  "commands": [
                    "editingFind"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "insert",
        "text": "插入",
        "buttonGroups": [
          {
            "label": "表格",
            "thumbnailClass": "ribbon-thumbnail-table",
            "commandGroup": {
              "commands": [
                "insertTable"
              ]
            }
          },
          {
            "label": "图表",
            "thumbnailClass": "ribbon-thumbnail-chart",
            "commandGroup": {
              "commands": [
                "insertChart"
              ]
            }
          },
          {
            "label": "插图",
            "thumbnailClass": "ribbon-button-picture",
            "commandGroup": {
              "commands": [
                "insertPicture"
              ]
            }
          },
          {
            "label": "形状",
            "thumbnailClass": "ribbon-thumbnail-shapes",
            "commandGroup": {
              "commands": [
                "insertShape"
              ]
            }
          },
          {
            "label": "条形码",
            "thumbnailClass": "ribbon-thumbnail-barcode",
            "commandGroup": {
              "commands": [
                "insertBarCode"
              ]
            }
          },
          {
            "label": "超链接",
            "thumbnailClass": "ribbon-thumbnail-barcode",
            "commandGroup": {
              "commands": [
                "insertHyperLink"
              ]
            }
          },
          {
            "label": "迷你图",
            "thumbnailClass": "ribbon-thumbnail-sparklines",
            "commandGroup": {
              "commands": [
                "sparklinesLineSparkline",
                "sparklinesColumnSparkline",
                "sparklinesWinLossSparkline",
                "sparklinesPieSparkline",
                "sparklinesAreaSparkline",
                "sparklinesScatterSparkline",
                "sparklinesSpreadsSparkline",
                "sparklinesStackedSparkline",
                "sparklinesBoxPlotSparkline",
                "sparklinesCascadeSparkline",
                "sparklinesParetoSparkline",
                "sparklinesBulletSparkline",
                "sparklinesHBarSparkline",
                "sparklinesVBarSparkline",
                "sparklinesVarianceSparkline",
                "sparklinesMonthSparkline",
                "sparklinesYearSparkline",
                "sparklinesRangeBlockSparkline"
              ]
            }
          }
        ]
      },
      {
        "id": "formulas",
        "text": "公式",
        "buttonGroups": [
          {
            "label": "函数库",
            "thumbnailClass": "ribbon-button-insertfunction",
            "commandGroup": {
              "commands": [
                "insertFunction"
              ]
            }
          },
          {
            "label": "函数库",
            "thumbnailClass": "ribbon-thumbnail-functions",
            "commandGroup": {
              "commands": [
                "formulaAutoSum",
                "formulaFinancial",
                "logicalFormula",
                "formulaText",
                "formulaDateTime",
                "formulaLookupReference",
                "formulaLookupReferenceAllowDynamicArray",
                "formulaMathTrig",
                "formulaMathTrigAllowDynamicArray",
                "moreFunctions"
              ]
            }
          },
          {
            "label": "定义的名称",
            "thumbnailClass": "ribbon-thumbnail-names",
            "commandGroup": {
              "commands": [
                "nameManager"
              ]
            }
          },
          {
            "label": "公式审核",
            "thumbnailClass": "ribbon-thumbnail-functions",
            "commandGroup": {
              "commands": [
                "showFormulas"
              ]
            }
          }
        ]
      },
      {
        "id": "data",
        "text": "数据",
        "buttonGroups": [
          {
            "label": "排序和筛选",
            "thumbnailClass": "ribbon-thumbnail-sortAndFilter",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "commands": [
                    "sortAZData",
                    "sortZAData"
                  ]
                },
                {
                  "commands": [
                    "customSortData"
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "commands": [
                    "setFilterData"
                  ]
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "clearFilterData",
                    "reapplyFilterData"
                  ]
                }
              ]
            }
          },
          {
            "label": "数据工具",
            "thumbnailClass": "ribbon-thumbnail-datatools",
            "commandGroup": {
              "children": [
                {
                  "commands": [
                    "dataValidation",
                    "dataValidationList"
                  ]
                }
              ]
            }
          },
          {
            "label": "分级显示",
            "indicator": "indicatorOutline",
            "thumbnailClass": "ribbon-thumbnail-outline",
            "commandGroup": {
              "children": [
                {
                  "commands": [
                    "group",
                    "ungroup",
                    "subtotal"
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "showDetail",
                    "hideDetail"
                  ]
                }
              ]
            }
          },
          {
            "label": "设计模式",
            "thumbnailClass": "ribbon-thumbnail-designmode",
            "commandGroup": {
              "children": [
                {
                  "commands": [
                    "templateDesignMode"
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "loadSchema",
                    "saveSchema",
                    "clearBindingPath"
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "commands": [
                    "autoGenerateLabel"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "view",
        "text": "视图",
        "buttonGroups": [
          {
            "label": "显示/隐藏",
            "thumbnailClass": "ribbon-thumbnail-showhide",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "commands": [
                    "showHideRowHeader",
                    "showHideColumnHeader"
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "showHideVGridLine",
                    "showHideHGridLine"
                  ]
                },
                {
                  "type": "separator"
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "showHideTabStrip",
                    "showHideNewTab"
                  ]
                }
              ]
            }
          },
          {
            "label": "显示比例",
            "thumbnailClass": "ribbon-thumbnail-zoom",
            "commandGroup": {
              "commands": [
                "zoom",
                "zoomDefault",
                "zoomSelection"
              ]
            }
          },
          {
            "label": "窗口",
            "thumbnailClass": "ribbon-thumbnail-viewport",
            "commandGroup": {
              "commands": [
                "ViewportFreezePanes",
                "unfreezePanes"
              ]
            }
          }
        ]
      },
      {
        "id": "settings",
        "text": "设置",
        "buttonGroups": [
          {
            "label": "Spread 设置",
            "thumbnailClass": "ribbon-thumbnail-spreadsettings",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "commands": [
                    "spreadSettingGeneral"
                  ]
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "spreadSettingScrollBar",
                    "spreadSettingCalculation",
                    "spreadSettingTabStrip"
                  ]
                }
              ]
            }
          },
          {
            "label": "工作表设置",
            "thumbnailClass": "ribbon-thumbnail-sheetsettings",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "commands": [
                    "sheetSettingGeneral"
                  ]
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "sheetSettingGridLine",
                    "sheetSettingHeaders"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "tableDesign",
        "text": "设计",
        "buttonGroups": [
          {
            "label": "属性",
            "thumbnailClass": "ribbon-thumbnail-properties",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "commands": [
                    "tableName",
                    "resizeTable"
                  ]
                }
              ]
            }
          },
          {
            "label": "工具",
            "thumbnailClass": "ribbon-thumbnail-tools",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "commands": [
                    "convertToRange",
                    "tableAllowAutoExpand"
                  ]
                },
                {
                  "commands": [
                    "insertSlicer"
                  ]
                }
              ]
            }
          },
          {
            "label": "表式样选项",
            "thumbnailClass": "ribbon-thumbnail-tablestyleoptions",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "commands": [
                    "tableStyleHeaderRow",
                    "tableStyleTotalRow",
                    "tableStyleBandedRows"
                  ]
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "tableStyleFirstColumn",
                    "tableStyleLastColumn",
                    "tableStyleBandedColumns"
                  ]
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "tableStyleResizeHandler",
                    "tableStyleFilterButton",
                    "tableStyleTotalRowList"
                  ]
                }
              ]
            }
          },
          {
            "label": "表式样",
            "thumbnailClass": "ribbon-thumbnail-tablestyles",
            "commandGroup": {
              "commands": [
                "formatTable"
              ]
            }
          }
        ],
        "visibleWhen": "TableSelected"
      },
      {
        "id": "chartDesign",
        "text": "设计",
        "buttonGroups": [
          {
            "label": "图表布局",
            "thumbnailClass": "ribbon-thumbnail-chartlayouts",
            "commandGroup": {
              "commands": [
                "addChartElement",
                "quickLayout"
              ]
            }
          },
          {
            "label": "图表样式",
            "thumbnailClass": "ribbon-thumbnail-chartstyles",
            "commandGroup": {
              "commands": [
                "changeColors",
                "chartStyle"
              ]
            }
          },
          {
            "label": "数据",
            "thumbnailClass": "ribbon-thumbnail-chartdata",
            "commandGroup": {
              "commands": [
                "switchRowColumn",
                "selectData"
              ]
            }
          },
          {
            "label": "类型",
            "thumbnailClass": "ribbon-thumbnail-charttype",
            "commandGroup": {
              "commands": [
                "changeChartType"
              ]
            }
          },
          {
            "label": "位置",
            "thumbnailClass": "ribbon-thumbnail-chartlocation",
            "commandGroup": {
              "commands": [
                "moveChart"
              ]
            }
          },
          {
            "label": "辅助功能",
            "thumbnailClass": "ribbon-thumbnail-chart-alt-text",
            "commandGroup": {
              "commands": [
                "chartAltText"
              ]
            }
          }
        ],
        "visibleWhen": "singleChartSelected"
      },
      {
        "id": "pictureDesign",
        "text": "设计",
        "buttonGroups": [
          {
            "label": "辅助功能",
            "thumbnailClass": "ribbon-thumbnail-chart-alt-text",
            "commandGroup": {
              "commands": [
                "pictureAltText"
              ]
            }
          }
        ],
        "visibleWhen": "pictureSelected && !IsProtected || pictureSelected && AllowEditObject"
      },
      {
        "id": "shapeDesign",
        "text": "格式",
        "buttonGroups": [
          {
            "label": "插入形状",
            "thumbnailClass": "ribbon-thumbnail-shapeinsertshape",
            "commandGroup": {
              "commands": [
                "insertShapeList",
                "changeShape"
              ]
            }
          },
          {
            "label": "改变形状样式",
            "thumbnailClass": "ribbon-thumbnail-shapeStyles",
            "commandGroup": {
              "commands": [
                "changeShapeStyle"
              ]
            }
          },
          {
            "label": "辅助功能",
            "thumbnailClass": "ribbon-thumbnail-chart-alt-text",
            "commandGroup": {
              "commands": [
                "shapeAltText"
              ]
            }
          },
          {
            "label": "旋转",
            "thumbnailClass": "ribbon-thumbnail-shaperotate",
            "commandGroup": {
              "commands": [
                "shapeRotate"
              ]
            }
          },
          {
            "label": "组合",
            "thumbnailClass": "ribbon-thumbnail-shapegroup",
            "commandGroup": {
              "commands": [
                "shapeCommandGroup"
              ]
            }
          },
          {
            "class": "gc-ribbon-panelgroup-shapeSize",
            "label": "大小",
            "thumbnailClass": "ribbon-thumbnail-shapesize",
            "commandGroup": {
              "direction": "vertical",
              "commands": [
                "shapeSizeHeight",
                "shapeSizeWidth"
              ]
            }
          }
        ],
        "visibleWhen": "ShapeSelected && !IsProtected || ShapeSelected && AllowEditObject"
      },
      {
        "id": "slicerDesign",
        "text": "选项",
        "buttonGroups": [
          {
            "class": "slicer_panel",
            "label": "切片器",
            "thumbnailClass": "ribbon-thumbnail-properties",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "type": "group",
                  "commands": [
                    "captionName",
                    "slicerSetting"
                  ]
                }
              ]
            }
          },
          {
            "label": "切片器样式",
            "thumbnailClass": "ribbon-thumbnail-tablestyles",
            "commandGroup": {
              "commands": [
                "slicerFormat"
              ]
            }
          },
          {
            "class": "slicer_buttons",
            "label": "按钮",
            "thumbnailClass": "ribbon-thumbnail-properties",
            "commandGroup": {
              "direction": "vertical",
              "commands": [
                "columnCount",
                "itemHeight",
                "itemWidth"
              ]
            }
          },
          {
            "class": "slicer_size",
            "label": "大小",
            "thumbnailClass": "ribbon-thumbnail-sliceSize",
            "commandGroup": {
              "direction": "vertical",
              "commands": [
                "slicerHeight",
                "slicerWidth"
              ]
            }
          }
        ],
        "visibleWhen": "SlicerSelected && !IsProtected || SlicerSelected && AllowEditObject"
      },
      {
        "id": "formulaSparkLineDesign",
        "text": "设计",
        "buttonGroups": [
          {
            "label": "参数",
            "thumbnailClass": "ribbon-thumbnail-argument",
            "commandGroup": {
              "commands": [
                "formulaSparklineSetting"
              ]
            }
          }
        ],
        "visibleWhen": "FormulaSparklineSelected"
      },
      {
        "id": "sparkLineDesign",
        "text": "设计",
        "buttonGroups": [
          {
            "label": "类型",
            "thumbnailClass": "ribbon-thumbnai-sparkline-type",
            "commandGroup": {
              "commands": [
                "lineSparkline",
                "columnSparkline",
                "winLossSparkline"
              ]
            }
          },
          {
            "label": "显示",
            "thumbnailClass": "ribbon-thumbnail-sparkline-show",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "commands": [
                    "showHighpoint",
                    "showLowPoint",
                    "showNegativePoint"
                  ]
                },
                {
                  "direction": "vertical",
                  "commands": [
                    "showFirstPoint",
                    "showLastPoint",
                    "showMarkers"
                  ]
                }
              ]
            }
          },
          {
            "label": "样式",
            "thumbnailClass": "ribbon-thumbnail-sparkline-style",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "children": [
                    {
                      "direction": "vertical",
                      "commands": [
                        "sparklineColor",
                        "sparklineMarkerColor"
                      ]
                    },
                    {
                      "commands": [
                        "sparklineWeight"
                      ]
                    }
                  ]
                }
              ]
            }
          },
          {
            "label": "组合",
            "thumbnailClass": "ribbon-thumbnail-sparkline-groups",
            "commandGroup": {
              "children": [
                {
                  "direction": "vertical",
                  "children": [
                    {
                      "direction": "vertical",
                      "commands": [
                        "sparklineGroup",
                        "sparklineUnGroup"
                      ]
                    },
                    {
                      "commands": [
                        "clearSparkline",
                        "clearSparklineDropdown"
                      ]
                    }
                  ]
                }
              ]
            }
          }
        ],
        "visibleWhen": "SparklineSelected"
      },
      {
        "id": "barcodeDesignId",
        "text": "设计",
        "buttonGroups": [
          {
            "label": "参数",
            "thumbnailClass": "ribbon-thumbnail-argument",
            "commandGroup": {
              "commands": [
                "barCodeSetting"
              ]
            }
          }
        ],
        "visibleWhen": "BarCodeSelected"
      }
    ],
    "contextMenu": [
      "contextMenuCut",
      "contextMenuCopy",
      "contextMenuPaste",
      "designerPasteAll",
      "pasteFormula",
      "designerPasteValues",
      "designerPasteFormatting",
      "pasteValuesFormatting",
      "pasteFormulaFormatting",
      "floatingObjectCut",
      "floatingObjectCopy",
      "contextMenuCutShapes",
      "contextMenuCopyShapes",
      "PasteShapes",
      "separator",
      "resetChartColor",
      "changeChartTypeDialog",
      "selectChartDataDialog",
      "moveChartDialog",
      "formatChart",
      "separator",
      "insertDialog",
      "deleteDialog",
      "gc.spread.contextMenu.insertColumns",
      "gc.spread.contextMenu.deleteColumns",
      "gc.spread.contextMenu.insertRows",
      "gc.spread.contextMenu.deleteRows",
      "tableInsert",
      "tableDelete",
      "gc.spread.contextMenu.clearContents",
      "separator",
      "gc.spread.contextMenu.rowHeaderinsertCopiedCells",
      "gc.spread.contextMenu.rowHeaderinsertCutCells",
      "gc.spread.contextMenu.colHeaderinsertCopiedCells",
      "gc.spread.contextMenu.colHeaderinsertCutCells",
      "insertCopiedCells",
      "insertCutCells",
      "separator",
      "gc.spread.contextMenu.insertSheet",
      "gc.spread.contextMenu.deleteSheet",
      "unprotectSheet",
      "protectSheet",
      "separator",
      "gc.spread.contextMenu.filter",
      "sort",
      "table",
      "separator",
      "gc.spread.contextMenu.insertComment",
      "gc.spread.contextMenu.editComment",
      "gc.spread.contextMenu.deleteComment",
      "gc.spread.contextMenu.toggleComment",
      "formatComment",
      "separator",
      "formatCells",
      "editCellType",
      "editCellDropdowns",
      "link",
      "editHyperlink",
      "openHyperlink",
      "removeHyperlink",
      "removeHyperlinks",
      "separator",
      "richText",
      "defineName",
      "cellTag",
      "rowTag",
      "colTag",
      "columnWidth",
      "rowHeight",
      "gc.spread.contextMenu.hideColumns",
      "gc.spread.contextMenu.hideRows",
      "gc.spread.contextMenu.unhideColumns",
      "gc.spread.contextMenu.unhideRows",
      "columnHeaders",
      "contextMenuOutlineColumn",
      "rowHeaders",
      "separator",
      "showTabColor",
      "gc.spread.contextMenu.hideSheet",
      "gc.spread.contextMenu.unhideSheet",
      "sheetTag",
      "separator",
      "gc.spread.contextMenu.cut",
      "gc.spread.contextMenu.copy",
      "slicerPasteOptions",
      "gc.spread.contextMenu.pasteAll",
      "gc.spread.contextMenu.slicerSortAscend",
      "gc.spread.contextMenu.slicerSortDescend",
      "gc.spread.contextMenu.removeSlicer",
      "slicerProperty",
      "contextMenuSlicerSetting",
      "separator",
      "groupShape",
      "formatShapes",
      "designerMoreFunctions"
    ],
    "fileMenu": "fileMenuButton",
    "sidePanels": [
      {
        "position": "top",
        "allowResize": true,
        "command": "formulaBarPanel",
        "uiTemplate": "formulaBarTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "fieldListTreePanel",
        "uiTemplate": "filedListTemplate"
      },
      {
        "position": "bottom",
        "command": "statusBarPanel",
        "uiTemplate": "statusBarPanelTemplate"
      },
      {
        "position": "full",
        "command": "fileMenuPanel",
        "uiTemplate": "fileMenuPanelTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "shapePanel",
        "uiTemplate": "shapeTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "columnChartPanel",
        "uiTemplate": "columnChartTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "lineChartPanel",
        "uiTemplate": "lineChartTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "pieChartPanel",
        "uiTemplate": "pieChartTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "barChartPanel",
        "uiTemplate": "barChartTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "areaChartPanel",
        "uiTemplate": "areaChartTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "scatterChartPanel",
        "uiTemplate": "scatterChartTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "stockChartPanel",
        "uiTemplate": "stockChartTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "radarChartPanel",
        "uiTemplate": "radarChartTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "sunburstChartPanel",
        "uiTemplate": "sunburstChartTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "treeMapChartPanel",
        "uiTemplate": "treeMapChartPanelTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "funnelChartPanel",
        "uiTemplate": "funnelChartPanelTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "comboChartPanel",
        "uiTemplate": "comboChartTemplate"
      },
      {
        "position": "right",
        "width": "315px",
        "command": "chartAltTextPanel",
        "uiTemplate": "altTextTemplate",
        "showCloseButton": true
      },
      {
        "position": "right",
        "width": "315px",
        "command": "pictureAltTextPanel",
        "uiTemplate": "altTextTemplate",
        "showCloseButton": true
      },
      {
        "position": "right",
        "width": "315px",
        "command": "shapeAltTextPanel",
        "uiTemplate": "altTextTemplate",
        "showCloseButton": true
      }
    ]
  }