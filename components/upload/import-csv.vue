<template>
  <div class="import-csv">
    <div class="header-section mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Import Masterlist</h2>
      <p class="text-sm text-gray-500">Upload your masterlist (CSV or Excel).</p>
    </div>

    <div class="dropzone transition-all duration-200 ease-in-out relative overflow-hidden" :class="{
      'active-drag': isDragging,
      'bg-gray-50': !isDragging && !isUploading,
      'border-gray-300': !isDragging && !isUploading,
      'cursor-not-allowed opacity-75 bg-gray-100': isUploading
    }" @dragenter.prevent="!isUploading && (isDragging = true)"
      @dragleave.prevent="!isUploading && (isDragging = false)" @dragover.prevent @drop.prevent="handleDrop"
      @click="!isUploading && fileInput.click()" tabindex="0" role="button"
      @keydown.enter="!isUploading && fileInput.click()">

      <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="handleFile" />

      <div v-if="isUploading" class="text-center flex flex-col items-center justify-center animate-pulse">
        <div class="mb-3 text-5xl text-green-500">
          <svg class="animate-spin h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>
        <p class="font-bold text-gray-600 text-lg">Processing Data...</p>
        <p class="text-xs text-gray-400 mt-1">Please wait while we validate records...</p>
      </div>

      <div v-else class="text-center">
        <div class="mb-3 text-4xl text-gray-300 transition-colors duration-200">
          <i v-if="isDragging" class="fas fa-file-arrow-up text-green-500 transform scale-110 transition-transform"></i>
          <span v-else class="text-gray-300">📄</span>
        </div>

        <div v-if="!rows || rows.length === 0">
          <p class="font-medium text-gray-700">
            <span v-if="isDragging" class="text-green-600">Drop file here</span>
            <span v-else>Drag & drop CSV file here</span>
          </p>
          <p class="text-xs text-gray-400 mt-2">or click to browse</p>
        </div>

        <div v-else>
          <p class="font-semibold text-green-600 text-lg">
            {{ rows.length.toLocaleString() }} rows loaded
          </p>
          <p class="text-xs text-gray-400 mt-1">{{ fileName }}</p>
        </div>
      </div>
    </div>

    <div class="controls mt-6 flex flex-wrap items-center gap-3" v-if="rows && rows.length">

      <div class="flex items-center gap-2 mr-auto">
        <label for="typeSelect" class="text-sm font-medium text-gray-700">Class Type:</label>
        <select v-model="selectedType" id="typeSelect" :disabled="isUploading"
          class="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5">
          <option value="Lec">Lecture</option>
          <option value="Lec-Lab">Lecture-Lab</option>
        </select>
      </div>

      <button type="button" @click="clear"
        class="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 transition"
        :disabled="isUploading">
        Clear
      </button>

      <button type="button" @click="downloadPreview"
        class="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 transition"
        :disabled="isUploading">
        Download Preview
      </button>

      <button type="button"
        class="upload-btn ml-auto px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        @click="uploadToServer" :disabled="isUploading">
        <span v-if="isUploading">Uploading...</span>
        <span v-else>Upload to Server</span>
      </button>
    </div>

    <div class="preview mt-6" v-if="rows && rows.length && !isUploading">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold text-gray-700">Data Preview <span class="text-xs font-normal text-gray-500">(First 5
            Rows)</span></h3>
      </div>
      <div class="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        <table class="w-full text-sm text-left border-collapse">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th v-for="(h, i) in headers" :key="i" class="px-4 py-3 border-b font-semibold whitespace-nowrap">
                {{ h }}
              </th>
              <th class="px-4 py-3 border-b font-semibold whitespace-nowrap text-green-700 bg-green-50">
                Type (New)
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(row, r) in previewRows" :key="r"
              class="hover:bg-green-50 transition-colors odd:bg-white even:bg-gray-50">
              <td v-for="(cell, c) in row" :key="c" class="px-4 py-3 text-gray-700 whitespace-nowrap"
                :data-label="headers[c]">
                {{ cell }}
              </td>
              <td class="px-4 py-3 text-green-700 font-medium whitespace-nowrap bg-green-50" data-label="Type">
                {{ selectedType }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden transform transition-all">

        <div class="p-4 border-b flex justify-between items-center"
          :class="modalData.failedCount > 0 ? 'bg-orange-50' : 'bg-green-50'">
          <h3 class="font-bold text-lg flex items-center"
            :class="modalData.failedCount > 0 ? 'text-orange-800' : 'text-green-800'">
            <span class="mr-2 text-xl">{{ modalData.failedCount > 0 ? '⚠️' : '🎉' }}</span>
            <span v-if="modalData.failedCount > 0 && modalData.successCount > 0">Partial Import</span>
            <span v-else-if="modalData.failedCount > 0">Import Failed</span>
            <span v-else>Import Successful</span>
          </h3>
          <button type="button" @click="closeModal"
            class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <span class="block text-xs font-semibold text-green-600 uppercase tracking-wide">Saved</span>
              <span class="text-3xl font-extrabold text-green-700">{{ modalData.successCount }}</span>
            </div>
            <div class="text-center p-3 bg-red-50 rounded-lg border border-red-100">
              <span class="block text-xs font-semibold text-red-600 uppercase tracking-wide">Failed</span>
              <span class="text-3xl font-extrabold text-red-700">{{ modalData.failedCount }}</span>
            </div>
          </div>

          <div v-if="modalData.errors && modalData.errors.length > 0">
            <p class="text-sm font-bold text-gray-700 mb-2">📋 Error Details</p>
            <div class="bg-gray-900 rounded-md p-3 max-h-48 overflow-y-auto border border-gray-700 shadow-inner">
              <ul class="space-y-2">
                <li v-for="(err, idx) in modalData.errors" :key="idx"
                  class="text-xs font-mono text-red-300 border-b border-gray-700 pb-1 last:border-0 last:pb-0">
                  <span class="text-yellow-400 font-bold" v-if="err.row > 0">[Row {{ err.row }}]</span>
                  {{ err.reason }}
                </li>
              </ul>
            </div>
            <p class="text-xs text-gray-400 mt-2 text-right" v-if="modalData.failedCount > modalData.errors.length">
              ...and {{ modalData.failedCount - modalData.errors.length }} more errors.
            </p>
          </div>

          <div v-else-if="modalData.failedCount === 0" class="text-center py-4 text-green-600 font-medium">
            All records successfully added to the database.
          </div>
        </div>

        <div class="p-4 border-t bg-gray-50 flex justify-end">
          <button type="button" @click="closeModal"
            class="px-5 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition shadow-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

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