import BaseApi from "./_baseApi";
import { LoginDto } from "@/dto/login.dto";
import { VerifyUserDto } from "@/dto/verifyUser.dto";
import SerpApi from "./serp.api";
import { Company, Competitor, HubData } from "../types";
import moment from 'moment';
import { compareAsc } from "date-fns";
import EarningsApi from "./earnings.api";


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

        // Utility function to escape any regex special characters in the company name
    async escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }  
  
    async buildNews(newsData: any) {
        console.log("newsData is ", newsData);

        if (!newsData || !Array.isArray(newsData)) {
            console.error("Error: newsData is undefined or not an array", newsData);
            return []; // Return an empty array instead of breaking
        }
    
        //let companyNews: { source: any; time: any; link: any; title: any; image: any; }[] = [];
        //let trendingNews: { source: any; time: any; link: any; title: any; image: any; }[] = [];
        //let industryNews: { source: any; time: any; link: any; title: any; image: any; }[] = [];

        let genericNews: { source: any; time: any; link: any; title: any; image: any; }[] = [];

        // Example logic for separating into categories (can be customized as needed)
        newsData.forEach(news => {
            const formattedDate = news.publishedDate 
            ? new Date(news.publishedDate).toISOString() 
            : news.date 
                ? new Date(news.date.replace(", +0000 UTC", " UTC")).toISOString() 
                : new Date().toISOString(); // Default to current time if no date is provided
    
            const newsItem = {
                source: news.site || news.source?.name,
                time: formattedDate,
                title: news.title,
                text: news.text || "",
                link: news.url || news.link,
                image: news.image || 'default-image-url.png', // Fallback for images
            };
            genericNews.push(newsItem);
        });

        // Function to parse relative time like "1 day ago", "4 hours ago"
        const parseRelativeTime = (relativeTime: string): Date => {
            const currentTime = new Date();
            let timeValue: number;

            if (relativeTime.includes("month")) {
                timeValue = parseInt(relativeTime.split(" ")[0]);
                return new Date(currentTime.setDate(currentTime.getDate() - timeValue * 30)); // 30 days in a month
            }
            if (relativeTime.includes("week")) {
                timeValue = parseInt(relativeTime.split(" ")[0]);
                return new Date(currentTime.setDate(currentTime.getDate() - timeValue * 7)); // 7 days in a week
            }
            if (relativeTime.includes("day")) {
                timeValue = parseInt(relativeTime.split(" ")[0]);
                return new Date(currentTime.setDate(currentTime.getDate() - timeValue));
            }
            if (relativeTime.includes("hour")) {
                timeValue = parseInt(relativeTime.split(" ")[0]);
                return new Date(currentTime.setHours(currentTime.getHours() - timeValue));
            }
            if (relativeTime.includes("minute")) {
                timeValue = parseInt(relativeTime.split(" ")[0]);
                return new Date(currentTime.setMinutes(currentTime.getMinutes() - timeValue));
            }
            if (relativeTime.includes("second")) {
                timeValue = parseInt(relativeTime.split(" ")[0]);
                return new Date(currentTime.setSeconds(currentTime.getSeconds() - timeValue));
            }            

            return currentTime;
        }


        const sortByDate = (a: { time: string }, b: { time: string }) => {
            const dateA = parseRelativeTime(a.time);
            const dateB = parseRelativeTime(b.time);
            return compareAsc(dateB, dateA); // Sort latest first
        };
        
        genericNews.sort(sortByDate);
        //trendingNews.sort(sortByDate);
        //industryNews.sort(sortByDate);


        //const sortedCompanyNews = companyNews.sort((a, b) => new Date(b.time) - new Date(a.time));
        //const sortedTrendingNews = trendingNews.sort((a, b) => new Date(b.time) - new Date(a.time));
        //const sortedIndustryNews = industryNews.sort((a, b) => new Date(b.time) - new Date(a.time));
        const sortedGenericNews = genericNews.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Combine them into an object to return both categories
        /*
        return {
            companyNews: sortedCompanyNews,
            trendingNews: sortedTrendingNews,
            industryNews: sortedIndustryNews
        };
        */

        return sortedGenericNews

    }

    async buildCompetitorsFromSearchedList(data: any[]): Promise<Competitor[]> {

        console.log(" in buildCompetitorsFromSearchedList data is ", data)
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



    async getCompanyHubDetails(companyTicker: string, exchange: string, companyUser: any) : Promise<HubData> {

        const serpApi = new SerpApi()
        const earningsApi = new EarningsApi()

        const companyDetails = await serpApi.getCompanyDataViaFinancialModeling(companyTicker)

        console.log("companyDetails ", companyDetails.data)

        const interestTickers = companyUser.interestTickers
        const companyIndustry = companyUser.companyIndustry

        console.log("companyIndustry befoore building news is ", companyIndustry)


        const competitors = await serpApi.getCompanyCompetitorDataViaFinancialModeling(interestTickers)

        console.log("competitors are ", competitors.data);

        const compNews = await serpApi.getCompanyCompetitorNewsViaFinancialModeling(interestTickers)
        console.log("compNews are ", compNews.data);

        const trendNews = await serpApi.getTrendingNews()
        console.log("trendNews are ", trendNews.data);

        const indNews = await serpApi.getCompanyIndustryNews(companyIndustry)
        console.log("indNews are ", indNews.data);


        // Build competitors from the given data
        const companyNews = await this.buildNews(compNews.data);
        const trendingNews = await this.buildNews(trendNews.data);
        const industryNews = await this.buildNews(indNews.data);

        const earnings = await earningsApi.getEarningsForInterestsTickers(interestTickers)

        const hubData = {
            company: companyDetails.data,
            competitors: competitors.data,
            earningsCalendar: earnings.data,
            companyNews: companyNews,
            trendingNews: trendingNews,
            industryNews: industryNews,
        }

        return hubData;
    }


}


