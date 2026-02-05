<template>
  <div class="font-inria min-h-screen bg-white p-4 md:p-8 rounded-md">
    <success-message ref="msg" />

    <grade-weight-modal :is-open="showWeightModal" @close="showWeightModal = false" @save="handleWeightSave" />

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-3xl font-bold font-epundaslab text-black700">Grading Module</h1>
        <p class="text-md text-gray-500 mt-1">Manage student grades and class records</p>
      </div>

      <button v-if="user && (user.role === 'ADMIN' || user.role === 'Admin')" @click="showWeightModal = true"
        class="flex items-center gap-2 bg-black700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
        <span>Set Grade Weights</span>
      </button>
    </div>

    <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-end gap-4">

      <div class="w-full md:w-64">
        <label class="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Academic Year</label>
        <select v-model="selectedYear" class="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm">
          <option value="" disabled>Select Year</option>
          <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <div class="w-full md:w-64">
        <label class="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Semester</label>
        <select v-model="selectedSemester" class="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm">
          <option value="" disabled>Select Semester</option>
          <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
        </select>
      </div>

      <button @click="loadClassesFromDatabase" :disabled="loading"
        class="h-10 px-6 bg-orange400 text-white rounded-lg hover:bg-orange300 font-bold text-sm flex items-center gap-2 disabled:opacity-50">
        {{ loading ? "Loading..." : "Display Classes" }}
      </button>

      <button v-if="activeSubject" @click="closeGradingSheet"
        class="h-10 px-6 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-bold text-sm">
        Close Grading Sheet
      </button>
    </div>

    <div v-if="showSubjects && !activeSubject" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">

      <div v-if="subjects.length === 0" class="col-span-full text-center py-10 text-gray-500 border border-dashed rounded-xl">
        No classes found for the selected timeline.
      </div>

      <div v-for="(subject, index) in subjects" :key="index" @click="openGradingSheet(subject)"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md cursor-pointer group">
        <div class="bg-orange400 p-4 border-b border-green-100">
          <div class="flex justify-between items-start">
            <h3 class="font-bold text-white text-lg">{{ subject.subjcode }}</h3>
            <span class="bg-white text-orange400 text-xs px-2 py-1 rounded font-bold">
              {{ subject.section }}
            </span>
          </div>
          <p class="text-sm text-white mt-1 truncate">{{ subject.description }}</p>
          <p class="text-xs text-white mt-2 flex items-center gap-1">
            <span class="font-bold">Instructor:</span> {{ subject.instructor }}
          </p>
        </div>
        <div class="p-4 flex justify-between items-center text-sm text-gray-500">
          <span>{{ subject.students.length }} Students</span>
          <span class="text-orange400 font-semibold group-hover:underline">Open Sheet &rarr;</span>
        </div>
      </div>
    </div>

    <div v-if="activeSubject" class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[75vh] relative animate-fade-in">

      <div v-if="loadingGradebook" class="fixed inset-0 z-50 bg-white bg-opacity-90 flex flex-col items-center justify-center h-screen w-screen">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-t-green-600 border-gray-200 mb-4"></div>
        <p class="text-green-800 font-bold text-xl animate-pulse">Processing...</p>
      </div>

      <div class="bg-black700 text-white px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex-1">
          <h2 class="text-lg font-bold flex items-center gap-2">
            <span class="bg-orange400 text-xs px-2 py-0.5 rounded">{{ activeSubject.subjcode }}</span>
            {{ activeSubject.section }}
          </h2>
          <div class="mt-1 flex items-center gap-2 text-sm">
            <span class="text-orange400 font-bold">Instructor:</span>
            <span class="text-white">{{ activeSubject.instructor }}</span>
          </div>
        </div>

        <div class="flex bg-gray-700 rounded-lg p-1 overflow-x-auto no-scrollbar">
          <button v-for="tab in availableTabs" :key="tab.id" @click="activeTab = tab.id"
            :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap',
            activeTab === tab.id ? 'bg-orange400 text-white shadow' : 'text-gray-300 hover:text-white']">
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="bg-gray-50 border-b p-3 flex flex-col md:flex-row justify-between items-center gap-3">
        <input v-model="searchQuery" @input="currentPage = 1" type="text" placeholder="Search student..."
          class="w-full md:w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-lg">

        <div class="flex gap-2">
          <button @click="addNewColumn" class="bg-white border border-green-600 text-green-700 px-3 py-1.5 rounded text-sm font-bold hover:bg-green-50">
            + Add Column
          </button>
          <button @click="saveGradesToServer" class="bg-white border border-blue-600 text-blue-700 px-4 py-1.5 rounded text-sm font-bold hover:bg-blue-50 shadow-sm">
            Save Scores
          </button>
          <button @click="calculateFinalGrades" class="bg-green-700 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-green-800 shadow-sm">
            Compute Final Grades
          </button>
        </div>
      </div>

      <div class="overflow-auto flex-1 relative w-full">
        <table class="w-full text-sm border-collapse relative">
          <thead class="bg-gray-100 text-gray-700 z-20">
            <tr>
              <th class="sticky left-0 top-0 z-30 bg-gray-100 border-r border-b px-4 py-3 text-left min-w-[220px] shadow-sm">
                Student Name
              </th>
              <th v-for="(activity, idx) in currentActivitiesList" :key="activity.localId"
                class="sticky top-0 bg-gray-100 border-b border-r px-2 py-2 min-w-[120px] text-center group z-20">
                <div class="flex flex-col items-center">
                  <input v-model="activity.name" placeholder="ACTIVITY NAME"
                    class="bg-transparent text-center font-bold text-gray-800 w-full focus:outline-none focus:border-b-2 focus:border-green-600 text-xs uppercase" />
                  <span class="text-[10px] text-gray-400 mt-1">Activity {{ idx + 1 }}</span>
                </div>
                <button @click="deleteColumn(idx)" class="absolute top-1 right-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100">
                  ✕
                </button>
              </th>
            </tr>

            <tr class="bg-green-50">
              <th class="sticky left-0 top-[53px] z-30 bg-green-50 border-r border-b px-4 py-2 text-right text-xs font-bold text-green-800 italic shadow-sm">
                Highest Possible Score:
              </th>
              <td v-for="activity in currentActivitiesList" :key="'max-' + activity.localId" class="sticky top-[53px] z-20 bg-green-50 border-b border-r px-2 py-1 text-center">
                <input type="number" class="border border-green-300 text-center w-16 font-bold text-green-700 bg-white rounded"
                  v-model.number="activity.maxScore" />
              </td>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="(student, sIdx) in studentsOnCurrentPage" :key="student.studid" class="hover:bg-yellow-50 group">
              <td class="sticky left-0 bg-white group-hover:bg-yellow-50 border-r border-gray-200 px-4 py-2 font-medium text-gray-900 whitespace-nowrap shadow-sm z-10">
                <div class="flex items-center gap-3">
                  <span class="text-xs text-gray-400 w-6 text-right font-mono">{{ (currentPage - 1) * itemsPerPage + sIdx + 1 }}</span>
                  <div class="flex flex-col">
                    <span class="uppercase font-bold text-xs md:text-sm">{{ student.fullname }}</span>
                    <span class="text-[10px] text-gray-400 font-mono">{{ student.studid }}</span>
                  </div>
                </div>
              </td>
              <td v-for="activity in currentActivitiesList" :key="student.studid + '-' + activity.localId" class="border-r border-gray-100 p-0 text-center">
                <input type="number"
                  v-model.number="student.grades[activity.localId]"
                  min="0" :max="activity.maxScore"
                  @input="checkScoreLimits(student, activity)"
                  class="w-full h-full min-h-[40px] text-center bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-inset focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                  :class="{ 'text-red-600 font-bold': isScoreFailing(student.grades[activity.localId], activity.maxScore) }"
                  placeholder="-" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-gray-50 border-t p-3 text-xs text-gray-600 flex justify-between items-center">
        <div>
          Showing {{ studentsOnCurrentPage.length }} of {{ filteredStudentList.length }} students
        </div>
        <div class="flex gap-2" v-if="totalPages > 1">
          <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-1 bg-white border rounded hover:bg-gray-100">Prev</button>
          <span class="px-2 py-1">Page {{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 bg-white border rounded hover:bg-gray-100">Next</button>
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
      // Dropdown Options
      academicYears: ["2024-2025", "2025-2026", "2026-2027"],
      semesters: ["1st", "2nd", "Summer"],

      // Selections
      selectedYear: "",
      selectedSemester: "",

      // Loading States
      loading: false,
      loadingGradebook: false,

      // Data Storage
      subjects: [], // List of all classes
      user: null,   // Logged in user info
      activeSubject: null, // The currently opened class
      activeTab: "WRITTEN", // Which tab is open (Written, Performance, etc)

      // UI Controls
      showSubjects: false,
      showWeightModal: false,
      searchQuery: "",

      // Pagination
      currentPage: 1,
      itemsPerPage: 30,

      // This object holds all grades for all subjects so we don't lose data
      // Structure: { "SubjectCode-Section": { "WRITTEN": [activities...], "MIDTERM": [...] } }
      activityStore: {},

      // Default Grade Weights (percentages)
      gradeWeights: {
        LECTURE: { WRITTEN: 0, PERFORMANCE: 0, MIDTERM: 0, FINAL: 0 },
        LEC_LAB: { LECTURE_COMP: 0, LAB_COMP: 0, MIDTERM: 0, FINAL: 0 }
      }
    };
  },

  computed: {
    // Generate the Tabs for the top right (Written, Performance, etc.)
    availableTabs() {
      // Return empty if no subject is selected
      if (!this.activeSubject) return [];

      const system = this.activeSubject.gradingSystem;
      console.log(this.activeSubject)
      const weights = this.gradeWeights[system]; // Get weights for this system

      // Helper function to format percentage
      const fmt = (num) => (num * 100).toFixed(0) + '%';

      if (system === 'LEC_LAB') {
        return [
          { id: 'LECTURE_COMP', label: 'Lecture Activities (' + fmt(weights.LECTURE_COMP) + ')' },
          { id: 'LAB_COMP', label: 'Laboratory (' + fmt(weights.LAB_COMP) + ')' },
          { id: 'MIDTERM', label: 'Midterm Exam (' + fmt(weights.MIDTERM) + ')' },
          { id: 'FINAL', label: 'Final Exam (' + fmt(weights.FINAL) + ')' }
        ];
      } else {
        // Default LECTURE system
        return [
          { id: 'WRITTEN', label: 'Written Work (' + fmt(weights.WRITTEN) + ')' },
          { id: 'PERFORMANCE', label: 'Performance Task (' + fmt(weights.PERFORMANCE) + ')' },
          { id: 'MIDTERM', label: 'Midterm Exam (' + fmt(weights.MIDTERM) + ')' },
          { id: 'FINAL', label: 'Final Exam (' + fmt(weights.FINAL) + ')' }
        ];
      }
    },

    // Get the list of activities (columns) for the current subject and current tab
    currentActivitiesList() {
      if (!this.activeSubject) return [];

      // Create a unique key for this subject (e.g., "CSC101-A")
      const uniqueKey = this.getUniqueSubjectKey(this.activeSubject);

      // Make sure the storage exists, if not, create empty objects
      if (!this.activityStore[uniqueKey]) {
        this.$set(this.activityStore, uniqueKey, {});
      }
      if (!this.activityStore[uniqueKey][this.activeTab]) {
        this.$set(this.activityStore[uniqueKey], this.activeTab, []);
      }

      // Return the array of activities
      return this.activityStore[uniqueKey][this.activeTab];
    },

    // Filter students based on the search bar
    filteredStudentList() {
      if (!this.activeSubject) return [];

      // If search box is empty, return everyone
      if (!this.searchQuery) return this.activeSubject.students;

      const text = this.searchQuery.toLowerCase();
      // Check if name or ID matches
      return this.activeSubject.students.filter(student =>
        student.fullname.toLowerCase().includes(text) ||
        student.studid.toLowerCase().includes(text)
      );
    },

    // Calculate how many pages of students we have
    totalPages() {
      return Math.ceil(this.filteredStudentList.length / this.itemsPerPage);
    },

    // Get only the students for the current page
    studentsOnCurrentPage() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredStudentList.slice(start, end);
    }
  },

  // Run this when the page loads
  async mounted() {
    this.getUserInfo();
    this.getGradeWeights();
  },

  // Watch for changes
  watch: {
    // When the user switches tabs (e.g., Written -> Performance), reload data
    activeTab() {
      if (this.activeSubject) {
        this.fetchScoresFromDatabase();
      }
    }
  },

  methods: {

    // DATA LOADING FUNCTIONS BELOW

    // Get the logged-in user
    async getUserInfo() {
      try {
        const response = await axios.get("http://localhost:9000/api/auth/user", { withCredentials: true });
        this.user = response.data;
      } catch (error) {
        console.error("User not found", error);
      }
    },

    // Get the percentages (weights) from the server
    async getGradeWeights() {
      try {
        const response = await axios.get('http://localhost:9000/api/grade-weight', { withCredentials: true });

        // Loop through the database results and update our local 'gradeWeights' variable
        response.data.forEach(item => {
          const type = item.grading_type; // e.g., LECTURE
          const cat = item.category;      // e.g., WRITTEN

          // Check if this type and category exist in our defaults
          if (this.gradeWeights[type] && this.gradeWeights[type][cat] !== undefined) {
             this.gradeWeights[type][cat] = Number(item.weight_percentage);
          }
        });
      } catch (error) {
        console.error("Failed to load weights", error);
      }
    },

    // Load the Masterlists (Subjects and Students)
    async loadClassesFromDatabase() {
      // Validation: Ensure year and sem are picked
      if (!this.selectedYear || !this.selectedSemester) {
        this.$refs.msg.show("Please select Academic Year and Semester.", "error");
        return;
      }

      this.loading = true;
      this.activeSubject = null; // Close any open sheet

      try {
        // Construct the API URL
        const url = `http://localhost:9000/api/masterlist/filter/${this.selectedYear}/${this.selectedSemester}`;
        const response = await axios.get(url, { withCredentials: true });

        // Check if we got data
        if (!response.data || response.data.length === 0) {
          this.subjects = [];
          this.$refs.msg.show("No classes found.", "info");
          this.loading = false;
          return;
        }

        // The database returns a flat list of students. We need to group them by Subject.
        const organizedClasses = {};

        // Loop through every row from database
        response.data.forEach(row => {
          // Create a unique ID for the class like "CSC101-A"
          const classId = row.subjcode + "-" + row.section;

          // If this class is not in our list yet, add it
          if (!organizedClasses[classId]) {
            // Determine if it is Lec or Lec/Lab
            let system = 'LECTURE';
            if (row.lab_units > 0 || row.subjcode.includes('LAB')) {
              system = 'LEC_LAB';
            }

            // Create the class object
            organizedClasses[classId] = {
              subjcode: row.subjcode,
              section: row.section,
              description: row.type || 'Subject Description',
              gradingSystem: system,
              instructor: row.employee ? (row.employee.firstname + " " + row.employee.lastname) : 'Unassigned',
              students: [] // Start with empty student list
            };
          }

          // Add the student to this class
          organizedClasses[classId].students.push({
            studid: row.studid,
            fullname: row.studlastname + ", " + row.studfirstname,
            grades: {} // Storage for this student's grades
          });
        });

        // Convert our object back to a simple array for the HTML to use
        this.subjects = Object.values(organizedClasses);

        // Show the list
        this.showSubjects = true;
        this.$refs.msg.show("Classes loaded successfully.", "success");

      } catch (error) {
        console.error(error);
        this.$refs.msg.show("Error loading classes.", "error");
      } finally {
        this.loading = false;
      }
    },

    // GRADING SHEET ACTION FUNCTIONS BELOW

    // Open a specific subject
    async openGradingSheet(subject) {
      this.activeSubject = subject;
      this.activeTab = this.availableTabs[0].id; // Default to first tab (Written)
      this.currentPage = 1; // Reset to page 1

      // Fetch grades for all categories
      this.loadingGradebook = true;
      await this.fetchScoresFromDatabase();
      this.loadingGradebook = false;
    },

    // Get scores for the current class and current tab
    async fetchScoresFromDatabase() {
      if (!this.activeSubject) return;

      const code = this.activeSubject.subjcode;
      const section = this.activeSubject.section;
      const category = this.activeTab;
      const uniqueKey = this.getUniqueSubjectKey(this.activeSubject);

      // Initialize storage if needed
      if (!this.activityStore[uniqueKey]) this.$set(this.activityStore, uniqueKey, {});

      try {
        const url = `http://localhost:9000/api/class-activity/gradebook/${code}/${section}/${category}`;
        const response = await axios.get(url, { withCredentials: true });

        // 1. Create a "Map" to find students quickly by ID
        const studentFinder = {};
        this.activeSubject.students.forEach(student => {
          studentFinder[student.studid] = student;
        });

        // 2. Format the data from the backend
        const activities = response.data.map(item => ({
          localId: item.activity_id,
          activity_id: item.activity_id,
          name: item.activity_name,
          maxScore: item.max_score,
          scores: item.scores
        }));

        // 3. Save activities to our store
        this.$set(this.activityStore[uniqueKey], category, activities);

        // 4. Distribute scores to students
        activities.forEach(activity => {
          if (activity.scores) {
            activity.scores.forEach(scoreRecord => {
              // Find the student
              const studentId = scoreRecord.student ? scoreRecord.student.studid : null;
              const student = studentFinder[studentId];

              // If student exists, give them the grade
              if (student) {
                if (!student.grades) this.$set(student, 'grades', {});
                this.$set(student.grades, activity.localId, scoreRecord.score);
              }
            });
          }
        });

      } catch (error) {
        console.error(error);
      }
    },

    // Close the grading sheet
    closeGradingSheet() {
      this.activeSubject = null;
    },

    // EDITING & SAVING Functions below

    // Add a new column to the table
    addNewColumn() {
      const uniqueId = Date.now(); // Generate unique ID based on time
      const newActivity = {
        localId: uniqueId,
        name: "",
        maxScore: 50
      };

      const key = this.getUniqueSubjectKey(this.activeSubject);

      // Add to the list of columns
      this.activityStore[key][this.activeTab].push(newActivity);

      // Initialize grade as NULL for every student
      this.activeSubject.students.forEach(student => {
        if (!student.grades) this.$set(student, 'grades', {});
        this.$set(student.grades, uniqueId, null);
      });
    },

    // Delete a column
    async deleteColumn(index) {
      if (!confirm("Delete this activity? This cannot be undone.")) return;

      const key = this.getUniqueSubjectKey(this.activeSubject);
      const activity = this.activityStore[key][this.activeTab][index];

      // If it has a real ID from database, delete it from server
      if (activity.activity_id) {
        try {
          this.loadingGradebook = true;
          await axios.delete(`http://localhost:9000/api/class-activity/${activity.activity_id}`, { withCredentials: true });
          this.$refs.msg.show("Activity deleted.", "success");
        } catch (error) {
          this.$refs.msg.show("Could not delete.", "error");
          this.loadingGradebook = false;
          return;
        }
      }

      // Remove from UI
      this.activityStore[key][this.activeTab].splice(index, 1);
      this.loadingGradebook = false;
    },

    // Save grades to the database
    async saveGradesToServer() {
      const key = this.getUniqueSubjectKey(this.activeSubject);
      const activities = this.activityStore[key][this.activeTab];

      // Prepare data for the API
      const payload = {
        subjcode: this.activeSubject.subjcode,
        section: this.activeSubject.section,
        sy: this.selectedYear,
        sem: this.selectedSemester,
        grading_type: this.activeSubject.gradingSystem,
        category: this.activeTab,
        activities: [],
        finalGrades: [],
      };

      // Loop through activities to format them
      if (activities) {
        payload.activities = activities.map(act => {
          return {
            activity_id: act.activity_id,
            name: act.name || 'Untitled',
            maxScore: act.maxScore,
            // Collect scores for this activity
            scores: this.activeSubject.students.map(student => {
              const grade = student.grades[act.localId];

              // Convert to number, but send null if empty
              let finalScore = null;
              if (grade !== '' && grade !== null && grade !== undefined) {
                finalScore = Number(grade);
              }

              return {
                studentId: student.studid,
                score: finalScore
              };
            })
          };
        });
      }

      // Send to server
      try {
        this.loadingGradebook = true;
        await axios.post('http://localhost:9000/api/class-activity/save-gradebook', payload, { withCredentials: true });
        this.$refs.msg.show("Grades saved successfully!", "success");
        // Reload to get fresh IDs
        this.fetchScoresFromDatabase();
      } catch (error) {
        console.error(error);
        this.$refs.msg.show("Failed to save.", "error");
      } finally {
        this.loadingGradebook = false;
      }
    },


    // MATH & CALCULATION Functions below

    // Check if input is valid (not higher than max score)
    checkScoreLimits(student, activity) {
      const gradeId = activity.localId;
      const score = student.grades[gradeId];

      if (score === "" || score === null) return;

      // Reset to max if they type too high
      if (score > activity.maxScore) {
        this.$set(student.grades, gradeId, activity.maxScore);
      }
      // Reset to 0 if negative
      if (score < 0) {
        this.$set(student.grades, gradeId, 0);
      }
    },

    // Check if score is less than 50%
    isScoreFailing(score, max) {
      if (!score || !max) return false;
      return (score / max) < 0.5;
    },

    // Convert Grade (e.g. 95) to Point (e.g. 1.0)
    convertScoreToGradePoint(score) {
      if (score >= 94.44) return 1.00;
      if (score >= 88.89) return 1.25;
      if (score >= 83.33) return 1.50;
      if (score >= 77.78) return 1.75;
      if (score >= 72.22) return 2.00;
      if (score >= 66.67) return 2.25;
      if (score >= 61.11) return 2.50;
      if (score >= 55.56) return 2.75;
      if (score >= 50.00) return 3.00;
      return 5.00; // Fail
    },

    // Compute final grades for all students
    async calculateFinalGrades() {
      if (!confirm("Calculate and overwrite final grades?")) return;

      // Loop through all students and calculate
      const finalGradesList = this.activeSubject.students.map(student => {
        // 1. Calculate raw weighted score
        let totalWeightedScore = this.calculateStudentWeightedScore(student);

        // 2. Convert to Grade Point (1.0 - 5.0)
        let gradePoint = 0;
        let remarks = "No Grade";

        if (totalWeightedScore > 0) {
          gradePoint = this.convertScoreToGradePoint(totalWeightedScore);
          // 3. Set Remarks
          if (gradePoint <= 3.00) {
            remarks = "Passed";
          } else {
            remarks = "Failed";
          }
        }

        return {
          studentId: student.studid,
          weightedScore: parseFloat(totalWeightedScore.toFixed(2)),
          numericalGrade: gradePoint,
          remarks: remarks
        };
      });

      // Prepare payload
      const payload = {
        subjcode: this.activeSubject.subjcode,
        section: this.activeSubject.section,
        sy: this.selectedYear,
        sem: this.selectedSemester,
        grading_type: "Lec", // API Requirement
        category: "FINAL",   // API Requirement
        finalGrades: finalGradesList,
        activities: []
      };

      // Send to server
      try {
        this.loadingGradebook = true;
        await axios.post('http://localhost:9000/api/class-activity/save-final-grades', payload, { withCredentials: true });
        this.$refs.msg.show("Final grades computed and saved!", "success");
      } catch (error) {
        console.error(error);
        this.$refs.msg.show("Error saving final grades.", "error");
      } finally {
        this.loadingGradebook = false;
      }
    },

    // Helper: Calculate the weighted average for ONE student
    calculateStudentWeightedScore(student) {
      const system = this.activeSubject.gradingSystem;
      const categories = Object.keys(this.gradeWeights[system]);
      const key = this.getUniqueSubjectKey(this.activeSubject);

      let finalScore = 0;
      let hasGrades = false;

      // Loop through categories (Written, Perf, Midterm, Final)
      categories.forEach(cat => {
        const activities = this.activityStore[key] && this.activityStore[key][cat] ? this.activityStore[key][cat] : [];
        const weight = this.gradeWeights[system][cat] || 0; // e.g., 0.20 for 20%

        if (activities.length > 0) {
          let totalMyScore = 0;
          let totalMaxScore = 0;

          // Sum up scores in this category
          activities.forEach(act => {
            const myScore = Number(student.grades[act.localId]) || 0;
            const max = Number(act.maxScore) || 0;
            totalMyScore += myScore;
            totalMaxScore += max;
          });

          // Math: (MyTotal / MaxTotal) * Weight
          if (totalMaxScore > 0) {
            const weightedPart = (totalMyScore / totalMaxScore) * (weight * 100);
            finalScore += weightedPart;
            hasGrades = true;
          }
        }
      });

      return hasGrades ? finalScore : 0;
    },

    // Helper: Update weights when modal saves
    handleWeightSave() {
      this.showWeightModal = false;
      this.getGradeWeights(); // Reload weights
      this.$refs.msg.show("Weights updated.", "success");
    },

    // Helper: Create a unique key string
    getUniqueSubjectKey(subject) {
      return subject.subjcode + "-" + subject.section;
    },

    // Pagination Controls
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    previousPage() {
      if (this.currentPage > 1) this.currentPage--;
    }
  }
};
</script>

<style scoped>
/* Simple Fade Animation */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar Styling */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>