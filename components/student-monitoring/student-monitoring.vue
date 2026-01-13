<template>
    <div class="font-inria p-4 md:p-8 bg-gray-50 min-h-screen">
        <success-message ref="msg" />

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 class="text-3xl font-bold font-epundaslab text-green-900">Student Monitoring</h1>
                <p class="text-sm text-gray-500">Dual-Model Analysis: Binary (Probability) & Multinomial
                    (Classification)</p>
            </div>

            <button v-if="user && user.role && user.role.toUpperCase() === 'ADMIN'" @click="trainModel"
                :disabled="training"
                class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 border border-green-500 text-sm font-semibold shadow-sm transition-all">
                <span v-if="training" class="animate-spin">🔄</span>
                <span v-else>Retrain AI Models</span>
            </button>
        </div>

        <div
            class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-end gap-4">
            <div class="w-full md:w-64">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Academic
                    Year</label>
                <select v-model="selectedYear"
                    class="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    <option value="" disabled>Select Year</option>
                    <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>

            <div class="w-full md:w-64">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Semester</label>
                <select v-model="selectedSemester"
                    class="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm">
                    <option value="" disabled>Select Semester</option>
                    <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
                </select>
            </div>

            <button @click="loadSubjects" :disabled="loading"
                class="h-10 px-6 bg-green-700 text-white rounded-lg hover:bg-green-800 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {{ loading ? "Loading..." : "Load Classes" }}
            </button>
        </div>

        <div v-if="!activeSubject && subjects.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <div v-for="(subject, index) in subjects" :key="index" @click="selectSubject(subject)"
                class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all group">
                <div class="bg-green-50 p-4 border-b border-green-100">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-green-900 text-lg">{{ subject.subjcode }}</h3>
                        <span
                            class="bg-white text-green-700 text-xs px-2 py-1 rounded font-bold border border-green-200">
                            {{ subject.section }}
                        </span>
                    </div>
                    <p class="text-sm text-green-700 mt-1 truncate">{{ subject.description }}</p>
                    <p class="text-xs text-gray-500 mt-2">Instructor: {{ subject.instructor || 'Unassigned' }}</p>
                </div>
                <div class="p-4 flex justify-between items-center text-sm text-gray-500">
                    <span>{{ subject.students.length }} Students</span>
                    <span class="text-green-600 font-semibold group-hover:underline flex items-center gap-1">
                        Auto-Analyze <span class="text-lg">&rarr;</span>
                    </span>
                </div>
            </div>
        </div>

        <div v-if="activeSubject" class="animate-fade-in">
            <div class="flex justify-between items-center mb-4">
                <button @click="activeSubject = null"
                    class="text-green-700 font-bold hover:underline flex items-center gap-2">
                    &larr; Back to Classes
                </button>

                <div v-if="analyzing"
                    class="text-orange-600 font-bold text-sm animate-pulse flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                    <span class="animate-spin">⚙️</span>
                    <span>AI is analyzing student risks...</span>
                </div>
                <div v-else
                    class="text-green-600 font-bold text-sm flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <span>Analysis Complete</span>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <div class="bg-gray-800 text-white p-4 flex justify-between items-center">
                    <div>
                        <h2 class="text-lg font-bold">{{ activeSubject.subjcode }} - {{ activeSubject.section }}</h2>
                        <p class="text-xs opacity-80">{{ activeSubject.description }}</p>
                    </div>
                    <div class="text-right text-xs">
                        <span class="block text-gray-400">Total Students</span>
                        <span class="text-xl font-bold">{{ activeSubject.students.length }}</span>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th class="px-6 py-3">Student Name</th>
                                <th class="px-2 py-3 text-center bg-gray-50">Written</th>
                                <th class="px-2 py-3 text-center bg-gray-50">Perf</th>
                                <th class="px-2 py-3 text-center bg-gray-50">Exam</th>

                                <th class="px-6 py-3 text-center bg-blue-50 border-l border-blue-100">
                                    Binary Model<br>
                                    <span class="text-[10px] normal-case opacity-70">(Fail Probability)</span>
                                </th>
                                <th class="px-6 py-3 text-center bg-purple-50 border-l border-purple-100">
                                    Multinomial Model<br>
                                    <span class="text-[10px] normal-case opacity-70">(Risk Category)</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="student in activeSubject.students" :key="student.studid"
                                class="bg-white border-b hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ student.studlastname }}, {{ student.studfirstname }}
                                </td>

                                <td class="px-2 py-4 text-center text-gray-600 bg-gray-50/30">{{
                                    getComponentAvg(student, 'WRITTEN') }}%</td>
                                <td class="px-2 py-4 text-center text-gray-600 bg-gray-50/30">{{
                                    getComponentAvg(student, 'PERFORMANCE') }}%</td>
                                <td class="px-2 py-4 text-center text-gray-600 bg-gray-50/30">{{
                                    getComponentAvg(student, 'MIDTERM') }}%</td>

                                <td class="px-6 py-4 text-center bg-blue-50/30 border-l border-blue-100">
                                    <div v-if="risks[student.studid]" class="w-32 mx-auto">
                                        <div class="flex justify-between text-xs mb-1">
                                            <span class="font-bold text-blue-800">{{
                                                risks[student.studid].binary_fail_prob }}%</span>
                                            <span class="text-blue-400 text-[10px]">Risk</span>
                                        </div>
                                        <div class="w-full bg-blue-200 rounded-full h-2">
                                            <div class="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                :style="{ width: risks[student.studid].binary_fail_prob + '%' }"></div>
                                        </div>
                                    </div>
                                    <span v-else class="text-xs text-gray-400 italic">Analysing...</span>
                                </td>

                                <td class="px-6 py-4 text-center bg-purple-50/30 border-l border-purple-100">
                                    <div v-if="risks[student.studid]">
                                        <span v-if="risks[student.studid].multinomial_status === 'Critical'"
                                            class="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200 shadow-sm">
                                             Critical
                                        </span>
                                        <span v-else-if="risks[student.studid].multinomial_status === 'Warning'"
                                            class="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200 shadow-sm">
                                             Warning
                                        </span>
                                        <span v-else
                                            class="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200 shadow-sm">
                                            Safe
                                        </span>
                                    </div>
                                    <span v-else class="text-xs text-gray-400 italic">...</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import SuccessMessage from '@/components/success-message.vue';

