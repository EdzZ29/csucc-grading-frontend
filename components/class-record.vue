<template>
  <div class="flex-1 sm:ml-64 p-4 mt-6">
    <!-- Mobile toggle button -->
    <button
      data-drawer-target="default-sidebar"
      data-drawer-toggle="default-sidebar"
      aria-controls="default-sidebar"
      type="button"
      class="inline-flex items-center p-2 mb-4 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      <span class="sr-only">Open sidebar</span>
      <svg
        class="w-6 h-6"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          fill-rule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 
            1.5H2.75A.75.75 0 012 4.75zm0 
            10.5a.75.75 0 01.75-.75h7.5a.75.75 
            0 010 1.5h-7.5a.75.75 0 
            01-.75-.75zM2 10a.75.75 
            0 01.75-.75h14.5a.75.75 0 010 
            1.5H2.75A.75.75 0 012 10z"
        />
      </svg>
    </button>

    <!-- Example page content -->
    <div class="mt-20 mb-6 flex flex-wrap gap-10">
      <!-- Dropdown 1 -->
      <div>
        <p class="mb-2 text-gray-400">Select subject to view</p>

        <div class="relative inline-block">
          <button
            @click="subjectDropdownOpen = !subjectDropdownOpen"
            class="border border-gray-700 text-dark w-40 p-2 flex justify-between items-center hover:bg-green-700 hover:text-white"
            type="button"
          >
            Select Subject
            <svg
              class="w-4 h-4 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div
            v-show="subjectDropdownOpen"
            class="absolute mt-1 z-10 bg-white border border-gray-200 shadow-md w-40"
          >
            <ul class="py-2 text-sm text-gray-700">
              <li><a href="#" class="block px-4 py-2 hover:bg-green-700 hover:text-white">Dashboard</a></li>
              <li><a href="#" class="block px-4 py-2 hover:bg-green-700 hover:text-white">Settings</a></li>
              <li><a href="#" class="block px-4 py-2 hover:bg-green-700 hover:text-white">Earnings</a></li>
              <li><a href="#" class="block px-4 py-2 hover:bg-green-700 hover:text-white">Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Dropdown 2 -->
      <div>
        <p class="mb-2 text-gray-400">Select performance-based to view</p>

        <div class="relative inline-block">
          <button
            @click="performanceDropdownOpen = !performanceDropdownOpen"
            class="border border-gray-700 text-dark w-40 p-2 flex justify-between items-center hover:bg-green-700 hover:text-white"
            type="button"
          >
            Select Filter
            <svg
              class="w-4 h-4 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div
            v-show="performanceDropdownOpen"
            class="absolute mt-1 z-10 bg-white border border-gray-200 shadow-md w-40"
          >
            <ul class="py-2 text-sm text-gray-700">
              <li><a href="#" class="block px-4 py-2 hover:bg-green-700 hover:text-white">Option 1</a></li>
              <li><a href="#" class="block px-4 py-2 hover:bg-green-700 hover:text-white">Option 2</a></li>
              <li><a href="#" class="block px-4 py-2 hover:bg-green-700 hover:text-white">Option 3</a></li>
              <li><a href="#" class="block px-4 py-2 hover:bg-green-700 hover:text-white">Option 4</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center h-48 mb-10 border-2">
      <p class="text-2xl text-gray-400">+</p>
    </div>

    <div>
      <button class="text-white w-40 bg-green-700 hover:bg-green-800 transition p-2">
        Print
      </button>
    </div>
  </div>


  
</template>

<script>
export default {
  name: "classRecord",
  data() {
    return {
      subjectDropdownOpen: false,
      performanceDropdownOpen: false,
    };
  },
};
</script>
