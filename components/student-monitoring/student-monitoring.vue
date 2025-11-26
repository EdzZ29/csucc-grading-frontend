<template>
    <div class="font-inria">
        <!-- Title -->
        <h1 class="text-2xl font-bold mb-6">Student Monitoring</h1>

        <!-- Filters -->
        <div class="flex flex-wrap gap-4 mb-6">
            <!-- Academic Year -->
            <div>
                <label class="block mb-1 font-medium">Academic Year</label>
                <select v-model="selectedYear" class="border rounded px-3 py-2">
                    <option value="" disabled>Select Year</option>
                    <option v-for="year in academicYears" :key="year" :value="year">
                        {{ year }}
                    </option>
                </select>
            </div>

            <!-- Semester -->
            <div>
                <label class="block mb-1 font-medium">Semester</label>
                <select v-model="selectedSemester" class="border rounded px-3 py-2">
                    <option value="" disabled>Select Semester</option>
                    <option v-for="sem in semesters" :key="sem" :value="sem">
                        {{ sem }}
                    </option>
                </select>
            </div>

            <!-- Subject -->
            <div>
                <label class="block mb-1 font-medium">Subject</label>
                <select v-model="selectedSubject" class="border rounded px-3 py-2">
                    <option value="" disabled>Select Subject</option>
                    <option v-for="subject in subjects" :key="subject.code" :value="subject">
                        {{ subject.code }} {{ subject.name }}
                    </option>
                </select>
            </div>

            <!-- Display Button -->
            <div class="flex items-end">
                <button @click="displayData" class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
                    Display
                </button>
            </div>
        </div>

        <!-- Info Section -->
        <div v-if="showTable" class="mb-6">
            <p><strong>Instructor:</strong> Ryan Q. Cuaraz</p>
            <p><strong>Academic Year:</strong> {{ displayedYear }}</p>
            <p><strong>Description:</strong> {{ displayedSubject?.name }}</p>
            <p><strong>Subject Code:</strong> {{ displayedSubject?.code }}</p>
            <p><strong>Semester:</strong> {{ displayedSemester }}</p>
        </div>

        <!-- Students Total -->
        <div v-if="showTable" class="mb-6">
            <p class="text-lg font-semibold">Total: 50 Students</p>
        </div>

        <!-- Student Categories -->
        <div v-if="showTable" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Pass -->
            <div class="bg-green-100 border border-green-400 rounded-lg p-4 flex flex-col">
                <h3 class="text-green-700 font-bold mb-3">
                    ({{ passStudents.length }}) Students Most Likely to PASS
                </h3>

                <table class="w-full text-sm text-left border flex-grow">
                    <tbody>
                        <tr v-for="(student, index) in paginatedStudents(passStudents)" :key="index">
                            <td class="border px-2 py-1">{{ student.name }}</td>
                            <td class="border px-2 py-1">{{ student.id }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination pinned at bottom -->
                <div class="flex gap-2 mt-auto pt-2">
                    <button v-for="n in totalPages(passStudents)" :key="n" @click="currentPage.pass = n" :class="[
                        'px-2 py-1 border rounded',
                        currentPage.pass === n ? 'bg-green-700 text-white' : 'bg-white'
                    ]">
                        {{ n }}
                    </button>
                </div>
            </div>


            <!-- Incomplete -->
            <div class="bg-yellow-100 border border-yellow-400 rounded-lg p-4">
                <h3 class="text-yellow-700 font-bold mb-3">
                    ({{ incompleteStudents.length }}) Most Likely to INCOMPLETE
                </h3>
                <table class="w-full text-sm text-left border">
                    <tbody>
                        <tr v-for="(student, index) in paginatedStudents(
                            incompleteStudents,
                            'incomplete'
                        )" :key="index">
                            <td class="border px-2 py-1">{{ student.name }}</td>
                            <td class="border px-2 py-1">{{ student.id }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" class="text-center py-2">
                                <div class="flex justify-center gap-2">
                                    <button v-for="n in totalPages(incompleteStudents)" :key="n"
                                        @click="currentPage.incomplete = n" :class="[
                                            'px-2 py-1 border rounded',
                                            currentPage.incomplete === n
                                                ? 'bg-yellow-600 text-white'
                                                : 'bg-white'
                                        ]">
                                        {{ n }}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Drop -->
            <div class="bg-red-100 border border-red-400 rounded-lg p-4">
                <h3 class="text-red-700 font-bold mb-3">
                    ({{ dropStudents.length }}) Most Likely to DROP
                </h3>
                <table class="w-full text-sm text-left border">
                    <tbody>
                        <tr v-for="(student, index) in paginatedStudents(dropStudents, 'drop')" :key="index">
                            <td class="border px-2 py-1">{{ student.name }}</td>
                            <td class="border px-2 py-1">{{ student.id }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" class="text-center py-2">
                                <div class="flex justify-center gap-2">
                                    <button v-for="n in totalPages(dropStudents)" :key="n" @click="currentPage.drop = n"
                                        :class="[
                                            'px-2 py-1 border rounded',
                                            currentPage.drop === n
                                                ? 'bg-red-600 text-white'
                                                : 'bg-white'
                                        ]">
                                        {{ n }}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "StudentMonitoring",
    data() {
        return {
            academicYears: ["2022-2023", "2023-2024", "2024-2025"],
            semesters: ["1st", "2nd"],
            subjects: [
                { code: "ITE 101", name: "Database LMNOP" },
                { code: "ITE 102", name: "Programming ABC" },
            ],

            // Selections
            selectedYear: "",
            selectedSemester: "",
            selectedSubject: null,

            // Displayed values
            displayedYear: "",
            displayedSemester: "",
            displayedSubject: null,
            showTable: false,

            // Pagination state
            currentPage: { pass: 1, incomplete: 1, drop: 1 },
            pageSize: 5,

            // Dummy students
            passStudents: [
                { name: "Ederio, Edmundo Jr C", id: "2022-1373" },
                { name: "Juan Dela Cruz", id: "2022-1374" },
                { name: "Maria Santos", id: "2022-1375" },
                { name: "Pedro Cruz", id: "2022-1376" },
                { name: "Jose Ramirez", id: "2022-1377" },
                { name: "Ana Dela Peña", id: "2022-1378" },
                { name: "Miguel Garcia", id: "2022-1379" },
                { name: "Liza Villanueva", id: "2022-1380" },
                { name: "Liza Villanueva", id: "2022-1380" },
                { name: "Liza Villanueva", id: "2022-1380" },
                { name: "Liza Villanueva", id: "2022-1380" },
                { name: "Liza Villanueva", id: "2022-1380" },
                { name: "Liza Villanueva", id: "2022-1380" },
            ],
            incompleteStudents: [
                { name: "Andrea Torres", id: "2022-1385" },
                { name: "Jayson Lee", id: "2022-1386" },
                { name: "Paolo Santos", id: "2022-1387" },
                { name: "Sofia Hernandez", id: "2022-1388" },
                { name: "Allan Reyes", id: "2022-1389" },
                { name: "Grace Bautista", id: "2022-1390" },
            ],
            dropStudents: [
                { name: "Jose Rizal", id: "2022-1395" },
                { name: "Emilio Aguinaldo", id: "2022-1396" },
                { name: "Andres Bonifacio", id: "2022-1397" },
                { name: "Apolinario Mabini", id: "2022-1398" },
                { name: "Melchora Aquino", id: "2022-1399" },
                { name: "Marcelo H. del Pilar", id: "2022-1400" },
            ],
        };
    },
    methods: {
        displayData() {
            if (!this.selectedYear || !this.selectedSemester || !this.selectedSubject) {
                alert(
                    "Please select Academic Year, Semester, and Subject before displaying data."
                );
                return;
            }
            this.displayedYear = this.selectedYear;
            this.displayedSemester = this.selectedSemester;
            this.displayedSubject = this.selectedSubject;
            this.showTable = true;

            // Reset to first page on new display
            this.currentPage = { pass: 1, incomplete: 1, drop: 1 };
        },
        paginatedStudents(list, type = "pass") {
            const start = (this.currentPage[type] - 1) * this.pageSize;
            return list.slice(start, start + this.pageSize);
        },
        totalPages(list) {
            return Math.ceil(list.length / this.pageSize);
        },
    },
};
</script>
