/**
 * MIT License
 *
 * Copyright (c) 2016 Kim UNG
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

(function(require, module, process) {

    'use strict';

    var fs = require('fs');
    var yaml = require('js-yaml');
    var extend = require('extend');
    var pack = require('../package.json');
    var errors = require('rduk-errors');

    function ConfigurationManager (env) {
        this.init(env);
    }

    ConfigurationManager.prototype.init = function(env) {
        if (!!env && typeof env !== 'string') {
            errors.throwArgumentError('env', env);
        }

        var path = pack && pack.rduk && pack.rduk.config && pack.rduk.config.path || '';
        var defaultConfigFileName = path + '/config.yml';
        var configFileName = path + '/config' + (!!env ? '.' + env : '') + '.yml';

        var self = this, sections = {}, 

            document, getDocument = function() {
                if (!document) {
                    if (fs.existsSync(defaultConfigFileName)) {
                        document = yaml.safeLoad(fs.readFileSync(defaultConfigFileName));
                    }

                    if(defaultConfigFileName !== configFileName && fs.existsSync(configFileName)) {
                        extend(true, document || {}, yaml.safeLoad(fs.readFileSync(configFileName)));
                    }
                }

                return document;
            };

        Object.defineProperty(this, 'settings', {
            get: function() {
                return self.getSection('settings', require('./sections/settings'));
            }
        });

        Object.defineProperty(this, 'connections', {
            get: function() {
                return self.getSection('connections', require('./sections/connections'));
            }
        });

        this.getSection = function(name, type) {
            if (!name) {
                errors.throwArgumentNullError('name');
            }

            if (typeof name !== 'string') {
                errors.throwArgumentError('name', name);
            }

            if (!!type && typeof type !== 'function') {
                errors.throwArgumentError('type', type);
            }

            var doc = getDocument();

            if (!doc.hasOwnProperty(name)) {
                errors.throwConfigurationError('unknown section: ' + name);
            }

            if (!sections.hasOwnProperty(name)) {
                sections[name] = !!type ? new type(doc[name]) : doc[name];
            }

            return sections[name];
        };
    };

    var configs = {};

    module.exports = function(env) {
        if (!configs.hasOwnProperty(env || 'default')) {
            configs[env || 'default'] = new ConfigurationManager(env);
        }

        return configs[env || 'default'];
    };

    module.exports.load = function() {
        return module.exports(process.env.NODE_ENV);
    };

} (require, module, process));
