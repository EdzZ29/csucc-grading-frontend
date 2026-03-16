<template>
  <div class="font-inria min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
    <success-message ref="msg" />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3 md:gap-4">
      <div class="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
        <div class="w-1 h-10 md:w-1.5 md:h-12 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full shrink-0"></div>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold font-epundaslab text-gray-800">Import Masterlist</h1>
          <p class="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
            <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full shrink-0"></span>
            <span class="truncate">Upload your masterlist (CSV format) • Outcome-Based Education ready</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-gray-200 overflow-hidden">
      <div class="p-4 sm:p-6 md:p-8">

        <!-- Dropzone -->
        <div
          class="dropzone relative border-2 border-dashed rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center cursor-pointer transition-all group"
          :class="{
            'border-orange-400 bg-orange-50/30': isDragging,
            'border-gray-300 hover:border-orange-400 hover:bg-orange-50/20': !isDragging && !isUploading,
            'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75': isUploading,
            'border-orange-300 bg-orange-50/30': rows && rows.length > 0 && !isDragging
          }"
          @dragenter.prevent="!isUploading && (isDragging = true)"
          @dragleave.prevent="!isUploading && (isDragging = false)"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="!isUploading && fileInput.click()"
          tabindex="0"
          role="button"
          @keydown.enter="!isUploading && fileInput.click()">

          <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="handleFile" />

          <!-- Uploading State -->
          <div v-if="isUploading" class="flex flex-col items-center">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-3 sm:mb-4">
              <svg class="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="font-bold text-gray-700 text-base sm:text-lg">Processing Data...</p>
            <p class="text-xs text-gray-400 mt-1">Please wait while we validate records</p>
          </div>

          <!-- Default / File Loaded State -->
          <div v-else class="flex flex-col items-center">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <svg v-if="!rows || rows.length === 0"
                class="w-8 h-8 sm:w-10 sm:h-10 text-orange-400"
                :class="{ 'text-green-500': isDragging }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <svg v-else class="w-8 h-8 sm:w-10 sm:h-10 text-orange-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div v-if="!rows || rows.length === 0">
              <p class="text-gray-700 font-medium text-sm sm:text-base md:text-lg mb-1">
                <span v-if="isDragging" class="text-orange-500">Drop your file here</span>
                <span v-else>Drag & drop your CSV file here</span>
              </p>
              <p class="text-xs sm:text-sm text-gray-400">or <span class="text-orange-400 font-semibold">click to browse</span></p>
            </div>

            <div v-else>
              <p class="text-orange-500 font-bold text-lg sm:text-xl md:text-2xl mb-1">
                {{ rows.length.toLocaleString() }} rows loaded
              </p>
              <p class="text-xs sm:text-sm text-gray-400 break-all px-2">{{ fileName }}</p>
            </div>

            <div v-if="!rows || rows.length === 0" class="mt-4 sm:mt-6 hidden sm:flex items-center gap-3 md:gap-4 text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV format only
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                Max 50MB
              </span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 md:mt-8" v-if="rows && rows.length">

          <div class="w-full sm:w-auto flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
            <label for="typeSelect" class="text-xs sm:text-sm font-medium text-gray-600 ml-1 sm:ml-2 whitespace-nowrap">Class Type:</label>
            <select v-model="selectedType" id="typeSelect" :disabled="isUploading"
              class="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent block p-2 pr-6 sm:pr-8">
              <option value="Lec">Lecture</option>
              <option value="Lec-Lab">Lecture-Lab</option>
            </select>
          </div>

          <div class="flex flex-wrap gap-2 w-full sm:w-auto sm:ml-auto">
            <button type="button" @click="clear"
              class="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 text-gray-600 transition-all shadow-sm hover:shadow flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
              :disabled="isUploading">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>

            <button type="button" @click="downloadPreview"
              class="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 text-gray-600 transition-all shadow-sm hover:shadow flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
              :disabled="isUploading">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>

            <button type="button"
              class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-orange-700 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
              @click="uploadToServer" :disabled="isUploading">
              <svg v-if="!isUploading" class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span class="truncate">{{ isUploading ? 'Uploading...' : 'Upload' }}</span>
            </button>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- DATA PREVIEW TABLE — fixed responsive           -->
        <!-- ═══════════════════════════════════════════════ -->
        <div class="preview mt-6 md:mt-8" v-if="rows && rows.length && !isUploading">

          <!-- Section label + badge -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <h3 class="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Data Preview</h3>
            </div>
            <span class="text-xs bg-orange-100 text-orange-600 px-2 sm:px-3 py-1 rounded-full font-medium shrink-0">
              First 5 of {{ rows.length }} rows
            </span>
          </div>


          <!-- Table wrapper — scrollbar lives INSIDE the bordered box -->
          <div class="w-full rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <!-- This inner div is what scrolls; its scrollbar sits inside the border -->
            <div style="overflow-x: auto; overflow-y: hidden; width: 100%; scrollbar-width: thin; scrollbar-color: #d1d5db transparent;">
              <table class="text-xs border-collapse bg-white" style="min-width: max-content; table-layout: auto;">

                <!-- HEAD -->
                <thead>
                  <tr class="border-b-2 border-gray-200 bg-white">
                    <th v-for="(h, i) in headers" :key="i"
                      class="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap"
                      style="font-size: 11px; min-width: 130px; border-right: 1px solid #f3f4f6;">
                      {{ h }}
                    </th>
                    <th class="px-4 py-3 text-left font-bold text-orange-500 uppercase tracking-wide whitespace-nowrap"
                      style="font-size: 11px; min-width: 80px;">
                      TYPE
                    </th>
                  </tr>
                </thead>

                <!-- BODY -->
                <tbody>
                  <tr v-for="(row, r) in previewRows" :key="r"
                    class="transition-colors"
                    :class="r % 2 !== 0 ? 'bg-green-50/30 hover:bg-green-50/60' : 'bg-white hover:bg-gray-50/60'"
                    style="border-bottom: 1px solid #f3f4f6;">
                    <td v-for="(cell, c) in row" :key="c"
                      class="px-4 py-3 text-gray-700 whitespace-nowrap text-xs"
                      style="border-right: 1px solid #f3f4f6;">
                      {{ cell }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-600">
                      {{ selectedType }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Results Modal -->
    <div v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-4 backdrop-blur-sm">
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden transform transition-all">

        <!-- Modal Header -->
        <div class="p-4 sm:p-5 border-b flex justify-between items-center"
          :class="modalData.failedCount > 0 ? 'bg-orange-50' : 'bg-green-50'">
          <h3 class="font-bold text-base sm:text-lg flex items-center gap-2"
            :class="modalData.failedCount > 0 ? 'text-orange-800' : 'text-green-800'">
            <span class="text-lg sm:text-xl">
              {{ modalData.failedCount > 0 && modalData.successCount > 0 ? '⚠️' :
                 modalData.failedCount > 0 ? '❌' : '✅' }}
            </span>
            <span class="truncate">
              {{ modalData.failedCount > 0 && modalData.successCount > 0 ? 'Partial Import' :
                 modalData.failedCount > 0 ? 'Import Failed' : 'Import Successful' }}
            </span>
          </h3>
          <button type="button" @click="closeModal"
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/50 flex items-center justify-center text-gray-500 hover:text-gray-700 transition">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4 sm:p-6">
          <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div class="text-center p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-100">
              <span class="block text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Saved</span>
              <span class="text-2xl sm:text-3xl font-extrabold text-green-700">{{ modalData.successCount }}</span>
            </div>
            <div class="text-center p-3 sm:p-4 bg-red-50 rounded-lg sm:rounded-xl border border-red-100">
              <span class="block text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Failed</span>
              <span class="text-2xl sm:text-3xl font-extrabold text-red-700">{{ modalData.failedCount }}</span>
            </div>
          </div>

          <div v-if="modalData.errors && modalData.errors.length > 0">
            <p class="text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Error Details
            </p>
            <div class="bg-gray-900 rounded-lg sm:rounded-xl p-2 sm:p-3 max-h-36 sm:max-h-48 overflow-y-auto border border-gray-800">
              <ul class="space-y-1 sm:space-y-2">
                <li v-for="(err, idx) in modalData.errors" :key="idx"
                  class="text-xs font-mono text-red-300 border-b border-gray-800 pb-1 last:border-0 last:pb-0">
                  <span class="text-orange-400 font-bold" v-if="err.row > 0">[Row {{ err.row }}]</span>
                  {{ err.reason }}
                </li>
              </ul>
            </div>
            <p class="text-xs text-gray-400 mt-2 text-right" v-if="modalData.failedCount > modalData.errors.length">
              ...and {{ modalData.failedCount - modalData.errors.length }} more errors
            </p>
          </div>

          <div v-else-if="modalData.failedCount === 0" class="text-center py-3 sm:py-4">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-xs sm:text-sm text-green-600 font-medium">All records successfully added to the database</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 sm:p-5 border-t bg-gray-50 flex justify-end">
          <button type="button" @click="closeModal"
            class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-800 text-white rounded-lg sm:rounded-xl hover:bg-gray-700 transition shadow-md font-medium text-xs sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Always-visible slim scrollbar inside the table wrapper */
div[style*="overflow-x: auto"]::-webkit-scrollbar {
  height: 8px;
}
div[style*="overflow-x: auto"]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-top: 1px solid #e2e8f0;
}
div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

<style scoped>
/* Always-visible slim scrollbar inside the table wrapper */
div[style*="overflow-x: auto"]::-webkit-scrollbar {
  height: 8px;
}
div[style*="overflow-x: auto"]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-top: 1px solid #e2e8f0;
}
div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

