import { env } from '#features/server/env'
import { google } from 'googleapis'

export async function getAccessToken() {
	try {
		const serviceAccountKey = env.GOOGLE_CREDENTIALS

		// Create a JWT client using the Service Account Key
		const jwtClient = new google.auth.JWT(
			env.TEST_EMAIL,
			null,
			serviceAccountKey.private_key,
			['https://www.googleapis.com/auth/...'], // Scopes required for your application
		)

		// Obtain an access token
		const tokenResponse = await jwtClient.getAccessToken()

		// Print the access token
		console.log('Access Token:', tokenResponse.token)
	} catch (error) {
		console.error('Failed to obtain access token:', error)
	}
}
