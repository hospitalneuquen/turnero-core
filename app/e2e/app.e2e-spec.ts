import { TurneroPage } from './app.po';

describe('turnero App', () => {
  let page: TurneroPage;

  beforeEach(() => {
    page = new TurneroPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
