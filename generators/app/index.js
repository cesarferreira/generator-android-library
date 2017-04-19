'use strict';
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var mkdirp = require('mkdirp');

/**
 * Functionally the same as directory however applies templating if file name begins with an underscore (_).
 *
 * @param source
 * @param destination
 */
function templateDirectory(source, destination) {
  var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
  var files = this.expandFiles('**', { dot: true, cwd: root });

  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var src = path.join(root, f);
    var dest = '';
    if (path.basename(f).indexOf('_') === 0) {
      dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
      this.template(src, dest);
    } else {
      dest = path.join(destination, f);
      this.copy(src, dest);
    }
  }
}

module.exports = require('yeoman-generator').Base.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
    this.templateDirectory = templateDirectory.bind(this);
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the VZ MSSO ' + chalk.green('Android Library') + ' generator!'
      ));

    var prompts = [{
      type  : 'input',
      name  : 'name',
      type  : 'string',
      message: 'What is the name of your app?',
      store: false,
      default: this.appname // Default to current folder name
    },
    {
      type : 'input',
      name: 'package',
      type  : 'string',
      message: 'What is application package name?',
      store: false,
      //default: 'com.verizon.api.android'
    },
    {
      type : 'input',
      name: 'targetSdk',
      message: 'What Android SDK will you be targeting?',
      store: false,
      default: 25
    },
    {
      type : 'input',
      name: 'minSdk',
      message: 'What is the minimum Android SDK you wish to support?',
      store: false,
      default: 23
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.name;
      this.appPackage = props.package;
      this.androidTargetSdkVersion = props.targetSdk;
      this.androidMinSdkVersion = props.minSdk;

      done();
    }.bind(this));
  },

  configuring: {
    saveSettings: function () {
      this.config.set('appPackage', this.appPackage);
      this.config.set('appName', this.appName);
    }
  },

  writing: {
    projectfiles: function () {
      this.copy('gitignore', '.gitignore');
      this.copy('gradle.properties', 'gradle.properties');
      this.copy('gradlew', 'gradlew');
      this.copy('gradlew.bat', 'gradlew.bat');
      this.copy('CHANGELOG.md','CHANGELOG.md');
      this.copy('CONTRIBUTING.md','CONTRIBUTING.md');
      this.copy('cookiemaster-android.iml','cookiemaster-android.iml');
      this.copy('settings.gradle', 'settings.gradle');
      this.template('_build.gradle', 'build.gradle');
      this.template('_README.md', 'README.md');
      this.directory('gradle', 'gradle');
    },

    app: function () {
      var packageDir = this.appPackage.replace(/\./g, '/');
      //var samplePackageDir = this.appPackage.concat('.sample').replace(/\./g, '/');

      var libraryModuleName = 'library';
      // TODO: required to replace library with this.appName

      // ######## LIBRARY PROJECT ########
      mkdirp(libraryModuleName);
      this.copy(libraryModuleName+'/gitignore', libraryModuleName+'/.gitignore');
      this.copy(libraryModuleName+'/proguard-rules.pro', libraryModuleName+'/proguard-rules.pro');
      this.template(libraryModuleName+'/_build.gradle', libraryModuleName+'/build.gradle');
      this.template(libraryModuleName+'/_jacoco.gradle', libraryModuleName+'/jacoco.gradle');

      mkdirp(libraryModuleName+'/src/main/assets');
      mkdirp(libraryModuleName+'/src/main/java/' + packageDir);
      mkdirp(libraryModuleName+'/src/test/' + packageDir);
      mkdirp(libraryModuleName+'/src/androidTest/' + packageDir);
      this.directory(libraryModuleName+'/src/main/assets', libraryModuleName+'/src/main/assets');
      this.template(libraryModuleName+'/src/main/_AndroidManifest.xml', libraryModuleName+'/src/main/AndroidManifest.xml');
      this.templateDirectory(libraryModuleName+'/src/main/java', libraryModuleName+'/src/main/java/');
      this.templateDirectory(libraryModuleName+'/src/main/res', libraryModuleName+'/src/main/res');
      this.templateDirectory(libraryModuleName+'/src/test', libraryModuleName+'/src/test/');
      this.templateDirectory(libraryModuleName+'/src/androidTest', libraryModuleName+'/src/androidTest/');

    }
  }
});
