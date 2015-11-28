'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('yj', function() {


  it('should automatically redirect to /mainView when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/mainView");
  });


  describe('mainView', function() {

    beforeEach(function() {
      browser.get('index.html#/mainView');
    });


    it('should render mainView when user navigates to /mainView', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for mainView/);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser.get('index.html#/view2');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
