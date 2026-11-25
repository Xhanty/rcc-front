<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface PollOption {
  id: number
  label: string
  votes_count: number
  percentage: number
}

interface CommunityPoll {
  id: number
  tag: string
  question: string
  closing_label: string | null
  closes_at: string | null
  total_votes: number
  has_voted: boolean
  voted_option_id: number | null
  requires_registration: boolean
  options: PollOption[]
}

interface RegistrationState {
  document: string
  name: string
  email: string
  phone: string
  birth_date: string
  accepted_terms: boolean
  isLookingUp: boolean
  lookupDone: boolean
  exists: boolean
  alreadyRegistered: boolean
  alreadyVotedOptionId: number | null
  missingFields: string[]
  lookupError: string
}

const VOTER_TOKEN_KEY = 'rcc_voter_token'

const polls = ref<CommunityPoll[]>([])
const isLoading = ref(true)
const hasError = ref(false)

// Per-poll UI state
const draftSelection = ref<Record<number, number>>({})
const submittingPollId = ref<number | null>(null)
const pollFeedback = ref<Record<number, { type: 'error' | 'info'; message: string }>>({})
const regStates = ref<Record<number, RegistrationState>>({})

const createDefaultRegState = (): RegistrationState => ({
  document: '',
  name: '',
  email: '',
  phone: '',
  birth_date: '',
  accepted_terms: false,
  isLookingUp: false,
  lookupDone: false,
  exists: false,
  alreadyRegistered: false,
  alreadyVotedOptionId: null,
  missingFields: [],
  lookupError: ''
})

const getRegState = (pollId: number): RegistrationState => {
  if (!regStates.value[pollId]) {
    regStates.value[pollId] = createDefaultRegState()
  }
  return regStates.value[pollId]!
}

const openTermsModal = () => {
  window.dispatchEvent(new CustomEvent('open-terms-modal'))
}

const getOrCreateVoterToken = (): string => {
  try {
    const existing = localStorage.getItem(VOTER_TOKEN_KEY)
    if (existing) return existing

    const generated =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0
            const v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
          })

    localStorage.setItem(VOTER_TOKEN_KEY, generated)
    return generated
  } catch {
    return `rcc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }
}

const getBrowserFingerprint = (): string => {
  try {
    const ua = navigator.userAgent || ''
    const lang = navigator.language || ''
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    const screenSize =
      typeof window !== 'undefined' && window.screen
        ? `${window.screen.width}x${window.screen.height}`
        : ''
    return `${ua}|${lang}|${tz}|${screenSize}`
  } catch {
    return ''
  }
}

const voterToken = ref('')
const voterFingerprint = ref('')

const mapPoll = (raw: any): CommunityPoll => ({
  id: raw.id,
  tag: raw.tag || 'Comunidad',
  question: raw.question || '',
  closing_label: raw.closing_label || null,
  closes_at: raw.closes_at || null,
  total_votes: Number(raw.total_votes ?? 0),
  has_voted: Boolean(raw.has_voted),
  voted_option_id: raw.voted_option_id ?? null,
  requires_registration: Boolean(raw.requires_registration),
  options: Array.isArray(raw.options)
    ? raw.options.map((opt: any) => ({
        id: opt.id,
        label: opt.label || '',
        votes_count: Number(opt.votes_count ?? 0),
        percentage: Number(opt.percentage ?? 0)
      }))
    : []
})

const fetchPolls = async (silent = false) => {
  if (!silent) {
    isLoading.value = true
  }
  hasError.value = false

  try {
    const url = `${import.meta.env.VITE_API_URL}configuration/polls`
    const key = import.meta.env.VITE_API_KEY

    if (!url || !key) {
      throw new Error('API config is missing')
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-API-KEY': key,
      'X-VOTER-TOKEN': voterToken.value
    }
    if (voterFingerprint.value) {
      headers['X-VOTER-FINGERPRINT'] = voterFingerprint.value
    }

    const response = await fetch(url, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch polls (${response.status})`)
    }

    const resJson = await response.json()
    const rawList = Array.isArray(resJson) ? resJson : resJson.data || []
    polls.value = rawList.map(mapPoll)
    polls.value.forEach((p) => {
      if (p.requires_registration && !regStates.value[p.id]) {
        regStates.value[p.id] = createDefaultRegState()
      }
    })
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching polls:', error)
    hasError.value = true
    if (!silent) {
      polls.value = []
      isLoading.value = false
    }
  }
}

onMounted(() => {
  voterToken.value = getOrCreateVoterToken()
  voterFingerprint.value = getBrowserFingerprint()
  fetchPolls()
})

