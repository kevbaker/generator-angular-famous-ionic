'use strict';
//var util = require('util');
var path = require('path');
var yosay = require('yosay');
var Class = require('../class');

var AppGenerator = Class.extend({
    constructor: function() {
        Class.apply(this, arguments);
        this.createOptions();

        this.argument('appname', {
            type: String,
            required: false
        });
        this.appname = this.appname || path.basename(process.cwd());
        this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    },

    initializing: function() {
        var done = this.async();
        this.pkg = require('../package.json');
        //this.checkGit();
        this.checkTravis().then(done);

    },

    prompting: {
        welcome: function() {
            // Have Yeoman greet the user.
            if(!this.options.hideWelcome) {
                this.log(yosay('Welcome to the bedazzling AngularFamousIonic generator!'));
            }

            this.composeWith('sublime:app');
        },
        askFor: function() {
            var done = this.async();

            var prompts = [{
                name: 'bootstrap',
                type: 'confirm',
                message: 'Would you like to include Bootstrap?',
                default: true
            }, {
                name: 'ionic',
                type: 'confirm',
                message: 'Would you like to include ionic framework?',
                default: true
            }, {
                name: 'famous',
                type: 'confirm',
                message: 'Would you like to include famous-angular?',
                default: true
            }];

            this.prompt(prompts, function(answers) {

                this.bootstrap = answers.bootstrap;
                this.ionic = answers.ionic;
                this.famous = answers.famous;

                done();
            }.bind(this));

        },

        askForModules: function() {
            var done = this.async();

            var choicesModules = [{
                value: 'animateModule',
                name: 'angular-animate.js',
                checked: true
            }, {
                value: 'cookiesModule',
                name: 'angular-cookies.js',
                checked: false
            }, {
                value: 'resourceModule',
                name: 'angular-resource.js',
                checked: false
            }, {
                value: 'sanitizeModule',
                name: 'angular-sanitize.js',
                checked: true
            }];
            var prompts = [{
                type: 'checkbox',
                name: 'modules',
                message: 'Which modules would you like to include?',
                choices: choicesModules
            }];

            this.prompt(prompts, function(answers) {
                // transform the choices into boolean properties on 'this' : this.sanitizeModule
                this.choicesToProperties(answers, choicesModules, 'modules');

                done();
            }.bind(this));
        }
    },

    configuring: function() {

    },

    writing: {

        projectfiles: function() {
            this.sourceRoot(path.join(__dirname, '../templates/app'));

            this.template('_package.json', 'package.json');
            this.template('_bower.json', 'bower.json');
        }
    },

    end: function() {
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            skipMessage: this.options['skip-message']
        });
    }
});

module.exports = AppGenerator;