<template>
  <div class="import-csv">
    <h2 class="text-xl font-semibold mb-4">Import CSV</h2>

    <!-- Dropzone -->
    <div
      class="dropzone"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="fileInput.click()"
      tabindex="0"
      role="button"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".csv"
        class="hidden"
        @change="handleFile"
      />

      <p v-if="!rows || rows.length === 0">
        Drag & drop a CSV file here, or click to choose one
      </p>
      <p v-else>
        {{ rows.length }} rows loaded — showing preview
      </p>
    </div>

    <!-- Controls -->
    <div class="controls" v-if="rows && rows.length">
      <button @click="clear">Clear</button>
      <button @click="downloadPreview">Download Preview</button>
      <button class="upload-btn" @click="uploadToServer">Upload to Server</button>
    </div>

    <!-- Preview Table -->
    <div class="preview mt-4" v-if="rows && rows.length">
      <!-- Responsive wrapper -->
      <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="w-full text-sm text-left border-collapse">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th
                v-for="(h, i) in headers"
                :key="i"
                class="px-4 py-3 border-b font-semibold"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, r) in previewRows"
              :key="r"
              class="odd:bg-white even:bg-gray-50 hover:bg-green-50 transition"
            >
              <td
                v-for="(cell, c) in row"
                :key="c"
                class="px-4 py-3 border-b text-gray-800"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="note mt-2 text-sm text-gray-600">
        Showing first {{ previewRows.length }} rows (of {{ rows.length }})
      </p>
    </div>

    <!-- Messages -->
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import axios from "axios"

const fileInput = ref(null)
const rows = ref([])       // always array
const headers = ref([])    // always array
const error = ref("")
const success = ref("")

const previewRows = computed(() => (rows.value || []).slice(0, 10))

// --- CSV parsing helpers ---
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

// --- Handle file input ---
async function handleFile(e) {
  error.value = ""
  success.value = ""

  const f = e.target?.files ? e.target.files[0] : e
  if (!f) return

  if (!f.name.toLowerCase().endsWith(".csv")) {
    error.value = "Please select a .csv file."
    return
  }

  const text = await f.text()
  const parsed = parseCsv(text)

  if (!parsed || parsed.length === 0) {
    error.value = "CSV appears empty or could not be parsed."
    return
  }

  headers.value = parsed[0] || []
  rows.value = parsed.slice(1) || []
}

function handleDrop(e) {
  const f = e.dataTransfer.files && e.dataTransfer.files[0]
  if (f) handleFile(f)
}

function clear() {
  rows.value = []
  headers.value = []
  error.value = ""
  success.value = ""
  if (fileInput.value) fileInput.value.value = null
}

// --- Preview download ---
function downloadPreview() {
  const all = [headers.value, ...rows.value.slice(0, 50)]
  const csv = all
    .map(r =>
      r
        .map(c => {
          if (c == null) return ""
          const s = String(c)
          if (s.includes(",") || s.includes('"') || s.includes("\n")) {
            return '"' + s.replace(/"/g, '""') + '"'
          }
          return s
        })
        .join(",")
    )
    .join("\n")

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "preview.csv"
  a.click()
  URL.revokeObjectURL(url)
}

// --- Upload to backend ---
async function uploadToServer() {
  try {
    error.value = ""
    success.value = ""

    if (!rows.value || rows.value.length === 0) {
      error.value = "No data to upload."
      return
    }

    const payload = { headers: headers.value, rows: rows.value }
    await axios.post("http://localhost:9000/api/masterlist/import", payload)

    success.value = "CSV uploaded successfully!"
    clear()
  } catch (err) {
    error.value =
      "Upload failed: " + (err.response?.data?.message || err.message)
  }
}
</script>

<style scoped>
.import-csv {
  max-width: 1080px;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 8px;
}
.dropzone {
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  padding: 1rem;
  text-align: center;
}
.controls {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
button {
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}
button:hover {
  background: #e5e7eb;
}
.upload-btn {
  background-color: #16a34a;
  color: white;
  font-weight: 500;
}
.upload-btn:hover {
  background-color: #15803d;
}
.success {
  color: #15803d;
  margin-top: 0.75rem;
}
.error {
  color: #b91c1c;
  margin-top: 0.75rem;
}

/* Mobile card view */
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
    padding: 0.5rem;
  }
  td {
    border: none;
    padding: 0.25rem 0.5rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
  }
  td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #374151;
  }
}
</style>
