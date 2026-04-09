<template>
  <div class="font-inria min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
    <SuccessMessage ref="successMessage" />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3 md:gap-4">
      <div class="flex items-center gap-3 md:gap-4">
        <div class="w-1 h-10 md:w-1.5 md:h-12 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
        <div>
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold font-epundaslab text-gray-800">User Management</h1>
          <p class="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
            <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
            <span>Manage system users and permissions</span>
          </p>
        </div>
      </div>

      <button
        @click="toggleForm"
        class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <svg v-if="!showForm" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ showForm ? "Close Form" : "Create User" }}
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 p-4 sm:p-5 mb-6 md:mb-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wider">Search Users</h2>
        </div>
        <div class="relative flex-1 w-full">
          <input
            v-model="searchQuery"
            type="search"
            class="block w-full p-3 sm:p-4 text-sm text-gray-900 border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none pr-24"
            placeholder="Search by name, role, or email..."
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- Create User Form -->
    <div v-if="showForm" class="mb-8 animate-fade-in">
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 px-4 sm:px-6 py-3 sm:py-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 class="text-base sm:text-lg font-bold text-white">Create New User</h2>
          </div>
        </div>

        <div class="p-4 sm:p-6">
          <!-- Error Banner — shows the real backend error message -->
          <div v-if="errors.general" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-red-700 text-sm font-medium">{{ errors.general }}</p>
                <p v-if="errors.detail" class="text-red-500 text-xs mt-1">{{ errors.detail }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <!-- First Name -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">First Name *</label>
              <input
                v-model.trim="form.firstname"
                type="text"
                class="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                :class="errors.firstname ? 'border-red-300' : 'border-gray-200'"
                placeholder="Enter first name"
              />
              <p v-if="errors.firstname" class="text-red-500 text-xs mt-1">{{ errors.firstname }}</p>
            </div>

            <!-- Middle Name -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Middle Name</label>
              <input
                v-model.trim="form.middlename"
                type="text"
                class="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                placeholder="Enter middle name"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Last Name *</label>
              <input
                v-model.trim="form.lastname"
                type="text"
                class="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                :class="errors.lastname ? 'border-red-300' : 'border-gray-200'"
                placeholder="Enter last name"
              />
              <p v-if="errors.lastname" class="text-red-500 text-xs mt-1">{{ errors.lastname }}</p>
            </div>

            <!-- Extension Name -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Extension</label>
              <input
                v-model.trim="form.extname"
                type="text"
                class="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                placeholder="e.g., Jr., III"
              />
            </div>

            <!-- Email -->
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address *</label>
              <input
                v-model.trim="form.email"
                type="email"
                class="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                :class="errors.email ? 'border-red-300' : 'border-gray-200'"
                placeholder="user@example.com"
              />
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Role *</label>
              <select
                v-model="form.role"
                class="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
              >
                <option value="Admin">Admin</option>
                <option value="Instructor">Instructor</option>
                <option value="Dean">Dean</option>
                <option value="Chairperson">Chairperson</option>
                <option value="Guidance">Guidance</option>
              </select>
              <p v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password *</label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50 pr-10"
                  :class="errors.password ? 'border-red-300' : 'border-gray-200'"
                  placeholder="••••••••"
                />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg v-if="!showPassword" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Confirm Password *</label>
              <input
                v-model="form.password_confirm"
                type="password"
                class="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                :class="errors.password_confirm ? 'border-red-300' : 'border-gray-200'"
                placeholder="••••••••"
              />
              <p v-if="errors.password_confirm" class="text-red-500 text-xs mt-1">{{ errors.password_confirm }}</p>
            </div>
          </div>

          <!-- Password Strength -->
          <div v-if="form.password" class="mt-4">
            <div class="flex items-center gap-2">
              <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-300"
                  :class="[
                    form.password.length < 6 ? 'w-1/3 bg-red-400' :
                    form.password.length < 10 ? 'w-2/3 bg-yellow-400' :
                    'w-full bg-green-400'
                  ]"
                ></div>
              </div>
              <span class="text-xs text-gray-400">
                {{ form.password.length < 6 ? 'Weak' : form.password.length < 10 ? 'Medium' : 'Strong' }}
              </span>
            </div>
          </div>

          <!-- Password Match -->
          <div v-if="form.password && form.password_confirm" class="text-xs flex items-center gap-1 mt-2">
            <svg v-if="form.password === form.password_confirm" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span :class="form.password === form.password_confirm ? 'text-green-600' : 'text-red-500'">
              {{ form.password === form.password_confirm ? 'Passwords match' : 'Passwords do not match' }}
            </span>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
            <button
              type="button"
              @click="toggleForm"
              class="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="submitForm"
              class="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-bold hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              :disabled="loading"
            >
              <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? "Saving..." : "Save User" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users List Header -->
    <div class="flex items-center gap-2 mb-4">
      <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wider">System Users</h2>
      <span class="ml-auto text-xs bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full font-medium">
        {{ filteredUsers.length }} users
      </span>
    </div>

    <!-- User Table -->
    <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Desktop -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <tr>
              <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Role</th>
              <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">First Name</th>
              <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Last Name</th>
              <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Email</th>
              <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(user, index) in paginatedUsers"
              :key="user.empid || user.id"
              class="hover:bg-orange-50/50 transition-colors"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'"
            >
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 font-medium text-gray-800">{{ user.firstname }}</td>
              <td class="px-6 py-4 text-gray-600">{{ user.lastname }}</td>
              <td class="px-6 py-4 text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center gap-2 justify-end">
                  <button
                    @click="openEditModal(user)"
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-xs font-medium shadow-sm hover:shadow flex items-center gap-1"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="openDeleteModal(user)"
                    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs font-medium shadow-sm hover:shadow flex items-center gap-1"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile -->
      <div class="sm:hidden p-4 space-y-4">
        <div
          v-for="user in paginatedUsers"
          :key="user.empid || user.id"
          class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between mb-3 gap-2">
            <span class="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
              {{ user.role }}
            </span>
            <div class="flex gap-2">
              <button
                @click="openEditModal(user)"
                class="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="openDeleteModal(user)"
                class="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-sm text-gray-800">{{ user.firstname }} {{ user.lastname }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-gray-500 truncate">{{ user.email }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0 && !loading" class="text-center py-12 px-4">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="text-gray-400 text-sm mb-2">No users found</p>
        <p class="text-xs text-gray-300">Try adjusting your search or create a new user</p>
      </div>

      <!-- Pagination Controls -->
      <div v-if="filteredUsers.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-6 py-4 bg-white rounded-lg border border-gray-200">
        <div class="text-sm text-gray-600">
          Showing <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
          to <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span>
          of <span class="font-semibold">{{ filteredUsers.length }}</span> users
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          <div class="flex items-center gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-lg transition-all',
                currentPage === page
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h3 class="text-lg sm:text-xl font-bold">{{ editingUser?.firstname }} {{ editingUser?.lastname }}</h3>
            <p class="text-sm text-blue-100">Edit user details and permissions</p>
          </div>
          <button @click="closeEditModal" class="p-2 hover:bg-blue-700 rounded-lg transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tab Navigation -->
        <div class="flex gap-0 border-b border-gray-200 px-6 sticky top-[68px] bg-white z-10">
          <button
            @click="editingUser.editTab = 'details'"
            :class="[
              'px-6 py-3 text-sm font-medium border-b-2 transition-all',
              editingUser?.editTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            ]"
          >
            User Details
          </button>
          <button
            @click="editingUser.editTab = 'password'"
            :class="[
              'px-6 py-3 text-sm font-medium border-b-2 transition-all',
              editingUser?.editTab === 'password'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            ]"
          >
            Password
          </button>
          <button
            @click="editingUser.editTab = 'security'"
            :class="[
              'px-6 py-3 text-sm font-medium border-b-2 transition-all',
              editingUser?.editTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            ]"
          >
            Security
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- Error Banner -->
          <div v-if="errors.editError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 text-sm font-medium">{{ errors.editError }}</p>
          </div>

          <!-- User Details Tab -->
          <div v-if="editingUser?.editTab === 'details'" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-2 uppercase">First Name</label>
                <input v-model="editForm.firstname" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-2 uppercase">Middle Name</label>
                <input v-model="editForm.middlename" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-2 uppercase">Last Name</label>
                <input v-model="editForm.lastname" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-2 uppercase">Extension Name</label>
                <input v-model="editForm.extname" type="text" placeholder="Jr., Sr., III" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2 uppercase">Email</label>
              <input v-model="editForm.email" type="email" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2 uppercase">Role</label>
              <select v-model="editForm.role" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Admin</option>
                <option>Dean</option>
                <option>Chairperson</option>
                <option>Guidance</option>
                <option>Instructor</option>
              </select>
            </div>
          </div>

          <!-- Password Tab -->
          <div v-if="editingUser?.editTab === 'password'" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-blue-800 font-medium flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Choose an option to update the password
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                @click="handleResetPassword"
                class="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset to Default
              </button>
              <button
                @click="showPasswordFields = !showPasswordFields"
                class="px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </button>
            </div>

            <!-- Change Password Fields -->
            <div v-if="showPasswordFields" class="space-y-3 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-2 uppercase">Current Password</label>
                <input v-model="passwordForm.oldPassword" type="password" placeholder="Enter current password" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-2 uppercase">New Password</label>
                <input v-model="passwordForm.newPassword" type="password" placeholder="Enter new password" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-2 uppercase">Confirm New Password</label>
                <input v-model="passwordForm.confirmPassword" type="password" placeholder="Confirm new password" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-if="editingUser?.editTab === 'security'" class="space-y-4">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-sm text-yellow-800 font-medium flex items-center gap-2 mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Account Security Options
              </p>
              <p class="text-xs text-yellow-700">Manage account access and security settings</p>
            </div>

            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div>
                  <p class="font-semibold text-red-700">Block Account</p>
                  <p class="text-xs text-red-600 mt-1">Prevent this user from logging in to the system</p>
                </div>
                <button
                  @click="handleBlockAccount"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                    editingUser?.is_blocked
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  ]"
                >
                  {{ editingUser?.is_blocked ? 'Unblock Account' : 'Block Account' }}
                </button>
              </div>
            </div>

            <div v-if="editingUser?.is_blocked" class="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-3">
              <svg class="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-orange-800">Account is Blocked</p>
                <p class="text-xs text-orange-700 mt-1">This user cannot sign in. Click "Unblock Account" to restore access.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          <button
            @click="closeEditModal"
            class="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            v-if="editingUser?.editTab === 'details' || editingUser?.editTab === 'password'"
            @click="handleSaveEditUser"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-sm"
    >
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-md transform transition-all">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-bold text-gray-800">Delete User</h3>
            <p class="text-xs sm:text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-5">
          <p class="text-sm text-gray-700 mb-2">You are about to delete:</p>
          <p class="font-medium text-gray-800">{{ userToDelete?.firstname }} {{ userToDelete?.lastname }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ userToDelete?.email }}</p>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-3">
          <button
            @click="closeDeleteModal"
            class="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-bold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SuccessMessage from "@/components/success-message.vue";

