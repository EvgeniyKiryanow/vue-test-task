<template>
  <div>
    <div class="section-wrapper">
      <div>
        <h2>Random Country Widget</h2>
        <div class="country-widget-wrapper">
          <ul>
            <li v-for="(country, index) in randomCountries" :key="index">
              <strong>Country Name - {{ country.name }}</strong>
              <strong>Next Holiday - {{ country.nextHoliday.name }}</strong>
              <strong
                >Next holiday date - {{ country.nextHoliday.date }}</strong
              >
            </li>
          </ul>
        </div>
      </div>
      <div>
        <input
          v-model="search"
          type="text"
          placeholder="Search for a country"
          class="country-search"
        />
        <h2>Countries list</h2>
        <ul>
          <li v-for="country in filteredCountries" :key="country.id">
            <nuxt-link :to="`/countries/${country.countryCode}`">{{
             'Country' + ' - ' + country.name
            }}</nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface Country {
  id: string
  name: string
  countryCode: string
}

interface HolidayResponse {
  date: string
  name: string
}

export default Vue.extend({
  name: 'HomePage',
  data() {
    return {
      countries: [] as Country[],
      randomCountries: [] as {
        name: string
        nextHoliday: HolidayResponse | null
      }[],
      search: '',
    }
  },
  computed: {
    filteredCountries(): Country[] {
      return this.countries.filter(
        (country: { countryCode: string; name: string }) =>
          country.name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
  },
  async mounted() {
    try {
      const response = await this.$axios.$get(`${process.env.COUNTRIES_API}`)

      this.countries = response.map(
        (country: { countryCode: string; name: string }) => ({
          id: country.countryCode,
          name: country.name,
          countryCode: country.countryCode,
        })
      )

      this.getRandomCountriesHolidays()
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  },
  methods: {
    async getRandomCountriesHolidays() {
      // Select 3 random countries
      const shuffledCountries = this.countries.sort(() => 0.5 - Math.random())
      const selectedCountries = shuffledCountries.slice(0, 3)

      // Fetch next holidays for selected countries
      try {
        this.randomCountries = await Promise.all(
          selectedCountries.map(
            async (country: { countryCode: string; name: string }) => {
              try {
                const holidayResponse = await this.$axios.$get(
                  `${process.env.NEXT_PUBLIC_HOLIDAYS}/${country.countryCode}`
                )
                const nextHoliday = holidayResponse.length
                  ? holidayResponse[0]
                  : null
                return {
                  name: country.name,
                  nextHoliday: nextHoliday
                    ? { name: nextHoliday.name, date: nextHoliday.date }
                    : { name: 'No holiday available', date: '' },
                }
              } catch (error) {
                console.error(
                  `Error fetching holidays for ${country.countryCode}:`,
                  error
                )
                return {
                  name: country.name,
                  nextHoliday: { name: 'Error fetching holiday', date: '' },
                }
              }
            }
          )
        )
      } catch (error) {
        console.error('Error fetching random countries holidays:', error)
      }
    },
  },
})
</script>

<style lang="scss">
.section-wrapper {
  flex-direction: row-reverse;
  display: flex;
  width: 96%;
  justify-content: space-between;
  margin: 0 auto;
  padding-top: 50px;
}
.country-search {
  padding: 10px;
  border: 1px solid black;
}
.country-widget-wrapper {
  border: 1px solid black;
  padding: 20px;
  li {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border: 1px solid black;
  }
}
</style>
