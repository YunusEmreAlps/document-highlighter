'use strict';
require('should');

var documentHighlight = require('../lib');

var generateIt = function(description, text, query, options, expected) {
  it(description, function() {
      documentHighlight(text, query, options).should.eql(expected);
    });
};

var generateIts = function(its) {
  var defaultOptions = {
    before: '*',
    after: '*'
  };

  for(var itShould in its) {
    var itDatas = its[itShould];
    generateIt(itShould, itDatas.text, itDatas.query, defaultOptions, itDatas.expected);
  }
};

describe('Standard mode', function() {
  describe('with text content', function() {
    var its = {
      'should not modify non-matching text': {
        text: 'Hello and welcome to the real world, Neo',
        query: 'non matching query',
        expected: 'Hello and welcome to the real world, Neo'
      },
      'should highlight relevant text': {
        text: 'Hello and welcome to the real world, Neo',
        query: 'welcome to the real world',
        expected: 'Hello and *welcome to the real world*, Neo',
      },
      'should be case insensitive to the text': {
        text: 'Hello and WELCOME to the real world, Neo',
        query: 'welcome to the real world',
        expected: 'Hello and *WELCOME to the real world*, Neo',
      },
      'should be case insensitive to the query': {
        text: 'Hello and welcome to the real world, Neo',
        query: 'WELCOME to the real world',
        expected: 'Hello and *welcome to the real world*, Neo',
      },
      'should use unicode mapping': {
        text: 'Hello and wélcöme to the real world, Neo',
        query: 'welcome to the real world',
        expected: 'Hello and *wélcöme to the real world*, Neo',
      },
      'should match standard lexemes': {
        text: 'Hello and welcome to the real world, Neo',
        query: 'welcome to the reals worlds',
        expected: 'Hello and *welcome to the real world*, Neo',
      },
      'should split non contiguous queries': {
        text: 'Hello and welcome to the real world, Neo',
        query: 'hello world',
        expected: '*Hello* and welcome to the real *world*, Neo',
      },
      'should not highlight stop words': {
        text: 'Hello and welcome to the real world, Neo',
        query: 'hello to the real world',
        expected: '*Hello* and welcome to the real *world*, Neo',
      },
      'should include stop-words queries': {
        text: 'Hello and welcome to the real world, Neo',
        query: 'welcome real world',
        expected: 'Hello and *welcome to the real world*, Neo',
      },
      'should highlight multiple paragraphs': {
        text: 'Hello and welcome to the real world, Neo.\nTrinity will be there soon.',
        query: 'Neo Trinity',
        expected: 'Hello and welcome to the real world, *Neo*.\n*Trinity* will be there soon.',
      },
    };

    generateIts(its);
  });

  describe('with HTML content', function() {
    var its = {
      'should not modify non-matching text': {
        text: 'Hello and <span>welcome to the</span> real world, Neo',
        query: 'non matching query',
        expected: 'Hello and welcome to the real world, Neo'
      },
      'should highlight relevant, including HTML': {
        text: 'Hello and welcome to the <strong>real world</strong>, Neo',
        query: 'welcome to the real world',
        expected: 'Hello and *welcome to the <strong>real world</strong>*, Neo',
      },
      'should skip empty HTML': {
        text: 'Hello and welcome to<span class="a_0__0"</span> the real world, Neo',
        query: 'welcome to the real world',
        expected: 'Hello and *welcome to<span class="a_0__0"</span> the real world*, Neo',
      },
      'should skip embedded empty HTML': {
        text: 'Hello and wel<span class="a_0__0"</span>come to the real world, Neo',
        query: 'welcome to the real world',
        expected: 'Hello and *wel<span class="a_0__0"</span>come to the real world*, Neo',
      },
      'should highlight multiple paragraphs': {
        text: '<p>Hello and welcome to the real world, Neo.</p><p>Trinity will be there soon.</p>',
        query: 'Neo Trinity',
        expected: '<p>Hello and welcome to the real world, *Neo*.</p><p>*Trinity* will be there soon.</p>',
      },
    };

    generateIts(its);
  });
});

describe('Strict mode', function() {
  describe('with text content', function() {

  });

  describe('with HTML content', function() {

  });
});
