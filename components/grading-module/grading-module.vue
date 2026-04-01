<template>
  <div class="font-inria min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">

    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-epundaslab font-bold text-gray-800">OBE Grading Sheet</h1>
        <p class="text-xs text-gray-500 flex items-center gap-2">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          Outcome-Based Education • Real-time Assessment
        </p>
      </div>
      <div v-if="activeSubject" class="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 self-start sm:self-auto">
        <span class="text-sm font-bold text-orange-500">{{ activeSubject.subjcode }}</span>
        <span class="text-xs text-gray-400 ml-2">Sec {{ activeSubject.section || activeSubject.sect }}</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border border-gray-100">
      <div class="flex flex-wrap gap-2 w-full sm:w-auto">
        <button @click="addActivity"
          class="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 md:px-4 py-2.5 rounded-xl text-xs font-bold hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 flex-1 sm:flex-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Activity
        </button>

        <button @click="openRubricsModal"
          class="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 md:px-4 py-2.5 rounded-xl text-xs font-bold hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 flex-1 sm:flex-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Laboratory Rubrics
        </button>

        <button @click="saveGrades" :disabled="saving"
          class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 md:px-4 py-2.5 rounded-xl text-xs font-bold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2 flex-1 sm:flex-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {{ saving ? 'Saving...' : 'Save Scores' }}
        </button>

        <button @click="computeGrades" :disabled="computing"
          class="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 md:px-4 py-2.5 rounded-xl text-xs font-bold hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2 flex-1 sm:flex-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {{ computing ? 'Computing...' : 'Compute OBE Grades' }}
        </button>
      </div>

      <div class="relative w-full sm:w-56">
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" placeholder="Search student..."
          class="border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-400 text-sm font-inria">Loading OBE gradebook…</p>
    </div>

    <!-- Grading Table -->
    <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full border-collapse text-sm table-fixed">
            <thead>
              <!-- ── Row 1: CO group headers ── -->
              <tr v-if="hasAnyActivity">
                <th colspan="2" class="sticky left-0 z-30 bg-white px-4 py-1 text-right font-extrabold italic text-black text-[13px] border-r border-gray-200 bg-clip-padding" style="min-width:240px; padding-right: 0.75rem;">
                  Course Outcomes
                </th>
                <th v-for="group in coGroups" :key="'hdr-' + group.co_code" :colspan="group.activities.length || 1"
                  class="border border-gray-300 px-2 py-2 text-center font-black text-white text-xs uppercase tracking-wider"
                  :style="{ backgroundColor: group.color, borderColor: group.color, width: (group.activities.length * 100) + 'px' }">
                  <div class="flex items-center justify-center gap-1 truncate">
                    <span class="truncate">{{ group.co_code }}</span>
                  </div>
                </th>
              </tr>

              <!-- ── Row 2: Assessment type code ── -->
              <tr v-if="hasAnyActivity">
                <th colspan="2" class="sticky left-0 z-30 bg-white px-4 py-1 text-right font-extrabold italic text-black text-[13px] border-r border-gray-200 bg-clip-padding" style="min-width:240px; padding-right: 0.75rem;">
                  Assessment Task
                </th>
                <template v-for="group in coGroups">
                  <td v-for="act in group.activities" :key="'type-' + act.localId"
                    class="border border-gray-200 px-1 py-1 text-center bg-white"
                    :style="{ width: '100px' }">
                    <span class="text-[10px] font-black uppercase tracking-wider"
                      :style="{ color: group.color }">
                      {{ act.type_code || '—' }}
                    </span>
                  </td>
                  <td v-if="group.activities.length === 0" :key="'type-empty-' + group.co_code"
                    class="border border-gray-200 text-center text-xs text-gray-300 px-2 py-1 bg-white"
                    :style="{ width: '100px' }">—</td>
                </template>
              </tr>

              <!-- ── Row 3: Task name inputs ── -->
              <tr v-if="hasAnyActivity">
                <th colspan="2" class="sticky left-0 z-30 bg-white px-4 py-1 text-right font-extrabold italic text-black text-[13px] border-r border-gray-200 bg-clip-padding" style="min-width:240px; padding-right: 0.75rem;">
                  Task Name
                </th>
                <template v-for="group in coGroups">
                  <td v-for="act in group.activities" :key="'task-' + act.localId"
                    class="border border-gray-200 bg-gray-50 px-1 py-2 text-center"
                    :style="{ width: '100px' }">
                    <input v-model="act.name"
                      class="w-full text-center text-[10px] font-bold text-gray-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-orange-400 rounded px-1 uppercase truncate"
                      placeholder="TASK" />
                  </td>
                  <td v-if="group.activities.length === 0" :key="'task-empty-' + group.co_code"
                    class="border border-gray-200 text-center text-xs text-white font-bold bg-gray-300 px-2 py-2"
                    :style="{ width: '100px' }">—</td>
                </template>
              </tr>

              <!-- ── Row 4: Max score inputs ── -->
              <tr>
                <th class="sticky left-0 z-30 border border-gray-200 px-2 py-3 text-center font-black text-black text-xs uppercase tracking-wider shadow-sm bg-clip-padding"
                  style="width:40px; min-width:40px; background:#FFDB58">No.</th>
                <th class="sticky left-[40px] z-30 border border-gray-200 px-4 py-3 text-left font-black text-black text-[13px] shadow-sm bg-clip-padding"
                  style="width:200px; min-width:200px; background:#FFDB58">
                  Student Name
                </th>
                <template v-for="group in coGroups">
                  <td v-for="act in group.activities" :key="'max-' + act.localId"
                    class="border border-gray-200 px-1 py-2 text-center font-black" style="background:#FFDB58">
                    <div class="flex items-center justify-center gap-1">
                      <span v-if="act.maxScore === null || act.maxScore === undefined" class="text-[9px] font-bold text-black opacity-50 shrink-0">MAX</span>
                      <input type="number" v-model.number="act.maxScore"
                        class="w-14 text-center text-xs font-black text-black bg-transparent border-none rounded-none py-1 focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange-400"
                        placeholder="100" />
                    </div>
                  </td>
                  <td v-if="group.activities.length === 0" :key="'max-empty-' + group.co_code"
                    class="border border-gray-200 px-2 py-2"
                    style="width: 100px; background:#FFDB58"></td>
                </template>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(student, idx) in filteredStudents" :key="student.studid"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
                class="hover:bg-orange-50/50 transition-colors group">
                <td class="sticky left-0 z-10 border border-gray-200 px-2 py-2.5 text-center text-xs font-bold text-gray-500"
                  :class="idx % 2 === 0 ? 'bg-white group-hover:bg-orange-50/50' : 'bg-gray-50/50 group-hover:bg-orange-50/50'">
                  {{ idx + 1 }}
                </td>
                <td class="sticky left-[40px] z-10 border border-gray-200 px-4 py-2.5 font-medium whitespace-nowrap text-gray-700 truncate"
                  :class="idx % 2 === 0 ? 'bg-white group-hover:bg-orange-50/50' : 'bg-gray-50/50 group-hover:bg-orange-50/50'">
                  {{ student.studlastname }}, {{ student.studfirstname }}
                </td>
                <template v-for="group in coGroups">
                  <td v-for="act in group.activities" :key="'sc-' + act.localId + '-' + student.studid"
                    class="border border-gray-200 text-center p-0 relative">
                    <input
                      type="number"
                      v-model.number="student.scores[act.localId]"
                      :max="act.maxScore"
                      :min="0"
                      @input="clampScore(student, act.localId, act.maxScore)"
                      class="w-full py-2.5 px-1 text-sm text-center bg-transparent focus:outline-none focus:bg-white focus:shadow-inner focus:text-orange-600 transition-all truncate"
                      :class="{
                        'text-green-600 font-semibold': student.scores[act.localId] >= (act.maxScore * 0.75),
                        'text-orange-600': student.scores[act.localId] >= (act.maxScore * 0.5) && student.scores[act.localId] < (act.maxScore * 0.75),
                        'text-red-500': student.scores[act.localId] < (act.maxScore * 0.5) && student.scores[act.localId] > 0
                      }" />
                    <span
                      v-if="student.scores[act.localId] > act.maxScore"
                      class="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"
                      :title="'Max allowed: ' + act.maxScore">
                    </span>
                  </td>
                  <td v-if="group.activities.length === 0" :key="'sc-empty-' + group.co_code + '-' + student.studid"
                    class="border border-gray-200 bg-gray-100/50" :style="{ width: '100px' }"></td>
                </template>
              </tr>
              <tr v-if="filteredStudents.length === 0">
                <td :colspan="totalColumns + 2" class="text-center py-16">
                  <div class="flex flex-col items-center">
                    <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p class="text-gray-400 text-sm italic mb-2">No students found matching your search</p>
                    <p class="text-xs text-gray-300">Add students to the class record to begin OBE assessment</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-4 flex flex-wrap gap-4 justify-end text-xs">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-green-500 rounded-full"></span>
        <span class="text-gray-500">Excellent (≥75%)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-orange-400 rounded-full"></span>
        <span class="text-gray-500">Fair (50-74%)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-red-500 rounded-full"></span>
        <span class="text-gray-500">Needs Improvement (&lt;50%)</span>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         ADD ACTIVITY MODAL
    ══════════════════════════════════════════════════════════════ -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-md p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all animate-slideIn">
        <div class="mb-6">
          <h3 class="text-xl font-epundaslab font-bold text-gray-800">Add OBE Activity</h3>
          <p class="text-xs text-gray-400">Create a new assessment task</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Course Outcome</label>
            <select v-model="newActivity.co_code" @change="onAddActivityCoChange"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50">
              <option v-for="co in outcomes" :key="co.co_code" :value="co.co_code">{{ co.co_code }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Task Name</label>
            <input v-model="newActivity.name" placeholder="e.g. Quiz 1, Exam, Project"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50" />
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Assessment Type</label>
            <select v-model="newActivity.type_id"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50">
              <option v-for="t in filteredAssessmentTypes" :key="t.type_id" :value="t.type_id">
                {{ t.code }} — {{ t.name }}
              </option>
            </select>
            <p v-if="filteredAssessmentTypes.length === 0" class="text-xs text-red-500 mt-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No assessment types configured for this CO
            </p>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Max Score</label>
            <input type="number" v-model.number="newActivity.maxScore"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-8">
          <button @click="showAddModal = false"
            class="px-6 py-3 text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors">
            Cancel
          </button>
          <button @click="confirmAddActivity"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm font-bold hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all">
            Add Activity
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         LABORATORY RUBRICS MODAL
    ══════════════════════════════════════════════════════════════ -->
    <div v-if="showRubricsModal"
      class="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center p-2 md:p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl flex flex-col overflow-hidden"
        style="height: 92vh;">

        <!-- Modal header -->
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 class="text-lg font-epundaslab font-bold flex items-center gap-3">
              Laboratory Rubrics
              <span class="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-inria font-bold">
                {{ rubricsList.length }} rubric{{ rubricsList.length !== 1 ? 's' : '' }}
              </span>
            </h2>
            <p class="text-orange-100 text-xs mt-0.5 font-inria">
              {{ activeSubject ? activeSubject.subjcode + ' · Sec ' + (activeSubject.section || activeSubject.sect) : '' }}
              · Each rubric is saved independently to the grading sheet
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="addNewRubric"
              class="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              New Rubric
            </button>
            <button @click="closeRubricsModal"
              class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/25 text-white transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Rubric panels -->
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">

          <div v-if="rubricsList.length === 0"
            class="flex flex-col items-center justify-center h-full text-gray-400 py-16">
            <svg class="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="font-epundaslab font-bold text-gray-400 mb-2">No rubrics yet</p>
            <button @click="addNewRubric"
              class="px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors">
              + Add First Rubric
            </button>
          </div>

          <div v-for="(rubric, rIdx) in rubricsList" :key="rubric.id"
            class="bg-white rounded-2xl border-2 shadow-md overflow-hidden"
            :class="rubric.saved ? 'border-green-400' : 'border-orange-200'">

            <!-- Panel header -->
            <div class="flex items-center justify-between px-5 py-3 border-b"
              :class="rubric.saved ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'">
              <div class="flex items-center gap-3">
                <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                  :class="rubric.saved ? 'bg-green-500' : 'bg-orange-500'">
                  {{ rIdx + 1 }}
                </span>
                <div>
                  <p class="text-sm font-bold text-gray-700 font-inria">
                    {{ rubric.activityName || 'Untitled Rubric' }}
                    <span v-if="rubric.saved" class="ml-2 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">SAVED ✓</span>
                  </p>
                  <p class="text-[10px] text-gray-400 font-inria">
                    {{ rubric.selectedCo || '— CO not set —' }}
                    <span v-if="rubric.selectedTypeId"> · {{ getTypeName(rubric.selectedTypeId) }}</span>
                    · {{ rubricPanelTotalMax(rIdx) }} pts max
                    · {{ rubric.criteria.length }} criteria
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="duplicateRubric(rIdx)"
                  class="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  Duplicate
                </button>
                <button v-if="!rubric.saved" @click="removeRubricPanel(rIdx)"
                  class="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Panel setup row -->
            <div class="px-5 py-4 bg-gray-50 border-b border-gray-200">
              <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-end flex-wrap">
                <div class="w-full lg:w-40">
                  <label class="block text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">CO</label>
                  <select v-model="rubric.selectedCo" @change="onRubricCoChange(rIdx)"
                    class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm font-inria focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                    <option value="">— CO —</option>
                    <option v-for="co in outcomes" :key="co.co_code" :value="co.co_code">{{ co.co_code }}</option>
                  </select>
                </div>
                <div class="w-full lg:w-60">
                  <label class="block text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Assessment Type</label>
                  <select v-model="rubric.selectedTypeId"
                    class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm font-inria focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                    <option value="">— Type —</option>
                    <option v-for="t in getRubricFilteredTypes(rubric.selectedCo)" :key="t.type_id" :value="t.type_id">
                      {{ t.code }} — {{ t.name }}
                    </option>
                  </select>
                </div>
                <div class="w-full lg:w-52">
                  <label class="block text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Activity Name</label>
                  <input v-model="rubric.activityName" placeholder="e.g. Lab Activity 1"
                    class="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm font-inria focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
                </div>
                <div class="hidden lg:block w-px h-8 bg-orange-200 self-end mb-1"></div>
                <div class="flex-1 min-w-0">
                  <label class="block text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">
                    Rubric Criteria <span class="text-orange-300 font-normal">(label · max)</span>
                  </label>
                  <div class="flex flex-wrap gap-1.5 items-center">
                    <div v-for="(crit, cIdx) in rubric.criteria" :key="'c-' + rubric.id + '-' + cIdx"
                      class="flex items-center gap-1 bg-white border border-orange-200 rounded-lg px-2 py-1 shadow-sm">
                      <span class="text-xs font-bold text-gray-700">{{ crit.label }}</span>
                      <span class="text-[10px] text-gray-400">·</span>
                      <span class="text-xs text-center font-bold text-orange-700 bg-orange-50 px-1 py-0.5 rounded">{{ crit.maxScore }}</span>
                      <button @click="removeCriterionFromRubric(rIdx, cIdx)"
                        class="text-gray-300 hover:text-red-500 transition-colors ml-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    <button @click="openCriteriaModal(rIdx)"
                      class="flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Add Label and Max
                    </button>
                  </div>
                </div>
                <div class="flex-shrink-0 bg-white border border-orange-200 rounded-xl px-3 py-1.5 text-center shadow-sm self-end">
                  <p class="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Max</p>
                  <p class="text-xl font-epundaslab font-black text-orange-700">{{ rubricPanelTotalMax(rIdx) }}</p>
                </div>
              </div>
            </div>

            <!-- Student scoring table -->
            <div class="overflow-x-auto">
              <div v-if="!rubric.selectedCo || !rubric.selectedTypeId || rubric.criteria.length === 0"
                class="flex items-center justify-center py-8 text-gray-400 text-sm font-inria gap-2">
                <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Set CO, Assessment Type and add criteria to unlock the scoring table.
              </div>

              <table v-else class="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th class="sticky left-0 z-10 bg-gray-800 text-white border border-gray-700 px-3 py-2 text-left text-xs font-black uppercase"
                      style="min-width:40px">#</th>
                    <th class="sticky left-[40px] z-10 bg-gray-800 text-white border border-gray-700 px-4 py-2 text-left text-xs font-black uppercase"
                      style="min-width:200px">Student Name</th>
                    <th v-for="(crit, cIdx) in rubric.criteria" :key="'h-' + cIdx"
                      class="border border-gray-200 px-3 py-2 text-center text-xs font-black text-white"
                      style="min-width:100px; background:#f97316;">
                      {{ crit.label || 'Criterion ' + (cIdx + 1) }}
                    </th>
                    <th class="border border-gray-200 bg-gray-700 text-white px-3 py-2 text-center text-xs font-black uppercase"
                      style="min-width:70px">Total</th>
                    <th class="border border-gray-200 bg-gray-600 text-white px-3 py-2 text-center text-xs font-black uppercase"
                      style="min-width:60px">%</th>
                  </tr>
                  <tr class="bg-orange-50">
                    <th class="sticky left-0 z-10 bg-orange-50 border border-gray-200 px-3 py-1 text-center text-[10px] font-bold text-gray-400">MAX</th>
                    <th class="sticky left-[40px] z-10 bg-orange-50 border border-gray-200 px-4 py-1 text-[10px] text-gray-400">—</th>
                    <th v-for="(crit, cIdx) in rubric.criteria" :key="'mx-' + cIdx"
                      class="border border-gray-200 px-3 py-1 text-center text-[10px] font-black text-orange-600">
                      {{ crit.maxScore || 0 }}
                    </th>
                    <th class="border border-gray-200 px-3 py-1 text-center text-[10px] font-black text-gray-600">
                      {{ rubricPanelTotalMax(rIdx) }}
                    </th>
                    <th class="border border-gray-200 px-3 py-1 text-center text-[10px] text-gray-400">100%</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="(student, sIdx) in localStudents" :key="'s-' + rIdx + '-' + sIdx"
                    :class="sIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
                    class="hover:bg-orange-50/20 transition-colors">
                    <td class="sticky left-0 z-10 border border-gray-200 px-3 py-2 text-center text-xs font-bold text-gray-400"
                      :class="sIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ sIdx + 1 }}</td>
                    <td class="sticky left-[40px] z-10 border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 whitespace-nowrap"
                      :class="sIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                      {{ student.studlastname }}, {{ student.studfirstname }}
                    </td>
                    <td v-for="(crit, cIdx) in rubric.criteria" :key="'sc-' + cIdx"
                      class="border border-gray-200 text-center p-0">
                      <input
                        type="number"
                        v-model.number="rubric.scores[student.studid][cIdx]"
                        :max="crit.maxScore"
                        :min="0"
                        @input="clampRubricScore(rIdx, student.studid, cIdx, crit.maxScore)"
                        class="w-full py-2 px-2 text-sm text-center bg-transparent focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange-400 transition-all"
                        :class="{
                          'text-green-600 font-semibold': rubric.scores[student.studid][cIdx] >= crit.maxScore * 0.75,
                          'text-orange-500': rubric.scores[student.studid][cIdx] >= crit.maxScore * 0.5 && rubric.scores[student.studid][cIdx] < crit.maxScore * 0.75,
                          'text-red-500': rubric.scores[student.studid][cIdx] > 0 && rubric.scores[student.studid][cIdx] < crit.maxScore * 0.5
                        }"
                        placeholder="—" />
                    </td>
                    <td class="border border-gray-200 px-3 py-2 text-center font-black text-sm"
                      :class="rubricPanelRowTotal(rIdx, student.studid) >= rubricPanelTotalMax(rIdx) * 0.75
                        ? 'text-green-700 bg-green-50'
                        : rubricPanelRowTotal(rIdx, student.studid) >= rubricPanelTotalMax(rIdx) * 0.5
                          ? 'text-orange-600 bg-orange-50'
                          : rubricPanelRowTotal(rIdx, student.studid) > 0
                            ? 'text-red-600 bg-red-50'
                            : 'text-gray-300'">
                      {{ rubricPanelRowTotal(rIdx, student.studid) > 0 ? rubricPanelRowTotal(rIdx, student.studid) : '—' }}
                    </td>
                    <td class="border border-gray-200 px-3 py-2 text-center text-xs font-bold text-gray-500">
                      {{ rubricPanelTotalMax(rIdx) > 0 && rubricPanelRowTotal(rIdx, student.studid) > 0
                          ? Math.round(rubricPanelRowTotal(rIdx, student.studid) / rubricPanelTotalMax(rIdx) * 100) + '%'
                          : '—' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Panel save row -->
            <div class="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
              <p class="text-[11px] text-gray-400 font-inria">
                <span v-if="rubric.saved" class="text-green-600 font-bold">✓ Saved to grading sheet.</span>
                <span v-else>Save to add this rubric as an activity in the Grading Sheet.</span>
              </p>
              <button @click="saveRubricPanel(rIdx)"
                :disabled="rubric.saving || !rubric.selectedCo || !rubric.selectedTypeId || !rubric.activityName.trim() || rubric.criteria.length === 0"
                class="flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                :class="rubric.saved ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'">
                <svg v-if="rubric.saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                </svg>
                {{ rubric.saving ? 'Saving...' : rubric.saved ? 'Update Score' : 'Save Score' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-3 flex items-center justify-between">
          <p class="text-xs text-gray-400 font-inria">
            {{ rubricsList.filter(r => r.saved).length }} of {{ rubricsList.length }} rubric(s) saved to the grading sheet.
          </p>
          <button @click="closeRubricsModal"
            class="px-5 py-2 text-sm text-gray-600 font-bold border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         ADD CRITERIA MODAL
    ══════════════════════════════════════════════════════════════ -->
    <div v-if="criteriaModal.open" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center p-4" style="z-index: 99999;">
      <div class="bg-white rounded-xl shadow-xl p-5 w-full max-w-sm animate-slideIn">
        <h3 class="text-sm font-epundaslab font-bold text-gray-800 mb-4 tracking-wider">Add Label & Max</h3>
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Criterion Label</label>
            <input v-model="criteriaModal.label" placeholder="e.g. Accuracy"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Max Score</label>
            <input type="number" v-model.number="criteriaModal.maxScore" min="1"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button @click="criteriaModal.open = false"
            class="px-4 py-2 text-xs text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button @click="confirmCriteriaModal"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 shadow-sm transition-all">
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════
         ALERT MODAL
    ══════════════════════════════════════════════════════════════ -->
    <div v-if="alertModal.open" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center p-4" style="z-index: 100000;">
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-slideIn">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-epundaslab font-bold text-gray-800">Notification</h3>
        </div>
        <p class="text-sm font-inria text-gray-600 mb-6 leading-relaxed">{{ alertModal.message }}</p>
        <div class="flex justify-end">
          <button @click="alertModal.open = false"
            class="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold shadow hover:bg-orange-600 hover:-translate-y-0.5 transition-all w-full md:w-auto">
            Okay
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
var TRANSMUTATION = [
  { min: 97, grade: 1.00 },
  { min: 93, grade: 1.25 },
  { min: 89, grade: 1.50 },
  { min: 85, grade: 1.75 },
  { min: 80, grade: 2.00 },
  { min: 75, grade: 2.25 },
  { min: 70, grade: 2.50 },
  { min: 65, grade: 2.75 },
  { min: 60, grade: 3.00 },
]

export default {
  name: 'GradingSheet',

  props: {
    activeSubject:   { type: Object, default: null },
    outcomes:        { type: Array,  default: function () { return [] } },
    students:        { type: Array,  default: function () { return [] } },
    assessmentTypes: { type: Array,  default: function () { return [] } },
  },

  data: function () {
    return {
      searchQuery:   '',
      showAddModal:  false,
      newActivity:   { co_code: '', name: '', type_id: null, maxScore: 100 },

      activitiesMap:  {},
      localStudents:  [],
      computedGrades: {},

      idCounter: 1,
      loading:   false,
      saving:    false,
      computing: false,

      coColors: [
        '#22c55e', '#14b8a6', '#3b82f6', '#a855f7',
        '#ec4899', '#f97316', '#ef4444', '#6366f1',
      ],

      showRubricsModal: false,
      rubricsList:      [],

      criteriaModal: {
        open:     false,
        rIdx:     -1,
        label:    '',
        maxScore: 10,
      },

      alertModal: {
        open: false,
        message: ''
      },
    }
  },

  computed: {
    hasAnyActivity: function () {
      return this.coGroups.some(function(g) { return g.activities && g.activities.length > 0 })
    },
    empid: function () {
      return this.$parent && this.$parent.user ? this.$parent.user.empid : null
    },
    sy: function () {
      return (this.$parent && this.$parent.selectedYear) || '2025-2026'
    },
    sem: function () {
      return (this.$parent && this.$parent.selectedSemester) || '1st'
    },
    section: function () {
      if (!this.activeSubject) return ''
      return (this.activeSubject.section || this.activeSubject.sect || '').trim()
    },
    subjcode: function () {
      return this.activeSubject ? this.activeSubject.subjcode : ''
    },

    coIdToCode: function () {
      var m = {}
      ;(this.outcomes || []).forEach(function (co) { m[co.co_id] = co.co_code })
      return m
    },
    coCodeToId: function () {
      var m = {}
      ;(this.outcomes || []).forEach(function (co) { m[co.co_code] = co.co_id })
      return m
    },
    typeIdToCode: function () {
      var m = {}
      ;(this.assessmentTypes || []).forEach(function (t) { m[t.type_id] = t.code })
      return m
    },

    validTypesPerCo: function () {
      var m = {}
      ;(this.outcomes || []).forEach(function (co) {
        var typeIds = []
        ;(co.tosWeights || []).forEach(function (tw) {
          if (tw.type_id && typeIds.indexOf(tw.type_id) === -1) typeIds.push(tw.type_id)
        })
        m[co.co_code] = typeIds
      })
      return m
    },

    filteredAssessmentTypes: function () {
      var coCode   = this.newActivity.co_code
      var validIds = this.validTypesPerCo[coCode]
      if (!validIds || validIds.length === 0) return this.assessmentTypes
      return (this.assessmentTypes || []).filter(function (t) {
        return validIds.indexOf(t.type_id) !== -1
      })
    },

    coGroups: function () {
      var self = this
      return (this.outcomes || []).map(function (co, idx) {
        return {
          co_id:       co.co_id,
          co_code:     co.co_code,
          color:       self.coColors[idx % self.coColors.length],
          activities:  self.activitiesMap[co.co_code] || [],
        }
      })
    },

    totalColumns: function () {
      return this.coGroups.reduce(function (sum, g) {
        return sum + Math.max(g.activities.length, 1)
      }, 0)
    },

    filteredStudents: function () {
      if (!this.searchQuery) return this.localStudents
      var q = this.searchQuery.toLowerCase()
      return this.localStudents.filter(function (s) {
        return (s.studlastname  || '').toLowerCase().indexOf(q) !== -1 ||
               (s.studfirstname || '').toLowerCase().indexOf(q) !== -1 ||
               (s.studid        || '').toLowerCase().indexOf(q) !== -1
      })
    },

    rubricsStorageKey: function () {
      if (!this.subjcode || !this.section) return null
      var emp = this.empid || 'user'
      return 'csucc_rubrics_' + emp + '_' + this.subjcode + '_' + this.section
    },

    anyModalOpen: function () {
      return this.showAddModal || this.showRubricsModal || (this.criteriaModal && this.criteriaModal.open)
    },
  },

  watch: {
    anyModalOpen: function (newVal) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = newVal ? 'hidden' : ''
      }
    },
    rubricsList: {
      deep: true,
      handler: function (newVal) {
        if (!this.rubricsStorageKey) return
        if (typeof window !== 'undefined' && newVal && newVal.length > 0) {
          localStorage.setItem(this.rubricsStorageKey, JSON.stringify(newVal))
        }
      },
    },
    activeSubject: {
      immediate: true,
      handler: function (val) {
        if (val && val.subjcode) this.loadGradebook()
      },
    },
    students: {
      immediate: true,
      handler: function (val) {
        if (val && val.length && !this.localStudents.length) {
          this.localStudents = val.map(function (s) {
            return Object.assign({}, s, { scores: s.scores ? Object.assign({}, s.scores) : {} })
          })
        }
      },
    },
  },

  methods: {

    showAlert(message) {
      this.alertModal.message = message;
      this.alertModal.open = true;
    },

    clampScore: function (student, localId, maxScore) {
      var raw = student.scores[localId]
      if (raw === null || raw === undefined || raw === '') return
      var val = Number(raw)
      if (val < 0)        { this.$set(student.scores, localId, 0);        return }
      if (val > maxScore) { this.$set(student.scores, localId, maxScore) }
    },

    loadGradebook: async function () {
      if (!this.subjcode || !this.section) return
      this.loading = true
      var self = this
      try {
        var res  = await this.$axios.get('/class-activity/sheet/raw-score', {
          params: { subjcode: this.subjcode, section: this.section, sy: this.sy, sem: this.sem },
        })
        var data = res.data

        if (!data || !data.length) {
          this.localStudents  = (this.students || []).map(function (s) {
            return Object.assign({}, s, { scores: {} })
          })
          this.activitiesMap = {}
          return
        }

        var activityList = data[0].scores || []
        var newMap = {}
        activityList.forEach(function (act) {
          var coCode  = self.coIdToCode[act.co_id] || 'UNASSIGNED'
          var localId = 'a_' + act.activity_id
          if (!newMap[coCode]) newMap[coCode] = []
          var exists = newMap[coCode].some(function (a) { return a.localId === localId })
          if (!exists) {
            newMap[coCode].push({
              localId:   localId,
              activity_id: act.activity_id,
              name:      act.activity_name,
              co_id:     act.co_id,
              type_id:   act.type_id,
              type_code: self.typeIdToCode[act.type_id] || '',
              maxScore:  act.max_score,
            })
          }
        })
        this.activitiesMap = newMap

        this.localStudents = data.map(function (row) {
          var scores = {}
          ;(row.scores || []).forEach(function (sc) {
            if (sc.score !== null && sc.score !== undefined) {
              scores['a_' + sc.activity_id] = sc.score
            }
          })
          var parts = (row.student_name || '').split(', ')
          return {
            masterlist_id: row.masterlist_id,
            studid:        row.studid,
            studlastname:  parts[0] || '',
            studfirstname: parts.slice(1).join(', ') || '',
            scores:        scores,
          }
        })

        this.computedGrades = {}
      } catch (err) {
        console.error('Failed to load gradebook:', err)
        this.localStudents = (this.students || []).map(function (s) {
          return Object.assign({}, s, { scores: {} })
        })
      } finally {
        this.loading = false
      }
    },

    saveGrades: async function () {
      if (!this.subjcode) return
      this.saving = true
      var self = this
      try {
        var allActivities = this.coGroups.reduce(function (arr, g) {
          return arr.concat(g.activities)
        }, [])
        if (!allActivities.length) {
          this.showAlert('No activities to save.')
          this.saving = false
          return
        }
        var byCategory = {}
        allActivities.forEach(function (act) {
          var cat = act.type_code || 'MISC'
          if (!byCategory[cat]) byCategory[cat] = []
          byCategory[cat].push(act)
        })
        var categories = Object.keys(byCategory)
        for (var i = 0; i < categories.length; i++) {
          var category = categories[i]
          var acts     = byCategory[category]
          var payload  = {
            subjcode:   self.subjcode,
            section:    self.section,
            sy:         self.sy,
            sem:        self.sem,
            category:   category,
            empid:      self.empid,
            activities: acts.map(function (act) {
              return {
                activity_id: act.activity_id || undefined,
                name:        act.name,
                maxScore:    act.maxScore,
                co_id:       act.co_id,
                type_id:     act.type_id,
                scores:      self.localStudents.map(function (s) {
                  return {
                    studentId: s.studid,
                    score:     s.scores[act.localId] != null ? s.scores[act.localId] : 0,
                  }
                }),
              }
            }),
          }
          await self.$axios.post('/class-activity/save-gradebook', payload)
        }
        this.showAlert('Scores saved successfully!')
        await this.loadGradebook()
      } catch (err) {
        console.error('Failed to save:', err)
        this.showAlert('Error saving scores. Check console for details.')
      } finally {
        this.saving = false
      }
    },

    computeGrades: async function () {
      if (!this.empid || !this.subjcode) return
      this.computing = true
      try {
        var res  = await this.$axios.post('/class-activity/compute-grades', {
          empid:    this.empid,
          subjcode: this.subjcode,
          section:  this.section,
          sy:       this.sy,
          sem:      this.sem,
        })
        var data   = res.data
        var grades = {}
        ;(data || []).forEach(function (row) {
          grades[row.studid] = {
            grade:      row.final_numerical_grade,
            total:      row.total_weighted_percent,
            remarks:    row.remarks,
            co_results: row.co_results || [],
          }
        })
        this.computedGrades = grades
        this.showAlert('Final grades computed and saved!')
      } catch (err) {
        console.error('Failed to compute grades:', err)
        this.showAlert('Error computing grades. Make sure TOS weights are configured in Syllabus Setup.')
      } finally {
        this.computing = false
      }
    },

    addActivity: function () {
      if (!this.outcomes || !this.outcomes.length) {
        this.showAlert('Please set up Course Outcomes in OBE Syllabus setup first.')
        return
      }
      var firstCo    = this.outcomes[0].co_code
      var validTypes = this.validTypesPerCo[firstCo] || []
      var firstTypeId = validTypes.length > 0 ? validTypes[0] : null
      this.newActivity = { co_code: firstCo, name: '', type_id: firstTypeId, maxScore: 100 }
      this.showAddModal = true
    },

    onAddActivityCoChange: function () {
      var coCode      = this.newActivity.co_code
      var validTypes  = this.validTypesPerCo[coCode] || []
      this.newActivity.type_id = validTypes.length > 0 ? validTypes[0] : null
    },

    confirmAddActivity: function () {
      if (!this.newActivity.co_code || !this.newActivity.name || !this.newActivity.type_id) return
      var co_code = this.newActivity.co_code
      var type    = null
      for (var i = 0; i < this.assessmentTypes.length; i++) {
        if (this.assessmentTypes[i].type_id === this.newActivity.type_id) {
          type = this.assessmentTypes[i]
          break
        }
      }
      if (!this.activitiesMap[co_code]) {
        this.$set(this.activitiesMap, co_code, [])
      }
      this.activitiesMap[co_code].push({
        localId:     'new_' + this.idCounter++,
        activity_id: null,
        name:        this.newActivity.name,
        co_id:       this.coCodeToId[co_code] || null,
        type_id:     this.newActivity.type_id,
        type_code:   type ? type.code : '',
        maxScore:    this.newActivity.maxScore,
      })
      this.showAddModal = false
    },

    // ── Rubrics ────────────────────────────────────────────────────

    _makeRubricPanel: function (co, typeId, criteria) {
      var self   = this
      var crits  = criteria || []
      var scores = {}
      self.localStudents.forEach(function (s) {
        scores[s.studid] = crits.map(function () { return null })
      })
      var firstCo    = co     || (self.outcomes.length ? self.outcomes[0].co_code : '')
      var validTypes = self.validTypesPerCo[firstCo] || []
      var firstType  = typeId || (validTypes.length ? validTypes[0] : '')
      return {
        id:             'r_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        activity_id:    undefined,
        selectedCo:     firstCo,
        selectedTypeId: firstType,
        activityName:   '',
        criteria:       crits,
        scores:         scores,
        saving:         false,
        saved:          false,
      }
    },

    getTypeName: function (typeId) {
      var t = (this.assessmentTypes || []).find(function (t) { return t.type_id === typeId })
      return t ? t.code + ' — ' + t.name : ''
    },

    getRubricFilteredTypes: function (coCode) {
      if (!coCode) return this.assessmentTypes
      var validIds = this.validTypesPerCo[coCode]
      if (!validIds || validIds.length === 0) return this.assessmentTypes
      return (this.assessmentTypes || []).filter(function (t) {
        return validIds.indexOf(t.type_id) !== -1
      })
    },

    rubricPanelTotalMax: function (rIdx) {
      var rubric = this.rubricsList[rIdx]
      if (!rubric) return 0
      return rubric.criteria.reduce(function (sum, c) { return sum + (Number(c.maxScore) || 0) }, 0)
    },

    rubricPanelRowTotal: function (rIdx, studid) {
      var rubric = this.rubricsList[rIdx]
      if (!rubric || !rubric.scores[studid]) return 0
      return rubric.scores[studid].reduce(function (sum, v) { return sum + (Number(v) || 0) }, 0)
    },

    restoreRubrics: function () {
      if (!this.rubricsStorageKey || typeof window === 'undefined') return false
      var stored = localStorage.getItem(this.rubricsStorageKey)
      if (stored) {
        try {
          var parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            var self = this
            parsed.forEach(function (rubric) {
              if (!rubric.scores) rubric.scores = {}
              self.localStudents.forEach(function (s) {
                if (!rubric.scores[s.studid]) {
                  rubric.scores[s.studid] = rubric.criteria.map(function () { return null })
                }
              })
            })
            this.rubricsList = parsed
            return true
          }
        } catch (e) { console.error('Error parsing rubrics from localStorage', e) }
      }
      return false
    },

    openRubricsModal: function () {
      if (!this.outcomes || !this.outcomes.length) {
        this.showAlert('Please set up Course Outcomes in OBE Syllabus setup first.')
        return
      }
      if (this.rubricsList.length === 0) {
        var restored = this.restoreRubrics()
        if (!restored) this.rubricsList = [this._makeRubricPanel()]
      } else {
        var self = this
        this.rubricsList.forEach(function (rubric) {
          self.localStudents.forEach(function (s) {
            if (!rubric.scores[s.studid]) {
              self.$set(rubric.scores, s.studid, rubric.criteria.map(function () { return null }))
            }
          })
        })
      }
      this.showRubricsModal = true
    },

    closeRubricsModal: function () {
      this.showRubricsModal = false
    },

    addNewRubric: function () {
      this.rubricsList.unshift(this._makeRubricPanel())
    },

    onRubricCoChange: function (rIdx) {
      var rubric     = this.rubricsList[rIdx]
      var validTypes = this.validTypesPerCo[rubric.selectedCo] || []
      this.$set(this.rubricsList[rIdx], 'selectedTypeId', validTypes.length ? validTypes[0] : '')
    },

    openCriteriaModal: function (rIdx) {
      this.criteriaModal.rIdx     = rIdx
      this.criteriaModal.label    = ''
      this.criteriaModal.maxScore = 10
      this.criteriaModal.open     = true
    },

    confirmCriteriaModal: function () {
      if (!this.criteriaModal.label.trim() || Number(this.criteriaModal.maxScore) <= 0) {
        this.showAlert('Please enter a valid criteria label and max score > 0.')
        return
      }
      var rIdx   = this.criteriaModal.rIdx
      var rubric = this.rubricsList[rIdx]
      rubric.criteria.push({
        label:    this.criteriaModal.label.trim(),
        maxScore: Number(this.criteriaModal.maxScore),
      })
      var self = this
      self.localStudents.forEach(function (s) {
        if (!rubric.scores[s.studid]) self.$set(rubric.scores, s.studid, [])
        rubric.scores[s.studid].push(null)
      })
      this.criteriaModal.open = false
    },

    removeCriterionFromRubric: function (rIdx, cIdx) {
      var rubric = this.rubricsList[rIdx]
      if (rubric.criteria.length <= 1) return
      rubric.criteria.splice(cIdx, 1)
      var self = this
      self.localStudents.forEach(function (s) {
        if (rubric.scores[s.studid]) rubric.scores[s.studid].splice(cIdx, 1)
      })
    },

    removeRubricPanel: function (rIdx) {
      this.rubricsList.splice(rIdx, 1)
    },

    clampRubricScore: function (rIdx, studid, cIdx, maxScore) {
      var rubric = this.rubricsList[rIdx]
      var val    = rubric.scores[studid][cIdx]
      if (val === null || val === undefined || val === '') return
      val = Number(val)
      if (val < 0)        { this.$set(rubric.scores[studid], cIdx, 0);        return }
      if (val > maxScore) { this.$set(rubric.scores[studid], cIdx, maxScore) }
    },

    duplicateRubric: function (rIdx) {
      var src            = this.rubricsList[rIdx]
      var clonedCriteria = src.criteria.map(function (c) {
        return { label: c.label, maxScore: c.maxScore }
      })
      var newPanel = this._makeRubricPanel(src.selectedCo, src.selectedTypeId, clonedCriteria)
      this.rubricsList.unshift(newPanel)
    },

    saveRubricPanel: async function (rIdx) {
      var rubric   = this.rubricsList[rIdx]
      var self     = this
      var totalMax = this.rubricPanelTotalMax(rIdx)

      if (!rubric.selectedCo || !rubric.selectedTypeId || !rubric.activityName.trim()) {
        this.showAlert('Please fill in CO, Assessment Type and Activity Name before saving.')
        return
      }
      if (rubric.criteria.length === 0) {
        this.showAlert('Add at least one criterion before saving.')
        return
      }
      if (totalMax === 0) {
        this.showAlert('Total max score must be greater than 0.')
        return
      }

      this.$set(this.rubricsList, rIdx, Object.assign({}, rubric, { saving: true }))

      try {
        var currentRubric = this.rubricsList[rIdx]
        var selectedType = (this.assessmentTypes || []).find(function (t) {
          return t.type_id === currentRubric.selectedTypeId
        })
        var category = selectedType ? selectedType.code : 'MISC'
        var payload  = {
          subjcode:   this.subjcode,
          section:    this.section,
          sy:         this.sy,
          sem:        this.sem,
          category:   category,
          empid:      this.empid,
          activities: [{
            activity_id: currentRubric.activity_id || undefined,
            name:        currentRubric.activityName.trim(),
            maxScore:    totalMax,
            co_id:       this.coCodeToId[currentRubric.selectedCo] || null,
            type_id:     currentRubric.selectedTypeId,
            scores:      this.localStudents.map(function (s) {
              return {
                studentId: s.studid,
                score:     self.rubricPanelRowTotal(rIdx, s.studid),
              }
            }),
          }],
        }

        var res = await this.$axios.post('/class-activity/save-gradebook', payload)

        // Merge activity_id + saved state into the CURRENT array element in one $set
        var updateObj = { saving: false, saved: true }
        if (res.data && res.data.activities && res.data.activities.length > 0) {
          var createdAct = res.data.activities[0]
          if (createdAct && createdAct.activity_id) {
            updateObj.activity_id = createdAct.activity_id
          }
        }

        this.$set(this.rubricsList, rIdx, Object.assign({}, this.rubricsList[rIdx], updateObj))

        await this.loadGradebook()
      } catch (err) {
        console.error('Failed to save rubric panel:', err)
        this.showAlert('Error saving rubric. Check console for details.')
        this.$set(this.rubricsList, rIdx, Object.assign({}, this.rubricsList[rIdx], { saving: false }))
      }
    },
  },
}
</script>

<style scoped>
table { border-spacing: 0; }
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { opacity: 0; }
input[type="number"] { -moz-appearance: textfield; }
</style>
