const STORAGE_KEY = "currency_total_state_v1";
const LONG_PRESS_MS = 620;

const CURRENCIES = [
  {
    id: "idr",
    code: "IDR",
    badge: "Rp",
    color: "#ff7a18",
    decimals: 0,
    names: {
      en: "Rupiah (IDR)",
      zh: "印尼盾 (IDR)"
    },
    amountLabels: {
      en: "Amount",
      zh: "金额"
    }
  },
  {
    id: "cny",
    code: "CNY",
    badge: "¥",
    color: "#2f8cff",
    decimals: 2,
    names: {
      en: "RMB (CNY)",
      zh: "人民币 (CNY)"
    },
    amountLabels: {
      en: "Amount",
      zh: "金额"
    }
  },
  {
    id: "usdt",
    code: "USDT",
    badge: "USDT",
    color: "#44c878",
    decimals: 2,
    names: {
      en: "USDT",
      zh: "USDT"
    },
    amountLabels: {
      en: "Amount",
      zh: "金额"
    }
  }
];

const TEXT = {
  en: {
    documentTitle: "Currency Total",
    reportTitle: "Report",
    settingsTitle: "Settings",
    reportSubtitle: "Preview, save, and manage your records",
    settingsSubtitle: "Preferences and local data",
    light: "Light",
    dark: "Dark",
    languageButton: "中文",
    reportEmptyTitle: "No report image saved yet",
    reportEmptyCopy: "Save an image for Telegram or backup.",
    reportSavedTitle: "Report image saved",
    reportSavedCopy: "Last image saved {time}.",
    saveImage: "Save Image",
    imageSaved: "Image saved",
    imageFailed: "Could not save image",
    summary: "Summary",
    autoCalculated: "Auto calculated",
    no: "No",
    name: "Name",
    amount: "Amount",
    addRow: "Add Row",
    deleteRow: "Delete Row",
    clearAmount: "Clear amount",
    expand: "Expand",
    collapse: "Collapse",
    rowDeleted: "Row deleted",
    localNote: "Records are saved locally on this device.",
    lastSaved: "Last Saved",
    never: "Never",
    justNow: "Just now",
    sendTelegram: "Send to Telegram",
    telegramCopy: "Share this report",
    telegramOpened: "Telegram share opened",
    copiedReport: "Report copied",
    copyFailed: "Could not copy report",
    themeMode: "Theme mode",
    themeCopy: "Choose a comfortable appearance.",
    language: "Language",
    languageCopy: "Switch between English and Chinese.",
    numberFormat: "Number format",
    numberFormatCopy: "Controls totals and exported reports.",
    autoSave: "Auto-save",
    autoSaveCopy: "Save edits to this browser automatically.",
    exportData: "Export data",
    exportDataCopy: "Download a JSON backup.",
    importData: "Import data",
    importDataCopy: "Restore from a JSON backup.",
    resetData: "Reset local data",
    resetDataCopy: "Clear records stored in this browser.",
    exportDone: "Data exported",
    importDone: "Data imported",
    importFailed: "Import failed",
    resetConfirm: "Reset all local records on this device?",
    resetDone: "Local data reset",
    savedPaused: "Auto-save off",
    home: "Home",
    settings: "Settings",
    reportDate: "Report date",
    total: "Total"
  },
  zh: {
    documentTitle: "多币种记录",
    reportTitle: "报表",
    settingsTitle: "设置",
    reportSubtitle: "预览、保存并管理你的记录",
    settingsSubtitle: "偏好设置与本地数据",
    light: "浅色",
    dark: "深色",
    languageButton: "EN",
    reportEmptyTitle: "还没有保存报表图片",
    reportEmptyCopy: "保存图片后可发送到 Telegram 或备份。",
    reportSavedTitle: "报表图片已保存",
    reportSavedCopy: "上次保存于 {time}。",
    saveImage: "保存图片",
    imageSaved: "图片已保存",
    imageFailed: "无法保存图片",
    summary: "汇总",
    autoCalculated: "自动计算",
    no: "序号",
    name: "名称",
    amount: "金额",
    addRow: "添加行",
    deleteRow: "删除行",
    clearAmount: "清空金额",
    expand: "展开",
    collapse: "收起",
    rowDeleted: "行已删除",
    localNote: "记录只保存在当前设备浏览器中。",
    lastSaved: "上次保存",
    never: "从未保存",
    justNow: "刚刚",
    sendTelegram: "发送到 Telegram",
    telegramCopy: "分享这份报表",
    telegramOpened: "已打开 Telegram 分享",
    copiedReport: "报表内容已复制",
    copyFailed: "无法复制报表",
    themeMode: "主题模式",
    themeCopy: "选择舒适的界面外观。",
    language: "语言",
    languageCopy: "在中文和英文之间切换。",
    numberFormat: "数字格式",
    numberFormatCopy: "用于合计与导出报表。",
    autoSave: "自动保存",
    autoSaveCopy: "编辑后自动保存到此浏览器。",
    exportData: "导出数据",
    exportDataCopy: "下载 JSON 备份文件。",
    importData: "导入数据",
    importDataCopy: "从 JSON 备份恢复。",
    resetData: "重置本地数据",
    resetDataCopy: "清除当前浏览器中的记录。",
    exportDone: "数据已导出",
    importDone: "数据已导入",
    importFailed: "导入失败",
    resetConfirm: "确定要清除当前设备上的所有本地记录吗？",
    resetDone: "本地数据已重置",
    savedPaused: "自动保存已关闭",
    home: "首页",
    settings: "设置",
    reportDate: "报表日期",
    total: "合计"
  }
};

