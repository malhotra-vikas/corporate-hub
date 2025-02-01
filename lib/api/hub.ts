import BaseApi from "./_baseApi";
import { LoginDto } from "@/dto/login.dto";
import { VerifyUserDto } from "@/dto/verifyUser.dto";
import SerpApi from "./serp.api";
import { Company, Competitor } from "../types";


export default class HubApi extends BaseApi {
    baseUrl: string = "serp/";
    getUniqueFieldValues: any;
    constructor() {
        super();
    }

    async addCompetitor(newTickerSymbol: string) {

        // Build the competitor structure
        const competitor: Competitor = {
            symbol: newTickerSymbol,  // Extract symbol from 'stock' (before the colon)
            name: newTickerSymbol,
            price: 0,
            change: 0,
            percentChange: 0,
            link: "",

            //name: item.name,
            //price: parseFloat(item.price.replace(/[^\d.-]/g, '')),  // Remove currency symbol and parse as float
            //change: item.price_movement ? parseFloat(item.price_movement.percentage.toFixed(2)) : 0,  // Change in price (percentage)
            //percentChange: item.price_movement ? parseFloat(item.price_movement.percentage.toFixed(2)) : 0,  // Percent change
            //link: item.link,
        };
        return competitor     
    }

    async buildNews(newsData: any) {
        console.log("newsData is ", newsData);
        let transformedData: { source: any; time: any; link: any; title: any; image: any; }[] = [];

        newsData.forEach(news => {
            if (news.items && Array.isArray(news.items)) {  // Ensure items exists and is an array
                news.items.forEach(item => {
                    transformedData.push({
                        source: item.source,
                        time: item.date,
                        title: item.snippet,
                        link: item.link,
                        image: item.thumbnail || 'default-image-url.png', // You can add a fallback for images
                    });
                });
            }
        });
                
        return transformedData
        
    }

    async buildCompetitorsFromSearchedList(data: any[]): Promise<Competitor[]> {
        // Safety check for undefined or non-array data
        if (!Array.isArray(data)) {
            console.error("Expected an array but got: ", data);
            throw new Error("Expected data to be an array");
        }

        console.log("Data structure is valid:", data);  // Log the structure for debugging
        const competitors: Competitor[] = [];

        // Flatten the nested array and iterate through the items
        const flattenedData = data[0];  // Since the data is nested, access the first array

        // Limit the number of competitors to the top 10 if there are more than 10 items
        const topCompetitors = flattenedData.slice(0, 10);

        topCompetitors.forEach(item => {
            // Ensure required fields are present before creating a competitor
            if (!item.stock || !item.name || !item.price) {
                console.warn("Missing required fields for item:", item);
                return; // Skip this item
            }

            // Build the competitor structure
            const competitor: Competitor = {
                symbol: item.stock.split(":")[0],  // Extract symbol from 'stock' (before the colon)
                name: item.name,
                price: parseFloat(item.price.replace(/[^\d.-]/g, '')),  // Remove currency symbol and parse as float
                change: item.price_movement ? parseFloat(item.price_movement.percentage.toFixed(2)) : 0,  // Change in price (percentage)
                percentChange: item.price_movement ? parseFloat(item.price_movement.percentage.toFixed(2)) : 0,  // Percent change
                link: item.link,
            };
    
            competitors.push(competitor);
        });
    
        return competitors;
    }

    async getCompanyHubDetails(companyTicker: string, exchange: string) {

        const queryString = `ticker=${companyTicker}&exchange=${exchange}`;

        const companyDetails = await SerpApi.get(
            `${this.baseUrl}getAllCompanyDataForTicker?${queryString}`,
        );

        console.log("In Hub companyDetails ", companyDetails)


        // Build competitors from the given data
        const competitors = await this.buildCompetitorsFromSearchedList([companyDetails.data.companyDiscoverMore[1].items]);

        console.log("competitors are ", competitors);

        // Build competitors from the given data
        const news = await this.buildNews(companyDetails.data.newsResults);
        console.log('Transformed News:', news);

        const hubData = {
            company: companyDetails.data.companySummary,
            competitors: competitors,
            earningsCalendar: [
                { date: "JAN 21", company: "Netflix", time: "Jan 21, 2025, 4:00 PM" },
                { date: "JAN 22", company: "Johnson & Johnson", time: "Jan 22, 2025, 6:45 AM" },
                { date: "JAN 22", company: "Procter & Gamble", time: "Jan 22, 2025" },
                { date: "JAN 22", company: "GE Vernova", time: "Jan 22, 2025, 9:30 AM" },
                { date: "JAN 23", company: "Intuitive", time: "Jan 23, 2025" },
                { date: "JAN 23", company: "Texas Instruments", time: "Jan 23, 2025" },
            ],
            news: news,
        }

        return hubData;
    }


}


