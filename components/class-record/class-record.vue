<template>
    <div class="font-inria p-4 md:p-8 bg-gray-50 min-h-screen">

        <success-message ref="msg" />

        <div class="mb-6">
            <h1 class="text-3xl font-bold font-epundaslab text-green-900">Class Record</h1>
            <p class="text-sm text-gray-500">View final computed grades and summary sheets</p>
        </div>

        <div
            class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-end gap-4">
            <div class="w-full md:w-64">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Academic
                    Year</label>
                <div class="relative">
                    <select v-model="selectedYear"
                        class="w-full h-10 pl-4 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 text-sm">
                        <option value="" disabled>Select Year</option>
                        <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
                    </select>
                </div>
            </div>

            <div class="w-full md:w-64">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Semester</label>
                <div class="relative">
                    <select v-model="selectedSemester"
                        class="w-full h-10 pl-4 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-green-500 text-sm">
                        <option value="" disabled>Select Semester</option>
                        <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
                    </select>
                </div>
            </div>

            <button @click="loadSubjects" :disabled="loading"
                class="h-10 px-6 bg-green-700 text-white rounded-lg hover:bg-green-800 text-sm font-bold flex items-center justify-center gap-2">
                <span v-if="loading">Loading...</span>
                <span v-else>Load Subjects</span>
            </button>
        </div>

        <div v-if="!activeSubject && subjects.length === 0 && !loading"
            class="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            No class records found. Please select a Year and Semester.
        </div>

        <div v-if="!activeSubject && subjects.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <div v-for="(subject, index) in subjects" :key="index" @click="activeSubject = subject"
                class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all group">
                <div class="bg-green-50 p-4 border-b border-green-100 group-hover:bg-green-100">
                    <div class="flex justify-between">
                        <h3 class="font-bold text-green-900">{{ subject.subjcode }}</h3>
                        <span class="bg-white text-green-700 text-xs px-2 py-1 rounded border border-green-200">{{
                            subject.section }}</span>
                    </div>
                    <p class="text-xs text-green-700 mt-1 uppercase font-bold">{{ subject.gradingSystem }}</p>
                </div>
                <div class="p-4 text-sm text-gray-500">
                    {{ subject.description || 'No Description' }}
                </div>
            </div>
        </div>

        <div v-if="activeSubject" class="animate-fade-in">
            <div class="flex justify-between items-center mb-4">
                <button @click="activeSubject = null"
                    class="text-green-700 font-bold hover:underline flex items-center gap-2">
                    &larr; Back to Subjects
                </button>
                <div class="text-right">
                    <h2 class="font-bold text-lg text-gray-800">{{ activeSubject.subjcode }} - {{ activeSubject.section
                        }}</h2>
                    <span class="text-xs bg-gray-200 px-2 py-1 rounded">{{ activeSubject.gradingSystem }} System</span>
                </div>
            </div>

            <component :is="activeSubject.gradingSystem === 'LEC_LAB' ? 'LecLabView' : 'LectureView'"
                :subject="activeSubject" />
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import LectureView from './class-lecture.vue';
import LecLabView from './lec-lab.vue';
import SuccessMessage from '@/components/success-message.vue';

export default {
    components: { LectureView, LecLabView, SuccessMessage },
    data() {
        return {
            loading: false,
            academicYears: ["2024-2025", "2025-2026"],
            semesters: ["1st", "2nd", "Summer"],
            selectedYear: "",
            selectedSemester: "",
            subjects: [],
            activeSubject: null
        };
    },
    methods: {
        // Load the Masterlists (Subjects and Students)
        async loadClassesFromDatabase() {
            // 1. Validation
            if (!this.selectedYear || !this.selectedSemester) {
                this.$refs.msg.show("Please select Academic Year and Semester.", "error");
                return;
            }

            this.loading = true;
            this.activeSubject = null;

            try {
                const url = `http://localhost:9000/api/masterlist/filter/${this.selectedYear}/${this.selectedSemester}`;
                const response = await axios.get(url, { withCredentials: true });

                if (!response.data || response.data.length === 0) {
                    this.subjects = [];
                    this.$refs.msg.show("No classes found.", "info");
                    this.loading = false;
                    return;
                }

                const organizedClasses = {};

                response.data.forEach(row => {
                    const classId = row.subjcode + "-" + row.section;

                    if (!organizedClasses[classId]) {
                        // --- ROBUST DETECTION FIX START ---
                        let system = 'LECTURE';

                        // 1. Safely convert units to number (handles "3", null, undefined)
                        const units = Number(row.lab_units) || 0;

                        // 2. Safely convert code to uppercase (handles "Lab", "lab", "LAB")
                        const code = (row.subjcode || "").toUpperCase();

                        // Check units OR subject code
                        if (units > 0 || code.includes('LAB')) {
                            system = 'LEC_LAB';
                        }
                        // --- ROBUST DETECTION FIX END ---

                        organizedClasses[classId] = {
                            subjcode: row.subjcode,
                            section: row.section,
                            description: row.type || 'Subject Description',
                            gradingSystem: system, // Now correctly identifies LEC_LAB
                            instructor: row.employee ? (row.employee.firstname + " " + row.employee.lastname) : 'Unassigned',
                            students: []
                        };
                    }

                    organizedClasses[classId].students.push({
                        studid: row.studid,
                        fullname: row.studlastname + ", " + row.studfirstname,
                        grades: {}
                    });
                });

                this.subjects = Object.values(organizedClasses);
                this.showSubjects = true;
                this.$refs.msg.show("Classes loaded successfully.", "success");

            } catch (error) {
                console.error(error);
                this.$refs.msg.show("Error loading classes.", "error");
            } finally {
                this.loading = false;
            }
        },
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
</style>