let state = loadState();
let currentView = "home";
let brushPress = null;
let pendingDelete = null;
let toastTimer = null;

const $ = (id) => document.getElementById(id);

const elements = {
  screenTitle: $("screenTitle"),
  screenSubtitle: $("screenSubtitle"),
  themeToggle: $("themeToggle"),
  languageToggle: $("languageToggle"),
  reportStatusTitle: $("reportStatusTitle"),
  reportStatusCopy: $("reportStatusCopy"),
  saveImageButton: $("saveImageButton"),
  saveImageLabel: $("saveImageLabel"),
  summaryTitle: $("summaryTitle"),
  summaryHint: $("summaryHint"),
  summaryGrid: $("summaryGrid"),
  ledgerStack: $("ledgerStack"),
  localNote: $("localNote"),
  lastSavedLabel: $("lastSavedLabel"),
  lastSavedValue: $("lastSavedValue"),
  telegramButton: $("telegramButton"),
  telegramTitle: $("telegramTitle"),
  telegramCopy: $("telegramCopy"),
  settingsTitle: $("settingsTitle"),
  settingsHint: $("settingsHint"),
  settingThemeTitle: $("settingThemeTitle"),
  settingThemeCopy: $("settingThemeCopy"),
  settingLanguageTitle: $("settingLanguageTitle"),
  settingLanguageCopy: $("settingLanguageCopy"),
  settingFormatTitle: $("settingFormatTitle"),
  settingFormatCopy: $("settingFormatCopy"),
  settingAutoSaveTitle: $("settingAutoSaveTitle"),
  settingAutoSaveCopy: $("settingAutoSaveCopy"),
  settingExportTitle: $("settingExportTitle"),
  settingExportCopy: $("settingExportCopy"),
  settingImportTitle: $("settingImportTitle"),
  settingImportCopy: $("settingImportCopy"),
  settingResetTitle: $("settingResetTitle"),
  settingResetCopy: $("settingResetCopy"),
  numberFormat: $("numberFormat"),
  autoSave: $("autoSave"),
  exportButton: $("exportButton"),
  importButton: $("importButton"),
  importFile: $("importFile"),
  resetButton: $("resetButton"),
  headerHomeButton: $("headerHomeButton"),
  navHome: $("navHome"),
  navSettings: $("navSettings"),
  rowActionPopover: $("rowActionPopover"),
  deleteRowButton: $("deleteRowButton"),
  toast: $("toast")
};

init();

function init() {
  applyTheme();
  renderAll();
  bindEvents();
  registerServiceWorker();
}

