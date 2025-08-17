import { MetadataRoute } from "next"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return [
		{
			url: `${baseUrl}/`,
			lastModified: new Date().toISOString(),
		},
		{
			url: `${baseUrl}/predict`,
			lastModified: new Date().toISOString(),
		},
		{
			url: `${baseUrl}/dashboard?tab=chatbot`,
			lastModified: new Date().toISOString(),
		},
		{
			url: `${baseUrl}/dashboard?tab=history`,
			lastModified: new Date().toISOString(),
		},
	];
}