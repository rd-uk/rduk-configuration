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

const errors = require('@rduk/errors');
const factory = require('../lib/index');

describe('config', function() {

    describe('in root', function() {

        describe('initialized with invalid env', function() {
            it('should throw an ArgumentError', function() {
                expect(function() {
                    factory(1);
                }).toThrowError(errors.ArgumentError);
            });
        });

        describe('without env', function() {
            let manager;

            beforeEach(function() {
                manager = factory();
            });

            it('should load config.yml', function() {
                expect(manager.settings.get('configFile')).toBe('default (without env)');
            });
        });

        describe('loading with NODE_ENV === development', function() {
            process.env.NODE_ENV = 'development';
            process.env.TEST = 'it works';
            let manager;
            manager = factory.load();

            it('should load config.development.yml', function() {
                expect(manager.settings.get('configFile')).toBe('development');
                expect(manager.settings.get('value1')).toBe('base');
                expect(manager.settings.get('value2')).toBe('override');
                expect(manager.settings.get('replace')).toBe('it works');
            });
        });

    });

    describe('in env example-01', function() {

        let manager;

        beforeEach(function() {
            manager = factory('example-01');
            spyOn(manager, 'getPackageConfig').and.returnValue({
                prefix: 'config',
                ext: '.yml',
                path: 'config'
            });
        });

        describe('getSection', function() {

            describe('called without name', function() {
                it('should throw an ArgumentNullError', function() {
                    expect(function() {
                        manager.getSection();
                    }).toThrowError(errors.ArgumentNullError);
                });
            });

            describe('called with an invalid name', function() {
                it('should throw an ArgumentError', function() {
                    expect(function() {
                        manager.getSection(1);
                    }).toThrowError(errors.ArgumentError);
                });
            });

            describe('called with an unknown name', function() {
                it('should throw a ConfigurationError', function() {
                    expect(function() {
                        manager.getSection('Oops');
                    }).toThrowError(errors.ConfigurationError);
                });
            });

            describe('called with an invalid type', function() {
                it('should throw a ArgumentError', function() {
                    expect(function() {
                        manager.getSection('settings', 'shouldn\'t be a string');
                    }).toThrowError(errors.ArgumentError);
                });
            });

        });

        describe('settings', function() {
            describe('invalid key', function() {
                it('should throw an ArgumentError', function() {
                    expect(function() {
                        manager.settings.get();
                    }).toThrowError(errors.ArgumentError);

                    expect(function() {
                        manager.settings.get({});
                    }).toThrowError(errors.ArgumentError);
                });
            });

            describe('facebook key', function() {
                it('should be defined', function() {
                    let facebook = manager.settings.get('facebook');

                    expect(facebook).toBeDefined();
                    expect(facebook.appId).toBe('APP_ID');
                    expect(facebook.appSecret).toBe('APP_SECRET');
                });
            });

            describe('unknown key', function() {
                it('should throw a ConfigurationError', function() {
                    expect(function() {
                        manager.settings.get('twitter');
                    }).toThrowError(errors.ConfigurationError);
                });
            });
        });

        describe('connections', function() {
            describe('default', function() {
                it('should be con1', function() {
                    expect(manager.connections).toBeDefined();
                    expect(manager.connections.get()).toBe(manager.connections.get('con1'));
                });
            });

            describe('con2', function() {
                it('should be defined', function() {
                    expect(manager.connections.get('con2')).toBeDefined();
                    expect(manager.connections.get('con2').provider).toBe('pg');
                });
            });

            describe('con3', function() {
                it('should throw a ConfigurationError', function() {
                    expect(function() {
                        manager.connections.get('con3');
                    }).toThrowError(errors.ConfigurationError);
                });
            });
        });

    });

    describe('example-02', function() {
        let manager;

        beforeEach(function() {
            manager = factory('example-02');
            spyOn(manager, 'getPackageConfig').and.returnValue({
                prefix: 'config',
                ext: '.yml',
                path: 'config'
            });
        });

        describe('default connection', function() {
            it('should throw an ArgumentError', function() {
                expect(function() {
                    manager.connections.get();
                }).toThrowError(errors.ArgumentError);
            });
        });

        describe('get section "fakeSectionElement" without type', function() {
            it('should return the raw section', function() {
                let fakeSection = manager.getSection('fakeSectionElement');

                expect(fakeSection).toBeDefined();
            });
        });

        describe('get not configurated optional section', function() {
            it('should return null', function() {
                let section = manager.getSection('unknown', null, true);
                expect(section).toBe(null);
            });
        });
    });

});