function bindEvents() {
  elements.themeToggle.addEventListener("click", () => {
    state.prefs.theme = state.prefs.theme === "dark" ? "light" : "dark";
    persist(true);
    applyTheme();
    renderStaticText();
    renderSettingsControls();
  });

  elements.languageToggle.addEventListener("click", () => {
    state.prefs.language = state.prefs.language === "en" ? "zh" : "en";
    persist(true);
    renderAll();
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  elements.headerHomeButton.addEventListener("click", () => setView("home"));

  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.addEventListener("click", () => {
      state.prefs.theme = button.dataset.themeOption;
      persist(true);
      applyTheme();
      renderStaticText();
      renderSettingsControls();
    });
  });

  document.querySelectorAll("[data-language-option]").forEach((button) => {
    button.addEventListener("click", () => {
      state.prefs.language = button.dataset.languageOption;
      persist(true);
      renderAll();
    });
  });

  elements.numberFormat.addEventListener("change", () => {
    state.prefs.numberFormat = elements.numberFormat.value;
    persist(true);
    updateTotals();
    renderSettingsControls();
  });

  elements.autoSave.addEventListener("change", () => {
    state.prefs.autoSave = elements.autoSave.checked;
    persist(true);
    updateSavedStatus();
    renderSettingsControls();
  });

  elements.ledgerStack.addEventListener("input", handleLedgerInput);
  elements.ledgerStack.addEventListener("click", handleLedgerClick);
  elements.ledgerStack.addEventListener("contextmenu", (event) => {
    if (event.target.closest("[data-action='brush']")) {
      event.preventDefault();
    }
  });

  elements.ledgerStack.addEventListener("pointerdown", handleBrushPointerDown);
  document.addEventListener("pointerup", handleBrushPointerUp);
  document.addEventListener("pointercancel", cancelBrushPress);
  document.addEventListener("scroll", hideRowPopover, true);
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#rowActionPopover") && !event.target.closest("[data-action='brush']")) {
      hideRowPopover();
    }
  });

  elements.deleteRowButton.addEventListener("click", () => {
    if (!pendingDelete) return;
    deleteRow(pendingDelete.currencyId, pendingDelete.rowId);
    hideRowPopover();
  });

  elements.saveImageButton.addEventListener("click", saveReportImage);
  elements.telegramButton.addEventListener("click", sendToTelegram);
  elements.exportButton.addEventListener("click", exportData);
  elements.importButton.addEventListener("click", () => elements.importFile.click());
  elements.importFile.addEventListener("change", importData);
  elements.resetButton.addEventListener("click", resetLocalData);
  window.addEventListener("beforeunload", () => persist(true));
}

function renderAll() {
  document.documentElement.lang = state.prefs.language === "zh" ? "zh-CN" : "en";
  renderStaticText();
  renderSummary();
  renderLedgers();
  renderSettingsControls();
  updateTotals();
  updateSavedStatus();
}

function renderStaticText() {
  const t = getText();
  const isSettings = currentView === "settings";
  document.title = t.documentTitle;
  elements.screenTitle.textContent = isSettings ? t.settingsTitle : t.reportTitle;
  elements.screenSubtitle.textContent = isSettings ? t.settingsSubtitle : t.reportSubtitle;
  elements.headerHomeButton.setAttribute("aria-label", t.home);
  elements.headerHomeButton.title = t.home;
  elements.themeToggle.querySelector("span").textContent = state.prefs.theme === "dark" ? t.light : t.dark;
  elements.themeToggle.querySelector("use").setAttribute("href", state.prefs.theme === "dark" ? "#icon-sun" : "#icon-moon");
  elements.languageToggle.querySelector("span").textContent = t.languageButton;
  elements.reportStatusTitle.textContent = state.report.lastImageAt ? t.reportSavedTitle : t.reportEmptyTitle;
  elements.reportStatusCopy.textContent = state.report.lastImageAt
    ? t.reportSavedCopy.replace("{time}", formatDateTime(state.report.lastImageAt))
    : t.reportEmptyCopy;
  elements.saveImageLabel.textContent = t.saveImage;
  elements.summaryTitle.textContent = t.summary;
  elements.summaryHint.textContent = t.autoCalculated;
  elements.localNote.textContent = t.localNote;
  elements.lastSavedLabel.textContent = t.lastSaved;
  elements.telegramTitle.textContent = t.sendTelegram;
  elements.telegramCopy.textContent = t.telegramCopy;
  elements.settingsTitle.textContent = t.settingsTitle;
  elements.settingsHint.textContent = t.settingsSubtitle;
  elements.settingThemeTitle.textContent = t.themeMode;
  elements.settingThemeCopy.textContent = t.themeCopy;
  elements.settingLanguageTitle.textContent = t.language;
  elements.settingLanguageCopy.textContent = t.languageCopy;
  elements.settingFormatTitle.textContent = t.numberFormat;
  elements.settingFormatCopy.textContent = t.numberFormatCopy;
  elements.settingAutoSaveTitle.textContent = t.autoSave;
  elements.settingAutoSaveCopy.textContent = t.autoSaveCopy;
  elements.settingExportTitle.textContent = t.exportData;
  elements.settingExportCopy.textContent = t.exportDataCopy;
  elements.settingImportTitle.textContent = t.importData;
  elements.settingImportCopy.textContent = t.importDataCopy;
  elements.settingResetTitle.textContent = t.resetData;
  elements.settingResetCopy.textContent = t.resetDataCopy;
  elements.navHome.textContent = t.home;
  elements.navSettings.textContent = t.settings;
  elements.deleteRowButton.querySelector("span").textContent = t.deleteRow;
}

