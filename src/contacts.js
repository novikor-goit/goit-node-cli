import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const contactsPath = path.resolve('src/db/contacts.json');

async function persist(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
}

export async function listContacts() {
    return JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
}

export async function getContactById(contactId) {
    const contacts = await listContacts();
    return contacts.find(contact => contact.id === contactId) ?? null;
}

export async function removeContact(contactId) {
    const contact = await getContactById(contactId);
    const updatedContacts = (await listContacts()).filter(contact => contact.id !== contactId);
    await persist(updatedContacts);
    return contact ?? null;
}

export async function addContact(name, email, phone) {
    const newContact = {id: crypto.randomUUID(), name, email, phone};
    await persist([...(await listContacts()), newContact]);
    return newContact;
}