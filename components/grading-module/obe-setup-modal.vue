<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-2 md:p-6 backdrop-blur-sm">
        <div
            class="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] overflow-hidden font-inria animate-fade-in flex flex-col">

            <!-- Modal Header - Orange gradient to match theme -->
            <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-base sm:text-lg md:text-xl font-bold font-epundaslab">OBE Syllabus Setup</h2>
                        <p class="text-xs text-white/80 mt-0.5 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 bg-green-300 rounded-full"></span>
                            {{ activeSubject ? activeSubject.subjcode : 'No Subject Selected' }} • Section: {{ activeSubject ? (activeSubject.section || activeSubject.sect) : 'N/A' }}
                        </p>
                    </div>
                </div>
                <button @click="$emit('close')"
                    class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Modal Body -->
            <div class="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
                
                <!-- Add Assessment Type Section - Redesigned -->
                <div class="mb-6 sm:mb-8 p-4 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div class="flex items-center gap-3 w-full lg:w-auto">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <span class="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">System Utility</span>
                            <p class="text-xs sm:text-sm text-gray-600">Add New Assessment Type</p>
                        </div>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div class="flex gap-2 flex-1">
                            <input v-model="newType.name" placeholder="Name (e.g. Field Trip)"
                                class="text-xs sm:text-sm p-2.5 border border-gray-200 rounded-lg bg-gray-50 flex-1 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none" />
                            <input v-model="newType.code" placeholder="Code"
                                class="text-xs sm:text-sm p-2.5 border border-gray-200 rounded-lg bg-gray-50 w-20 sm:w-24 uppercase focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none" />
                        </div>
                        <button @click="addNewAssessmentType"
                            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Register Type
                        </button>
                    </div>
                </div>

                <!-- Main Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                    
                    <!-- Left Column - Course Outcomes -->
                    <div class="lg:col-span-5 flex flex-col">
                        <div class="flex justify-between items-center mb-4 sm:mb-6">
                            <div class="flex items-center gap-2">
                                <div class="w-1 h-6 bg-orange-400 rounded-full"></div>
                                <h4 class="font-bold text-gray-700 text-sm sm:text-base">Course Outcomes</h4>
                            </div>
                            <button @click="addCO"
                                class="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-200 transition-colors flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Outcome
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div v-for="(co, idx) in localOutcomes" :key="'co-card-' + idx"
                                class="p-4 sm:p-5 bg-white rounded-xl border border-gray-200 shadow-sm relative transition-all hover:shadow-md hover:border-orange-300 group">
                                
                                <button @click="removeCO(idx)"
                                    class="absolute top-3 right-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full w-7 h-7 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div class="mb-3">
                                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Outcome Code</label>
                                    <input v-model="co.co_code" placeholder="e.g., CO1"
                                        class="font-bold text-base sm:text-lg w-full bg-transparent border-b-2 border-gray-100 focus:border-orange-400 outline-none uppercase transition-colors" />
                                </div>

                                <div>
                                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Description</label>
                                    <textarea v-model="co.description" placeholder="Describe the course outcome..."
                                        rows="3"
                                        class="text-xs sm:text-sm w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none resize-none"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Weight Matrix -->
                    <div class="lg:col-span-7 flex flex-col">
                        <div class="flex justify-between items-center mb-4 sm:mb-6">
                            <div class="flex items-center gap-2">
                                <div class="w-1 h-6 bg-blue-400 rounded-full"></div>
                                <h4 class="font-bold text-gray-700 text-sm sm:text-base">Weight Matrix (TOS)</h4>
                            </div>
                            <button @click="addWeight"
                                class="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Row
                            </button>
                        </div>

                        <!-- Table Container -->
                        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm">
                                    <thead>
                                        <tr class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Outcome</th>
                                            <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assessment Type</th>
                                            <th class="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Weight %</th>
                                            <th class="px-4 py-3 text-center w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100">
                                        <tr v-for="(w, idx) in localWeights" :key="'tos-row-' + idx"
                                            class="hover:bg-orange-50/30 transition-colors">
                                            <td class="px-4 py-3">
                                                <select v-model="w.co_code"
                                                    class="bg-transparent font-medium text-gray-700 outline-none cursor-pointer text-xs sm:text-sm">
                                                    <option v-for="(co, coIdx) in localOutcomes" :key="'sel-co-' + coIdx"
                                                        :value="co.co_code">{{ co.co_code }}</option>
                                                </select>
                                            </td>
                                            <td class="px-4 py-3">
                                                <select v-model="w.type_id"
                                                    class="bg-transparent w-full text-gray-600 outline-none cursor-pointer text-xs sm:text-sm">
                                                    <option v-for="type in assessmentTypes" :key="'sel-type-' + type.type_id" :value="type.type_id">
                                                        [{{ type.code }}] {{ type.name }}
                                                    </option>
                                                </select>
                                            </td>
                                            <td class="px-4 py-3 text-right">
                                                <div class="flex items-center justify-end gap-1">
                                                    <input type="number" v-model.number="w.percentage"
                                                        class="w-16 text-right font-bold text-orange-600 bg-orange-50/50 rounded-lg p-1.5 focus:ring-2 focus:ring-orange-400 outline-none text-xs sm:text-sm" 
                                                        min="0" max="100" step="1" />
                                                    <span class="text-gray-400 text-xs">%</span>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-center">
                                                <button @click="removeWeight(idx)"
                                                    class="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                    title="Remove weight row">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Validation Status Card -->
                        <div class="mt-4 sm:mt-6 p-4 sm:p-5 bg-white rounded-xl border-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all"
                            :class="totalWeight === 100 ? 'border-green-200 bg-green-50/20' : 'border-red-200 bg-red-50/20'">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center"
                                    :class="totalWeight === 100 ? 'bg-green-100' : 'bg-red-100'">
                                    <svg v-if="totalWeight === 100" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <svg v-else class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Validation Status</span>
                                    <span class="text-xs sm:text-sm font-medium text-gray-600">Total Calculated Weight</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                <span class="text-xs text-gray-400">Total:</span>
                                <span :class="['text-xl sm:text-2xl font-black', totalWeight === 100 ? 'text-green-600' : 'text-red-600']">
                                    {{ totalWeight }}%
                                </span>
                            </div>
                        </div>
                        
                        <!-- Error Message Toast (New) -->
                        <div v-if="showWeightError" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fade-in">
                            <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-xs text-red-600">Total weight must equal 100% before saving. Current: {{ totalWeight }}%</span>
                            <button @click="showWeightError = false" class="ml-auto text-red-400 hover:text-red-600">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                <button @click="$emit('close')"
                    class="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                    Cancel
                </button>
                <button @click="submitSyllabus" :disabled="totalWeight !== 100"
                    class="w-full sm:w-auto px-6 sm:px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Confirm & Save Syllabus
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ObeSetupModal',
    props: {
        isOpen: Boolean,
        activeSubject: Object,
    },
    data: function () {
        return {
            localOutcomes: [{ co_code: 'CO1', description: '' }],
            localWeights: [{ co_code: 'CO1', type_id: 1, percentage: 0 }],
            assessmentTypes: [],
            newType: { name: '', code: '' },
            showWeightError: false, // New data property for error toast
        }
    },
    computed: {
        totalWeight: function () {
            return this.localWeights.reduce(function (sum, w) {
                return sum + (Number(w.percentage) || 0)
            }, 0)
        },
    },
    watch: {
        isOpen: async function (val) {
            if (val) {
                this.showWeightError = false; // Reset error when modal opens
                await this.fetchTypes()
                await this.loadExistingSyllabus()
            }
        },
        // Watch totalWeight to hide error when it becomes 100%
        totalWeight: function(newVal) {
            if (newVal === 100) {
                this.showWeightError = false;
            }
        }
    },
    methods: {
        fetchTypes: async function () {
            try {
                var res = await this.$axios.get('/obe/assessment-types')
                this.assessmentTypes = res.data
            } catch (e) {
                console.error('Critical: Could not load assessment types', e)
            }
        },

        addCO: function () {
            var nextNum = this.localOutcomes.length + 1
            this.localOutcomes.push({ co_code: 'CO' + nextNum, description: '' })
        },

        removeCO: function (idx) {
            if (this.localOutcomes.length > 1) {
                var removedCode = this.localOutcomes[idx].co_code
                this.localOutcomes.splice(idx, 1)

                // Auto-remove weight rows that reference the deleted CO
                this.localWeights = this.localWeights.filter(function (w) {
                    return w.co_code !== removedCode
                })

                // Ensure at least one weight row remains
                if (this.localWeights.length === 0) {
                    this.localWeights.push({
                        co_code: this.localOutcomes[0] ? this.localOutcomes[0].co_code : 'CO1',
                        type_id: 1,
                        percentage: 0,
                    })
                }
            }
        },

        addWeight: function () {
            var defaultCO = this.localOutcomes[0] ? this.localOutcomes[0].co_code : 'CO1'
            this.localWeights.push({ co_code: defaultCO, type_id: 1, percentage: 0 })
        },

        removeWeight: function (idx) {
            if (this.localWeights.length > 1) {
                this.localWeights.splice(idx, 1)
            } else {
                this.localWeights[0].percentage = 0
            }
        },

        submitSyllabus: async function () {
            if (this.totalWeight !== 100) {
                // Show error toast instead of/in addition to alert
                this.showWeightError = true;
                
                // Optional: Scroll to validation card to draw attention
                const validationCard = document.querySelector('[class*="border-red-200"]');
                if (validationCard) {
                    validationCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Still keep alert for immediate feedback
                alert('Total weight must equal 100% before saving.');
                return
            }

            try {
                var payload = {
                    subjcode: this.activeSubject.subjcode,
                    section: (this.activeSubject.section || this.activeSubject.sect || 'N-A').trim(),
                    sy: this.$parent.selectedYear || '2025-2026',
                    sem: this.$parent.selectedSemester || '1st',
                    empid: this.$parent.user.empid,
                    outcomes: this.localOutcomes,
                    /*
                     * ═══════════════════════════════════════════════════════
                     * CRITICAL FIX: Send whole numbers, NOT decimals.
                     *
                     * The backend compute formula is:
                     *   weighted = (avgPercent * weight_percentage) / 100
                     *
                     * With whole number 10:  (84 * 10) / 100 = 8.4   ✓
                     * With decimal 0.10:     (84 * 0.10) / 100 = 0.084 ✗
                     *
                     * OLD CODE (BUG):  weight_percentage: w.percentage / 100
                     * FIXED:           weight_percentage: w.percentage
                     * ═══════════════════════════════════════════════════════
                     */
                    weights: this.localWeights.map(function (w) {
                        return {
                            co_code: w.co_code,
                            type_id: w.type_id,
                            weight_percentage: w.percentage,
                        }
                    }),
                }

                await this.$axios.post('/obe/course-outcome/batch', payload)
                alert('Syllabus logic saved successfully!')
                this.$emit('save')
            } catch (e) {
                console.error(e)
                alert('Error saving syllabus logic. Check backend logs.')
            }
        },

        addNewAssessmentType: async function () {
            if (!this.newType.name || !this.newType.code) return
            try {
                var payload = {
                    name: this.newType.name,
                    code: this.newType.code.toUpperCase(),
                    empid: this.$parent.user.empid,
                }
                var res = await this.$axios.post('/obe/assessment-types', payload)
                this.assessmentTypes.push(res.data)
                this.newType = { name: '', code: '' }
                alert('New assessment type registered!')
            } catch (e) {
                alert('Failed to add type. The code might already be taken.')
            }
        },

        loadExistingSyllabus: async function () {
            if (!this.activeSubject || !this.$parent.user) return

            try {
                var empid = this.$parent.user.empid
                var subj = this.activeSubject.subjcode
                var rawSection = this.activeSubject.section || this.activeSubject.sect || 'N-A'
                var sect = encodeURIComponent(rawSection.trim())

                var url = '/obe/syllabus/' + empid + '/' + encodeURIComponent(subj) + '/' + sect
                var res = await this.$axios.get(url)
                var data = res.data

                // Reset arrays to avoid stacking old data on re-open
                this.localOutcomes = []
                this.localWeights = []

                if (data && data.length > 0) {
                    // Deduplicate by co_id
                    var coMap = new Map()
                    data.forEach(function (c) {
                        if (!coMap.has(c.co_id)) coMap.set(c.co_id, c)
                    })
                    var uniqueCOs = Array.from(coMap.values())

                    this.localOutcomes = uniqueCOs.map(function (co) {
                        return { co_code: co.co_code, description: co.description }
                    })

                    // Flatten weights from deduplicated COs
                    var allWeights = []
                    uniqueCOs.forEach(function (co) {
                        if (co.tosWeights && co.tosWeights.length > 0) {
                            co.tosWeights.forEach(function (tw) {
                                /*
                                 * ═══════════════════════════════════════════
                                 * AUTO-DETECT storage format.
                                 *
                                 * Old modal stored decimals:  0.10 for 10%
                                 * New modal stores whole:     10   for 10%
                                 *
                                 * Detection: check if ALL weight values
                                 * in this syllabus are < 1 — if so, it's
                                 * old decimal format, multiply × 100 for display.
                                 *
                                 * We defer this until after collecting all weights.
                                 * ═══════════════════════════════════════════
                                 */
                                allWeights.push({
                                    co_code: co.co_code,
                                    type_id: tw.type_id,
                                    rawWeight: tw.weight_percentage,
                                })
                            })
                        }
                    })

                    if (allWeights.length > 0) {
                        // Check if ALL raw values are < 1 → old decimal format
                        var allDecimal = allWeights.every(function (w) {
                            return w.rawWeight < 1
                        })

                        this.localWeights = allWeights.map(function (w) {
                            return {
                                co_code: w.co_code,
                                type_id: w.type_id,
                                percentage: allDecimal
                                    ? Math.round(w.rawWeight * 100)
                                    : Math.round(w.rawWeight),
                            }
                        })
                    } else {
                        this.localWeights = [{
                            co_code: this.localOutcomes[0] ? this.localOutcomes[0].co_code : 'CO1',
                            type_id: 1,
                            percentage: 0,
                        }]
                    }
                } else {
                    this.localOutcomes = [{ co_code: 'CO1', description: '' }]
                    this.localWeights = [{ co_code: 'CO1', type_id: 1, percentage: 0 }]
                }
            } catch (e) {
                console.error('Syllabus fetch failed', e)
                this.localOutcomes = [{ co_code: 'CO1', description: '' }]
                this.localWeights = [{ co_code: 'CO1', type_id: 1, percentage: 0 }]
            }
        },
    },
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.font-black {
    font-weight: 900;
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>