function renderSummary() {
  const lang = state.prefs.language;
  elements.summaryGrid.innerHTML = CURRENCIES.map((currency) => `
    <article class="summary-card" data-currency="${currency.id}">
      <span class="currency-badge" style="color: ${currency.color}; background: ${currency.color};">
        <span>${currency.badge}</span>
      </span>
      <div>
        <h3>${escapeHtml(currency.names[lang])}</h3>
        <strong data-summary-total="${currency.id}">0</strong>
      </div>
    </article>
  `).join("");
}

function renderLedgers() {
  const t = getText();
  const lang = state.prefs.language;
  elements.ledgerStack.innerHTML = CURRENCIES.map((currency) => {
    const table = state.tables[currency.id];
    const rows = table.rows.map((row, index) => rowTemplate(currency, row, index)).join("");
    return `
      <section class="ledger-card ${table.collapsed ? "is-collapsed" : ""}" data-currency="${currency.id}">
        <header class="ledger-header">
          <div class="ledger-title">
            <span class="currency-badge small" style="color: ${currency.color}; background: ${currency.color};">
              <span>${currency.badge}</span>
            </span>
            <strong class="ledger-name">${escapeHtml(currency.names[lang])}</strong>
          </div>
          <strong class="ledger-total" data-ledger-total="${currency.id}">0</strong>
          <button class="collapse-button" type="button" data-action="toggle" data-currency="${currency.id}" aria-expanded="${!table.collapsed}" aria-label="${table.collapsed ? t.expand : t.collapse}" title="${table.collapsed ? t.expand : t.collapse}">
            <svg aria-hidden="true"><use href="#icon-chevron"></use></svg>
          </button>
        </header>
        <div class="ledger-body">
          <div class="table-grid table-head" role="row">
            <div>${escapeHtml(t.no)}</div>
            <div>${escapeHtml(t.name)}</div>
            <div>${escapeHtml(currency.amountLabels[lang] || t.amount)}</div>
          </div>
          <div class="row-list">
            ${rows}
            <button class="add-row-button" type="button" data-action="add-row" data-currency="${currency.id}">
              <svg aria-hidden="true"><use href="#icon-plus"></use></svg>
              <span>${escapeHtml(t.addRow)}</span>
            </button>
          </div>
        </div>
      </section>
    `;
  }).join("");
}

function rowTemplate(currency, row, index) {
  const t = getText();
  return `
    <div class="record-row table-grid" data-row-id="${row.id}" data-currency="${currency.id}">
      <div class="number-cell">${index + 1}</div>
      <div>
        <input class="name-input" data-field="name" data-currency="${currency.id}" data-row-id="${row.id}" type="text" autocomplete="off" spellcheck="false" value="${escapeAttribute(row.name)}" placeholder="${escapeAttribute(t.name)}" />
      </div>
      <div class="amount-field">
        <input class="amount-input" data-field="amount" data-currency="${currency.id}" data-row-id="${row.id}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${escapeAttribute(row.amount)}" placeholder="0" />
        <button class="brush-button" type="button" data-action="brush" data-currency="${currency.id}" data-row-id="${row.id}" aria-label="${escapeAttribute(t.clearAmount)}" title="${escapeAttribute(t.clearAmount)}">
          <svg aria-hidden="true"><use href="#icon-brush"></use></svg>
        </button>
      </div>
    </div>
  `;
}

