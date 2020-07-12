<template>
    <date-pick 
        v-model="date"
        v-on:input="updateDate"
        :displayFormat="'DD-MM-YYYY'"
        :isDateDisabled="isInvalidDate"
        :inputAttributes="{readonly: true}"
    ></date-pick>
</template>

<script>
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';

function getFormattedDate(date) {
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return year + '-' + month + '-' + day;
}

let defaultFirstDate = new Date()
defaultFirstDate.setFullYear(defaultFirstDate.getFullYear() + 1)
let defaultFirstDateString = getFormattedDate(defaultFirstDate)

export default {
    name: "DatePicker",
    components: {DatePick},
    data: () => ({
        date: defaultFirstDateString
    }),
    methods: {
        isInvalidDate(date) {
            const firstValidDate = new Date(new Date().toDateString()); //date without time
            firstValidDate.setFullYear(firstValidDate.getFullYear() + 1)
            return date < firstValidDate;
        },
        updateDate() {
            this.$emit("picked-date", this.date)
        }
    },

    mounted() {
        this.$emit("picked-date", this.date)
    }
};
</script>