const selectOption = (poll: CommunityPoll, optionId: number) => {
  if (poll.has_voted || submittingPollId.value === poll.id) return
  draftSelection.value = { ...draftSelection.value, [poll.id]: optionId }
  if (pollFeedback.value[poll.id]) {
    const next = { ...pollFeedback.value }
    delete next[poll.id]
    pollFeedback.value = next
  }
}

const getOptionLabelById = (poll: CommunityPoll, optionId: number | null): string | null => {
  if (!optionId) return null
  return poll.options.find((opt) => opt.id === optionId)?.label || null
}

const getVotedOptionLabel = (poll: CommunityPoll): string | null =>
  getOptionLabelById(poll, poll.voted_option_id)

const handleDocumentInput = (pollId: number) => {
  const reg = getRegState(pollId)
  if (reg.lookupDone || reg.alreadyRegistered || reg.lookupError) {
    reg.lookupDone = false
    reg.exists = false
    reg.alreadyRegistered = false
    reg.alreadyVotedOptionId = null
    reg.missingFields = []
    reg.lookupError = ''
  }
}

const lookupAssistant = async (poll: CommunityPoll) => {
  const reg = getRegState(poll.id)
  const doc = reg.document.trim()
  if (!doc) {
    reg.lookupError = 'Ingresa tu número de documento para continuar.'
    return
  }

  reg.isLookingUp = true
  reg.lookupError = ''

  try {
    const url = `${import.meta.env.VITE_API_URL}polls/lookup-assistant?document=${encodeURIComponent(doc)}&poll_id=${poll.id}`
    const key = import.meta.env.VITE_API_KEY
    if (!url || !key) throw new Error('API config is missing')

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': key
      }
    })

    const resJson = await response.json()
    if (!response.ok) {
      throw new Error(resJson?.message || 'No se pudo consultar el documento.')
    }

    const data = resJson?.data ?? resJson
    reg.lookupDone = true
    reg.exists = Boolean(data?.exists)
    reg.alreadyRegistered = Boolean(data?.already_registered)
    reg.alreadyVotedOptionId = data?.voted_option_id ?? null

    if (reg.exists && data?.assistant) {
      reg.name = data.assistant.name || ''
      reg.email = data.assistant.email || ''
      reg.phone = data.assistant.phone || ''
      reg.birth_date = data.assistant.birth_date || ''
      reg.missingFields = Array.isArray(data.assistant.missing_fields)
        ? data.assistant.missing_fields
        : []
    } else {
      reg.name = ''
      reg.email = ''
      reg.phone = ''
      reg.birth_date = ''
      reg.missingFields = []
    }
  } catch (error: any) {
    console.error('Error looking up assistant:', error)
    reg.lookupError = error.message || 'Error al consultar tu documento. Inténtalo de nuevo.'
  } finally {
    reg.isLookingUp = false
  }
}

const isMissingField = (pollId: number, field: string): boolean => {
  const reg = getRegState(pollId)
  return reg.missingFields.includes(field)
}

const canSubmitRegistration = (poll: CommunityPoll): boolean => {
  const reg = getRegState(poll.id)
  if (poll.options.length > 0 && !draftSelection.value[poll.id]) return false
  if (submittingPollId.value === poll.id) return false
  if (!reg.lookupDone || reg.alreadyRegistered) return false
  return Boolean(
    reg.document.trim() &&
      reg.name.trim() &&
      reg.email.trim() &&
      reg.phone.trim() &&
      reg.accepted_terms
  )
}