function renderSettingsControls() {
  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.themeOption === state.prefs.theme);
  });
  document.querySelectorAll("[data-language-option]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.languageOption === state.prefs.language);
  });
  elements.numberFormat.value = state.prefs.numberFormat;
  elements.autoSave.checked = state.prefs.autoSave;
}

function handleLedgerInput(event) {
  const input = event.target.closest("input[data-field]");
  if (!input) return;
  const row = findRow(input.dataset.currency, input.dataset.rowId);
  if (!row) return;
  row[input.dataset.field] = input.value;
  persist();
  updateTotals();
}

function handleLedgerClick(event) {
  const action = event.target.closest("[data-action]");
  if (!action) return;
  const currencyId = action.dataset.currency;
  if (action.dataset.action === "add-row") {
    addRow(currencyId);
    return;
  }
  if (action.dataset.action === "toggle") {
    state.tables[currencyId].collapsed = !state.tables[currencyId].collapsed;
    persist();
    renderLedgers();
    updateTotals();
  }
}

function handleBrushPointerDown(event) {
  const button = event.target.closest("[data-action='brush']");
  if (!button) return;
  event.preventDefault();
  cancelBrushPress();
  brushPress = {
    button,
    currencyId: button.dataset.currency,
    rowId: button.dataset.rowId,
    longPressed: false,
    pointerId: event.pointerId,
    timer: window.setTimeout(() => {
      if (!brushPress) return;
      brushPress.longPressed = true;
      showRowPopover(button, brushPress.currencyId, brushPress.rowId);
      if (navigator.vibrate) navigator.vibrate(12);
    }, LONG_PRESS_MS)
  };
  try {
    button.setPointerCapture(event.pointerId);
  } catch (error) {
    // Pointer capture is optional on older mobile browsers.
  }
}

function handleBrushPointerUp(event) {
  if (!brushPress) return;
  const active = brushPress;
  const samePointer = event.pointerId === active.pointerId || event.pointerId === undefined;
  cancelBrushPress(false);
  if (!samePointer || active.longPressed) return;
  clearAmount(active.currencyId, active.rowId);
}

function cancelBrushPress(clearOnly = true) {
  if (brushPress?.timer) window.clearTimeout(brushPress.timer);
  if (clearOnly) brushPress = null;
  else brushPress.timer = null;
  if (!clearOnly) brushPress = null;
}

function showRowPopover(button, currencyId, rowId) {
  pendingDelete = { currencyId, rowId };
  const rect = button.getBoundingClientRect();
  const width = 154;
  const left = Math.max(10, Math.min(window.innerWidth - width - 10, rect.right - width + 4));
  const top = Math.max(10, Math.min(window.innerHeight - 60, rect.bottom + 8));
  elements.rowActionPopover.style.left = `${left}px`;
  elements.rowActionPopover.style.top = `${top}px`;
  elements.rowActionPopover.hidden = false;
}

function hideRowPopover() {
  pendingDelete = null;
  elements.rowActionPopover.hidden = true;
}

function clearAmount(currencyId, rowId) {
  const row = findRow(currencyId, rowId);
  if (!row) return;
  row.amount = "";
  const input = elements.ledgerStack.querySelector(`.amount-input[data-currency="${currencyId}"][data-row-id="${rowId}"]`);
  if (input) input.value = "";
  persist();
  updateTotals();
}

function addRow(currencyId) {
  state.tables[currencyId].rows.push(createRow());
  persist();
  renderLedgers();
  updateTotals();
  const inputs = elements.ledgerStack.querySelectorAll(`.name-input[data-currency="${currencyId}"]`);
  const lastInput = inputs[inputs.length - 1];
  if (lastInput) lastInput.focus();
}

