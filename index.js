import {program} from "commander";
import 'colors';
import {addContact, getContactById, listContacts, removeContact} from "./src/contacts.js";

program
    .option("-a, --action <type>", "choose action")
    .option("-i, --id <type>", "user id")
    .option("-n, --name <type>", "user name")
    .option("-e, --email <type>", "user email")
    .option("-p, --phone <type>", "user phone");

program.parse();

const options = program.opts();

async function invokeAction({action, id, name, email, phone}) {
    switch (action) {
        case "list":
            console.table(await listContacts());
            break;

        case "get":
            let contact = await getContactById(id);
            if (contact)
                console.table(contact);
            else
                console.log(`No contact with id ${id} found`.bgYellow.white)
            break;
        case "add":
            const params = [name, email, phone];
            if (params.some(param => !param)) {
                console.log("Please specify name, email, phone".bgRed.white);
                return;
            }
            console.table(await addContact(...params));
            break;

        case "remove":
            const removedContact = await removeContact(id);
            if (removedContact)
                console.log(`Contact ${removedContact.name} was removed`.bgGreen.white);
            else
                console.log(`No contact with id ${id} found`.bgYellow.white);
            break;

        default:
            console.warn("\x1B[31m Unknown action type!");
    }
}

invokeAction(options);
