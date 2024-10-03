<template>
  <div class="country-info">
    <nuxt-link to="/">Home</nuxt-link>
    <h3>Country</h3>
    <div class="holiday-info" v-for="publicHoliday in publicHolidays" :key="publicHoliday.name">
      <span>{{ publicHoliday.name }}</span>
      <span>{{ publicHoliday.date }}</span>
    </div>
    <div class="buttons-year-list">
      <div v-for="year in yearRange" :key="year">
      <button @click="fetchPublicHolidays(year)">{{ year }}</button>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'

interface PublicHoliday {
  name: string;
  date: string;
}

export default Vue.extend({
  name: 'CountryDetails',
  // eslint-disable-next-line require-await
  async asyncData({ params }: Context) {
    const countryCode = params.countryCode

    return {
      countryCode,
    }
  },
  data() {
    return {
      publicHolidays: [] as PublicHoliday[], 
      countryCode: '' as string,
      startRange: 2020 as number,
      finishRange: 2030 as number,
    }
  },
  computed: {
    yearRange(): number[] {
      const years: number[] = []
      for (let year = this.startRange; year <= this.finishRange; year++) {
        years.push(year)
      }
      return years
    },
  },
  async mounted() {
    try {
      const currentYear = new Date().getFullYear()
      const publicHolidays = await this.$axios.$get(
        `${process.env.PUBLIC_HOLIDAYS}/${currentYear}/${this.countryCode}`
      ) as PublicHoliday[];
      this.publicHolidays = publicHolidays
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  },
  methods: {
    async fetchPublicHolidays(year: number) {
      try {
        const publicHolidays = await this.$axios.$get(
          `${process.env.PUBLIC_HOLIDAYS}/${year}/${this.countryCode}`
        ) as PublicHoliday[];
        this.publicHolidays = publicHolidays
      } catch (error) {
        console.error('Error fetching public holidays:', error)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.holiday-info {
  width: 50%;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  padding: 5px;
}
.country-info {
  width: 96%;
  margin: 0 auto;
  padding-top: 50px;
}
.buttons-year-list {
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding-top: 25px;
  button {
    border: 1px solid black;
    padding: 5px;
    &:hover {
      border: 5px solid black;
    }
  }
}
</style>