function deleteRow(currencyId, rowId) {
  const rows = state.tables[currencyId].rows;
  const index = rows.findIndex((row) => row.id === rowId);
  if (index === -1) return;
  rows.splice(index, 1);
  persist();
  renderLedgers();
  updateTotals();
  showToast(getText().rowDeleted);
}

function updateTotals() {
  CURRENCIES.forEach((currency) => {
    const total = calculateTotal(currency.id);
    const formatted = formatCurrency(total, currency);
    document.querySelectorAll(`[data-summary-total="${currency.id}"]`).forEach((node) => {
      node.textContent = formatted;
    });
    document.querySelectorAll(`[data-ledger-total="${currency.id}"]`).forEach((node) => {
      node.textContent = `${getText().total}: ${formatted}`;
    });
  });
  updateSavedStatus();
}

function calculateTotal(currencyId) {
  return state.tables[currencyId].rows.reduce((sum, row) => sum + parseAmount(row.amount), 0);
}

function parseAmount(raw) {
  const value = String(raw || "").trim();
  if (!value) return 0;
  let normalized = value.replace(/\s+/g, "").replace(/[^\d.,+-]/g, "");
  const negative = normalized.startsWith("-");
  normalized = normalized.replace(/[+-]/g, "");
  if (!normalized) return 0;

  const lastDot = normalized.lastIndexOf(".");
  const lastComma = normalized.lastIndexOf(",");
  let decimalSeparator = "";

  if (lastDot !== -1 && lastComma !== -1) {
    decimalSeparator = lastDot > lastComma ? "." : ",";
  } else if (lastComma !== -1) {
    decimalSeparator = inferSingleSeparator(normalized, ",");
  } else if (lastDot !== -1) {
    decimalSeparator = inferSingleSeparator(normalized, ".");
  }

  if (decimalSeparator) {
    const otherSeparator = decimalSeparator === "." ? "," : ".";
    normalized = normalized.replaceAll(otherSeparator, "");
    const index = normalized.lastIndexOf(decimalSeparator);
    normalized = `${normalized.slice(0, index).replaceAll(decimalSeparator, "")}.${normalized.slice(index + 1)}`;
  } else {
    normalized = normalized.replace(/[.,]/g, "");
  }

  const number = Number.parseFloat(normalized);
  if (!Number.isFinite(number)) return 0;
  return negative ? -number : number;
}

function inferSingleSeparator(value, separator) {
  const pieces = value.split(separator);
  if (pieces.length > 2) return "";
  const fractionLength = pieces[1]?.length || 0;
  if (fractionLength === 0) return "";
  if (fractionLength === 3) return "";
  return separator;
}

function formatCurrency(value, currency) {
  const decimals = currency.decimals;
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const options = {
    minimumFractionDigits: currency.id === "usdt" ? 2 : 0,
    maximumFractionDigits: decimals
  };

  let numberText;
  if (state.prefs.numberFormat === "plain") {
    numberText = formatPlain(abs, options.maximumFractionDigits, options.minimumFractionDigits);
  } else {
    const locale = state.prefs.numberFormat === "indonesian" ? "id-ID" : "en-US";
    numberText = new Intl.NumberFormat(locale, options).format(abs);
  }

  if (currency.id === "idr") return `${sign}Rp ${numberText}`;
  if (currency.id === "cny") return `${sign}¥ ${numberText}`;
  return `${sign}${numberText} USDT`;
}

function formatPlain(value, maxDecimals, minDecimals) {
  const fixed = value.toFixed(maxDecimals);
  if (minDecimals === maxDecimals) return fixed;
  return fixed.replace(/\.?0+$/, "");
}

