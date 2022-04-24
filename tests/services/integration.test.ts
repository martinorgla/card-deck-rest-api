import * as http from "http";
import * as QueryString from "querystring";
import {ICard} from "../../src/interfaces/ICard";
import {ICardDeck} from "../../src/interfaces/ICardDeck";

async function createDeck() {
    return new Promise((resolve) => {
        const postData = QueryString.stringify({
            type: "full",
            shuffled: false,
        });

        let options = {
            method: "POST",
            host: "card-deck-rest-api",
            port: "3210",
            path: "/create",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const createRequest = http.request(options, (response) => {
            let str = '';

            response.on('data', (chunk) => {
                str += chunk;
            });

            response.on('end', () => {
                const result: ICardDeck = JSON.parse(str);

                expect(response.statusCode).toBe(201);
                expect(result.deckId).toHaveLength(36);
                expect(result.type).toBe("FULL");
                expect(result.shuffled).toBe(false);
                expect(result.remaining).toBe(52);

                resolve(result.deckId);
            });
        });

        createRequest.write(postData);
        createRequest.end();
    });
}

async function openDeck(deckId: string) {
    return new Promise((resolve) => {
        const postData = QueryString.stringify({deckId});

        let options = {
            method: "POST",
            host: "card-deck-rest-api",
            port: "3210",
            path: "/open",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const createRequest = http.request(options, (response) => {
            let str = '';

            response.on('data', (chunk) => {
                str += chunk;
            });

            response.on('end', () => {
                const result: ICardDeck = JSON.parse(str);

                expect(response.statusCode).toBe(200);
                expect(result.deckId).toBe(deckId);
                expect(result.cards).toHaveLength(52);

                resolve(result.deckId);
            });
        });

        createRequest.write(postData);
        createRequest.end();
    });
}

function drawCard(deckId: string, count: number = 1): void {
    const postData = QueryString.stringify({deckId, count});

    let options = {
        method: "POST",
        host: "card-deck-rest-api",
        port: "3210",
        path: "/draw",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const createRequest = http.request(options, (response) => {
        let str = '';

        response.on('data', (chunk) => {
            str += chunk;
        });

        response.on('end', () => {
            const result: ICard[] = JSON.parse(str)?.cards;

            expect(response.statusCode).toBe(200);
            expect(result.length).toBe(2);
            expect(result[1].value).toBe("3S");
            expect(result[1].code).toBe(3);
            expect(result[1].suit).toBe("SPADES");
        });
    });

    createRequest.write(postData);
    createRequest.end();
}

describe('test application endpoints', () => {
    test('create new deck', () => {
        createDeck();
    });

    test('open deck', async () => {
        const createdDeckId: string = await createDeck() as string;
        const openedDeckId = await openDeck(createdDeckId);

        expect(createdDeckId).toBe(openedDeckId);
    });

    test('draw card', async () => {
        const createdDeckId = await createDeck() as string;
        const openedDeckId = await openDeck(createdDeckId) as string;

        expect(createdDeckId).toBe(openedDeckId);

        drawCard(openedDeckId, 2);
    });
});