<script setup>
import { ref, computed } from "vue"
import axios from "axios"

const fileInput = ref(null)
const rows = ref([])
const headers = ref([])
const fileName = ref("")
const isDragging = ref(false)
const isUploading = ref(false)
const showModal = ref(false)
const modalData = ref({ successCount: 0, failedCount: 0, errors: [] })

// ✅ New Selected Type (Default 'Lec')
const selectedType = ref("Lec")

const previewRows = computed(() => (rows.value || []).slice(0, 5))

// --- 1. CSV Parsing Logic ---
function splitCsvLine(line) {
  const parts = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
  return parts.map(p => {
    let v = p.trim()
    if (v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1).replace(/""/g, '"')
    }
    return v
  })
}

function parseCsv(text) {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l, idx, arr) => !(l.trim() === "" && idx === arr.length - 1))

  if (lines.length === 0) return []
  return lines.map(line => splitCsvLine(line))
}

// --- 2. Handle File ---
async function handleFile(e) {
  isDragging.value = false
  const f = e.target?.files ? e.target.files[0] : e
  if (!f) return

  if (!f.name.toLowerCase().endsWith(".csv")) {
    alert("Please upload a valid .csv file.");
    return;
  }

  try {
    const text = await f.text()
    const parsed = parseCsv(text)

    if (!parsed || parsed.length === 0) {
      alert("CSV appears empty or could not be parsed.");
      return
    }

    headers.value = parsed[0] || []
    rows.value = parsed.slice(1) || []
    fileName.value = f.name
  } catch (err) {
    alert("Failed to parse file: " + err.message);
  }

  if (fileInput.value) fileInput.value.value = null;
}