function setView(view) {
  currentView = view;
  document.querySelectorAll(".view").forEach((node) => {
    node.classList.toggle("is-active", node.id === `${view}View`);
  });
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  renderStaticText();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyTheme() {
  document.documentElement.dataset.theme = state.prefs.theme;
  const themeColor = state.prefs.theme === "dark" ? "#07111f" : "#eef3f8";
  document.querySelector("meta[name='theme-color']").setAttribute("content", themeColor);
}

async function saveReportImage() {
  try {
    const blob = await buildReportPng();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `currency-report-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    state.report.lastImageAt = new Date().toISOString();
    persist(true);
    renderStaticText();
    showToast(getText().imageSaved);
  } catch (error) {
    showToast(getText().imageFailed);
  }
}

function buildReportPng() {
  const scale = Math.min(3, window.devicePixelRatio || 2);
  const width = 1080;
  const rowCounts = CURRENCIES.reduce((count, currency) => count + Math.max(1, state.tables[currency.id].rows.length), 0);
  const height = 420 + rowCounts * 42 + CURRENCIES.length * 96;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  drawReportCanvas(ctx, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas export failed"));
    }, "image/png", 0.94);
  });
}

function drawReportCanvas(ctx, width, height) {
  const t = getText();
  const lang = state.prefs.language;
  ctx.fillStyle = state.prefs.theme === "light" ? "#eef3f8" : "#07111f";
  ctx.fillRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(255, 122, 24, 0.16)");
  gradient.addColorStop(0.46, "rgba(47, 140, 255, 0.09)");
  gradient.addColorStop(1, "rgba(68, 200, 120, 0.14)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  let y = 64;
  ctx.fillStyle = "#eef5ff";
  ctx.font = "800 46px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(t.reportTitle, 56, y);
  ctx.font = "500 24px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillStyle = "#aeb9c9";
  ctx.fillText(`${t.reportDate}: ${formatDateTime(new Date().toISOString())}`, 56, y + 42);

  y += 100;
  CURRENCIES.forEach((currency, index) => {
    const x = 56 + index * 326;
    roundedRect(ctx, x, y, 300, 112, 14, "rgba(10, 22, 37, 0.88)", "rgba(148, 163, 184, 0.24)");
    ctx.fillStyle = currency.color;
    ctx.beginPath();
    ctx.arc(x + 50, y + 56, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "800 24px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(currency.badge, x + 50, y + 64);
    ctx.textAlign = "left";
    ctx.fillStyle = "#eef5ff";
    ctx.font = "700 24px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(currency.names[lang], x + 98, y + 43);
    ctx.fillStyle = currency.color;
    ctx.font = "900 31px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(formatCurrency(calculateTotal(currency.id), currency), x + 98, y + 82);
  });

  y += 156;
  CURRENCIES.forEach((currency) => {
    const rows = state.tables[currency.id].rows;
    const tableHeight = 86 + Math.max(1, rows.length) * 40 + 30;
    roundedRect(ctx, 56, y, width - 112, tableHeight, 14, "rgba(10, 22, 37, 0.88)", "rgba(148, 163, 184, 0.24)");
    ctx.fillStyle = currency.color;
    ctx.font = "800 28px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(currency.names[lang], 86, y + 42);
    ctx.font = "800 22px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(`${t.total}: ${formatCurrency(calculateTotal(currency.id), currency)}`, width - 360, y + 42);

    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(76, y + 62, width - 152, 36);
    ctx.fillStyle = currency.color;
    ctx.font = "800 18px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(t.no, 94, y + 86);
    ctx.fillText(t.name, 180, y + 86);
    ctx.fillText(t.amount, 650, y + 86);

    const visibleRows = rows.length ? rows : [createRow()];
    visibleRows.forEach((row, index) => {
      const rowY = y + 106 + index * 40;
      ctx.fillStyle = index % 2 ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.01)";
      ctx.fillRect(76, rowY - 26, width - 152, 40);
      ctx.fillStyle = "#eef5ff";
      ctx.font = "600 19px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText(String(index + 1), 100, rowY);
      ctx.fillText(row.name || "-", 180, rowY);
      ctx.fillStyle = parseAmount(row.amount) < 0 ? currency.color : "#eef5ff";
      ctx.fillText(row.amount || "0", 650, rowY);
    });

    y += tableHeight + 28;
  });
}

function roundedRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
}

async function sendToTelegram() {
  const report = buildTextReport();
  const url = `https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(report)}`;
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  state.report.lastTelegramAt = new Date().toISOString();
  persist(true);
  if (opened) {
    showToast(getText().telegramOpened);
    return;
  }
  try {
    await navigator.clipboard.writeText(report);
    showToast(getText().copiedReport);
  } catch (error) {
    showToast(getText().copyFailed);
  }
}

function buildTextReport() {
  const t = getText();
  const lang = state.prefs.language;
  const lines = [
    `${t.reportTitle}`,
    `${t.reportDate}: ${formatDateTime(new Date().toISOString())}`,
    ""
  ];
  CURRENCIES.forEach((currency) => {
    lines.push(`${currency.names[lang]} - ${t.total}: ${formatCurrency(calculateTotal(currency.id), currency)}`);
    state.tables[currency.id].rows.forEach((row, index) => {
      if (!row.name && !row.amount) return;
      lines.push(`${index + 1}. ${row.name || "-"}: ${row.amount || "0"}`);
    });
    lines.push("");
  });
  return lines.join("\n").trim();
}

function exportData() {
  const payload = JSON.stringify(state, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `currency-total-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(getText().exportDone);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const incoming = JSON.parse(String(reader.result || ""));
      state = sanitizeState(incoming);
      persist(true);
      applyTheme();
      renderAll();
      showToast(getText().importDone);
    } catch (error) {
      showToast(getText().importFailed);
    } finally {
      elements.importFile.value = "";
    }
  });
  reader.addEventListener("error", () => {
    showToast(getText().importFailed);
    elements.importFile.value = "";
  });
  reader.readAsText(file);
}

