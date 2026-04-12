<template>
  <div v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 md:p-6 backdrop-blur-lg">
    <!-- Success Message Component -->
    <success-message ref="successMessage"></success-message>

    <!-- Validation Modal for Weight Matrix -->
    <div v-if="validationModal.open"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-lg p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <!-- Icon & Title -->
        <div class="flex items-start gap-4 mb-4">
          <div :class="[
            'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
            validationModal.type === 'below' ? 'bg-orange-100' : 'bg-red-100'
          ]">
            <svg :class="validationModal.type === 'below' ? 'text-orange-600' : 'text-red-600'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">{{ validationModal.title }}</h3>
            <p :class="['text-sm mt-1', validationModal.type === 'below' ? 'text-orange-600' : 'text-red-600']">
              {{ validationModal.subtitle }}
            </p>
          </div>
        </div>

        <!-- Message -->
        <div :class="[
          'rounded-lg p-4 mb-6',
          validationModal.type === 'below' ? 'bg-orange-50 border border-orange-200' : 'bg-red-50 border border-red-200'
        ]">
          <p :class="['text-sm', validationModal.type === 'below' ? 'text-orange-800' : 'text-red-800']">
            {{ validationModal.message }}
          </p>
          <p class="text-sm font-bold mt-2" :class="validationModal.type === 'below' ? 'text-orange-600' : 'text-red-600'">
            Current Total: {{ grandTotal }}%
          </p>
        </div>

        <!-- Action Button -->
        <div class="flex justify-end">
          <button @click="closeValidationModal"
            class="px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-all transform hover:-translate-y-0.5"
            :class="validationModal.type === 'below' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'">
            Understood
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[92vh] overflow-hidden font-inria animate-popInDown flex flex-col">

      <!-- Header -->
      <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg md:text-xl font-bold font-epundaslab">OBE Syllabus Setup</h2>
              <span v-if="isLocked"
                class="flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                LOCKED
              </span>
            </div>
            <p class="text-xs text-white/80 mt-0.5 flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-green-300 rounded-full"></span>
              {{ activeSubject ? activeSubject.subjcode : 'No Subject Selected' }} • Section: {{ activeSubject ? (activeSubject.section || activeSubject.sect) : 'N/A' }}
            </p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition-colors">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Locked Banner -->
      <div v-if="isLocked"
        class="bg-amber-50 border-b border-amber-200 px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-amber-800">Syllabus is locked — grading data is protected</p>
            <p class="text-[10px] text-amber-600 mt-0.5">This syllabus has already been saved.</p>
          </div>
        </div>
        <button @click="requestUnlock"
          class="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          Unlock to Edit
        </button>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 overflow-y-auto flex-1 bg-gradient-to-br from-gray-50 to-gray-100">

        <!-- Add Assessment Type -->
        <div class="mb-5 p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          :class="{ 'opacity-50 pointer-events-none select-none': isLocked }">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">System Utility</span>
              <p class="text-xs text-gray-600">Register New Assessment Type</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div class="flex gap-2 flex-1">
              <input v-model="newType.name" placeholder="Name (e.g. Field Trip)" :disabled="isLocked"
                class="text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-50 flex-1 focus:ring-2 focus:ring-orange-400 outline-none disabled:cursor-not-allowed" />
              <input v-model="newType.code" placeholder="Code" :disabled="isLocked"
                class="text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-50 w-20 focus:ring-2 focus:ring-orange-400 outline-none disabled:cursor-not-allowed" />
            </div>
            <button @click="addNewAssessmentType" :disabled="isLocked"
              class="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Register Type
            </button>
          </div>
        </div>

        <!-- Two-Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <!-- LEFT: Course Outcomes -->
          <div class="lg:col-span-4 flex flex-col">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2">
                <div class="w-1 h-6 bg-orange-400 rounded-full"></div>
                <h4 class="font-bold text-gray-700 text-sm">Course Outcomes</h4>
              </div>
              <button @click="addCO" :disabled="isLocked"
                class="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-200 transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add CO
              </button>
            </div>
            <div class="space-y-3">
              <div v-for="(co, idx) in localOutcomes" :key="'co-' + idx"
                class="p-4 bg-white rounded-xl border border-gray-200 shadow-sm relative group transition-all"
                :class="isLocked ? 'opacity-70' : 'hover:shadow-md hover:border-orange-300'">
                <div v-if="isLocked" class="absolute top-3 right-3 text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button v-if="!isLocked" @click="removeCO(idx)"
                  class="absolute top-3 right-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full w-7 h-7 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div class="mb-2">
                  <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Code</label>
                  <input v-model="co.co_code" placeholder="e.g., CO1" :disabled="isLocked"
                    :class="isLocked ? 'cursor-not-allowed text-gray-500 border-gray-100' : 'focus:border-orange-400'"
                    class="font-bold text-base w-full bg-transparent border-b-2 border-gray-100 outline-none uppercase transition-colors" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Description</label>
                  <textarea v-model="co.description" placeholder="Describe the course outcome..." rows="2"
                    :disabled="isLocked"
                    :class="isLocked ? 'cursor-not-allowed text-gray-500' : 'focus:ring-2 focus:ring-orange-400 focus:border-transparent'"
                    class="text-xs w-full bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none resize-none"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: TOS Weight Matrix -->
          <div class="lg:col-span-8 flex flex-col">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2">
                <div class="w-1 h-6 bg-blue-400 rounded-full"></div>
                <h4 class="font-bold text-gray-700 text-sm">Assessment Weight Matrix (TOS)</h4>
                <span class="text-[10px] text-gray-400 font-inria">— each cell is the % weight for that assessment in that CO</span>
              </div>
            </div>

            <!-- Add assessment row — dropdown -->
            <div v-if="!isLocked" class="mb-3 flex items-center gap-2">
              <label class="text-xs text-gray-500 font-inria shrink-0">Add to TOS:</label>
              <div class="flex items-center gap-2">
                <select v-model="selectedTypeToAdd"
                  class="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-400 outline-none text-gray-700 min-w-[220px]">
                  <option value="">— Select assessment type —</option>
                  <option v-for="type in assessmentTypes" :key="'opt-' + type.type_id" :value="type.type_id">
                    [{{ type.code }}] {{ type.name }}
                  </option>
                </select>
                <button @click="addTypeFromDropdown"
                  :disabled="!selectedTypeToAdd"
                  class="flex items-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Row
                </button>
              </div>
            </div>

            <!-- The Matrix Table -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" :class="{ 'opacity-70': isLocked }">
              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <!-- Row 1: column headers -->
                    <tr>
                      <th class="bg-gray-800 text-white px-4 py-2.5 text-left text-xs font-bold tracking-wider border-r border-gray-700 min-w-[60px]">Code</th>
                      <th class="bg-gray-800 text-white px-4 py-2.5 text-left text-xs font-bold tracking-wider border-r border-gray-700 min-w-[160px]">Assessment Task</th>
                      <th class="bg-orange-500 text-white px-3 py-2.5 text-center text-xs font-bold tracking-wider border-r border-orange-400 min-w-[72px]">Total %</th>
                      <th v-for="co in localOutcomes" :key="'hdr-' + co.co_code"
                        class="bg-gray-700 text-white px-3 py-2.5 text-center text-xs font-bold tracking-wider border-r border-gray-600 min-w-[72px]">
                        {{ co.co_code }}
                      </th>
                      <th v-if="!isLocked" class="bg-gray-800 text-white px-2 py-2.5 text-center text-xs min-w-[40px]"></th>
                    </tr>
                    <!-- Row 2: column totals -->
                    <tr class="border-b-2 border-gray-300">
                      <td class="bg-gray-100 px-4 py-2 border-r border-gray-200"></td>
                      <td class="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 border-r border-gray-200">Column Totals</td>
                      <!-- Grand total of all cells -->
                      <td class="px-3 py-2 text-center border-r border-gray-200"
                        :class="grandTotal === 100 ? 'bg-green-100' : 'bg-red-50'">
                        <span class="text-sm font-black" :class="grandTotal === 100 ? 'text-green-700' : 'text-red-600'">
                          {{ grandTotal }}
                        </span>
                      </td>
                      <!-- Per-CO column totals -->
                      <td v-for="co in localOutcomes" :key="'coltotal-' + co.co_code"
                        class="px-3 py-2 text-center border-r border-gray-200 bg-gray-50">
                        <span class="text-xs font-bold text-gray-600">{{ getCoColumnTotal(co.co_code) }}</span>
                      </td>
                      <td v-if="!isLocked" class="bg-gray-100"></td>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <!-- One row per assessment type in the matrix -->
                    <tr v-for="(typeId, rowIdx) in matrixRows" :key="'row-' + typeId + '-' + rowIdx"
                      class="transition-colors"
                      :class="isDuplicateRow(typeId, rowIdx) ? 'bg-red-50' : 'hover:bg-orange-50/20'">
                      <!-- Code -->
                      <td class="px-4 py-2.5 border-r border-gray-100">
                        <div class="flex items-center gap-1.5">
                          <span class="text-xs font-black uppercase"
                            :class="isDuplicateRow(typeId, rowIdx) ? 'text-red-600' : 'text-gray-700'">
                            {{ getTypeProp(typeId, 'code') }}
                          </span>
                          <span v-if="isDuplicateRow(typeId, rowIdx)"
                            title="Duplicate assessment type"
                            class="inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white rounded-full flex-shrink-0">
                            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4m0 4h.01" />
                            </svg>
                          </span>
                        </div>
                        <span v-if="isDuplicateRow(typeId, rowIdx)" class="text-[9px] text-red-500 font-bold">DUPLICATE</span>
                      </td>
                      <!-- Name -->
                      <td class="px-4 py-2.5 border-r border-gray-100">
                        <span class="text-xs italic" :class="isDuplicateRow(typeId, rowIdx) ? 'text-red-500' : 'text-gray-600'">
                          {{ getTypeProp(typeId, 'name') }}
                        </span>
                      </td>
                      <!-- Row total (sum across all COs) -->
                      <td class="px-3 py-2.5 border-r border-gray-200 text-center"
                        :class="getRowTotal(rowIdx) > 0 ? 'bg-orange-50/60' : ''">
                        <span class="text-xs font-black" :class="getRowTotal(rowIdx) > 0 ? 'text-orange-600' : 'text-gray-300'">
                          {{ getRowTotal(rowIdx) || 0 }}
                        </span>
                      </td>
                      <!-- CO cells -->
                      <td v-for="co in localOutcomes" :key="'cell-' + rowIdx + '-' + co.co_code"
                        class="px-2 py-2 text-center border-r border-gray-100">
                        <input
                          type="text"
                          inputmode="numeric"
                          pattern="[0-9]*"
                          :value="getCellValue(rowIdx, co.co_code) || ''"
                          @input="setCellValue(rowIdx, co.co_code, $event.target.value)"
                          @blur="sanitizeCellOnBlur(rowIdx, co.co_code, $event.target)"
                          @keydown="blockNonNumericKeys($event)"
                          :disabled="isLocked"
                          class="w-14 text-center text-xs font-bold rounded-lg px-1 py-1.5 outline-none transition-all"
                          :class="[
                            isLocked ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'focus:ring-2 focus:ring-orange-400',
                            getCellValue(rowIdx, co.co_code) > 0
                              ? (isDuplicateRow(typeId, rowIdx) ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-orange-50 text-orange-700 border border-orange-200')
                              : 'bg-gray-50 text-gray-300 border border-gray-100'
                          ]"
                          placeholder="0"
                        />
                      </td>
                      <!-- Remove row -->
                      <td v-if="!isLocked" class="px-2 py-2.5 text-center">
                        <button @click="removeTypeFromMatrix(rowIdx)"
                          class="transition-colors p-1 rounded"
                          :class="isDuplicateRow(typeId, rowIdx) ? 'text-red-400 hover:text-red-600' : 'text-gray-300 hover:text-red-500'">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>

                    <!-- Empty state -->
                    <tr v-if="matrixRows.length === 0">
                      <td :colspan="localOutcomes.length + 3 + (isLocked ? 0 : 1)" class="px-4 py-8 text-center text-gray-400">
                        <svg class="w-10 h-10 mx-auto text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                        </svg>
                        <p class="text-xs">No assessment types added yet. Use the buttons above to add rows.</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Validation Status -->
            <div class="mt-4 p-4 bg-white rounded-xl border-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all"
              :class="grandTotal === 100 ? 'border-green-200 bg-green-50/20' : 'border-red-200 bg-red-50/20'">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="grandTotal === 100 ? 'bg-green-100' : 'bg-red-100'">
                  <svg v-if="grandTotal === 100" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Validation</span>
                  <span class="text-xs font-medium text-gray-600">
                    {{ grandTotal === 100 ? 'Total weights sum to 100% — ready to save' : 'All cells must sum to exactly 100%' }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">Grand Total:</span>
                <span class="text-2xl font-black" :class="grandTotal === 100 ? 'text-green-600' : 'text-red-600'">{{ grandTotal }}%</span>
              </div>
            </div>

            <!-- Error toast -->
            <div v-if="showWeightError"
              class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fade-in">
              <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-xs text-red-600">Total weight must equal 100% before saving. Current: {{ grandTotal }}%</span>
              <button @click="showWeightError = false" class="ml-auto text-red-400 hover:text-red-600">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
        <button @click="$emit('close')"
          class="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          {{ isLocked ? 'Close' : 'Cancel' }}
        </button>
        <button v-if="!isLocked" @click="submitSyllabus" :disabled="grandTotal !== 100"
          class="w-full sm:w-auto px-6 sm:px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Confirm & Save Syllabus
        </button>
        <div v-else class="w-full sm:w-auto px-6 sm:px-8 py-2.5 bg-gray-100 text-gray-400 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Syllabus Saved & Locked
        </div>
      </div>
    </div>

    <!-- Unlock Confirmation Modal -->
    <div v-if="unlockModal.open"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-lg p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
        <!-- Icon & Title -->
        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0-11a9 9 0 110 18 9 9 0 010-18zM12 5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">Unlock Syllabus?</h3>
            <p class="text-sm text-gray-500 mt-1">This action cannot be undone</p>
          </div>
        </div>

        <!-- Warning Message -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-gray-700 leading-relaxed">
            <span class="font-bold text-red-600">⚠️ WARNING:</span> Unlocking the syllabus allows edits. Only <strong>removed Course Outcomes</strong> or <strong>Assessment Types</strong> will delete related scores:
          </p>
          <ul class="list-disc list-inside mt-3 space-y-1 text-sm text-gray-600">
            <li>Scores for Course Outcomes you REMOVE will be deleted</li>
            <li>Scores for Course Outcomes you KEEP are preserved</li>
            <li>Changes to assessment weights alone will NOT reset scores</li>
          </ul>
          <p class="text-sm text-gray-700 font-bold mt-3">
            Proceed with confidence — only removed outcomes will affect grading data.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 justify-end">
          <button @click="cancelUnlock"
            class="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            No, Cancel
          </button>
          <button @click="confirmUnlock"
            class="px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Yes, Unlock & Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SuccessMessage from '~/components/success-message.vue'

export default {
  name: 'ObeSetupModal',
  components: { SuccessMessage },
  props: {
    isOpen:        Boolean,
    activeSubject: Object,
  },
  data: function () {
    return {
      localOutcomes:    [{ co_code: 'CO1', description: '' }],
      assessmentTypes:  [],
      newType:          { name: '', code: '' },
      showWeightError:  false,
      isLocked:         false,
      unlockModal:      { open: false },  // NEW: Unlock confirmation modal state
      validationModal:  {
        open: false,
        type: '',  // 'below' or 'above'
        title: '',
        subtitle: '',
        message: '',
      },

      // ── TOS Matrix ─────────────────────────────────────────────────
      // matrixRows: ordered list of type_ids (duplicates allowed)
      matrixRows:       [],
      // weightMatrix: array of { typeId, cells: { [co_code]: number } }
      //   indexed by row position, so duplicates are independent
      weightMatrix:     [],
      selectedTypeToAdd: '',
    }
  },
  computed: {
    // Grand total = sum of every cell across all rows
    grandTotal: function () {
      var self = this
      var total = 0
      this.matrixRows.forEach(function (_, rowIdx) {
        total += self.getRowTotal(rowIdx)
      })
      return total
    },
    hasDuplicates: function () {
      var seen = {}
      return this.matrixRows.some(function (typeId) {
        if (seen[typeId]) return true
        seen[typeId] = true
        return false
      })
    },
  },
  watch: {
    isOpen: async function (val) {
      if (val) {
        this.showWeightError = false
        this.isLocked        = false
        await this.fetchTypes()
        await this.loadExistingSyllabus()
      }
    },
    // When a new CO is added, ensure all matrix rows have a key for it (default 0)
    localOutcomes: {
      deep: true,
      handler: function (newVal) {
        var self = this
        newVal.forEach(function (co) {
          self.weightMatrix.forEach(function (row) {
            if (row.cells[co.co_code] === undefined) {
              self.$set(row.cells, co.co_code, 0)
            }
          })
        })
      },
    },
  },
  methods: {
    // ── Duplicate detection ───────────────────────────────────────
    isDuplicateRow: function (typeId, rowIdx) {
      return this.matrixRows.indexOf(typeId) !== rowIdx
    },

    // ── Cell helpers (index-based) ────────────────────────────────
    getCellValue: function (rowIdx, coCode) {
      var row = this.weightMatrix[rowIdx]
      if (!row) return 0
      return row.cells[coCode] || 0
    },
    setCellValue: function (rowIdx, coCode, raw) {
      // Strip anything that isn't a digit then floor to integer
      var cleaned = String(raw).replace(/[^0-9]/g, '')
      var val = cleaned === '' ? 0 : Math.floor(parseInt(cleaned, 10))
      if (isNaN(val) || val < 0) val = 0
      if (val > 100) val = 100
      var row = this.weightMatrix[rowIdx]
      if (!row) return
      this.$set(row.cells, coCode, val)
    },
    // Called on blur — writes the clean integer back into the input so the
    // displayed value always matches the stored integer (no trailing dots, etc.)
    sanitizeCellOnBlur: function (rowIdx, coCode, inputEl) {
      var stored = this.getCellValue(rowIdx, coCode)
      // Show empty string when 0 so the placeholder is visible
      inputEl.value = stored > 0 ? String(stored) : ''
    },
    // Block arrow-up / arrow-down / wheel so the value never auto-increments
    blockNonNumericKeys: function (evt) {
      if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
        evt.preventDefault()
      }
    },
    getRowTotal: function (rowIdx) {
      var self = this
      var row  = this.weightMatrix[rowIdx]
      if (!row) return 0
      return this.localOutcomes.reduce(function (sum, co) {
        return sum + (row.cells[co.co_code] || 0)
      }, 0)
    },
    getCoColumnTotal: function (coCode) {
      var self = this
      return this.weightMatrix.reduce(function (sum, row) {
        return sum + (row ? (row.cells[coCode] || 0) : 0)
      }, 0)
    },
    getTypeProp: function (typeId, prop) {
      var t = this.assessmentTypes.find(function (x) { return x.type_id === typeId })
      return t ? t[prop] : '—'
    },

    // ── Matrix row management ─────────────────────────────────────
    addTypeFromDropdown: function () {
      var typeId = parseInt(this.selectedTypeToAdd, 10)
      if (!typeId) return
      var typeName = this.getTypeProp(typeId, 'name')
      this._pushMatrixRow(typeId)
      this.selectedTypeToAdd = ''
      this.$refs.successMessage.show('✓ Added "' + typeName + '" assessment type successfully!', 'success', 2000)
    },
    _pushMatrixRow: function (typeId) {
      var self  = this
      var cells = {}
      this.localOutcomes.forEach(function (co) { cells[co.co_code] = 0 })
      this.matrixRows.push(typeId)
      this.weightMatrix.push({ typeId: typeId, cells: cells })
    },
    removeTypeFromMatrix: function (rowIdx) {
      var typeId = this.matrixRows[rowIdx]
      var typeName = this.getTypeProp(typeId, 'name')
      this.matrixRows.splice(rowIdx, 1)
      this.weightMatrix.splice(rowIdx, 1)
      this.$refs.successMessage.show('✓ Deleted "' + typeName + '" from matrix', 'success', 2000)
    },

    // ── Unlock ───────────────────────────────────────────────────
    requestUnlock: function () {
      // Show modal instead of browser alert
      this.unlockModal.open = true
    },

    confirmUnlock: function () {
      // User confirmed to unlock
      this.unlockModal.open = false
      this.isLocked = false
    },

    cancelUnlock: function () {
      // User cancelled unlock
      this.unlockModal.open = false
    },

    // ── CO management ────────────────────────────────────────────
    addCO: function () {
      var nextNum = this.localOutcomes.length + 1
      var newCode = 'CO' + nextNum
      this.localOutcomes.push({ co_code: newCode, description: '' })
      // Ensure all matrix rows get a 0 cell for the new CO
      var self = this
      this.weightMatrix.forEach(function (row) {
        self.$set(row.cells, newCode, 0)
      })
      // Show real-time notification
      this.$refs.successMessage.show('✓ Added ' + newCode + ' successfully!', 'success', 2000)
    },
    removeCO: function (idx) {
      if (this.localOutcomes.length <= 1) return
      var removedCode = this.localOutcomes[idx].co_code
      this.localOutcomes.splice(idx, 1)
      this.weightMatrix.forEach(function (row) {
        delete row.cells[removedCode]
      })
      this.$refs.successMessage.show('✓ Deleted "' + removedCode + '" successfully!', 'success', 2000)
    },

    // ── Fetch assessment types ────────────────────────────────────
    fetchTypes: async function () {
      try {
        var res = await this.$axios.get('/obe/assessment-types')
        this.assessmentTypes = res.data
      } catch (e) {
        console.error('Could not load assessment types', e)
      }
    },

    // ── Add new assessment type ───────────────────────────────────
    addNewAssessmentType: async function () {
      if (!this.newType.name || !this.newType.code) return
      try {
        var payload = {
          name:  this.newType.name.trim(),
          code:  this.newType.code.trim(),
          empid: this.$parent.user.empid,
        }
        var res = await this.$axios.post('/obe/assessment-types', payload)
        this.assessmentTypes.push(res.data)
        this.newType = { name: '', code: '' }
        this.$refs.successMessage.show('✓ New assessment type "' + payload.name + '" registered successfully!', 'success', 2500)
      } catch (e) {
        console.error('Failed to register assessment type:', e)
        this.$refs.successMessage.show('✗ Failed to add type. The code might already be taken.', 'error', 3000)
      }
    },

    // ── Save ─────────────────────────────────────────────────────
    submitSyllabus: async function () {
      if (this.grandTotal !== 100) {
        this.showWeightError = true
        
        // Determine if it's below or above 100%
        if (this.grandTotal < 100) {
          this.validationModal = {
            open: true,
            type: 'below',
            title: 'Assessment Weight Below 100%',
            subtitle: 'Validation Error',
            message: 'The total assessment weight must be equal to 100%. Currently it is ' + this.grandTotal + '%. Please increase the percentages in the matrix cells to reach exactly 100%.'
          }
        } else {
          this.validationModal = {
            open: true,
            type: 'above',
            title: 'Assessment Weight Above 100%',
            subtitle: 'Validation Error',
            message: 'The total assessment weight must be equal to 100%. Currently it is ' + this.grandTotal + '%. Please decrease the percentages in the matrix cells to reach exactly 100%.'
          }
        }
        return
      }
      try {
        var self    = this
        var weights = []

        this.matrixRows.forEach(function (typeId, rowIdx) {
          self.localOutcomes.forEach(function (co) {
            var val = self.getCellValue(rowIdx, co.co_code)
            if (val > 0) {
              weights.push({
                co_code:           co.co_code,
                type_id:           typeId,
                weight_percentage: val,
              })
            }
          })
        })

        var payload = {
          subjcode: this.activeSubject.subjcode,
          section:  (this.activeSubject.section || this.activeSubject.sect || 'N-A').trim(),
          sy:       this.$parent.selectedYear       || '2025-2026',
          sem:      this.$parent.selectedSemester   || '1st',
          empid:    this.$parent.user.empid,
          outcomes: this.localOutcomes,
          weights,
        }

        console.log('[OBE Modal] Submitting syllabus with payload:', payload)
        await this.$axios.post('/obe/course-outcome/batch', payload)
        this.$refs.successMessage.show('✅ Syllabus saved successfully! Refreshing data...', 'success', 3000)
        this.isLocked = true
        
        // Emit save event to trigger parent refresh
        this.$emit('save')
        
        // Close modal after brief delay to allow parent to process
        setTimeout(() => {
          this.$emit('close')
        }, 500)
      } catch (e) {
        console.error('[OBE Modal] Save error:', e)
        console.error('[OBE Modal] Error response:', e.response)
        
        var errorMsg = 'Error saving syllabus. Check backend logs.'
        if (e.response && e.response.data) {
          errorMsg = e.response.data.message || e.response.data.error || errorMsg
        } else if (e.message) {
          errorMsg = e.message
        }
        
        this.$refs.successMessage.show('❌ Failed to save: ' + errorMsg, 'error', 4000)
      }
    },

    // ── Close validation modal ────────────────────────────────────
    closeValidationModal: function () {
      this.validationModal.open = false
    },

    // ── Load existing syllabus ────────────────────────────────────
    loadExistingSyllabus: async function () {
      if (!this.activeSubject || !this.$parent.user) return

      // Reset state
      this.matrixRows   = []
      this.weightMatrix = []

      try {
        var empid       = this.$parent.user.empid
        var subj        = this.activeSubject.subjcode
        var rawSection  = this.activeSubject.section || this.activeSubject.sect || 'N-A'
        var sect        = encodeURIComponent(rawSection.trim())
        var url         = '/obe/syllabus/' + empid + '/' + encodeURIComponent(subj) + '/' + sect
        var res         = await this.$axios.get(url)
        var data        = res.data

        if (data && data.length > 0) {
          // Build CO list
          var coMap = new Map()
          data.forEach(function (c) { if (!coMap.has(c.co_id)) coMap.set(c.co_id, c) })
          var uniqueCOs = Array.from(coMap.values())
          this.localOutcomes = uniqueCOs.map(function (co) {
            return { co_code: co.co_code, description: co.description }
          })

          // Build matrix from tosWeights
          var self          = this
          var allDecimal    = true // detect if backend returns decimals

          uniqueCOs.forEach(function (co) {
            if (co.tosWeights && co.tosWeights.length > 0) {
              co.tosWeights.forEach(function (tw) {
                if (tw.weight_percentage >= 1) allDecimal = false
              })
            }
          })

          uniqueCOs.forEach(function (co) {
            if (co.tosWeights && co.tosWeights.length > 0) {
              co.tosWeights.forEach(function (tw) {
                var typeId = tw.type_id
                var pct    = allDecimal
                  ? Math.floor(tw.weight_percentage * 100)
                  : Math.floor(tw.weight_percentage)

                // Find existing row for this typeId, or add one
                var existingRowIdx = self.matrixRows.indexOf(typeId)
                if (existingRowIdx === -1) {
                  self._pushMatrixRow(typeId)
                  existingRowIdx = self.matrixRows.length - 1
                }
                self.$set(self.weightMatrix[existingRowIdx].cells, co.co_code, pct)
              })
            }
          })

          this.isLocked = true
        } else {
          // Fresh start
          this.localOutcomes = [{ co_code: 'CO1', description: '' }]
          this.isLocked      = false
        }
      } catch (e) {
        console.error('Syllabus fetch failed', e)
        this.localOutcomes = [{ co_code: 'CO1', description: '' }]
        this.isLocked      = false
      }
    },
  },
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to   { opacity: 1; transform: translateY(0);    }
}

@keyframes popInDown {
  0% {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-popInDown {
  animation: popInDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
