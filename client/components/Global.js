import { reactive } from 'vue'

export const urls = {
    local: {
        client: 'http://localhost:3000',
        api: 'http://localhost:3001'
    },
    heroku: {
        client: 'https://darnoman.herokuapp.com',
        api: 'https://darnoman-website-api.herokuapp.com'
    }
}

export const currentUrl = urls.local


export const testCardList = ["fd47f1f1-9471-4472-94a8-338c5ba4746f", "2277575e-7ec5-4dc5-9b28-a005f74a73e2"]
export const apiKey = "80f01f7f-d3fa-4093-bc90-6473e93abde7"
export const cardCssUrl = currentUrl.client + "/card.css"