const submitRegistration = async (poll: CommunityPoll) => {
  if (poll.has_voted || submittingPollId.value !== null) return
  const chosenId = draftSelection.value[poll.id] ?? null
  const reg = getRegState(poll.id)

  if (poll.options.length > 0 && !chosenId) {
    pollFeedback.value = {
      ...pollFeedback.value,
      [poll.id]: { type: 'error', message: 'Por favor selecciona una opción antes de confirmar.' }
    }
    return
  }

  if (!reg.document.trim() || !reg.name.trim() || !reg.email.trim() || !reg.phone.trim()) {
    pollFeedback.value = {
      ...pollFeedback.value,
      [poll.id]: {
        type: 'error',
        message: 'Documento, nombre completo, correo y teléfono son obligatorios.'
      }
    }
    return
  }

  if (!reg.accepted_terms) {
    pollFeedback.value = {
      ...pollFeedback.value,
      [poll.id]: {
        type: 'error',
        message: 'Debes aceptar los Términos, Condiciones y Política de Datos (Ley 1581 de 2012).'
      }
    }
    return
  }

  submittingPollId.value = poll.id
  const nextFeedback = { ...pollFeedback.value }
  delete nextFeedback[poll.id]
  pollFeedback.value = nextFeedback

  try {
    const url = `${import.meta.env.VITE_API_URL}polls/${poll.id}/register`
    const key = import.meta.env.VITE_API_KEY
    if (!url || !key) throw new Error('API config is missing')

    const payload: Record<string, any> = {
      document: reg.document.trim(),
      name: reg.name.trim(),
      email: reg.email.trim(),
      phone: reg.phone.trim(),
      birth_date: reg.birth_date || null,
      accepted_terms: true,
      terms_version: '2026-v1',
      voter_token: voterToken.value,
      fingerprint: voterFingerprint.value
    }

    if (chosenId) {
      payload.option_id = chosenId
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': key
      },
      body: JSON.stringify(payload)
    })

    let resJson: any = null
    try {
      resJson = await response.json()
    } catch {
      resJson = null
    }

    if (response.status === 201 || response.ok) {
      const idx = polls.value.findIndex((p) => p.id === poll.id)
      if (idx !== -1 && polls.value[idx]) {
        const updated = resJson?.data?.id ? mapPoll(resJson.data) : null
        polls.value[idx] = updated || {
          ...polls.value[idx],
          has_voted: true,
          voted_option_id: chosenId
        }
      }
      return
    }

    if (response.status === 409) {
      reg.alreadyRegistered = true
      pollFeedback.value = {
        ...pollFeedback.value,
        [poll.id]: {
          type: 'info',
          message: resJson?.message || 'Este documento ya se encuentra inscrito en esta actividad.'
        }
      }
      return
    }

    if (response.status === 422) {
      const errorMsgs = resJson?.errors
        ? Object.values(resJson.errors).flat().join(' ')
        : resJson?.message
      pollFeedback.value = {
        ...pollFeedback.value,
        [poll.id]: {
          type: 'error',
          message: errorMsgs || 'Revisa los datos ingresados e inténtalo de nuevo.'
        }
      }
      return
    }

    if (response.status === 429) {
      pollFeedback.value = {
        ...pollFeedback.value,
        [poll.id]: {
          type: 'error',
          message: 'Demasiados intentos en poco tiempo. Espera un momento e inténtalo de nuevo.'
        }
      }
      return
    }

    throw new Error(resJson?.message || 'No se pudo completar la inscripción. Inténtalo de nuevo.')
  } catch (error: any) {
    console.error('Error submitting poll registration:', error)
    pollFeedback.value = {
      ...pollFeedback.value,
      [poll.id]: {
        type: 'error',
        message: error.message || 'Error de conexión al registrar tu inscripción.'
      }
    }
  } finally {
    submittingPollId.value = null
  }
}

const submitVote = async (poll: CommunityPoll) => {
  if (poll.requires_registration) {
    await submitRegistration(poll)
    return
  }

  if (poll.has_voted || submittingPollId.value !== null) return
  const chosenId = draftSelection.value[poll.id]
  if (!chosenId) return

  submittingPollId.value = poll.id
  const nextFeedback = { ...pollFeedback.value }
  delete nextFeedback[poll.id]
  pollFeedback.value = nextFeedback

  try {
    const url = `${import.meta.env.VITE_API_URL}polls/${poll.id}/vote`
    const key = import.meta.env.VITE_API_KEY

    if (!url || !key) {
      throw new Error('API config is missing')
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': key
      },
      body: JSON.stringify({
        option_id: chosenId,
        voter_token: voterToken.value,
        fingerprint: voterFingerprint.value
      })
    })

    let resJson: any = null
    try {
      resJson = await response.json()
    } catch {
      resJson = null
    }

    if (response.status === 201 || response.ok) {
      const updated = resJson?.data ? mapPoll(resJson.data) : null
      if (updated) {
        const idx = polls.value.findIndex((p) => p.id === poll.id)
        if (idx !== -1) {
          polls.value[idx] = updated
        }
      } else {
        await fetchPolls(true)
      }
      return
    }

    if (response.status === 409) {
      pollFeedback.value = {
        ...pollFeedback.value,
        [poll.id]: {
          type: 'info',
          message: resJson?.message || 'Ya registraste tu voto en esta encuesta.'
        }
      }
      const idx = polls.value.findIndex((p) => p.id === poll.id)
      if (idx !== -1 && polls.value[idx]) {
        polls.value[idx] = { ...polls.value[idx], has_voted: true }
      }
      await fetchPolls(true)
      return
    }

    if (response.status === 422) {
      pollFeedback.value = {
        ...pollFeedback.value,
        [poll.id]: {
          type: 'error',
          message: resJson?.message || 'Esta encuesta ya cerró o la opción no es válida.'
        }
      }
      return
    }

    if (response.status === 429) {
      pollFeedback.value = {
        ...pollFeedback.value,
        [poll.id]: {
          type: 'error',
          message: 'Demasiados intentos en poco tiempo. Espera un momento e inténtalo de nuevo.'
        }
      }
      return
    }

    throw new Error(resJson?.message || 'No se pudo registrar tu voto. Inténtalo de nuevo.')
  } catch (error: any) {
    console.error('Error submitting vote:', error)
    pollFeedback.value = {
      ...pollFeedback.value,
      [poll.id]: {
        type: 'error',
        message: error.message || 'Error de conexión al registrar tu voto.'
      }
    }
  } finally {
    submittingPollId.value = null
  }
}
</script>

