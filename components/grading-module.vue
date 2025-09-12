<template>
  <div class="flex-1 sm:ml-64 p-4 mt-6 font-inria">

    <!-- Search -->
    <form @submit.prevent class="w-full max-w-md mb-6 font-inria">   
      <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            class="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          v-model="searchQuery"
          class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 bg-gray-50"
          placeholder="Search subjects"
        />
        <button
          type="button"
          @click="searchQuery = ''"
          class="text-white absolute right-2.5 bottom-2.5 bg-green-600 hover:bg-green-700 
                font-medium text-sm px-4 py-2"
        >
          Clear
        </button>
      </div>
    </form>

    <div class="border-b border-1 mt-10"></div>

    <h1 class="text-2xl font-bold mb-6 mt-5 font-epundaslab">Grading Module</h1>

    <!-- Filters -->
    <div class="flex items-end mb-6 gap-4">
      <!-- Academic Year -->
      <div>
        <label class="block mb-1 text-gray-500">Select Academic Year</label>
        <select v-model="selectedSY" class="border px-2 py-2 cursor-pointer">
          <option value="">-- All SY --</option>
          <option v-for="sy in schoolYears" :key="sy" :value="sy">{{ sy }}</option>
        </select>
      </div>

      <!-- Semester -->
      <div>
        <label class="block mb-1 text-gray-500">Select Semester</label>
        <select v-model="selectedSemester" class="border cursor-pointer px-2 py-2">
          <option value="">-- All Semesters --</option>
          <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
        </select>
      </div>

      <!-- Display Button -->
      <div>
        <button
          @click="fetchFilteredSubjects"
          class="bg-green-700 text-white px-4 py-2 mr-3 hover:bg-green-800 transition"
        >
          Display
        </button>
        <button
          @click="resetFilters"
          class="bg-gray-500 text-white px-4 py-2 hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Subjects Table -->
    <div class="overflow-x-auto mt-5">
      <table class="w-full font-inria text-sm text-left text-gray-900">
        <thead class="text-xs text-white uppercase bg-green-700">
          <tr>
            <th class="px-6 py-3">Subject Name</th>
            <th class="px-6 py-3">Subject Code</th>
            <th class="px-6 py-3">Academic Year</th>
            <th class="px-6 py-3">Semester</th>
            <th class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(subj) in filteredSubjects" 
            :key="subj.id" 
            class="bg-white border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="px-6 py-4">{{ subj.name }}</td>
            <td class="px-6 py-4">{{ subj.code }}</td>
            <td class="px-6 py-4">{{ subj.academic_year }}</td>
            <td class="px-6 py-4">{{ subj.semester }}</td>
            <td class="px-6 py-4 flex gap-3">
              <button
                @click="editSubject(subj)"
                class="bg-yellow-500 text-white px-4 py-2 hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                @click="viewStudents(subj)"
                class="bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
              >
                View
              </button>
            </td>
          </tr>
          <tr v-if="filteredSubjects.length === 0" class="bg-white border-b border-gray-200">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">No subjects found.</td>
          </tr>
        </tbody>
      </table>
    </div>



    

    <!-- Students Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 w-3/4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Students in {{ selectedSubject.name }}</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">Close</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full font-inria text-sm text-left text-gray-900">
            <thead class="text-xs text-white uppercase bg-green-700">
              <tr>
                <th class="px-6 py-3">#</th>
                <th class="px-6 py-3">ID Number</th>
                <th class="px-6 py-3">Last Name</th>
                <th class="px-6 py-3">First Name</th>
                <th class="px-6 py-3">Year Level</th>
                <th class="px-6 py-3">Section</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(entry, index) in students" 
                :key="entry.student.studid" 
                class="bg-white border-b border-gray-200 hover:bg-gray-100"
              >
                <td class="px-6 py-4">{{ index + 1 }}</td>
                <td class="px-6 py-4">{{ entry.student.studid }}</td>
                <td class="px-6 py-4">{{ entry.student.lastname }}</td>
                <td class="px-6 py-4">{{ entry.student.firstname }}</td>
                <td class="px-6 py-4">{{ entry.student.studlevel }}</td>
                <td class="px-6 py-4">{{ entry.section }}</td>
              </tr>
              <tr v-if="students.length === 0" class="bg-white border-b border-gray-200">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">No students found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>




  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FilteredSubjectsView",
  data() {
    return {
      subjects: [],
      searchQuery: "",
      selectedSY: "",
      selectedSemester: "",
      showModal: false,
      selectedSubject: null,
      students: [],
      schoolYears: [],
      semesters: []
    };
  },
  mounted() {
    this.loadFilterOptions();
    this.loadAllSubjects();
  },
  computed: {
    filteredSubjects() {
      const query = this.searchQuery.toLowerCase();
      return this.subjects.filter(subj =>
        subj.name.toLowerCase().includes(query) ||
        subj.code.toLowerCase().includes(query) ||
        (subj.academic_year || "").toLowerCase().includes(query) ||
        (subj.semester || "").toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async loadFilterOptions() {
      try {
        const res = await axios.get("http://localhost:8000/api/masterlist/all");
        const allMasterlist = res.data;
        this.schoolYears = [...new Set(allMasterlist.map(item => item.sy))];
        this.semesters = [...new Set(allMasterlist.map(item => item.sem))];
      } catch (err) {
        console.error("❌ Error loading filter options:", err);
      }
    },
    async loadAllSubjects() {
      try {
        const res = await axios.get("http://localhost:8000/api/masterlist/subjects");
        this.subjects = res.data.map(subject => ({
          ...subject,
          academic_year: subject.academic_year || "",
          semester: subject.semester || ""
        }));
      } catch (err) {
        console.error("❌ Error loading all subjects:", err);
      }
    },
    async fetchFilteredSubjects() {
      if (!this.selectedSY && !this.selectedSemester) {
        this.loadAllSubjects();
        return;
      }
      try {
        const res = await axios.get("http://localhost:8000/api/masterlist/subjects", {
          params: {
            sem: this.selectedSemester,
            sy: this.selectedSY
          }
        });
        this.subjects = res.data.map(subject => ({
          ...subject,
          academic_year: this.selectedSY,
          semester: this.selectedSemester
        }));
      } catch (err) {
        console.error("❌ Error fetching filtered subjects:", err);
      }
    },
    resetFilters() {
      this.selectedSY = "";
      this.selectedSemester = "";
      this.loadAllSubjects();
    },
    editSubject(subject) {
      alert(`Edit subject: ${subject.name}`);
    },
    async viewStudents(subject) {
      this.selectedSubject = subject;
      try {
        const res = await axios.get("http://localhost:8000/api/masterlist/students", {
          params: {
            sem: this.selectedSemester,
            sy: this.selectedSY,
            subjectId: subject.id
          }
        });
        this.students = res.data;
        this.showModal = true;
      } catch (err) {
        console.error("❌ Error fetching students:", err);
      }
    },
    closeModal() {
      this.showModal = false;
      this.students = [];
      this.selectedSubject = null;
    }
  },
  
};
</script>
