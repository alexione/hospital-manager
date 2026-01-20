import { defineStore } from 'pinia';

export const useSnackbarStore = defineStore('snackbar', {
    state: () => ({
        visible: false,
        message: '',
        color: 'success', // poate fi: success, error, warning, info
        timeout: 3000     // dispare după 3 secunde
    }),
    actions: {
        show(msg, type = 'success') {
            this.message = msg;
            this.color = type;
            this.visible = true;
        },
        hide() {
            this.visible = false;
        }
    }
});