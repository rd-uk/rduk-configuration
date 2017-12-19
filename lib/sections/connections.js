/**
 * MIT License
 *
 * Copyright (c) 2016 - 2017 RDUK <tech@rduk.fr>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(module) {

    'use strict';

    var errors = require('rduk-errors');
    var _ = require('lodash');

    var ConnectionsSection = function(section) {
        if (!Array.isArray(section)) {
            errors.throwArgumentError('section', section);
        }

        this.get = function(name) {
            if (!name) {
                return section[0];
            }

            var connection = _.filter(section, function(con) { return con.name === name; })[0];

            if (!connection) {
                errors.throwConfigurationError('connection "' + name + '" not found.');
            }

            return connection;
        };
    };

    module.exports = ConnectionsSection;

} (module));
