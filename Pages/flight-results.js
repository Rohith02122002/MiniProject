import { expect } from "@playwright/test"; 
import  {saveOutputToJson} from "../utils/simpleJson";

export class FlightPage {
    constructor(page) {
      this.page = page;

      //  Flight search result elements
      this.resultFlightName = page.locator("//div[@class='right-searchbarbtm-in']/div/div[2]/b");
      this.resultFlightCode = page.locator('//div[@class="right-searchbarbtm"]/div[1]/div/div[2]/span');
      this.resultNoFlights = page.locator("//div[@class='right-searchbarbtm']/p");
      this.dateField=this.page.locator('#originDate');
      this.originField= this.page.getByPlaceholder('Destination');
      this.departureField=this.page.locator('#stationTo');
    }

      async waitForResultsToLoad() {
          try {
            console.log('Waiting for flight results to load...');

            // Wait until the results  becomes visible 
            await this.page.waitForTimeout(12000);
          
            // Or, if needed, add a fallback timeout to buffer animations
            await this.page.waitForTimeout(3000);

          } catch (error) {
            console.error('Flight results did not load as expected:', error);
            throw error;
          }
      }

      async flightsData() {
          try {
            // Gather flight result details
            const flightName = await this.resultFlightName.allInnerTexts();
            const flightCode = await this.resultFlightCode.allInnerTexts();
            console.log('Flight data fetched successfully.');
            return { flightName, flightCode };
          } catch (error) {
            console.error('Failed to fetch flight data:', error);
            throw error;
          }
      }

 
      async verifyOriginDetails(OriginFrom) {
            //  Verify the origin station input matches expectation
            const actualFrom = await this.page.locator('#stationFrom').inputValue();
            console.log(`Origin entered: ${actualFrom}`);  
            expect(actualFrom.toUpperCase()).toContain(OriginFrom.toUpperCase());
      }

      async verifyDepartureDetails(expectedTo) {
            //  Verify the destination station input
            const actualTo = await this.page.locator('#stationTo').inputValue();
            console.log(`Destination entered: ${actualTo}`);
            expect(actualTo.toUpperCase()).toContain(expectedTo.toUpperCase());
      }

      async verifyTodayDate() {
            //  Get the displayed date from the input field
            const dateDisplayed = await  this.dateField.inputValue();
            // Construct today's date in DD-MM-YYYY format
            const today = new Date();
            const expectedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
            // Validate displayed date matches today's date
            expect(dateDisplayed).toBe(expectedDate);
            console.log(`Departure date validated: ${expectedDate}`);
      }

      async flightToJson(OriginCity, DepartureCity) {

            //  Retrieve flight details from flightsData()
            const { flightName, flightCode } = await this.flightsData();
          
            const dict_result = {};
            const flightInfoArray = [];
            const routeKey = `${OriginCity.toLowerCase()}-${DepartureCity.toLowerCase()}`;
          
            if (flightName.length === 0) {
              console.log(' Message : No flights available for this route.');
            
              //  Assertion: When no flights are found, both arrays should be empty
              expect(flightCode.length).toBe(0);
              const noFlightData={ Route: routeKey, Message: 'No flights available for this route'}
              //  Sending Output to JSon file
              saveOutputToJson(noFlightData);
            } 
            else {
              // Assertion: check—arrays should all match the flight count
              expect(flightName.length).toBe(flightCode.length);
              expect(flightCode.length).toBe(flightName.length);
            
                for (let i = 0; i < flightName.length; i++) {
                  //  console.log(`${i+1}. ${flightName[i]} - ${flightCode[i]}`)
                  flightInfoArray.push({
                    FlightName: flightName[i],
                    FlightCode: flightCode[i]
                  });
                
                  // Count how many times each flight name appears
                    if (dict_result[flightName[i]]) {
                      dict_result[flightName[i]] += 1;
                    } else {
                      dict_result[flightName[i]] = 1;
                    }
                }
                  // console.log(flightInfoArray);
                  console.log(dict_result);
                const flightData = {
                  Route: routeKey,
                  flightCounts: dict_result,
                  flightsAndFlightCode: flightInfoArray
              };
              saveOutputToJson( flightData);
              console.log(`Flight data written to JSON for route: ${routeKey}`);
            }
          }
}   