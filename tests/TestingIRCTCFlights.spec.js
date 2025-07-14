import { test,chromium } from "@playwright/test";
import { HomePage } from "../Pages/HomePage";
import {  FlightPage } from "../Pages/flight-results";
import { CaptureScreenshot } from "../Pages/flight-Screenshot-page";
import fs from "fs" ;
import path from "path";

const testData = require("../InputDataForHomePage/flightsearch.json");

// Reset JSON once per test suite
const FILE_PATH = path.join(__dirname, "../utils/output.json");

test.describe('IRCTC Flight Search Tests', () => {

  test.beforeAll(() => {
    // Reset the JSON file before tests run
    fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2));
    console.log('flightResults.json cleared at the beginning of test suite');
  });

  for (let data of testData.routes) {
    test(`Home Page ${data.origin} - ${data.destination}`, async () => {
      test.slow();

      const browser = await chromium.launch({ args: ['--start-maximized']});
      const context = await browser.newContext({viewport:null,deviceScaleFactor: undefined});
      const page = await context.newPage();

      const home = new HomePage(page);
      const flights = new FlightPage(page);
      const screenshot=new CaptureScreenshot(page);

      //Functions that are called in the Home Page  
      await home.navigateToIrctc(testData.baseUrl);
      await home.selectOrigin(data.origin);
      await home.selectDestination(data.destination);
      await home.selectDepartureDate();
      await home.chooseBusinessClass(data.travelClass);
      await home.clickOnSearchButton();

      // Functions that are called in the Flights Page  
      await flights.waitForResultsToLoad();
      await flights.flightsData();
      await flights.verifyOriginDetails(data.origin);
      await flights.verifyDepartureDetails(data.destination);
      await flights.verifyTodayDate();
      await flights.flightToJson(data.origin, data.destination);

      //  Functions that are called in the ScreenShots Page
      const routeKey = `${data.origin.toLowerCase()}-${data.destination.toLowerCase()}`;
      await screenshot.captureResultsScreenshot(routeKey);
      await screenshot.closeApplication(browser);    
        
    });
  }
});
