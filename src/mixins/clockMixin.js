export default {
    data() {
        return {
            time: '',
            timer: null
        };
    },
    mounted() {
        this.updateTime();
        this.timer = setInterval(this.updateTime, 1000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        updateTime() {
            const now = new Date();
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            this.time = `${hour}:${minute}`;
        }
    }
};
