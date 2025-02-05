import BaseApi from "./_baseApi";
import { LoginDto } from "@/dto/login.dto";
import { VerifyUserDto } from "@/dto/verifyUser.dto";
import SerpApi from "./serp.api";
import { Company, Competitor } from "../types";
import moment from 'moment';
import { compareAsc } from "date-fns";


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
  
    async buildNews(newsData: any, companyName: string) {
        console.log("newsData is ", newsData);

        let companyNews: { source: any; time: any; link: any; title: any; image: any; }[] = [];
        let trendingNews: { source: any; time: any; link: any; title: any; image: any; }[] = [];
    
        const normalizedCompanyName = companyName.toLowerCase();
        // Create a regex that matches the company name as a whole word (case-insensitive)
        const companyRegex = new RegExp(`\\b${this.escapeRegExp(normalizedCompanyName)}\\b`, 'i');

        // Example logic for separating into categories (can be customized as needed)
        newsData.forEach(news => {
            if (news.items && Array.isArray(news.items)) {  // Ensure items exists and is an array
                news.items.forEach(item => {
                    const newsItem = {
                        source: item.source,
                        time: item.date,
                        title: item.snippet,
                        link: item.link,
                        image: item.thumbnail || 'default-image-url.png', // Fallback for images
                    };

                    if (item.snippet) {

                        const normalizedSnippet = item.snippet.toLowerCase()

                        // Use regex to test for the company name as a whole word
                        if (companyRegex.test(normalizedSnippet)) {
                            companyNews.push(newsItem);
                        } else {
                            trendingNews.push(newsItem);
                        }
                      }
                });
            } else {
                console.warn('No items found in news data', news); // Log warning if no items
            }
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
        
        companyNews.sort(sortByDate);
        trendingNews.sort(sortByDate);

        // Combine them into an object to return both categories
        return {
            companyNews: companyNews,
            trendingNews: trendingNews
        };

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

    async getCompanyHubDetails(companyTicker: string, exchange: string) {

        const queryString = `ticker=${companyTicker}&exchange=${exchange}`;

        const companyDetails = await SerpApi.get(
            `${this.baseUrl}getAllCompanyDataForTicker?${queryString}`,
        );

        console.log("In Hub companyDetails ", companyDetails)


        // Build competitors from the given data
        const competitors = await this.buildCompetitorsFromSearchedList([companyDetails.data.companyDiscoverMore[0].items]);

        console.log("competitors are ", competitors);

        // Build competitors from the given data
        const news = await this.buildNews(companyDetails.data.newsResults, companyDetails.data.companySummary.title);
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
            companyNews: news.companyNews,
            trendingNews: news.trendingNews,
        }

        return hubData;
    }


}


