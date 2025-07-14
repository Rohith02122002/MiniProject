export class CaptureScreenshot{  
    constructor(page)
    {
     this.page = page;
    }
        async captureResultsScreenshot(routeKey) {
                const dir = './screenshots';            
                const fileName = `${dir}/${routeKey}.png`;
                //  Capture full-page screenshot of results
                await this.page.screenshot({ path: fileName, fullPage: true });
                console.log(`Screenshot saved to: ${fileName}`);
        }
        async closeApplication(browser) {
            try {
                await browser.close();
                console.log('Browser closed successfully.');
            } catch (error) {
                console.error('Failed to close the browser:', error);
                throw error;
            }
        }
       

}
