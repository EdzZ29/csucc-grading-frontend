<template>
  <div class="font-inria min-h-screen bg-gray-50 p-4 md:p-8">
    <success-message ref="msg" />

    <grade-weight-modal :is-open="showWeightModal" @close="showWeightModal = false" @save="handleWeightSave" />

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-3xl font-bold font-epundaslab text-green-900">Grading Module</h1>
        <p class="text-sm text-gray-500 mt-1">Manage student grades and class records</p>
      </div>

      <button v-if="user && (user.role === 'ADMIN' || user.role === 'Admin')" @click="showWeightModal = true"
        class="flex items-center gap-2 bg-white text-green-800 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors border border-green-200 text-sm font-semibold shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Set Grade Weights
      </button>
    </div>

<div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-end gap-4">

      <div class="w-full md:w-64">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Academic Year</label>
        <div class="relative">
          <select v-model="selectedYear" class="appearance-none w-full h-10 pl-4 pr-10 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium cursor-pointer text-sm leading-none">
            <option value="" disabled>Select Year</option>
            <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <div class="w-full md:w-64">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Semester</label>
        <div class="relative">
          <select v-model="selectedSemester" class="appearance-none w-full h-10 pl-4 pr-10 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium cursor-pointer text-sm leading-none">
            <option value="" disabled>Select Semester</option>
            <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <div class="w-full md:w-auto flex-grow md:flex-grow-0">
        <button @click="displayData" :disabled="loading"
          class="group w-full md:w-auto h-10 px-6 bg-green-700 text-white rounded-lg hover:bg-green-800 shadow-sm hover:shadow-md transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm">
          <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {{ loading ? "Loading..." : "Display Masterlists" }}
        </button>
      </div>

      <div v-if="activeSubject" class="w-full md:w-auto animate-fade-in">
        <button @click="closeGradebook"
          class="group w-full md:w-auto h-10 px-6 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:shadow-md transition-all font-bold flex items-center justify-center gap-2 text-sm">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
           </svg>
           Close Grading Sheet
        </button>
      </div>
    </div>

    <div v-if="showSubjects && !activeSubject"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <div v-if="subjects.length === 0"
        class="col-span-full text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
        No masterlists found for the selected timeline.
      </div>

      <div v-for="(subject, index) in subjects" :key="index"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
        @click="selectSubject(subject)">
        <div class="bg-green-50 p-4 border-b border-green-100 group-hover:bg-green-100 transition-colors">
          <div class="flex justify-between items-start">
            <h3 class="font-bold text-green-900 text-lg">{{ subject.subjcode }}</h3>
            <span class="bg-white text-green-700 text-xs px-2 py-1 rounded font-bold border border-green-200">{{
              subject.section }}</span>
          </div>
          <p class="text-sm text-green-700 mt-1 truncate">{{ subject.description || 'No Description' }}</p>
        </div>
        <div class="p-4 flex justify-between items-center text-sm text-gray-500">
          <span>{{ subject.students.length }} Students Enrolled</span>
          <span class="text-green-600 font-semibold group-hover:underline flex items-center gap-1">
            Open Sheet <span class="text-lg leading-none">&rarr;</span>
          </span>
        </div>
      </div>
    </div>

    <div v-if="activeSubject"
      class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in flex flex-col h-[75vh] relative">

      <div v-if="loadingGradebook"
        class="absolute inset-0 z-50 bg-white bg-opacity-90 flex flex-col items-center justify-start pt-20 backdrop-blur-sm transition-opacity">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-green-600 mb-3 shadow-lg">
        </div>
        <p class="text-green-800 font-bold animate-pulse tracking-wide">Loading grading-sheet...</p>
      </div>

      <div
        class="bg-gray-800 text-white px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div class="min-w-0">
          <h2 class="text-lg font-bold flex items-center gap-2 truncate">
            <span class="bg-green-600 text-xs px-2 py-0.5 rounded shrink-0">{{ activeSubject.subjcode }}</span>
            <span class="truncate">{{ activeSubject.section }}</span>
          </h2>
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ activeSubject.description }}</p>
        </div>

        <div class="flex bg-gray-700 rounded-lg p-1 overflow-x-auto max-w-full no-scrollbar">
          <button v-for="tab in currentTabs" :key="tab.id" @click="activeTab = tab.id" :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap',
            activeTab === tab.id ? 'bg-green-500 text-white shadow' : 'text-gray-300 hover:text-white']">
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="bg-gray-50 border-b p-3 flex flex-col md:flex-row justify-between items-center gap-3 shrink-0">
        <div class="relative w-full md:w-64">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <input v-model="searchQuery" @input="currentPage = 1" type="text" placeholder="Search student..."
            class="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
        </div>

        <div class="flex gap-2 w-full md:w-auto justify-end">
          <button @click="addActivityColumn"
            class="flex items-center gap-1 bg-white border border-green-600 text-green-700 px-3 py-1.5 rounded text-sm font-semibold hover:bg-green-50 transition-colors shadow-sm whitespace-nowrap">
            <span class="text-lg leading-none font-bold">+</span> Add Column
          </button>
          <button @click="saveGrades"
            class="bg-green-700 text-white px-5 py-1.5 rounded text-sm font-semibold hover:bg-green-800 shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap">
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div class="overflow-auto flex-1 relative w-full" style="max-height: 100%;">
        <table class="w-full text-sm border-collapse relative">
          <thead class="bg-gray-100 text-gray-700 z-20">
            <tr>
              <th
                class="sticky left-0 top-0 z-30 bg-gray-100 border-r border-b px-4 py-3 text-left min-w-[220px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Student Name
              </th>
              <th v-for="(activity, idx) in currentActivities" :key="activity.localId"
                class="sticky top-0 bg-gray-100 border-b border-r px-2 py-2 min-w-[120px] text-center relative group z-20">
                <div class="flex flex-col items-center">
                  <input v-model="activity.name"
                    class="bg-transparent text-center font-bold text-gray-800 w-full focus:outline-none focus:border-b-2 focus:border-green-600 text-xs uppercase tracking-wide"
                    placeholder="ACTIVITY NAME" />
                  <span class="text-[10px] text-gray-400 mt-1">Activity {{ idx + 1 }}</span>
                </div>
                <button @click="removeActivity(idx)"
                  class="absolute top-1 right-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </th>
              <th v-if="currentActivities.length === 0" class="px-6 py-4 text-gray-400 italic font-normal text-left">
                Click "+ Add Column" to start grading
              </th>
            </tr>
            <tr class="bg-green-50">
              <th
                class="sticky left-0 top-[53px] z-30 bg-green-50 border-r border-b px-4 py-2 text-right text-xs font-bold text-green-800 italic shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Highest Possible Score:
              </th>
              <td v-for="activity in currentActivities" :key="'max-' + activity.localId"
                class="sticky top-[53px] z-20 bg-green-50 border-b border-r px-2 py-1 text-center">
                <input type="number" v-model.number="activity.maxScore"
                  class="w-20 text-center bg-white border border-green-200 rounded px-1 py-0.5 text-xs focus:ring-1 focus:ring-green-500 font-bold text-green-700"
                  placeholder="50" min="1" />
              </td>
              <td v-if="currentActivities.length === 0"></td>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="(student, sIdx) in paginatedStudents" :key="student.studid"
              class="hover:bg-yellow-50 transition-colors group">
              <td
                class="sticky left-0 bg-white group-hover:bg-yellow-50 border-r border-gray-200 px-4 py-2 font-medium text-gray-900 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">
                <div class="flex items-center gap-3">
                  <span class="text-xs text-gray-400 w-6 text-right font-mono">{{ (currentPage - 1) * itemsPerPage +
                    sIdx + 1 }}</span>
                  <div class="flex flex-col">
                    <span class="uppercase font-bold text-xs md:text-sm">{{ student.fullname }}</span>
                    <span class="text-[10px] text-gray-400 font-mono">{{ student.studid }}</span>
                  </div>
                </div>
              </td>
              <td v-for="activity in currentActivities" :key="student.studid + '-' + activity.localId"
                class="border-r border-gray-100 p-0 text-center relative">
                <input type="number" v-model.number="student.grades[activity.localId]" min="0" :max="activity.maxScore"
                  class="w-full h-full min-h-[40px] text-center bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-inset focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                  :class="{ 'text-red-600 font-bold': isFailing(student.grades[activity.localId], activity.maxScore) }"
                  placeholder="-" />
              </td>
              <td v-if="currentActivities.length === 0"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="bg-gray-50 border-t p-3 text-xs text-gray-600 flex flex-col md:flex-row justify-between items-center gap-3 shrink-0">
        <div class="font-medium">
          Showing {{ paginatedStudents.length }} of {{ filteredStudents.length }} students
          <span class="hidden md:inline mx-2 text-gray-300">|</span>
          System: <strong class="text-gray-700">{{ activeSubject.gradingSystem }}</strong>
        </div>
        <div class="flex items-center gap-2" v-if="totalPages > 1">
          <button @click="prevPage" :disabled="currentPage === 1"
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Prev</button>
          <span class="text-gray-500 font-medium px-2">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SuccessMessage from "@/components/success-message.vue";
