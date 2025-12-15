<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm transition-opacity">
        <div
            class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden font-inria transform transition-all scale-100">

            <div class="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
                <div>
                    <h3 class="text-xl font-bold font-epundaslab">Set Standard Grade Weights</h3>
                    <p class="text-green-200 text-xs">Configure grading percentages for the university</p>
                </div>
                <button @click="$emit('close')"
                    class="text-green-200 hover:text-white hover:bg-green-700 rounded-full p-1 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-6 max-h-[70vh] overflow-y-auto">
                <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                    <button v-for="sys in ['LECTURE', 'LEC_LAB']" :key="sys" @click="activeSystem = sys" :class="['flex-1 py-2 text-sm font-semibold rounded-md transition-all',
                        activeSystem === sys ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
                        {{ sys === 'LECTURE' ? 'Lecture System' : 'Lec-Lab System' }}
                    </button>
                </div>

                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            <th class="py-3 px-2">Grading Category</th>
                            <th class="py-3 px-2 w-32 text-center">Weight (%)</th>
                            <th class="py-3 px-2 text-right">Last Modified</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="cat in getCategories(activeSystem)" :key="cat"
                            class="hover:bg-gray-50 transition-colors">
                            <td class="py-4 px-2 font-medium text-gray-800">{{ formatCategory(cat) }}</td>
                            <td class="py-4 px-2 text-center">
                                <div class="relative flex items-center justify-center">
                                    <input type="number" step="1" min="0" max="100"
                                        v-model.number="weights[activeSystem][cat].percentage"
                                        class="w-16 border border-gray-300 rounded-md px-2 py-1.5 text-center font-bold text-green-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                                    <span class="ml-2 text-gray-500 font-bold">%</span>
                                </div>
                            </td>
                            <td class="py-4 px-2 text-right text-xs text-gray-400">
                                <div class="flex flex-col items-end">
                                    <span class="font-medium text-gray-600">
                                        {{ weights[activeSystem][cat].modifiedBy || 'System Default' }}
                                    </span>
                                    <span class="text-[10px]">{{ weights[activeSystem][cat].date }}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot class="bg-gray-50 border-t border-gray-200">
                        <tr>
                            <td class="py-3 px-2 font-bold text-gray-700 text-right">TOTAL:</td>
                            <td class="py-3 px-2 text-center font-bold"
                                :class="totalPercentage === 100 ? 'text-green-600' : 'text-red-500'">
                                {{ totalPercentage }}%
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>

                <div v-if="totalPercentage !== 100"
                    class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                    Warning: Total weight must equal 100%. Currently at {{ totalPercentage }}%.
                </div>
            </div>

            <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                <button @click="$emit('close')"
                    class="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                <button @click="saveWeights" :disabled="totalPercentage !== 100"
                    class="px-5 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    Save Configuration
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // Ensure "user" prop is passed correctly from parent
    props: { isOpen: Boolean, user: Object },
    data() {
        return {
            activeSystem: 'LECTURE',
            weights: {
                LECTURE: {
                    WRITTEN: { percentage: 0, modifiedBy: '', date: '' },
                    PERFORMANCE: { percentage: 0, modifiedBy: '', date: '' },
                    MIDTERM: { percentage: 0, modifiedBy: '', date: '' },
                    FINAL: { percentage: 0, modifiedBy: '', date: '' }
                },
                LEC_LAB: {
                    LECTURE_COMP: { percentage: 0, modifiedBy: '', date: '' },
                    LAB_COMP: { percentage: 0, modifiedBy: '', date: '' },
                    MIDTERM: { percentage: 0, modifiedBy: '', date: '' },
                    FINAL: { percentage: 0, modifiedBy: '', date: '' }
                }
            }
        };
    },
    computed: {
        totalPercentage() {
            const cats = this.weights[this.activeSystem];
            // Ensure calculation handles strings or numbers safely
            return Object.values(cats).reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
        }
    },
    watch: {
        isOpen(newVal) {
            if (newVal) this.fetchWeights();
        }
    },
    methods: {
        async fetchWeights() {
            try {
                // ✅ FIX 1: Use $get correctly (returns data directly)
                const data = await this.$axios.$get('/grade-weight', { withCredentials: true });

                // Safety check if array is empty
                if (!data || data.length === 0) return;

                // Iterate through the flat list from backend
                data.forEach(w => {
                    // Check if this grading_type/category exists in our frontend structure
                    if (this.weights[w.grading_type] && this.weights[w.grading_type][w.category]) {
                        const target = this.weights[w.grading_type][w.category];

                        // 1. Percentage (Convert 0.20 to 20)
                        target.percentage = Math.round(Number(w.weight_percentage) * 100);

                        // 2. Format Name (Check for relation object first)
                        if (w.employee) {
                            target.modifiedBy = `${w.employee.lastname}, ${w.employee.firstname}`;
                        } else if (w.modified_by_empid) {
                            target.modifiedBy = `Admin ID: ${w.modified_by_empid}`; // Fallback if relation failed but ID exists
                        } else {
                            target.modifiedBy = 'System Default';
                        }

                        // 3. Format Date
                        if (w.updated_at) {
                            target.date = new Date(w.updated_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                            });
                        }
                    }
                });
            } catch (e) {
                console.error("Failed to load weights", e);
            }
        },

        getCategories(system) {
            return Object.keys(this.weights[system]);
        },

        formatCategory(cat) {
            // Helper to make "LECTURE_COMP" look nice -> "LECTURE ACTIVITIES"
            return cat.replace('_', ' ').replace('COMP', 'ACTIVITIES');
        },

        async saveWeights() {
            try {
                const payload = {
                    // Use user.empid if available, else 1
                    modified_by_empid: (this.user && this.user.empid) ? this.user.empid : 1,
                    weights: this.weights
                };

                await this.$axios.$post('/grade-weight', payload, { withCredentials: true });

                // Refresh display immediately
                await this.fetchWeights();

                this.$emit('save');
                // Optional: Alert success
                // alert('Saved successfully');
            } catch (e) {
                console.error(e);
                alert("Failed to save weights");
            }
        }
    }
};
</script>