<template>
    <div class="bg-white border border-gray-300 shadow-lg flex flex-col h-full">

        <div class="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div class="relative w-full max-w-sm">
                <input v-model="searchQuery" @input="resetToFirstPage" type="text"
                    class="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="Search Student Name..." />
            </div>
            <div class="text-xs text-gray-500 font-medium">
                Total Students: <span class="text-green-700 font-bold">{{ filteredStudentList.length }}</span>
            </div>
        </div>

        <div class="overflow-x-auto flex-1">
            <table class="w-full text-xs md:text-sm border-collapse text-center whitespace-nowrap">

                <thead class="bg-gray-100 text-gray-800 font-bold">
                    <tr>
                        <th rowspan="2" class="border border-gray-400 p-2 w-10 sticky left-0 bg-gray-100 z-20">No.</th>
                        <th rowspan="2"
                            class="border border-gray-400 p-2 min-w-[200px] sticky left-10 bg-gray-100 z-20 text-left">
                            STUDENT NAME
                        </th>

                        <th colspan="3" class="border border-gray-400 p-1 bg-green-50">
                            WRITTEN WORK ({{ (gradeWeights.written * 100).toFixed(0) }}%)
                        </th>
                        <th colspan="3" class="border border-gray-400 p-1 bg-purple-50">
                            PERFORMANCE ({{ (gradeWeights.performance * 100).toFixed(0) }}%)
                        </th>
                        <th colspan="3" class="border border-gray-400 p-1 bg-blue-50">
                            MIDTERM ({{ (gradeWeights.midterm * 100).toFixed(0) }}%)
                        </th>
                        <th colspan="3" class="border border-gray-400 p-1 bg-yellow-50">
                            FINAL ({{ (gradeWeights.final * 100).toFixed(0) }}%)
                        </th>

                        <th rowspan="2" class="border border-gray-400 p-2 w-24">Total Weighted</th>
                        <th rowspan="2" class="border border-gray-400 p-2 w-24">Final Grade</th>
                        <th rowspan="2" class="border border-gray-400 p-2 w-24">Remarks</th>
                    </tr>

                    <tr>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-green-50">Total</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-green-50">PS (100%)</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-green-50">WS</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-purple-50">Total</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-purple-50">PS (100%)</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-purple-50">WS</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-blue-50">Score</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-blue-50">PS (100%)</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-blue-50">WS</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-yellow-50">Score</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-yellow-50">PS (100%)</th>
                        <th class="border border-gray-400 text-[10px] px-2 py-1 bg-yellow-50">WS</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(student, index) in studentsOnCurrentPage" :key="student.studid || index"
                        class="hover:bg-gray-50">

                        <td
                            class="border border-gray-300 px-2 py-2 sticky left-0 bg-gray-50 font-mono text-xs text-gray-500 z-10">
                            {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                        </td>

                        <td class="border border-gray-300 px-3 py-2 text-left font-medium sticky left-10 bg-white z-10">
                            {{ student.studlastname }}, {{ student.studfirstname }}
                        </td>

                        <td class="border border-gray-300 bg-green-50">
                            {{ calculateCategoryStats(student, 'WRITTEN', gradeWeights.written).totalScore }}
                        </td>
                        <td class="border border-gray-300 bg-green-50 font-bold">
                            {{ calculateCategoryStats(student, 'WRITTEN', gradeWeights.written).percentageScore }}
                        </td>
                        <td class="border border-gray-300 bg-green-50 font-bold">
                            {{ calculateCategoryStats(student, 'WRITTEN', gradeWeights.written).weightedScore }}
                        </td>

                        <td class="border border-gray-300 bg-purple-50">
                            {{ calculateCategoryStats(student, 'PERFORMANCE', gradeWeights.performance).totalScore }}
                        </td>
                        <td class="border border-gray-300 bg-purple-50 font-bold">
                            {{ calculateCategoryStats(student, 'PERFORMANCE', gradeWeights.performance).percentageScore }}
                        </td>
                        <td class="border border-gray-300 bg-purple-50 font-bold">
                            {{ calculateCategoryStats(student, 'PERFORMANCE', gradeWeights.performance).weightedScore
                            }}
                        </td>

                        <td class="border border-gray-300 bg-blue-50">
                            {{ calculateCategoryStats(student, 'MIDTERM', gradeWeights.midterm).totalScore }}
                        </td>
                        <td class="border border-gray-300 bg-blue-50 font-bold">
                            {{ calculateCategoryStats(student, 'MIDTERM', gradeWeights.midterm).percentageScore }}
                        </td>
                        <td class="border border-gray-300 bg-blue-50 font-bold">
                            {{ calculateCategoryStats(student, 'MIDTERM', gradeWeights.midterm).weightedScore }}
                        </td>

                        <td class="border border-gray-300 bg-yellow-50">
                            {{ calculateCategoryStats(student, 'FINAL', gradeWeights.final).totalScore }}
                        </td>
                        <td class="border border-gray-300 bg-yellow-50 font-bold">
                            {{ calculateCategoryStats(student, 'FINAL', gradeWeights.final).percentageScore }}
                        </td>
                        <td class="border border-gray-300 bg-yellow-50 font-bold">
                            {{ calculateCategoryStats(student, 'FINAL', gradeWeights.final).weightedScore }}
                        </td>

                        <td class="border border-gray-300 font-bold">
                            {{ student.finalGrade && student.finalGrade.final_weighted_score ?
                                student.finalGrade.final_weighted_score : '0.00' }}
                        </td>

                        <td class="border border-gray-300 font-bold text-lg"
                            :class="isFailed(student.finalGrade?.final_numerical_grade) ? 'text-red-600' : 'text-green-700'">
                            {{ student.finalGrade && student.finalGrade.final_numerical_grade ?
                                student.finalGrade.final_numerical_grade : ' ' }}
                        </td>

                        <td class="border border-gray-300 uppercase text-[10px]"
                            :class="student.finalGrade?.remarks === 'Passed' ? 'text-green-600' : 'text-red-600'">
                            {{ student.finalGrade && student.finalGrade.remarks ? student.finalGrade.remarks : 'N/A' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="bg-gray-50 border-t p-3 flex items-center justify-between">
            <span class="text-xs text-gray-500">Page {{ currentPage }} of {{ totalPages }}</span>
            <div class="flex gap-2">
                <button @click="previousPage" :disabled="currentPage === 1"
                    class="px-3 py-1 text-xs border rounded bg-white hover:bg-gray-100 disabled:opacity-50">Prev</button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-3 py-1 text-xs border rounded bg-white hover:bg-gray-100 disabled:opacity-50">Next</button>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';

export default {
    // This component expects a 'subject' object to be passed down from a parent
    props: ['subject'],

    data() {
        return {
            searchQuery: '',     // Stores the text typed in the search bar
            currentPage: 1,      // Which page of the table we are viewing
            itemsPerPage: 20,    // How many students to show per page

            // Store the percentage weights for each category (e.g. 0.30 for 30%)
            gradeWeights: {
                written: 0,
                performance: 0,
                midterm: 0,
                final: 0
            },

            totalWrittenScores: 0,
            totalPerformanceScore: 0,
            totalMidtermScore: 0,
            totalFinalScore: 0,
        };
    },

    // Runs automatically when the component is loaded
    async mounted() {
        await this.fetchGradeWeights();
    },

    computed: {
        // 1. Filter the list of students based on the Search Bar
        filteredStudentList() {
            // Safety check: if there is no data, return empty list
            if (!this.subject || !this.subject.students) {
                return [];
            }

            // Convert search text to lowercase so "John" matches "john"
            const text = this.searchQuery.toLowerCase().trim();

            // If search bar is empty, return everyone
            if (!text) {
                return this.subject.students;
            }

            // Filter logic: Check if First Name OR Last Name matches the text
            return this.subject.students.filter(student => {
                const firstNameMatch = student.studfirstname && student.studfirstname.toLowerCase().includes(text);
                const lastNameMatch = student.studlastname && student.studlastname.toLowerCase().includes(text);
                return firstNameMatch || lastNameMatch;
            });
        },

        // 2. Calculate total number of pages needed
        totalPages() {
            // Example: 50 students / 20 per page = 2.5 -> ceil -> 3 pages
            return Math.ceil(this.filteredStudentList.length / this.itemsPerPage);
        },

        // 3. Slice the list to show only students for the CURRENT page
        studentsOnCurrentPage() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            // .slice extracts a portion of the array
            return this.filteredStudentList.slice(startIndex, endIndex);
        },
    },

    methods: {
        // Function to download the grade weights (percentages) from the server
        async fetchGradeWeights() {
            try {
                const response = await axios.get('http://localhost:9000/api/grade-weight');

                // We only want weights for 'LECTURE' type classes
                const lectureWeights = response.data.filter(item => item.grading_type === 'LECTURE');

                // Loop through results and assign to our data variables
                lectureWeights.forEach(item => {
                    // Convert string "0.30" to number 0.30
                    const percentage = Number(item.weight_percentage);

                    if (item.category.includes('WRITTEN')) {
                        this.gradeWeights.written = percentage;
                    } else if (item.category.includes('PERFORMANCE')) {
                        this.gradeWeights.performance = percentage;
                    } else if (item.category.includes('MIDTERM')) {
                        this.gradeWeights.midterm = percentage;
                    } else if (item.category.includes('FINAL')) {
                        this.gradeWeights.final = percentage;
                    }
                });
            } catch (error) {
                console.error("Failed to load weights:", error);
            }
        },

        // Main Math Function: Calculates Total Score and Weighted Score for a category
        calculateCategoryStats(student, categoryName, categoryWeight) {
            // Safety Check: If data is missing, return 0
            if (!student.rawScores || !categoryWeight) {
                return { totalScore: 0, weightedScore: '0.00' };
            }

            // 1. Find all scores belonging to this category (e.g. all WRITTEN scores)
            const relevantScores = student.rawScores.filter(scoreItem => {
                // Check if the activity category matches what we want
                return scoreItem.activity && scoreItem.activity.category.toUpperCase().includes(categoryName);
            });

            let myTotalScore = 0;
            let maxPossibleScore = 0;

            // 2. Add them up
            relevantScores.forEach(scoreItem => {
                myTotalScore += Number(scoreItem.score || 0);
                maxPossibleScore += Number(scoreItem.activity.max_score || 0);
            });

            // 3. Calculate Weighted Score (WS)
            // Formula: (My Score / Max Score) * Weight * 100
            let weightedScore = 0;
            if (maxPossibleScore > 0) {
                weightedScore = (myTotalScore / maxPossibleScore) * categoryWeight * 100;
            }

            // 3. Calculate Percentage Score (PS)
            // Formula: (My Score / Max Score) * Weight
            let percentageScore = 0;
            if (maxPossibleScore > 0) {
                percentageScore = (myTotalScore / maxPossibleScore) * categoryWeight
            }

            return {
                totalScore: myTotalScore,
                weightedScore: weightedScore.toFixed(2), // Format to 2 decimal places
                percentageScore: percentageScore.toFixed(2) // Format to 2 decimal places
            };
        },

        // Helper: Reset to page 1 when searching
        resetToFirstPage() {
            this.currentPage = 1;
        },

        // Helper: Check if a grade is failing (greater than 3.0 in reference from grading sample)
        isFailed(grade) {
            // If grade is missing or undefined, don't mark as fail
            if (!grade) return false;
            return grade > 3.0;
        },

        // Pagination Button Actions
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        }
    }
}
</script>