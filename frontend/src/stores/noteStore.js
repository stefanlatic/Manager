import { defineStore } from 'pinia';

export const useNoteStore = defineStore('note', {
    state: () => ({
        notes: []
    }),

    actions: {
        async fetchNotes() {
            const res = await fetch('http://localhost:3000/api/notes', {
                credentials: "include"
            });

            const data = await res.json();
            this.notes = data; 
        },

        async addNote(noteData) {
            const res = await fetch('http://localhost:3000/api/notes', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                  credentials: "include",
                body: JSON.stringify(noteData), 
            });

            const data = await res.json();

            this.notes.unshift(data); 
        }
    }
});