function resetLocalData() {
  if (!window.confirm(getText().resetConfirm)) return;
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  persist(true);
  applyTheme();
  renderAll();
  showToast(getText().resetDone);
}

function persist(force = false) {
  if (!force && state.prefs.autoSave === false) {
    updateSavedStatus();
    return;
  }
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateSavedStatus();
}

function updateSavedStatus() {
  const t = getText();
  if (state.prefs.autoSave === false) {
    elements.lastSavedValue.textContent = t.savedPaused;
    return;
  }
  elements.lastSavedValue.textContent = state.updatedAt ? formatDateTime(state.updatedAt) : t.never;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return sanitizeState(JSON.parse(raw));
  } catch (error) {
    return defaultState();
  }
}

function sanitizeState(input) {
  const fallback = defaultState();
  const prefs = { ...fallback.prefs, ...(input?.prefs || {}) };
  if (!["dark", "light"].includes(prefs.theme)) prefs.theme = fallback.prefs.theme;
  if (!["en", "zh"].includes(prefs.language)) prefs.language = fallback.prefs.language;
  if (!["western", "indonesian", "plain"].includes(prefs.numberFormat)) prefs.numberFormat = fallback.prefs.numberFormat;
  prefs.autoSave = prefs.autoSave !== false;

  const tables = {};
  CURRENCIES.forEach((currency) => {
    const incomingTable = input?.tables?.[currency.id] || {};
    const rows = Array.isArray(incomingTable.rows) ? incomingTable.rows : fallback.tables[currency.id].rows;
    tables[currency.id] = {
      collapsed: Boolean(incomingTable.collapsed),
      rows: rows.map((row) => ({
        id: String(row?.id || createId()),
        name: String(row?.name ?? ""),
        amount: String(row?.amount ?? "")
      }))
    };
  });

  return {
    version: 1,
    prefs,
    tables,
    report: {
      lastImageAt: input?.report?.lastImageAt || null,
      lastTelegramAt: input?.report?.lastTelegramAt || null
    },
    updatedAt: input?.updatedAt || null
  };
}

function defaultState() {
  const language = navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  return {
    version: 1,
    prefs: {
      theme: "dark",
      language,
      numberFormat: "western",
      autoSave: true
    },
    tables: {
      idr: {
        collapsed: false,
        rows: [createRow("", ""), createRow("", "")]
      },
      cny: {
        collapsed: false,
        rows: [createRow("", ""), createRow("", "")]
      },
      usdt: {
        collapsed: false,
        rows: [createRow("", ""), createRow("", "")]
      }
    },
    report: {
      lastImageAt: null,
      lastTelegramAt: null
    },
    updatedAt: null
  };
}

function createRow(name = "", amount = "") {
  return { id: createId(), name, amount };
}

function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `row_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function findRow(currencyId, rowId) {
  return state.tables[currencyId]?.rows.find((row) => row.id === rowId);
}

function getText() {
  return TEXT[state.prefs.language] || TEXT.en;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return getText().never;
  const locale = state.prefs.language === "zh" ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 2200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
