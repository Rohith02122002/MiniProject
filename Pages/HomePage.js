
import { expect } from '@playwright/test';

export class HomePage {
    constructor(page) {
      this.page = page;

      // Input fields By using Xpath and CSS Selectors
      this.originInput = this.page.locator('#stationFrom');
      this.OriginAutoSelect= this.page.locator('(//div[@class="ui-menu-item-wrapper"])[1]');
      this.departureInput = this.page.locator('#stationTo');
      this.departureDate = this.page.locator('#originDate');
      this.departureAutoSelect= this.page.locator('(//ul[@id="ui-id-2"]//li[@class="ui-menu-item"]//div[@class="ui-menu-item-wrapper"])[1]'); 

      // Travel options by using CSS Selectors
      this.classSelector = this.page.locator('#noOfpaxEtc');
      this.selectBusiness = this.page.locator('#travelClass');

      //  Search Button using Built in locator
      this.searchButton = this.page.getByRole('button', { name: 'Search ' });
    }

      async navigateToIrctc(url) {
        try {
          await this.page.goto(url);
          // await this.page.waitForTimeout(3000); 
          await this.page.waitForLoadState('domcontentloaded');
           //  Assert that the correct page loaded
          await expect(this.page).toHaveURL('https://www.air.irctc.co.in/');
        } catch (error) {
          console.error(' Navigation to IRCTC failed:', error);
          throw error; // Stop test execution on failure
        }
      }


      async selectOrigin(origin) {
          // Assert the field is visible first
          await expect(this.originInput).toBeVisible();
          // Select origin city
          await this.originInput.fill(origin);
          await this.page.waitForTimeout(2000); 
          await this.OriginAutoSelect.click();
      }

      async selectDestination(destination) {
          // Assert the field is visible first
          await expect(this.departureInput).toBeVisible();
          // Select destination city
          await this.departureInput.fill(destination);
          await this.page.waitForTimeout(2000); 
          await this.departureAutoSelect.click();
      }

      async selectDepartureDate() {
        try {
          console.log("Selecting today's departure date...");        
          const dateInput = this.departureDate;
          // Ensure the departure input field is visible before interacting
          await expect(dateInput).toBeVisible();
          // Click to open the calendar date picker
          await dateInput.click(); 
          // getting Todays Date 
          const today = new Date();
          const date = today.getDate(); 

          // Click on today’s date in the calendar UI based on visible day number       
          await this.page.click(`//tbody[1]/tr/td/span[normalize-space(text())="${date}"]`);
          console.log(`Selected date: ${date}`);
          await this.page.waitForTimeout(2000);

          // Assert that the input field now has a value (i.e., date was picked)
          const selectedValue = await dateInput.inputValue();
          expect(selectedValue).not.toBe('');
        } catch (error) {
          console.error('Failed to select departure date:', error);
          throw error;
        }
      }
         
      async chooseBusinessClass(classType) {
          // Open the passenger & class selection dropdown
          await expect(this.classSelector).toBeVisible();
          // Open class selector dropdown
          await this.classSelector.click();
          await this.page.waitForSelector('#travelClass');
        
          // Click to select the "Business Class" option from dropdown
          await expect(this.selectBusiness).toBeVisible();

          // Select  Class option from Json input
          await this.page.selectOption('#travelClass', { value: classType });
        
          await this.page.waitForTimeout(2000); 
      }

      async clickOnSearchButton() {
          // Trigger the search action
          await this.searchButton.click();
          await this.page.screenshot({ path: 'screenshots/search.png' });
          // await this.page.waitForTimeout(12000); // Wait for search results to load
      }    
}