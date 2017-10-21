const path = require('path');
const { expect } = require('chai');
const sinon = require('sinon');
const rimraf = require('rimraf');
const dirCompare = require('dir-compare');
const fs = require('fs');

const exec = require('../exec');

const ACTUAL = path.join(__dirname, 'actual');
const EXPECTED = path.join(__dirname, 'expected');
const GENIERATORS = path.join(__dirname, 'genierators');

describe('genierate', function() {
  def('genierator', () => '');
  def('name', () => '');
  subject('genierate', () => exec($genierator, $name, $vars));

  const itDoesNotGenerateAnyFiles = () => {
    it('does not generate any files', function() {
      return $genierate.then(() => {
        fs.readdir(ACTUAL, (err, files) => {
          expect(files.length).to.eql(0);
        });
      });
    });
  };

  const itDisplaysTheConsoleError = (error) => {
    it('displays a console error', function() {
      return $genierate.then(() => {
        expect(console.error.args[0][0]).to.eql(error);
      });
    });
  };

  beforeEach(function() {
    fs.mkdirSync(ACTUAL);
    process.chdir(ACTUAL);
    process.env['GENIERATOR_PATH'] = GENIERATORS;
    sinon.stub(console, 'error');;
  });

  afterEach(function(done) {
    console.error.restore();
    rimraf(ACTUAL, done);
  });

  context('when the genierator exists', function() {
    def('genierator', () => 'test-genierator');

    context('and a filename is provided', function() {
      def('name', () => 'my_cool_component');

      context('and a custom variable is provided', function() {
        def('vars', () => '--custom=thingy');

        it('generates the expected files', function() {
          return $genierate.then(() => (
            dirCompare.compare(
              ACTUAL,
              EXPECTED,
              { compareContent: true }
            )
          )).then((res) => {
            expect(res.same).to.be.true;
          });
        });
      });
    });

    context('and no filename is provided', function() {
      def('name', () => '');

      itDoesNotGenerateAnyFiles();
      itDisplaysTheConsoleError('Must specify a filename!');
    });
  });

  context('when the genierator does not exist', function() {
    def('genierator', () => 'invalid');

    itDisplaysTheConsoleError(`Genierator "invalid" not found in ${GENIERATORS}`);
    itDoesNotGenerateAnyFiles();
  });

  context('when the genierator has no template dir', function() {
    def('genierator', () => 'no-template');

    itDisplaysTheConsoleError('Could not find "template/" for genierator "no-template"');
    itDoesNotGenerateAnyFiles();
  });

  context('when the genierator has no vars file', function() {
    def('genierator', () => 'no-vars');

    itDisplaysTheConsoleError('Could not find "vars.js" for genierator "no-vars"');
    itDoesNotGenerateAnyFiles();
  });
});
