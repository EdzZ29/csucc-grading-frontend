<template>

<div>
    
    <!-- <p class="flex align-center justify-center mb-4 mt-10">List of Students that are most likely to PASS the semester</p> -->
    
    <div class="flex h-auto mb-10 border overflow-hidden">
        <div class="relative w-full overflow-x-auto">
        
        <table class="w-full text-sm text-left text-gray-500 ">
            <!-- Table Head -->

            <thead class="text-xs text-white uppercase bg-green-700">
            <tr>
                <th scope="col" class="px-4 sm:px-6 py-3">First Name</th>
                <th scope="col" class="px-4 sm:px-6 py-3">Middle Name</th>
                <th scope="col" class="px-4 sm:px-6 py-3">Last Name</th>
                <th scope="col" class="px-4 sm:px-6 py-3">Id Number</th>
            </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="text-black">
            <tr class="bg-white border-b ">
                <td class="px-4 sm:px-6 py-3 "> Edmundo</td>
                <td class="px-4 sm:px-6 py-3">Calo</td>
                <td class="px-4 sm:px-6 py-3">Ederio</td>
                <td class="px-4 sm:px-6 py-3">2022-1373</td>
            </tr>

            <tr class="bg-white border-b">
                <td class="px-4 sm:px-6 py-3 ">Jannelle</td>
                <td class="px-4 sm:px-6 py-3">Rementizo</td>
                <td class="px-4 sm:px-6 py-3">Magdasal</td>
                <td class="px-4 sm:px-6 py-3">2022-1173</td>
            </tr>

            <tr class="bg-white border-b">
                <td class="px-4 sm:px-6 py-3 ">Justinian</td>
                <td class="px-4 sm:px-6 py-3">Fortun</td>
                <td class="px-4 sm:px-6 py-3">Melecio</td>
                <td class="px-4 sm:px-6 py-3">2022-2723</td>
            </tr>
            </tbody>
        </table>
    </div>
  </div>
</div>
  
</template>

<script>
export default {
  name: "Pass",
};
</script>
