<template>
  <div class="text-gray-800">
    <SuccessMessage ref="successMessage" />

    <!-- Search form -->
    <form @submit.prevent class="max-w-md mb-10 mx-auto sm:mx-0">
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >Search</label
      >
      <div class="relative">
        <input
          v-model="searchQuery"
          type="search"
          id="default-search"
          class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-700 focus:border-green-800 outline-none"
          placeholder="Search by name, role, or email"
        />
        <button
          type="submit"
          class="text-white absolute right-2 bottom-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search
        </button>
      </div>
    </form>

    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
    >
      <h1
        class="text-3xl font-epundaslab font-bold text-gray-900 dark:text-white mb-2"
      >
        User Management
      </h1>
      <button
        @click="toggleForm"
        class="w-full sm:w-auto px-4 py-2 mb-2 text-white bg-green-700 hover:bg-green-800 transition rounded-lg"
      >
        {{ showForm ? "Close" : "Create User" }}
      </button>
    </div>

    <!-- Create User Form -->
    <div v-if="showForm" class="mb-8">
      <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Create User</h2>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div v-if="errors.general" class="text-red-600">
            {{ errors.general }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-2 text-sm font-medium">First Name</label>
              <input
                v-model.trim="form.firstname"
                type="text"
                class="w-full p-2.5 rounded-lg border"
              />
              <p v-if="errors.firstname" class="text-red-600">
                {{ errors.firstname }}
              </p>
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium">Middlename</label>
              <input
                v-model.trim="form.middlename"
                type="text"
                class="w-full p-2.5 rounded-lg border"
              />
              <p v-if="errors.middlename" class="text-red-600">
                {{ errors.middlename }}
              </p>
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium">Last Name</label>
              <input
                v-model.trim="form.lastname"
                type="text"
                class="w-full p-2.5 rounded-lg border"
              />
              <p v-if="errors.lastname" class="text-red-600">
                {{ errors.lastname }}
              </p>
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium">Extname</label>
              <input
                v-model.trim="form.extname"
                type="text"
                class="w-full p-2.5 rounded-lg border"
              />
              <p v-if="errors.extname" class="text-red-600">
                {{ errors.extname }}
              </p>
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium">Role</label>
              <select
                v-model="form.role"
                class="w-full p-2.5 rounded-lg border"
              >
                <option value="Admin">Admin</option>
                <option value="Instructor">Instructor</option>
                <option value="Dean">Dean</option>
                <option value="Chancellor">Chancellor</option>
                <option value="Guidance">Guidance</option>
              </select>
              <p v-if="errors.role" class="text-red-600">{{ errors.role }}</p>
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium">Email</label>
              <input
                v-model.trim="form.email"
                type="email"
                class="w-full p-2.5 rounded-lg border"
              />
              <p v-if="errors.email" class="text-red-600">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full p-2.5 rounded-lg border"
            />
            <p v-if="errors.password" class="text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium"
              >Confirm Password</label
            >
            <input
              v-model="form.password_confirm"
              type="password"
              class="w-full p-2.5 rounded-lg border"
            />
            <p v-if="errors.password_confirm" class="text-red-600">
              {{ errors.password_confirm }}
            </p>
          </div>

          <button
            type="submit"
            class="w-full sm:w-auto px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
            :disabled="loading"
          >
            {{ loading ? "Saving..." : "Save User" }}
          </button>
        </form>
      </div>
    </div>

    <!-- User Table -->
    <div class="overflow-x-auto dark:bg-gray-800 shadow-md rounded-lg">
      <!-- Desktop -->
      <table
        class="hidden sm:table min-w-full text-sm text-left text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-white uppercase bg-green-700 dark:bg-gray-700"
        >
          <tr>
            <th class="px-6 py-3">Role</th>
            <th class="px-6 py-3">First Name</th>
            <th class="px-6 py-3">Last Name</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="border-b dark:border-gray-700"
          >
            <td class="px-6 py-4">{{ user.role }}</td>
            <td class="px-6 py-4">{{ user.firstname }}</td>
            <td class="px-6 py-4">{{ user.lastname }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4 text-right">
              <button
                @click="openDeleteModal(user)"
                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile Cards -->
      <div class="sm:hidden divide-y divide-gray-200 dark:divide-gray-700 mt-4">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="p-4 rounded-lg shadow mb-4"
        >
          <p><strong>Role:</strong> {{ user.role }}</p>
          <p><strong>First Name:</strong> {{ user.firstname }}</p>
          <p><strong>Last Name:</strong> {{ user.lastname }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <div class="mt-3">
            <button
              @click="openDeleteModal(user)"
              class="w-full px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        <h3 class="text-lg font-semibold mb-4">Delete User?</h3>
        <p class="mb-6">
          {{ userToDelete?.firstname }} {{ userToDelete?.lastname }} ({{
            userToDelete?.email
          }})
        </p>
        <div class="flex flex-col sm:flex-row justify-end gap-3">
          <button
            @click="closeDeleteModal"
            class="w-full sm:w-auto px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SuccessMessage from "@/components/success-message.vue";

const API_BASE = "http://localhost:9000/api";

export default {
  name: "UserManagement",
  components: { SuccessMessage },
  data() {
    return {
      showForm: false,
      showDeleteModal: false,
      users: [],
      userToDelete: null,
      form: {
        first_name: "",
        last_name: "",
        role: "INSTRUCTOR",
        email: "",
        password: "",
        password_confirm: "",
      },
      errors: {},
      loading: false,
      searchQuery: "",
    };
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users;
      const q = this.searchQuery.toLowerCase();
      return this.users.filter(
        (user) =>
          (user.firstname && user.firstname.toLowerCase().includes(q)) ||
          (user.lastname && user.lastname.toLowerCase().includes(q)) ||
          (user.role && user.role.toLowerCase().includes(q)) ||
          (user.email && user.email.toLowerCase().includes(q))
      );
    },
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
      this.errors = {};
    },
    async fetchUsers() {
      try {
        const res = await axios.get(`${API_BASE}/auth/admin/users`, {
          withCredentials: true,
        });
        this.users = Array.isArray(res.data) ? res.data : res.data.users || [];
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    },
    async submitForm() {
      this.errors = {};
      this.loading = true;
      try {
        await axios.post(
          `${API_BASE}/auth/admin/create-users/store`,
          this.form,
          { withCredentials: true }
        );
        this.$refs.successMessage.show("User created successfully!", "success");
        await this.fetchUsers();
        this.showForm = false;
        this.form = {
          first_name: "",
          last_name: "",
          role: "INSTRUCTOR",
          email: "",
          password: "",
          password_confirm: "",
        };
      } catch (err) {
        const payload = err.response?.data;
        this.errors.general = payload?.message || "An error occurred.";
      } finally {
        this.loading = false;
      }
    },
    openDeleteModal(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.userToDelete = null;
      this.showDeleteModal = false;
    },
    async confirmDelete() {
      if (!this.userToDelete) return;
      try {
        await axios.delete(
          `${API_BASE}/auth/admin/delete-users/${this.userToDelete.id}`,
          { withCredentials: true }
        );
        this.users = this.users.filter((u) => u.id !== this.userToDelete.id);
        this.closeDeleteModal();
        this.$refs.successMessage.show("User deleted successfully!", "success");
      } catch (err) {
        console.error("Delete failed", err);
        this.$refs.successMessage.show("Failed to delete user", "error");
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>
