<template>
  <div class="flex-1 sm:ml-64 p-4 mt-6">

    <Notification
      v-if="successMessage || error"
      :type="successMessage ? 'success' : 'error'"
      :message="successMessage || error"
      @close="() => { successMessage = ''; error = ''; }"
    />

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
          placeholder="Search name of the users"
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

    <div>
      <p class="text-base font-inria text-m mt-5"> <span class="font-bold">Note:</span> Use this page to add, edit, or delete user accounts. Ensure all required fields are filled out correctly.</p>
    </div>

    <!-- Header -->
    <div class="flex justify-between items-center mb-4 mt-14">
      <h1 class="text-2xl font-bold font-epundaslab">Users Management</h1>
      <div class="flex gap-3">
        <!-- Filter by Role -->
        <select 
          v-model="selectedRole" 
          class="px-3 cursor-pointer py-2 border-black border font-inria text-gray-700">
          <option value="">All Roles</option>
          <option value="Instructor">Instructor</option>
          <option value="Dean">Dean</option>
          <option value="Chancellor">Chancellor</option>
          <option value="Guidance">Guidance</option>
        </select>

        <!-- Add User Button -->
        <button
          @click="openCreateModal"
          class="px-4 py-2 font-inria bg-green-700 text-white hover:bg-green-800"
        >
          Add User
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="overflow-x-auto">
      <table class="w-full font-inria text-sm text-left text-gray-500">
        <thead class="text-xs text-white uppercase bg-green-700">
          <tr>
            <th class="px-6 py-3">#</th>
            <th class="px-6 py-3">First Name</th>
            <th class="px-6 py-3">Last Name</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Role</th>
            <th class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(user, index) in filteredUsers" 
            :key="user.id" 
            class="bg-white text-gray-900 border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="px-6 py-4">{{ index + 1 }}</td>
            <td class="px-6 py-4">{{ user.first_name }}</td>
            <td class="px-6 py-4">{{ user.last_name }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">{{ user.role }}</td>
            <td class="px-6 py-4 flex gap-4">
              <button
                @click="openEditModal(user)"
                class="bg-green-700 text-white px-4 py-2 hover:bg-green-900"
              >
                Edit
              </button>
              <button
                @click="openDeleteModal(user)"
                class="bg-red-600 text-white px-4 py-2  hover:bg-red-800"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0" class="bg-white text-gray-900 border-b border-gray-200">
            <td colspan="6" class="px-6 py-4 text-center">No users found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="font-inria bg-white p-6 w-full max-w-md shadow relative z-60">
        <h2 class="text-lg font-bold mb-4 font-epundaslab">Add User</h2>

        <label for="" class="text-gray-600">Firts Name</label>
        <input v-model="newUser.first_name" class="w-full mt-1 mb-2 p-2 border border-gray-500"/>
        <p v-if="fieldErrors.first_name" class="text-red-600 text-sm mb-2">{{ fieldErrors.first_name[0] }}</p>

        <label for="" class="text-gray-600">Last Name</label>
        <input v-model="newUser.last_name" class="w-full mt-1 mb-2 p-2 border border-gray-500"/>
        <p v-if="fieldErrors.last_name" class="text-red-600 text-sm mb-2">{{ fieldErrors.last_name[0] }}</p>

        <label for="" class="text-gray-600">Email</label>
        <input v-model="newUser.email" type="email" class="w-full mt-1 mb-2 p-2 border border-gray-500"/>
        <p v-if="fieldErrors.email" class="text-red-600 text-sm mb-2">{{ fieldErrors.email[0] }}</p>

        <label for="" class="text-gray-600">Role</label>
        <select v-model="newUser.role" class="w-full mb-2 mt-1 p-2 border border-gray-500">
          <option value="Instructor">Instructor</option>
          <option value="Dean">Dean</option>
          <option value="Chancellor">Chancellor</option>
          <option value="Guidance">Guidance</option>
        </select>

        <label for="" class="text-gray-600">Password</label>
        <input v-model="newUser.password" type="password" class="mb-2 mt-1 w-full p-2 border border-gray-500"/>
        <p v-if="fieldErrors.password" class="text-red-600 text-sm mb-2">{{ fieldErrors.password[0] }}</p>

        <label for=""  class="text-gray-600">Password Confirm</label>
        <input type="password" v-model="newUser.password_confirm" class="w-full mt-1 mb-2 p-2 border border-gray-500"/>
        <p v-if="fieldErrors.password_confirm" class="text-red-600 text-sm mb-2">{{ fieldErrors.password_confirm[0] }}</p>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="showCreateModal=false" class="px-4 py-2 border border-gray-400 hover:bg-gray-400 transition">Cancel</button>
          <button @click="createUser" class="px-4 py-2 bg-green-700 hover:bg-green-800 transitions text-white">Add</button>
        </div>
      </div>
      <!-- ✅ Success / Error messages -->
      
    </div>

    
    <!-- <p v-if="successMessage" class="text-green-600 font-semibold mb-4">
        {{ successMessage }}
      </p>
      <p v-if="error" class="text-red-600 font-semibold mb-4">
        {{ error }}
    </p> -->


    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="font-inria bg-white p-6 w-full max-w-md rounded shadow relative z-60">
        <h2 class="text-xl font-bold mb-4 ">Edit User</h2>
        <label for="" class=" text-gray-600">Firts Name</label>
        <input v-model="selectedUser.first_name" placeholder="First Name" class="w-full mb-2 p-2 border border-gray-500"/>
        <label for="" class=" text-gray-600">Last Name</label>
        <input v-model="selectedUser.last_name" placeholder="Last Name" class="w-full mb-2 p-2 border border-gray-500"/>
        <label for="" class=" text-gray-600">Email</label>
        <input v-model="selectedUser.email" placeholder="Email" type="email" class="w-full mb-2 p-2 border border-gray-500"/>
        <label for="" class=" text-gray-600">Role</label>
        <select v-model="selectedUser.role" class="w-full mb-2 p-2 border border-gray-500">
          <option value="Instructor">Instructor</option>
          <option value="Dean">Dean</option>
          <option value="Chancellor">Chancellor</option>
          <option value="Guidance">Guidance</option>
        </select>
        <label for="" class=" text-gray-600">New Password (optional)</label>
        <input v-model="selectedUser.password" type="password" class="w-full mb-2 p-2 border border-gray-500"/>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showEditModal=false" class="px-4 py-2 border border-gray-400 hover:bg-gray-400 transition">Cancel</button>
          <button @click="updateUser" class="px-4 py-2 bg-green-700 hover:bg-green-800 transition text-white">Update</button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center font-inria justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 w-full max-w-md rounded shadow relative z-60">
        <h2 class="text-lg font-bold mb-4">Delete User</h2>
        <p>Are you sure you want to delete <strong>{{ selectedUserToDelete?.first_name }} {{ selectedUserToDelete?.last_name }}</strong>?</p>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showDeleteModal=false" class="px-4 py-2 border hover:bg-gray-300 transition">Cancel</button>
          <button @click="deleteUser" class="px-4 py-2 hover:bg-red-700 transition bg-red-600 text-white">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Notification from "../components/notification/notifiacation-message.vue";

export default {
  components: {
    Notification,   // ✅ Register component here
  },


  data() {
    return {
      users: [],
      showEditModal: false,
      selectedUser: null,
      showCreateModal: false,
      newUser: {
        first_name: '',
        last_name: '',
        email: '',
        role: 'Instructor',
        password: '',
        password_confirm: '',
      },
      error: null,
      successMessage: '',   // ✅ new
      fieldErrors: {}, // ✅ where backend validation errors go
      selectedRole: '',
      showDeleteModal: false,
      selectedUserToDelete: null,
      searchQuery: '',
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const matchesRole = !this.selectedRole || user.role === this.selectedRole;
        const matchesSearch =
          !this.searchQuery ||
          user.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
      });
    }
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await this.$axios.get('/users', { withCredentials: true });
        this.users = res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to fetch users";
      }
    },

    openEditModal(user) {
      this.selectedUser = { ...user, password: '' };
      this.showEditModal = true;
    },

    openCreateModal() {
      this.newUser = {
        first_name: '',
        last_name: '',
        email: '',
        role: 'Instructor',
        password: '',
        password_confirm: '',
      };
      this.fieldErrors = {}; // reset validation
      this.showCreateModal = true;
    },

    openDeleteModal(user) {
      this.selectedUserToDelete = user;
      this.showDeleteModal = true;
    },

    // ✅ Cleaned Create User
    async createUser() {
      try {
        this.error = null;
        this.successMessage = '';   // reset
        this.fieldErrors = {};

        if (this.newUser.password !== this.newUser.password_confirm) {
          this.fieldErrors.password_confirm = ["Passwords do not match!"];
          return;
        }

        await this.$axios.post('/users/store', this.newUser, { withCredentials: true });
        this.showCreateModal = false;
        await this.fetchUsers();

        // ✅ show success message
        this.successMessage = "User successfully added!";
        setTimeout(() => {
          this.successMessage = '';
        }, 3000); // auto-hide after 3s

      } catch (err) {
        console.error("Backend error:", err.response?.data);
        this.fieldErrors = {};

        if (Array.isArray(err.response?.data?.message)) {
          err.response.data.message.forEach(msg => {
            if (msg.includes('first_name')) this.fieldErrors.first_name = [msg];
            if (msg.includes('last_name')) this.fieldErrors.last_name = [msg];
            if (msg.includes('email')) this.fieldErrors.email = [msg];
            if (msg.includes('role')) this.fieldErrors.role = [msg];
            if (msg.includes('password_confirm')) this.fieldErrors.password_confirm = [msg];
            if (msg.includes('password') && !msg.includes('confirm')) {
              this.fieldErrors.password = [msg];
            }
          });

        } else if (err.response?.data?.errors) {
          this.fieldErrors = err.response.data.errors;
        } else if (err.response?.data?.message && err.response.data.message.toLowerCase().includes("email")) {
          this.fieldErrors.email = [err.response.data.message];
        } else {
          this.error = err.response?.data?.message || "Failed to create user";
        }
      }
    },

    // ✅ Cleaned Update User
    async updateUser() {
      try {
        this.error = null;
        this.fieldErrors = {};

        const payload = { ...this.selectedUser };
        if (!payload.password) delete payload.password;

        await this.$axios.put(`/users/update-info/${payload.id}`, payload, { withCredentials: true });
        this.showEditModal = false;
        await this.fetchUsers();
      } catch (err) {
        console.error("Backend error:", err.response?.data);

        if (Array.isArray(err.response?.data?.message)) {
          this.fieldErrors = {};
          err.response.data.message.forEach(msg => {
            if (msg.includes('first_name')) this.fieldErrors.first_name = [msg];
            if (msg.includes('last_name')) this.fieldErrors.last_name = [msg];
            if (msg.includes('email')) this.fieldErrors.email = [msg];
            if (msg.includes('role')) this.fieldErrors.role = [msg];
            if (msg.includes('password')) this.fieldErrors.password = [msg];
          });
        } else if (err.response?.data?.errors) {
          this.fieldErrors = err.response.data.errors;
        } else {
          this.error = err.response?.data?.message || "Failed to update user";
        }
      }
    },

    async deleteUser() {
      try {
        await this.$axios.delete(`/users/${this.selectedUserToDelete.id}`, { withCredentials: true });
        this.users = this.users.filter(user => user.id !== this.selectedUserToDelete.id);
        this.showDeleteModal = false;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to delete user";
      }
    },
  },
};
</script>