export default {
  name: "UserManagement",
  components: { SuccessMessage },

  data() {
    return {
      showForm: false,
      showDeleteModal: false,
      showEditModal: false,
      showPassword: false,
      users: [],
      userToDelete: null,
      editingUser: null,
      editForm: {
        firstname: "",
        middlename: "",
        lastname: "",
        extname: "",
        role: "Instructor",
        email: "",
      },
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      showPasswordFields: false,
      showResetPasswordModal: false,
      form: {
        firstname: "",
        middlename: "",
        lastname: "",
        extname: "",
        role: "Instructor",
        email: "",
        password: "",
        password_confirm: "",
      },
      errors: {},
      loading: false,
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
    };
  },

  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users;
      const q = this.searchQuery.toLowerCase();
      return this.users.filter(
        (u) =>
          (u.firstname && u.firstname.toLowerCase().includes(q)) ||
          (u.lastname && u.lastname.toLowerCase().includes(q)) ||
          (u.role && u.role.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    },

    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
  },

  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
      this.errors = {};
    },

    // ── CLIENT-SIDE VALIDATION ────────────────────────────────────────
    // Run this before sending to the server so Railway never rejects
    // a request due to missing/invalid fields.
    validateForm() {
      const e = {};
      if (!this.form.firstname) e.firstname = "First name is required.";
      if (!this.form.lastname)  e.lastname  = "Last name is required.";
      if (!this.form.email)     e.email     = "Email is required.";
      if (!this.form.role)      e.role      = "Role is required.";

      if (!this.form.password) {
        e.password = "Password is required.";
      } else if (this.form.password.length < 6) {
        e.password = "Password must be at least 6 characters.";
      }

      if (!this.form.password_confirm) {
        e.password_confirm = "Please confirm your password.";
      } else if (this.form.password !== this.form.password_confirm) {
        e.password_confirm = "Passwords do not match.";
      }

      // basic email format check
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.form.email && !emailRe.test(this.form.email)) {
        e.email = "Please enter a valid email address.";
      }

      this.errors = e;
      return Object.keys(e).length === 0;
    },

    async fetchUsers() {
      try {
        const res = await this.$axios.get("/auth/admin/users", {
          withCredentials: true,
        });
        this.users = Array.isArray(res.data)
          ? res.data
          : res.data.users || [];
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    },

    async submitForm() {
      // 1. Client-side validation first
      if (!this.validateForm()) return;

      this.loading = true;
      this.errors  = {};

      // 2. Build a clean payload — only send what the backend expects,
      //    no extra keys that might confuse NestJS validation pipes.
      const payload = {
        firstname:        this.form.firstname,
        middlename:       this.form.middlename  || "",
        lastname:         this.form.lastname,
        extname:          this.form.extname     || "",
        role:             this.form.role,
        email:            this.form.email.toLowerCase().trim(),
        password:         this.form.password,
        password_confirm: this.form.password_confirm,
      };

      try {
        // 3. Explicit Content-Type header — Railway sometimes strips it
        await this.$axios.post(
          "/auth/admin/create-users/store",
          payload,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        this.$refs.successMessage.show("User created successfully!", "success");
        await this.fetchUsers();
        this.showForm = false;
        this.resetForm();

      } catch (err) {
        // 4. Deep error extraction — covers all NestJS error shapes
        const res  = err.response;
        const data = res?.data;

        console.error("Create user error:", {
          status:  res?.status,
          data,
        });

        if (!res) {
          // Network error — no response at all (CORS, timeout, DNS)
          this.errors.general =
            "Cannot reach the server. Check your internet connection or try again.";
          this.errors.detail =
            "If this works locally but not on Railway, check CORS settings and environment variables.";
          return;
        }

        // NestJS class-validator returns { message: string[] } on 400
        if (Array.isArray(data?.message)) {
          this.errors.general = data.message.join(" | ");
        } else if (typeof data?.message === "string") {
          this.errors.general = data.message;
        } else if (typeof data?.error === "string") {
          this.errors.general = data.error;
        } else {
          // Unknown shape — show status so user can report it
          this.errors.general =
            `Request failed (HTTP ${res.status}). Please check Railway backend logs.`;
        }

      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.form = {
        firstname:        "",
        middlename:       "",
        lastname:         "",
        extname:          "",
        role:             "Instructor",
        email:            "",
        password:         "",
        password_confirm: "",
      };
    },

    openEditModal(user) {
      this.editingUser = { ...user, editTab: 'details' };
      this.editForm = {
        firstname: user.firstname || '',
        middlename: user.middlename || '',
        lastname: user.lastname || '',
        extname: user.extname || '',
        role: user.role || 'Instructor',
        email: user.email || '',
      };
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      this.showPasswordFields = false;
      this.errors = {};
      this.showEditModal = true;
    },

    closeEditModal() {
      this.showEditModal = false;
      this.editingUser = null;
      this.showPasswordFields = false;
      this.errors = {};
    },

    async handleSaveEditUser() {
      if (!this.editingUser) return;
      
      const id = this.editingUser.empid ?? this.editingUser.id;
      this.loading = true;
      this.errors = {};

      try {
        if (this.editingUser.editTab === 'details') {
          // Save user details
          await this.$axios.put(
            `/auth/admin/users/${id}`,
            this.editForm,
            { withCredentials: true }
          );
          this.$refs.successMessage.show('User details updated successfully!', 'success');
        } else if (this.editingUser.editTab === 'password' && this.showPasswordFields) {
          // Validate password fields
          if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
            this.errors.editError = 'All password fields are required.';
            this.loading = false;
            return;
          }
          if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
            this.errors.editError = 'New passwords do not match.';
            this.loading = false;
            return;
          }
          if (this.passwordForm.newPassword.length < 6) {
            this.errors.editError = 'New password must be at least 6 characters.';
            this.loading = false;
            return;
          }

          // Change password
          await this.$axios.post(
            `/auth/admin/users/${id}/change-password`,
            {
              oldPassword: this.passwordForm.oldPassword,
              newPassword: this.passwordForm.newPassword,
            },
            { withCredentials: true }
          );
          this.$refs.successMessage.show('Password changed successfully!', 'success');
          this.showPasswordFields = false;
        }

        await this.fetchUsers();
        this.closeEditModal();
      } catch (err) {
        console.error('Error:', err);
        console.error('Response data:', err.response?.data);
        console.error('Response status:', err.response?.status);
        const message = err.response?.data?.message || err.message || 'An error occurred.';
        this.errors.editError = message;
        this.$refs.successMessage.show(`Error: ${message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async handleResetPassword() {
      if (!this.editingUser) return;
      
      if (!confirm(`Reset password for ${this.editingUser.firstname} ${this.editingUser.lastname} to default?\n\nDefault password: "Password123"`)) {
        return;
      }

      const id = this.editingUser.empid ?? this.editingUser.id;
      this.loading = true;

      try {
        await this.$axios.post(
          `/auth/admin/users/${id}/reset-password`,
          {},
          { withCredentials: true }
        );
        this.$refs.successMessage.show('Password reset to default successfully!', 'success');
        await this.fetchUsers();
        this.closeEditModal();
      } catch (err) {
        console.error('Reset password error:', err);
        console.error('Response data:', err.response?.data);
        const message = err.response?.data?.message || 'Failed to reset password.';
        this.errors.editError = message;
        this.$refs.successMessage.show(`Error: ${message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async handleBlockAccount() {
      if (!this.editingUser) return;
      
      const action = this.editingUser.is_blocked ? 'unblock' : 'block';
      if (!confirm(`Are you sure you want to ${action} this account?`)) {
        return;
      }

      const id = this.editingUser.empid ?? this.editingUser.id;
      this.loading = true;

      try {
        await this.$axios.post(
          `/auth/admin/users/${id}/${action}-account`,
          {},
          { withCredentials: true }
        );
        this.$refs.successMessage.show(`Account ${action}ed successfully!`, 'success');
        this.editingUser.is_blocked = !this.editingUser.is_blocked;
        await this.fetchUsers();
      } catch (err) {
        console.error(`${action} account error:`, err);
        console.error('Response data:', err.response?.data);
        const message = err.response?.data?.message || `Failed to ${action} account.`;
        this.errors.editError = message;
        this.$refs.successMessage.show(`Error: ${message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    openDeleteModal(user) {
      this.userToDelete  = user;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.userToDelete    = null;
      this.showDeleteModal = false;
    },

    async confirmDelete() {
      if (!this.userToDelete) return;
      // Use empid as primary key (matches backend route /delete-users/:empid)
      const id = this.userToDelete.empid ?? this.userToDelete.id;
      try {
        await this.$axios.delete(
          `/auth/admin/delete-users/${id}`,
          { withCredentials: true }
        );
        this.users = this.users.filter(
          (u) => (u.empid ?? u.id) !== id
        );
        this.closeDeleteModal();
        this.$refs.successMessage.show("User deleted successfully!", "success");
      } catch (err) {
        console.error("Delete failed:", err);
        this.$refs.successMessage.show(
          `Failed to delete user (${err.response?.status ?? "no response"})`,
          "error"
        );
      }
    },
  },

  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>