import { defineStore } from 'pinia';

export const useSnackbarStore = defineStore('snackbar', {
    state: () => ({
        visible: false,
        message: '',
        color: 'success',
        timeout: 3000
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