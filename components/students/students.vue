<!-- <template>
  <div>

    <SuccessMessage ref="successMessage" />


    <div class="max-w-md mb-6 mx-auto sm:mx-0">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="search"
          class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Search by ID, name, course, or level"
        />
        <button
          type="button"
          class="text-white absolute right-2 bottom-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          @click="clearSearch"
        >
          Clear
        </button>
      </div>
    </div>

    <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
      <h1 class="text-2xl font-bold">
        Students List
        <span class="text-base font-normal text-gray-600">({{ filteredStudents.length }})</span>
      </h1>

      <div class="flex gap-2 items-center flex-wrap">
      
        <select v-model="selectedLevel" class="p-2 border rounded-lg">
          <option value="">All Levels</option>
          <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
        </select>

        
        <select v-model="selectedMajor" class="p-2 border rounded-lg">
          <option value="">All Majors</option>
          <option v-for="major in majors" :key="major" :value="major">{{ major }}</option>
        </select>


        <button
          class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
          @click="showAddModal = true"
        >
          Add Student
        </button>
      </div>
    </div>

    
    <div class="hidden lg:block overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Major</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="student in filteredStudents" :key="student.studid">
            <td class="px-6 py-4 whitespace-nowrap">{{ student.studid }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.firstname }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.lastname }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.studmajor }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.studlevel }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                @click="deleteStudent(student.studid)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <div class="grid gap-4 md:grid-cols-2 lg:hidden">
      <div
        v-for="student in filteredStudents"
        :key="student.studid"
        class="bg-white shadow rounded-lg p-4 flex flex-col"
      >
        <p><span class="font-semibold">Student ID:</span> {{ student.studid }}</p>
        <p><span class="font-semibold">First Name:</span> {{ student.firstname }}</p>
        <p><span class="font-semibold">Last Name:</span> {{ student.lastname }}</p>
        <p><span class="font-semibold">Major:</span> {{ student.studmajor }}</p>
        <p><span class="font-semibold">Level:</span> {{ student.studlevel }}</p>
        <div class="mt-3">
          <button
            class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 w-full"
            @click="deleteStudent(student.studid)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <p v-if="filteredStudents.length === 0" class="mt-4 text-gray-500">
      No students found.
    </p>


    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">Add Student</h2>
        <form @submit.prevent="addStudent" class="space-y-4">
          <input v-model="newStudent.studid" placeholder="Student ID" class="w-full p-2 border rounded" required />
          <input v-model="newStudent.firstname" placeholder="First Name" class="w-full p-2 border rounded" required />
          <input v-model="newStudent.lastname" placeholder="Last Name" class="w-full p-2 border rounded" required />
          <input v-model="newStudent.studmajor" placeholder="Major" class="w-full p-2 border rounded" required />
          <input v-model.number="newStudent.studlevel" type="number" placeholder="Level" class="w-full p-2 border rounded" required />
          <div class="flex justify-end gap-2">
            <button type="button" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" @click="showAddModal=false">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import SuccessMessage from "@/components/success-message.vue";

const students = ref([]);
const searchQuery = ref('');
const selectedLevel = ref('');
const selectedMajor = ref('');

const levels = ref([]);
const majors = ref([]);

const showAddModal = ref(false);
const newStudent = ref({
  studid: '',
  firstname: '',
  lastname: '',
  studmajor: '',
  studlevel: null,
});

const successMessage = ref(null);

const fetchStudents = async () => {
  try {
    const response = await axios.get('http://localhost:9000/api/students/all');
    students.value = Array.isArray(response.data) ? response.data : response.data.data || [];
    levels.value = [...new Set(students.value.map(s => s.studlevel))].sort();
    majors.value = [...new Set(students.value.map(s => s.studmajor))].sort();
  } catch (err) {
    console.error(err);
  }
};

const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const matchesSearch = !searchQuery.value || 
      student.studid.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.firstname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.lastname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.studmajor.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.studlevel.toString().includes(searchQuery.value);

    const matchesLevel = !selectedLevel.value || student.studlevel.toString() === selectedLevel.value.toString();
    const matchesMajor = !selectedMajor.value || student.studmajor === selectedMajor.value;

    return matchesSearch && matchesLevel && matchesMajor;
  });
});

const clearSearch = () => {
  searchQuery.value = '';
  selectedLevel.value = '';
  selectedMajor.value = '';
};


const addStudent = async () => {
  try {
    await axios.post('http://localhost:9000/api/student/add', newStudent.value);
    showAddModal.value = false;
    newStudent.value = { studid: '', firstname: '', lastname: '', studmajor: '', studlevel: null };
    fetchStudents();
    successMessage.value.show('success', 'Student added successfully!');
  } catch (err) {
    console.error(err);
    successMessage.value.show('error', 'Failed to add student.');
  }
};


const deleteStudent = async (studid) => {
  try {
    await axios.delete(`http://localhost:9000/api/student/${studid}`);
    fetchStudents();
    successMessage.value.show('success', 'Student deleted successfully!');
  } catch (err) {
    console.error(err);
    successMessage.value.show('error', 'Failed to delete student.');
  }
};

onMounted(fetchStudents);
</script>

<style>
table {
  border-collapse: collapse;
}
th, td {
  text-align: left;
}
</style> -->
