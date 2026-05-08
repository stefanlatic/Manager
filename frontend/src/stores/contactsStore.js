import {defineStore} from "pinia";
import {ref} from "vue";

const useContactsStore = defineStore('contacts', () => {
    const contacts = ref([]);
    async function submitContact(name, phone, date) {
        const response = await fetch('http://localhost:3000/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({name, phone, date})
        })  
        if (!response.ok) {
            throw new Error(data.message);
        }
        const contactData = await response.json();
        contacts.value.push(contactData);
    }   
    const fetchContacts = async () => {
        const response = await fetch('http://localhost:3000/api/contacts', {
            method: 'GET',  
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(data.message);
        }   
        const contactsData = await response.json();
        contacts.value = contactsData;
    };

    return { contacts, submitContact, fetchContacts };
});

export default useContactsStore;