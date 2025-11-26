<template>
  <div class="font-inria">
    <success-message ref="msg" />

    <h1 class="text-2xl font-bold mb-4 font-epundaslab">Grading Module</h1>

    <!-- ✅ Filters ALWAYS Visible -->
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div>
        <label class="block mb-1 font-medium">Academic Year</label>
        <select v-model="selectedYear" class="border rounded px-3 py-2">
          <option value="" disabled>Select Year</option>
          <option v-for="year in academicYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-medium">Semester</label>
        <select v-model="selectedSemester" class="border rounded px-3 py-2">
          <option value="" disabled>Select Semester</option>
          <option v-for="sem in semesters" :key="sem" :value="sem">
            {{ sem }}
          </option>
        </select>
      </div>

      <div class="flex gap-3 items-center mt-7">
        <button
          @click="displayData"
          class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          {{ loading ? "Loading..." : "Display" }}
        </button>

        <button
          v-if="showSubjects"
          @click="closeSubjects"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Subjects Table -->
    <div v-if="showSubjects" class="mt-6 overflow-x-auto relative">
      <h2 class="text-xl font-semibold mb-4">
        Subjects for {{ displayedYear }} - {{ displayedSemester }}
      </h2>

      <div class="bg-white shadow rounded-lg overflow-hidden relative">
        <table class="min-w-full text-left">
          <thead class="bg-green-700 text-white uppercase text-sm">
            <tr>
              <th class="px-6 py-3 font-semibold">Subject Code</th>
              <th class="px-6 py-3 font-semibold">Section</th>
              <th class="px-6 py-3 font-semibold">Instructor</th>
              <th class="px-6 py-3 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr
              v-for="(subject, index) in subjects"
              :key="'subject-' + index"
              class="hover:bg-gray-100 transition-colors"
            >
              <td class="px-6 py-3 border-b">{{ subject.subjcode }}</td>
              <td class="px-6 py-3 border-b">{{ subject.section }}</td>
              <td class="px-6 py-3 border-b">{{ subject.instructor }}</td>
              <td class="px-6 py-3 border-b text-center">
                <button
                  class="text-blue-700 underline px-3 py-1 rounded-md"
                  @click="showStudentsTable(subject)"
                >
                  {{ activeSubject === subject ? "Hide Students" : "View Students" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Students Table -->
      <transition name="fade">
        <div
          v-if="activeSubject"
          class="mt-8 bg-white shadow rounded-lg overflow-hidden relative z-0"
        >
          <h3 class="text-lg text-white font-semibold bg-green-700 px-6 py-3">
            Students in {{ activeSubject.subjcode }} - {{ activeSubject.section }}
          </h3>

          <div class="flex gap-4 px-6 py-4 bg-gray-50 border-b">
            <button
              v-for="type in ['Written', 'Performance', 'Exam']"
              :key="type"
              @click="switchGradeType(type)"
              :class="[
                'px-4 py-2 rounded font-medium',
                activeGradeType === type
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300',
              ]"
            >
              {{ type }}
            </button>
          </div>

          <div class="p-6 overflow-x-auto">
            <h4 class="font-semibold text-lg mb-4 text-gray-700">
              {{ activeGradeType }} Grades
            </h4>

            <table class="min-w-full border text-sm">
              <thead class="bg-green-700 text-white">
                <tr>
                  <th class="px-4 py-2 border">No.</th>
                  <th class="px-4 py-2 border">Name of Student</th>
                  <th class="px-4 py-2 border">Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(student, idx) in activeSubject.students"
                  :key="student.studid"
                  class="hover:bg-gray-100"
                >
                  <td class="border px-4 py-2 text-center">{{ idx + 1 }}</td>
                  <td class="border px-4 py-2">{{ student.fullname }}</td>
                  <td class="border px-4 py-2 text-center">
                    <input
                      v-model="student.grade"
                      type="number"
                      min="0"
                      max="100"
                      class="w-20 text-center border rounded px-2 py-1"
                      placeholder="0–100"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                @click="saveGrades"
              >
                Submit Grades
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SuccessMessage from "@/components/success-message.vue";

export default {
  name: "GradingModule",
  components: { SuccessMessage },
  data() {
    return {
      academicYears: ["2022-2023", "2023-2024", "2024-2025"],
      semesters: ["1st", "2nd"],
      selectedYear: "",
      selectedSemester: "",
      displayedYear: "",
      displayedSemester: "",
      showSubjects: false,
      subjects: [],
      loading: false,
      user: null,
      activeSubject: null,
      activeGradeType: "Written",
    };
  },

  async mounted() {
    // ✅ Restore session data (only valid while tab is open)
    const saved = sessionStorage.getItem("gradingSession");
    if (saved) {
      const state = JSON.parse(saved);
      this.selectedYear = state.selectedYear;
      this.selectedSemester = state.selectedSemester;
      this.displayedYear = state.displayedYear;
      this.displayedSemester = state.displayedSemester;
      this.subjects = state.subjects;
      this.showSubjects = state.showSubjects;
      this.activeSubject = state.activeSubject;
    }

    // ✅ Clear sessionStorage when page is refreshed
    window.addEventListener("beforeunload", () => {
      sessionStorage.removeItem("gradingSession");
    });

    try {
      const res = await axios.get("http://localhost:9000/api/auth/user", {
        withCredentials: true,
      });
      this.user = res.data;
    } catch (e) {
      console.error("Failed to fetch user", e);
    }
  },

  watch: {
    selectedYear: "saveSession",
    selectedSemester: "saveSession",
    showSubjects: "saveSession",
    subjects: {
      deep: true,
      handler: "saveSession",
    },
    activeSubject: {
      deep: true,
      handler: "saveSession",
    },
  },

  methods: {
    saveSession() {
      const state = {
        selectedYear: this.selectedYear,
        selectedSemester: this.selectedSemester,
        displayedYear: this.displayedYear,
        displayedSemester: this.displayedSemester,
        showSubjects: this.showSubjects,
        subjects: this.subjects,
        activeSubject: this.activeSubject,
      };
      sessionStorage.setItem("gradingSession", JSON.stringify(state));
    },

    async displayData() {
      if (!this.selectedYear || !this.selectedSemester) {
        this.$refs.msg.show("⚠️ Please select both Academic Year and Semester.", "error");
        return;
      }

      this.loading = true;
      this.displayedYear = this.selectedYear;
      this.displayedSemester = this.selectedSemester;

      try {
        const url = `http://localhost:9000/api/masterlist/filter/${this.selectedYear}/${this.selectedSemester}`;
        const res = await axios.get(url, { withCredentials: true });

        if (!res.data || res.data.length === 0) {
          this.subjects = [];
          this.showSubjects = false;
          this.$refs.msg.show("ℹ️ No subjects found.", "info");
          return;
        }

        const grouped = {};
        res.data.forEach((row) => {
          const key = `${row.subjcode}-${row.section}`;
          if (!grouped[key]) {
            grouped[key] = {
              subjcode: row.subjcode,
              section: row.section,
              students: [],
              instructor: row.employee
                ? `${row.employee.firstname} ${row.employee.lastname}`
                : "N/A",
            };
          }
          grouped[key].students.push({
            studid: row.studid,
            fullname: `${row.stud_firstname} ${row.stud_lastname}`,
            grade: "",
          });
        });

        this.subjects = Object.values(grouped);
        this.showSubjects = true;
        this.saveSession();
        this.$refs.msg.show("✅ Displaying data.", "success");
      } catch (err) {
        console.error(err);
        this.$refs.msg.show("❌ Failed to load data.", "error");
      } finally {
        this.loading = false;
      }
    },

    closeSubjects() {
      this.showSubjects = false;
      this.activeSubject = null;
      this.saveSession();
    },

    showStudentsTable(subject) {
      this.activeSubject = this.activeSubject === subject ? null : subject;
      this.saveSession();
    },

    switchGradeType(type) {
      this.activeGradeType = type;
      this.saveSession();
    },

    saveGrades() {
      console.log(`📋 ${this.activeGradeType} grades saved:`, this.activeSubject.students);
      this.$refs.msg.show(
        `✅ ${this.activeGradeType} grades saved (console log for now).`,
        "success"
      );
      this.saveSession();
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
table {
  border-collapse: collapse;
}
td,
th {
  text-align: center;
}
</style>
