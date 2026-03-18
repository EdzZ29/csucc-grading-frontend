<template>
  <div class="font-inria min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
    <success-message ref="msg" />

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div class="flex items-center gap-4">
        <div class="w-1.5 h-12 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
        <div>
          <h1 class="text-3xl md:text-4xl font-bold font-epundaslab text-gray-800">Student Monitoring</h1>
          <p class="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            OBE Risk Analysis • CO-Level Intervention Detection
          </p>
        </div>
      </div>

      <!-- Retrain button — Admin only -->
      <button
        v-if="user && user.role && user.role.toUpperCase() === 'ADMIN'"
        @click="trainModel"
        :disabled="training"
        class="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-xl hover:from-purple-700 hover:to-purple-800 font-bold text-sm shadow-md transition-all disabled:opacity-50"
      >
        <svg v-if="!training" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        {{ training ? 'Training...' : 'Retrain AI Model' }}
      </button>
    </div>

    <!-- Filters -->
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
          <select v-model="selectedYear"
            class="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none">
            <option value="" disabled>Select Year</option>
            <option v-for="y in academicYears" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div class="w-full md:w-64">
          <label class="block text-xs font-semibold text-gray-500 mb-2 ml-1">Semester</label>
          <select v-model="selectedSemester"
            class="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none">
            <option value="" disabled>Select Semester</option>
            <option v-for="s in semesters" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <button @click="loadSubjects" :disabled="loading"
          class="h-12 px-8 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-orange-600 font-bold text-sm flex items-center gap-2 disabled:opacity-50 shadow-md transition-all">
          <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          {{ loading ? 'Loading...' : 'Load Classes' }}
        </button>
      </div>
    </div>

    <!-- Subject Cards -->
    <div v-if="!activeSubject && subjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <div v-for="(subject, index) in subjects" :key="index" @click="selectSubject(subject)"
        class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group">
        <div class="bg-gradient-to-r from-orange-400 to-orange-500 p-5 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8"></div>
          <div class="flex justify-between items-start relative z-10">
            <h3 class="font-bold text-white text-xl">{{ subject.subjcode }}</h3>
            <span class="bg-white text-orange-600 text-xs px-2 py-1 rounded-full font-bold">Sec {{ subject.section }}</span>
          </div>
          <p class="text-sm text-white/80 mt-2 line-clamp-1 relative z-10">{{ subject.description }}</p>
          <div class="mt-3 flex items-center gap-2 text-xs text-white/70 relative z-10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{{ subject.instructor || 'Unassigned' }}</span>
          </div>
        </div>
        <div class="p-5 flex justify-between items-center">
          <span class="text-sm font-medium text-gray-600">{{ subject.students.length }} Students</span>
          <span class="text-orange-600 font-semibold text-sm group-hover:underline flex items-center gap-1">
            Analyze
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Active Subject — Risk Table -->
    <div v-if="activeSubject" class="animate-fade-in">

      <!-- Back + status bar -->
      <div class="flex flex-wrap justify-between items-center mb-4 gap-3">
        <button @click="activeSubject = null; batchRisks = []"
          class="text-orange-600 font-bold hover:underline flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Classes
        </button>

        <div v-if="analyzing"
          class="text-orange-600 font-bold text-sm animate-pulse flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          AI is analyzing risks...
        </div>
        <div v-else-if="batchRisks.length"
          class="text-green-600 font-bold text-sm flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Analysis Complete
        </div>
        <div v-else class="text-gray-400 text-sm px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
          No grade data — run Compute Grades first
        </div>
      </div>

      <!-- Summary badges -->
      <div v-if="batchRisks.length" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
          <p class="text-3xl font-epundaslab font-bold text-gray-800">{{ batchRisks.length }}</p>
        </div>
        <div class="bg-green-50 rounded-xl p-4 shadow-sm border border-green-100 text-center">
          <p class="text-xs font-bold text-green-500 uppercase tracking-wider mb-1">Safe</p>
          <p class="text-3xl font-epundaslab font-bold text-green-700">{{ countByRisk('Safe') }}</p>
        </div>
        <div class="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-100 text-center">
          <p class="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1">Warning</p>
          <p class="text-3xl font-epundaslab font-bold text-yellow-700">{{ countByRisk('Warning') }}</p>
        </div>
        <div class="bg-red-50 rounded-xl p-4 shadow-sm border border-red-100 text-center">
          <p class="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Critical</p>
          <p class="text-3xl font-epundaslab font-bold text-red-700">{{ countByRisk('Critical') }}</p>
        </div>
      </div>

      <!-- Risk Table -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

        <!-- Table header bar -->
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-bold">{{ activeSubject.subjcode }} — Sec {{ activeSubject.section }}</h2>
            <p class="text-gray-400 text-xs mt-0.5">{{ activeSubject.students.length }} Students • OBE Risk Analysis</p>
          </div>
          <!-- Filter by risk -->
          <select v-model="riskFilter"
            class="bg-gray-700 text-white text-xs rounded-lg px-3 py-1.5 border border-gray-600 focus:outline-none">
            <option value="">All Students</option>
            <option value="Critical">Critical Only</option>
            <option value="Warning">Warning Only</option>
            <option value="Safe">Safe Only</option>
          </select>
        </div>

        <!-- No data state -->
        <div v-if="!analyzing && !batchRisks.length" class="text-center py-16 text-gray-400">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="font-medium mb-1">No prediction data available</p>
          <p class="text-sm">Compute Grades in the Grading Module first, then come back here.</p>
        </div>

        <!-- Table -->
        <div v-else-if="batchRisks.length" class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th class="px-4 py-3">No.</th>
                <th class="px-4 py-3">Student Name</th>
                <th class="px-4 py-3 text-center">Total Weighted %</th>
                <th class="px-4 py-3 text-center">CO Pass Rate</th>
                <th class="px-4 py-3 text-center bg-blue-50">Fail Probability</th>
                <th class="px-4 py-3 text-center bg-purple-50">Risk Level</th>
                <th class="px-4 py-3 text-center">Grade</th>
                <th class="px-4 py-3 text-center">Remarks</th>
                <th class="px-4 py-3">Weak COs</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(r, idx) in filteredRisks" :key="r.studid"
                class="hover:bg-orange-50/30 transition-colors"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'">

                <td class="px-4 py-3 text-gray-400 font-bold text-xs">{{ idx + 1 }}</td>

                <td class="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {{ r.student_name }}
                </td>

                <!-- Total weighted % -->
                <td class="px-4 py-3 text-center">
                  <span class="font-bold" :class="getScoreColor(r.total_weighted_percent)">
                    {{ r.total_weighted_percent ? r.total_weighted_percent.toFixed(1) : '—' }}%
                  </span>
                </td>

                <!-- CO pass rate -->
                <td class="px-4 py-3 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span class="text-xs font-bold text-gray-700">
                      {{ r.co_pass_rate !== undefined ? (r.co_pass_rate * 100).toFixed(0) : '—' }}%
                    </span>
                    <div class="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all"
                        :class="r.co_pass_rate >= 0.75 ? 'bg-green-500' : r.co_pass_rate >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'"
                        :style="{ width: (r.co_pass_rate * 100) + '%' }">
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Fail probability -->
                <td class="px-4 py-3 text-center bg-blue-50/30">
                  <div class="w-28 mx-auto">
                    <div class="flex justify-between text-xs mb-1">
                      <span class="font-bold text-blue-800">{{ r.fail_probability }}%</span>
                    </div>
                    <div class="w-full bg-blue-100 rounded-full h-2">
                      <div class="h-2 rounded-full transition-all duration-500"
                        :class="r.fail_probability >= 70 ? 'bg-red-500' : r.fail_probability >= 40 ? 'bg-yellow-500' : 'bg-blue-500'"
                        :style="{ width: r.fail_probability + '%' }">
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Risk level badge -->
                <td class="px-4 py-3 text-center bg-purple-50/30">
                  <span v-if="r.risk_level === 'Critical'"
                    class="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                    🔴 Critical
                  </span>
                  <span v-else-if="r.risk_level === 'Warning'"
                    class="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">
                    🟡 Warning
                  </span>
                  <span v-else
                    class="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                    🟢 Safe
                  </span>
                </td>

                <!-- Current grade -->
                <td class="px-4 py-3 text-center font-black text-sm"
                  :class="r.current_grade && r.current_grade <= 3.0 ? 'text-green-700' : 'text-red-600'">
                  {{ r.current_grade ? parseFloat(r.current_grade).toFixed(2) : '—' }}
                </td>

                <!-- Remarks -->
                <td class="px-4 py-3 text-center">
                  <span v-if="r.remarks" class="text-xs font-bold px-2 py-1 rounded-full"
                    :class="r.remarks === 'PASSED' ? 'bg-green-100 text-green-700' : r.remarks === 'INC' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'">
                    {{ r.remarks }}
                  </span>
                  <span v-else class="text-gray-400 text-xs">—</span>
                </td>

                <!-- Weak COs -->
                <td class="px-4 py-3">
                  <div v-if="r.weak_cos && r.weak_cos.length" class="flex flex-wrap gap-1">
                    <span v-for="co in r.weak_cos" :key="co"
                      class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                      {{ co }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400 text-xs">—</span>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading skeleton -->
        <div v-else-if="analyzing" class="p-8 space-y-3">
          <div v-for="n in 5" :key="n" class="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SuccessMessage from '@/components/success-message.vue';

export default {
  name: 'StudentMonitoring',
  components: { SuccessMessage },
  data() {
    return {
      loading: false,
      analyzing: false,
      training: false,
      user: null,
      academicYears: ['2024-2025', '2025-2026', '2026-2027'],
      semesters: ['1st', '2nd', 'Summer'],
      selectedYear: '',
      selectedSemester: '',
      subjects: [],
      activeSubject: null,
      batchRisks: [],     // OBE batch predictions from /prediction/batch
      riskFilter: '',     // filter dropdown value
    };
  },
  async mounted() {
    await this.fetchUser();
  },
  computed: {
    filteredRisks() {
      if (!this.riskFilter) return this.batchRisks;
      return this.batchRisks.filter(r => r.risk_level === this.riskFilter);
    },
  },
  methods: {

    async fetchUser() {
      try {
        const res = await this.$axios.get('/auth/user', { withCredentials: true });
        this.user = res.data;
      } catch (e) {
        console.error('Auth check failed', e);
      }
    },

    // ── Retrain AI model ────────────────────────────────────────────
    async trainModel() {
      if (!confirm('Retrain the OBE AI model with current grade data? This may take a moment.')) return;
      this.training = true;
      try {
        const res = await this.$axios.post('/prediction/train', {}, { withCredentials: true });
        this.$refs.msg.show(
          `Training complete! Accuracy: ${res.data.accuracy}% on ${res.data.samples} samples.`,
          'success'
        );
      } catch (e) {
        console.error(e);
        this.$refs.msg.show('Training failed. Is the Python API running?', 'error');
      } finally {
        this.training = false;
      }
    },

    // ── Load class cards ────────────────────────────────────────────
    async loadSubjects() {
      if (!this.selectedYear || !this.selectedSemester) {
        this.$refs.msg.show('Please select Academic Year and Semester.', 'error');
        return;
      }
      this.loading = true;
      this.activeSubject = null;
      this.batchRisks = [];
      try {
        const url = `/masterlist/filter/${this.selectedYear}/${this.selectedSemester}`;
        const res = await this.$axios.get(url, { withCredentials: true });

        if (!res.data || !res.data.length) {
          this.subjects = [];
          this.$refs.msg.show('No classes found.', 'info');
          return;
        }

        const grouped = {};
        res.data.forEach((row) => {
          const key = `${row.subjcode}-${row.section}`;
          if (!grouped[key]) {
            grouped[key] = {
              subjcode:    row.subjcode,
              section:     row.section,
              description: row.type || 'Subject Description',
              instructor:  row.employee ? `${row.employee.firstname} ${row.employee.lastname}` : '',
              students:    [],
            };
          }
          grouped[key].students.push(row);
        });
        this.subjects = Object.values(grouped);
      } catch (e) {
        this.$refs.msg.show('Error loading data.', 'error');
      } finally {
        this.loading = false;
      }
    },

    // ── Select a class and run batch prediction ─────────────────────
    async selectSubject(subject) {
      this.activeSubject = subject;
      this.batchRisks = [];
      this.riskFilter = '';
      await this.analyzeBatchRisk();
    },

    // ── Batch OBE risk prediction ───────────────────────────────────
    async analyzeBatchRisk() {
      if (!this.activeSubject) return;
      this.analyzing = true;
      try {
        const res = await this.$axios.get('/prediction/batch', {
          params: {
            subjcode: this.activeSubject.subjcode,
            section:  this.activeSubject.section,
            sy:       this.selectedYear,
            sem:      this.selectedSemester,
          },
          withCredentials: true,
        });

        if (res.data && !res.data.error) {
          this.batchRisks = res.data;
        } else {
          this.batchRisks = [];
          this.$refs.msg.show(
            res.data?.error || 'No grade data found. Run Compute Grades first.',
            'info'
          );
        }
      } catch (e) {
        console.error('Batch prediction failed', e);
        this.batchRisks = [];
        this.$refs.msg.show('Prediction failed. Is the Python API running?', 'error');
      } finally {
        this.analyzing = false;
      }
    },

    // ── Helpers ─────────────────────────────────────────────────────
    countByRisk(level) {
      return this.batchRisks.filter(r => r.risk_level === level).length;
    },

    getScoreColor(score) {
      if (!score) return 'text-gray-400';
      if (score >= 75) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    },
  },
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0);    }
}
</style>