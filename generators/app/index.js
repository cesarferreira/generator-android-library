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
      'Welcome to the Android ' + chalk.green('Android Library') + ' generator!'
      ));

    var prompts = [{
      name: 'name',
      message: 'What are you calling your library?',
      store: true,
      default: this.appname // Default to current folder name
    },
    {
      name: 'package',
      message: 'What package will you be publishing the library under?',
      store: true,
      default: 'com.example.library'
    },
    {
      name: 'targetSdk',
      message: 'What Android SDK will you be targeting?',
      store: true,
      default: 23
    },
    {
      name: 'minSdk',
      message: 'What is the minimum Android SDK you wish to support?',
      store: true,
      default: 16
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
      this.copy('build.gradle', 'build.gradle');
      this.copy('gradle.properties', 'gradle.properties');
      this.copy('gradlew', 'gradlew');
      this.copy('gradlew.bat', 'gradlew.bat');
      this.copy('deploy.gradle', 'deploy.gradle');
      this.copy('settings.gradle', 'settings.gradle');
      this.template('_README.md', 'README.md');
      this.directory('gradle', 'gradle');
    },

    app: function () {
      var packageDir = this.appPackage.replace(/\./g, '/');
      var samplePackageDir = this.appPackage.concat('.sample').replace(/\./g, '/');

      var libraryModuleName = 'library';
      var sampleModuleName = 'sample';

      // ######## LIBRARY PROJECT ########
      mkdirp(libraryModuleName);
      this.copy(libraryModuleName+'/gitignore', libraryModuleName+'/.gitignore');
      this.copy(libraryModuleName+'/proguard-rules.pro', libraryModuleName+'/proguard-rules.pro');
      this.template(libraryModuleName+'/_build.gradle', libraryModuleName+'/build.gradle');

      mkdirp(libraryModuleName+'/src/main/assets');
      mkdirp(libraryModuleName+'/src/main/java/' + packageDir);
      this.directory(libraryModuleName+'/src/main/assets', libraryModuleName+'/src/main/assets');
      this.template(libraryModuleName+'/src/main/_AndroidManifest.xml', libraryModuleName+'/src/main/AndroidManifest.xml');
      this.templateDirectory(libraryModuleName+'/src/main/java', libraryModuleName+'/src/main/java/' + packageDir);
      this.templateDirectory(libraryModuleName+'/src/main/res', libraryModuleName+'/src/main/res');

      // ######## SAMPLE PROJECT ########
      mkdirp(sampleModuleName);
      this.copy(sampleModuleName+'/gitignore', sampleModuleName+'/.gitignore');
      this.copy(sampleModuleName+'/proguard-rules.pro', sampleModuleName+'/proguard-rules.pro');
      this.template(sampleModuleName+'/_build.gradle', sampleModuleName+'/build.gradle');

      mkdirp(sampleModuleName+'/src/main/assets');
      mkdirp(sampleModuleName+'/src/main/java/' + samplePackageDir);
      this.directory(sampleModuleName+'/src/main/assets', sampleModuleName+'/src/main/assets');
      this.template(sampleModuleName+'/src/main/_AndroidManifest.xml', sampleModuleName+'/src/main/AndroidManifest.xml');
      this.templateDirectory(sampleModuleName+'/src/main/java', sampleModuleName+'/src/main/java/' + samplePackageDir);
      this.templateDirectory(sampleModuleName+'/src/main/res', sampleModuleName+'/src/main/res');
    }
  }
});
