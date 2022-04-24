import * as express from 'express';
import {ICreateRequest} from "../interfaces/ICreateRequest";
import {CardDeckService} from "../services/cardDeck.service";
import {IOpenRequest} from "../interfaces/IOpenRequest";
import {IDrawRequest} from "../interfaces/IDrawRequest";

class MainController {
    public path = '/';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(
            this.path + 'create',
            this.createDeck
        );

        this.router.post(
            this.path + 'open',
            this.openDeck
        );

        this.router.post(
            this.path + 'draw',
            this.drawCard
        );
    }

    createDeck = async (request: express.Request, response: express.Response) => {
        const body: ICreateRequest = {
            type: request.body.type?.toLowerCase() ?? "full",
            shuffled: request.body.shuffled?.toLowerCase() === 'true' ?? false,
        };

        const cardDeckService: CardDeckService = new CardDeckService();
        cardDeckService.init(body.type, body.shuffled);

        try {
            const cardDeck = await cardDeckService.generateNew();
            response.status(201).send(cardDeck);
        } catch (error) {
            response.status(400).send(error);
        }
    };

    openDeck = async (request: express.Request, response: express.Response) => {
        const body: IOpenRequest = {
            deckId: request.body.deckId,
        };

        if (!body.deckId?.length) {
            response.status(404).send({error: "deckId missing!"});
            return;
        }

        try {
            const cardDeckService: CardDeckService = new CardDeckService();
            const cardDeck = await cardDeckService.openDeck(body.deckId);

            response.status(200).send(cardDeck);
        } catch (error) {
            response.status(400).send({error: error.message});
        }
    };

    drawCard = async (request: express.Request, response: express.Response) => {
        const body: IDrawRequest = {
            deckId: request.body.deckId,
            count: request.body.count ?? 1,
        };

        try {
            const cardDeckService: CardDeckService = new CardDeckService();
            const cards = await cardDeckService.drawCard(body.deckId, body.count);
            response.status(200).send({cards});
        } catch (error) {
            response.status(400).send({msg: error.message});
        }
    };
}

export default MainController;
