import Reminder from "./Reminder.js";

export default class Day {
    /**
     * @type {IDBDatabase}
     */
    #db;

    /**
     * @type {Reminder[]}
     */
    #reminders = [];

    /**
     * @type {string}
     */
    label;

    /**
     * @type {HTMLElement}
     */
    dom;

    /**
     * @type {string}
     */
    id;

    /**
     * @param {Date} date
     * @param {IDBDatabase} db
     */
    constructor(date, db) {
        this.#db = db;
        this.id = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        this.label = date.getDate().toString();

        const dayElem = document.createElement('div');
        dayElem.textContent = this.label;
        this.dom = dayElem;

        this.#load();
    }

    /**
     * Adds a new reminder to the current day instance.
     * @param {Reminder} reminder 
     * @param {boolean} shouldSave 
     */
    addReminder(reminder) {
        const request = this.#db.transaction(['reminders'], 'readwrite')
            .objectStore('reminders').add({
                title: reminder.title,
                text: reminder.text,
                timestamp: reminder.timestamp,
                date: this.id
            });

        request.onsuccess = /** @this {Day} */ function () {
            reminder.id = request.result.id;

            this.#intializeReminder(reminder);
        }.bind(this);

        request.onerror = () => {
            console.error('Failed to add reminder to the database.');
        }
    }

    #intializeReminder(reminder) {
        this.#reminders.push(reminder);
        this.dom.appendChild(reminder.dom);
    }

    removeReminder(reminderId) {
        console.log(reminderId);
        const request = this.#db.transaction(['reminders'], 'readwrite')
            .objectStore('reminders').delete(reminderId);
        request.onerror = () => {
            console.error('Failed to remove reminder from the database.');
        }
        request.onsuccess = function () {
            const reminder = this.#reminders.find(rem => rem.id == reminderId);
            // Remove reminder from day object
            this.#reminders = this.#reminders.filter(rem => rem !== reminder);
            // Remove reminder from the GUI
            reminder.dom.remove();
        }.bind(this);
    }

    getReminders() {
        return this.#reminders.slice();
    }

    #load() {
        const request = this.#db.transaction(['reminders'], 'readonly')
            .objectStore('reminders').index('date').getAll(this.id);
        request.onsuccess = () => {
            for (let reminderEntity of request.result) {
                const reminder = new Reminder({
                    id: reminderEntity.id,
                    text: reminderEntity.text,
                    title: reminderEntity.title,
                    timestamp: reminderEntity.timestamp
                });
                this.#intializeReminder(reminder);
            }
        }
        request.onerror = () => {
            console.error('Failed to fetch reminders from the database.');
        }
    }
}