import Application from "./Application.js";
import Day from "./calendar/Day.js";
import Reminder from "./calendar/Reminder.js";

export default class Calendar extends Application {
    /**
     * @type {Day[]}
     */
    #days = [];

    /**
     * @type {HTMLDialogElement}
     */
    #modal;

    /**
     * @type {Day|undefined}
     */
    #editedDay;

    /**
     * @type {IDBDatabase}
     */
    #db;

    initialize() {
        super.initialize();

        this.#modal = this.target.lastChild;
        // Set up the close button
        this.#modal.querySelector('.close-btn').addEventListener('click', /** @this {Calendar} */ function () {
            this.#editedDay = undefined;
            this.#modal.close();
        }.bind(this));

        // Event listener for removing reminders
        const delBtn = this.#modal.querySelector('.del-btn');
        delBtn.addEventListener('click', /** @this {Calendar} */ function (evt) {
            evt.preventDefault();
            const select = this.#modal.querySelector('select');

            if (select.value != -1) {
                this.#editedDay.removeReminder(select.value);

                this.#editedDay = undefined;
                this.#modal.close();
            }
        }.bind(this));

        // Event listener for adding new reminders
        const addBtn = this.#modal.querySelector('.add-btn');
        addBtn.addEventListener('click', /** @this {Calendar} */ function (evt) {
            evt.preventDefault();
            const titleElem = this.#modal.querySelector('input.title');
            if (titleElem.value) {
                const newReminder = new Reminder({
                    timestamp: Date.now(),
                    title: titleElem.value,
                    text: this.#modal.querySelector('input.text').value
                });
                this.#editedDay.addReminder(newReminder);

                this.#editedDay = undefined;
                this.#modal.close();
            }
        }.bind(this));

        const request = indexedDB.open('CalendarDB');
        request.onerror = function () {
            console.error('Could not estabilish an IndexedDB connection from this browser.');
            this.destroy();
        }.bind(this);

        request.onsuccess = (event) => {
            this.#db = event.target.result;

            const now = new Date();
            this.#setupDays(now.getFullYear(), now.getMonth() + 1);

            const calendarContainer = document.createElement('div');
            calendarContainer.className = 'calendar';

            for (let day of this.#days) {
                calendarContainer.appendChild(day.dom);

                day.dom.addEventListener('click', /** @this {Calendar} */ function () {
                    this.#editedDay = day;
                    this.#editDay(day);
                }.bind(this));
            }

            this.target.appendChild(calendarContainer);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            /** @type {IDBObjectStore} */
            const objectStore = db.createObjectStore('reminders', {
                keyPath: 'id',
                autoIncrement: true
            });

            objectStore.createIndex('date', 'date', { unique: false });
        };
    }

    /**
     * 
     * @param {number} yearNum 
     * @param {number} monthNum 
     */
    #setupDays(yearNum, monthNum) {
        const currDay = new Date(`${yearNum}-${monthNum}-1`);
        const startMonth = currDay.getMonth();

        while (currDay.getMonth() === startMonth) {
            this.#setupDay(currDay);
            currDay.setDate(currDay.getDate() + 1);
        }
    }

    /**
     * 
     * @param {Date} date 
     */
    #setupDay(date) {
        this.#days.push(new Day(date, this.#db));
    }

    /**
     * Opens a modal editor for the given day.
     * @param {Day} day The day to edit
     */
    #editDay(day) {
        // Add title
        this.#modal.querySelector('.modal-title').textContent = `Day ${day.label}`;

        // Add options from reminders
        for (let option of this.#modal.querySelectorAll('option')) {
            option.remove();
        }
        const select = this.#modal.querySelector('select');
        let newOption = document.createElement('option');
        newOption.value = -1;
        newOption.textContent = 'New reminder';
        select.appendChild(newOption);
        for (let reminder of day.getReminders()) {
            newOption = document.createElement('option');
            newOption.value = reminder.id;
            newOption.textContent = reminder.title;
            select.appendChild(newOption);
        }
        this.#modal.querySelector('input.title').value = '';
        this.#modal.querySelector('input.text').value = '';

        // Open modal
        this.#modal.showModal();
    }
}