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


      
      <form class="w-full max-w-md mb-6">   
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
            class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 bg-gray-50"
            placeholder="Search name of the students"
            required
          />
          <button
            type="submit"
            class="text-white absolute right-2.5 bottom-2.5 bg-green-600 hover:bg-green-700 
                  font-medium text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      </form>



      <!-- Example page content -->
      <div class="mt-20 mb-6 flex flex-wrap gap-4">
        <button
          @click="activeTab = 'pass'"
          :class="[
            'border w-40 p-2',
            activeTab === 'pass'
              ? 'bg-green-700 text-white border-green-700'
              : 'border-gray-700 text-dark hover:bg-green-700 hover:text-white'
          ]"
        >
          Passed
        </button>

        <button
          @click="activeTab = 'incomplete'"
          :class="[
            'border w-40 p-2',
            activeTab === 'incomplete'
              ? 'bg-green-700 text-white border-green-700'
              : 'border-gray-700 text-dark hover:bg-green-700 hover:text-white'
          ]"
        >
          Incomplete
        </button>

        <button
          @click="activeTab = 'drop'"
          :class="[
            'border w-40 p-2',
            activeTab === 'drop'
              ? 'bg-green-700 text-white border-green-700'
              : 'border-gray-700 text-dark hover:bg-green-700 hover:text-white'
          ]"
        >
          Drop
        </button>
      </div>

      <!-- Switch content dynamically -->
      <component :is="activeTab" />

      
    </div>
</template>

<script>

import pass from './student-monitoring/pass.vue';
import incomplete from './student-monitoring/incomplete.vue';
import drop from './student-monitoring/drop.vue';

    export default {
        name: 'studentMonitoring',

        components: {
          pass,
          incomplete,
          drop
    },

    data() {
        return {
      // default active tab
      activeTab: 'pass',
    }
  },
    }
</script>