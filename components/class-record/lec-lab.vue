<template>
    <div class="bg-white border border-gray-300 shadow-lg flex flex-col h-full">
        <div class="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div class="relative w-full max-w-sm">
                <input v-model="searchQuery" @input="currentPage = 1" type="text"
                    class="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="Search Student Name..." />
            </div>
            <div class="text-xs text-gray-500 font-medium">
                Total Students: <span class="text-green-700 font-bold">{{ filteredStudents.length }}</span>
            </div>
        </div>

        <div class="overflow-x-auto flex-1">
            <table class="w-full text-xs md:text-sm border-collapse text-center whitespace-nowrap">
                <thead class="bg-gray-100 text-gray-800 font-bold">
                    <tr>
                        <th rowspan="3" class="border border-gray-400 p-2 w-10 sticky left-0 bg-gray-100 z-20">No.</th>
                        <th rowspan="3"
                            class="border border-gray-400 p-2 min-w-[200px] sticky left-10 bg-gray-100 z-20 text-left">
                            STUDENT NAME</th>
                        <th colspan="6" class="border border-gray-400 p-1 bg-white">ACTIVITIES</th>
                        <th colspan="3" class="border border-gray-400 p-1 bg-blue-50">MIDTERM EXAM</th>
                        <th colspan="3" class="border border-gray-400 p-1 bg-yellow-50">FINAL EXAM</th>
                        <th rowspan="3" class="border border-gray-400 p-2 w-24">Total Weighted</th>
                        <th rowspan="3" class="border border-gray-400 p-2 w-24">Final Grade</th>
                        <th rowspan="3" class="border border-gray-400 p-2 w-24">Remarks</th>
                    </tr>
                    <tr>
                        <th colspan="3" class="border border-gray-400 p-1">LECTURE ({{ (weights.lec * 100).toFixed(0)
                            }}%)</th>
                        <th colspan="3" class="border border-gray-400 p-1">LABORATORY ({{ (weights.lab * 100).toFixed(0)
                            }}%)</th>
                        <th colspan="3" class="border border-gray-400 bg-blue-50"></th>
                        <th colspan="3" class="border border-gray-400 bg-yellow-50"></th>
                    </tr>
                    <tr>
                        <th class="border border-gray-400 px-2 py-1 text-[10px]">Total</th>
                        <th class="border border-gray-400 px-2 py-1 text-[10px]">PS</th>
                        <th class="border border-gray-400 px-2 py-1 text-[10px]">WS</th>

                        <th class="border border-gray-400 px-2 py-1 text-[10px]">Total</th>
                        <th class="border border-gray-400 px-2 py-1 text-[10px]">PS</th>
                        <th class="border border-gray-400 px-2 py-1 text-[10px]">WS</th>

                        <th class="border border-gray-400 px-2 py-1 text-[10px] bg-blue-50">Score</th>
                        <th class="border border-gray-400 px-2 py-1 text-[10px] bg-blue-50">PS</th>
                        <th class="border border-gray-400 px-2 py-1 text-[10px] bg-blue-50">WS</th>

                        <th class="border border-gray-400 px-2 py-1 text-[10px] bg-yellow-50">Score</th>
                        <th class="border border-gray-400 px-2 py-1 text-[10px] bg-yellow-50">PS</th>
                        <th class="border border-gray-400 px-2 py-1 text-[10px] bg-yellow-50">WS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(student, i) in paginatedStudents" :key="student.studid || i" class="hover:bg-gray-50">
                        <td
                            class="border border-gray-300 px-2 py-2 sticky left-0 bg-gray-50 font-mono text-xs text-gray-500 z-10">
                            {{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>
                        <td class="border border-gray-300 px-3 py-2 text-left font-medium sticky left-10 bg-white z-10">
                            {{ student.studlastname }}, {{ student.studfirstname }}</td>

                        <td class="border border-gray-300">{{ getStats(student, 'LECTURE_COMP', weights.lec).total }}
                        </td>
                        <td class="border border-gray-300">{{ getStats(student, 'LECTURE_COMP', weights.lec).percentage
                            }}%</td>
                        <td class="border border-gray-300 font-bold">{{ getStats(student, 'LECTURE_COMP',
                            weights.lec).ws }}</td>

                        <td class="border border-gray-300">{{ getStats(student, 'LAB_COMP', weights.lab).total }}</td>
                        <td class="border border-gray-300">{{ getStats(student, 'LAB_COMP', weights.lab).percentage }}%
                        </td>
                        <td class="border border-gray-300 font-bold">{{ getStats(student, 'LAB_COMP', weights.lab).ws }}
                        </td>

                        <td class="border border-gray-300 bg-blue-50">{{ getStats(student, 'MIDTERM',
                            weights.midterm).total }}</td>
                        <td class="border border-gray-300 bg-blue-50">{{ getStats(student, 'MIDTERM',
                            weights.midterm).percentage }}%</td>
                        <td class="border border-gray-300 bg-blue-50 font-bold">{{ getStats(student, 'MIDTERM',
                            weights.midterm).ws }}</td>

                        <td class="border border-gray-300 bg-yellow-50">{{ getStats(student, 'FINAL',
                            weights.final).total }}</td>
                        <td class="border border-gray-300 bg-yellow-50">{{ getStats(student, 'FINAL',
                            weights.final).percentage }}%</td>
                        <td class="border border-gray-300 bg-yellow-50 font-bold">{{ getStats(student, 'FINAL',
                            weights.final).ws }}</td>

                        <td class="border border-gray-300 font-bold">{{ student.finalGrade?.final_weighted_score ||
                            '0.00' }}</td>
                        <td class="border border-gray-300 font-bold text-lg"
                            :class="student.finalGrade?.final_numerical_grade > 3.0 ? 'text-red-600' : 'text-green-700'">
                            {{ student.finalGrade?.final_numerical_grade || 'No Grade' }}</td>
                        <td class="border border-gray-300 uppercase text-[10px]"
                            :class="student.finalGrade?.remarks === 'Passed' ? 'text-green-600' : 'text-red-600'">{{
                                student.finalGrade?.remarks || 'N/A' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="bg-gray-50 border-t p-3 flex items-center justify-between">
            <span class="text-xs text-gray-500">Page {{ currentPage }} of {{ totalPages }}</span>
            <div class="flex gap-2">
                <button @click="currentPage--" :disabled="currentPage === 1"
                    class="px-3 py-1 text-xs border rounded bg-white hover:bg-gray-100 disabled:opacity-50">Prev</button>
                <button @click="currentPage++" :disabled="currentPage === totalPages"
                    class="px-3 py-1 text-xs border rounded bg-white hover:bg-gray-100 disabled:opacity-50">Next</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['subject'],
    data() {
        return {
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 20,
            weights: { lec: 0, lab: 0, midterm: 0, final: 0 }
        }
    },
    async mounted() { await this.fetchWeights(); },
    computed: {
        filteredStudents() {
            if (!this.subject?.students) return [];
            const q = this.searchQuery.toLowerCase().trim();
            if (!q) return this.subject.students;
            return this.subject.students.filter(s =>
                (s.studlastname && s.studlastname.toLowerCase().includes(q)) ||
                (s.studfirstname && s.studfirstname.toLowerCase().includes(q))
            );
        },
        totalPages() { return Math.ceil(this.filteredStudents.length / this.itemsPerPage); },
        paginatedStudents() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredStudents.slice(start, start + this.itemsPerPage);
        }
    },
    methods: {
        async fetchWeights() {
            try {
                const res = await axios.get('http://localhost:9000/api/grade-weight');
                const w = res.data.filter(x => x.grading_type === 'LEC_LAB');
                w.forEach(i => {
                    if (i.category.includes('LECTURE')) this.weights.lec = Number(i.weight_percentage);
                    else if (i.category.includes('LAB')) this.weights.lab = Number(i.weight_percentage);
                    else if (i.category.includes('MIDTERM')) this.weights.midterm = Number(i.weight_percentage);
                    else if (i.category.includes('FINAL')) this.weights.final = Number(i.weight_percentage);
                });
            } catch (e) { console.error(e); }
        },
        getStats(student, category, weight) {
            if (!student.rawScores || !weight) return { total: 0, percentage: 0, ws: '0.00' };
            const scores = student.rawScores.filter(s => s.activity && s.activity.category.toUpperCase().includes(category));
            let totalScore = 0, totalMax = 0;
            scores.forEach(s => {
                totalScore += Number(s.score || 0);
                totalMax += Number(s.activity.max_score || 0);
            });
            const pct = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
            const ws = totalMax > 0 ? (totalScore / totalMax) * weight * 100 : 0;
            return { total: totalScore, percentage: pct.toFixed(0), ws: ws.toFixed(2) };
        }
    }
}
</script>