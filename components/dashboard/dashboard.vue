<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const students = ref([]);
const user = ref(null);

// ✅ Fetch logged-in user
const fetchUser = async () => {
  try {
    const response = await axios.get("http://localhost:9000/api/auth/user", {
      withCredentials: true,
    });
    user.value = response.data;
  } catch (err) {
    console.error("Error fetching user:", err);
  }
};

// ✅ Calendar setup
const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const calendarDays = ref([]);
const currentMonth = ref("");
const currentYear = ref("");

const generateCalendar = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  currentMonth.value = today.toLocaleString("default", { month: "long" });
  currentYear.value = year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const temp = [];
  for (let i = 0; i < firstDay; i++) {
    temp.push({ day: "", isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    temp.push({
      day: d,
      isToday:
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear(),
    });
  }

  calendarDays.value = temp;
};

// ✅ Scroll animation (fade in & fade out)
const observeAnimations = () => {
  const elements = document.querySelectorAll(".animate-fadeInUp");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-active");
          entry.target.classList.remove("animate-hidden");
        } else {
          entry.target.classList.remove("animate-active");
          entry.target.classList.add("animate-hidden");
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => observer.observe(el));
};

onMounted(() => {
  fetchUser();
  generateCalendar();
  observeAnimations();
});
</script>

<template>
  <div class="font-inria">
    <!-- Welcome Banner + Calendar -->
    <div class="flex flex-col lg:flex-row gap-6 mb-6">
      <!-- Welcome Banner -->
      <div
        class="flex flex-col sm:flex-row items-center justify-between bg-green-800 shadow-lg rounded-md p-6 flex-1 animate-fadeInUp delay-100"
      >
        <div class="flex-1 text-center sm:text-left">
          <h1 class="text-white font-epundaslab text-3xl font-semibold">
            Hello, {{ user ? user.firstname : "Loading..." }}!
          </h1>
          <p class="text-white text-md mt-2 font-inria">
            Welcome back to your dashboard. Here you can manage your modules and tasks.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
          <img
            src="../../assets/image/Dashboard.png"
            class="w-56 h-56 object-contain mx-auto sm:mx-0"
          />
        </div>
      </div>

      <!-- Calendar -->
      <div
        class="bg-white border border-gray-300 dark:bg-gray-800 shadow-md rounded-md p-4 w-full lg:w-80 animate-fadeInUp delay-200"
      >
        <h2 class="text-center font-semibold text-gray-900 dark:text-white mb-2">
          {{ currentMonth }} {{ currentYear }}
        </h2>
        <div class="grid grid-cols-7 gap-2 text-sm text-center">
          <span v-for="day in days" :key="day" class="font-bold">{{ day }}</span>
          <span
            v-for="(date, index) in calendarDays"
            :key="index"
            :class="[
              'p-2 rounded-xl',
              date.isToday
                ? 'bg-green-700 text-white'
                : 'text-gray-700 dark:text-gray-200',
            ]"
          >
            {{ date.day }}
          </span>
        </div>
      </div>
    </div>

    <!-- Overview Title -->
    <div class="mt-14 animate-fadeInUp delay-100">
      <p class="text-lg font-epundaslab">Overview</p>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <!-- Card 1 -->
      <div
        class="border border-gray-300 bg-white dark:bg-gray-800 shadow-md rounded-md p-6 flex flex-col justify-between animate-fadeInUp delay-100"
      >
        <div class="flex justify-between items-start">
          <div class="p-3 rounded-lg bg-purple-100">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h18v18H3z" />
            </svg>
          </div>
          <span
            class="px-3 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full"
          >
            12% ↑
          </span>
        </div>
        <p class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">5127</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Items Sales</p>
      </div>

      <!-- Card 2 -->
      <div
        class="border border-gray-300 bg-white dark:bg-gray-800 shadow-md rounded-md p-6 flex flex-col justify-between animate-fadeInUp delay-200"
      >
        <div class="flex justify-between items-start">
          <div class="p-3 rounded-lg bg-red-100">
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h18v18H3z" />
            </svg>
          </div>
          <span
            class="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full"
          >
            6% ↓
          </span>
        </div>
        <p class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">10963</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">New Orders</p>
      </div>

      <!-- Card 3 -->
      <div
        class="border border-gray-300 bg-white dark:bg-gray-800 shadow-md rounded-md p-6 flex flex-col justify-between animate-fadeInUp delay-300"
      >
        <div class="flex justify-between items-start">
          <div class="p-3 rounded-lg bg-yellow-100">
            <svg
              class="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h18v18H3z" />
            </svg>
          </div>
          <span
            class="px-3 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full"
          >
            72% ↑
          </span>
        </div>
        <p class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">1171</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
      </div>

      <!-- Card 4 -->
      <div
        class="border border-gray-300 bg-white dark:bg-gray-800 shadow-md rounded-md p-6 flex flex-col justify-between animate-fadeInUp delay-400"
      >
        <div class="flex justify-between items-start">
          <div class="p-3 rounded-lg bg-green-100">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h18v18H3z" />
            </svg>
          </div>
          <span
            class="px-3 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full"
          >
            150% ↑
          </span>
        </div>
        <p class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">10606</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">New Visitor</p>
      </div>
    </div>

    <!-- Note -->
    <div class="mt-16 animate-fadeInUp delay-100">
      <p class="font-inria text-sm">
        <span class="font-bold">Note:</span> Contrary to popular belief, Lorem Ipsum is
        not simply random text. It has roots in a piece of classical Latin literature
        from 45 BC...
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Fade In & Out */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(30px);
  }
}

/* Initial State */
.animate-fadeInUp {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

/* When visible */
.animate-active {
  animation: fadeInUp 0.8s ease forwards;
}

/* When hidden */
.animate-hidden {
  animation: fadeOutDown 0.8s ease forwards;
}

/* Delay Utilities */
.delay-100 {
  animation-delay: 0.2s;
}
.delay-200 {
  animation-delay: 0.4s;
}
.delay-300 {
  animation-delay: 0.6s;
}
.delay-400 {
  animation-delay: 0.8s;
}
</style>
