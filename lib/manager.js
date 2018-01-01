/**
 * MIT License
 *
 * Copyright (c) 2016 - 2018 RDUK <tech@rduk.fr>
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

'use strict';

const fs = require('fs');
const extend = require('extend');
const errors = require('@rduk/errors');
const yaml = require('./sections/field/yaml');

const DEFAULT_PKG_CONFIG = {
  rduk: {
    config: {
      prefix: 'config',
      ext: '.yml',
      path: false
    }
  }
};

function assertGetSectionArgs(name, type) {
    if (!name) {
        errors.throwArgumentNullError('name');
    }

    if (typeof name !== 'string') {
        errors.throwArgumentError('name', name);
    }

    if (!!type && typeof type !== 'function') {
        errors.throwArgumentError('type', type);
    }
}

function ConfigurationManager (env) {
    this.init(env);
}

ConfigurationManager.prototype.getPackageConfig = function() {
    let pkg = require(process.env.PWD + '/package.json');
    return extend(true, DEFAULT_PKG_CONFIG, pkg).rduk.config;
};

ConfigurationManager.prototype.init = function(env) {
    if (!!env && typeof env !== 'string') {
        errors.throwArgumentError('env', env);
    }

    let self = this, sections = {}, document;

    let getDocument = function() {
        if (!document) {
            let config = self.getPackageConfig();
            let path = config.path ? config.path + '/' : '';
            let defaultConfigFileName = path + config.prefix + config.ext;
            let configFileName = path + config.prefix + '.' + env + config.ext;

            if (fs.existsSync(defaultConfigFileName)) {
                document = yaml.load(defaultConfigFileName);
            }

            if(defaultConfigFileName !== configFileName && fs.existsSync(configFileName)) {
                document = extend(true, document || {}, yaml.load(configFileName));
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

    this.getSection = function(name, type, optional) {
        assertGetSectionArgs(name, type);

        let doc = getDocument();
        let unknown = !doc || !doc.hasOwnProperty(name);

        if (unknown && optional) {
            return null;
        }

        if (unknown) {
            errors.throwConfigurationError('unknown section: ' + name);
        }

        if (!sections.hasOwnProperty(name)) {
            sections[name] = !!type ? new type(doc[name]) : doc[name];
        }

        return sections[name];
    };
};

module.exports = ConfigurationManager;
