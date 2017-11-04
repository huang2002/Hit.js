/**
 * @file Hit.LocalStore.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 */

/**
 * @description The constructor of localStorage manager.
 * @param {string} name The initial name.
 * @property {string} name The name.
 * @property {any} data The data.
 * @property {boolean} autoSave Whether to save after modifying automatically.
 * @property {(err: Error) => void} onerror Error handler.
 */
Extension.export('LocalStore', new Constructor(function(name) {
    this.name = name || 'LocalStore';
    this.data = null;
    this.autoSave = true;
    this.onerror = null;
    this.get();
}, {
    /**
     * @description To set the name and load the data.
     * @param {string} name The name.
     * @returns {LocalStore} Self.
     */
    load: function(name) {
        this.name = name || 'LocalStore';
        this.get();
        return this;
    },
    /**
     * @description To set the data.
     * @param {any} data The data.
     * @returns {boolean} Whether the data has been saved successfully.
     */
    set: function(data) {
        this.data = JSON.parse(JSON.stringify(data));
        return this.autoSave && this.save();
    },
    /**
     * @description To get the data.
     * @returns {any} The data.
     */
    get: function() {
        if (!('localStorage' in window)) {
            return undefined;
        }
        try {
            return this.data = JSON.parse(localStorage.getItem(this.name));
        } catch (err) {
            if (this.onerror) {
                this.onerror(err);
            }
            return null;
        }
    },
    /**
     * @description To save the data.
     * @returns {boolean} Whether the data is saved successfully.
     */
    save: function() {
        if (!('localStorage' in window)) {
            return false;
        }
        try {
            localStorage.setItem(this.name, JSON.stringify(this.data));
        } catch (err) {
            if (this.onerror) {
                this.onerror(err);
            }
            return false;
        }
        return true;
    },
    /**
     * @description To clear the data.
     * @returns {boolean} Whether the data is cleared successfully.
     */
    clear: function() {
        if ('localStorage' in window) {
            try {
                localStorage.removeItem(this.name);
            } catch (err) {
                if (this.onerror) {
                    this.onerror(err);
                }
                return false;
            }
        }
        return true;
    }
}));