import GradeWeightModal from "./grading-weight-modal.vue";

export default {
  name: "GradingModule",
  components: { SuccessMessage, GradeWeightModal },
  data() {
    return {
      // Configuration
      academicYears: ["2024-2025", "2025-2026", "2026-2027"],
      semesters: ["1st", "2nd", "Summer"],

      // Filter State
      selectedYear: "",
      selectedSemester: "",

      // Data State
      loading: false, // For Masterlist loading
      loadingGradebook: false, // [NEW] For Gradebook specific loading
      subjects: [],
      user: null,

      // [NEW] Grade Weights for Display
      gradeWeights: {
        LECTURE: { WRITTEN: 0, PERFORMANCE: 0, MIDTERM: 0, FINAL: 0 },
        LEC_LAB: { LECTURE_COMP: 0, LAB_COMP: 0, MIDTERM: 0, FINAL: 0 }
      },

      // Gradebook State
      activeSubject: null,
      activeTab: "WRITTEN",
      showSubjects: false,
      showWeightModal: false,

      // Search & Pagination
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 30,

      // Local Store
      activityStore: {},
    };
  },

  computed: {
    // [UPDATED] Dynamic Tabs displaying real percentages
    currentTabs() {
      if (!this.activeSubject) return [];

      // Helper to format percentage
      const p = (val) => (val * 100) + '%';
      const w = this.gradeWeights;

      if (this.activeSubject.gradingSystem === 'LEC_LAB') {
        return [
          { id: 'LECTURE_COMP', label: `Lecture Activities (${p(w.LEC_LAB.LECTURE_COMP)})` },
          { id: 'LAB_COMP', label: `Laboratory (${p(w.LEC_LAB.LAB_COMP)})` },
          { id: 'MIDTERM', label: `Midterm Exam (${p(w.LEC_LAB.MIDTERM)})` },
          { id: 'FINAL', label: `Final Exam (${p(w.LEC_LAB.FINAL)})` }
        ];
      } else {
        return [
          { id: 'WRITTEN', label: `Written Work (${p(w.LECTURE.WRITTEN)})` },
          { id: 'PERFORMANCE', label: `Performance Task (${p(w.LECTURE.PERFORMANCE)})` },
          { id: 'MIDTERM', label: `Midterm Exam (${p(w.LECTURE.MIDTERM)})` },
          { id: 'FINAL', label: `Final Exam (${p(w.LECTURE.FINAL)})` }
        ];
      }
    },

    currentActivities() {
      if (!this.activeSubject) return [];
      const key = this.getSubjectKey(this.activeSubject);
      if (!this.activityStore[key]) this.$set(this.activityStore, key, {});
      if (!this.activityStore[key][this.activeTab]) this.$set(this.activityStore[key], this.activeTab, []);
      return this.activityStore[key][this.activeTab];
    },

    filteredStudents() {
      if (!this.activeSubject) return [];
      if (!this.searchQuery) return this.activeSubject.students;
      const query = this.searchQuery.toLowerCase();
      return this.activeSubject.students.filter(student =>
        student.fullname.toLowerCase().includes(query) ||
        student.studid.toLowerCase().includes(query)
      );
    },

    totalPages() { return Math.ceil(this.filteredStudents.length / this.itemsPerPage); },
    paginatedStudents() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredStudents.slice(start, end);
    }
  },

  async mounted() {
    try {
      const res = await axios.get("http://localhost:9000/api/auth/user", { withCredentials: true });
      this.user = res.data;
      // [NEW] Fetch weights immediately so tabs are correct
      this.fetchWeights();
    } catch (e) { console.error("Auth Error", e); }

    sessionStorage.removeItem("gradingSession");
    this.selectedYear = "";
    this.selectedSemester = "";
    this.subjects = [];
    this.activeSubject = null;
    this.showSubjects = false;
    window.addEventListener("beforeunload", this.saveSession);
  },

  beforeDestroy() {
    window.removeEventListener("beforeunload", this.saveSession);
  },

  watch: {
    activeTab() {
      if (this.activeSubject) this.fetchGradebookData();
    }
  },

  methods: {
    // [NEW] Fetch Grade Weights
    async fetchWeights() {
      try {
        const res = await axios.get('http://localhost:9000/api/grade-weight', { withCredentials: true });
        res.data.forEach(w => {
          if (this.gradeWeights[w.grading_type] && this.gradeWeights[w.grading_type][w.category] !== undefined) {
            this.gradeWeights[w.grading_type][w.category] = Number(w.weight_percentage);
          }
        });
      } catch (e) { console.error("Weight Fetch Error", e); }
    },

    // [UPDATED] Pass weights back to modal when saved
    handleWeightSave(weights) {
      this.showWeightModal = false;
      this.fetchWeights(); // Refresh local weights
      this.$refs.msg.show("✅ Grading weights updated.", "success");
    },

    saveSession() {
      const state = {
        selectedYear: this.selectedYear,
        selectedSemester: this.selectedSemester,
        subjects: this.subjects,
        showSubjects: this.showSubjects,
        activityStore: this.activityStore,
        activeSubjectCode: this.activeSubject ? this.getSubjectKey(this.activeSubject) : null
      };
      sessionStorage.setItem("gradingSession", JSON.stringify(state));
    },

    getSubjectKey(subject) { return `${subject.subjcode}-${subject.section}`; },

    isFailing(score, max) {
      if (!score || !max) return false;
      return (score / max) < 0.5;
    },

    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; },
    prevPage() { if (this.currentPage > 1) this.currentPage--; },

    async displayData() {
      if (!this.selectedYear || !this.selectedSemester) {
        this.$refs.msg.show("⚠️ Select Academic Year and Semester first.", "error");
        return;
      }
      this.loading = true;
      this.activeSubject = null;
      try {
        const url = `http://localhost:9000/api/masterlist/filter/${this.selectedYear}/${this.selectedSemester}`;
        const res = await axios.get(url, { withCredentials: true });
        if (!res.data || res.data.length === 0) {
          this.subjects = [];
          this.$refs.msg.show("ℹ️ No masterlists found.", "info");
          return;
        }
        const grouped = {};
        res.data.forEach((row) => {
          const key = `${row.subjcode}-${row.section}`;
          if (!grouped[key]) {
            grouped[key] = {
              subjcode: row.subjcode,
              section: row.section,
              description: row.type || 'Subject Description',
              gradingSystem: (row.lab_units > 0 || row.subjcode.includes('LAB')) ? 'LEC_LAB' : 'LECTURE',
              students: []
            };
          }
          grouped[key].students.push({
            studid: row.studid,
            fullname: `${row.studlastname}, ${row.studfirstname}`,
            grades: {}
          });
        });
        this.subjects = Object.values(grouped).map(subj => {
          subj.students.sort((a, b) => a.fullname.localeCompare(b.fullname));
          return subj;
        });
        this.showSubjects = true;
        this.saveSession();
        this.$refs.msg.show(`✅ Loaded ${this.subjects.length} masterlists.`, "success");
      } catch (err) {
        console.error(err);
        this.$refs.msg.show("❌ Server error loading masterlists.", "error");
      } finally {
        this.loading = false;
      }
    },

    async selectSubject(subject) {
      this.activeSubject = subject;
      this.activeTab = this.currentTabs[0].id;
      this.searchQuery = "";
      this.currentPage = 1;
      await this.fetchGradebookData();
    },

    async fetchGradebookData() {
      if (!this.activeSubject) return;

      const subjcode = this.activeSubject.subjcode;
      const section = this.activeSubject.section;
      const category = this.activeTab;
      const key = this.getSubjectKey(this.activeSubject);

      if (!this.activityStore[key]) this.$set(this.activityStore, key, {});

      this.loadingGradebook = true; // [START LOADING]
      try {
        const url = `http://localhost:9000/api/class-activity/gradebook/${subjcode}/${section}/${category}`;
        const res = await axios.get(url, { withCredentials: true });

        const backendActivities = res.data.map(act => ({
          localId: act.activity_id,
          activity_id: act.activity_id,
          name: act.activity_name,
          maxScore: act.max_score,
          scores: act.scores
        }));

        this.$set(this.activityStore[key], category, backendActivities);

        backendActivities.forEach(act => {
          if (act.scores && act.scores.length > 0) {
            act.scores.forEach(scoreRecord => {
              const student = this.activeSubject.students.find(s => s.studid === scoreRecord.student.studid);
              if (student) {
                if (!student.grades) this.$set(student, 'grades', {});
                this.$set(student.grades, act.localId, scoreRecord.score);
              }
            });
          }
        });

      } catch (e) {
        console.error("Error fetching gradebook", e);
        this.$refs.msg.show("⚠️ Could not load saved grades.", "error");
      } finally {
        this.loadingGradebook = false; // [END LOADING]
      }
    },

    closeGradebook() { this.activeSubject = null; },

    addActivityColumn() {
      const newId = Date.now();
      const newActivity = { localId: newId, name: "", maxScore: 50 };
      const key = this.getSubjectKey(this.activeSubject);
      this.activityStore[key][this.activeTab].push(newActivity);
      this.activeSubject.students.forEach(student => {
        if (!student.grades) this.$set(student, 'grades', {});
        this.$set(student.grades, newId, '');
      });
    },

    // [UPDATED] Delete Activity
    async removeActivity(index) {
      if (!confirm("Are you sure you want to delete this activity? This cannot be undone.")) return;

      const key = this.getSubjectKey(this.activeSubject);
      const activity = this.activityStore[key][this.activeTab][index];

      // If it has a real DB ID, delete from backend
      if (activity.activity_id) {
        try {
          this.loadingGradebook = true;
          await axios.delete(`http://localhost:9000/api/class-activity/${activity.activity_id}`, { withCredentials: true });
          this.$refs.msg.show("✅ Activity deleted.", "success");
        } catch (e) {
          console.error(e);
          this.$refs.msg.show("❌ Failed to delete activity.", "error");
          this.loadingGradebook = false;
          return; // Stop if failed
        }
      }

      // Remove from frontend view
      this.activityStore[key][this.activeTab].splice(index, 1);
      this.activeSubject.students.forEach(student => {
        if (student.grades) delete student.grades[activity.localId];
      });
      this.loadingGradebook = false;
    },

    async saveGrades() {
      const key = this.getSubjectKey(this.activeSubject);
      const activities = this.activityStore[key][this.activeTab];

      if (!activities || activities.length === 0) {
        this.$refs.msg.show("⚠️ No activities to save.", "info");
        return;
      }

      const payload = {
        subjcode: this.activeSubject.subjcode,
        section: this.activeSubject.section,
        grading_type: this.activeSubject.gradingSystem,
        category: this.activeTab,
        activities: activities.map(act => ({
          activity_id: act.activity_id,
          name: act.name || 'Untitled',
          maxScore: act.maxScore,
          scores: this.activeSubject.students.map(s => ({
            studentId: s.studid,
            score: Number(s.grades[act.localId]) || 0
          }))
        }))
      };

      try {
        this.loadingGradebook = true;
        await axios.post('http://localhost:9000/api/class-activity/save-gradebook', payload, { withCredentials: true });
        this.$refs.msg.show("✅ Grades saved successfully!", "success");
        this.fetchGradebookData();
      } catch (e) {
        console.error(e);
        this.$refs.msg.show("❌ Failed to save grades.", "error");
        this.loadingGradebook = false;
      }
    }
  }
};
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

/* Hide scrollbar for tab navigation but keep functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>