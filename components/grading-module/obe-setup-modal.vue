<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 md:p-6 backdrop-blur-sm">
        <div
            class="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] overflow-hidden font-inria animate-fade-in flex flex-col">

            <div class="bg-green-800 text-white px-6 py-4 flex justify-between items-center shrink-0">
                <div>
                    <h2 class="text-xl font-bold uppercase tracking-tight">OBE Syllabus Setup</h2>
                    <p class="text-green-200 text-xs">
                        {{ activeSubject ? activeSubject.subjcode : 'No Subject Selected' }} |
                        Section: {{ activeSubject ? (activeSubject.section || activeSubject.sect) : 'N/A' }}
                    </p>
                </div>
                <button @click="$emit('close')"
                    class="text-white hover:bg-green-700 rounded-full p-2 transition-colors">
                    <span class="text-2xl">✕</span>
                </button>
            </div>

            <div class="p-4 md:p-8 overflow-y-auto flex-1 bg-gray-50/30">
                <div
                    class="mb-8 p-4 bg-blue-50 rounded-xl flex flex-col lg:flex-row items-start lg:items-center justify-between border border-blue-200 gap-4">
                    <div class="flex flex-col w-full lg:w-auto">
                        <span class="text-[10px] font-black text-blue-700 uppercase mb-2 tracking-widest">System
                            Utility: Add Assessment Type</span>
                        <div class="flex gap-3">
                            <input v-model="newType.name" placeholder="Name (e.g. Field Trip)"
                                class="text-sm p-2.5 border rounded-lg bg-white flex-1 lg:w-64 focus:ring-2 focus:ring-blue-400 outline-none" />
                            <input v-model="newType.code" placeholder="Code"
                                class="text-sm p-2.5 border rounded-lg bg-white w-24 uppercase focus:ring-2 focus:ring-blue-400 outline-none" />
                        </div>
                    </div>
                    <button @click="addNewAssessmentType"
                        class="w-full lg:w-auto bg-blue-600 text-white text-sm px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95">
                        + Register Type
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div class="lg:col-span-5 flex flex-col">
                        <div class="flex justify-between items-center mb-6">
                            <h4
                                class="font-black text-gray-800 uppercase text-sm tracking-widest border-l-4 border-green-600 pl-3">
                                1. Course Outcomes</h4>
                            <button @click="addCO"
                                class="bg-green-100 text-green-700 px-3 py-1.5 rounded-md text-xs font-black hover:bg-green-200 transition-colors uppercase">
                                + Add Outcome
                            </button>
                        </div>

                        <div class="space-y-6">
                            <div v-for="(co, idx) in localOutcomes" :key="'co-card-' + idx"
                                class="p-5 bg-white rounded-xl border border-gray-200 shadow-sm relative transition-all hover:shadow-md hover:border-green-400">
                                <button @click="removeCO(idx)"
                                    class="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-7 h-7 flex items-center justify-center transition-colors">✕</button>

                                <div class="mb-4">
                                    <label
                                        class="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-tighter">Outcome
                                        Code</label>
                                    <input v-model="co.co_code" placeholder="e.g., CO1"
                                        class="font-black text-lg w-full bg-transparent border-b-2 border-gray-100 focus:border-green-600 outline-none uppercase transition-colors" />
                                </div>

                                <div>
                                    <label
                                        class="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-tighter">Syllabus
                                        Description</label>
                                    <textarea v-model="co.description" placeholder="Describe the course outcome..."
                                        rows="3"
                                        class="text-sm w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none resize-none"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-7 flex flex-col">
                        <div class="flex justify-between items-center mb-6">
                            <h4
                                class="font-black text-gray-800 uppercase text-sm tracking-widest border-l-4 border-blue-600 pl-3">
                                2. Weight Matrix (TOS)</h4>
                            <button @click="addWeight"
                                class="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-xs font-black hover:bg-blue-200 transition-colors uppercase">
                                + Add Row
                            </button>
                        </div>

                        <div class="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr
                                        class="bg-gray-50 text-gray-400 border-b text-[10px] uppercase font-black tracking-widest">
                                        <th class="p-4 text-left">Outcome</th>
                                        <th class="p-4 text-left">Assessment Type</th>
                                        <th class="p-4 text-right">Weight %</th>
                                        <th class="p-4 text-center w-10">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="(w, idx) in localWeights" :key="'tos-row-' + idx"
                                        class="hover:bg-blue-50/30 transition-colors">
                                        <td class="p-4">
                                            <select v-model="w.co_code"
                                                class="bg-transparent font-bold text-gray-700 outline-none cursor-pointer">
                                                <option v-for="(co, coIdx) in localOutcomes" :key="'sel-co-' + coIdx"
                                                    :value="co.co_code">{{ co.co_code }}</option>
                                            </select>
                                        </td>
                                        <td class="p-4">
                                            <select v-model="w.type_id"
                                                class="bg-transparent w-full text-gray-600 outline-none cursor-pointer">
                                                <option v-for="type in assessmentTypes"
                                                    :key="'sel-type-' + type.type_id" :value="type.type_id">
                                                    [{{ type.code }}] {{ type.name }}
                                                </option>
                                            </select>
                                        </td>
                                        <td class="p-4 text-right">
                                            <div class="flex items-center justify-end gap-1">
                                                <input type="number" v-model.number="w.percentage"
                                                    class="w-16 text-right font-black text-green-700 bg-green-50/50 rounded p-1.5 focus:ring-2 focus:ring-green-400 outline-none" />
                                                <span class="text-gray-400 font-bold">%</span>
                                            </div>
                                        </td>
                                        <td class="p-4 text-center">
                                            <button @click="removeWeight(idx)"
                                                class="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                title="Remove weight row">✕</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-8 p-6 bg-white rounded-xl border-2 border-dashed flex justify-between items-center transition-colors"
                            :class="totalWeight === 100 ? 'border-green-200 bg-green-50/20' : 'border-red-200 bg-red-50/20'">
                            <div>
                                <span
                                    class="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Validation
                                    Status</span>
                                <span class="text-sm font-bold text-gray-600">Total Calculated Weight</span>
                            </div>
                            <span
                                :class="['text-3xl font-black', totalWeight === 100 ? 'text-green-600' : 'text-red-600']">{{
                                    totalWeight }}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-50 px-8 py-5 flex justify-end gap-4 border-t shrink-0">
                <button @click="$emit('close')"
                    class="px-6 py-2.5 text-sm font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">Cancel</button>
                <button @click="submitSyllabus" :disabled="totalWeight !== 100"
                    class="px-10 py-2.5 bg-green-800 text-white rounded-lg font-black text-sm shadow-lg hover:bg-green-900 disabled:opacity-30 transition-all uppercase tracking-widest">
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
                await this.fetchTypes()
                await this.loadExistingSyllabus()
            }
        },
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
                alert('Total weight must equal 100% before saving.')
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
</style>