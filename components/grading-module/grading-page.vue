<template>
    <div class="font-inria min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <success-message ref="msg" />

        <!-- ═══ OBE Syllabus Setup Modal ═══ -->
        <obe-setup-modal :is-open="showObeModal" :active-subject="activeSubject" @close="showObeModal = false"
            @save="handleObeSetupSave" />

        <!-- ═══════════════════════════════════════════════ -->
        <!-- CLASS RECORD MODAL (integrated)                 -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="showClassRecord"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-2 md:p-4">
            <div
                class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[92vh] overflow-hidden flex flex-col animate-fade-in">

                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
                    <div>
                        <h2 class="text-lg font-bold flex items-center gap-2">
                            Class Record
                            <span v-if="activeSubject"
                                class="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                {{ activeSubject.subjcode }} — Sec {{ activeSubject.section }}
                            </span>
                        </h2>
                        <p class="text-gray-400 text-xs mt-0.5">
                            {{ activeSubject ? activeSubject.instructor : '' }} •
                            {{ activeSubject ? activeSubject.students.length : 0 }} Students
                        </p>
                    </div>
                    <button @click="showClassRecord = false"
                        class="text-white hover:bg-gray-700 rounded-full p-2 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- ── Prominent Tab Bar ── -->
                <div class="shrink-0 bg-white border-b-2 border-gray-100 px-6 pt-3 pb-0 flex items-end gap-1">
                    <!-- Raw Score -->
                    <button @click="classRecordActiveTab = 'raw'"
                        :class="[
                            'flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-b-[3px] transition-all whitespace-nowrap',
                            classRecordActiveTab === 'raw'
                                ? 'border-orange-500 text-orange-600 bg-orange-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        ]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Raw Score
                    </button>

                    <!-- % Rating -->
                    <button @click="classRecordActiveTab = 'percent'"
                        :class="[
                            'flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-b-[3px] transition-all whitespace-nowrap',
                            classRecordActiveTab === 'percent'
                                ? 'border-teal-500 text-teal-600 bg-teal-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        ]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        </svg>
                        % Rating
                    </button>

                    <!-- Weighted % -->
                    <button @click="classRecordActiveTab = 'weighted'"
                        :class="[
                            'flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-b-[3px] transition-all whitespace-nowrap',
                            classRecordActiveTab === 'weighted'
                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        ]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        Weighted %
                    </button>

                    <!-- Final Grade -->
                    <button @click="classRecordActiveTab = 'final'"
                        :class="[
                            'flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-xl border-b-[3px] transition-all whitespace-nowrap',
                            classRecordActiveTab === 'final'
                                ? 'border-purple-500 text-purple-600 bg-purple-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        ]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Final Grade
                    </button>

                    <!-- Print Button (right side) -->
                    <div class="ml-auto pb-3 flex items-center gap-2">
                        <button @click="printClassRecord"
                            class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                        </button>
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loadingRecord" class="flex-1 flex flex-col items-center justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-t-orange-500 border-gray-200 mb-4">
                    </div>
                    <p class="text-gray-500 text-sm">Loading class record...</p>
                </div>

                <!-- No Data -->
                <div v-else-if="gradeData.length === 0"
                    class="flex-1 flex items-center justify-center text-gray-400">
                    <div class="text-center">
                        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p class="text-lg font-medium mb-1">No computed grades found</p>
                        <p class="text-sm text-gray-400">Grades must be computed in the Grading Sheet first.</p>
                    </div>
                </div>

                <!-- Table Content -->
                <div v-else class="flex-1 flex flex-col overflow-hidden">

                    <!-- Search + count -->
                    <div
                        class="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                        <input v-model="searchRecordQuery" placeholder="Search student..." type="text"
                            class="w-full max-w-xs px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                        <span class="text-xs text-gray-500 ml-4 shrink-0">
                            {{ filteredRecordData.length }} students
                        </span>
                    </div>

                    <div class="overflow-auto flex-1">
                        <table class="w-full text-xs border-collapse whitespace-nowrap"
                            style="min-width: max-content;">

                            <!-- ═══ RAW SCORE ═══ -->
                            <template v-if="classRecordActiveTab === 'raw'">
                                <thead class="bg-gray-100 sticky top-0 z-20">
                                    <tr>
                                        <th rowspan="2"
                                            class="sticky left-0 z-30 bg-yellow-300 border border-gray-400 px-2 py-1 text-center font-black"
                                            style="min-width:40px">No.</th>
                                        <th rowspan="2"
                                            class="sticky left-[40px] z-30 bg-yellow-300 border border-gray-400 px-3 py-1 text-left font-black"
                                            style="min-width:200px">Student Name</th>
                                        <!-- FIX: Use sortedCoHeaders which respects CO order from courseOutcomes -->
                                        <th v-for="co in sortedCoHeaders" :key="'rh-' + co.co_code"
                                            :colspan="co.count || 1"
                                            class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs"
                                            :style="{ backgroundColor: co.color }">
                                            {{ co.co_code }}
                                        </th>
                                    </tr>
                                    <tr>
                                        <!-- FIX: Use sortedActivityHeaders which is sorted by CO order -->
                                        <th v-for="act in sortedActivityHeaders" :key="'ra-' + act.activity_id"
                                            class="border border-gray-300 bg-gray-50 px-2 py-1 text-center font-bold text-gray-600"
                                            style="min-width:80px">
                                            <div>{{ act.type_code }}</div>
                                            <div class="text-green-600 font-black">{{ act.max_score }}</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in filteredRecordData" :key="'r-' + row.studid"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                        <td class="sticky left-0 z-10 border border-gray-200 px-2 py-1.5 text-center font-bold text-gray-400"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                        <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-1.5 font-medium text-gray-800"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}
                                        </td>
                                        <!-- FIX: Render cells in sortedActivityHeaders order using scoreMap lookup -->
                                        <td v-for="act in sortedActivityHeaders"
                                            :key="'rs-' + act.activity_id + row.studid"
                                            class="border border-gray-200 text-center py-1.5 text-sm">
                                            {{ getRawScore(row, act.activity_id) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </template>

                            <!-- ═══ % RATING ═══ -->
                            <template v-if="classRecordActiveTab === 'percent'">
                                <thead class="bg-gray-100 sticky top-0 z-20">
                                    <tr>
                                        <th rowspan="2"
                                            class="sticky left-0 z-30 bg-yellow-300 border border-gray-400 px-2 py-1 text-center font-black"
                                            style="min-width:40px">No.</th>
                                        <th rowspan="2"
                                            class="sticky left-[40px] z-30 bg-yellow-300 border border-gray-400 px-3 py-1 text-left font-black"
                                            style="min-width:200px">Student Name</th>
                                        <th v-for="co in sortedCoHeaders" :key="'ph-' + co.co_code"
                                            :colspan="co.count || 1"
                                            class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs"
                                            :style="{ backgroundColor: co.color }">
                                            {{ co.co_code }}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th v-for="act in sortedActivityHeaders" :key="'pa-' + act.activity_id"
                                            class="border border-gray-300 bg-gray-50 px-2 py-1 text-center font-bold text-gray-600"
                                            style="min-width:80px">
                                            {{ act.type_code }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in filteredRecordData" :key="'p-' + row.studid"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                        <td class="sticky left-0 z-10 border border-gray-200 px-2 py-1.5 text-center font-bold text-gray-400"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                        <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-1.5 font-medium text-gray-800"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}
                                        </td>
                                        <!-- FIX: Look up percent_ratings by activity_id -->
                                        <td v-for="act in sortedActivityHeaders"
                                            :key="'pr-' + act.activity_id + row.studid"
                                            class="border border-gray-200 text-center py-1.5 text-sm"
                                            :class="getPercentRating(row, act.activity_id) !== null && getPercentRating(row, act.activity_id) < 60 ? 'text-red-600 font-bold' : ''">
                                            {{ getPercentRating(row, act.activity_id) !== null ? getPercentRating(row, act.activity_id).toFixed(1) + '%' : '' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </template>

                            <!-- ═══ WEIGHTED % RATING ═══ -->
                            <template v-if="classRecordActiveTab === 'weighted'">
                                <thead class="bg-gray-100 sticky top-0 z-20">
                                    <tr>
                                        <th rowspan="2"
                                            class="sticky left-0 z-30 bg-yellow-300 border border-gray-400 px-2 py-1 text-center font-black"
                                            style="min-width:40px">No.</th>
                                        <th rowspan="2"
                                            class="sticky left-[40px] z-30 bg-yellow-300 border border-gray-400 px-3 py-1 text-left font-black"
                                            style="min-width:200px">Student Name</th>
                                        <!-- FIX: Show CO weight in header using sortedCoHeaders -->
                                        <th v-for="co in sortedCoHeaders" :key="'wh-' + co.co_code"
                                            :colspan="co.count || 1"
                                            class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs"
                                            :style="{ backgroundColor: co.color }">
                                            {{ co.co_code }} ({{ co.weight }}%)
                                        </th>
                                    </tr>
                                    <tr>
                                        <th v-for="act in sortedActivityHeaders" :key="'wa-' + act.activity_id"
                                            class="border border-gray-300 bg-gray-50 px-2 py-1 text-center font-bold text-gray-600"
                                            style="min-width:80px">
                                            <div>{{ act.type_code }}</div>
                                            <div class="text-blue-600 text-[10px]">{{ act.weight }}%</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in filteredRecordData" :key="'w-' + row.studid"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                        <td class="sticky left-0 z-10 border border-gray-200 px-2 py-1.5 text-center font-bold text-gray-400"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                        <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-1.5 font-medium text-gray-800"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}
                                        </td>
                                        <td v-for="act in sortedActivityHeaders"
                                            :key="'wr-' + act.activity_id + row.studid"
                                            class="border border-gray-200 text-center py-1.5 text-sm">
                                            {{ getWeightedRating(row, act.activity_id) !== undefined ? getWeightedRating(row, act.activity_id).toFixed(2) : '' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </template>

                            <!-- ═══ FINAL GRADE ═══ -->
                            <template v-if="classRecordActiveTab === 'final'">
                                <thead class="sticky top-0 z-20">
                                    <!-- Row 1: % of Student Passed -->
                                    <tr>
                                        <th rowspan="4"
                                            class="sticky left-0 z-30 bg-yellow-300 border border-gray-400 px-2 py-1 text-center font-black"
                                            style="min-width:40px">No.</th>
                                        <th rowspan="4"
                                            class="sticky left-[40px] z-30 bg-yellow-300 border border-gray-400 px-3 py-1 text-left font-black"
                                            style="min-width:200px">Student Name</th>
                                        <!-- Per-CO: % of Student Passed -->
                                        <th v-for="co in recordCoResultHeaders" :key="'fp-' + co.co_code"
                                            colspan="2"
                                            class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs"
                                            :style="{ backgroundColor: '#dc2626' }">
                                            {{ coPassedPercent(co.co_code) }}%
                                        </th>
                                        <!-- Total / Grade / Remarks span 4 rows — placed AFTER CO cols -->
                                        <th rowspan="4"
                                            class="bg-gray-600 text-white border border-gray-400 px-3 py-1 text-center font-black"
                                            style="min-width:60px">Total</th>
                                        <th rowspan="4"
                                            class="bg-gray-700 text-white border border-gray-400 px-3 py-1 text-center font-black"
                                            style="min-width:70px">Final Numerical Grade</th>
                                        <th rowspan="4"
                                            class="bg-gray-800 text-white border border-gray-400 px-3 py-1 text-center font-black"
                                            style="min-width:80px">REMARKS</th>
                                    </tr>
                                    <!-- Row 2: CO codes -->
                                    <tr>
                                        <th v-for="co in recordCoResultHeaders" :key="'fc-' + co.co_code"
                                            colspan="2"
                                            class="border border-gray-400 px-2 py-1 text-center font-black text-white text-xs"
                                            :style="{ backgroundColor: co.color }">
                                            {{ co.co_code }}
                                        </th>
                                    </tr>
                                    <!-- Row 3: CO weight % -->
                                    <tr>
                                        <th v-for="co in recordCoResultHeaders" :key="'fw-' + co.co_code"
                                            colspan="2"
                                            class="border border-gray-300 bg-gray-100 px-2 py-1 text-center font-black text-gray-700 text-xs">
                                            {{ coWeightPercent(co.co_code) }}%
                                        </th>
                                    </tr>
                                    <!-- Row 4: Sum % | REMARKS subheaders -->
                                    <tr>
                                        <template v-for="co in recordCoResultHeaders">
                                            <th :key="'fs-' + co.co_code"
                                                class="border border-gray-300 bg-gray-50 px-2 py-1 text-center font-bold text-gray-600 text-[10px] uppercase"
                                                style="min-width:70px">Sum %</th>
                                            <th :key="'fr-' + co.co_code"
                                                class="border border-gray-300 bg-gray-50 px-2 py-1 text-center font-bold text-gray-600 text-[10px] uppercase"
                                                style="min-width:80px">REMARKS</th>
                                        </template>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in filteredRecordData" :key="'f-' + row.studid"
                                        :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                                        <td class="sticky left-0 z-10 border border-gray-200 px-2 py-2 text-center font-bold text-gray-400"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ idx + 1 }}</td>
                                        <td class="sticky left-[40px] z-10 border border-gray-200 px-3 py-2 font-medium text-gray-800"
                                            :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">{{ row.student_name }}</td>
                                        <!-- Per-CO: Sum % + Remarks — LEFT of Total/Grade/Remarks -->
                                        <template v-for="cr in sortedCoResults(row.co_results)">
                                            <td :key="'cs-' + cr.co_code + row.studid"
                                                class="border border-gray-200 text-center py-2 text-sm font-semibold">
                                                {{ cr.sum_weighted !== undefined ? cr.sum_weighted.toFixed(2) : '0.00' }}
                                            </td>
                                            <td :key="'cp-' + cr.co_code + row.studid"
                                                class="border border-gray-200 text-center py-2 text-xs font-bold"
                                                :class="cr.passed ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'">
                                                {{ cr.passed ? 'PASSED' : 'FAILED' }}
                                            </td>
                                        </template>
                                        <!-- Total — RIGHT -->
                                        <td class="border border-gray-200 text-center py-2 font-black text-sm bg-gray-50">
                                            {{ row.total_weighted_percent }}
                                        </td>
                                        <!-- Final Numerical Grade — RIGHT -->
                                        <td class="border border-gray-200 text-center py-2 font-black text-base"
                                            :class="row.final_numerical_grade <= 3.0 ? 'text-green-700' : 'text-red-600'">
                                            {{ row.final_numerical_grade ? row.final_numerical_grade.toFixed(2) : '' }}
                                        </td>
                                        <!-- Remarks — RIGHT -->
                                        <td class="border border-gray-200 text-center py-2 font-black text-xs uppercase"
                                            :class="row.remarks === 'PASSED' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'">
                                            {{ row.remarks || '' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </template>

                        </table>
                    </div>

                    <!-- Summary bar — Final Grade tab only -->
                    <div v-if="classRecordActiveTab === 'final'"
                        class="p-3 bg-gray-50 border-t flex flex-wrap gap-6 text-xs shrink-0">
                        <div><span class="text-gray-500">Total Students:</span>
                            <span class="font-bold text-gray-800 ml-1">{{ filteredRecordData.length }}</span>
                        </div>
                        <div><span class="text-gray-500">Passed:</span>
                            <span class="font-bold text-green-700 ml-1">{{ recordPassedCount }}</span>
                        </div>
                        <div><span class="text-gray-500">Failed:</span>
                            <span class="font-bold text-red-600 ml-1">{{ recordFailedCount }}</span>
                        </div>
                        <div><span class="text-gray-500">INC:</span>
                            <span class="font-bold text-red-600 ml-1">{{ recordIncCount }}</span>
                        </div>
                        <div><span class="text-gray-500">Pass Rate:</span>
                            <span class="font-bold text-green-700 ml-1">{{ recordPassRate }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- HEADER                                           -->
        <!-- ═══════════════════════════════════════════════ -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div class="flex items-center gap-4">
                <div class="w-1.5 h-12 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
                <div>
                    <h1 class="text-3xl md:text-4xl font-bold font-epundaslab text-gray-800">Grading Module</h1>
                    <p class="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        Outcome-Based Education • Manage student grades and class records
                    </p>
                </div>
            </div>

            <!-- Quick Stats -->
            <div v-if="subjects.length > 0" class="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                <span class="text-sm text-gray-600">{{ subjects.length }} Active Classes</span>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- YEAR / SEMESTER PICKER                          -->
        <!-- ═══════════════════════════════════════════════ -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wider">Academic Period</h2>
            </div>

            <div class="flex flex-col md:flex-row items-end gap-4">
                <div class="w-full md:w-64">
                    <label class="block text-xs font-semibold text-gray-500 mb-2 ml-1">Academic Year</label>
                    <div class="relative">
                        <select v-model="selectedYear"
                            class="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none">
                            <option value="" disabled>Select Year</option>
                            <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
                        </select>
                        <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div class="w-full md:w-64">
                    <label class="block text-xs font-semibold text-gray-500 mb-2 ml-1">Semester</label>
                    <div class="relative">
                        <select v-model="selectedSemester"
                            class="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none">
                            <option value="" disabled>Select Semester</option>
                            <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
                        </select>
                        <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <button @click="loadClassesFromDatabase" :disabled="loading"
                    class="h-12 px-8 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-orange-600 font-bold text-sm flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                    <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    {{ loading ? 'Loading...' : 'Display Classes' }}
                </button>

                <button v-if="activeSubject" @click="closeGradingSheet"
                    class="h-12 px-6 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 font-bold text-sm flex items-center gap-2 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close Grading Sheet
                </button>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- CLASS CARDS                                      -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="showSubjects && !activeSubject" class="animate-fade-in">
            <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Available Classes</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-if="subjects.length === 0"
                    class="col-span-full text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p class="text-lg mb-2">No classes found</p>
                    <p class="text-sm">Select a different academic period or contact administrator</p>
                </div>

                <div v-for="(subject, index) in subjects" :key="index" @click="openGradingSheet(subject)"
                    class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group">
                    <div class="bg-gradient-to-r from-orange-400 to-orange-500 p-5 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8"></div>
                        <div class="flex justify-between items-start relative z-10">
                            <h3 class="font-bold text-white text-xl">{{ subject.subjcode }}</h3>
                            <div class="flex gap-2">
                                <span class="bg-white text-orange-600 text-xs px-2 py-1 rounded-full font-bold">
                                    Sec {{ subject.section }}
                                </span>
                            </div>
                        </div>
                        <p class="text-sm text-white/80 mt-2 line-clamp-2 relative z-10">{{ subject.description }}</p>
                        <div class="mt-4 flex items-center gap-2 text-xs text-white/70 relative z-10">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="font-medium">{{ subject.instructor }}</span>
                        </div>
                    </div>
                    <div class="p-5 flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600">{{ subject.students.length }} Students</span>
                        <span
                            class="text-orange-600 font-semibold text-sm group-hover:underline flex items-center gap-1">
                            Open Sheet
                            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════ -->
        <!-- GRADING SHEET (OBE-powered)                     -->
        <!-- ═══════════════════════════════════════════════ -->
        <div v-if="activeSubject"
            class="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col relative animate-fade-in overflow-hidden">

            <!-- Loading overlay -->
            <div v-if="loadingGradebook"
                class="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div class="bg-white p-8 rounded-2xl shadow-2xl text-center">
                    <div
                        class="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mb-4 mx-auto">
                    </div>
                    <p class="text-gray-800 font-bold text-xl mb-2">Loading OBE Gradebook</p>
                    <p class="text-gray-400 text-sm">Please wait while we prepare your data...</p>
                </div>
            </div>

            <!-- Header bar -->
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

                    <!-- Subject info -->
                    <div class="flex items-center gap-4">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h2 class="text-xl font-bold flex items-center gap-2">
                                    {{ activeSubject.subjcode }}
                                    <span
                                        class="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Sec {{
                                            activeSubject.section }}</span>
                                </h2>
                            </div>
                            <div class="flex items-center gap-3 text-sm">
                                <span class="text-gray-300">Instructor:</span>
                                <span class="text-white font-medium">{{ activeSubject.instructor }}</span>
                                <span class="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                <span class="text-gray-300">{{ activeSubject.students.length }} Students</span>
                            </div>
                        </div>
                    </div>

                    <!-- Action buttons -->
                    <div class="flex flex-wrap gap-2">

                        <button @click="openClassRecord('raw')"
                            class="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 bg-white/10 hover:bg-white/20 text-white">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Raw Score
                        </button>
                        <button @click="openClassRecord('percent')"
                            class="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 bg-white/10 hover:bg-white/20 text-white">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            </svg>
                            % Rating
                        </button>
                        <button @click="openClassRecord('weighted')"
                            class="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 bg-white/10 hover:bg-white/20 text-white">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                            Weighted %
                        </button>
                        <button @click="openClassRecord('final')"
                            class="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-orange-400 bg-orange-500 hover:bg-orange-600 text-white shadow-md">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Final Grade
                        </button>

                        <!-- ── OBE Syllabus Setup ── -->
                        <button @click="showObeModal = true"
                            class="px-5 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl text-xs font-bold hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            OBE Syllabus Setup
                        </button>
                    </div>
                </div>
            </div>

            <!-- OBE Grading Sheet Component -->
            <div class="p-6">
                <grading-sheet ref="gradingSheet" :active-subject="activeSubject" :outcomes="courseOutcomes"
                    :students="activeSubject.students" :assessment-types="assessmentTypes" />
            </div>
        </div>

        <!-- Footer hint -->
        <div v-if="!activeSubject && showSubjects && subjects.length > 0" class="mt-8 text-center text-xs text-gray-400">
            <p>Select a class to begin OBE grading and assessment</p>
        </div>
    </div>
</template>

<script>
import SuccessMessage from '@/components/success-message.vue'
import ObeSetupModal from './obe-setup-modal.vue'
import GradingSheet from './grading-module.vue'

export default {
    name: 'GradingPage',
    components: { SuccessMessage, ObeSetupModal, GradingSheet },

    data: function () {
        return {
            academicYears: ['2024-2025', '2025-2026', '2026-2027', '2027-2028', '2028-2029', '2029-2030'],
            semesters: ['1st', '2nd', 'Summer'],
            selectedYear: '',
            selectedSemester: '',
            loading: false,
            loadingGradebook: false,
            loadingRecord: false,
            user: null,
            subjects: [],
            activeSubject: null,
            courseOutcomes: [],
            assessmentTypes: [],
            showSubjects: false,
            showObeModal: false,
            showClassRecord: false,
            classRecordActiveTab: 'raw',
            gradeData: [],
            searchRecordQuery: '',
            recordTabs: [
                { id: 'raw',      label: 'Raw Score'   },
                { id: 'percent',  label: '% Rating'    },
                { id: 'weighted', label: 'Weighted %'  },
                { id: 'final',    label: 'Final Grade' },
            ],
            coColors: [
                '#22c55e', '#14b8a6', '#3b82f6', '#a855f7',
                '#ec4899', '#f97316', '#ef4444', '#6366f1',
            ],
        }
    },

    async mounted() {
        await this.getUserInfo()
    },

    computed: {

        // ─────────────────────────────────────────────────────────────────
        // KEY FIX: Build a co_id → co_code map from courseOutcomes so we
        // can correctly assign each activity to its real CO.
        // ─────────────────────────────────────────────────────────────────
        coIdToCode: function () {
            var m = {}
            ;(this.courseOutcomes || []).forEach(function (co) {
                m[co.co_id] = co.co_code
            })
            return m
        },

        typeIdToCode: function () {
            var m = {}
            ;(this.assessmentTypes || []).forEach(function (t) {
                m[t.type_id] = t.code
            })
            return m
        },

        // ─────────────────────────────────────────────────────────────────
        // coOrderMap: co_code → position index from courseOutcomes.
        // This is the source of truth for ordering.
        // ─────────────────────────────────────────────────────────────────
        coOrderMap: function () {
            var m = {}
            ;(this.courseOutcomes || []).forEach(function (co, idx) {
                m[co.co_code] = idx
            })
            return m
        },

        // ─────────────────────────────────────────────────────────────────
        // sortedActivityHeaders: activities sorted by CO order then by
        // their position within that CO. Uses co_id from raw_scores to
        // resolve co_code correctly — NOT from the activity name.
        // ─────────────────────────────────────────────────────────────────
        sortedActivityHeaders: function () {
            if (!this.gradeData.length) return []
            var self = this
            var first = this.gradeData[0]

            // Build weight lookup from weighted_ratings of first student
            var weightMap = {}
            if (first.weighted_ratings) {
                first.weighted_ratings.forEach(function (wr) {
                    weightMap[wr.activity_id] = wr.weight_percentage
                })
            }

            // Map each raw_score entry to a rich activity object,
            // resolving co_code via coIdToCode (authoritative)
            var activities = (first.raw_scores || []).map(function (rs) {
                var co_code = self.coIdToCode[rs.co_id] || 'UNASSIGNED'
                var type_code = self.typeIdToCode[rs.type_id] || ''
                return {
                    activity_id:   rs.activity_id,
                    activity_name: rs.activity_name,
                    co_id:         rs.co_id,
                    co_code:       co_code,
                    type_id:       rs.type_id,
                    type_code:     type_code,
                    max_score:     rs.max_score,
                    weight:        weightMap[rs.activity_id] || 0,
                    // Sort key: CO position in courseOutcomes
                    coOrder: self.coOrderMap[co_code] !== undefined
                        ? self.coOrderMap[co_code]
                        : 9999,
                }
            })

            // Sort by CO order, then by activity_id (insertion order within CO)
            activities.sort(function (a, b) {
                if (a.coOrder !== b.coOrder) return a.coOrder - b.coOrder
                return a.activity_id - b.activity_id
            })

            return activities
        },

        // ─────────────────────────────────────────────────────────────────
        // sortedCoHeaders: derived from sortedActivityHeaders so the
        // colspan grouping is ALWAYS consistent with the activity order.
        // ─────────────────────────────────────────────────────────────────
        sortedCoHeaders: function () {
            var self = this
            var seen  = {}
            var result = []

            // Walk activities in sorted order and count per CO
            this.sortedActivityHeaders.forEach(function (act) {
                if (!seen[act.co_code]) {
                    var coIdx = self.coOrderMap[act.co_code]
                    seen[act.co_code] = {
                        co_code: act.co_code,
                        count:   0,
                        weight:  0,
                        color:   self.coColors[coIdx !== undefined ? coIdx % self.coColors.length : result.length % self.coColors.length],
                    }
                    result.push(seen[act.co_code])
                }
                seen[act.co_code].count  += 1
                seen[act.co_code].weight += act.weight
            })

            // Round weights
            result.forEach(function (co) {
                co.weight = Math.round(co.weight * 100) / 100
            })

            return result
        },

        // ─────────────────────────────────────────────────────────────────
        // recordCoResultHeaders for Final Grade tab — sorted by CO order
        // ─────────────────────────────────────────────────────────────────
        recordCoResultHeaders: function () {
            if (!this.gradeData.length || !this.gradeData[0].co_results) return []
            var self = this
            var sorted = this.gradeData[0].co_results.slice().sort(function (a, b) {
                var ai = self.coOrderMap[a.co_code] !== undefined ? self.coOrderMap[a.co_code] : 9999
                var bi = self.coOrderMap[b.co_code] !== undefined ? self.coOrderMap[b.co_code] : 9999
                return ai - bi
            })
            return sorted.map(function (cr) {
                var idx = self.coOrderMap[cr.co_code]
                return {
                    co_code: cr.co_code,
                    color:   self.coColors[idx !== undefined ? idx % self.coColors.length : 0],
                }
            })
        },

        filteredRecordData: function () {
            if (!this.searchRecordQuery) return this.gradeData
            var q = this.searchRecordQuery.toLowerCase()
            return this.gradeData.filter(function (r) {
                return r.student_name.toLowerCase().indexOf(q) !== -1 ||
                    (r.studid || '').toLowerCase().indexOf(q) !== -1
            })
        },

        recordPassedCount: function () {
            return this.filteredRecordData.filter(function (r) { return r.remarks === 'PASSED' }).length
        },
        recordFailedCount: function () {
            return this.filteredRecordData.filter(function (r) { return r.remarks === 'FAILED' }).length
        },
        recordIncCount: function () {
            return this.filteredRecordData.filter(function (r) { return r.remarks === 'INC' }).length
        },
        recordPassRate: function () {
            if (!this.filteredRecordData.length) return 0
            return Math.round((this.recordPassedCount / this.filteredRecordData.length) * 100)
        },
    },

    methods: {

        // ─────────────────────────────────────────────────────────────────
        // CELL LOOKUP HELPERS
        // These look up by activity_id so the data always matches the
        // correct column regardless of sort order.
        // ─────────────────────────────────────────────────────────────────

        getRawScore: function (row, activityId) {
            if (!row.raw_scores) return ''
            var entry = row.raw_scores.find(function (rs) {
                return rs.activity_id === activityId
            })
            return entry && entry.score !== null ? entry.score : ''
        },

        getPercentRating: function (row, activityId) {
            if (!row.percent_ratings) return null
            var entry = row.percent_ratings.find(function (pr) {
                return pr.activity_id === activityId
            })
            return entry && entry.percent !== null ? entry.percent : null
        },

        getWeightedRating: function (row, activityId) {
            if (!row.weighted_ratings) return undefined
            var entry = row.weighted_ratings.find(function (wr) {
                return wr.activity_id === activityId
            })
            return entry && entry.weighted_value !== undefined ? entry.weighted_value : undefined
        },

        // ── % of students passed per CO ────────────────────────────
        coPassedPercent: function (coCode) {
            if (!this.filteredRecordData.length) return 0
            var passed = this.filteredRecordData.filter(function (row) {
                if (!row.co_results) return false
                var cr = row.co_results.find(function (c) { return c.co_code === coCode })
                return cr && cr.passed
            }).length
            return Math.round((passed / this.filteredRecordData.length) * 100)
        },

        // ── CO weight % from sortedCoHeaders ───────────────────────
        coWeightPercent: function (coCode) {
            var co = this.sortedCoHeaders.find(function (c) { return c.co_code === coCode })
            return co ? co.weight : 0
        },

        // ── Sort co_results for a student row by CO order ──────────
        sortedCoResults: function (coResults) {
            if (!coResults) return []
            var self = this
            return coResults.slice().sort(function (a, b) {
                var ai = self.coOrderMap[a.co_code] !== undefined ? self.coOrderMap[a.co_code] : 9999
                var bi = self.coOrderMap[b.co_code] !== undefined ? self.coOrderMap[b.co_code] : 9999
                return ai - bi
            })
        },

        // ─────────────────────────────────────────────────────────────────
        // All other methods — unchanged from original
        // ─────────────────────────────────────────────────────────────────

        getUserInfo: async function () {
            try {
                var res = await this.$axios.get('/auth/user')
                this.user = res.data
            } catch (e) {
                console.error('User not found', e)
            }
        },

        loadClassesFromDatabase: async function () {
            if (!this.selectedYear || !this.selectedSemester) {
                this.$refs.msg.show('Please select Academic Year and Semester.', 'error')
                return
            }
            this.loading = true
            this.activeSubject = null
            this.gradeData = []
            this.showClassRecord = false

            try {
                var url = '/masterlist/filter/' + this.selectedYear + '/' + this.selectedSemester
                var res = await this.$axios.get(url)

                if (!res.data || res.data.length === 0) {
                    this.subjects = []
                    this.$refs.msg.show('No classes found.', 'info')
                    this.loading = false
                    return
                }

                var organizedClasses = {}
                res.data.forEach(function (row) {
                    var classId = row.subjcode + '-' + row.section
                    if (!organizedClasses[classId]) {
                        organizedClasses[classId] = {
                            subjcode: row.subjcode,
                            section: row.section,
                            description: row.type || 'Subject Description',
                            instructor: row.employee
                                ? (row.employee.firstname + ' ' + row.employee.lastname)
                                : 'Unassigned',
                            students: [],
                        }
                    }
                    organizedClasses[classId].students.push({
                        masterlist_id: row.masterlist_id,
                        studid: row.studid,
                        studlastname: row.studlastname,
                        studfirstname: row.studfirstname,
                        fullname: row.studlastname + ', ' + row.studfirstname,
                        scores: {},
                    })
                })

                this.subjects = Object.values(organizedClasses)
                this.showSubjects = true
                this.$refs.msg.show('Classes loaded successfully.', 'success')
            } catch (e) {
                console.error(e)
                this.$refs.msg.show('Error loading classes.', 'error')
            } finally {
                this.loading = false
            }
        },

        openGradingSheet: async function (subject) {
            this.loadingGradebook = true
            this.gradeData = []
            this.courseOutcomes = []
            this.assessmentTypes = []

            try {
                await this.fetchAssessmentTypes()
                await this.fetchSyllabusForSubject(subject)
                this.activeSubject = subject
            } catch (e) {
                console.error('Error loading grading sheet:', e)
            } finally {
                this.loadingGradebook = false
            }
        },

        fetchAssessmentTypes: async function () {
            try {
                var res = await this.$axios.get('/obe/assessment-types')
                this.assessmentTypes = res.data || []
            } catch (e) {
                console.error('Failed to load assessment types:', e)
                this.assessmentTypes = []
            }
        },

        fetchSyllabusForSubject: async function (subject) {
            if (!this.user || !subject) {
                this.courseOutcomes = []
                return
            }
            try {
                var empid = this.user.empid
                var subj = encodeURIComponent(subject.subjcode)
                var sect = encodeURIComponent((subject.section || '').trim())
                var url = '/obe/syllabus/' + empid + '/' + subj + '/' + sect
                var res = await this.$axios.get(url)
                var data = res.data
                if (data && data.length > 0) {
                    var coMap = new Map()
                    data.forEach(function (c) {
                        if (!coMap.has(c.co_id)) coMap.set(c.co_id, c)
                    })
                    this.courseOutcomes = Array.from(coMap.values())
                } else {
                    this.courseOutcomes = []
                }
            } catch (e) {
                console.error('Failed to load syllabus:', e)
                this.courseOutcomes = []
            }
        },

        fetchSyllabus: async function () {
            await this.fetchSyllabusForSubject(this.activeSubject)
        },

        closeGradingSheet: function () {
            this.activeSubject = null
            this.courseOutcomes = []
            this.gradeData = []
            this.showClassRecord = false
        },

        openClassRecord: async function (tab) {
            this.classRecordActiveTab = tab || 'raw'
            this.showClassRecord = true
            this.searchRecordQuery = ''
            this.loadingRecord = true
            this.gradeData = []

            try {
                var res = await this.$axios.post('/class-activity/compute-grades', {
                    empid:    this.user ? this.user.empid : null,
                    subjcode: this.activeSubject.subjcode,
                    section:  (this.activeSubject.section || '').trim(),
                    sy:       this.selectedYear,
                    sem:      this.selectedSemester,
                })
                this.gradeData = res.data || []
            } catch (e) {
                console.error('Failed to load class record:', e)
                this.gradeData = []
            } finally {
                this.loadingRecord = false
            }
        },

        handleObeSetupSave: async function () {
            this.showObeModal = false
            this.$refs.msg.show('Syllabus saved successfully!', 'success')
            await this.fetchSyllabus()
            if (this.$refs.gradingSheet) {
                this.$refs.gradingSheet.loadGradebook()
            }
        },

        // ── Print current class record tab ──────────────────────────
        printClassRecord: function () {
            var tabLabels = {
                raw:      'Raw Score',
                percent:  '% Rating',
                weighted: 'Weighted %',
                final:    'Final Grade',
            }
            var tabLabel  = tabLabels[this.classRecordActiveTab] || ''
            var subjcode  = this.activeSubject ? this.activeSubject.subjcode : ''
            var section   = this.activeSubject ? this.activeSubject.section  : ''
            var instructor = this.activeSubject ? this.activeSubject.instructor : ''

            // Grab the visible table HTML
            var tableEl = document.querySelector('.overflow-auto table')
            if (!tableEl) {
                alert('No table found to print.')
                return
            }

            var win = window.open('', '_blank')
            win.document.write([
                '<!DOCTYPE html>',
                '<html>',
                '<head>',
                '  <meta charset="UTF-8">',
                '  <title>' + subjcode + ' ' + section + ' — ' + tabLabel + '</title>',
                '  <style>',
                '    * { box-sizing: border-box; margin: 0; padding: 0; }',
                '    body { font-family: Arial, sans-serif; font-size: 11px; padding: 20px; color: #111; }',
                '    h1 { font-size: 16px; font-weight: bold; margin-bottom: 2px; }',
                '    p  { font-size: 11px; color: #555; margin-bottom: 12px; }',
                '    table { border-collapse: collapse; width: 100%; }',
                '    th, td { border: 1px solid #ccc; padding: 4px 8px; text-align: center; white-space: nowrap; }',
                '    thead th { background: #1f2937; color: #fff; font-weight: bold; }',
                '    thead tr:first-child th { font-size: 12px; }',
                '    tbody tr:nth-child(even) { background: #f9f9f9; }',
                '    td:nth-child(2), th:nth-child(2) { text-align: left; }',
                '    @media print { body { padding: 10px; } }',
                '  </style>',
                '</head>',
                '<body>',
                '  <h1>' + subjcode + ' &mdash; Section ' + section + ' &nbsp;|&nbsp; ' + tabLabel + '</h1>',
                '  <p>' + instructor + ' &nbsp;&bull;&nbsp; ' + this.filteredRecordData.length + ' Students &nbsp;&bull;&nbsp; ' + tabLabel + '</p>',
                tableEl.outerHTML,
                '</body>',
                '</html>',
            ].join('\n'))
            win.document.close()
            win.focus()
            setTimeout(function () { win.print() }, 400)
        },
    },
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>