function handleDrop(e) {
  if (isUploading.value) return;
  isDragging.value = false;
  const f = e.dataTransfer.files && e.dataTransfer.files[0];
  if (f) handleFile(f);
}

function clear() {
  rows.value = [];
  headers.value = [];
  fileName.value = "";
  if (fileInput.value) fileInput.value.value = null;
}

function closeModal() {
  showModal.value = false;
  if (modalData.value.successCount > 0 && modalData.value.failedCount === 0) {
    clear();
  }
}

// --- 3. Preview Download ---
function downloadPreview() {
  // Add 'type' header
  const exportHeaders = [...headers.value, 'type'];

  // Add 'type' value to each row
  const exportRows = rows.value.map(row => [...row, selectedType.value]);

  const allData = [exportHeaders, ...exportRows];

  const csvContent = allData.map(row =>
    row.map(c => {
      if (c == null) return ""
      const s = String(c)
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return '"' + s.replace(/"/g, '""') + '"'
      }
      return s
    }).join(",")
  ).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `preview_${fileName.value || 'data.csv'}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- 4. Upload to Server ---
async function uploadToServer() {
  if (!rows.value || rows.value.length === 0) return;
  isUploading.value = true;

  try {
    // ✅ Add 'type' to headers
    const newHeaders = [...headers.value, 'type'];

    // ✅ Add selectedType value to every row
    const newRows = rows.value.map(row => [...row, selectedType.value]);

    const payload = { headers: newHeaders, rows: newRows };

    const response = await axios.post(
      "http://localhost:9000/api/masterlist/import",
      payload,
      { withCredentials: true }
    );

    modalData.value = {
      successCount: response.data.successCount || 0,
      failedCount: response.data.failedCount || 0,
      errors: response.data.errors || []
    };

    if (response.data.message && !response.data.successCount && !response.data.failedCount) {
      modalData.value.successCount = rows.value.length;
    }

    showModal.value = true;

  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Unknown error";
    modalData.value = {
      successCount: 0,
      failedCount: rows.value.length,
      errors: [{ row: 0, reason: msg }]
    };
    showModal.value = true;
  } finally {
    isUploading.value = false;
  }
}
</script>

<style scoped>
.import-csv {
  max-width: 1080px;
  margin: 0 auto;
  padding: 1.5rem;
}

.dropzone {
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  padding: 2rem;
  background-color: #f9fafb;
}

.dropzone:hover {
  border-color: #16a34a;
}

.dropzone.cursor-not-allowed:hover {
  border-color: #d1d5db;
}

.dropzone.active-drag {
  border-color: #16a34a;
  background-color: #f0fdf4;
}

.upload-btn {
  background-color: #16a34a;
  color: white;
}

.upload-btn:hover {
  background-color: #15803d;
}

/* Mobile Responsive */
@media (max-width: 768px) {

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead {
    display: none;
  }

  tr {
    margin-bottom: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.75rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  td {
    border: none;
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f3f4f6;
    text-align: right;
  }

  td:last-child {
    border-bottom: none;
  }

  td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    font-size: 0.75rem;
    text-align: left;
    margin-right: 1rem;
  }
}
</style>