<template>
  <section
    id="encuestas"
    class="bg-[#fcf9f8] px-6 lg:px-12 pt-6 sm:pt-10 pb-16 relative z-20 font-jakarta scroll-mt-24"
  >
    <div class="max-w-7xl mx-auto">
      <div
        class="bg-[#eaf2f1] rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-[#1b4d4f]/15 shadow-xl shadow-[#1b4d4f]/10"
      >
        <!-- Section Header -->
        <div
          class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-8 border-b border-[#1b4d4f]/15"
        >
          <div>
            <div class="inline-flex items-center gap-2 text-[#007681] mb-2">
              <span class="material-symbols-outlined text-xl">how_to_vote</span>
              <span class="font-headline text-xs font-extrabold uppercase tracking-widest">
                Voz de la Comunidad • Participación Activa
              </span>
            </div>
            <h2
              class="font-headline text-2xl sm:text-4xl font-black text-[#1b4d4f] uppercase tracking-tight"
            >
              Encuestas <span class="text-[#d49e35]">Comunitarias</span>
            </h2>
            <p class="text-sm sm:text-base text-[#404848] mt-1.5 max-w-2xl">
              Tu opinión nos ayuda a discernir y preparar juntos los próximos espacios de fe,
              formación y fraternidad.
            </p>
          </div>

          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-[9999px] bg-white border border-[#1b4d4f]/15 text-[#1b4d4f] font-headline text-[11px] font-extrabold uppercase tracking-wider shadow-sm self-start md:self-auto shrink-0"
          >
            <span class="material-symbols-outlined text-base text-[#d49e35]">verified_user</span>
            <span>Participación única por persona</span>
          </div>
        </div>

        <!-- Loading Skeletons -->
        <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 animate-pulse">
          <div
            v-for="n in 2"
            :key="n"
            class="bg-white rounded-3xl p-6 sm:p-8 border border-[#1b4d4f]/10 space-y-5"
          >
            <div class="flex justify-between">
              <div class="h-6 w-32 bg-[#1b4d4f]/10 rounded-[9999px]"></div>
              <div class="h-5 w-28 bg-[#1b4d4f]/10 rounded"></div>
            </div>
            <div class="h-7 w-5/6 bg-[#1b4d4f]/10 rounded-lg"></div>
            <div class="space-y-3">
              <div class="h-14 w-full bg-[#1b4d4f]/10 rounded-2xl"></div>
              <div class="h-14 w-full bg-[#1b4d4f]/10 rounded-2xl"></div>
              <div class="h-14 w-full bg-[#1b4d4f]/10 rounded-2xl"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="hasError"
          class="bg-white rounded-3xl p-10 text-center border border-[#1b4d4f]/10 max-w-xl mx-auto space-y-4"
        >
          <span class="material-symbols-outlined text-5xl text-[#d49e35]">cloud_off</span>
          <h3 class="font-headline text-xl font-extrabold text-[#1b4d4f]">
            No pudimos cargar las encuestas
          </h3>
          <p class="text-sm text-[#404848]">
            Ocurrió un problema al consultar las encuestas activas. Inténtalo de nuevo.
          </p>
          <button
            type="button"
            @click="fetchPolls()"
            class="px-7 py-3 rounded-[9999px] bg-[#1b4d4f] hover:bg-[#007681] text-white font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer"
          >
            Reintentar
          </button>
        </div>

        <!-- Polls Grid -->
        <div
          v-else-if="polls.length > 0"
          :class="[
            'grid grid-cols-1 gap-6 sm:gap-8 items-start',
            polls.length === 1 ? 'max-w-2xl mx-auto' : 'lg:grid-cols-2'
          ]"
        >
          <article
            v-for="(poll, pIdx) in polls"
            :key="poll.id"
            v-reveal="{ direction: 'up', delay: 60 + pIdx * 80 }"
            class="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#1b4d4f]/10 flex flex-col justify-between gap-6"
          >
            <div class="space-y-5">
              <!-- Poll Meta -->
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="px-3.5 py-1 rounded-[9999px] bg-[#eaf2f1] text-[#007681] font-headline text-[11px] font-extrabold uppercase tracking-wider"
                  >
                    {{ poll.tag }}
                  </span>
                  <span
                    v-if="poll.requires_registration"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-[9999px] bg-[#d49e35]/15 text-[#9a6e17] border border-[#d49e35]/35 font-headline text-[10px] font-extrabold uppercase tracking-wider"
                  >
                    <span class="material-symbols-outlined text-xs">assignment_ind</span>
                    <span>Con Inscripción</span>
                  </span>
                </div>
                <span
                  v-if="poll.closing_label"
                  class="text-xs font-semibold text-[#404848] flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-sm text-[#d49e35]">schedule</span>
                  {{ poll.closing_label }}
                </span>
              </div>

              <!-- Poll Question -->
              <h3 class="font-headline text-xl sm:text-2xl font-extrabold text-[#1b4d4f] leading-snug">
                {{ poll.question }}
              </h3>

              <!-- Voting / Registration Options (when not yet voted) -->
              <div v-if="!poll.has_voted" class="space-y-5">
                <div v-if="poll.options.length > 0" class="space-y-3">
                  <button
                    v-for="option in poll.options"
                    :key="option.id"
                    type="button"
                    :disabled="submittingPollId === poll.id"
                    @click="selectOption(poll, option.id)"
                    :class="[
                      'w-full text-left rounded-2xl p-4 border-2 smooth-transition',
                      draftSelection[poll.id] === option.id
                        ? 'border-[#1b4d4f] bg-[#eaf2f1]/70 shadow-sm cursor-pointer'
                        : 'border-[#eaf2f1] hover:border-[#1b4d4f]/40 hover:bg-[#f6f9f8] cursor-pointer'
                    ]"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <span
                        :class="[
                          'w-5 h-5 rounded-[9999px] border-2 flex items-center justify-center shrink-0 smooth-transition',
                          draftSelection[poll.id] === option.id
                            ? 'border-[#1b4d4f] bg-[#1b4d4f] text-white'
                            : 'border-[#1b4d4f]/35 bg-white'
                        ]"
                      >
                        <span
                          v-if="draftSelection[poll.id] === option.id"
                          class="material-symbols-outlined text-[13px] font-bold"
                        >
                          check
                        </span>
                      </span>

                      <span class="text-sm sm:text-base font-semibold text-[#1c2424] leading-snug">
                        {{ option.label }}
                      </span>
                    </div>
                  </button>
                </div>

                <!-- REGISTRATION FLOW (only when poll.requires_registration === true) -->
                <div
                  v-if="poll.requires_registration"
                  class="rounded-2xl bg-[#f6f9f8] border border-[#1b4d4f]/15 p-5 space-y-4"
                >
                  <div class="flex items-center gap-2 text-[#1b4d4f]">
                    <span class="material-symbols-outlined text-lg text-[#d49e35]">badge</span>
                    <span class="font-headline text-xs font-extrabold uppercase tracking-wider">
                      Datos de Inscripción
                    </span>
                  </div>

                  <!-- Step 1: Document Lookup -->
                  <div class="space-y-1.5">
                    <label
                      :for="`poll-doc-${poll.id}`"
                      class="block font-headline text-[11px] font-bold uppercase tracking-wider text-[#1b4d4f]"
                    >
                      Número de Documento <span class="text-[#ba1a1a]">*</span>
                    </label>
                    <div class="flex gap-2">
                      <input
                        :id="`poll-doc-${poll.id}`"
                        v-model="getRegState(poll.id).document"
                        @input="handleDocumentInput(poll.id)"
                        @keydown.enter.prevent="lookupAssistant(poll)"
                        type="text"
                        inputmode="numeric"
                        placeholder="Ej. 32509689"
                        class="flex-1 min-w-0 bg-white border border-[#1b4d4f]/20 focus:border-[#1b4d4f] rounded-xl px-3.5 py-2.5 text-sm text-[#1c2424] placeholder:text-[#707979] focus:outline-none smooth-transition"
                      />
                      <button
                        type="button"
                        @click="lookupAssistant(poll)"
                        :disabled="getRegState(poll.id).isLookingUp || !getRegState(poll.id).document.trim()"
                        class="px-4 py-2.5 rounded-xl bg-[#1b4d4f] hover:bg-[#007681] text-white font-headline text-[11px] font-extrabold uppercase tracking-wider smooth-transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                      >
                        <span
                          v-if="getRegState(poll.id).isLookingUp"
                          class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-[9999px] animate-spin"
                        ></span>
                        <span v-else class="material-symbols-outlined text-sm">search</span>
                        <span>{{ getRegState(poll.id).isLookingUp ? 'Buscando' : 'Validar' }}</span>
                      </button>
                    </div>
                    <p
                      v-if="getRegState(poll.id).lookupError"
                      class="text-xs font-semibold text-[#ba1a1a] pt-1"
                    >
                      {{ getRegState(poll.id).lookupError }}
                    </p>
                  </div>

                  <!-- Already Registered Notice -->
                  <div
                    v-if="getRegState(poll.id).lookupDone && getRegState(poll.id).alreadyRegistered"
                    class="p-4 rounded-xl bg-[#eaf2f1] border border-[#007681]/30 text-[#1b4d4f] space-y-1.5"
                  >
                    <div class="flex items-center gap-2 font-headline text-xs font-extrabold uppercase tracking-wider text-[#007681]">
                      <span class="material-symbols-outlined text-base">check_circle</span>
                      <span>Documento ya registrado</span>
                    </div>
                    <p class="text-xs sm:text-sm text-[#323a3a]">
                      Ya confirmaste tu inscripción con este documento en esta actividad.
                      <template v-if="getOptionLabelById(poll, getRegState(poll.id).alreadyVotedOptionId)">
                        Opción elegida:
                        <strong>{{ getOptionLabelById(poll, getRegState(poll.id).alreadyVotedOptionId) }}</strong>.
                      </template>
                    </p>
                  </div>

                  <!-- Step 2: Assistant Fields (shown after lookup when not already registered) -->
                  <div
                    v-else-if="getRegState(poll.id).lookupDone"
                    class="space-y-3.5 pt-2 border-t border-[#1b4d4f]/10"
                  >
                    <!-- Lookup Status Banner -->
                    <div
                      v-if="getRegState(poll.id).exists"
                      class="p-3 rounded-xl bg-[#eaf2f1] border border-[#007681]/20 text-xs text-[#1b4d4f] flex items-start gap-2"
                    >
                      <span class="material-symbols-outlined text-base text-[#007681] shrink-0">
                        verified
                      </span>
                      <span>
                        <strong>¡Hola, {{ getRegState(poll.id).name || 'hermano(a)' }}!</strong>
                        Encontramos tu ficha. Verifica tus datos
                        <template v-if="getRegState(poll.id).missingFields.length > 0">
                          y completa los campos marcados en dorado.
                        </template>
                        <template v-else>para confirmar tu inscripción.</template>
                      </span>
                    </div>
                    <div
                      v-else
                      class="p-3 rounded-xl bg-[#d49e35]/10 border border-[#d49e35]/30 text-xs text-[#7a5510] flex items-start gap-2"
                    >
                      <span class="material-symbols-outlined text-base text-[#d49e35] shrink-0">
                        person_add
                      </span>
                      <span>
                        No encontramos este documento registrado aún. Completa tus datos para
                        inscribirte.
                      </span>
                    </div>

                    <!-- Name -->
                    <div class="space-y-1">
                      <label
                        :for="`poll-name-${poll.id}`"
                        class="flex items-center justify-between font-headline text-[11px] font-bold uppercase tracking-wider text-[#1b4d4f]"
                      >
                        <span>Nombre Completo <span class="text-[#ba1a1a]">*</span></span>
                        <span
                          v-if="isMissingField(poll.id, 'name')"
                          class="text-[10px] text-[#b58122] font-extrabold"
                        >
                          Por completar
                        </span>
                      </label>
                      <input
                        :id="`poll-name-${poll.id}`"
                        v-model="getRegState(poll.id).name"
                        type="text"
                        required
                        placeholder="Ej. María García"
                        :class="[
                          'w-full bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#1c2424] placeholder:text-[#707979] focus:outline-none smooth-transition border',
                          isMissingField(poll.id, 'name') && !getRegState(poll.id).name.trim()
                            ? 'border-[#d49e35] ring-2 ring-[#d49e35]/20'
                            : 'border-[#1b4d4f]/20 focus:border-[#1b4d4f]'
                        ]"
                      />
                    </div>

                    <!-- Email & Phone -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div class="space-y-1">
                        <label
                          :for="`poll-email-${poll.id}`"
                          class="flex items-center justify-between font-headline text-[11px] font-bold uppercase tracking-wider text-[#1b4d4f]"
                        >
                          <span>Correo <span class="text-[#ba1a1a]">*</span></span>
                          <span
                            v-if="isMissingField(poll.id, 'email')"
                            class="text-[10px] text-[#b58122] font-extrabold"
                          >
                            Por completar
                          </span>
                        </label>
                        <input
                          :id="`poll-email-${poll.id}`"
                          v-model="getRegState(poll.id).email"
                          type="email"
                          required
                          placeholder="correo@ejemplo.com"
                          :class="[
                            'w-full bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#1c2424] placeholder:text-[#707979] focus:outline-none smooth-transition border',
                            isMissingField(poll.id, 'email') && !getRegState(poll.id).email.trim()
                              ? 'border-[#d49e35] ring-2 ring-[#d49e35]/20'
                              : 'border-[#1b4d4f]/20 focus:border-[#1b4d4f]'
                          ]"
                        />
                      </div>

                      <div class="space-y-1">
                        <label
                          :for="`poll-phone-${poll.id}`"
                          class="flex items-center justify-between font-headline text-[11px] font-bold uppercase tracking-wider text-[#1b4d4f]"
                        >
                          <span>Teléfono <span class="text-[#ba1a1a]">*</span></span>
                          <span
                            v-if="isMissingField(poll.id, 'phone')"
                            class="text-[10px] text-[#b58122] font-extrabold"
                          >
                            Por completar
                          </span>
                        </label>
                        <input
                          :id="`poll-phone-${poll.id}`"
                          v-model="getRegState(poll.id).phone"
                          type="tel"
                          required
                          placeholder="Ej. 3103748739"
                          :class="[
                            'w-full bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#1c2424] placeholder:text-[#707979] focus:outline-none smooth-transition border',
                            isMissingField(poll.id, 'phone') && !getRegState(poll.id).phone.trim()
                              ? 'border-[#d49e35] ring-2 ring-[#d49e35]/20'
                              : 'border-[#1b4d4f]/20 focus:border-[#1b4d4f]'
                          ]"
                        />
                      </div>
                    </div>

                    <!-- Birth Date (Optional) -->
                    <div class="space-y-1">
                      <label
                        :for="`poll-birth-${poll.id}`"
                        class="flex items-center justify-between font-headline text-[11px] font-bold uppercase tracking-wider text-[#1b4d4f]"
                      >
                        <span>Fecha de Nacimiento (Opcional)</span>
                        <span
                          v-if="isMissingField(poll.id, 'birth_date')"
                          class="text-[10px] text-[#b58122] font-extrabold"
                        >
                          Por completar
                        </span>
                      </label>
                      <input
                        :id="`poll-birth-${poll.id}`"
                        v-model="getRegState(poll.id).birth_date"
                        type="date"
                        class="w-full bg-white border border-[#1b4d4f]/20 focus:border-[#1b4d4f] rounded-xl px-3.5 py-2.5 text-sm text-[#1c2424] focus:outline-none smooth-transition"
                      />
                    </div>

                    <!-- Mandatory Habeas Data Checkbox (Ley 1581 de 2012) -->
                    <label
                      class="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#1b4d4f]/20 cursor-pointer select-none smooth-transition hover:border-[#1b4d4f]/40"
                    >
                      <input
                        v-model="getRegState(poll.id).accepted_terms"
                        type="checkbox"
                        class="mt-0.5 w-4 h-4 rounded border-[#1b4d4f]/40 text-[#1b4d4f] focus:ring-[#1b4d4f] cursor-pointer shrink-0 accent-[#1b4d4f]"
                      />
                      <span class="text-xs text-[#323a3a] leading-relaxed">
                        Autorizo el tratamiento de mis datos personales y acepto los
                        <button
                          type="button"
                          @click.stop.prevent="openTermsModal"
                          class="text-[#007681] hover:text-[#1b4d4f] font-bold underline underline-offset-2 cursor-pointer"
                        >
                          Términos, Condiciones y Política de Datos
                        </button>
                        (Ley 1581 de 2012). <span class="text-[#ba1a1a]">*</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Thank-You Confirmation State (when voted/registered, without showing percentages) -->
              <div
                v-else
                class="rounded-2xl bg-[#eaf2f1]/70 border border-[#1b4d4f]/15 p-6 text-center space-y-3"
              >
                <div
                  class="w-14 h-14 rounded-[9999px] bg-[#1b4d4f] text-[#d49e35] flex items-center justify-center mx-auto shadow-sm"
                >
                  <span class="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h4 class="font-headline text-lg sm:text-xl font-extrabold text-[#1b4d4f]">
                  {{ poll.requires_registration ? '¡Inscripción confirmada!' : '¡Gracias por tu voto!' }}
                </h4>
                <p class="text-sm text-[#404848] leading-relaxed max-w-md mx-auto">
                  {{
                    poll.requires_registration
                      ? 'Tus datos y confirmación de asistencia han sido registrados correctamente. ¡Te esperamos!'
                      : 'Tu respuesta ha sido registrada correctamente. Gracias por ayudarnos a construir juntos nuestra comunidad.'
                  }}
                </p>
                <div
                  v-if="getVotedOptionLabel(poll)"
                  class="inline-flex items-center gap-2 px-4 py-1.5 rounded-[9999px] bg-white border border-[#1b4d4f]/15 text-xs font-bold text-[#1b4d4f]"
                >
                  <span class="w-2 h-2 rounded-[9999px] bg-[#d49e35] shrink-0"></span>
                  <span>Tu elección: {{ getVotedOptionLabel(poll) }}</span>
                </div>
              </div>

              <!-- Inline Feedback Alert (409 / 422 / 429 / network error) -->
              <transition name="fade">
                <div
                  v-if="pollFeedback[poll.id] && !poll.has_voted"
                  :class="[
                    'p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 leading-snug',
                    pollFeedback[poll.id]?.type === 'info'
                      ? 'bg-[#eaf2f1] border border-[#1b4d4f]/15 text-[#1b4d4f]'
                      : 'bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 text-[#ba1a1a]'
                  ]"
                >
                  <span class="material-symbols-outlined text-base shrink-0">
                    {{ pollFeedback[poll.id]?.type === 'info' ? 'info' : 'error' }}
                  </span>
                  <span>{{ pollFeedback[poll.id]?.message }}</span>
                </div>
              </transition>
            </div>

            <!-- Poll Footer Action -->
            <div
              v-if="!poll.has_voted"
              class="pt-4 border-t border-[#eaf2f1] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <span class="text-xs text-[#404848] font-medium flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base text-[#007681]">lock</span>
                {{
                  poll.requires_registration
                    ? 'Registro único por número de documento.'
                    : 'Solo puedes votar una vez en esta encuesta.'
                }}
              </span>

              <button
                type="button"
                :disabled="
                  poll.requires_registration
                    ? !canSubmitRegistration(poll)
                    : !draftSelection[poll.id] || submittingPollId === poll.id
                "
                @click="submitVote(poll)"
                :class="[
                  'px-7 py-3 rounded-[9999px] font-headline text-xs font-extrabold uppercase tracking-wider smooth-transition flex items-center justify-center gap-2',
                  (
                    poll.requires_registration
                      ? canSubmitRegistration(poll)
                      : Boolean(draftSelection[poll.id]) && submittingPollId !== poll.id
                  )
                    ? 'bg-[#d49e35] hover:bg-[#b88628] text-white shadow-md active:scale-95 cursor-pointer'
                    : 'bg-[#eaf2f1] text-[#1b4d4f]/40 cursor-not-allowed'
                ]"
              >
                <span
                  v-if="submittingPollId === poll.id"
                  class="w-4 h-4 border-2 border-[#1b4d4f]/30 border-t-[#1b4d4f] rounded-[9999px] animate-spin"
                ></span>
                <span>
                  {{
                    submittingPollId === poll.id
                      ? 'Registrando...'
                      : poll.requires_registration
                        ? 'Confirmar Inscripción'
                        : 'Registrar mi voto'
                  }}
                </span>
                <span v-if="submittingPollId !== poll.id" class="material-symbols-outlined text-base">
                  {{ poll.requires_registration ? 'how_to_reg' : 'how_to_vote' }}
                </span>
              </button>
            </div>

            <div
              v-else
              class="pt-4 border-t border-[#eaf2f1] flex items-center justify-center gap-2 text-xs font-bold text-[#007681]"
            >
              <span class="material-symbols-outlined text-base">verified</span>
              <span>
                {{
                  poll.requires_registration
                    ? 'Inscripción registrada correctamente'
                    : 'Voto único registrado en esta encuesta'
                }}
              </span>
            </div>
          </article>
        </div>

        <!-- Empty State (no active open polls) -->
        <div
          v-else
          class="bg-white rounded-3xl p-10 text-center border border-[#1b4d4f]/10 max-w-xl mx-auto space-y-2"
        >
          <span class="material-symbols-outlined text-4xl text-[#007681]">how_to_vote</span>
          <h3 class="font-headline text-xl font-extrabold text-[#1b4d4f]">
            Sin encuestas activas por el momento
          </h3>
          <p class="text-sm text-[#404848]">
            Pronto abriremos nuevas encuestas comunitarias para seguir construyendo juntos.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