export default {
    name: 'StudentMonitoring',
    components: { SuccessMessage },
    data() {
        return {
            loading: false,
            analyzing: false,
            training: false,
            user: null, // Stores logged in user info
            academicYears: ["2024-2025", "2025-2026", "2026-2027"],
            semesters: ["1st", "2nd", "Summer"],
            selectedYear: "",
            selectedSemester: "",
            subjects: [],
            activeSubject: null,
            risks: {} // Stores AI predictions { studid: { binary_fail_prob, multinomial_status } }
        };
    },
    async mounted() {
        await this.fetchUser();
    },
    methods: {
        async fetchUser() {
            try {
                const res = await axios.get("http://localhost:9000/api/auth/user", { withCredentials: true });
                this.user = res.data;
            } catch (e) {
                console.error("Auth check failed", e);
            }
        },

        // --- 1. ADMIN ACTION: Retrain Models ---
        async trainModel() {
            if (!confirm("Start training the AI Model? This may take a few minutes.")) return;
            this.training = true;
            try {
                // Calls the NestJS backend, which then calls Python
                const res = await axios.post("http://localhost:9000/api/prediction/train", {}, { withCredentials: true });
                this.$refs.msg.show(`Training Complete! Accuracy: ${(res.data.accuracy * 100).toFixed(1)}%`, "success");
            } catch (e) {
                console.error(e);
                this.$refs.msg.show("Training Failed. Check backend logs.", "error");
            } finally {
                this.training = false;
            }
        },

        // --- 2. Load Classes ---
        async loadSubjects() {
            if (!this.selectedYear || !this.selectedSemester) {
                this.$refs.msg.show("Please select Academic Year and Semester.", "error");
                return;
            }
            this.loading = true;
            this.activeSubject = null;
            try {
                const url = `http://localhost:9000/api/masterlist/filter/${this.selectedYear}/${this.selectedSemester}`;
                const res = await axios.get(url, { withCredentials: true });

                if (!res.data || res.data.length === 0) {
                    this.subjects = [];
                    this.$refs.msg.show("No classes found.", "info");
                    return;
                }

                // Group students by Subject+Section
                const grouped = {};
                res.data.forEach((row) => {
                    const key = `${row.subjcode}-${row.section}`;
                    if (!grouped[key]) {
                        grouped[key] = {
                            subjcode: row.subjcode,
                            section: row.section,
                            description: row.type || 'Subject Description',
                            instructor: row.employee ? `${row.employee.firstname} ${row.employee.lastname}` : '',
                            students: []
                        };
                    }
                    grouped[key].students.push(row);
                });
                this.subjects = Object.values(grouped);
            } catch (e) {
                this.$refs.msg.show("Error loading data.", "error");
            } finally {
                this.loading = false;
            }
        },

        // --- 3. Select Class & Auto-Fetch Risks ---
        selectSubject(subject) {
            this.activeSubject = subject;
            this.risks = {}; // Reset previous risks

            // ⚡ AUTOMATICALLY TRIGGER ANALYSIS
            this.analyzeClassRisk();
        },

        // --- 4. Core Analysis Logic ---
        async analyzeClassRisk() {
            if (!this.activeSubject) return;
            this.analyzing = true;

            // Use Promise.all to fetch all students in parallel (Much faster than a for-loop)
            const promises = this.activeSubject.students.map(async (student) => {
                // Prefer masterlist_id for specific enrollment, fallback to id
                const id = student.masterlist_id || student.id;
                if (!id) return;

                try {
                    const res = await axios.get(`http://localhost:9000/api/prediction/risk/${id}`, { withCredentials: true });
                    // Store result reactively using $set (required for Vue 2)
                    this.$set(this.risks, student.studid, res.data);
                } catch (e) {
                    console.error(`Failed to analyze student ${id}`, e);
                    // Set default error state so the UI doesn't spin forever
                    this.$set(this.risks, student.studid, { binary_fail_prob: 0, multinomial_status: 'Unknown' });
                }
            });

            await Promise.all(promises);
            this.analyzing = false;
        },

        // --- 5. Helper: Calculate Component Averages ---
        getComponentAvg(student, category) {
            if (!student.rawScores || student.rawScores.length === 0) return '0';

            // Filter scores belonging to this category (e.g. WRITTEN)
            const scores = student.rawScores.filter(s => s.activity && s.activity.category.toUpperCase().includes(category));

            if (scores.length === 0) return '0';

            let totalObtained = 0;
            let totalMax = 0;

            scores.forEach(s => {
                totalObtained += Number(s.score || 0);
                totalMax += Number(s.activity.max_score || 0);
            });

            return totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(0) : '0';
        }
    }
};
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>